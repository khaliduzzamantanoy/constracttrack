"use client";

import React from 'react';

interface ReportDocumentProps {
  logs: any[];
  totalCement: number;
  totalFineSand: number;
  totalSelectSand: number;
  totalChips: number;
  totalTrips: number;
  uniqueUsers: number;
  isPdf?: boolean;
}

export default function ReportDocument({ 
  logs, 
  totalCement, 
  totalFineSand, 
  totalSelectSand, 
  totalChips, 
  totalTrips, 
  uniqueUsers,
  isPdf = false
}: ReportDocumentProps) {
  const [mounted, setMounted] = React.useState(false);
  const [timestamp] = React.useState(new Date());

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div style={{ width: '720px', padding: '60px', margin: '0 auto', background: 'white' }} />;

  return (
    <div 
      className={`bg-white text-black font-mono leading-relaxed pdf-export-template`}
      style={{ 
        width: '720px', 
        padding: '60px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        color: '#000000',
        fontFamily: 'Courier, "Courier New", monospace'
      }}
    >
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', marginBottom: '24px', borderBottom: '2px solid #000000' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', textTransform: 'uppercase' }}>CONSTRUCT TRACK</h1>
          <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Material & Execution Audit Report</p>
          <div style={{ marginTop: '16px' }}>
            <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>Project: Infrastructure Development - Site A1</p>
            <p style={{ fontSize: '12px', margin: '0', textTransform: 'uppercase' }}>Document Ref: #CTR-{timestamp.getTime().toString().slice(-6)}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>Generated Date</p>
          <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <p style={{ fontSize: '12px', margin: '2px 0 0 0' }}>{timestamp.toLocaleTimeString('en-BD')}</p>
        </div>
      </div>

      {/* SECTION I */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>I. Material Inventory Summary</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
          <thead style={{ display: 'table-header-group' }}>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px' }}>Material Category</th>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px' }}>Quantity (Accumulated)</th>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px' }}>Units</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ pageBreakInside: 'avoid' }}><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>Cement Bags</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>{totalCement}</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>Bags</td></tr>
            <tr style={{ pageBreakInside: 'avoid' }}><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>Fine Sand (FS)</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>{totalFineSand}</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>CFT</td></tr>
            <tr style={{ pageBreakInside: 'avoid' }}><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>Select Sand (SS)</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>{totalSelectSand}</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>CFT</td></tr>
            <tr style={{ pageBreakInside: 'avoid' }}><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>Brick Chips</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>{totalChips}</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>CFT</td></tr>
            <tr style={{ pageBreakInside: 'avoid' }}><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>Vertical Logistics (Trips)</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>{totalTrips}</td><td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>Trips</td></tr>
          </tbody>
        </table>
      </div>

      {/* SECTION II */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>II. Project Execution Metrics</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
          <tbody>
            <tr style={{ pageBreakInside: 'avoid' }}>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px', backgroundColor: '#f3f4f6', width: '50%' }}>Total Verified Trips</th>
              <td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>{totalTrips} Trips logged by crane</td>
            </tr>
            <tr style={{ pageBreakInside: 'avoid' }}>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px', backgroundColor: '#f3f4f6' }}>Unique Authorized Operators</th>
              <td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>{uniqueUsers} Managers</td>
            </tr>
            <tr style={{ pageBreakInside: 'avoid' }}>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px', backgroundColor: '#f3f4f6' }}>Data Integrity Verification</th>
              <td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>100.0% Site Compliance</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* SECTION III */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>III. Detailed Site Ledger (Recent)</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
          <thead style={{ display: 'table-header-group' }}>
            <tr style={{ backgroundColor: '#f3f4f6' }}>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px', width: '20%' }}>Timestamp</th>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px', width: '20%' }}>Operator</th>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px', width: '15%' }}>Floor</th>
              <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px' }}>Material Consumption Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {logs.slice(0, 50).map((log) => (
              <tr key={log._id} style={{ pageBreakInside: 'avoid' }}>
                <td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>
                  {new Date(log.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                  <br/>
                  {new Date(log.timestamp).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </td>
                <td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>{log.loggedBy}</td>
                <td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>{log.tier}</td>
                <td style={{ border: '1px solid #000000', padding: '10px', fontSize: '10px' }}>
                  {log.cement > 0 && `Cement: ${log.cement} Bags; `}
                  {log.sand_fine > 0 && `FS: ${log.sand_fine} CFT; `}
                  {log.sand_selection > 0 && `SS: ${log.sand_selection} CFT; `}
                  {log.brick_chips > 0 && `Chips: ${log.brick_chips} CFT; `}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SIGNATURES */}
      <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #000000', width: '220px', paddingTop: '10px' }}>
            <p style={{ fontSize: '9px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>Site Supervisor / Engineer</p>
          </div>
          <p style={{ fontSize: '8px', marginTop: '8px' }}>(Authorized Signature & Name)</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ borderTop: '1px solid #000000', width: '220px', paddingTop: '10px' }}>
            <p style={{ fontSize: '9px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>Project Manager / Site In-Charge</p>
          </div>
          <p style={{ fontSize: '8px', marginTop: '8px' }}>(Stamp & Final Seal)</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ marginTop: '60px', paddingTop: '16px', borderTop: '1px solid #000000', textAlign: 'center' }}>
        <p style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', margin: '0' }}>This is a system-generated document and does not require a physical signature unless specified.</p>
        <p style={{ fontSize: '7px', marginTop: '8px', opacity: 0.8 }}>Designed and Developed by TANOY</p>
        <p style={{ fontSize: '7px', marginTop: '2px', opacity: 0.8 }}>WhatsApp Contact: +8801753902360</p>
        <p style={{ fontSize: '8px', marginTop: '8px', margin: '8px 0 0 0' }}>Page 1 of 1 • Internal Audit Copy • CTR-S-01</p>
      </div>
    </div>
  );
}
