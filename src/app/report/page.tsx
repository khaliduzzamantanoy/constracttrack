"use client";

import React, { useEffect, useState, useRef } from 'react';
import { 
  BarChart3, 
  Package, 
  Layers, 
  TrendingUp, 
  Calendar, 
  Download, 
  CheckCircle2, 
  Construction,
  FileText,
  User,
  ArrowRight,
  Monitor,
  LayoutGrid
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import ReportDocument from '@/components/ReportDocument';
import { useToast } from '@/context/ToastContext';

export default function ReportPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [projectName, setProjectName] = useState('');
  const { showToast } = useToast();
  const [mounted, setMounted] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    // Fetch logs
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });

    // Fetch branding
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => setProjectName(data.projectName));
  }, []);

  const totalCement = logs.reduce((acc, curr) => acc + (curr.cement || 0), 0);
  const totalFineSand = logs.reduce((acc, curr) => acc + (curr.sand_fine || 0), 0);
  const totalSelectSand = logs.reduce((acc, curr) => acc + (curr.sand_selection || 0), 0);
  const totalChips = logs.reduce((acc, curr) => acc + (curr.brick_chips || 0), 0);
  const totalTrips = logs.reduce((acc, curr) => acc + (curr.crane_lift || 0), 0);
  const uniqueUsers = new Set(logs.map(l => l.loggedBy)).size;

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    setGenerating(true);
    
    try {
      const container = reportRef.current;
      container.style.display = 'block';
      container.style.visibility = 'visible';
      
      // Wait for render
      await new Promise(resolve => setTimeout(resolve, 500));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const processPage = async (pageElement: HTMLElement, index: number) => {
        const canvas = await html2canvas(pageElement, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 720,
          windowWidth: 720
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // Add new page for every section except the very first one
        if (index > 0) {
          pdf.addPage();
        }
        
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      };
      
      // Get all report pages by class name
      const pages = Array.from(container.querySelectorAll('.report-page-section')) as HTMLElement[];

      if (pages.length === 0) {
         console.warn("No report pages found, falling back to container children");
         // Fallback logic remains same just in case
         const children = Array.from(container.children) as HTMLElement[];
         if (children.length === 1 && children[0].children.length > 0) {
             const innerPages = Array.from(children[0].children) as HTMLElement[];
             for (let i = 0; i < innerPages.length; i++) {
                await processPage(innerPages[i], i);
             }
         } else {
             for (let i = 0; i < children.length; i++) {
                await processPage(children[i], i);
             }
         }
      } else {
         for (let i = 0; i < pages.length; i++) {
            await processPage(pages[i], i);
         }
      }
      
      container.style.display = 'none';

      pdf.save(`CTR_REPORT_${new Date().getTime()}.pdf`);
      
      showToast('Report Downloaded Successfully!');
    } catch (error: any) {
      console.error('PDF Generation failed:', error);
      alert(`Download Error: ${error.message || 'The system was unable to generate the file.'}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 pt-6 lg:pt-8 pb-28 lg:pb-6 max-w-7xl mx-auto space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-2 duration-700">
      
      
      {/* Premium Header */}
      <header className="flex justify-between items-center bg-white/50 p-4 lg:p-5 outline outline-1 outline-black/[0.03] rounded-[1.5rem] lg:rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-3 lg:gap-4">
          <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-600 rounded-xl lg:rounded-2xl flex items-center justify-center text-white shadow-sm">
            <BarChart3 size={20} className="lg:scale-105" />
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-gray-900 leading-none tracking-tight">Project Report</h1>
            <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase mt-1 lg:mt-1.5 tracking-widest opacity-80">Holistic Project Audit & Execution Status</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
           <Link 
             href="/report/pdf" 
             className="hidden lg:flex items-center gap-1.5 bg-gray-900 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-black/5 hover:bg-black transition-all"
           >
              <FileText size={12} /> Office Copy
           </Link>
           <button 
             onClick={downloadPDF}
             disabled={generating}
             className="w-10 h-10 lg:w-auto lg:h-10 lg:px-6 rounded-xl lg:rounded-xl glass-effect flex items-center justify-center gap-2 text-orange-600 shadow-sm active:scale-95 transition-all disabled:opacity-50 hover:bg-orange-50"
           >
             {generating ? (
               <div className="w-5 h-5 border-2 border-orange-600/20 border-t-orange-600 rounded-full animate-spin" />
             ) : (
               <>
                <Download size={18} />
                <span className="hidden lg:block text-[9px] font-black uppercase tracking-widest">Download Report</span>
               </>
             )}
           </button>
        </div>
      </header>

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Left Side: Summary Metrics */}
        <div className="lg:col-span-4 space-y-6 lg:space-y-8">
          <div className="glass-effect p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2.5rem] border-black/5 bg-white/40 shadow-sm space-y-6 lg:space-y-8">
            <div className="flex items-center gap-2.5">
              <FileText className="text-orange-600" size={16} />
              <h2 className="font-black text-gray-900 uppercase text-[9px] lg:text-[10px] tracking-widest leading-none">Material Intelligence</h2>
            </div>

            <div className="grid grid-cols-1 gap-2.5 lg:gap-3">
              <AggregateRow icon={<Package className="text-orange-500" size={14}/>} label="Total Cement" value={totalCement} unit="Bags" />
              <AggregateRow icon={<Package className="text-orange-500" size={14}/>} label="Fine Sand" value={totalFineSand} unit="CFT" />
              <AggregateRow icon={<Package className="text-orange-500" size={14}/>} label="Select Sand" value={totalSelectSand} unit="CFT" />
              <AggregateRow icon={<Package className="text-orange-500" size={14}/>} label="Brick Chips" value={totalChips} unit="CFT" />
            </div>
            
            <div className="pt-4 lg:pt-6 border-t border-black/5">
               <div className="flex justify-between items-center p-3.5 lg:p-4 bg-orange-600 rounded-xl lg:rounded-2xl shadow-sm">
                  <div className="flex items-center gap-2.5 lg:gap-3">
                     <Construction className="text-white opacity-80" size={16} />
                     <div>
                        <p className="text-[8px] lg:text-[9px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Total Trips</p>
                        <p className="text-xl lg:text-2xl font-black text-white leading-none">{totalTrips}</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <p className="text-[7px] font-black text-white/60 uppercase tracking-widest mt-0.5">Lifts Done</p>
                  </div>
               </div>
            </div>
          </div>

        </div>

        {/* Right Side: Log History */}
        <div className="lg:col-span-8 space-y-6 lg:space-y-8">
           <div className="glass-effect rounded-[1.5rem] lg:rounded-[2rem] border-black/5 bg-white/40 overflow-hidden shadow-sm">
              <div className="p-6 lg:p-8 border-b border-black/[0.02] flex justify-between items-center">
                 <div>
                    <h3 className="text-base lg:text-lg font-black text-gray-900 uppercase tracking-tight">Trip Audit History</h3>
                    <p className="text-[9px] lg:text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Live execution ledger</p>
                 </div>
                 <Link href="/materials" className="hidden lg:flex items-center gap-1.5 text-[9px] font-black text-orange-600 uppercase tracking-widest group">
                    Full Archive <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
              {/* Desktop View: Professional Table */}
              <div className="hidden lg:block overflow-x-auto">
                 <table className="w-full text-left min-w-[600px]">
                    <thead className="bg-gray-50/30">
                       <tr className="border-b border-black/[0.02]">
                          <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Entry Date</th>
                          <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Material Payload</th>
                          <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Handled By</th>
                          <th className="px-8 py-4 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Floor</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-black/[0.01]">
                       {logs.slice(0, 8).map((log) => (
                          <tr key={log._id} className="hover:bg-white/60 transition-all group">
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100/20">
                                      <Calendar size={14} strokeWidth={2.5} />
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black text-gray-900 leading-none">{new Date(log.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short' })}</p>
                                      <p className="text-[9px] text-gray-400 font-bold mt-1.5 opacity-60 uppercase">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-3">
                                   {[
                                     { val: log.cement, color: 'text-blue-600', bg: 'bg-blue-50', label: 'CMT' },
                                     { val: log.sand_fine, color: 'text-amber-600', bg: 'bg-amber-50', label: 'FS' },
                                     { val: log.sand_selection, color: 'text-orange-600', bg: 'bg-orange-50', label: 'SS' },
                                     { val: log.brick_chips, color: 'text-red-600', bg: 'bg-red-50', label: 'BC' }
                                   ].filter(m => m.val > 0).map((m, idx) => (
                                      <div key={idx} className={`${m.bg} ${m.color} px-2 py-1 rounded-lg border border-black/[0.03] space-x-1.5 flex items-center`}>
                                         <span className="text-[8px] font-black uppercase opacity-60 tracking-tighter">{m.label}</span>
                                         <span className="text-[10px] font-black">{m.val}</span>
                                      </div>
                                   ))}
                                   {([log.cement, log.sand_fine, log.sand_selection, log.brick_chips].every(v => v === 0)) && (
                                      <span className="text-[9px] font-black text-gray-300 italic">No Payload</span>
                                   )}
                                </div>
                             </td>
                             <td className="px-8 py-5">
                                <div className="flex items-center gap-2">
                                   <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-[8px] font-black text-white shrink-0">
                                      {log.loggedBy?.charAt(0).toUpperCase() || 'U'}
                                   </div>
                                   <span className="text-[10px] font-black text-gray-600 uppercase tracking-tight">{log.loggedBy || 'Unknown'}</span>
                                </div>
                             </td>
                             <td className="px-8 py-5 text-right">
                                <div className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border border-orange-100/50">
                                   <Layers size={10} strokeWidth={3} />
                                   {log.tier}
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>

              {/* Mobile View: Vertical Card List */}
              <div className="lg:hidden divide-y divide-black/[0.03]">
                 {logs.slice(0, 8).map((log) => (
                    <div key={log._id} className="p-5 space-y-4">
                       <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                             <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                                <Calendar size={16} strokeWidth={2.5} />
                             </div>
                             <div>
                                <p className="text-xs font-black text-gray-900 leading-none">
                                   {new Date(log.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                                </p>
                                <p className="text-[9px] text-gray-400 font-bold mt-1 opacity-60 uppercase">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                             </div>
                          </div>
                          <div className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tight border border-orange-100/50">
                             {log.tier}
                          </div>
                       </div>

                       <div className="flex flex-wrap gap-2">
                          {[
                            { val: log.cement, icon: <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />, name: 'Cement' },
                            { val: log.sand_fine, icon: <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />, name: 'Fine' },
                            { val: log.sand_selection, icon: <div className="w-1.5 h-1.5 rounded-full bg-amber-600" />, name: 'Select' },
                            { val: log.brick_chips, icon: <div className="w-1.5 h-1.5 rounded-full bg-red-500" />, name: 'Chips' }
                          ].filter(m => m.val > 0).map((m, idx) => (
                             <div key={idx} className="flex items-center gap-1.5 bg-white/50 px-2.5 py-1.5 rounded-xl border border-black/[0.03] shadow-sm">
                                {m.icon}
                                <span className="text-[9px] font-black text-gray-500 uppercase">{m.name}:</span>
                                <span className="text-[10px] font-black text-gray-900">{m.val}</span>
                             </div>
                          ))}
                       </div>

                       <div className="flex items-center justify-between pt-2 border-t border-black/[0.02]">
                          <div className="flex items-center gap-2">
                             <div className="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-[7px] font-black text-white">
                                {log.loggedBy?.charAt(0).toUpperCase() || 'U'}
                             </div>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{log.loggedBy || 'Unknown'}</span>
                          </div>
                          <div className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">Entry Verified</div>
                       </div>
                    </div>
                 ))}
              </div>
              <div className="p-4 bg-gray-50/20 lg:hidden text-center border-t border-black/[0.02]">
                 <Link href="/materials" className="text-[9px] font-black text-orange-600 uppercase tracking-widest">View Full Archive</Link>
              </div>
           </div>
        </div>
      </div>

      {/* HIDDEN PDF TEMPLATE */}
      <div className="fixed -left-[9999px] top-0 pointer-events-none" style={{ zIndex: -100 }}>
        <div ref={reportRef}>
          <ReportDocument 
            logs={logs}
            totalCement={totalCement}
            totalFineSand={totalFineSand}
            totalSelectSand={totalSelectSand}
            totalChips={totalChips}
            totalTrips={totalTrips}
            uniqueUsers={uniqueUsers}
            isPdf={true}
            showOfficeCopy={false}
            showCopyLabel={false}
            projectName={projectName}
          />
        </div>
      </div>

    </div>
  );
}

function AggregateRow({ icon, label, value, unit }: any) {
  return (
    <div className="flex items-center justify-between p-3.5 px-4 bg-white/50 rounded-xl border border-black/[0.01] hover:bg-white/70 transition-all shadow-sm group">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
          {icon}
        </div>
        <span className="text-[9px] lg:text-[10px] font-black text-gray-500 uppercase tracking-tight">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-lg font-black text-orange-600 leading-none">{value}</span>
        <span className="text-[8px] font-bold text-gray-400 lowercase">{unit}</span>
      </div>
    </div>
  );
}
