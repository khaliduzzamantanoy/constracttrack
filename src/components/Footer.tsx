"use client";

import React from 'react';
import { Facebook, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 flex flex-col items-center gap-4 lg:hidden">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-tight">TANOY</span>
          <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Developer</span>
        </div>
        
        <div className="flex items-center gap-2">
          <a 
            href="https://facebook.com/crackerboy.812921" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-400 active:scale-95 border border-black/[0.03]"
          >
            <Facebook size={14} />
          </a>
          
          <a 
            href="https://wa.me/8801753902360" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-gray-400 active:scale-95 border border-black/[0.03]"
          >
            <MessageCircle size={14} />
          </a>
        </div>
      </div>

      <div className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em]">
        © 2026 Audit Certified Platform
      </div>
    </footer>
  );
}
