// // server.js
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// require('dotenv').config();

// const doctorRoutes = require('./routes/doctorRoutes');
// const dashboardRoutes = require('./routes/dashboardRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const authRoutes = require('./routes/authRoutes'); // New Auth Routes

// const app = express();
// const PORT = process.env.PORT || 5000;


// const reportRoutes = require("./routes/reportRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");


// // Middleware
// app.use(cors()); // Allows React to connect to this backend
// app.use(bodyParser.json());

// // Routes
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/auth', authRoutes); // Mount Auth Routes

// app.use("/api", reportRoutes);
// app.use("/api/doctors", doctorRoutes);
// app.use("/api/appointments", appointmentRoutes);

// // 📌 GET Doctors for Map (Mock Data for Demo)
// // app.get('/api/doctors-map', (req, res) => {
// //     // In real app, fetch from DB: SELECT * FROM doctors
// //     const doctors = [
// //         { id: 1, name: "Dr. Rahul Sharma", specialization: "Cardiologist", hospital: "City Heart Center", lat: 19.0760, lng: 72.8777 }, // Mumbai
// //         { id: 2, name: "Dr. Priya Patel", specialization: "Dermatologist", hospital: "Skin Care Clinic", lat: 19.0500, lng: 72.9000 }, // Chembur
// //         { id: 3, name: "Dr. Amit Singh", specialization: "Neurologist", hospital: "Brain Health Inst", lat: 19.1000, lng: 72.8500 }, // Andheri
// //         { id: 4, name: "Dr. Neha Gupta", specialization: "Cardiologist", hospital: "Life Care Hospital", lat: 19.0800, lng: 72.8800 }  // Kurla
// //     ];
// //     res.json(doctors);
// // });


// // Root Endpoint
// app.get('/', (req, res) => {
//     res.send('HealthAI Backend is running...');
// });

// // Start Server
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });






// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();

// const doctorRoutes = require('./routes/doctorRoutes');
// const dashboardRoutes = require('./routes/dashboardRoutes');
// const chatRoutes = require('./routes/chatRoutes');
// const authRoutes = require('./routes/authRoutes');
// const reportRoutes = require("./routes/reportRoutes");
// const appointmentRoutes = require("./routes/appointmentRoutes");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());   // 🔥 important

// // Routes
// app.use('/api/doctors', doctorRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/chat', chatRoutes);
// app.use('/api/auth', authRoutes);
// app.use("/api", reportRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/appointments", require("./routes/appointmentRoutes"));


// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });
// // 🔥 SOCKET CONNECTION
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // join room
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//   });

//   // send message
//   socket.on("sendMessage", (data) => {
//     io.to(data.roomId).emit("receiveMessage", data);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected");
//   });
// });



// // Test
// app.get('/', (req, res) => {
//   res.send('HealthAI Backend running');
// });

// app.listen(PORT, () => {
//   console.log(`Server running http://localhost:${PORT}`);
// });








const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const doctorRoutes = require("./routes/doctorRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatRoutes = require("./routes/chatRoutes");
const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// 🔥 Create HTTP server
const server = http.createServer(app);

// 🔥 Create socket server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", reportRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/messages", messageRoutes);
// 🔥 SOCKET CONNECTION
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log("Joined room:", roomId);
  });

  // Send message
  socket.on("sendMessage", (data) => {
    io.to(data.roomId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("HealthAI Backend running");
});

// ❗ IMPORTANT: use server.listen NOT app.listen
server.listen(PORT, () => {
  console.log(`Server running http://localhost:${PORT}`);
});