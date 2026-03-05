const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const { verifyToken, verifyDoctor } = require("../middleware/auth.middleware");
// ➜ SEND REQUEST
router.post("/send", appointmentController.sendRequest);

// ➜ GET ALL REQUESTS (doctor panel)
router.get("/", appointmentController.getAllRequests);

// ➜ GET BY DOCTOR
router.get("/doctor/:doctorId", appointmentController.getDoctorRequests);

// ➜ UPDATE STATUS
router.put("/status/:id", appointmentController.updateStatus);



router.get("/doctor/:doctorId", appointmentController.getDoctorRequests);
router.put("/status/:id", appointmentController.updateStatus);


router.get("/all", appointmentController.getAllRequests);
router.get("/my", verifyToken, verifyDoctor, appointmentController.getMyAppointments);

module.exports = router;
