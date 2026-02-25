const express = require("express");
const router = express.Router();
const doctorController = require("../controllers/doctorController");
const auth = require("../middleware/auth");
const db = require("../db");


// ➜ ADD DOCTOR
router.post("/add", doctorController.addDoctor);

// ➜ DOCTOR DASHBOARD (Protected)

// ➜ GET ALL DOCTORS
router.get("/", doctorController.getDoctors);

// ➜ DELETE
router.delete("/:id", doctorController.deleteDoctor);


router.get("/my-data", auth, async (req, res) => {

  if (req.user.role !== "doctor") {
    return res.status(403).json({ error: "Not doctor" });
  }

  const doctorId = req.user.doctorId;

  try {
    // doctor profile
    const [doctor] = await db.query(
      "SELECT * FROM doctors WHERE id=?",
      [doctorId]
    );

    res.json({
      doctor: doctor[0]
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
