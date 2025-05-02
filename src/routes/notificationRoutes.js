const express = require('express');
const router = express.Router();
const { getUserNotifications } = require('../controllers/notificationController');

router.get('/notifications/:userId', getUserNotifications);

module.exports = router;