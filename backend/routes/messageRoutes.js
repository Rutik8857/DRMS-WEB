const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth.middleware");
const messageController = require("../controllers/messageController");

// protected endpoints - user must be authenticated
router.get("/:roomId", verifyToken, messageController.getMessages);
router.post("/send", verifyToken, messageController.saveMessage);

module.exports = router;