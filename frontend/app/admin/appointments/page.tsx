"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/appointments/all");
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800">Appointment Management</h1>
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Total: {appointments.length}
          </span>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase">ID</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Doctor</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Patient Details</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase">Status</th>
                <th className="p-4 font-semibold text-gray-600 text-sm uppercase text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-400">Loading appointments...</td>
                </tr>
              ) : appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 text-gray-500 font-mono text-xs">#{appt.id}</td>
                    <td className="p-4">
                      <p className="font-semibold text-gray-800">{appt.doctorName}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{appt.patientName}</span>
                        <span className="text-sm text-gray-500">{appt.patientEmail}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                        appt.status === "Confirmed" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {appt.status || "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center">
                    <div className="flex flex-col items-center">
                      <p className="text-gray-500 italic">No appointments found in the system.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}