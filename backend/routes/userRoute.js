const express = require('express');
const router = express.Router();
const { registerUser, authUser, getAllUsers } = require('../controllers/userController');
const { isValidToken } = require('../middlewares/auth');

router.route('/signup').post(registerUser);

router.route('/login').post(authUser);

router.route('/').get(isValidToken, getAllUsers);

module.exports = router;