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
    resetCode: {
        type: String,
    },
    resetCodeExpiration: {
        type: Date
    },
    mobile: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
