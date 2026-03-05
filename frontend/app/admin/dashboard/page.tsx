"use client";

import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  UserPlus, 
  CalendarCheck, 
  TrendingUp, 
  TrendingDown,
  ArrowUpRight,
  Filter,
  AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { cn } from "@/lib/utils";
import Link from 'next/link';

// --- Dummy Data ---

const REVENUE_DATA = {
  "7days": [
    { name: 'Mon', revenue: 4000 },
    { name: 'Tue', revenue: 3000 },
    { name: 'Wed', revenue: 5000 },
    { name: 'Thu', revenue: 4500 },
    { name: 'Fri', revenue: 6000 },
    { name: 'Sat', revenue: 5500 },
    { name: 'Sun', revenue: 7000 },
  ],
  "30days": [
    { name: 'Week 1', revenue: 15000 },
    { name: 'Week 2', revenue: 22000 },
    { name: 'Week 3', revenue: 18000 },
    { name: 'Week 4', revenue: 25000 },
  ],
  "6months": [
    { name: 'Jan', revenue: 45000 },
    { name: 'Feb', revenue: 52000 },
    { name: 'Mar', revenue: 48000 },
    { name: 'Apr', revenue: 61000 },
    { name: 'May', revenue: 55000 },
    { name: 'Jun', revenue: 67000 },
  ],
  "1year": [
    { name: 'Q1', revenue: 120000 },
    { name: 'Q2', revenue: 150000 },
    { name: 'Q3', revenue: 135000 },
    { name: 'Q4', revenue: 180000 },
  ],
};

interface StatCardData {
  title: string;
  value: string | number;
  trend: string;
  trendType: "up" | "down";
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
  href: string;
}

const API_BASE_URL = "http://localhost:5000";

// --- Sub-components ---

const StatCard = ({ card }: { card: StatCardData }) => {
  const Icon = card.icon;
  return (
    <Link href={card.href} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className={cn("p-3 rounded-xl", card.bg)}>
          <Icon className={cn("w-6 h-6", card.color)} />
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          card.trendType === 'up' ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
        )}>
          {card.trendType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {card.trend}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-slate-500 text-sm font-medium">{card.title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
      </div>
    </Link>
  );
};

const LoadingSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-pulse">
    <div className="h-12 w-12 bg-slate-200 rounded-xl mb-4"></div>
    <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
    <div className="h-8 w-12 bg-slate-200 rounded"></div>
  </div>
);

// --- Main Dashboard Page ---

export default function Dashboard() {
  const [filter, setFilter] = useState<keyof typeof REVENUE_DATA>("30days");
  const [stats, setStats] = useState({
    appointments: 0,
    doctors: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stats from backend APIs
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get JWT token from localStorage
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        const headers = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        // Fetch doctors count
        const doctorsResponse = await axios.get(
          `${API_BASE_URL}/api/doctors`,
          { headers }
        );
        const doctorsCount = Array.isArray(doctorsResponse.data) 
          ? doctorsResponse.data.length 
          : doctorsResponse.data?.length || 0;

        // Fetch appointments count
        const appointmentsResponse = await axios.get(
          `${API_BASE_URL}/api/appointments`,
          { headers }
        );
        const appointmentsCount = Array.isArray(appointmentsResponse.data) 
          ? appointmentsResponse.data.length 
          : appointmentsResponse.data?.length || 0;

        // Fetch users count - using the admin endpoint pattern
        const usersResponse = await axios.get(
          `${API_BASE_URL}/api/admins`,
          { headers }
        );
        const usersCount = usersResponse.data?.count || 0;

        setStats({
          appointments: appointmentsCount,
          doctors: doctorsCount,
          users: usersCount,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError(
          err instanceof Error 
            ? err.message 
            : "Failed to fetch dashboard statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Build dynamic stat cards with fetched data
  const STATS_CARDS: StatCardData[] = [
    {
      title: "Total Appointments",
      value: loading ? "-" : stats.appointments.toLocaleString(),
      trend: "+12.5%",
      trendType: "up",
      icon: CalendarCheck,
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/admin/appointments"
    },
    {
      title: "Total Doctors",
      value: loading ? "-" : stats.doctors.toLocaleString(),
      trend: "+3 this week",
      trendType: "up",
      icon: UserPlus,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/admin/doctors"
    },
    {
      title: "Total Users",
      value: loading ? "-" : stats.users.toLocaleString(),
      trend: "-2.1%",
      trendType: "down",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      href: "/admin/users"
    }
  ];

  const activeData = useMemo(() => REVENUE_DATA[filter], [filter]);

  return (
    <div className="space-y-8 p-6 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Welcome back, Admin. Here is what's happening today.</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200">
          <ArrowUpRight className="w-4 h-4" />
          Export Reports
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Failed to Load Statistics</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <p className="text-xs text-red-600 mt-2">
              Make sure the backend API is running at {API_BASE_URL}
            </p>
          </div>
        </div>
      )}

      {/* 1️⃣ Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <>
            <LoadingSkeleton />
            <LoadingSkeleton />
            <LoadingSkeleton />
          </>
        ) : (
          STATS_CARDS.map((card, idx) => (
            <StatCard key={idx} card={card} />
          ))
        )}
      </div>

      {/* 2️⃣ & 3️⃣ Revenue Graph & Filter Section */}
      <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Revenue Analytics</h2>
            <p className="text-sm text-slate-500">Track hospital earnings and billing performance.</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-200">
            <div className="flex items-center px-2 text-slate-400">
              <Filter className="w-4 h-4" />
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="bg-transparent text-sm font-medium text-slate-600 outline-none pr-4 cursor-pointer"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="6months">Last 6 months</option>
              <option value="1year">Last 1 year</option>
            </select>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  padding: '12px'
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Meta Info */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          Last updated: Today at 11:28 AM
        </p>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-xs text-slate-500">Revenue</span>
          </div>
        </div>
      </div>
    </div>
  );
}