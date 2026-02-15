"use client";

import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Layers, 
  Send, 
  Plus, 
  Minus, 
  CheckCircle2, 
  Box, 
  Clock, 
  ChevronDown,
  Construction,
  X,
  Smartphone,
  Monitor,
  User,
  TrendingUp,
  Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

const tiers = ['Base', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th Floor', '7th Floor', '8th Floor', '9th Floor', '10th Floor'];

const materialList = [
  { id: 'cement', name: 'Cement', unit: 'Bags', icon: <Package size={16} /> },
  { id: 'sand_fine', name: 'Fine Sand', unit: 'CFT', icon: <Layers size={16} /> },
  { id: 'sand_selection', name: 'Select Sand', unit: 'CFT', icon: <Layers size={16} /> },
  { id: 'brick_chips', name: 'Brick Chips', unit: 'CFT', icon: <Box size={16} /> },
];

export default function LogPage() {
  const [tier, setTier] = useState('1st Floor');
  const [counts, setCounts] = useState<Record<string, number>>({
    cement: 0,
    sand_fine: 0,
    sand_selection: 0,
    brick_chips: 0,
    crane_lift: 1,
  });

  const materialListWithLift = [
    ...materialList,
    { id: 'crane_lift', name: 'Crane Trips', unit: 'Count', icon: <Construction size={16} /> },
  ];
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const [showTierModal, setShowTierModal] = useState(false);
  const [loggedBy, setLoggedBy] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const savedName = localStorage.getItem('loggedBy');
    const lastTier = localStorage.getItem('lastTier');
    if (savedName) setLoggedBy(savedName);
    if (lastTier) setTier(lastTier);
    
    return () => clearInterval(timer);
  }, []);

  const handleTierChange = (val: string) => {
    setTier(val);
    localStorage.setItem('lastTier', val);
    setShowTierModal(false);
  };

  const handleIncrement = (id: string) => {
    setCounts(prev => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id: string) => {
    setCounts(prev => ({ ...prev, [id]: Math.max(0, prev[id] - 1) }));
  };

  const handleInputChange = (id: string, value: string) => {
    const num = parseInt(value) || 0;
    setCounts(prev => ({ ...prev, [id]: Math.max(0, num) }));
  };

  const handleSaveAll = async () => {
    if (!loggedBy) {
      alert("Please enter operator name");
      return;
    }
    setLoading(true);
    localStorage.setItem('loggedBy', loggedBy);
    
    const body = {
      tier,
      ...counts,
      crane_lift: 1,
      loggedBy,
    };

    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          loggedBy,
          ...counts
        }),
      });

      if (res.ok) {
        showToast('Trip Logged Successfully!');
        setCounts({ cement: 0, sand_fine: 0, sand_selection: 0, brick_chips: 0, crane_lift: 1 });
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 pt-6 lg:pt-8 max-w-7xl mx-auto pb-28 lg:pb-6 animate-in fade-in duration-700">
      
      {/* Header Section */}
      <header className="mb-6 lg:mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-sm">
            <PenTool className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 leading-none tracking-tight">Trip Log</h1>
            <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold flex items-center gap-1.5 mt-1 lg:mt-1.5 uppercase opacity-80 tracking-widest">
              <Clock size={11} className="text-orange-500" />
              {mounted ? currentTime.toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true }) : '--:--'} • {counts.crane_lift > 0 ? 'Active Entry' : 'Manual Adjustment'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           {/* Header actions */}
        </div>
      </header>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5 lg:space-y-6">
          <div className="glass-effect p-5 lg:p-6 rounded-[1.5rem] lg:rounded-[2rem] border-black/5 bg-white/40 space-y-4 lg:space-y-5">
             <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <Layers size={12} className="text-orange-500" /> Target Floor
                </p>
                <button 
                  onClick={() => setShowTierModal(true)}
                  className="w-full glass-effect p-3 lg:p-3.5 rounded-xl lg:rounded-2xl border-orange-500/10 text-left hover:bg-orange-50 transition-all flex items-center justify-between group"
                >
                  <span className="text-gray-900 font-black text-xs lg:text-sm">{tier}</span>
                  <ChevronDown size={16} className="text-orange-500 group-hover:rotate-180 transition-transform duration-300" />
                </button>
             </div>

             <div>
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <User size={12} className="text-orange-500" /> Operator Name
                </p>
                <input 
                  type="text"
                  placeholder="Enter Name"
                  value={loggedBy}
                  onChange={(e) => setLoggedBy(e.target.value)}
                  className="w-full glass-effect p-3 lg:p-3.5 rounded-xl lg:rounded-2xl border-orange-500/10 text-xs lg:text-sm font-black text-gray-900 placeholder:text-gray-300 outline-none focus:border-orange-500 transition-all"
                />
             </div>
          </div>

        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4">
            {materialListWithLift.map((m) => (
              <div key={m.id} className="glass-effect p-4 lg:p-5 rounded-[1.25rem] lg:rounded-[1.5rem] flex items-center justify-between transition-all shadow-sm border-black/5 bg-white/40 hover:bg-white/60 group">
                <div className="flex items-center gap-3 lg:gap-4">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg lg:rounded-xl bg-gray-50 text-orange-600 flex items-center justify-center font-black text-xs shadow-inner shrink-0 group-hover:scale-105 transition-transform">
                    {m.icon}
                  </div>
                  <div>
                    <h3 className="text-xs lg:text-sm font-black text-gray-900 tracking-tight">{m.name}</h3>
                    <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 lg:gap-4 bg-gray-50/50 p-1.5 rounded-xl">
                  <button 
                    onClick={() => handleDecrement(m.id)}
                    className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center bg-white shadow-sm text-gray-400 active:scale-90 transition-all hover:bg-red-50 hover:text-red-500"
                  >
                    <Minus size={14} strokeWidth={3} />
                  </button>
                  <input 
                    type="number"
                    value={counts[m.id]}
                    onChange={(e) => handleInputChange(m.id, e.target.value)}
                    className="w-12 text-center text-sm lg:text-base font-black text-gray-900 bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button 
                    onClick={() => handleIncrement(m.id)}
                    className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg flex items-center justify-center bg-white shadow-sm text-orange-600 active:scale-95 transition-all hover:bg-orange-600 hover:text-white"
                  >
                    <Plus size={14} strokeWidth={3} />
                  </button>
                </div>
              </div>
            ))}

            <div className="md:col-span-2 pt-2 lg:pt-4 flex justify-center">
               <button
                  onClick={handleSaveAll}
                  disabled={loading}
                  className="w-auto h-14 lg:h-16 bg-orange-600 rounded-[1.25rem] lg:rounded-[1.5rem] flex items-center justify-center gap-3 text-white font-black shadow-lg hover:shadow-xl hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50 px-8 lg:px-12"
               >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      <span className="text-[11px] lg:text-xs uppercase tracking-widest">Submit Data Entry</span>
                    </>
                  )}
               </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showTierModal && (
          <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-6 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTierModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%", opacity: 0.5 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full lg:max-w-xl bg-white rounded-t-[2rem] lg:rounded-[2.5rem] p-5 pb-10 lg:pb-6 shadow-2xl"
            >
              <button 
                 onClick={() => setShowTierModal(false)}
                 className="hidden lg:flex absolute top-5 right-5 w-8 h-8 rounded-lg items-center justify-center hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 lg:hidden" />
              <div className="flex justify-center lg:justify-start items-center mb-6 lg:mb-8 px-1">
                <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                      <Layers size={16} />
                   </div>
                   <div>
                      <h2 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight">Select Floor</h2>
                      <p className="text-[8px] lg:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Active site locations</p>
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-[50vh] lg:max-h-none overflow-y-auto px-0.5 pb-2">
                {tiers.map((t) => (
                  <button
                    key={t}
                    onClick={() => handleTierChange(t)}
                    className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border transition-all flex flex-col items-center gap-2 active:scale-95 ${
                      tier === t 
                        ? 'border-orange-600 bg-orange-50 text-orange-600' 
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Layers size={18} className={tier === t ? 'text-orange-600' : 'text-gray-300'} />
                    <span className="font-black text-[9px] lg:text-[10px] uppercase tracking-tight">{t}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
