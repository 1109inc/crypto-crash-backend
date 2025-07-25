// server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');             // <-- NEW
const { Server } = require('socket.io');  // <-- NEW

dotenv.config();

const app = express();
const server = http.createServer(app);   // <-- Use HTTP server for Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all for testing; restrict in production
    methods: ['GET', 'POST'],
  }
});

// Middleware
app.use(cors());
app.use(express.json());

const walletRoutes = require('./routes/wallet');
app.use('/wallet', walletRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.send('🚀 Crypto Crash Backend is running with WebSockets');
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log('🟢 New client connected:', socket.id);

  socket.on('cashout', (data) => {
    console.log('💸 Cashout received from:', data.playerId);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
const { startGameEngine } = require('./utils/gameEngine');
startGameEngine(io);
