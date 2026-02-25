const db = require("../db");

// 🔹 GET MY SCHEDULE
// In scheduleController.js
exports.getMySchedule = async (req, res) => {
  try {
    // Add a log to see if the request even hits the controller
    console.log("Fetching schedule for doctor:", req.user?.doctorId); 

    const [rows] = await db.query(
      "SELECT * FROM doctor_schedules WHERE doctorId=? AND isActive=1",
      [req.user.doctorId]
    );
    return res.status(200).json(rows); // Explicitly send 200 and JSON
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🔹 ADD SLOT
exports.addSlot = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;
    const { day, startTime, endTime, slotDuration } = req.body;

    if (!day || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing fields" });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ error: "Invalid time range" });
    }

    await db.query(
      `INSERT INTO doctor_schedules 
      (doctorId, day, startTime, endTime, slotDuration)
      VALUES (?, ?, ?, ?, ?)`,
      [doctorId, day, startTime, endTime, slotDuration || 30]
    );

    res.json({ message: "Slot added successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};


// 🔹 UPDATE SLOT
exports.updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime } = req.body;

    await db.query(
      `UPDATE doctor_schedules 
       SET day=?, startTime=?, endTime=? 
       WHERE id=?`,
      [day, startTime, endTime, id]
    );

    res.json({ message: "Slot updated" });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


// 🔹 DELETE SLOT (Soft Delete)
exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "UPDATE doctor_schedules SET isActive=0 WHERE id=?",
      [id]
    );

    res.json({ message: "Slot deleted" });

  } catch {
    res.status(500).json({ error: "Server error" });
  }
};