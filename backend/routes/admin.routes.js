const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/auth.middleware');
const { 
  getAdminSummary, 
  getAdminAnalytics 
} = require('../controllers/admin.dashboard.controller');

// Base path defined in server.js is '/admin'

// GET /admin/dashboard/summary
router.get('/dashboard/summary', verifyToken, verifyAdmin, getAdminSummary);

// GET /admin/dashboard/analytics
router.get('/dashboard/analytics', verifyToken, verifyAdmin, getAdminAnalytics);

router.get("/", async (req, res) => {
  try {

    const db = require("../db");

    const sql = "SELECT id, name, email FROM users WHERE role='admin'";

    const [rows] = await db.query(sql);

    res.json({
      count: rows.length,
      admins: rows
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;