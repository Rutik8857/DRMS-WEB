"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";

interface PatientPrescription { id: number; doctorName: string; details: string; created_at: string; }

export default function PatientPrescriptions() {
  const [list, setList] = useState<PatientPrescription[]>([]);
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:5000/api/prescriptions/my", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setList(res.data as PatientPrescription[]))
      .catch(console.error);
  }, [token]);

  return (
    <div className="space-y-6 px-6 py-4">
      <h1 className="text-2xl font-bold">My Prescriptions</h1>
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">Doctor</th>
              <th className="px-3 py-2">Details</th>
              <th className="px-3 py-2">Created</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p: PatientPrescription) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.doctorName}</td>
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
