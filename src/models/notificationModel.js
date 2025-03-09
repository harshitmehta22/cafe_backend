const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        message: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the user who triggered the notification
        type: { type: String, enum: ['user-signup'], default: 'user-signup' },
        isRead: { type: Boolean, default: false }, // To track if the notification is read
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt
);

module.exports = mongoose.model('Notification', notificationSchema);