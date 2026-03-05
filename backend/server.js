// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');


// console.log("🔥 REAL BACKEND STARTED 🔥");

// // Global error handlers
// process.on('unhandledRejection', (reason, promise) => {
//   console.error('❌ Unhandled Rejection:', reason);
// });

// process.on('uncaughtException', (error) => {
//   console.error('❌ Uncaught Exception:', error);
// });

// const app = express();
// const PORT = process.env.PORT || 5000;

// app.get("/check-backend", (req, res) => {
//   res.json({ backend: "REAL BACKEND WORKING" });
// });
// // Middleware
// app.use(cors({
//   origin: 'http://localhost:3000',
//   credentials: true
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Safely require routes
// let routes = {};

// try {
//   routes.doctor = require('./routes/doctor.routes');
// } catch (e) {
//   console.warn('⚠️  doctor.routes:', e.message);
// }

// try {
//   routes.apiDoctor = require('./routes/doctorRoutes');
// } catch (e) {
//   console.warn('⚠️  doctorRoutes:', e.message);
// }

// try {
//   routes.auth = require('./routes/authRoutes');
// } catch (e) {
//   console.warn('⚠️  authRoutes:', e.message);
// }

// try {
//   routes.appointment = require('./routes/appointmentRoutes');
// } catch (e) {
//   console.warn('⚠️  appointmentRoutes:', e.message);
// }

// try {
//   routes.schedule = require('./routes/scheduleRoutes');
// } catch (e) {
//   console.warn('⚠️  scheduleRoutes:', e.message);
// }

// try {
//   routes.admin = require('./routes/admin.routes');
// } catch (e) {
//   console.warn('⚠️  admin.routes:', e.message);
// }

// try {
//   routes.patient = require('./routes/patient.routes');
// } catch (e) {
//   console.warn('⚠️  patient.routes:', e.message);
// }

// // Mount Routes
// if (routes.doctor) app.use('/doctor', routes.doctor);
// if (routes.apiDoctor) app.use('/api/doctors', routes.apiDoctor);
// if (routes.auth) app.use('/api/auth', routes.auth);
// if (routes.appointment) app.use('/api/appointments', routes.appointment);
// if (routes.schedule) app.use('/api/schedule', routes.schedule);
// if (routes.admin) app.use('/admin', routes.admin);
// if (routes.patient) app.use('/patient', routes.patient);

// // Health Check
// app.get('/', (req, res) => {
//   res.send('API is running...');
// });

// // 404 Handler
// app.use((req, res) => {
//   res.status(404).json({ message: `Cannot ${req.method} ${req.originalUrl}` });
// });

// // Error middleware
// app.use((err, req, res, next) => {
//   console.error('Error:', err);
//   res.status(500).json({ message: 'Internal server error' });
// });

// // Start server
// const server = app.listen(PORT, () => {
//   console.log(`✅ Server running on http://localhost:${PORT}`);
// });

// // Socket timeouts
// server.keepAliveTimeout = 65000;
// server.headersTimeout = 66000;

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('Shutting down gracefully...');
//   server.close(() => {
//     console.log('Server closed');
//     process.exit(0);
//   });
// });



require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  }
});

const jwt = require('jsonwebtoken');
const PORT = process.env.PORT || 5000;

console.log("🔥 REAL BACKEND STARTED 🔥");

// Global error handlers
process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// initialize database schema (must run before routes)
const { initialize } = require("./db/init");

// run migrations asynchronously
initialize();

// ================= ROUTES =================

const doctorDashboardRoutes = require("./routes/doctor.routes");
const doctorCrudRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const adminRoutes = require("./routes/admin.routes");
const patientRoutes = require("./routes/patient.routes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Mount Routes

app.use("/doctor", doctorDashboardRoutes);          // dashboard
app.use("/api/doctors", doctorCrudRoutes);         // CRUD
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/chat", chatRoutes);
// also mount with plural prefix for compatibility with frontend
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/admins", adminRoutes);
app.use("/patient", patientRoutes);

app.use("/api/admins", adminRoutes);


// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    message: "Internal server error",
  });
});

// ================= SOCKET.IO CONFIGURATION =================

// middleware to authenticate socket connections
io.use((socket, next) => {
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;
  if (!token) return next(new Error('Authentication error'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    socket.user = decoded; // { id, role, doctorId }
    return next();
  } catch (err) {
    return next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  // room join
  socket.on('joinRoom', (roomId) => {
    // validate that the user belongs to this room
    const parts = roomId.split('_');
    if (parts.length !== 3) return;
    const idA = parseInt(parts[1]);
    const idB = parseInt(parts[2]);
    const user = socket.user;
    if (!user) return;
    // determine if one of the ids matches user
    if (user.role === 'doctor' && user.doctorId && [idA, idB].includes(user.doctorId)) {
      socket.join(roomId);
    } else if (user.role === 'patient' && user.id && [idA, idB].includes(user.id)) {
      socket.join(roomId);
    } else {
      // unauthorized attempt to join another room
    }
  });

  socket.on('sendMessage', (data) => {
    // broadcast to everyone in room
    if (data?.roomId) {
      io.to(data.roomId).emit('receiveMessage', data);
    }
  });
});

// Start server (http) so socket.io works
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});