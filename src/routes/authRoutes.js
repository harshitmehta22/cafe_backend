const express = require('express');
const { signUp, login, forgotPassword, resetPassword, getUsers } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword', resetPassword);
router.get('/users', getUsers); // New API route

module.exports = router;
