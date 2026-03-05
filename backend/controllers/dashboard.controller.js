const db = require("../db");

exports.getDashboardSummary = async (req, res) => {
  try {
    // Defensive check - verify doctor role
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied: doctor role required' });
    }

    const { doctorId } = req.user;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID not found in token" });
    }

    // 1. Today's Appointments
    let todayAppointments = 0;
    try {
      const [today] = await db.query(
        "SELECT COUNT(*) as count FROM appointments WHERE doctorId=? AND DATE(created_at) = CURDATE()",
        [doctorId]
      );
      todayAppointments = today?.[0]?.count || 0;
    } catch (e) {
      console.warn('Today appointments query failed:', e.message);
    }

    // 2. Total Patients (Unique emails)
    let totalPatients = 0;
    try {
      const [patients] = await db.query(
        "SELECT COUNT(DISTINCT patientEmail) as count FROM appointments WHERE doctorId=?",
        [doctorId]
      );
      totalPatients = patients?.[0]?.count || 0;
    } catch (e) {
      console.warn('Total patients query failed:', e.message);
    }

    // 3. Pending Requests
    let pendingRequests = 0;
    try {
      const [pending] = await db.query(
        "SELECT COUNT(*) as count FROM appointments WHERE doctorId=? AND status='pending'",
        [doctorId]
      );
      pendingRequests = pending?.[0]?.count || 0;
    } catch (e) {
      console.warn('Pending requests query failed:', e.message);
    }

    // 4. Total Earnings (Mock calculation: Completed * 500)
    let totalEarnings = 0;
    try {
      const [completed] = await db.query(
        "SELECT COUNT(*) as count FROM appointments WHERE doctorId=? AND status='completed'",
        [doctorId]
      );
      const completedCount = completed?.[0]?.count || 0;
      totalEarnings = completedCount * 500;
    } catch (e) {
      console.warn('Total earnings query failed:', e.message);
    }

    res.status(200).json({
      todayAppointments,
      totalPatients,
      pendingRequests,
      totalEarnings
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ message: "Server error fetching dashboard summary" });
  }
};

exports.getDashboardAnalytics = async (req, res) => {
  try {
    // Defensive check - verify doctor role
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied: doctor role required' });
    }

    const { doctorId } = req.user;

    if (!doctorId) {
      return res.status(400).json({ message: "Doctor ID not found in token" });
    }

    // Get last 7 days data from DB
    let rows = [];
    try {
      const [queryRows] = await db.query(`
        SELECT DATE_FORMAT(created_at, '%a') as name, COUNT(*) as appointments 
        FROM appointments 
        WHERE doctorId=? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
        GROUP BY DATE(created_at), name
        ORDER BY DATE(created_at) ASC
      `, [doctorId]);
      rows = Array.isArray(queryRows) ? queryRows : [];
    } catch (e) {
      console.warn('Analytics query failed:', e.message);
      rows = [];
    }

    const data = rows.map(row => ({
      name: row?.name || 'Unknown',
      appointments: row?.appointments || 0,
      visits: Math.floor((row?.appointments || 0) * 0.8)
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error("Dashboard Analytics Error:", error);
    res.status(500).json({ message: "Server error fetching analytics" });
  }
};