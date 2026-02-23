"use client";

import AdminFooter from "@/components/admin/AdminFooter";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      router.replace("/login");
    } else {
      setOk(true);
    }
  }, []);

  if (!ok) return <div className="p-10">Checking admin...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* SIDEBAR LEFT */}
      <AdminSidebar />

      {/* RIGHT SIDE */}
      <div className="flex flex-col flex-1">
        
        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

        {/* FOOTER */}
        <AdminFooter />

      </div>
    </div>
  );
}
