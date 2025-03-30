const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/index.js');
const authRoutes = require('./routes/authRoutes.js');
const mainRoutes = require('./routes/mainRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');

// Load environment variables
dotenv.config();
// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Express's built-in JSON body parser

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);
app.use('/api', employeeRoutes);

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
