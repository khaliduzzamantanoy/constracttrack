"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ShieldCheck, Construction, AlertCircle, ChevronRight, Check, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

export default function ChangePinPage() {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1); // 1: New PIN, 2: Confirm
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const { showToast } = useToast();

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const targetPin = step === 1 ? pin : confirmPin;
    const setter = step === 1 ? setPin : setConfirmPin;

    const newPin = [...targetPin];
    newPin[index] = value.slice(-1);
    setter(newPin);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const targetPin = step === 1 ? pin : confirmPin;
    if (e.key === 'Backspace' && !targetPin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const nextStep = () => {
    if (pin.join('').length !== 6) {
      setError('Enter 6 digits');
      return;
    }
    setStep(2);
    // Use timeout to ensure ref is ready after step change
    setTimeout(() => {
        inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleSubmit = async () => {
    const p1 = pin.join('');
    const p2 = confirmPin.join('');

    if (p1 !== p2) {
      setError('PINs do not match');
      setConfirmPin(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/setup', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: p1 }),
      });

      if (res.ok) {
        showToast('PIN updated successfully', 'success');
        router.replace('/settings');
      } else {
        const data = await res.json();
        setError(data.error || 'Update failed');
      }
    } catch (err) {
      setError('Connection failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (step === 2 && confirmPin.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [confirmPin, step]);

  return (
    <div className="min-h-screen bg-[#fdfaf5] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-blue-100 rounded-full blur-[130px] opacity-30 " />
      <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-orange-100 rounded-full blur-[110px] opacity-40 " />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm lg:max-w-md space-y-10 lg:space-y-12 relative z-10"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <button 
            onClick={() => router.back()}
            className="self-start mb-6 -ml-2 p-2 hover:bg-black/5 rounded-full transition-colors text-gray-400 flex items-center gap-2 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Settings</span>
          </button>
          
          <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-black/20 mb-6">
            <KeyRound size={32} />
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight uppercase leading-none">Update Security</h1>
          <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Reset your Master access credentials</p>
        </div>

        <div className="glass-effect p-8 lg:p-10 rounded-[2.5rem] bg-white/40 shadow-2xl border-white/60 space-y-8 text-center">
          <div className="space-y-2">
            <div className="flex justify-center gap-1.5 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${step === 1 ? 'bg-orange-500 w-6' : 'bg-gray-200'} transition-all`} />
              <div className={`w-1.5 h-1.5 rounded-full ${step === 2 ? 'bg-orange-500 w-6' : 'bg-gray-200'} transition-all`} />
            </div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">
              {step === 1 ? 'New Master PIN' : 'Verify New PIN'}
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
               {step === 1 ? 'Enter the new 6-digit access code' : 'Repeat the code to confirm changes'}
            </p>
          </div>

          <div className="flex justify-between gap-2.5">
            {(step === 1 ? pin : confirmPin).map((digit, i) => (
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
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex items-center gap-2 justify-center text-red-500 font-bold text-[10px] lg:text-[11px] uppercase tracking-widest"
              >
                <AlertCircle size={14} />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {step === 1 ? (
            <button
              onClick={nextStep}
              disabled={pin.join('').length !== 6}
              className="w-full h-14 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg hover:bg-black active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-2.5"
            >
              Continue to Verify <ChevronRight size={18} />
            </button>
          ) : (
            <button
               onClick={handleSubmit}
               disabled={loading || confirmPin.join('').length !== 6}
               className="w-full h-14 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg shadow-orange-600/20 hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2.5"
            >
               {loading ? (
                 <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
               ) : (
                 <>
                   Update Master PIN <Check size={18} />
                 </>
               )}
            </button>
          )}

          {step === 2 && !loading && (
            <button 
              onClick={() => { setStep(1); setConfirmPin(['','','','','','']); setError(''); }}
              className="w-full text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors"
            >
              Start over
            </button>
          )}
        </div>

        <div className="text-center pt-4">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
            <Construction size={12} className="text-orange-500 opacity-60" /> Site Security Node INFRA-A1
          </p>
        </div>
      </motion.div>
    </div>
  );
}
