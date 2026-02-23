// backend/debug-models.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function checkModels() {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) {
    console.error("❌ Error: GOOGLE_API_KEY is missing in .env file");
    return;
  }

  console.log("🔍 Testing API Key connection...");
  const genAI = new GoogleGenerativeAI(key);

  // Array of models to test
  const modelsToTest = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];

  for (const modelName of modelsToTest) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say hello");
      const response = await result.response;
      console.log(`✅ SUCCESS! ${modelName} is working.`);
      console.log(`   Response: ${response.text()}`);
      
      // If we found a working one, stop testing
      return; 
    } catch (error) {
      console.error(`❌ FAILED ${modelName}: ${error.message.split('[')[0]}`); // Print clean error
    }
  }
  
  console.log("\n❌ All models failed. Please check your API Key permissions in Google AI Studio.");
}

checkModels();