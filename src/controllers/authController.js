const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../models/authModel');
const notificationModel = require('../models/notificationModel');

const signUp = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        // Validate input
        if (!username || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const emailRegex = /.+@.+\..+/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Save new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'Admin',
        });
        await newUser.save();
        // Create a notification for the admin
        const notification = new notificationModel({
            message: `New user signed up: ${newUser.username} (${newUser.email})`,
            user: newUser._id,
            type: 'user-signup',
        });
        await notification.save();

        res.status(201).json({
            message: 'User registered successfully and notification sent to admin.',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Validate email and password
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        // Check if user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Generate a JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET, // Ensure this is defined in your .env file
            { expiresIn: '1h' } // Token expiration time
        );
        // Return success response with the token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
}


const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        // Validate email
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate a random verification code
        const verificationCode = crypto.randomBytes(4).toString('hex').toUpperCase(); // 8-character code
        // Save the code and expiration time in the database
        user.resetPasswordToken = verificationCode;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Code valid for 15 minutes
        await user.save();
        // Set up email transport
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Use your email provider
            auth: {
                user: process.env.EMAIL_USER, // Your email address
                pass: process.env.EMAIL_PASS, // Your email password or app-specific password
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${verificationCode}`,
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Respond with success
        res.status(200).json({
            message: 'Verification code sent to your email. Please check your inbox.',
        });
    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ message: 'An error occurred. Please try again later.' });
    }
}

const resetPassword = async (req, res) => {
    const { email, resetCode, newPassword } = req.body;
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetcomcode = resetCode;
        // Check if reset code exists and is not expired
        if (!resetcomcode || resetcomcode !== resetCode) {
            console.log('Invalid reset code:', { expected: user.resetCode, received: resetCode });
            return res.status(400).json({ message: 'Invalid reset code' });
        }
        if (user.resetCodeExpiration < Date.now()) {
            return res.status(400).json({ message: 'Reset code expired' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update the user's password and invalidate the reset code
        user.password = hashedPassword;
        user.resetCode = resetCode; // Invalidate the reset code
        user.resetCodeExpiration = undefined; // Remove expiration
        await user.save();
        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = { signUp, login, forgotPassword, resetPassword };
