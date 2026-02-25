const db = require("../db");

// 🔹 SAVE MESSAGE
exports.saveMessage = async (req, res) => {
  try {
    const { roomId, sender, message } = req.body;

    if (!roomId || !sender || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.query(
      "INSERT INTO messages (roomId, sender, message) VALUES (?, ?, ?)",
      [roomId, sender, message]
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Save Message Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔹 GET MESSAGES
exports.getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Ordered by id ASC to show conversation from start to finish
    const [rows] = await db.query(
      "SELECT * FROM messages WHERE roomId=? ORDER BY id ASC",
      [roomId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Get Messages Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};