const express = require("express");
const router = express.Router();
const appointmentController = require("../controllers/appointmentController");
const auth = require("../middleware/auth");
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
router.get("/my", auth, appointmentController.getMyAppointments);

module.exports = router;
