const express = require('express');
const { isValidToken } = require('../middlewares/auth');
const { sendMessage, allMessages } = require('../controllers/messageController');
const router = express.Router();

router.route('/').post(isValidToken, sendMessage);
router.route('/:chatId').get(isValidToken, allMessages);

module.exports = router;