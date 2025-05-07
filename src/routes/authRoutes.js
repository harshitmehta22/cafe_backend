const express = require('express');
const { signUp, login, forgotPassword, resetPassword, getUsers, deleteUser } = require('../controllers/authController');

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword', resetPassword);
router.get('/users', getUsers); // New API route
router.delete('/deleteuser/:id', deleteUser)

module.exports = router;
