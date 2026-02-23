"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { MapPin, X, Filter } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
});

export default function FindDoctors() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [specialization, setSpecialization] = useState("All");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setFilteredDoctors(data);
      });
  }, []);

  useEffect(() => {
    if (specialization === "All") {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(
        doctors.filter((d) => d.specialization === specialization),
      );
    }
  }, [specialization, doctors]);

  const specializations = [
    "All",
    ...new Set(doctors.map((d) => d.specialization)),
  ];

  // 🔵 SEND REQUEST
 const sendAppointment = async (doctorId) => {
  if (!patientName || !patientEmail) {
    alert("Enter name & email");
    return;
  }

  await fetch("http://localhost:5000/api/appointments/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      doctorId,
      patientName,
      patientEmail,
    }),
  });

  alert("Appointment request sent");
  setSelectedDoctor(null);
  setPatientName("");
  setPatientEmail("");
};


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">Find Doctors Nearby</h1>

          <div className="flex gap-3">
            <select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="border px-3 py-2 rounded"
            >
              {specializations.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <button
              onClick={() => setIsMapOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              View Map
            </button>
          </div>
        </div>

        {/* DOCTOR CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoctor(doc)}
              className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg"
            >
              <h3 className="text-xl font-bold">{doc.fullName}</h3>
              <p className="text-blue-600">{doc.specialization}</p>
              <p className="text-gray-500 mt-2">{doc.clinicName}</p>
              <p className="text-gray-400">{doc.city}</p>
            </div>
          ))}
        </div>

        {/* MAP MODAL */}
        {isMapOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
            <div className="bg-white w-[90%] h-[80vh] rounded-xl p-4 relative">
              <button
                onClick={() => setIsMapOpen(false)}
                className="absolute right-4 top-4"
              >
                <X />
              </button>

              <MapComponent doctors={filteredDoctors} />
            </div>
          </div>
        )}

        {/* 🔥 DOCTOR DETAILS MODAL */}
        {selectedDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-white w-full max-w-md rounded-xl p-6 relative">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="absolute right-3 top-3"
              >
                <X />
              </button>

              <h2 className="text-2xl font-bold">{selectedDoctor.fullName}</h2>
              <p className="text-blue-600">{selectedDoctor.specialization}</p>
              <p className="mt-2">{selectedDoctor.clinicName}</p>
              <p className="text-gray-500">{selectedDoctor.city}</p>
              <input
                type="text"
                placeholder="Your name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="w-full border p-2 mt-4 rounded"
              />

              <input
                type="email"
                placeholder="Your email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full border p-2 mt-2 rounded"
              />

              <button
                onClick={() => sendAppointment(selectedDoctor.id)}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded"
              >
                Request Appointment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
