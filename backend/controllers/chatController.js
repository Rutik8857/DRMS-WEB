


// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require('dotenv').config();

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// exports.chatWithAI = async (req, res) => {
//     // We now expect 'language' in the request body
//     const { message, language } = req.body;
    
//     // Default to English if not specified
//     const targetLang = language || 'en'; 

//     if (!message) {
//         return res.status(400).json({ reply: "Please say something." });
//     }

//     try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         // Dynamic System Prompt based on Language
//         const systemInstruction = targetLang === 'hi' 
//             ? "You are HealthAI, a helpful medical assistant. Reply in HINDI (Devanagari script). Keep answers concise and helpful. Warn users to see a doctor for emergencies."
//             : "You are HealthAI, a helpful medical assistant. Reply in ENGLISH. Keep answers concise and helpful. Warn users to see a doctor for emergencies.";

//         const chat = model.startChat({
//             history: [
//                 {
//                     role: "user",
//                     parts: [{ text: systemInstruction }],
//                 },
//                 {
//                     role: "model",
//                     parts: [{ text: targetLang === 'hi' ? "नमस्ते. मैं HealthAI हूँ. मैं आपकी कैसे मदद कर सकता हूँ?" : "Understood. I am HealthAI. How can I help?" }],
//                 },
//             ],
//         });

//         const result = await chat.sendMessage(message);
//         const response = await result.response;
//         const text = response.text();

//         res.status(200).json({ reply: text });

//     } catch (error) {
//         console.error("AI Error:", error.message);
//         res.status(500).json({ 
//             reply: targetLang === 'hi' 
//                 ? "मुझे नेटवर्क से जुड़ने में समस्या हो रही है." 
//                 : "I am having trouble connecting to the network." 
//         });
//     }
// };



const OpenAI = require("openai");
const db = require("../db");
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

// ------------------ AI CHAT ------------------
exports.chatWithAI = async (req, res) => {
  const { message, language } = req.body;
  const userId = req.user?.id || null;

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            language === "hi"
              ? "You are HealthAI. Reply in Hindi."
              : "You are HealthAI. Reply in English."
        },
        { role: "user", content: message }
      ]
    });

    const reply = completion?.choices?.[0]?.message?.content || "AI temporarily unavailable.";

    // save history if user is logged in
    if (userId) {
      try {
        await db.query(
          "INSERT INTO ai_chats (user_id, message, response, language) VALUES (?,?,?,?)",
          [userId, message, reply, language || 'en']
        );
      } catch (e) {
        console.warn('Failed to save AI chat history:', e.message);
      }
    }

    res.json({ reply });

  } catch (error) {
    console.log("AI ERROR:", error);
    res.json({ reply: "AI temporarily unavailable." });
  }
};

// ------------------- CHAT / MESSAGING ------------------

// Helper: parse roomId -> [id1,id2]
function parseRoom(roomId) {
  const parts = roomId.split('_');
  if (parts.length !== 3) return [];
  const a = parseInt(parts[1]);
  const b = parseInt(parts[2]);
  return [a, b].filter(n => !isNaN(n));
}

async function ensureChat(doctorId, patientId) {
  const [rows] = await db.query(
    'SELECT id FROM chats WHERE doctor_id=? AND patient_id=?',
    [doctorId, patientId]
  );
  if (rows.length > 0) return rows[0].id;
  // only allow creating chat if there's at least one appointment linking them
  const [appt] = await db.query(
    'SELECT id FROM appointments WHERE doctorId=? AND patientEmail IN (SELECT email FROM users WHERE id=?) LIMIT 1',
    [doctorId, patientId]
  );
  if (!appt || appt.length === 0) {
    // no appointment, disallow chat creation
    return null;
  }
  const [result] = await db.query(
    'INSERT INTO chats (doctor_id, patient_id) VALUES (?, ?)',
    [doctorId, patientId]
  );
  return result.insertId;
}

exports.getUserChats = async (req, res) => {
  try {
    const user = req.user;
    let chats = [];

    // check essential columns exist to avoid SQL error
    const [cols] = await db.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'messages'
           AND COLUMN_NAME IN ('chat_id','sender_id','read_by_recipient')`,
      [process.env.DB_NAME || 'health_ai_db']
    );
    const colSet = new Set((cols || []).map(c => c.COLUMN_NAME));
    if (!colSet.has('chat_id') || !colSet.has('sender_id') || !colSet.has('read_by_recipient')) {
      console.error('GetUserChats schema missing columns:', Array.from(colSet));
      return res.status(500).json({ message: 'Chat table schema invalid' });
    }

    if (user.role === 'doctor') {
      const doctorId = user.doctorId;
      const [rows] = await db.query(
        `SELECT c.id,
                c.patient_id,
                u.name AS patientName,
                COALESCE(mc.unread, 0) AS unread
         FROM chats c
         JOIN users u ON u.id = c.patient_id
         LEFT JOIN (
             SELECT chat_id, COUNT(*) AS unread
             FROM messages
             WHERE read_by_recipient = 0 AND sender_id != ?
             GROUP BY chat_id
         ) mc ON mc.chat_id = c.id
         WHERE c.doctor_id = ?`,
        [user.id, doctorId]
      );
      chats = rows;

    } else if (user.role === 'patient') {
      const patientId = user.id;
      const [rows] = await db.query(
        `SELECT c.id,
                c.doctor_id,
                d.fullName AS doctorName,
                COALESCE(mc.unread, 0) AS unread
         FROM chats c
         JOIN doctors d ON d.id = c.doctor_id
         LEFT JOIN (
             SELECT chat_id, COUNT(*) AS unread
             FROM messages
             WHERE read_by_recipient = 0 AND sender_id != ?
             GROUP BY chat_id
         ) mc ON mc.chat_id = c.id
         WHERE c.patient_id = ?`,
        [user.id, patientId]
      );
      chats = rows;

    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(chats);
  } catch (err) {
    console.error('GetUserChats Error:', err.sqlMessage || err.message, 'SQL:', err.sql);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const ids = parseRoom(roomId);
    if (ids.length !== 2) return res.status(400).json({ message: 'Invalid room id' });
    const user = req.user;
    let doctorId, patientId;
    if (user.role === 'doctor') {
      doctorId = user.doctorId;
      patientId = ids.find(i => i !== doctorId);
    } else if (user.role === 'patient') {
      patientId = user.id;
      doctorId = ids.find(i => i !== patientId);
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (!doctorId || !patientId) return res.status(400).json({ message: 'Unable to determine participants' });

    const chatId = await ensureChat(doctorId, patientId);
    if (!chatId) {
      return res.status(403).json({ message: 'No chat allowed between these users' });
    }
    await db.query(
      'UPDATE messages SET read_by_recipient=1 WHERE chat_id=? AND sender_id!=? AND read_by_recipient=0',
      [chatId, user.id]
    );

    const [msgs] = await db.query('SELECT * FROM messages WHERE chat_id=? ORDER BY created_at ASC', [chatId]);
    // transform for client
    const out = (msgs || []).map(m => ({
      id: m.id,
      sender: m.sender_role,
      message: m.content,
      created_at: m.created_at
    }));
    res.json(out);
  } catch (err) {
    console.error('GetMessages Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { roomId, sender, message } = req.body;
    if (!roomId || !message) {
      return res.status(400).json({ message: 'roomId and message required' });
    }

    const ids = parseRoom(roomId);
    if (ids.length !== 2) return res.status(400).json({ message: 'Invalid room id' });

    const user = req.user;
    let doctorId, patientId;
    if (user.role === 'doctor') {
      doctorId = user.doctorId;
      patientId = ids.find(i => i !== doctorId);
    } else if (user.role === 'patient') {
      patientId = user.id;
      doctorId = ids.find(i => i !== patientId);
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    if (!doctorId || !patientId) return res.status(400).json({ message: 'Unable to determine participants' });

    const chatId = await ensureChat(doctorId, patientId);
    if (!chatId) {
      return res.status(403).json({ message: 'No chat allowed between these users' });
    }
    const senderId = user.id;
    const senderRole = user.role;

    await db.query(
      'INSERT INTO messages (chat_id, sender_role, sender_id, content) VALUES (?,?,?,?)',
      [chatId, senderRole, senderId, message]
    );

    res.json({ message: 'Message saved' });
  } catch (err) {
    console.error('SendMessage Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// AI chat history pagination
exports.getAIHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const [rows] = await db.query(
      'SELECT * FROM ai_chats WHERE user_id=? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, limit, offset]
    );

    res.json({ page, limit, data: rows });
  } catch (err) {
    console.error('GetAIHistory Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};