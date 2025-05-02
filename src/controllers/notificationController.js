const Notification = require('../models/notificationModel');

const getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required.' });
  }

  try {
    const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found for this user.' });
    }

    res.status(200).json({
      message: 'Notifications fetched successfully.',
      notifications,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ message: 'Server error. Unable to fetch notifications.' });
  }
};

module.exports = { getUserNotifications };
