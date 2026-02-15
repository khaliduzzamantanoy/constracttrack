"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {mounted && typeof document !== 'undefined' && 
        createPortal(
          <div className="fixed top-0 left-0 right-0 lg:left-auto lg:right-0 pointer-events-none z-[99999] flex justify-center lg:justify-end p-6 lg:p-10 font-sans">
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: -40, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -40, scale: 0.8 }}
                  className="pointer-events-auto glass-effect bg-white/95 border border-orange-500/10 text-orange-600 px-6 py-3 rounded-full flex items-center gap-2.5 shadow-2xl font-black text-[10px] lg:text-xs uppercase tracking-wider"
                >
                  <div className={`w-5 h-5 rounded-full text-white flex items-center justify-center ${
                      toast.type === 'error' ? 'bg-red-500' : 'bg-orange-600'
                  }`}>
                    {toast.type === 'error' ? <XCircle size={12} strokeWidth={4} /> : <CheckCircle2 size={12} strokeWidth={4} />}
                  </div>
                  {toast.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>,
          document.body
        )
      }
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
