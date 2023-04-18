const express = require('express');
const router = express.Router();
const { registerUser, authUser } = require('../controllers/userController');

router.route('/').post(registerUser);
router.route('/', authUser);

module.exports = router;