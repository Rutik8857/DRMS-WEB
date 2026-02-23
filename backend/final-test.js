// backend/final-test.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// --- PASTE YOUR KEY INSIDE THE QUOTES BELOW ---
const API_KEY = "AIzaSyCBCEF0TDeOX14_CS8acGadgG5YuJ3h3sg"; 

async function testConnection() {
  console.log("🚀 Starting Direct Connection Test...");

  if (API_KEY === "PASTE_YOUR_KEY_HERE" || !API_KEY) {
    console.error("❌ STOP: You forgot to paste your API Key in the code!");
    return;
  }

  const genAI = new GoogleGenerativeAI(API_KEY);
  
  try {
    // We use 'gemini-1.5-flash' because it is the current standard
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    console.log("... Sending request to Google ...");
    const result = await model.generateContent("Are you online?");
    const response = await result.response;
    
    console.log("\n✅ SUCCESS! The API is working.");
    console.log("🤖 AI Replied:", response.text());

  } catch (error) {
    console.error("\n❌ CRITICAL FAILURE");
    console.error("------------- ERROR DETAILS -------------");
    console.error(error); // This will print the FULL error
    console.error("-----------------------------------------");
    
    if (error.message.includes("API_KEY_INVALID")) {
      console.log("👉 FIX: Your API Key is wrong. Generate a new one.");
    } else if (error.message.includes("quota")) {
      console.log("👉 FIX: You used up your free limit.");
    } else if (error.message.includes("fetch failed")) {
      console.log("👉 FIX: You have no internet, or a firewall is blocking Google.");
    }
  }
}

testConnection();