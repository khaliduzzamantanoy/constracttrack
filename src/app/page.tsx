"use client";

import React, { useEffect, useState } from 'react';
import { Package, User, TrendingUp, Calendar, Layers, Construction, LayoutGrid, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

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
           {/* Header actions */}
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="space-y-6 lg:space-y-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4">
          <StatsCard icon={<Construction className="text-orange-500" size={16}/>} label="Trips" value={stats.trips} unit="Count" />
          <StatsCard icon={<Package className="text-orange-500" size={16}/>} label="Cement" value={stats.cement} unit="Bags" />
          <StatsCard icon={<Layers className="text-orange-500" size={16}/>} label="F-Sand" value={stats.sand_fine} unit="CFT" />
          <StatsCard icon={<Layers className="text-orange-500" size={16}/>} label="S-Sand" value={stats.sand_selection} unit="CFT" />
          <StatsCard icon={<Package className="text-orange-500" size={16}/>} label="Chips" value={stats.brick_chips} unit="CFT" />
        </div>

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
    { label: 'SF', value: log.sand_fine, color: 'purple' },
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
      <div className="flex -space-x-1.5 flex-wrap justify-end max-w-[100px]">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <div 
               key={idx} 
               title={`${item.value} units`}
               className={`w-5 h-5 lg:w-6 lg:h-6 rounded-full border border-white flex items-center justify-center text-[6px] lg:text-[7px] font-black shadow-sm group-hover:-translate-y-0.5 transition-transform ${
                 item.color === 'purple' ? 'bg-purple-500 text-white' : 
                 item.color === 'emerald' ? 'bg-emerald-500 text-white' : 'bg-orange-500 text-white'
               }`}
            >
              {item.value}
            </div>
          ))
        ) : (
          <div className="text-[7px] font-black text-gray-300 uppercase italic">Empty</div>
        )}
      </div>
    </div>
  );
}
