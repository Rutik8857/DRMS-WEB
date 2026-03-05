"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface PatientOption { id: number; name: string; }
interface DoctorPrescription { id: number; patient_id: number; details: string; created_at: string; }

export default function PrescriptionsPage() {
  const [patientId, setPatientId] = useState("");
  const [details, setDetails] = useState("");
  const [patients, setPatients] = useState<PatientOption[]>([]);
  const [list, setList] = useState<DoctorPrescription[]>([]);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [patientsError, setPatientsError] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    setLoadingPatients(true);
    setPatientsError("");
    axios.get("http://localhost:5000/api/doctors/my-patients", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setPatients(res.data);
        // preserve any URL params behaviour if needed (appointment prefill)
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const apptPatientName = params.get('patientName');
          if (apptPatientName) {
            const match = res.data.find((p: PatientOption) => p.name === apptPatientName);
            if (match) setPatientId(match.id.toString());
          }
        }
      })
      .catch(err => {
        console.error('Failed to load patients', err);
        setPatientsError(err?.response?.data?.message || 'Unable to fetch patients');
      })
      .finally(() => setLoadingPatients(false));

    axios.get("http://localhost:5000/api/prescriptions/doctor", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setList(res.data))
      .catch(console.error);
  }, [token]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!patientId || !details) {
      setError("Patient and details are required");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/prescriptions/create", { patientId, details }, { headers: { Authorization: `Bearer ${token}` } });
      setMessage("Prescription created");
      setDetails("");
      // refresh list
      const reload = await axios.get("http://localhost:5000/api/prescriptions/doctor", { headers: { Authorization: `Bearer ${token}` } });
      setList(reload.data);
    } catch (err) {
      setError((err as any)?.response?.data?.message || "Failed to create");
    }
  };

  return (
    <div className="space-y-6 px-6 py-4">
      <h1 className="text-2xl font-bold">Prescriptions</h1>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}

      <form onSubmit={submit} className="space-y-4 bg-white p-4 rounded shadow">
        <div>
          <label className="block text-sm font-medium">Patient</label>
          {loadingPatients ? (
            <p>Loading patients...</p>
          ) : patientsError ? (
            <p className="text-red-600">{patientsError}</p>
          ) : (
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="mt-1 block w-full border rounded p-2"
            >
              <option value="">Select patient</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Details</label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="mt-1 block w-full border rounded p-2"
            rows={4}
          />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
      </form>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">Patient</th>
              <th className="px-3 py-2">Details</th>
              <th className="px-3 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.patient_id}</td>
                <td className="px-3 py-2">{p.details}</td>
                <td className="px-3 py-2">{new Date(p.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
