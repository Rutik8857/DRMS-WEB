"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  MapPin,
  Briefcase,
  Stethoscope,
  Phone,
  FileBadge,
  ArrowLeft,
  Save,
  Building2,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AddDoctorPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    degree: "",
    email: "",
    password: "",
    city: "",
    district: "",
    state: "",
    workType: "Employee",
    orgName: "",
    designation: "",
    clinicName: "",
    adminContact: "",
    specialization: "",
    otherSpecialization: "",
    diseaseFocus: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/doctors/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add doctor");

      alert("Doctor added successfully");
      router.push("/admin/doctors");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      {/* HEADER */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/doctors" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Register Doctor</h1>
              <p className="text-sm text-slate-500">Create a new professional profile</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 mt-8 space-y-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* SECTION 1: CREDENTIALS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-blue-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-blue-700">
            <User className="w-5 h-5" />
            <h2 className="font-bold">Basic Credentials</h2>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="fullName" placeholder="Dr. Jane Smith" onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Degree</label>
              <div className="relative">
                <FileBadge className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="degree" placeholder="MBBS, MD" onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email / Username</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="email" type="email" placeholder="doctor@medicloud.com" onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: LOCATION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-emerald-700">
            <MapPin className="w-5 h-5" />
            <h2 className="font-bold">Location Details</h2>
          </div>
          <div className="p-6 grid md:grid-cols-3 gap-6">
            <input name="city" placeholder="City" onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input name="district" placeholder="District" onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
            <input name="state" placeholder="State" onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" />
          </div>
        </div>

        {/* SECTION 3: WORK DETAILS */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-purple-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-purple-700">
            <Briefcase className="w-5 h-5" />
            <h2 className="font-bold">Professional Work</h2>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Hospital / Org</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="orgName" placeholder="City General Hospital" onChange={handleChange} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Designation</label>
              <input name="designation" placeholder="Senior Consultant" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 text-red-600">Admin Contact</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input name="adminContact" placeholder="+91 00000 00000" onChange={handleChange} required className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Clinic Name (If Any)</label>
              <input name="clinicName" placeholder="Private Practice Clinic" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none" />
            </div>
          </div>
        </div>

        {/* SECTION 4: SPECIALIZATION */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-orange-50/50 px-6 py-4 border-b border-slate-100 flex items-center gap-2 text-orange-700">
            <Stethoscope className="w-5 h-5" />
            <h2 className="font-bold">Medical Specialization</h2>
          </div>
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <select name="specialization" onChange={handleChange} required className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none">
                <option value="">Select Specialization</option>
                <option value="General Physician">General Physician</option>
                <option value="ENT">ENT</option>
                <option value="Dermatologist">Dermatologist (Skin)</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Other">Other (specify)</option>
            </select>
            <input name="otherSpecialization" placeholder="If 'Other', specify here" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none" />
            <textarea name="diseaseFocus" placeholder="Focus area (e.g., Diabetes, Hypertension, Pediatric surgery...)" onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none md:col-span-2 h-24 resize-none" />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-4 pb-10">
          <Link href="/admin/doctors" className="px-6 py-3 text-slate-600 font-semibold hover:bg-slate-100 rounded-xl transition-all">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-10 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            {loading ? "Saving Profile..." : "Save Doctor Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}