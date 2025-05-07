const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const socketIO = require('socket.io');
const connectDB = require('./config/index.js');
const authRoutes = require('./routes/authRoutes.js');
const mainRoutes = require('./routes/mainRoutes.js');
const employeeRoutes = require('./routes/employeeRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');

dotenv.config();
connectDB();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json()); // Express's built-in JSON body parser
const path = require('path');
// Create HTTP server and set up Socket.IO
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});
io.on("connection", (socket) => {
  console.log("⚡ New client connected:", socket.id);

  socket.on("sendNotification", (data) => {
    console.log("🔔 Notification received:", data);
    io.emit("receiveNotification", data); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);
app.use('/api', employeeRoutes);
app.use('/api', notificationRoutes);
app.use('/uploads', express.static('uploads'));
// Starting the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server with Socket.IO running on http://localhost:${PORT}`);
});
