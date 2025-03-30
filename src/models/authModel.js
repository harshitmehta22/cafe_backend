const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true,
    },
    lastname: {
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
    role: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
