const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    resetCode: {
        type: String,
    }, // Store the reset code
    resetCodeExpiration: {
        type: Date
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
