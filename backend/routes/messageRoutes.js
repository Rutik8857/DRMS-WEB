const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");

// GET messages by room
router.get("/:roomId", messageController.getMessages);

// POST new message
router.post("/send", messageController.saveMessage);

module.exports = router;