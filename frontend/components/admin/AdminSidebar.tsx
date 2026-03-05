"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  UserRound, 
  Users, 
  LogOut, 
  ChevronLeft,
  Activity
} from 'lucide-react';
import { cn } from "@/lib/utils"; // Standard Shadcn utility

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
  { name: 'Doctors', href: '/admin/doctors', icon: Users },
  { name: 'Admins', href: '/admin/users', icon: UserRound },
  // { name: 'Chat', href: '/admin/chat', icon: 'chat' }, // Placeholder, replace with actual icon
];

export function AdminSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const logout = () => {
    localStorage.clear();
    document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    window.location.href = "/login";
  };

  return (
    <aside 
      className={cn(
        "relative flex flex-col h-screen bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-sm",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-6 py-8">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Activity className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
            MediCloud
          </span>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 text-blue-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-blue-600" : "group-hover:text-slate-900"
              )} />
              {!isCollapsed && (
                <span className="font-medium text-[15px]">{item.name}</span>
              )}
              {isActive && !isCollapsed && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="font-medium text-[15px]">Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-10 bg-white border border-slate-200 rounded-full p-1 shadow-md hover:bg-slate-50 transition-transform"
      >
        <ChevronLeft className={cn("w-4 h-4 text-slate-600", isCollapsed && "rotate-180")} />
      </button>
    </aside>
  );
}