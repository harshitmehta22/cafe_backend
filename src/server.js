const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/index.js');
const authRoutes = require('./routes/authRoutes.js');
const mainRoutes = require('./routes/mainRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');

dotenv.config();
connectDB();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Your React frontend
  credentials: true
}));
app.use(express.json()); // Express's built-in JSON body parser
const path = require('path');
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);
app.use('/api', employeeRoutes);
app.use('/uploads', express.static('uploads'));
// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
