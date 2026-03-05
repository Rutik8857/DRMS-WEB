"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  CalendarCheck,
  Clock,
  MessageSquare,
  LogOut,
  User,
  Menu,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarLinks = [
  { name: "Dashboard", href: "/doctor/dashboard", icon: LayoutDashboard },
  { name: "Appointments", href: "/doctor/appointments", icon: CalendarCheck },
  { name: "Schedule", href: "/doctor/schedule", icon: Clock },
  // { name: "Chat", href: "/doctor/chat", icon: MessageSquare },
  { name: "Prescriptions", href: "/doctor/prescriptions", icon: User },
];

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [doctor, setDoctor] = useState<any>(null);

  // useEffect(() => {
  //   const role = localStorage.getItem("role");
  //   if (role !== "doctor") {
  //     router.push("/login");
  //   }
  //   setIsMounted(true);
  // }, [router]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");

    if (role !== "doctor" || !token) {
      router.push("/login");
      return;
    }

    // 🔥 fetch doctor data
    fetch("http://localhost:5000/api/doctors/my-data", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Doctor:", data);
        setDoctor(data.doctor);
        setIsMounted(true);
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!isMounted) return null;

  const handleLogout = () => {
    localStorage.removeItem("role");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50",
          isSidebarOpen ? "w-64" : "w-20",
        )}
      >
        <div className="p-6 flex items-center gap-3 text-blue-600">
          <Stethoscope className="w-8 h-8" />
          {isSidebarOpen && (
            <span className="font-bold text-xl tracking-tight">MediCloud</span>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-xl transition-all font-medium",
                  pathname === link.href
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-600",
                )}
              >
                <Icon className="w-5 h-5" />
                {isSidebarOpen && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-3 py-3 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-800">
                {doctor ? doctor.fullName : "Doctor"}
              </p>

              <p className="text-xs text-slate-500 font-medium">
                {doctor ? doctor.specialization : ""}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </header>

        <main className="p-8 overflow-y-auto">{children}</main>

        <footer className="p-6 text-center text-slate-400 text-sm border-t border-slate-200 bg-white">
          &copy; 2026 MediCloud Health Systems. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
