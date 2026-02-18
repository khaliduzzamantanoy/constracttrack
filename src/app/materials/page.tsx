"use client";

import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Layers, 
  Search, 
  Calendar, 
  ChevronDown, 
  Filter,
  ArrowRight,
  TrendingUp,
  X,
  Monitor,
  Layout,
  Edit2,
  Trash2,
  Plus,
  Minus,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/context/ToastContext';

const tiers = ['All floors', 'Base', '1st Floor', '2nd Floor', '3rd Floor', '4th Floor', '5th Floor', '6th Floor', '7th Floor', '8th Floor', '9th Floor', '10th Floor'];

export default function MaterialsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All floors');
  const [showTierModal, setShowTierModal] = useState(false);
  const { showToast } = useToast();
  const [editingLog, setEditingLog] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      showToast('Failed to load logs', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/logs?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Log removed');
        setShowDeleteConfirm(null);
        fetchLogs();
      }
    } catch (e) {
      showToast('Deletion failed', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingLog) return;
    setSaving(true);
    try {
      const res = await fetch('/api/logs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingLog._id,
          ...editingLog
        }),
      });
      if (res.ok) {
        showToast('Update saved');
        setEditingLog(null);
        fetchLogs();
      }
    } catch (e) {
      showToast('Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.loggedBy?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.tier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'All floors' || log.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const totalCement = filteredLogs.reduce((acc, curr) => acc + (curr.cement || 0), 0);
  const totalFineSand = filteredLogs.reduce((acc, curr) => acc + (curr.sand_fine || 0), 0);
  const totalSelectSand = filteredLogs.reduce((acc, curr) => acc + (curr.sand_selection || 0), 0);
  const totalChips = filteredLogs.reduce((acc, curr) => acc + (curr.brick_chips || 0), 0);

  return (
    <div className="p-4 lg:p-6 pt-6 lg:pt-8 max-w-7xl mx-auto pb-28 lg:pb-6 animate-in fade-in duration-700">
      
      {/* Search and Filters Header */}
      <header className="mb-6 lg:mb-8 space-y-4 lg:space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-sm">
              <Layers size={20} />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-black text-gray-900 leading-none tracking-tight">Materials History</h1>
              <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase mt-1 lg:mt-1.5 tracking-widest opacity-80">Inventory & Trip Audit logs</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
             {/* Clean header actions */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4">
          <div className="md:col-span-8 relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by operator or floor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 lg:h-12 pl-10 pr-4 rounded-xl lg:rounded-2xl glass-effect bg-white/40 border-black/5 text-[13px] font-bold text-gray-900 placeholder:text-gray-300 outline-none focus:border-orange-500 transition-all"
            />
          </div>
          <div className="md:col-span-4">
            <button 
              onClick={() => setShowTierModal(true)}
              className="w-full h-11 lg:h-12 px-3.5 rounded-xl lg:rounded-2xl glass-effect bg-white/40 border-black/5 flex items-center justify-between group active:scale-[0.98] transition-all hover:bg-white/60"
            >
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-orange-500" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Filter</span>
                <span className="text-xs font-black text-gray-900 uppercase">{selectedTier}</span>
              </div>
              <ChevronDown size={16} className="text-gray-400 group-hover:text-orange-500 transition-transform group-hover:rotate-180" />
            </button>
          </div>
        </div>
      </header>

      {/* Quick Summary Aggregates */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6 lg:mb-8">
        {[
          { label: 'Cement', value: totalCement, unit: 'Bags' },
          { label: 'Fine Sand', value: totalFineSand, unit: 'CFT' },
          { label: 'Select Sand', value: totalSelectSand, unit: 'CFT' },
          { label: 'Brick Chips', value: totalChips, unit: 'CFT' },
        ].map((stat, i) => (
          <div key={i} className="glass-effect p-3 lg:p-4 rounded-[1.25rem] lg:rounded-[1.5rem] border-black/5 bg-white/40 flex flex-col gap-1.5">
             <p className="text-[8px] lg:text-[9px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
             <div className="flex items-baseline gap-1.5">
                <span className="text-lg lg:text-xl font-black text-gray-900 leading-none">{stat.value}</span>
                <span className="text-[7px] lg:text-[8px] font-black text-gray-400 uppercase tracking-tighter">{stat.unit}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="glass-effect rounded-[1.5rem] lg:rounded-[2rem] border-black/5 bg-white/40 overflow-hidden shadow-sm">
        
        {/* Mobile View */}
        <div className="lg:hidden p-3 space-y-3">
          {loading ? (
            [1, 2, 3].map(i => <div key={i} className="h-24 bg-white/20 rounded-xl animate-pulse" />)
          ) : filteredLogs.length === 0 ? (
            <div className="p-10 text-center text-gray-400 font-bold uppercase text-[9px] tracking-widest">No matching logs</div>
          ) : (
            filteredLogs.map((log) => (
              <div key={log._id} className="p-3.5 rounded-xl bg-white/50 border border-black/[0.02] space-y-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                      <Calendar size={14} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-gray-900 leading-none">{new Date(log.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short' })}</p>
                      <p className="text-[8px] text-gray-400 font-bold mt-1 uppercase opacity-60">{new Date(log.timestamp).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                     <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md text-[7px] font-black uppercase tracking-tight border border-orange-100/20">
                       {log.tier}
                     </span>
                     <span className="text-[7px] text-gray-400 font-bold uppercase tracking-tight opacity-50 italic">by {log.loggedBy}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-black/[0.01]">
                   <div className="flex gap-2">
                       <button 
                         onClick={() => setEditingLog(log)}
                         className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center active:scale-95 transition-all shadow-sm"
                       >
                          <Edit2 size={12} strokeWidth={2.5} />
                       </button>
                       <button 
                         onClick={() => setShowDeleteConfirm(log._id)}
                         className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center active:scale-95 transition-all shadow-sm"
                       >
                          <Trash2 size={12} strokeWidth={2.5} />
                       </button>
                   </div>
                   <div className="grid grid-cols-4 gap-3">
                      {[
                        { label: 'C', value: log.cement },
                        { label: 'FS', value: log.sand_fine },
                        { label: 'SS', value: log.sand_selection },
                        { label: 'BC', value: log.brick_chips },
                      ].map((m, i) => (
                        <div key={i} className="text-right">
                           <p className="text-[6px] font-black text-gray-300 uppercase leading-none">{m.label}</p>
                           <p className={`text-[9px] font-black ${m.value > 0 ? 'text-gray-900' : 'text-gray-200'}`}>{m.value || 0}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-black/[0.02]">
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Entry Date</th>
                <th className="px-6 py-4 text-left text-[9px] font-black text-gray-400 uppercase tracking-widest">Operator & Floor</th>
                <th className="px-6 py-4 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Cement (Bags)</th>
                <th className="px-6 py-4 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Fine Sand</th>
                <th className="px-6 py-4 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Select Sand</th>
                <th className="px-6 py-4 text-center text-[9px] font-black text-gray-400 uppercase tracking-widest">Brick Chips</th>
                <th className="px-6 py-4 text-right text-[9px] font-black text-gray-400 uppercase tracking-widest">Trips</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.01]">
              {loading ? (
                [1, 2, 3, 4, 5].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-6 py-4"><div className="h-4 bg-gray-50 rounded-md w-full" /></td>
                  </tr>
                ))
              ) : filteredLogs.length === 0 ? (
                <tr>
                   <td colSpan={7} className="px-6 py-12 text-center text-gray-400 font-bold uppercase text-[9px] tracking-widest bg-gray-50/10">No records found.</td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log._id} className="hover:bg-white/60 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                         <div className="w-8 h-8 rounded-lg bg-gray-50 text-orange-600 flex items-center justify-center opacity-70 group-hover:scale-105 transition-transform">
                            <Calendar size={14} />
                         </div>
                         <div>
                            <p className="text-[11px] font-black text-gray-900 leading-none">{new Date(log.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest opacity-60">{new Date(log.timestamp).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2.5">
                          <span className="bg-orange-50 text-orange-600 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tight border border-orange-100/20 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                             {log.tier}
                          </span>
                          <span className="text-xs text-gray-500 font-bold uppercase tracking-tight opacity-60 italic">Worker: {log.loggedBy}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-center font-black text-xs text-gray-900">{log.cement || 0}</td>
                    <td className="px-6 py-4 text-center font-black text-xs text-gray-900">{log.sand_fine || 0}</td>
                    <td className="px-6 py-4 text-center font-black text-xs text-gray-900">{log.sand_selection || 0}</td>
                    <td className="px-6 py-4 text-center font-black text-xs text-gray-900">{log.brick_chips || 0}</td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex flex-col items-end">
                          <p className="text-xs font-black text-gray-900 leading-none">{log.crane_lift || 0}</p>
                          <p className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter mt-1 opacity-60">Lifts</p>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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
                      <Filter size={16} />
                   </div>
                   <div>
                      <h2 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight">Filter Logs</h2>
                      <p className="text-[8px] lg:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Audit by floor location</p>
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-[50vh] lg:max-h-none overflow-y-auto px-0.5 pb-2">
                {tiers.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTier(t);
                      setShowTierModal(false);
                    }}
                    className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border transition-all flex flex-col items-center gap-2 active:scale-95 ${
                      selectedTier === t 
                        ? 'border-orange-600 bg-orange-50 text-orange-600' 
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Layout size={18} className={selectedTier === t ? 'text-orange-600' : 'text-gray-300'} />
                    <span className="font-black text-[9px] lg:text-[10px] uppercase tracking-tight text-center">{t}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Edit Modal */}
        {editingLog && (
          <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center p-0 lg:p-6">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setEditingLog(null)}
               className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ y: "100%", opacity: 0.5 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: "100%", opacity: 0 }}
               className="relative w-full lg:max-w-2xl bg-white rounded-t-[2rem] lg:rounded-[2.5rem] p-6 lg:p-8 shadow-2xl space-y-6"
            >
               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white">
                        <Edit2 size={18} />
                     </div>
                     <div>
                        <h2 className="text-lg lg:text-xl font-black text-gray-900 leading-none">Edit Trip Entry</h2>
                        <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 opacity-70">Archived Record Update</p>
                     </div>
                  </div>
                  <button onClick={() => setEditingLog(null)} className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
                     <X size={20} className="text-gray-400" />
                  </button>
               </div>

               <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { id: 'cement', name: 'Cement', color: 'text-blue-600' },
                    { id: 'sand_fine', name: 'Fine Sand', color: 'text-amber-600' },
                    { id: 'sand_selection', name: 'Select Sand', color: 'text-orange-600' },
                    { id: 'brick_chips', name: 'Brick Chips', color: 'text-red-600' }
                  ].map(m => (
                    <div key={m.id} className="p-4 bg-gray-50 rounded-2xl space-y-3">
                       <p className="text-[8px] font-black text-gray-400 uppercase tracking-tighter">{m.name}</p>
                       <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded-xl shadow-sm border border-black/5">
                          <button 
                            onClick={() => setEditingLog({...editingLog, [m.id]: Math.max(0, editingLog[m.id] - 1)})}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                          >
                             <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className={`text-sm font-black ${m.color}`}>{editingLog[m.id]}</span>
                          <button 
                            onClick={() => setEditingLog({...editingLog, [m.id]: editingLog[m.id] + 1})}
                            className="w-6 h-6 rounded flex items-center justify-center hover:bg-orange-50 hover:text-orange-600 transition-colors"
                          >
                             <Plus size={12} strokeWidth={3} />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>

               <div className="bg-gray-50 p-4 rounded-2xl space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Location / Floor</p>
                        <select 
                          value={editingLog.tier}
                          onChange={(e) => setEditingLog({...editingLog, tier: e.target.value})}
                          className="w-full h-12 px-4 rounded-xl bg-white border border-black/5 text-[11px] font-black text-gray-900 outline-none focus:border-orange-500 appearance-none shadow-sm"
                        >
                          {tiers.filter(t => t !== 'All floors').map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Operator Name</p>
                        <input 
                           type="text"
                           value={editingLog.loggedBy}
                           onChange={(e) => setEditingLog({...editingLog, loggedBy: e.target.value})}
                           className="w-full h-12 px-4 rounded-xl bg-white border border-black/5 text-[11px] font-black text-gray-900 outline-none focus:border-orange-500 shadow-sm"
                        />
                     </div>
                  </div>
               </div>

               <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setEditingLog(null)}
                    className="flex-1 h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:bg-gray-50 transition-colors"
                  >
                     Cancel
                  </button>
                  <button 
                    onClick={handleUpdate}
                    disabled={saving}
                    className="flex-[2] h-14 bg-orange-600 rounded-2xl flex items-center justify-center gap-2 text-white font-black hover:bg-orange-700 active:scale-95 transition-all shadow-lg shadow-orange-600/10 disabled:opacity-50"
                  >
                     {saving ? (
                       <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                     ) : (
                       <>
                         <Save size={16} />
                         <span className="text-[10px] uppercase tracking-widest">Update Record</span>
                       </>
                     )}
                  </button>
               </div>
            </motion.div>
          </div>
        )}

        {/* Delete Confirm */}
        {showDeleteConfirm && (
           <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={() => setShowDeleteConfirm(null)}
                 className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />
              <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.9, opacity: 0 }}
                 className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 text-center shadow-2xl space-y-6"
              >
                 <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Trash2 size={28} />
                 </div>
                 <div className="space-y-2">
                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Remove archive entry?</h3>
                    <p className="text-xs text-gray-400 font-bold leading-relaxed px-4">Materials will be returned to your active stock. This cannot be undone.</p>
                 </div>
                 <div className="flex flex-col gap-3 pt-2">
                    <button 
                      onClick={() => handleDelete(showDeleteConfirm)}
                      disabled={deleting}
                      className="w-full h-14 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/10"
                    >
                       {deleting ? 'Removing...' : 'Delete Permanently'}
                    </button>
                    <button 
                      onClick={() => setShowDeleteConfirm(null)}
                      className="w-full h-14 text-gray-400 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                    >
                       Cancel
                    </button>
                 </div>
              </motion.div>
           </div>
        )}

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
                      <Filter size={16} />
                   </div>
                   <div>
                      <h2 className="text-lg lg:text-xl font-black text-gray-900 tracking-tight">Filter Logs</h2>
                      <p className="text-[8px] lg:text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Audit by floor location</p>
                   </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-[50vh] lg:max-h-none overflow-y-auto px-0.5 pb-2">
                {tiers.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedTier(t);
                      setShowTierModal(false);
                    }}
                    className={`p-3 lg:p-4 rounded-xl lg:rounded-2xl border transition-all flex flex-col items-center gap-2 active:scale-95 ${
                      selectedTier === t 
                        ? 'border-orange-600 bg-orange-50 text-orange-600' 
                        : 'border-transparent bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Layout size={18} className={selectedTier === t ? 'text-orange-600' : 'text-gray-300'} />
                    <span className="font-black text-[9px] lg:text-[10px] uppercase tracking-tight text-center">{t}</span>
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
