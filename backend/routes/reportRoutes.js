const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// GET latest report
router.get("/report/latest", reportController.getLatestReport);

// GET default report (matches /api/report)
router.get("/report", reportController.getLatestReport);

// GET history
router.get("/report/all", reportController.getAllReports);

// CREATE report
router.post("/report", reportController.createReport);

// DELETE report
router.delete("/report/:id", reportController.deleteReport);

module.exports = router;
