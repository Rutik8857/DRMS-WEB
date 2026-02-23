"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, X, Filter } from "lucide-react";

// 🔄 Dynamic Import to disable SSR for Leaflet (Crucial for Next.js)
const MapComponent = dynamic(() => import("../../components/MapComponent"), {
  ssr: false,
  loading: () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Loading Map...</div>,
});

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [specialization, setSpecialization] = useState("All");

  // 1. Fetch Doctors Data
  useEffect(() => {
    fetch("http://localhost:5000/api/doctors-map")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setFilteredDoctors(data);
      })
      .catch((err) => console.error("Failed to load doctors", err));
  }, []);

  // 2. Filter Logic (Updates List & Map)
  useEffect(() => {
    if (specialization === "All") {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter((d) => d.specialization === specialization));
    }
  }, [specialization, doctors]);

  const specializations = ["All", ...new Set(doctors.map((d) => d.specialization))];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Find Doctors Nearby</h1>
          
          <div className="flex gap-3 items-center">
            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <select
                className="pl-9 pr-4 py-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
              >
                {specializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            {/* View Map Button */}
            <button
              onClick={() => setIsMapOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition shadow-sm"
            >
              <MapPin size={18} /> View Map
            </button>
          </div>
        </div>

        {/* Doctors List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{doc.name}</h3>
                  <p className="text-blue-600 font-medium">{doc.specialization}</p>
                </div>
                <div className="bg-blue-50 p-2 rounded-full">
                  <MapPin size={20} className="text-blue-600" />
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-4">🏥 {doc.hospital}</p>
            </div>
          ))}
        </div>

        {/* 🗺️ Map Modal Overlay */}
        {isMapOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-5xl h-[80vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
              
              {/* Modal Header */}
              <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MapPin className="text-blue-600" /> Doctor Locations
                </h2>
                <button onClick={() => setIsMapOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Map Container */}
              <div className="flex-1 relative">
                <MapComponent doctors={filteredDoctors} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}