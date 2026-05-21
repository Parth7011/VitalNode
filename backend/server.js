const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const treatmentRoutes = require('./routes/treatmentRoutes');

// Import Middlewares
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/treatments', treatmentRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ message: 'VitalNode API is running...' });
});

// ── SPA Fallback ─────────────────────────────────────────────────────────────
// In production, serve the Vite build and fall back to index.html for
// any non-API route so that client-side routing (React Router) works on refresh.
if (process.env.NODE_ENV === 'production') {
  const frontendBuild = path.join(__dirname, '..', 'vitalnode', 'dist');
  app.use(express.static(frontendBuild));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// Error Handling Middleware (must be after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Join a private consultation room (keyed by appointment ID)
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`[Socket] ${socket.id} joined room: ${roomId}`);
  });

  // Relay a chat message to everyone else in the same room
  socket.on('sendMessage', ({ roomId, text, sender, senderName, timestamp }) => {
    console.log(`[Socket] Message in room ${roomId} from ${senderName}: ${text}`);
    // Broadcast to ALL clients in the room (including sender, so both sides update)
    io.to(roomId).emit('receiveMessage', { text, sender, senderName, timestamp });
  });

  // ── WebRTC Signaling Relay ──────────────────────────────────────────────────
  // These events relay SDP offers/answers and ICE candidates between peers.
  // socket.to(roomId) sends to everyone ELSE in the room (not back to sender).

  socket.on('webrtc-ready', ({ roomId }) => {
    console.log(`[WebRTC] Ready signal relayed in room ${roomId}`);
    socket.to(roomId).emit('webrtc-ready');
  });

  socket.on('webrtc-offer', ({ roomId, sdp }) => {
    console.log(`[WebRTC] Offer relayed in room ${roomId}`);
    socket.to(roomId).emit('webrtc-offer', { sdp });
  });

  socket.on('webrtc-answer', ({ roomId, sdp }) => {
    console.log(`[WebRTC] Answer relayed in room ${roomId}`);
    socket.to(roomId).emit('webrtc-answer', { sdp });
  });

  socket.on('webrtc-ice-candidate', ({ roomId, candidate }) => {
    console.log(`[WebRTC] ICE candidate relayed in room ${roomId}`);
    socket.to(roomId).emit('webrtc-ice-candidate', { candidate });
  });

  socket.on('webrtc-hangup', ({ roomId }) => {
    console.log(`[WebRTC] Hangup signal relayed in room ${roomId}`);
    socket.to(roomId).emit('webrtc-hangup');
  });

  socket.on('disconnecting', () => {
    console.log(`[Socket] Client disconnecting: ${socket.id}`);
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        // Do NOT send webrtc-hangup, because a page refresh would end the session
        socket.to(room).emit('webrtc-peer-disconnected');
      }
    });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Make io accessible in controllers
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
