const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const scheduleController = require("../controllers/scheduleController");

// 🔐 Get Logged-in Doctor Schedule
router.get("/my", auth, scheduleController.getMySchedule);

// ➕ Add Slot
router.post("/add", auth, scheduleController.addSlot);

// ✏️ Update Slot
router.put("/update/:id", auth, scheduleController.updateSlot);

// ❌ Delete Slot
router.delete("/delete/:id", auth, scheduleController.deleteSlot);

module.exports = router;