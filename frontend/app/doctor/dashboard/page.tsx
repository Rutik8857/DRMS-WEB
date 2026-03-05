"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign,
  TrendingUp,
  AlertCircle,
  RefreshCcw
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

import { cn } from "@/lib/utils";
import { fetchWithAuth } from "@/lib/api";

// Define interfaces for API data
interface DashboardSummary {
  todayAppointments: number;
  totalPatients: number;
  pendingRequests: number;
  totalEarnings: number;
}

interface AnalyticsData {
  name: string;
  visits: number;
  appointments: number;
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch both endpoints in parallel using the centralized utility
      const [summaryData, analyticsData] = await Promise.all([
        fetchWithAuth("/doctor/dashboard/summary"),
        fetchWithAuth("/doctor/dashboard/analytics")
      ]);

      setSummary(summaryData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      console.error("Dashboard Error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-slate-200 rounded"></div>
          <div className="h-4 w-96 bg-slate-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 h-32">
              <div className="flex justify-between mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="w-16 h-6 bg-slate-200 rounded-lg"></div>
              </div>
              <div className="h-4 w-24 bg-slate-200 rounded mb-2"></div>
              <div className="h-8 w-32 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-96"></div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 h-96"></div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-semibold text-slate-900">Failed to load dashboard</h2>
        <p className="text-slate-500">{error}</p>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCcw className="w-4 h-4" />
          Retry
        </button>
      </div>
    );
  }

  // Prepare stats data for rendering
  const stats = [
    { 
      label: "Today Appointments", 
      value: summary?.todayAppointments.toString() || "0", 
      icon: Calendar, 
      color: "text-blue-600", 
      bg: "bg-blue-100" 
    },
    { 
      label: "Total Patients", 
      value: summary?.totalPatients.toLocaleString() || "0", 
      icon: Users, 
      color: "text-emerald-600", 
      bg: "bg-emerald-100" 
    },
    { 
      label: "Pending Requests", 
      value: summary?.pendingRequests.toString().padStart(2, '0') || "00", 
      icon: Clock, 
      color: "text-amber-600", 
      bg: "bg-amber-100" 
    },
    { 
      label: "Total Earnings", 
      value: `$${summary?.totalEarnings.toLocaleString() || "0"}`, 
      icon: DollarSign, 
      color: "text-purple-600", 
      bg: "bg-purple-100" 
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back, Doctor</h1>
        <p className="text-slate-500">Here's what's happening with your clinic today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-xl", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <span className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                +12% <TrendingUp className="w-3 h-3" />
              </span>
            </div>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Appointments Trend</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip />
                <Area type="monotone" dataKey="appointments" stroke="#2563eb" fillOpacity={1} fill="url(#colorApp)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Patient Visits</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="visits" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}