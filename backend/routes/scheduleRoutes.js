const express = require("express");
const router = express.Router();
const { verifyToken, verifyDoctor } = require("../middleware/auth.middleware");
const scheduleController = require("../controllers/scheduleController");

// 🔐 Get Logged-in Doctor Schedule
router.get("/my", verifyToken, verifyDoctor, scheduleController.getMySchedule);

// ➕ Add Slot
router.post("/add", verifyToken, verifyDoctor, scheduleController.addSlot);

// ✏️ Update Slot
router.put("/update/:id", verifyToken, verifyDoctor, scheduleController.updateSlot);

// ❌ Delete Slot
router.delete("/delete/:id", verifyToken, verifyDoctor, scheduleController.deleteSlot);

module.exports = router;