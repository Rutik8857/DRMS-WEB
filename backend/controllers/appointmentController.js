const db = require("../db");

// 🔵 SEND APPOINTMENT REQUEST
exports.sendRequest = async (req, res) => {
  try {
    const { doctorId, patientName, patientEmail } = req.body;

    const sql = `
      INSERT INTO appointments (doctorId, patientName, patientEmail)
      VALUES (?, ?, ?)
    `;

    await db.query(sql, [doctorId, patientName, patientEmail]);

    res.json({ message: "Appointment request sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
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

    res.json(rows);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

// 🔵 GET REQUESTS BY DOCTOR
exports.getDoctorRequests = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM appointments WHERE doctorId = ? ORDER BY id DESC",
      [doctorId]
    );

    res.json(rows);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};

// 🔵 UPDATE STATUS (accept/reject)
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.query(
      "UPDATE appointments SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ message: "Status updated" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};


// GET requests by doctor
exports.getDoctorRequests = async (req, res) => {
  const { doctorId } = req.params;

  const [rows] = await db.query(
    "SELECT * FROM appointments WHERE doctorId=? ORDER BY id DESC",
    [doctorId]
  );

  res.json(rows);
};



exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  await db.query(
    "UPDATE appointments SET status=? WHERE id=?",
    [status, id]
  );

  res.json({ message: "updated" });
};
