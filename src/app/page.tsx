"use client";

import React, { useEffect, useState } from 'react';
import { Package, User, TrendingUp, Calendar, Layers, Construction, LayoutGrid, Clock, ChevronRight, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

export default function Dashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    cement: 0,
    sand_fine: 0,
    sand_selection: 0,
    brick_chips: 0,
    trips: 0
  });
  const [stock, setStock] = useState({
    cement: 0,
    sand_fine: 0,
    sand_selection: 0,
    brick_chips: 0
  });
  const [showAddStock, setShowAddStock] = useState(false);

  const fetchStock = () => {
    fetch('/api/stock')
      .then(res => res.json())
      .then(data => {
        const newStock = { cement: 0, sand_fine: 0, sand_selection: 0, brick_chips: 0 };
        data.forEach((item: any) => {
          if (newStock[item.materialId as keyof typeof newStock] !== undefined) {
            newStock[item.materialId as keyof typeof newStock] = item.quantity;
          }
        });
        setStock(newStock);
      });
  };

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        const cementTotal = data.reduce((acc: number, curr: any) => acc + (curr.cement || 0), 0);
        const sandFineTotal = data.reduce((acc: number, curr: any) => acc + (curr.sand_fine || 0), 0);
        const sandSelectionTotal = data.reduce((acc: number, curr: any) => acc + (curr.sand_selection || 0), 0);
        const chipsTotal = data.reduce((acc: number, curr: any) => acc + (curr.brick_chips || 0), 0);
        const tripsTotal = data.reduce((acc: number, curr: any) => acc + (curr.crane_lift || 0), 0);
        
        setStats({ 
          cement: cementTotal, 
          sand_fine: sandFineTotal,
          sand_selection: sandSelectionTotal,
          brick_chips: chipsTotal,
          trips: tripsTotal 
        });
        setLoading(false);
      });
      
    fetchStock();
  }, []);

  return (
    <div className="p-4 lg:p-6 pt-6 lg:pt-8 space-y-6 lg:space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto pb-28 lg:pb-6">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-1 lg:mb-2">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-sm">
            <LayoutGrid size={20} className="lg:scale-105" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 leading-none tracking-tight">Dashboard</h1>
            <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase mt-1 lg:mt-1.5 tracking-widest opacity-80">Project Pulse & Real-time Metrics</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setShowAddStock(true)}
             className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors shadow-sm"
           >
             <Plus size={14} /> <span className="hidden sm:inline">Add Stock</span>
           </button>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="space-y-8 lg:space-y-10">
        
        {/* Stock Section */}
        <section className="space-y-4">
           <h2 className="text-sm lg:text-base font-black text-gray-900 uppercase tracking-tight px-1">Current Warehouse Stock</h2>
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              <StockCard icon={<Package className="text-emerald-500" size={18}/>} label="Cement Stock" value={stock.cement} unit="Bags" color="emerald" />
              <StockCard icon={<Layers className="text-emerald-500" size={18}/>} label="FS Stock" value={stock.sand_fine} unit="CFT" color="emerald" />
              <StockCard icon={<Layers className="text-emerald-500" size={18}/>} label="SS Stock" value={stock.sand_selection} unit="CFT" color="emerald" />
              <StockCard icon={<Package className="text-emerald-500" size={18}/>} label="Chips Stock" value={stock.brick_chips} unit="CFT" color="emerald" />
           </div>
        </section>

        {/* Stats Row */}
        <section className="space-y-4">
           <h2 className="text-sm lg:text-base font-black text-gray-900 uppercase tracking-tight px-1">Total Material Usage</h2>
           <div className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4">
             <StatsCard icon={<Construction className="text-orange-500" size={16}/>} label="Trips" value={stats.trips} unit="Count" />
             <StatsCard icon={<Package className="text-orange-500" size={16}/>} label="Cement" value={stats.cement} unit="Bags" />
             <StatsCard icon={<Layers className="text-orange-500" size={16}/>} label="F-Sand" value={stats.sand_fine} unit="CFT" />
             <StatsCard icon={<Layers className="text-orange-500" size={16}/>} label="S-Sand" value={stats.sand_selection} unit="CFT" />
             <StatsCard icon={<Package className="text-orange-500" size={16}/>} label="Chips" value={stats.brick_chips} unit="CFT" />
           </div>
        </section>

        {/* Recent Activity Section - Expanded */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-sm lg:text-base font-black text-gray-900 uppercase tracking-tight">Recent Execution Logs</h2>
            <Link href="/materials" className="text-[9px] text-orange-600 font-black uppercase tracking-widest bg-orange-50 px-2.5 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">View Archive</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 lg:bg-white/20 lg:p-4 lg:rounded-[2rem] lg:border lg:border-black/[0.02]">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-20 glass-effect rounded-2xl animate-pulse" />)
            ) : logs.length === 0 ? (
              <div className="md:col-span-2 glass-effect p-12 rounded-[2rem] text-center text-gray-400 border border-dashed text-[10px] font-bold bg-white/40">
                No trip logs found in system.
              </div>
            ) : (
              logs.slice(0, 10).map((log) => <LogItem key={log._id} log={log} />)
            )}
          </div>
          
          {!loading && logs.length > 10 && (
            <div className="flex justify-center pt-2">
              <Link href="/materials" className="flex items-center justify-center w-auto px-8 py-4 rounded-xl bg-white/50 border border-black/[0.03] text-gray-400 hover:text-orange-600 transition-all group hover:bg-white hover:shadow-sm">
                <span className="text-[9px] font-black uppercase tracking-widest mr-2">Access Full Audit History</span>
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {showAddStock && <AddStockModal onClose={() => setShowAddStock(false)} onSuccess={() => {
          fetchStock();
          setShowAddStock(false);
        }} />}
      </AnimatePresence>
    </div>
  );
}

function StockCard({ icon, label, value, unit, color = "orange" }: any) {
    const isEmerald = color === "emerald";
    return (
      <div className={`glass-effect p-4 lg:p-5 rounded-[1.25rem] lg:rounded-[1.5rem] border-black/5 flex flex-col gap-3 relative overflow-hidden group shadow-sm bg-white/40 hover:bg-white/60 transition-all active:scale-[0.98]`}>
        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl ${isEmerald ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50'} flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform`}>
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-xl lg:text-2xl font-black ${isEmerald ? 'text-gray-900' : 'text-gray-900'} leading-none`}>{value}</span>
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{unit}</span>
          </div>
        </div>
      </div>
    );
}

function StatsCard({ icon, label, value, unit }: any) {
  return (
    <div className="glass-effect p-3.5 lg:p-4 rounded-[1.25rem] lg:rounded-[1.5rem] border-black/5 flex flex-col gap-2.5 lg:gap-3 relative overflow-hidden group shadow-sm bg-white/40 hover:bg-white/60 transition-all active:scale-[0.98]">
      <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-gray-50 flex items-center justify-center shadow-inner shrink-0 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div>
        <p className="text-[9px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{label}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-lg lg:text-xl font-black text-gray-900 leading-none">{value}</span>
          <span className="text-[8px] lg:text-[9px] font-black text-gray-400 uppercase tracking-tighter">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function LogItem({ log }: { log: any }) {
  const items = [
    { label: 'C', value: log.cement, color: 'orange' },
    { label: 'FS', value: log.sand_fine, color: 'purple' },
    { label: 'SS', value: log.sand_selection, color: 'emerald' },
    { label: 'BC', value: log.brick_chips, color: 'orange' }
  ].filter(i => i.value > 0);

  return (
    <div className="glass-effect p-2.5 rounded-xl border-black/5 flex items-center justify-between shadow-sm bg-white/40 hover:bg-white/60 transition-all group">
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 lg:w-9 lg:h-9 rounded-lg ${log.crane_lift > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-50 text-gray-400'} flex items-center justify-center font-black text-xs group-hover:scale-105 transition-transform`}>
          <Construction size={16} />
        </div>
        <div className="space-y-0.5">
          <h4 className="font-black text-gray-900 text-[11px] lg:text-xs tracking-tight">Trip Logged</h4>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-orange-600 text-[7px] lg:text-[8px] font-black uppercase flex items-center gap-0.5 bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-100/30">
               {log.tier}
            </span>
            <span className="text-[7px] lg:text-[8px] text-gray-400 font-bold uppercase tracking-tighter opacity-70">by {log.loggedBy}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-end max-w-[120px]">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div 
               key={idx} 
               className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight flex items-center gap-1 ${
                 item.color === 'purple' ? 'bg-purple-50 text-purple-600 border border-purple-100' : 
                 item.color === 'emerald' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
               }`}
            >
              <span className="opacity-70">{item.label}:</span>
              <span>{item.value}</span>
            </div>
          ))
        ) : (
          <div className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tight bg-gray-50 text-gray-400 border border-gray-100">
             Empty
          </div>
        )}
      </div>
    </div>
  );
}

function AddStockModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [material, setMaterial] = useState('cement');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async () => {
    if (!quantity) return;
    setLoading(true);
    try {
      await fetch('/api/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialId: material, quantity: parseInt(quantity) })
      });
      showToast('Stock Updated Successfully!');
      onSuccess();
    } catch (e) {
      console.error(e);
      showToast('Failed to update stock', 'error');
      setLoading(false);
    }
  };

  const materials = [
    { id: 'cement', name: 'Cement', unit: 'Bags', icon: <Package size={16} /> },
    { id: 'sand_fine', name: 'Fine Sand', unit: 'CFT', icon: <Layers size={16} /> },
    { id: 'sand_selection', name: 'Select Sand', unit: 'CFT', icon: <Layers size={16} /> },
    { id: 'brick_chips', name: 'Brick Chips', unit: 'CFT', icon: <Package size={16} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-4 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full max-w-md lg:max-w-sm bg-white rounded-t-[2.5rem] lg:rounded-[2.5rem] p-6 lg:p-8 pt-8 lg:pt-8 shadow-2xl space-y-6 lg:space-y-6"
      >
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto absolute top-3 left-1/2 -translate-x-1/2 lg:hidden" />
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Add Stock</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">Update Warehouse Inventory</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600 hidden lg:block"><X size={20} /></button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Select Material</label>
            <div className="grid grid-cols-2 gap-2.5">
              {materials.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMaterial(m.id)}
                  className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all active:scale-[0.98] ${
                    material === m.id 
                      ? 'bg-orange-50 border-orange-500 text-orange-600 ring-4 ring-orange-500/10' 
                      : 'bg-white border-gray-100 text-gray-400 hover:border-orange-200 hover:bg-orange-50/30'
                  }`}
                >
                  <div className={material === m.id ? 'text-orange-600' : 'text-gray-300'}>
                    {m.icon}
                  </div>
                  <div className="text-center">
                    <span className={`block text-[10px] font-black uppercase tracking-tight ${material === m.id ? 'text-gray-900' : 'text-gray-500'}`}>{m.name}</span>
                    <span className="block text-[8px] font-bold uppercase tracking-widest opacity-60">{m.unit}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1 mb-2 block">Quantity to Add</label>
             <div className="relative">
               <input 
                 type="number" 
                 value={quantity}
                 onChange={(e) => setQuantity(e.target.value)}
                 placeholder="00"
                 className="w-full p-4 rounded-2xl bg-gray-50 border-2 border-transparent font-black text-2xl outline-none focus:bg-white focus:border-orange-500 transition-all placeholder:text-gray-200"
               />
               <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-md">
                   {materials.find(m => m.id === material)?.unit}
                 </span>
               </div>
             </div>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={loading || !quantity}
          className="w-full py-4 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-700 shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mb-safe"
        >
          {loading ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
             <>
               <Plus size={18} strokeWidth={3} />
               <span>Confirm Addition</span>
             </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
