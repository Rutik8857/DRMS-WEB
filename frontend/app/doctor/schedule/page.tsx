"use client";

import React, { useState } from "react";
import { Plus, Trash2, Clock, Calendar } from "lucide-react";

export default function SchedulePage() {
  const [slots, setSlots] = useState([
    { id: 1, day: "Monday", start: "09:00", end: "12:00" },
    { id: 2, day: "Monday", start: "14:00", end: "17:00" },
    { id: 3, day: "Wednesday", start: "10:00", end: "13:00" },
  ]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Working Schedule</h1>
          <p className="text-slate-500">Define your weekly availability for patient bookings.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200">
          <Plus className="w-5 h-5" /> Add New Slot
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 min-h-[400px]">
            <h3 className="text-sm font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              {day}
              <Calendar className="w-4 h-4 text-slate-400" />
            </h3>
            
            <div className="space-y-3">
              {slots.filter(s => s.day === day).map(slot => (
                <div key={slot.id} className="bg-blue-50 border border-blue-100 p-3 rounded-xl relative group">
                  <div className="flex items-center gap-2 text-blue-700 font-bold text-xs mb-1">
                    <Clock className="w-3 h-3" /> Availability
                  </div>
                  <p className="text-xs text-blue-600 font-medium">
                    {slot.start} - {slot.end}
                  </p>
                  <button className="absolute -top-2 -right-2 bg-white border border-red-100 p-1 rounded-full text-red-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
              
              {slots.filter(s => s.day === day).length === 0 && (
                <p className="text-center text-[10px] text-slate-400 mt-10 italic">No slots added</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center gap-4 text-blue-700">
        <Clock className="w-6 h-6" />
        <div>
          <p className="font-bold">Timezone</p>
          <p className="text-sm">Your current schedule is set in IST (UTC +5:30)</p>
        </div>
      </div>
    </div>
  );
}