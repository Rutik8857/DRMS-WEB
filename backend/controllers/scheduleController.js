const db = require("../db");

// 🔹 GET MY SCHEDULE
exports.getMySchedule = async (req, res) => {
  try {
    const doctorId = req.user?.doctorId;

    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID not found in token" });
    }

    console.log("Fetching schedule for doctor:", doctorId);

    let rows = [];
    try {
      const [result] = await db.query(
        "SELECT * FROM doctor_schedules WHERE doctorId=? AND isActive=1",
        [doctorId]
      );
      rows = result || [];
    } catch (e) {
      console.warn('Schedule query failed:', e.message);
    }

    return res.status(200).json(rows);
  } catch (err) {
    console.error('GetMySchedule error:', err);
    return res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};

// 🔹 ADD SLOT
exports.addSlot = async (req, res) => {
  try {
    const doctorId = req.user?.doctorId;

    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID not found in token" });
    }

    const { day, startTime, endTime, slotDuration } = req.body;

    if (!day || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing fields: day, startTime, endTime" });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ error: "Invalid time range: startTime must be before endTime" });
    }

    await db.query(
      `INSERT INTO doctor_schedules 
      (doctorId, day, startTime, endTime, slotDuration)
      VALUES (?, ?, ?, ?, ?)`,
      [doctorId, day, startTime, endTime, slotDuration || 30]
    );

    res.json({ message: "Slot added successfully" });

  } catch (err) {
    console.error('AddSlot error:', err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};


// 🔹 UPDATE SLOT
exports.updateSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { day, startTime, endTime } = req.body;

    if (!id) {
      return res.status(400).json({ error: "Slot id is required" });
    }

    if (!day || !startTime || !endTime) {
      return res.status(400).json({ error: "Missing fields: day, startTime, endTime" });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ error: "Invalid time range" });
    }

    await db.query(
      `UPDATE doctor_schedules 
       SET day=?, startTime=?, endTime=? 
       WHERE id=?`,
      [day, startTime, endTime, id]
    );

    res.json({ message: "Slot updated" });

  } catch (err) {
    console.error('UpdateSlot error:', err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};


// 🔹 DELETE SLOT (Soft Delete)
exports.deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Slot id is required" });
    }

    await db.query(
      "UPDATE doctor_schedules SET isActive=0 WHERE id=?",
      [id]
    );

    res.json({ message: "Slot deleted" });

  } catch (err) {
    console.error('DeleteSlot error:', err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};