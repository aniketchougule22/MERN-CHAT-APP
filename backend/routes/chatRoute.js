const express = require('express');
const router = express.Router();
const { isValidToken } = require('../middlewares/auth');
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require('../controllers/chatController');

router.route('/').post(isValidToken, accessChat);
router.route('/').get(isValidToken, fetchChats);
router.route('/group').post(isValidToken, createGroupChat);
router.route('/rename').put(isValidToken, renameGroup);
router.route('/groupadd').put(isValidToken, addToGroup);
router.route('/removegroup').put(isValidToken, removeFromGroup);

module.exports = router;