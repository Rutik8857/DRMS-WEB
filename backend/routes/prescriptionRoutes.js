const express = require('express');
const router = express.Router();
const { verifyToken, verifyDoctor, verifyPatient } = require('../middleware/auth.middleware');
const prescriptionController = require('../controllers/prescriptionController');

// doctor creates prescription
router.post('/create', verifyToken, verifyDoctor, prescriptionController.createPrescription);

// patient views own prescriptions
router.get('/my', verifyToken, verifyPatient, prescriptionController.getPatientPrescriptions);

// doctor lists prescriptions he has written
router.get('/doctor', verifyToken, verifyDoctor, prescriptionController.getDoctorPrescriptions);

// get single prescription by id (any role with access)
router.get('/:id', verifyToken, prescriptionController.getPrescriptionById);

module.exports = router;
