-- add indexes to speed up patient lookups by doctor

ALTER TABLE appointments
    ADD INDEX idx_appointments_doctorId (doctorId);

ALTER TABLE appointments
    ADD INDEX idx_appointments_doctor_id (doctor_id);

ALTER TABLE appointments
    ADD INDEX idx_appointments_patientEmail (patientEmail);
