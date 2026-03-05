const express = require('express');
const router = express.Router();
const { verifyToken, verifyPatient } = require('../middleware/auth.middleware');
const { getPatientSummary, getPatientAnalytics } = require('../controllers/patient.dashboard.controller');

// Base path: /patient

// GET /patient/dashboard/summary
// router.get('/dashboard/summary', verifyToken, verifyPatient, getPatientSummary);

// // GET /patient/dashboard/analytics
// router.get('/dashboard/analytics', verifyToken, verifyPatient, getPatientAnalytics);


router.get('/dashboard/summary', getPatientSummary);
router.get('/dashboard/analytics', getPatientAnalytics);
module.exports = router;

