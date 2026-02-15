"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Smartphone, Construction, AlertCircle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSetupNeeded, setIsSetupNeeded] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Check if setup is needed
    fetch('/api/auth/setup')
      .then(res => res.json())
      .then(data => {
        if (data.setupRequired) {
          setIsSetupNeeded(true);
          router.replace('/setup');
        }
      });
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const fullPin = pin.join('');
    if (fullPin.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: fullPin }),
      });

      if (res.ok) {
        router.replace('/');
      } else {
        const data = await res.json();
        setError(data.error || 'Invalid PIN');
        setPin(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pin.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [pin]);

  if (isSetupNeeded) return null;

  return (
    <div className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[120px] opacity-40 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[35%] h-[35%] bg-orange-200 rounded-full blur-[100px] opacity-30 animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm lg:max-w-md space-y-10 lg:space-y-12 relative z-10"
      >
        {/* Logo/Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-orange-600/20 mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight uppercase leading-none">Access Restricted</h1>
          <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Infrastructure Development Tracker</p>
        </div>

        {/* PIN Input Section */}
        <div className="glass-effect p-8 lg:p-10 rounded-[2.5rem] bg-white/40 shadow-2xl border-white/60 space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Master PIN required</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Enter your 6-digit security code</p>
          </div>

          <div className="flex justify-between gap-2.5">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputRefs.current[i] = el; }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-10 h-14 lg:w-12 lg:h-16 text-center text-2xl font-black rounded-2xl bg-white/80 border-2 border-transparent focus:border-orange-500 focus:bg-white outline-none transition-all shadow-sm"
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-2 justify-center text-red-500 font-bold text-[10px] lg:text-[11px] uppercase tracking-widest"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={handleSubmit}
            disabled={loading || pin.join('').length !== 6}
            className="w-full h-14 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-2.5"
          >
            {loading ? (
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Unlock System <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center pt-4">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <Smartphone size={12} className="text-orange-500 opacity-60" /> Hardware Protected Site Access
          </p>
        </div>
      </motion.div>
    </div>
  );
}
