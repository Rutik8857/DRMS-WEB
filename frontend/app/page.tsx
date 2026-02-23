
"use client"; // <--- ADD THIS LINE HERE

import React, { useState } from 'react';

// Import Components
import Navbar from '../components/patient/Navbar';
import LandingPage from './patient/LandingPage';
import Chatbot from './patient/aiChat/Chatbot';
import Report from './patient/reports/Report';
import Scanner from './patient/scanner/Scanner';
import Doctors from './patient/doctors/Doctors';
import Dashboard from './patient/dashboard/Dashboard';
import Footer from '../components/patient/Footer';

// MAIN APP COMPONENT
export default function App() {
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-800">
      <Navbar setPage={setActivePage} activePage={activePage} />
      
      <main>
        {activePage === 'home' && <LandingPage setPage={setActivePage} />}
        {activePage === 'chat' && <Chatbot />}
        {activePage === 'report' && <Report />}
        {activePage === 'scan' && <Scanner />}
        {activePage === 'doctors' && <Doctors />}
        {activePage === 'dashboard' && <Dashboard />}
      </main>

      {activePage === 'home' && <Footer />}
    </div>
  );
}