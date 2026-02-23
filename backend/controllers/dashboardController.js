// controllers/dashboardController.js
const db = require('../config/db');

exports.getStats = async (req, res) => {
    try {
        // Parallel queries for performance
        const [users] = await db.query('SELECT COUNT(*) as count FROM users');
        const [doctors] = await db.query('SELECT COUNT(*) as count FROM doctors');
        const [reports] = await db.query('SELECT COUNT(*) as count FROM reports');
        const [appointments] = await db.query('SELECT COUNT(*) as count FROM appointments');
        
        // Get recent reports for the table
        const [recentReports] = await db.query('SELECT * FROM reports ORDER BY created_at DESC LIMIT 5');

        res.status(200).json({
            totalUsers: users[0].count,
            totalDoctors: doctors[0].count,
            totalReports: reports[0].count,
            totalAppointments: appointments[0].count,
            recentReports
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};