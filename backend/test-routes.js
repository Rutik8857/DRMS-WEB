require('dotenv').config();
console.log('1. Config loaded');

const express = require('express');
console.log('2. Express required');

try {
  const doctorRoutes = require('./routes/doctor.routes');
  console.log('3. doctor.routes loaded');
} catch (err) {
  console.error('ERROR loading doctor.routes:', err.message);
}

try {
  const authRoutes = require('./routes/authRoutes');
  console.log('4. authRoutes loaded');
} catch (err) {
  console.error('ERROR loading authRoutes:', err.message);
}

try {
  const apiDoctorRoutes = require('./routes/doctorRoutes');
  console.log('5. doctorRoutes loaded');
} catch (err) {
  console.error('ERROR loading doctorRoutes:', err.message);
}

try {
  const appointmentRoutes = require('./routes/appointmentRoutes');
  console.log('6. appointmentRoutes loaded');
} catch (err) {
  console.error('ERROR loading appointmentRoutes:', err.message);
}

try {
  const scheduleRoutes = require('./routes/scheduleRoutes');
  console.log('7. scheduleRoutes loaded');
} catch (err) {
  console.error('ERROR loading scheduleRoutes:', err.message);
}

try {
  const adminRoutes = require('./routes/admin.routes');
  console.log('8. admin.routes loaded');
} catch (err) {
  console.error('ERROR loading admin.routes:', err.message);
}

try {
  const patientRoutes = require('./routes/patient.routes');
  console.log('9. patient.routes loaded');
} catch (err) {
  console.error('ERROR loading patient.routes:', err.message);
}

console.log('All routes loaded successfully');
process.exit(0);
