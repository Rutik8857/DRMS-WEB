const db = require('../db');

// create new prescription (doctor only)
exports.createPrescription = async (req, res) => {
  try {
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can create prescriptions' });
    }

    const doctorId = req.user.doctorId;
    if (!doctorId) {
      return res.status(400).json({ message: 'Doctor ID missing in token' });
    }

    const { patientId, appointmentId, details } = req.body;
    if (!patientId || !details) {
      return res.status(400).json({ message: 'patientId and details are required' });
    }

    // verify patient exists and has role
    const [userRows] = await db.query("SELECT * FROM users WHERE id=? AND role='patient'", [patientId]);
    if (!userRows || userRows.length === 0) {
      return res.status(400).json({ message: 'Invalid patientId' });
    }

    // optional: verify doctor-patient relation via chat or appointment
    if (appointmentId) {
      const [appt] = await db.query(
        'SELECT * FROM appointments WHERE id=? AND doctorId=?',
        [appointmentId, doctorId]
      );
      if (appt.length === 0) {
        return res.status(400).json({ message: 'Appointment not found for this doctor' });
      }
    }

    const [result] = await db.query(
      'INSERT INTO prescriptions (doctor_id, patient_id, appointment_id, details) VALUES (?,?,?,?)',
      [doctorId, patientId, appointmentId || null, details]
    );

    res.json({ message: 'Prescription created', id: result.insertId });
  } catch (err) {
    console.error('CreatePrescription Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPatientPrescriptions = async (req, res) => {
  try {
    if (req.user?.role !== 'patient') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const patientId = req.user.id;
    const [rows] = await db.query(
      'SELECT p.*, d.fullName AS doctorName FROM prescriptions p JOIN doctors d ON p.doctor_id=d.id WHERE p.patient_id=? ORDER BY p.created_at DESC',
      [patientId]
    );
    res.json(rows || []);
  } catch (err) {
    console.error('GetPatientPrescriptions Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getDoctorPrescriptions = async (req, res) => {
  try {
    if (req.user?.role !== 'doctor') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const doctorId = req.user.doctorId;
    if (!doctorId) return res.status(400).json({ message: 'Doctor ID missing' });

    const [rows] = await db.query(
      'SELECT p.*, u.name AS patientName FROM prescriptions p JOIN users u ON p.patient_id=u.id WHERE p.doctor_id=? ORDER BY p.created_at DESC',
      [doctorId]
    );
    res.json(rows || []);
  } catch (err) {
    console.error('GetDoctorPrescriptions Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// optionally a get by id (ensuring authorization)
exports.getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: 'Prescription id required' });

    const [rows] = await db.query('SELECT * FROM prescriptions WHERE id=?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });

    const prescription = rows[0];
    // authorization check
    if (req.user.role === 'patient' && prescription.patient_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'doctor' && prescription.doctor_id !== req.user.doctorId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    if (req.user.role === 'admin') {
      // admins can view all
    }

    res.json(prescription);
  } catch (err) {
    console.error('GetPrescriptionById Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
