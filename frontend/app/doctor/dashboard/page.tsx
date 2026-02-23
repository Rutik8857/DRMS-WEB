"use client";

import React from "react";
import { 
  Users, 
  Calendar, 
  Clock, 
  DollarSign,
  TrendingUp,
  ArrowUpRight
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

import { cn } from "@/lib/utils";

const stats = [
  { label: "Today Appointments", value: "12", icon: Calendar, color: "text-blue-600", bg: "bg-blue-100" },
  { label: "Total Patients", value: "1,240", icon: Users, color: "text-emerald-600", bg: "bg-emerald-100" },
  { label: "Pending Requests", value: "05", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  { label: "Total Earnings", value: "$4,250", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-100" },
];

const data = [
  { name: 'Mon', visits: 40, appointments: 24 },
  { name: 'Tue', visits: 30, appointments: 13 },
  { name: 'Wed', visits: 20, appointments: 98 },
  { name: 'Thu', visits: 27, appointments: 39 },
  { name: 'Fri', visits: 18, appointments: 48 },
  { name: 'Sat', visits: 23, appointments: 38 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back, Dr. Johnson</h1>
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
              <AreaChart data={data}>
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
              <BarChart data={data}>
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