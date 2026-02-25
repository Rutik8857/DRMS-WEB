// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token, "secretkey");
    req.user = decoded; 
    // { id, role, doctorId }

    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};