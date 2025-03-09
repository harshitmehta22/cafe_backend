const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/index.js');
const authRoutes = require('./routes/authRoutes.js');
const mainRoutes = require('./routes/mainRoutes.js')

// Load environment variables
dotenv.config();
// Connect to MongoDB
connectDB();
const app = express();
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
// API Routes

app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
