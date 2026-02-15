"use client";

import React, { useEffect, useState } from 'react';
import ReportDocument from '@/components/ReportDocument';

export default function PDFViewPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    fetch('/api/logs')
      .then(res => res.json())
      .then(data => {
        setLogs(data);
        setLoading(false);
      });
      
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(data => setProjectName(data.projectName));
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
      <div id="report-container" className="bg-white shadow-2xl mx-auto" style={{ width: '720px' }}>
        <ReportDocument 
          logs={logs}
          totalCement={totalCement}
          totalFineSand={totalFineSand}
          totalSelectSand={totalSelectSand}
          totalChips={totalChips}
          totalTrips={totalTrips}
          uniqueUsers={uniqueUsers}
          projectName={projectName}
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
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          
          /* Only show the report container and its children */
          #report-container, #report-container * {
            visibility: visible;
          }

          /* Position the report at the top left */
          #report-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
          }

          /* Hide specific UI elements explicitly */
          nav, footer, .no-print, header { 
            display: none !important; 
          }
          
          /* Ensure backgrounds print correctly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Page break handling */
          .report-page-section {
            break-after: page;
            page-break-after: always;
            margin-bottom: 0 !important;
            box-shadow: none !important;
          }
          
          /* Reset body and html for print */
          body, html {
            background: white !important;
            height: auto !important;
            overflow: visible !important;
          }
        }

        /* Screen Preview Styling */
        @media screen {
          .report-page-section {
            margin-bottom: 40px;
            box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
          }
        }
      `}</style>
    </div>
  );
}
