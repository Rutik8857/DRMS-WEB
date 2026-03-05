// const db = require("../db");
// const bcrypt = require("bcrypt");
// const axios = require("axios");


// exports.addDoctor = async (req, res) => {
//   try {
//     const {
//       fullName,
//       degree,
//       email,
//       password,
//       specialization,
//       otherSpecialization,
//       diseaseFocus,
//       city,
//       district,
//       state,
//       workType,
//       orgName,
//       designation,
//       clinicName,
//       adminContact
//     } = req.body;

//     if (!email || !password || !fullName) {
//       return res.status(400).json({ error: "Missing required fields: fullName, email, password" });
//     }

//     const cleanEmail = email.trim().toLowerCase();

//     // 1. Check if user exists in users table
//     let existingUser = [];
//     try {
//       const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [cleanEmail]);
//       existingUser = rows || [];
//     } catch (e) {
//       console.warn('User lookup failed:', e.message);
//     }

//     if (existingUser && existingUser.length > 0) {
//       return res.status(400).json({ error: "Email already exists" });
//     }

//     // 1.5 Check for orphaned doctor record (exists in doctors but not users)
//     let existingDoctor = [];
//     try {
//       const [rows] = await db.query("SELECT * FROM doctors WHERE email = ?", [cleanEmail]);
//       existingDoctor = rows || [];
//     } catch (e) {
//       console.warn('Doctor lookup failed:', e.message);
//     }

//     const location = `${city}, ${district}, ${state}`;

//     // 🔥 AUTO LAT LNG DETECT
//     let lat = null;
//     let lng = null;

//     try {
//       const geo = await axios.get(
//         "https://nominatim.openstreetmap.org/search",
//         {
//           params: {
//             q: location,
//             format: "json"
//           }
//         }
//       );

//       if (geo?.data && geo.data.length > 0) {
//         lat = geo.data[0].lat;
//         lng = geo.data[0].lon;
//       }
//     } catch (err) {
//       console.warn("Geocode fail:", err.message);
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     // 2. Insert into users table (Required for Login)
//     const [userResult] = await db.query(
//       "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
//       [fullName, cleanEmail, hashedPassword, "doctor"]
//     );
//     const userId = userResult?.insertId;

//     if (!userId) {
//       return res.status(500).json({ error: "Failed to create user record" });
//     }

//     // If doctor exists but user didn't (orphaned), just link them
//     if (existingDoctor && existingDoctor.length > 0) {
//       try {
//         await db.query("UPDATE doctors SET user_id = ?, password = ? WHERE email = ?", [userId, hashedPassword, cleanEmail]);
//         return res.json({ message: "Doctor account repaired. You can now login." });
//       } catch (e) {
//         console.error('Update failed:', e.message);
//       }
//     }

//     const sql = `
//       INSERT INTO doctors
//       (user_id, fullName, degree, email, password, specialization,
//        otherSpecialization, diseaseFocus, location, city, district, state,
//        workType, orgName, designation, clinicName, adminContact, lat, lng)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     await db.query(sql, [
//       userId,
//       fullName,
//       degree,
//       cleanEmail,
//       hashedPassword,
//       specialization,
//       otherSpecialization,
//       diseaseFocus,
//       location,
//       city,
//       district,
//       state,
//       workType,
//       orgName,
//       designation,
//       clinicName,
//       adminContact,
//       lat,
//       lng
//     ]);

//     res.json({ message: "Doctor added with map location" });

//   } catch (err) {
//     console.error("AddDoctor Error:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };
//       state,
//       workType,
//       orgName,
//       designation,
//       clinicName,
//       adminContact,
//       lat,
//       lng
//     ]);

//     res.json({ message: "Doctor added with map location" });

//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Server error" });
//   }
// };


// exports.getDoctorProfile = async (req, res) => {
//   try {
//     const userId = req.user?.id;

//     if (!userId) {
//       return res.status(400).json({ error: "User ID not found in token" });
//     }

//     const [rows] = await db.query("SELECT * FROM doctors WHERE user_id = ?", [userId]);

//     if (!rows || rows.length === 0) {
//       return res.status(404).json({ error: "Doctor profile not found." });
//     }

//     const doctorData = rows[0];
//     res.json(doctorData);

//   } catch (err) {
//     console.error("Dashboard Error:", err);
//     res.status(500).json({ error: "Failed to fetch doctor profile", details: err.message });
//   }
// };



// // ➜ GET ALL DOCTORS
// exports.getDoctors = async (req, res) => {
//   try {
//     const [rows] = await db.query("SELECT * FROM doctors ORDER BY id DESC");
//     res.json(rows || []);
//   } catch (err) {
//     console.error("GetDoctors Error:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };



// // ➜ DELETE DOCTOR
// exports.deleteDoctor = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!id) {
//       return res.status(400).json({ error: "Doctor ID is required" });
//     }

//     await db.query("DELETE FROM doctors WHERE id = ?", [id]);
//     res.json({ message: "Doctor deleted" });
//   } catch (err) {
//     console.error("DeleteDoctor Error:", err);
//     res.status(500).json({ error: "Server error", details: err.message });
//   }
// };








const db = require("../db");
const bcrypt = require("bcrypt");
const axios = require("axios");

// ================= ADD DOCTOR =================
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
      return res.status(400).json({
        error: "Missing required fields: fullName, email, password"
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const location = `${city}, ${district}, ${state}`;

    let lat = null;
    let lng = null;

    try {
      const geo = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: { q: location, format: "json" }
        }
      );

      if (geo.data.length > 0) {
        lat = geo.data[0].lat;
        lng = geo.data[0].lon;
      }
    } catch (err) {
      console.warn("Geocode fail:", err.message);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [userResult] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [fullName, cleanEmail, hashedPassword, "doctor"]
    );

    const userId = userResult.insertId;

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

    res.json({ message: "Doctor added successfully with location" });

  } catch (err) {
    console.error("AddDoctor Error:", err);
    res.status(500).json({
      error: "Server error",
      details: err.message
    });
  }
};

// ================= GET DOCTOR PROFILE =================
exports.getDoctorProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID not found in token" });
    }

    const [rows] = await db.query(
      "SELECT * FROM doctors WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Doctor profile not found." });
    }

    res.json(rows[0]);

  } catch (err) {
    console.error("Profile Error:", err);
    res.status(500).json({
      error: "Failed to fetch doctor profile",
      details: err.message
    });
  }
};

// ================= GET ALL DOCTORS =================
exports.getDoctors = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM doctors ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("GetDoctors Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ================= GET MY PATIENTS =================
// exports.getMyPatients = async (req, res) => {
//   try {
//     console.log('getMyPatients request user:', req.user);
//     if (req.user?.role !== 'doctor') {
//       return res.status(403).json({ message: 'Access denied' });
//     }
//     const doctorId = req.user.doctorId;
//     console.log('getMyPatients doctorId:', doctorId);
//     if (!doctorId) {
//       return res.status(400).json({ message: 'Doctor ID missing in token' });
//     }

//     const [rows] = await db.query(
//       `SELECT DISTINCT u.id, u.name
//        FROM users u
//        JOIN appointments a ON a.patientEmail = u.email AND u.role='patient'
//        WHERE a.doctorId = ?`,
//       [doctorId]
//     );

//     console.log('getMyPatients executed for doctorId', doctorId, 'returned', rows.length, 'rows');
//     res.json(rows || []);
//   } catch (err) {
//     console.error('GetMyPatients Error:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.getMyPatients = async (req, res) => {
  try {
    const doctorId = req.user.doctorId;

    const [rows] = await db.query(
      `
      SELECT DISTINCT u.id, u.name
      FROM appointments a
      JOIN users u ON u.id = a.patientId
      WHERE a.doctorId = ?
      `,
      [doctorId]
    );

    res.json(rows || []);
  } catch (err) {
    console.error("GetMyPatients Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ================= DELETE DOCTOR =================
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    await db.query("DELETE FROM doctors WHERE id = ?", [id]);

    res.json({ message: "Doctor deleted" });

  } catch (err) {
    console.error("DeleteDoctor Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};