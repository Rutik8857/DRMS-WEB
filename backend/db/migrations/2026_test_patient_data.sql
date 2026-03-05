-- insert a test patient and appointment if none exist for doctor 1

INSERT INTO users (name, email, password, role)
SELECT 'Test Patient', 'testpatient@example.com', NULL, 'patient'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email='testpatient@example.com');

SET @pid = (SELECT id FROM users WHERE email='testpatient@example.com');

INSERT INTO patients (user_id)
SELECT @pid
WHERE NOT EXISTS (SELECT 1 FROM patients WHERE user_id=@pid);

INSERT INTO appointments (doctorId, patientEmail, patient_id)
SELECT 1, 'testpatient@example.com', @pid
WHERE NOT EXISTS (
  SELECT 1 FROM appointments
  WHERE doctorId=1 AND patient_id=@pid
);
