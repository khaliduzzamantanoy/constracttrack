"use client";

import React from 'react';
import { Home, ClipboardList, PenTool, BarChart3, Settings, Facebook, MessageCircle, Construction } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Dashboard', href: '/' },
  { icon: PenTool, label: 'Execution Log', href: '/log' },
  { icon: ClipboardList, label: 'Material Ledger', href: '/materials' },
  { icon: BarChart3, label: 'Audit Reports', href: '/report' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white/50 backdrop-blur-xl border-r border-black/[0.03] hidden lg:flex flex-col z-50 print:hidden">
      <div className="p-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
            <Construction size={22} />
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-900 uppercase tracking-tighter leading-none">Construct</h1>
            <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">Track Systems</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group outline-none overflow-hidden",
                  isActive ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" : "text-gray-500 hover:text-gray-900 hover:bg-black/[0.02]"
                )}
              >
                <Icon size={18} className={cn("transition-transform duration-300", isActive ? "scale-100" : "group-hover:scale-110")} />
                <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-dot"
                    className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8 border-t border-black/[0.02] bg-gray-50/20">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <a 
              href="https://facebook.com/crackerboy.812921" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-orange-600 transition-all border border-black/[0.03] hover:scale-105 active:scale-95"
            >
              <Facebook size={16} />
            </a>
            
            <a 
              href="https://wa.me/8801753902360" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-green-600 transition-all border border-black/[0.03] hover:scale-105 active:scale-95"
            >
              <MessageCircle size={16} />
            </a>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">TANOY</span>
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Developer</span>
            </div>
          </div>

          <div className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] leading-relaxed">
            © 2026 Audit Certified Platform
          </div>
        </div>
      </div>
    </aside>
  );
}
