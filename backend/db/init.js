const db = require('../db');

async function initialize() {
  if (!db) return;

  try {
    // prescriptions
    await db.query(`
      CREATE TABLE IF NOT EXISTS prescriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        doctor_id INT NOT NULL,
        patient_id INT NOT NULL,
        appointment_id INT DEFAULT NULL,
        details TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX (doctor_id),
        INDEX (patient_id),
        INDEX (appointment_id)
      ) ENGINE=InnoDB;
    `);

    // chats and messages for doctor-patient real time
    await db.query(`
      CREATE TABLE IF NOT EXISTS chats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        doctor_id INT NOT NULL,
        patient_id INT NOT NULL,
        appointment_id INT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_chat (doctor_id, patient_id),
        INDEX (doctor_id),
        INDEX (patient_id)
      ) ENGINE=InnoDB;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        chat_id INT NOT NULL,
        sender_role VARCHAR(20) NOT NULL,
        sender_id INT NOT NULL,
        content TEXT,
        read_by_recipient BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (chat_id),
        INDEX (sender_id),
        INDEX (read_by_recipient)
      ) ENGINE=InnoDB;
    `);
    // ensure columns exist on older schema versions and adjust names/cleanup legacy
    const dbName = process.env.DB_NAME || 'health_ai_db';
    const [cols] = await db.query(
      `SELECT COLUMN_NAME
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'messages'`,
      [dbName]
    );
    const existing = new Set((cols || []).map(c => c.COLUMN_NAME));
    // drop legacy fields not used anymore
    if (existing.has('roomId')) {
      await db.query('ALTER TABLE messages DROP COLUMN roomId');
      existing.delete('roomId');
    }
    if (existing.has('sender')) {
      // if sender column held role, rename it
      if (!existing.has('sender_role')) {
        await db.query('ALTER TABLE messages CHANGE COLUMN sender sender_role VARCHAR(20)');
        existing.delete('sender');
        existing.add('sender_role');
      } else {
        await db.query('ALTER TABLE messages DROP COLUMN sender');
        existing.delete('sender');
      }
    }
    if (!existing.has('sender_role')) {
      await db.query('ALTER TABLE messages ADD COLUMN sender_role VARCHAR(20) NOT NULL');
      existing.add('sender_role');
    }
    if (!existing.has('sender_id')) {
      await db.query('ALTER TABLE messages ADD COLUMN sender_id INT NOT NULL');
      existing.add('sender_id');
    }
    if (!existing.has('chat_id')) {
      await db.query('ALTER TABLE messages ADD COLUMN chat_id INT NOT NULL');
      // clean orphans before FK
      await db.query('DELETE m FROM messages m LEFT JOIN chats c ON m.chat_id = c.id WHERE c.id IS NULL');
      await db.query('ALTER TABLE messages ADD INDEX (chat_id)');
      await db.query('ALTER TABLE messages ADD CONSTRAINT fk_messages_chat_id FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE');
      existing.add('chat_id');
    }
    if (!existing.has('read_by_recipient')) {
      await db.query('ALTER TABLE messages ADD COLUMN read_by_recipient TINYINT(1) NOT NULL DEFAULT 0');
      await db.query('ALTER TABLE messages ADD INDEX (read_by_recipient)');
      existing.add('read_by_recipient');
    }

    // ai chat history
    await db.query(`
      CREATE TABLE IF NOT EXISTS ai_chats (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        message TEXT NOT NULL,
        response TEXT NOT NULL,
        language VARCHAR(10) DEFAULT 'en',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id)
      ) ENGINE=InnoDB;
    `);

    // forgot password tokens
    await db.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(255) NOT NULL,
        expires_at DATETIME NOT NULL,
        used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX (user_id),
        INDEX (token)
      ) ENGINE=InnoDB;
    `);

    console.log('✅ Database schema initialized');
  } catch (err) {
    console.error('DB initialization error:', err);
  }
}

module.exports = { initialize };
