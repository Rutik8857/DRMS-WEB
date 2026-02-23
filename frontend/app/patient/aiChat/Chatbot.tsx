


"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, StopCircle, Globe } from 'lucide-react';

// --- FALLBACK AI LOGIC (Offline) ---
const getFallbackReply = (text: string, lang: string): string => {
  const lower = text.toLowerCase();
  
  if (lang === 'hi') {
    if (lower.includes("namaste") || lower.includes("hello")) return "नमस्ते! मैं आपका हेल्थ असिस्टेंट हूँ। आज आप कैसा महसूस कर रहे हैं?";
    if (lower.includes("bukhaar") || lower.includes("fever")) return "यह बुखार जैसा लग रहा है। पानी पिएं, आराम करें। अगर बुखार 102°F से ज्यादा हो, तो डॉक्टर को दिखाएं।";
    if (lower.includes("sard") || lower.includes("headache")) return "सिरदर्द अक्सर पानी की कमी या तनाव से होता है। पानी पिएं और थोड़ी देर अंधेरे कमरे में आराम करें।";
    return "मैं समझ नहीं पाया। कृपया डॉक्टर से सलाह लें।";
  }

  // English Fallback
  if (lower.includes("hello")) return "Hello! I am your AI Health Assistant. How are you feeling today?";
  if (lower.includes("fever")) return "It sounds like a fever. Stay hydrated and rest. If it exceeds 102°F, see a doctor.";
  return "I'm not sure about that. Please consult a doctor.";
};

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your AI Health Assistant. How can I help you today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // LANGUAGE STATE (Default: English)
  const [language, setLanguage] = useState<'en' | 'hi'>('en'); 

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // --- TOGGLE LANGUAGE ---
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    
    // Add a system message to show language changed
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text: newLang === 'hi' ? "भाषा हिंदी में बदल दी गई है। अब आप हिंदी में बात कर सकते हैं।" : "Language switched to English.", 
      sender: 'bot' 
    }]);
  };

  // --- TEXT TO SPEECH ---
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set Voice Language
      utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // --- TYPEWRITER EFFECT ---
  const simulateTypingEffect = (fullText: string) => {
    setIsLoading(false);
    const botMsgId = Date.now() + 1;
    setMessages(prev => [...prev, { id: botMsgId, text: "", sender: 'bot' }]);
    
    let currentText = "";
    let index = 0;

    const intervalId = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText.charAt(index);
        setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: currentText } : msg
        ));
        index++;
      } else {
        clearInterval(intervalId);
        speak(fullText);
      }
    }, 30);
  };

  // --- VOICE RECOGNITION ---
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    stopSpeaking();

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      
      // Set Recognition Language based on State
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US'; 
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = (e: any) => { console.error(e); setIsListening(false); };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.start();
    } else {
      alert("Browser does not support voice. Use Chrome.");
    }
  };

  // --- SEND MESSAGE ---
  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    // 1. User Message
    setMessages(prev => [...prev, { id: Date.now(), text: textToSend, sender: 'user' }]);
    setInput("");
    setIsLoading(true);
    stopSpeaking();

    try {
        // 2. Call Backend with Language
        const response = await fetch('http://localhost:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message: textToSend,
              language: language // Send current language ('en' or 'hi')
            })
        });
        
        const data = await response.json();
        simulateTypingEffect(data.reply);

    } catch (error) {
        console.error("Error:", error);
        // Fallback
        const fallback = getFallbackReply(textToSend, language);
        simulateTypingEffect(fallback);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-80px)] flex flex-col bg-gray-50 border-x border-gray-200">
      
      {/* HEADER WITH LANGUAGE TOGGLE */}
      <div className="bg-white p-3 shadow-sm flex justify-between items-center px-6 z-10">
        <div className="flex items-center gap-2">
           <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
           <span className="text-sm font-medium text-gray-600">HealthAI ({language === 'en' ? 'English' : 'हिंदी'})</span>
        </div>

        <div className="flex gap-2">
          {isSpeaking && (
            <button onClick={stopSpeaking} className="text-xs flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-200 hover:bg-red-100 transition">
                <StopCircle size={14} className="mr-1" /> Stop
            </button>
          )}

          {/* LANGUAGE TOGGLE BUTTON */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border transition-colors bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          >
            <Globe size={14} />
            {language === 'en' ? 'Switch to Hindi' : 'अंग्रेजी में बदलें'}
          </button>
        </div>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
              msg.sender === 'user' 
              ? 'bg-blue-600 text-white rounded-br-none' 
              : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
            }`}>
              <p className="text-sm md:text-base leading-relaxed">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className="bg-white p-4 border-t border-gray-200 flex gap-2 items-center">
        <button 
          onClick={toggleListening}
          className={`p-3 rounded-full transition-all duration-200 ${
            isListening 
            ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-100' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={language === 'hi' ? "बोलने के लिए दबाएं" : "Hold to speak"}
        >
          <Mic size={22} />
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={isListening ? (language === 'hi' ? "सुन रहा हूँ..." : "Listening...") : (language === 'hi' ? "अपने लक्षण टाइप करें..." : "Type your symptoms...")}
          className="flex-1 border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
        
        <button 
          onClick={() => handleSend()} 
          disabled={!input.trim()}
          className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 shadow-md transition"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;