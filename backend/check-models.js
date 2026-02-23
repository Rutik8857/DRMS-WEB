// backend/check-models.js

// --- PASTE YOUR KEY BELOW ---
const API_KEY = "AIzaSyCBCEF0TDeOX14_CS8acGadgG5YuJ3h3sg"; 

async function getAvailableModels() {
  console.log("🔍 Asking Google for available models...");
  
  try {
    // We use direct 'fetch' to bypass any library version issues
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error.message);
      return;
    }

    console.log("\n✅ AVAILABLE MODELS FOR YOU:");
    console.log("-----------------------------");
    // Filter to show only 'generateContent' models (the ones for chat)
    const chatModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
    
    chatModels.forEach(m => {
      console.log(`Model Name: ${m.name.replace("models/", "")}`);
    });
    console.log("-----------------------------\n");
    console.log("👉 Please copy one of the names above into your code.");

  } catch (error) {
    console.error("❌ Network Error:", error.message);
  }
}

getAvailableModels();