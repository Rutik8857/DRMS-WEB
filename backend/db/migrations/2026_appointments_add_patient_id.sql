-- add patient_id column and backfill from users via email
ALTER TABLE appointments
    ADD COLUMN IF NOT EXISTS patient_id INT DEFAULT NULL;

-- backfill existing rows where patientEmail matches a user
UPDATE appointments a
JOIN users u ON u.email = a.patientEmail AND u.role='patient'
SET a.patient_id = u.id
WHERE a.patient_id IS NULL;

-- add index and foreign key
ALTER TABLE appointments
    ADD INDEX idx_appointments_patient_id (patient_id);

ALTER TABLE appointments
    ADD CONSTRAINT fk_appointments_patient_id FOREIGN KEY (patient_id) REFERENCES users(id) ON DELETE SET NULL;
