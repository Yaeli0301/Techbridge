const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const messagingController = require('../controllers/messagingController');

router.post('/send', protect, messagingController.sendMessage);
router.get('/', protect, messagingController.getMessages);

module.exports = router;
