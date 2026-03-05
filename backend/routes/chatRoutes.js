// routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const chatController = require('../controllers/chatController');

// AI chat
router.post('/', verifyToken, chatController.chatWithAI);
router.get('/history', verifyToken, chatController.getAIHistory);

// get list of chats for logged-in user
router.get('/my', verifyToken, chatController.getUserChats);

module.exports = router;