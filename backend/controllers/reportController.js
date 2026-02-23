const db = require("../db");

// ✅ Helper: Safely parse JSON or CSV strings into Arrays
const safeParseList = (input) => {
  if (!input) return []; // Handle null/undefined
  if (Array.isArray(input)) return input; // Already an array
  if (typeof input === 'object') return []; // Should be array or string

  try {
    // Try parsing as JSON (e.g., '["Fever", "Cold"]')
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    // 🛡️ Fallback: Handle CSV strings (e.g., "Fever, Cold")
    return typeof input === 'string' ? input.split(',').map(s => s.trim()) : [];
  }
};

//  GET latest report
exports.getLatestReport = async (req, res) => {
  const sql = `
    SELECT * FROM health_reports
    ORDER BY created_at DESC
    LIMIT 1
  `;

  try {
    const [rows] = await db.query(sql);
    
    if (rows.length === 0) {
      return res.json(null);
    }
    
    // ✅ Clean data before sending to frontend
    const report = rows[0];
    report.symptoms = safeParseList(report.symptoms);
    report.advice = safeParseList(report.advice);
    report.precautions = safeParseList(report.precautions);

    res.json(report);
  } catch (err) {
    console.error("DB ERROR 👉", err);
    res.status(500).json({ error: err.message });
  }
};


// 📌 GET all reports (history)
exports.getAllReports = async (req, res) => {
  const sql = `SELECT * FROM health_reports ORDER BY created_at DESC`;

  try {
    const [rows] = await db.query(sql);
    
    // ✅ Clean ALL rows
    const cleanedRows = rows.map(row => ({
      ...row,
      symptoms: safeParseList(row.symptoms),
      advice: safeParseList(row.advice),
      precautions: safeParseList(row.precautions)
    }));
    
    res.json(cleanedRows);
  } catch (err) {
    res.status(500).json(err);
  }
};

// 📌 CREATE report
exports.createReport = async (req, res) => {
  const { user_id, symptoms, ai_summary, advice, precautions } = req.body;

  const sql = `
    INSERT INTO health_reports 
    (user_id, symptoms, ai_summary, advice, precautions)
    VALUES (?, ?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [
      user_id || null,
      JSON.stringify(symptoms),
      ai_summary,
      JSON.stringify(advice),
      JSON.stringify(precautions),
    ]);
    res.json({ message: "Report saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Insert failed" });
  }
};

// 📌 DELETE report
exports.deleteReport = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM health_reports WHERE id = ?", [id]);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};
