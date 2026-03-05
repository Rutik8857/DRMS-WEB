



"use client";

import React, { useState, useEffect } from "react";
import { Search, Check, X, Eye, Filter, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Define a type for your appointment for better TS support
interface Appointment {
  id: number;
  patientName: string;
  date: string;
  time: string;
  status: string;
  type: string;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");


  const doctorId = typeof window !== "undefined"
  ? localStorage.getItem("doctorId")
  : "";

  // 1. Fetch Data from Backend
useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    setLoading(false);
    return;
  }

  const fetchAppointments = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/appointments/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchAppointments();
}, []);



  console.log("doctorId:", doctorId);

  // 2. Update Status in Backend
  // const updateStatus = async (id: string, newStatus: string) => {
  //   try {
  //     const response = await fetch(`http://localhost:5000/api/appointments/status/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status: newStatus }),
  //     });

  //     if (response.ok) {
  //       setAppointments(prev => 
  //         prev.map(app => app.id === id ? { ...app, status: newStatus } : app)
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error updating status:", error);
  //   }
  // };


  const updateStatus = async (id: number, newStatus: string) => {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `http://localhost:5000/api/appointments/status/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus }),
    }
  );

  if (response.ok) {
    setAppointments(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      )
    );
  }
};

  // 3. Filter Logic (Search)
  const filteredAppointments = appointments.filter(app =>
   (app.patientName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Appointments</h1>
          <p className="text-slate-500">Review and manage your scheduled consultations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4">Patient Name</th>
              <th className="px-6 py-4">Date & Time</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAppointments.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50 transition-colors group text-sm">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800">{app.patientName}</div>
                  <div className="text-xs text-slate-500 font-medium">{app.type}</div>
                </td>
                <td className="px-6 py-4">
                   <div className="font-medium text-slate-700">{app.date}</div>
                   <div className="text-xs text-slate-500">{app.time}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    app.status === "Approved" ? "bg-blue-100 text-blue-600" :
                    app.status === "Completed" ? "bg-emerald-100 text-emerald-600" :
                    app.status === "Rejected" ? "bg-red-100 text-red-600" :
                    "bg-amber-100 text-amber-600"
                  )}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {app.status === "Pending" && (
                      <>
                        <button onClick={() => updateStatus(app.id, "Approved")} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => updateStatus(app.id, "Rejected")} className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {app.status === "Approved" && (
                      <button onClick={() => updateStatus(app.id, "Completed")} className="text-xs font-bold px-3 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg transition-all">
                        Complete
                      </button>
                    )}
                    {app.status === "Completed" && (
                      <a href={`/doctor/prescriptions?appointmentId=${app.id}&patientName=${encodeURIComponent(app.patientName)}`} className="text-xs font-bold px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all">
                        Prescribe
                      </a>
                    )}
                    <button className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAppointments.length === 0 && (
          <div className="p-10 text-center text-slate-500">No appointments found.</div>
        )}
      </div>
    </div>
  );
}