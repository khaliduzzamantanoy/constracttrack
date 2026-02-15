"use client";

import React from 'react';
import { Home, ClipboardList, PenTool, BarChart3 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: PenTool, label: 'Log', href: '/log' },
  { icon: ClipboardList, label: 'Materials', href: '/materials' },
  { icon: BarChart3, label: 'Report', href: '/report' },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full px-6 flex justify-center pointer-events-none lg:hidden print:hidden">
      <nav className="glass-capsule flex items-center p-1 lg:p-1.5 w-fit relative shadow-[0_15px_40px_rgba(0,0,0,0.1)] border-white/40 pointer-events-auto overflow-hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "relative flex items-center justify-center h-10 lg:h-12 rounded-full transition-all duration-300 group outline-none overflow-hidden",
                // Responsive width for each item
              isActive ? "w-28 lg:w-32" : "w-14 lg:w-14",
              isActive ? "text-white" : "text-gray-500 hover:text-gray-900"
            )}
              style={{ willChange: 'transform, width' }}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 bg-orange-600 rounded-full -z-10 shadow-sm"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              
              <div className="flex items-center gap-2 lg:gap-2.5 relative z-10">
                <Icon 
                  size={isActive ? 18 : 16} 
                  className={cn("transition-transform duration-300 shrink-0", isActive ? "scale-105" : "group-hover:scale-115")} 
                />
                
                <AnimatePresence mode="popLayout">
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="text-[10px] lg:text-xs font-black whitespace-nowrap tracking-tight uppercase lg:tracking-widest"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Subtle hover indicator for non-active items */}
              {!isActive && (
                <div className="absolute inset-0 bg-gray-900/0 group-hover:bg-gray-900/[0.03] transition-colors -z-20 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Navbar;
