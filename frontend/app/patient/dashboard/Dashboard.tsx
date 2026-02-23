"use client";

import React from 'react';

const DASHBOARD_STATS = [
  { title: "Total Reports", value: "1,240", color: "bg-blue-500" },
  { title: "Active Users", value: "356", color: "bg-green-500" },
  { title: "Diseases Identified", value: "45", color: "bg-purple-500" },
  { title: "Consultations", value: "89", color: "bg-orange-500" },
];

const Dashboard = () => (
  <div className="flex min-h-screen bg-gray-50">
    {/* Sidebar (Visual only) */}
    <div className="hidden md:block w-64 bg-white border-r border-gray-200 p-6">
      <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Admin Menu</h3>
      <div className="space-y-1">
        {['Overview', 'Patients', 'Reports', 'Settings'].map((item, i) => (
          <div key={i} className={`p-2 rounded cursor-pointer ${i===0 ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
            {item}
          </div>
        ))}
      </div>
    </div>

    {/* Main Content */}
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Community Health Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {DASHBOARD_STATS.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts (CSS only for simplicity) */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Weekly Disease Trends</h3>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[40, 65, 30, 85, 50, 90, 60].map((h, i) => (
              <div key={i} className="w-full bg-blue-100 rounded-t-lg relative group">
                <div style={{height: `${h}%`}} className="bg-blue-600 rounded-t-lg transition-all duration-500 relative">
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded">
                    {h} reports
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-6">Common Ailments</h3>
          <div className="space-y-4">
            {[
              { label: 'Flu / Viral', val: '75%', color: 'bg-orange-500' },
              { label: 'Skin Allergy', val: '45%', color: 'bg-purple-500' },
              { label: 'Migraine', val: '30%', color: 'bg-blue-500' },
              { label: 'Food Poisoning', val: '20%', color: 'bg-red-500' }
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 font-medium">{item.label}</span>
                  <span className="text-gray-900 font-bold">{item.val}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className={`h-2.5 rounded-full ${item.color}`} style={{width: item.val}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;