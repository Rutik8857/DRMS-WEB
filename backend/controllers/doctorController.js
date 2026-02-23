const db = require("../db");
const bcrypt = require("bcrypt");
const axios = require("axios");


exports.addDoctor = async (req, res) => {
  try {
    const {
      fullName,
      degree,
      email,
      password,
      specialization,
      otherSpecialization,
      diseaseFocus,
      city,
      district,
      state,
      workType,
      orgName,
      designation,
      clinicName,
      adminContact
    } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: "Missing required fields: fullName, email, password" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if user exists in users table
    const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [cleanEmail]);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // 1.5 Check for orphaned doctor record (exists in doctors but not users)
    const [existingDoctor] = await db.query("SELECT * FROM doctors WHERE email = ?", [cleanEmail]);

    const location = `${city}, ${district}, ${state}`;

    // 🔥 AUTO LAT LNG DETECT
    let lat = null;
    let lng = null;

    try {
      const geo = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: location,
            format: "json"
          }
        }
      );

      if (geo.data.length > 0) {
        lat = geo.data[0].lat;
        lng = geo.data[0].lon;
      }
    } catch (err) {
      console.log("Geocode fail:", err.message);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Insert into users table (Required for Login)
    const [userResult] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [fullName, cleanEmail, hashedPassword, "doctor"]
    );
    const userId = userResult.insertId;

    // If doctor exists but user didn't (orphaned), just link them
    if (existingDoctor.length > 0) {
      await db.query("UPDATE doctors SET user_id = ?, password = ? WHERE email = ?", [userId, hashedPassword, cleanEmail]);
      return res.json({ message: "Doctor account repaired. You can now login." });
    }

    const sql = `
      INSERT INTO doctors
      (user_id, fullName, degree, email, password, specialization,
       otherSpecialization, diseaseFocus, location, city, district, state,
       workType, orgName, designation, clinicName, adminContact, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(sql, [
      userId,
      fullName,
      degree,
      cleanEmail,
      hashedPassword,
      specialization,
      otherSpecialization,
      diseaseFocus,
      location,
      city,
      district,
      state,
      workType,
      orgName,
      designation,
      clinicName,
      adminContact,
      lat,
      lng
    ]);

    res.json({ message: "Doctor added with map location" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};


// ➜ GET DOCTOR DASHBOARD (Protected)
exports.getDoctorProfile = async (req, res) => {
  try {
    // 1. Extract user_id from the authenticated token (set by middleware)
    const userId = req.user.id;

    // 2. Query the doctors table using user_id
    const [rows] = await db.query("SELECT * FROM doctors WHERE user_id = ?", [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }

    const doctorData = rows[0];

    // 3. Return the personalized data
    res.json(doctorData);

  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Failed to fetch doctor profile" });
  }
};



// ➜ GET ALL DOCTORS
exports.getDoctors = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM doctors ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};



// ➜ DELETE DOCTOR
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM doctors WHERE id = ?", [id]);
    res.json({ message: "Doctor deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
