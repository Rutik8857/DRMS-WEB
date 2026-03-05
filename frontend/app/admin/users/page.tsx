"use client"
import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [admins, setAdmins] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admins");
      setAdmins(res.data.admins);
      setCount(res.data.count);
    } catch (error) {
      console.error("Error fetching admins", error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your system administrators and users.</p>
        </div>
        
        {/* Total Admins Badge */}
        <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold border border-blue-100 shadow-sm">
          Total Admins: <span className="ml-2 text-lg">{count}</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-200">
              {admins.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-8 text-center text-gray-500 text-sm">
                    No administrators found.
                  </td>
                </tr>
              ) : (
                admins.map((admin) => (
                  <tr 
                    key={admin.id} 
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      #{admin.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {admin.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {admin.email}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            
          </table>
        </div>
      </div>
      
    </div>
  );
}