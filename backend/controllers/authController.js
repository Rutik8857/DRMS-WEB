const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    console.log("🔹 SIGNUP REQUEST:", req.body);

    const { name, email, password, role, specialization, location, age, gender } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields (email, password, role)" });
    }

    // Normalize inputs (trim whitespace, lowercase email/role)
    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();

    // Check if user already exists
    const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [cleanEmail]);
    if (existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // users table insert
    const [result] = await db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, cleanEmail, hashedPassword, cleanRole]
    );

    const userId = result.insertId;
    console.log(`✅ User created: ID=${userId}, Role=${cleanRole}`);

    // doctor insert
    if (cleanRole === "doctor") {
      await db.query(
        "INSERT INTO doctors (user_id, specialization, location) VALUES (?, ?, ?)",
        [userId, specialization || null, location || null]
      );
      console.log("✅ Doctor profile added to 'doctors' table");
    }

    // patient insert
    if (cleanRole === "patient") {
      await db.query(
        "INSERT INTO patients (user_id, age, gender) VALUES (?, ?, ?)",
        [userId, age || null, gender || null]
      );
      console.log("✅ Patient profile added to 'patients' table");
    }

    res.json({ message: "Signup successful" });

  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};


// ================= LOGIN =================
// exports.login = async (req, res) => {
//   try {
//     console.log("🔹 LOGIN REQUEST:", req.body);

//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password required" });
//     }

//     const cleanEmail = email.trim().toLowerCase();

//     // 1️⃣ Check users table
//     const [rows] = await db.query(
//       "SELECT * FROM users WHERE email=?",
//       [cleanEmail]
//     );

//     if (rows.length === 0) {
//       console.log("❌ User not found:", cleanEmail);
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const user = rows[0];
//     console.log(`✅ User found: ID=${user.id}, Role=${user.role}`);

//     // 2️⃣ Check password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       console.log("❌ Password mismatch");
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     // 3️⃣ If role is doctor → Verify in doctors table
//     let doctorData = null;
//     const userRole = user.role.toLowerCase();

//     if (userRole === "doctor") {
//       console.log("🔍 Verifying doctor profile...");
//       const [docRows] = await db.query(
//         "SELECT * FROM doctors WHERE user_id=?",
//         [user.id]
//       );

//       if (docRows.length === 0) {
//         console.log("❌ CRITICAL: User is doctor but missing in doctors table");
//         return res.status(403).json({
//           error: "Doctor profile incomplete. Please contact admin."
//         });
//       }

//       doctorData = docRows[0];
//       console.log("✅ Doctor profile verified");
//     }

//     // 4️⃣ Generate Token
//     const token = jwt.sign(
//       { id: user.id, role: userRole },
//       "secretkey",
//       { expiresIn: "1d" }
//     );

//     res.json({
//       message: "Login success",
//       role: userRole,
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: userRole
//       },
//       doctor: doctorData
//     });

//   } catch (err) {
//     console.error("❌ LOGIN ERROR:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// };




// exports.login = async (req, res) => {
//   try {
//     console.log("🔹 LOGIN REQUEST:", req.body);

//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ error: "Email and password required" });
//     }

//     const cleanEmail = email.trim().toLowerCase();

//     // 1️⃣ Check users table
//     const [rows] = await db.query(
//       "SELECT * FROM users WHERE email=?",
//       [cleanEmail]
//     );

//     if (rows.length === 0) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     const user = rows[0];
//     const userRole = user.role.toLowerCase();

//     console.log(`✅ User found: ID=${user.id}, Role=${userRole}`);

//     // 2️⃣ Check password
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ error: "Invalid credentials" });
//     }

//     let doctorData = null;
//     let patientData = null;

//     // ================= DOCTOR LOGIN =================
//     if (userRole === "doctor") {
//       console.log("🔍 Checking doctor table...");

//       const [docRows] = await db.query(
//         "SELECT * FROM doctors WHERE user_id=?",
//         [user.id]
//       );

//       if (docRows.length === 0) {
//         return res.status(403).json({
//           error: "Doctor not found in doctors table"
//         });
//       }

//       doctorData = docRows[0];
//       console.log("✅ Doctor verified");
//     }

//     // ================= PATIENT LOGIN =================
//     if (userRole === "patient") {
//       const [patRows] = await db.query(
//         "SELECT * FROM patients WHERE user_id=?",
//         [user.id]
//       );

//       if (patRows.length === 0) {
//         return res.status(403).json({
//           error: "Patient profile missing"
//         });
//       }

//       patientData = patRows[0];
//     }

//     // ================= ADMIN LOGIN =================
//     // Admin only needs users table
//     if (userRole === "admin") {
//       console.log("✅ Admin login");
//     }

//     // 4️⃣ Generate token
//     const token = jwt.sign(
//       { id: user.id, role: userRole },
//       "secretkey",
//       { expiresIn: "1d" }
//     );

//     res.json({
//       message: `${userRole} login success`,
//       role: userRole,
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//         role: userRole
//       },
//       doctor: doctorData,
//       patient: patientData
//     });

//   } catch (err) {
//     console.error("LOGIN ERROR:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// };



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    // users table check
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email=?",
      [cleanEmail]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const role = user.role.toLowerCase();

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    let doctorProfile = null;

    // ================= DOCTOR =================
    if (role === "doctor") {
      const [doc] = await db.query(
        "SELECT * FROM doctors WHERE user_id=?",
        [user.id]
      );

      if (doc.length === 0) {
        return res.status(403).json({ error: "Doctor profile missing" });
      }

      doctorProfile = doc[0];
    }

    // ================= TOKEN =================
    const token = jwt.sign(
      {
        id: user.id,        // user id
        role: role,
        doctorId: doctorProfile ? doctorProfile.id : null
      },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role,
      user,
      doctor: doctorProfile
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Login failed" });
  }
};