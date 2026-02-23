const db = require("../db");

// Save message
exports.saveMessage = async (req, res) => {
  try {
    const { roomId, sender, message } = req.body;

    await db.query(
      "INSERT INTO messages (roomId, sender, message) VALUES (?, ?, ?)",
      [roomId, sender, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Get messages
exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const [rows] = await db.query(
      "SELECT * FROM messages WHERE roomId=? ORDER BY id ASC",
      [roomId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};