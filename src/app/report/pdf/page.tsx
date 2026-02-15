"use client";

import React, { useEffect, useState } from 'react';
import ReportDocument from '@/components/ReportDocument';

export default function PDFViewPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Document...</div>;

  const totalCement = logs.reduce((acc, curr) => acc + (curr.cement || 0), 0);
  const totalFineSand = logs.reduce((acc, curr) => acc + (curr.sand_fine || 0), 0);
  const totalSelectSand = logs.reduce((acc, curr) => acc + (curr.sand_selection || 0), 0);
  const totalChips = logs.reduce((acc, curr) => acc + (curr.brick_chips || 0), 0);
  const totalTrips = logs.reduce((acc, curr) => acc + (curr.crane_lift || 0), 0);
  const uniqueUsers = new Set(logs.map(l => l.loggedBy)).size;

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="bg-white shadow-2xl mx-auto" style={{ width: '720px' }}>
        <ReportDocument 
          logs={logs}
          totalCement={totalCement}
          totalFineSand={totalFineSand}
          totalSelectSand={totalSelectSand}
          totalChips={totalChips}
          totalTrips={totalTrips}
          uniqueUsers={uniqueUsers}
        />
      </div>
      
      {/* Floating Print Button for easier access */}
      <div className="fixed bottom-8 right-8 no-print">
        <button 
          onClick={() => window.print()}
          className="bg-black text-white px-6 py-3 rounded-full font-bold shadow-xl hover:bg-gray-800 transition-all active:scale-95"
        >
          Print / Save as PDF
        </button>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; padding: 0 !important; }
          .min-h-screen { min-height: 0 !important; background: white !important; padding: 0 !important; }
          .shadow-2xl { shadow: none !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
}
