const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");


// ➜ ADD DOCTOR
router.post("/add", doctorController.addDoctor);

// ➜ DOCTOR DASHBOARD (Protected)

// ➜ GET ALL DOCTORS
router.get("/", doctorController.getDoctors);

// ➜ DELETE
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;
