"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  KeyRound, 
  Trash2, 
  LogOut, 
  ShieldAlert, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Smartphone,
  Monitor,
  Info,
  LayoutGrid
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [savingConfig, setSavingConfig] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const [sessions, setSessions] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    // Fetch initial config
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => setProjectName(data.projectName));

    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    // Return early if we don't need to fetch (optional optimization)
    try {
      const res = await fetch('/api/admin/sessions');
      const data = await res.json();
      if (res.ok) {
        setSessions(data.sessions);
        setCurrentSessionId(data.currentSessionId);
      }
    } catch (e) {
      console.error('Failed to fetch sessions');
    } finally {
      setLoadingSessions(false);
    }
  };

  const logoutSession = async (sessionId: string) => {
    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        if (sessionId === currentSessionId) {
          window.location.href = '/login';
        } else {
          showToast('Device logged out', 'success');
          fetchSessions();
        }
      }
    } catch (e) {
      showToast('Action failed', 'error');
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth', { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/login';
      } else {
        showToast('Logout failed', 'error');
      }
    } catch (e) {
      showToast('Logout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBranding = async () => {
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName }),
      });
      if (res.ok) {
        showToast('Branding updated', 'success');
      } else {
        showToast('Update failed', 'error');
      }
    } catch (e) {
      showToast('Connection error', 'error');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleResetDB = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reset', { method: 'DELETE' });
      if (res.ok) {
        showToast('Database wiped successfully', 'success');
        setShowResetConfirm(false);
        router.refresh();
      } else {
        showToast('Reset failed', 'error');
      }
    } catch (e) {
      showToast('Connection error', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 pt-6 lg:pt-8 max-w-4xl mx-auto space-y-6 lg:space-y-8 animate-in fade-in duration-700 pb-20 lg:pb-6">
      
      {/* Header */}
      <header className="flex items-center gap-3 lg:gap-4 mb-2 lg:mb-4 px-1">
        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gray-900 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-sm">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-xl lg:text-2xl font-black text-gray-900 leading-none tracking-tight">System Settings</h1>
          <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase mt-1 lg:mt-1.5 tracking-widest opacity-80">Security & Database Management</p>
        </div>
      </header>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 gap-4 lg:gap-6">
        
        {/* Branding Section */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
             <LayoutGrid size={14} className="text-orange-500" /> Project Branding
          </h2>
          
          <div className="glass-effect p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] bg-white/40 border-black/5 space-y-6">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Report Project Title</label>
                <div className="flex flex-col md:flex-row gap-3">
                   <input 
                      type="text" 
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder="Enter project name..."
                      className="flex-1 h-16 px-6 rounded-2xl bg-white border border-black/5 outline-none focus:border-orange-500 transition-all text-base font-bold text-gray-900 shadow-inner shadow-black/[0.02]"
                   />
                   <button 
                      onClick={handleUpdateBranding}
                      disabled={savingConfig}
                      className="h-16 px-10 rounded-2xl bg-orange-600 text-white text-[12px] font-black uppercase tracking-widest shadow-lg shadow-orange-600/10 hover:bg-orange-700 active:scale-95 transition-all disabled:opacity-50"
                   >
                      {savingConfig ? 'Saving...' : 'Update Title'}
                   </button>
                </div>
                <p className="text-[9px] text-gray-400 font-medium ml-1">This title appears at the top of all generated PDF reports.</p>
             </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="space-y-4">
          <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
             <ShieldCheck size={14} className="text-orange-500" /> Authentication & Security
          </h2>
          
          <div className="glass-effect rounded-[1.5rem] lg:rounded-[2rem] bg-white/40 border-black/5 overflow-hidden">
             
             {/* Change PIN */}
             <div className="p-5 lg:p-6 flex items-center justify-between group hover:bg-white/40 transition-all border-b border-black/[0.02]">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                      <KeyRound size={18} />
                   </div>
                   <div>
                      <h3 className="text-sm font-black text-gray-900">Change Master PIN</h3>
                      <p className="text-[10px] font-medium text-gray-400">Update your 6-digit access code</p>
                   </div>
                </div>
                <button 
                   onClick={() => router.push('/settings/change-pin')}
                   className="p-2 rounded-lg bg-gray-50 text-gray-400 group-hover:text-orange-600 group-hover:bg-orange-50 transition-all active:scale-95"
                >
                   <ChevronRight size={20} />
                </button>
             </div>

              {/* Sign Out */}
              <button 
                 onClick={handleLogout}
                 disabled={loading}
                 className="w-full p-5 lg:p-6 flex items-center justify-between group hover:bg-red-50/10 transition-all text-left outline-none"
              >
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center group-hover:text-gray-900 transition-colors">
                       <LogOut size={18} />
                    </div>
                    <div>
                       <h3 className="text-sm font-black text-gray-900 group-hover:text-red-600 transition-colors">Sign Out</h3>
                       <p className="text-[10px] font-medium text-gray-400">Clear session on this device</p>
                    </div>
                 </div>
                 <div className="px-5 h-10 rounded-xl bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black active:scale-95 transition-all flex items-center justify-center min-w-[100px]">
                    {loading ? (
                       <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                       'Logout'
                    )}
                 </div>
              </button>
          </div>
        </section>

        {/* Device Sessions Section */}
        <section className="space-y-4">
           <h2 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
              <Smartphone size={14} className="text-orange-500" /> Active Logged-in Devices
           </h2>
           
           <div className="glass-effect p-2 lg:p-3 rounded-[1.5rem] lg:rounded-[2.2rem] bg-white/30 border-black/5 divide-y divide-black/[0.03]">
              {loadingSessions ? (
                 <div className="p-8 text-center">
                    <div className="w-6 h-6 border-2 border-orange-600/20 border-t-orange-600 rounded-full animate-spin mx-auto" />
                 </div>
              ) : sessions.length === 0 ? (
                 <div className="p-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">No active sessions found</div>
              ) : (
                 sessions.map((sess) => {
                    const isMobile = sess.userAgent.includes('Mobile') || sess.userAgent.includes('Android') || sess.userAgent.includes('iPhone');
                    const DeviceIcon = isMobile ? Smartphone : Monitor;
                    
                    return (
                       <div key={sess.sessionId} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors",
                                sess.sessionId === currentSessionId ? "bg-orange-600 text-white" : "bg-white text-gray-400 group-hover:text-gray-900"
                             )}>
                                <DeviceIcon size={18} />
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                   <h3 className="text-[11px] font-black text-gray-900 truncate max-w-[150px] md:max-w-xs">{sess.userAgent.split(' ')[0]} {isMobile ? '(Mobile)' : '(Desktop)'}</h3>
                                   {sess.sessionId === currentSessionId && (
                                      <span className="bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter">Current Device</span>
                                   )}
                                </div>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">IP: {sess.ip} • Active: {new Date(sess.lastActive).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                             </div>
                          </div>
                          
                          {sess.sessionId !== currentSessionId && (
                             <button 
                                onClick={() => logoutSession(sess.sessionId)}
                                className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all active:scale-95"
                             >
                                <LogOut size={16} />
                             </button>
                          )}
                       </div>
                    );
                 })
              )}
           </div>
        </section>

        {/* Danger Zone */}
        <section className="space-y-4 pt-4 lg:pt-6">
           <h2 className="text-[11px] font-black text-red-500 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
             <ShieldAlert size={14} /> Critical Actions
          </h2>

          <div className="glass-effect rounded-[1.5rem] lg:rounded-[2rem] bg-red-50/5 border-red-500/10 overflow-hidden">
             <div className="p-5 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                      <Trash2 size={22} strokeWidth={2.5} />
                   </div>
                   <div className="space-y-1">
                      <h3 className="text-base font-black text-gray-900 leading-none">Erase Database Records</h3>
                      <p className="text-[11px] font-medium text-gray-400 leading-relaxed max-w-sm">
                         This will permanently delete all entry logs and reset material stock counts to zero. This action 
                         <span className="text-red-500 font-bold"> CANNOT be undone</span>.
                      </p>
                   </div>
                </div>
                <button 
                   onClick={() => setShowResetConfirm(true)}
                   className="w-full md:w-auto px-8 h-12 rounded-2xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all"
                >
                   Erase All Data
                </button>
             </div>
          </div>
        </section>

        {/* Info Area */}
        <section className="pt-6 lg:pt-10 flex flex-col items-center gap-4 text-center">
           <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-black/5 text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
              <Smartphone size={12} className="text-orange-500" /> Device Secured: INFRA-A1-NODE
           </div>
           <p className="text-[10px] font-medium text-gray-400/60 max-w-xs">
              Encryption provided by RSA-SHA256 headers. Metadata logs are strictly stored in designated project clusters.
           </p>
        </section>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 lg:p-12 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetConfirm(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 lg:p-10 shadow-2xl space-y-8 text-center"
            >
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-3xl mx-auto flex items-center justify-center">
                 <ShieldAlert size={40} strokeWidth={3} />
              </div>
              
              <div className="space-y-2">
                 <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Are you sure?</h2>
                 <p className="text-xs font-medium text-gray-400">
                    This will wipe the entire site ledger and material stock. Authenticated credentials will remain intact.
                 </p>
              </div>

              <div className="space-y-3 pt-4">
                 <button 
                    onClick={handleResetDB}
                    disabled={loading}
                    className="w-full h-14 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-red-600/20 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center"
                 >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Confirm Destruction'}
                 </button>
                 <button 
                    onClick={() => setShowResetConfirm(false)}
                    className="w-full h-14 bg-gray-50 text-gray-400 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-100 transition-all"
                 >
                    Cancel
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
