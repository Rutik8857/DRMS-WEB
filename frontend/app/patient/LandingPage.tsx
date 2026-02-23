"use client";

import React from 'react';
import { Mic, Camera, FileText, MapPin, Activity, Shield } from 'lucide-react';

interface LandingPageProps {
  setPage: (page: string) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setPage }) => (
  <div className="flex flex-col min-h-screen">
    {/* Hero Section */}
    <div className="bg-gradient-to-right from-blue-50 to-indigo-50 py-20">
      <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          AI Powered <span className="text-blue-600">Voice Health Assistant</span>
        </h1>
        <p className="mt-4 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Get instant health guidance through voice consultation, analyze medical reports, and find doctors nearby.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => setPage('chat')}
            className="flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg shadow-lg hover:shadow-xl transition"
          >
            <Mic className="mr-2 h-5 w-5" /> Start Voice Consultation
          </button>
          <button 
            onClick={() => setPage('scan')}
            className="flex items-center px-8 py-3 border border-gray-300 text-base font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 md:py-4 md:text-lg shadow-sm transition"
          >
            <Camera className="mr-2 h-5 w-5" /> Scan Report
          </button>
        </div>
      </div>
    </div>

    {/* Features */}
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: <Mic className="h-8 w-8 text-blue-500" />, title: "Voice Consultation", desc: "Speak naturally to describe your symptoms." },
            { icon: <FileText className="h-8 w-8 text-green-500" />, title: "AI Health Reports", desc: "Get detailed summaries and precautions." },
            { icon: <Camera className="h-8 w-8 text-purple-500" />, title: "OCR Scanner", desc: "Scan prescriptions and lab reports instantly." },
            { icon: <MapPin className="h-8 w-8 text-red-500" />, title: "Find Doctors", desc: "Locate specialists near you." },
            { icon: <Activity className="h-8 w-8 text-orange-500" />, title: "Health Dashboard", desc: "Track community health trends." },
            { icon: <Shield className="h-8 w-8 text-teal-500" />, title: "Secure & Private", desc: "Your health data is encrypted and safe." },
          ].map((feature, idx) => (
            <div key={idx} className="p-6 bg-gray-50 rounded-xl hover:shadow-md transition duration-300">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-medium text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default LandingPage;