"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Stethoscope, 
  Trash2, 
  Plus, 
  Mail, 
  Loader2,
  MapPin,
  Phone,
  Building2,
  MoreVertical,
  Edit3
} from "lucide-react";

export default function DoctorsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/doctors");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const deleteDoctor = async (id: number) => {
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await fetch(`http://localhost:5000/api/doctors/${id}`, { method: "DELETE" });
      fetchDoctors();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filteredDoctors = doctors.filter((doc: any) =>
    doc.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Doctor Management</h1>
            <p className="text-slate-500 text-sm">Overview of all registered medical professionals in the system.</p>
          </div>

          <button
            onClick={() => router.push("/admin/doctors/new")}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-100 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add New Doctor
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative group max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by name, specialty, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all text-sm"
          />
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center text-slate-500 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
              <p className="font-semibold text-slate-600">Loading directory...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse table-auto">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200">
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Doctor Profile</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Specialization</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Location</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Workplace</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredDoctors.map((doc: any) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* PROFILE COLUMN */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm border border-indigo-200 shadow-sm">
                            {doc.fullName?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{doc.fullName}</p>
                            <p className="text-[12px] text-slate-400 font-medium">{doc.degree || "MBBS"}</p>
                          </div>
                        </div>
                      </td>

                      {/* SPECIALIZATION */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-indigo-700 bg-indigo-50/50 px-2.5 py-1 rounded-lg w-fit border border-indigo-100">
                          <Stethoscope className="w-3.5 h-3.5" />
                          <span className="text-[12px] font-bold">{doc.specialization}</span>
                        </div>
                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-sm">{doc.city}, {doc.district}</span>
                        </div>
                      </td>

                      {/* WORKPLACE */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            {doc.orgName || doc.clinicName || "Private Practice"}
                          </span>
                          <span className="text-[11px] text-slate-400 ml-5">{doc.workType}</span>
                        </div>
                      </td>

                      {/* CONTACT */}
                      <td className="px-6 py-4 whitespace-nowrap">
                         <div className="flex flex-col gap-0.5">
                            <span className="text-sm text-slate-700 flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-slate-400" />
                                {doc.adminContact}
                            </span>
                            <span className="text-[11px] text-slate-400 flex items-center gap-1.5 uppercase ml-5">
                                <Mail className="w-3 h-3" /> {doc.email}
                            </span>
                         </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteDoctor(doc.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredDoctors.length === 0 && (
            <div className="py-24 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <Search className="w-6 h-6 text-slate-300" />
              </div>
              <h3 className="text-slate-800 font-bold">No doctors found</h3>
              <p className="text-slate-500 text-sm mt-1">Try adjusting your search filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}