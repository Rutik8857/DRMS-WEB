"use client";

import Link from 'next/link';
import { ShieldCheck, LifeBuoy, Scale } from 'lucide-react';

export default function AdminFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white/80 backdrop-blur-md border-t border-slate-200/60 mt-auto">
      <div className="max-w-[1600px] mx-auto px-8 py-5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright Section */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-slate-500 font-medium text-[13px]">
              © {currentYear} <span className="text-blue-600 font-semibold">MediCloud</span>. 
              <span className="hidden sm:inline"> System Operational</span>
            </p>
          </div>

          {/* Links Section */}
          <div className="flex items-center gap-8">
            <Link 
              href="/admin/privacy" 
              className="group flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors text-[13px]"
            >
              <ShieldCheck className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              <span>Privacy Policy</span>
            </Link>
            
            <Link 
              href="/admin/terms" 
              className="group flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors text-[13px]"
            >
              <Scale className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              <span>Terms</span>
            </Link>

            <Link 
              href="/admin/support" 
              className="group flex items-center gap-1.5 text-slate-400 hover:text-blue-600 transition-colors text-[13px]"
            >
              <LifeBuoy className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              <span>Support</span>
            </Link>
          </div>

          {/* Version Indicator (Optional but very "Admin-like") */}
          <div className="hidden lg:block">
            <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-400">
              v2.4.0-stable
            </span>
          </div>
          
        </div>
      </div>
    </footer>
  );
}