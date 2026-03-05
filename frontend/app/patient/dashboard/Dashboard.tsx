// "use client";

// import React, { useEffect, useState, useCallback } from "react";
// // import { fetchWithAuth } from '@/lib/api';
// import { Loader2, AlertCircle, RefreshCcw, Filter, X } from "lucide-react";

// interface DashboardSummary {
//   totalReports: number;
//   activeUsers: number;
//   diseasesIdentified: number;
//   consultations: number;
// }

// interface WeeklyTrend {
//   day: string;
//   reports: number;
// }

// interface CommonAilment {
//   label: string;
//   percentage: number;
// }

// interface DashboardAnalytics {
//   weeklyTrends: WeeklyTrend[];
//   commonAilments: CommonAilment[];
// }

// interface FilterState {
//   country: string;
//   state: string;
//   disease: string;
//   from: string;
//   to: string;
// }

// const Dashboard = () => {
//   const [summary, setSummary] = useState<DashboardSummary | null>(null);
//   const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [filters, setFilters] = useState<FilterState>({
//     country: "",
//     state: "",
//     disease: "",
//     from: "",
//     to: "",
//   });

//   const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(
//     null,
//   );

//   const fetchDashboardData = useCallback(async (activeFilters: FilterState) => {
//     try {
//       if (!activeFilters.country || activeFilters.country.length < 3) {
//         setSummary(null);
//         setAnalytics(null);
//         setLoading(false);
//         return;
//       }

//       setLoading(true);
//       setError(null);

//       const queryParams = new URLSearchParams();
//       Object.entries(activeFilters).forEach(([key, value]) => {
//         if (value) queryParams.append(key, value);
//       });

//       const queryString = `?${queryParams.toString()}`;

//       // 🔥 PUBLIC FETCH (NO AUTH)
//       const summaryRes = await fetch(
//         `http://localhost:5000/patient/dashboard/summary${queryString}`,
//       );

//       if (!summaryRes.ok) {
//         const errData = await summaryRes.json();
//         throw new Error(errData.message || "Summary fetch failed");
//       }

//       const summaryData = await summaryRes.json();

//       let analyticsData = null;

//       const analyticsRes = await fetch(
//         `http://localhost:5000/patient/dashboard/analytics${queryString}`,
//       );

//       if (analyticsRes.ok) {
//         analyticsData = await analyticsRes.json();
//       }

//       setSummary(summaryData);
//       setAnalytics(analyticsData);
//     } catch (err: any) {
//       console.error("Dashboard Fetch Error:", err);
//       setError(err.message || "Failed to load dashboard data");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     const initial = {
//       country: "",
//       state: "",
//       disease: "",
//       from: "",
//       to: "",
//     };
//     setAppliedFilters(initial);
//     fetchDashboardData(initial);
//   }, []);

//   useEffect(() => {
//     if (!appliedFilters || appliedFilters.country.length < 3) return;
//     const intervalId = setInterval(() => {
//       fetchDashboardData(appliedFilters);
//     }, 30000);
//     return () => clearInterval(intervalId);
//   }, [appliedFilters, fetchDashboardData]);

//   const handleFilterChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({ country: "", state: "", disease: "", from: "", to: "" });
//     setAppliedFilters(null);
//   };

//   const applyFilters = () => {
//     const { country, state, disease, from, to } = filters;
//     if (country.length < 3) return;
//     if (!country || !state || !disease || !from || !to) return;
//     setAppliedFilters(filters);
//     fetchDashboardData(filters);
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//           <p className="text-gray-500">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-sm border border-gray-200">
//           <AlertCircle className="h-12 w-12 text-red-500" />
//           <h3 className="text-lg font-semibold text-gray-900">
//             Error Loading Data
//           </h3>
//           <p className="text-gray-500">{error}</p>
//           <button
//             onClick={() =>
//               fetchDashboardData(
//                 appliedFilters || {
//                   country: "",
//                   state: "",
//                   disease: "",
//                   from: "",
//                   to: "",
//                 },
//               )
//             }
//             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <RefreshCcw className="w-4 h-4" />
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const stats = [
//     {
//       title: "Total Reports",
//       value: summary?.totalReports.toLocaleString() || "0",
//       color: "bg-blue-500",
//     },
//     {
//       title: "Active Users",
//       value: summary?.activeUsers.toLocaleString() || "0",
//       color: "bg-green-500",
//     },
//     {
//       title: "Diseases Identified",
//       value: summary?.diseasesIdentified.toLocaleString() || "0",
//       color: "bg-purple-500",
//     },
//     {
//       title: "Consultations",
//       value: summary?.consultations.toLocaleString() || "0",
//       color: "bg-orange-500",
//     },
//   ];

//   const maxReports = analytics
//     ? Math.max(...analytics.weeklyTrends.map((d) => d.reports))
//     : 100;
//   const ailmentColors = [
//     "bg-orange-500",
//     "bg-purple-500",
//     "bg-blue-500",
//     "bg-red-500",
//   ];

//   // main render
//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <div className="hidden md:block w-64 bg-white border-r border-gray-200 p-6">
//         <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">
//           Admin Menu
//         </h3>
//         <div className="space-y-1">
//           {["Overview", "Patients", "Reports", "Settings"].map((item, i) => (
//             <div
//               key={i}
//               className={`p-2 rounded cursor-pointer ${i === 0 ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
//             >
//               {item}
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex-1 p-8">
//         <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
//           <h2 className="text-2xl font-bold text-gray-800">
//             Community Health Overview
//           </h2>
//           <div className="flex items-center gap-4">
//             <a href="/patient/prescriptions" className="text-blue-600 hover:underline text-sm">
//               View My Prescriptions
//             </a>
//             <div className="flex items-center gap-2 text-sm text-gray-500">
//             <span className="relative flex h-3 w-3">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
//             </span>
//             Live Updates
//           </div>
//         </div>

//         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
//           <div className="flex items-center gap-2 mb-3 text-gray-700 font-medium">
//             <Filter className="w-4 h-4" />
//             <span>Filters</span>
//             {(filters.country ||
//               filters.state ||
//               filters.disease ||
//               filters.from) && (
//               <button
//                 onClick={clearFilters}
//                 className="text-xs text-red-500 hover:underline ml-auto flex items-center gap-1"
//               >
//                 <X className="w-3 h-3" /> Clear all
//               </button>
//             )}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//             <input
//               type="text"
//               name="country"
//               placeholder="Country"
//               value={filters.country}
//               onChange={handleFilterChange}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="state"
//               placeholder="State"
//               value={filters.state}
//               onChange={handleFilterChange}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="text"
//               name="disease"
//               placeholder="Disease Name"
//               value={filters.disease}
//               onChange={handleFilterChange}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="date"
//               name="from"
//               value={filters.from}
//               onChange={handleFilterChange}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//             <input
//               type="date"
//               name="to"
//               value={filters.to}
//               onChange={handleFilterChange}
//               className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>
//           <div className="flex justify-end mt-4">
//             <button
//               onClick={applyFilters}
//               disabled={
//                 filters.country.length < 3 ||
//                 !filters.country ||
//                 !filters.state ||
//                 !filters.disease ||
//                 !filters.from ||
//                 !filters.to
//               }
//               className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Apply Filters
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           {stats.map((stat, i) => (
//             <div
//               key={i}
//               className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
//             >
//               <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
//               <div className="flex items-end justify-between mt-2">
//                 <h3 className="text-2xl font-bold text-gray-900">
//                   {stat.value}
//                 </h3>
//                 <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="font-bold text-gray-800 mb-6">
//               Weekly Disease Trends
//             </h3>
//             <div className="h-64 flex items-end justify-between gap-2 px-2">
//               {analytics?.weeklyTrends.map((item, i) => {
//                 const heightPercentage =
//                   maxReports > 0 ? (item.reports / maxReports) * 100 : 0;
//                 return (
//                   <div
//                     key={i}
//                     className="w-full bg-blue-50 rounded-t-lg relative group flex flex-col justify-end"
//                   >
//                     <div
//                       style={{ height: `${heightPercentage}%` }}
//                       className="bg-blue-600 rounded-t-lg transition-all duration-500 relative w-full"
//                     >
//                       <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
//                         {item.reports} reports
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//             <div className="flex justify-between mt-4 text-xs text-gray-400">
//               {analytics?.weeklyTrends.map((item, i) => (
//                 <span key={i}>{item.day}</span>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//             <h3 className="font-bold text-gray-800 mb-6">Common Ailments</h3>
//             <div className="space-y-4">
//               {analytics?.commonAilments.map((item, i) => (
//                 <div key={i}>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span className="text-gray-600 font-medium">
//                       {item.label}
//                     </span>
//                     <span className="text-gray-900 font-bold">
//                       {item.percentage}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-100 rounded-full h-2.5">
//                     <div
//                       className={`h-2.5 rounded-full ${ailmentColors[i % ailmentColors.length]}`}
//                       style={{ width: `${item.percentage}%` }}
//                     ></div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };

// export default Dashboard;


"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Loader2, AlertCircle, RefreshCcw, Filter, X } from "lucide-react";

interface DashboardSummary {
  totalReports: number;
  activeUsers: number;
  diseasesIdentified: number;
  consultations: number;
}

interface WeeklyTrend {
  day: string;
  reports: number;
}

interface CommonAilment {
  label: string;
  percentage: number;
}

interface DashboardAnalytics {
  weeklyTrends: WeeklyTrend[];
  commonAilments: CommonAilment[];
}

interface FilterState {
  country: string;
  state: string;
  disease: string;
  from: string;
  to: string;
}

const Dashboard = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    country: "",
    state: "",
    disease: "",
    from: "",
    to: "",
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);

  const fetchDashboardData = useCallback(async (activeFilters: FilterState) => {
    try {
      // Keep your specific logic: require country length >= 3
      if (!activeFilters.country || activeFilters.country.length < 3) {
        setSummary(null);
        setAnalytics(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const queryString = `?${queryParams.toString()}`;

      const summaryRes = await fetch(
        `http://localhost:5000/patient/dashboard/summary${queryString}`,
      );

      if (!summaryRes.ok) {
        const errData = await summaryRes.json();
        throw new Error(errData.message || "Summary fetch failed");
      }

      const summaryData = await summaryRes.json();
      let analyticsData = null;

      const analyticsRes = await fetch(
        `http://localhost:5000/patient/dashboard/analytics${queryString}`,
      );

      if (analyticsRes.ok) {
        analyticsData = await analyticsRes.json();
      }

      setSummary(summaryData);
      setAnalytics(analyticsData);
    } catch (err: any) {
      console.error("Dashboard Fetch Error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initial = {
      country: "",
      state: "",
      disease: "",
      from: "",
      to: "",
    };
    setAppliedFilters(initial);
    fetchDashboardData(initial);
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!appliedFilters || appliedFilters.country.length < 3) return;
    const intervalId = setInterval(() => {
      fetchDashboardData(appliedFilters);
    }, 30000);
    return () => clearInterval(intervalId);
  }, [appliedFilters, fetchDashboardData]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ country: "", state: "", disease: "", from: "", to: "" });
    setAppliedFilters(null);
  };

  const applyFilters = () => {
    const { country, state, disease, from, to } = filters;
    if (country.length < 3) return;
    if (!country || !state || !disease || !from || !to) return;
    setAppliedFilters(filters);
    fetchDashboardData(filters);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4 p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Error Loading Data</h3>
          <p className="text-gray-500">{error}</p>
          <button
            onClick={() => fetchDashboardData(appliedFilters || { country: "", state: "", disease: "", from: "", to: "" })}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { title: "Total Reports", value: summary?.totalReports.toLocaleString() || "0", color: "bg-blue-500" },
    { title: "Active Users", value: summary?.activeUsers.toLocaleString() || "0", color: "bg-green-500" },
    { title: "Diseases Identified", value: summary?.diseasesIdentified.toLocaleString() || "0", color: "bg-purple-500" },
    { title: "Consultations", value: summary?.consultations.toLocaleString() || "0", color: "bg-orange-500" },
  ];

  const maxReports = analytics ? Math.max(...analytics.weeklyTrends.map((d) => d.reports)) : 100;
  const ailmentColors = ["bg-orange-500", "bg-purple-500", "bg-blue-500", "bg-red-500"];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:block w-64 bg-white border-r border-gray-200 p-6">
        <h3 className="text-gray-400 uppercase text-xs font-bold tracking-wider mb-4">Admin Menu</h3>
        <div className="space-y-1">
          {["Overview", "Patients", "Reports", "Settings"].map((item, i) => (
            <div
              key={i}
              className={`p-2 rounded cursor-pointer ${i === 0 ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Community Health Overview</h2>
          <div className="flex items-center gap-4">
            <a href="/patient/prescriptions" className="text-blue-600 hover:underline text-sm font-medium">
              View My Prescriptions
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Live Updates
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center gap-2 mb-4 text-gray-700 font-medium">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {(filters.country || filters.state || filters.disease || filters.from) && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:underline ml-auto flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <input type="text" name="country" placeholder="Country" value={filters.country} onChange={handleFilterChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="state" placeholder="State" value={filters.state} onChange={handleFilterChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="text" name="disease" placeholder="Disease Name" value={filters.disease} onChange={handleFilterChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" name="from" value={filters.from} onChange={handleFilterChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <input type="date" name="to" value={filters.to} onChange={handleFilterChange} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={applyFilters}
              disabled={filters.country.length < 3 || !filters.country || !filters.state || !filters.disease || !filters.from || !filters.to}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
              <div className="flex items-end justify-between mt-2">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <div className={`w-2 h-2 rounded-full ${stat.color}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Weekly Disease Trends</h3>
            <div className="h-64 flex items-end justify-between gap-2 px-2">
              {analytics?.weeklyTrends.map((item, i) => {
                const heightPercentage = maxReports > 0 ? (item.reports / maxReports) * 100 : 0;
                return (
                  <div key={i} className="flex-1 bg-blue-50 rounded-t-lg relative group flex flex-col justify-end">
                    <div
                      style={{ height: `${heightPercentage}%` }}
                      className="bg-blue-600 rounded-t-lg transition-all duration-500 relative w-full"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                        {item.reports} reports
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-400">
              {analytics?.weeklyTrends.map((item, i) => (
                <span key={i} className="flex-1 text-center">{item.day}</span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-6">Common Ailments</h3>
            <div className="space-y-4">
              {analytics?.commonAilments.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="text-gray-900 font-bold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${ailmentColors[i % ailmentColors.length]}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;