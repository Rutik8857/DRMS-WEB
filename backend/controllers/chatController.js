


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
require("dotenv").config();

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

exports.chatWithAI = async (req, res) => {
  const { message, language } = req.body;

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

    res.json({ reply: completion.choices[0].message.content });

  } catch (error) {
    console.log("AI ERROR:", error);
    res.json({ reply: "AI temporarily unavailable." });
  }
};