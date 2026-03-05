const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    console.log("🔹 SIGNUP REQUEST:", req.body);

    const {
      name,
      email,
      password,
      role,
      specialization,
      location,
      age,
      gender,
    } = req.body;

    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Missing required fields (email, password, role)" });
    }

    // Normalize inputs (trim whitespace, lowercase email/role)
    const cleanEmail = email.trim().toLowerCase();
    const cleanRole = role.trim().toLowerCase();

    // Check if user already exists
    let existing = [];
    try {
      const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [
        cleanEmail,
      ]);
      existing = rows || [];
    } catch (e) {
      console.warn("User existence check failed:", e.message);
    }

    if (existing && existing.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // users table insert
    let result = {};
    try {
      const [res_result] = await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, cleanEmail, hashedPassword, cleanRole],
      );
      result = res_result || {};
    } catch (e) {
      console.error("User creation failed:", e.message);
      return res.status(500).json({ error: "Failed to create user" });
    }

    const userId = result?.insertId;
    if (!userId) {
      return res.status(500).json({ error: "Failed to create user account" });
    }
    console.log(`✅ User created: ID=${userId}, Role=${cleanRole}`);

    // doctor insert
    if (cleanRole === "doctor") {
      try {
        await db.query(
          "INSERT INTO doctors (user_id, specialization, location) VALUES (?, ?, ?)",
          [userId, specialization || null, location || null],
        );
        console.log("✅ Doctor profile added to 'doctors' table");
      } catch (e) {
        console.warn("Doctor profile creation failed:", e.message);
      }
    }

    // patient insert
    if (cleanRole === "patient") {
      try {
        await db.query(
          "INSERT INTO patients (user_id, age, gender) VALUES (?, ?, ?)",
          [userId, age || null, gender || null],
        );
        console.log("✅ Patient profile added to 'patients' table");
      } catch (e) {
        console.warn("Patient profile creation failed:", e.message);
      }
    }

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error("❌ SIGNUP ERROR:", err);
    res.status(500).json({ error: "Signup failed", details: err.message });
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

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    // users table check
    let rows = [];
    try {
      const [result] = await db.query("SELECT * FROM users WHERE email=?", [
        cleanEmail,
      ]);
      rows = result || [];
    } catch (e) {
      console.error("User lookup failed:", e.message);
      return res
        .status(500)
        .json({ error: "Login failed", details: e.message });
    }

    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const role = user?.role?.toLowerCase();

    if (!role) {
      return res.status(500).json({ error: "Invalid user role" });
    }

    let passwordMatch = false;
    try {
      passwordMatch = await bcrypt.compare(password, user.password);
    } catch (e) {
      console.error("Password comparison failed:", e.message);
      return res.status(500).json({ error: "Authentication failed" });
    }

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    let doctorProfile = null;

    // ================= DOCTOR =================
    if (role === "doctor") {
      try {
        const [doc] = await db.query("SELECT * FROM doctors WHERE user_id=?", [
          user.id,
        ]);

        if (!doc || doc.length === 0) {
          return res.status(403).json({ error: "Doctor profile missing" });
        }

        doctorProfile = doc[0];
      } catch (e) {
        console.warn("Doctor profile lookup failed:", e.message);
      }
    }

    // ================= TOKEN =================
    const token = jwt.sign(
      {
        id: user.id,
        role: role,
        doctorId: doctorProfile ? doctorProfile.id : null,
      },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" },
    );

    res.json({
      token,
      role,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role,
      },
      doctor: doctorProfile,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
};

// ------------------- FORGOT / RESET PASSWORD -------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const cleanEmail = email.trim().toLowerCase();
    const [rows] = await db.query("SELECT id FROM users WHERE email=?", [
      cleanEmail,
    ]);
    if (!rows || rows.length === 0) {
      // don't reveal that email doesn't exist
      return res.json({
        message:
          "If that email is registered, you will receive a reset link shortly",
      });
    }
    const userId = rows[0].id;

    const crypto = require("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

    await db.query(
      "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, hashedToken, expires],
    );

    // send email
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

const resetLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/reset/${token}`;    await transporter.sendMail({
      from: process.env.EMAIL_FROM || "no-reply@healthai.com",
      to: cleanEmail,
      subject: "Password Reset Request",
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to set a new password. This link expires in 30 minutes.</p>`,
    });

    res.json({ message: "Reset link sent if email exists" });
  } catch (err) {
    console.error("ForgotPassword Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password)
      return res.status(400).json({ message: "Token and password required" });

    const crypto = require("crypto");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await db.query(
      "SELECT * FROM password_resets WHERE token=? AND used=0",
      [hashedToken],
    );

    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const record = rows[0];
    const now = new Date();
    if (now > new Date(record.expires_at)) {
      return res.status(400).json({ message: "Token expired" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("UPDATE users SET password=? WHERE id=?", [
      hashedPassword,
      record.user_id,
    ]);

    // mark token used
    await db.query("UPDATE password_resets SET used=1 WHERE id=?", [record.id]);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("ResetPassword Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
