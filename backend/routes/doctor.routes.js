// const express = require('express');
// const router = express.Router();
// const { verifyToken, verifyDoctor } = require('../middleware/auth.middleware');
// const { 
//   getDashboardSummary, 
//   getDashboardAnalytics 
// } = require('../controllers/dashboard.controller');

// // Base path for this router is defined in server.js as '/doctor'

// // GET /doctor/dashboard/summary
// router.get('/dashboard/summary', verifyToken, verifyDoctor, getDashboardSummary);

// // GET /doctor/dashboard/analytics
// router.get('/dashboard/analytics', verifyToken, verifyDoctor, getDashboardAnalytics);

// module.exports = router;


// const express = require("express");
// const router = express.Router();
// const doctorController = require("../controllers/doctorController");

// router.get("/", doctorController.getDoctors);
// router.post("/", doctorController.addDoctor);
// router.delete("/:id", doctorController.deleteDoctor);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { verifyToken, verifyDoctor } = require("../middleware/auth.middleware");
const {
  getDashboardSummary,
  getDashboardAnalytics
} = require("../controllers/dashboard.controller");

// Base path: /doctor

router.get("/dashboard/summary", verifyToken, verifyDoctor, getDashboardSummary);
router.get("/dashboard/analytics", verifyToken, verifyDoctor, getDashboardAnalytics);

module.exports = router;