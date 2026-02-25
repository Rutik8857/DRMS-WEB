"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Clock, Calendar, Loader2, AlertCircle } from "lucide-react";

const API_BASE = "http://localhost:5000/api/schedule";

export default function SchedulePage() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for new slot form
  const [newSlot, setNewSlot] = useState({
    day: "Monday",
    startTime: "09:00",
    endTime: "10:00",
    slotDuration: 30
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // 1. Memoized Fetch Function (Prevents infinite loops)
  const fetchSchedule = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Or however you store your JWT
      const res = await fetch(`${API_BASE}/my`, {
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();
      setSlots(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load schedule. Please check if you are logged in.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Initial Load
  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  // 3. Add Slot Logic
  const handleAddSlot = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(newSlot)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchSchedule(); // Refresh data
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to add slot");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  // 4. Delete Slot Logic
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        // Optimistic UI update
        setSlots(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Working Schedule</h1>
          <p className="text-slate-500 text-sm">Manage your weekly availability.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md"
        >
          <Plus className="w-5 h-5" /> Add Slot
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <div key={day} className="bg-white rounded-2xl border border-slate-200 p-4 min-h-[300px] shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex justify-between">
              {day} <Calendar className="w-4 h-4" />
            </h3>
            
            <div className="space-y-2">
              {slots
                .filter((s) => s.day === day)
                .map((slot) => (
                  <div key={slot.id} className="bg-blue-50 border border-blue-100 p-3 rounded-xl relative group transition-all hover:border-blue-300">
                    <p className="text-xs font-bold text-blue-700">
                      {slot.startTime.substring(0, 5)} - {slot.endTime.substring(0, 5)}
                    </p>
                    <button 
                      onClick={() => handleDelete(slot.id)}
                      className="absolute -top-2 -right-2 bg-white text-red-500 p-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}

              {slots.filter((s) => s.day === day).length === 0 && (
                <p className="text-[10px] text-slate-400 italic text-center mt-4">No slots</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100">
            <h2 className="text-xl font-bold mb-4 text-slate-800">New Time Slot</h2>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Day</label>
                <select 
                  className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  value={newSlot.day}
                  onChange={(e) => setNewSlot({...newSlot, day: e.target.value})}
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Start</label>
                  <input 
                    type="time" 
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">End</label>
                  <input 
                    type="time" 
                    className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Add Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}