// controllers/dashboardController.js
const db = require('../db');

exports.getStats = async (req, res) => {
    try {
        let totalUsers = 0;
        let totalDoctors = 0;
        let totalReports = 0;
        let totalAppointments = 0;
        let recentReports = [];

        // Parallel queries for performance
        try {
          const [users] = await db.query('SELECT COUNT(*) as count FROM users');
          totalUsers = users?.[0]?.count || 0;
        } catch (e) {
          console.warn('Users count query failed:', e.message);
        }

        try {
          const [doctors] = await db.query('SELECT COUNT(*) as count FROM doctors');
          totalDoctors = doctors?.[0]?.count || 0;
        } catch (e) {
          console.warn('Doctors count query failed:', e.message);
        }

        try {
          const [reports] = await db.query('SELECT COUNT(*) as count FROM reports');
          totalReports = reports?.[0]?.count || 0;
        } catch (e) {
          console.warn('Reports count query failed:', e.message);
        }

        try {
          const [appointments] = await db.query('SELECT COUNT(*) as count FROM appointments');
          totalAppointments = appointments?.[0]?.count || 0;
        } catch (e) {
          console.warn('Appointments count query failed:', e.message);
        }

        // Get recent reports for the table
        try {
          const [reports] = await db.query('SELECT * FROM reports ORDER BY created_at DESC LIMIT 5');
          recentReports = Array.isArray(reports) ? reports : [];
        } catch (e) {
          console.warn('Recent reports query failed:', e.message);
          recentReports = [];
        }

        res.status(200).json({
            totalUsers,
            totalDoctors,
            totalReports,
            totalAppointments,
            recentReports
        });
    } catch (err) {
        console.error('Dashboard stats error:', err.message);
        res.status(500).json({ error: err.message });
    }
};