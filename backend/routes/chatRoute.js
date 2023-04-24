const express = require('express');
const router = express.Router();
const { isValidToken } = require('../middlewares/auth');
const { accessChat, fetchChats } = require('../controllers/chatController');

router.route('/').post(isValidToken, accessChat);
router.route('/').get(isValidToken, fetchChats);
// router.route('/group').post(isValidToken, createGroupChat);
// router.route('/rename').put(isValidToken, renameGroup);
// router.route('/removegroup').put(isValidToken, removeFromGroup);
// router.route('/groupadd').put(isValidToken, addToGroup);

module.exports = router;