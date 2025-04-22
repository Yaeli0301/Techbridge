const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { sendMessage, getMessages } = require('../controllers/messagingController');

router.post('/send', protect, sendMessage);
router.get('/', protect, getMessages);

module.exports = router;
