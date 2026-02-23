"use client";

import { useState } from "react";
import Link from "next/link"; // Assuming you're using Next.js for routing

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: "",
    location: "",
    age: "",
    gender: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    alert(data.message || "Error");
  };

  const inputStyle = "w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="text-gray-500 mt-2">Join our healthcare community today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Base Fields */}
          <input name="name" placeholder="Full Name" onChange={handleChange} className={inputStyle} required />
          <input name="email" type="email" placeholder="Email Address" onChange={handleChange} className={inputStyle} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} className={inputStyle} required />

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Register as:</label>
            <select name="role" onChange={handleChange} className={inputStyle}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Conditional Doctor Fields */}
          {form.role === "doctor" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <input name="specialization" placeholder="Medical Specialization" onChange={handleChange} className={inputStyle} />
              <input name="location" placeholder="Clinic/Hospital Location" onChange={handleChange} className={inputStyle} />
            </div>
          )}

          {/* Conditional Patient Fields */}
          {form.role === "patient" && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <input name="age" type="number" placeholder="Age" onChange={handleChange} className={inputStyle} />
              <select name="gender" onChange={handleChange} className={inputStyle}>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md transition duration-200 transform hover:-translate-y-0.5">
            Sign Up
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}