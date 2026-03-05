// legacy wrapper - forwards to chatController which handles new schema/authorization
const chatController = require('../controllers/chatController');

exports.saveMessage = (req, res) => chatController.sendMessage(req, res);
exports.getMessages = (req, res) => chatController.getMessages(req, res);
