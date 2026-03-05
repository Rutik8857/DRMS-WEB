const db = require("../db");

// 🔵 SEND APPOINTMENT REQUEST
exports.sendRequest = async (req, res) => {
  try {
    const { doctorId, patientName, patientEmail } = req.body;

    if (!doctorId || !patientEmail) {
      return res.status(400).json({ message: "doctorId and patientEmail required" });
    }

    // 🔥 Find patient from users table
    const [users] = await db.query(
      "SELECT id FROM users WHERE email=? AND role='patient'",
      [patientEmail]
    );

    if (users.length === 0) {
      return res.status(400).json({ message: "Patient not registered" });
    }

    const patientId = users[0].id;

    // 🔥 Insert with patientId
    const sql = `
      INSERT INTO appointments (doctorId, patientId, patientName, patientEmail)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(sql, [doctorId, patientId, patientName, patientEmail]);

    res.json({ message: "Appointment request sent" });

  } catch (err) {
    console.error("SendRequest Error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// 🔵 GET ALL REQUESTS
exports.getAllRequests = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT a.*, d.fullName AS doctorName
      FROM appointments a
      JOIN doctors d ON a.doctorId = d.id
      ORDER BY a.id DESC
    `);

    res.json(rows || []);
  } catch (err) {
    console.error("GetAllRequests Error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// 🔵 GET REQUESTS BY DOCTOR
exports.getDoctorRequests = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ error: "doctorId is required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM appointments WHERE doctorId = ? ORDER BY id DESC",
      [doctorId]
    );

    res.json(rows || []);
  } catch (err) {
    console.error("GetDoctorRequests Error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// 🔵 UPDATE STATUS (accept/reject)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: "id and status are required" });
    }

    await db.query(
      "UPDATE appointments SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ message: "Status updated" });
  } catch (err) {
    console.error("UpdateStatus Error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};

// 🔵 GET MY APPOINTMENTS
exports.getMyAppointments = async (req, res) => {
  try {
    if (req.user?.role !== "doctor") {
      return res.status(403).json({ error: "Not doctor" });
    }

    const doctorId = req.user?.doctorId;

    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID not found in token" });
    }

    const [rows] = await db.query(
      "SELECT * FROM appointments WHERE doctorId=? ORDER BY id DESC",
      [doctorId]
    );

    res.json(rows || []);
  } catch (err) {
    console.error("GetMyAppointments Error:", err);
    res.status(500).json({ error: "Server error", message: err.message });
  }
};