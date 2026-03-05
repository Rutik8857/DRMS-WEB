// const express = require("express");
// const router = express.Router();
// const doctorController = require("../controllers/doctorController");
// const { verifyToken, verifyDoctor } = require("../middleware/auth.middleware");
// const db = require("../db");


// // ➜ ADD DOCTOR
// router.post("/add", doctorController.addDoctor);

// // ➜ DOCTOR DASHBOARD (Protected)

// // ➜ GET ALL DOCTORS
// router.get("/", doctorController.getDoctors);

// // ➜ DELETE
// router.delete("/:id", doctorController.deleteDoctor);


// router.get("/my-data", verifyToken, verifyDoctor, async (req, res) => {

//   const doctorId = req.user.doctorId;

//   try {
//     // doctor profile
//     const [doctor] = await db.query(
//       "SELECT * FROM doctors WHERE id=?",
//       [doctorId]
//     );

//     const doctorData = doctor?.[0] || null;
//     if (!doctorData) {
//       return res.status(404).json({ error: "Doctor profile not found" });
//     }

//     res.json({
//       doctor: doctorData
//     });

//   } catch (err) {
//     console.error('GetMyData error:', err);
//     res.status(500).json({ error: "Server error" });
//   }
// });



// module.exports = router;



const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const { verifyToken, verifyDoctor } = require("../middleware/auth.middleware");

// Base path: /api/doctors

// GET currently authenticated doctor's profile
router.get("/my-data", verifyToken, verifyDoctor, doctorController.getDoctorProfile);
// GET list of patients for this doctor
router.get("/my-patients", verifyToken, verifyDoctor, doctorController.getMyPatients);

// GET all doctors
router.get("/", doctorController.getDoctors);

// ADD doctor
router.post("/", doctorController.addDoctor);

// DELETE doctor
router.delete("/:id", doctorController.deleteDoctor);

module.exports = router;