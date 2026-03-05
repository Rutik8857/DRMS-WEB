"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // 🔍 Debugging: Check what role is actually returned
      console.log("Login Successful. Server Response:", data);

      // 1. Save Data
     // 1. Save Data
localStorage.setItem("token", data.token);
localStorage.setItem("role", data.role);
localStorage.setItem("user", JSON.stringify(data.user));

if (data.role.toLowerCase().trim() === "doctor") {
  // the backend returns a doctor object with its own id field
  const dId = data.doctor?.id || data.user?.id;
  if (dId) localStorage.setItem("doctorId", String(dId));
}

// ⭐ IMPORTANT: cookie set for middleware
document.cookie = `user_role=${data.role.toLowerCase().trim()}; path=/`;

// 2. Normalize role
const role = data.role.toLowerCase().trim();

// 3. Redirect (use full reload so middleware read cookie)
setTimeout(() => {
  if (role === "admin") {
    window.location.href = "/admin/dashboard";
  } else if (role === "doctor") {
    window.location.href = "/doctor/dashboard";
  } else if (role === "patient") {
    window.location.href = "/";
  } else {
    setError("Unknown role: " + role);
  }
}, 200);

    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg w-80 shadow space-y-4">
        <h2 className="text-xl font-bold text-center">Login</h2>
        
        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded">
            {error}
          </div>
        )}

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border p-2"
          required
        />

        <div className="text-right text-sm">
          <Link href="/forgot" className="text-blue-600 hover:underline">Forgot password?</Link>
        </div>

        <button 
          disabled={loading}
          className={`w-full text-white py-2 rounded ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
