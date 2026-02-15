"use client";

import React from 'react';

// The original interface ReportDocumentProps is being replaced by an inline type definition
// as per the user's instruction.

export default function ReportDocument({
  logs,
  totalCement,
  totalFineSand,
  totalSelectSand,
  totalChips,
  totalTrips,
  uniqueUsers,
  isPdf = false,
  showOfficeCopy = false, // Default value changed from true to false as per instruction
  showCopyLabel = true,
  type = "ORIGINAL", // New prop with default value
  projectName = "PROJECT: INFRASTRUCTURE DEVELOPMENT - SITE A1" // New prop with default value
}: {
  logs: any[];
  totalCement: number;
  totalFineSand: number;
  totalSelectSand: number;
  totalChips: number;
  totalTrips: number;
  uniqueUsers: number;
  isPdf?: boolean;
  showOfficeCopy?: boolean;
  showCopyLabel?: boolean;
  type?: "ORIGINAL" | "DUPLICATE"; // Type definition for the new 'type' prop
  projectName?: string; // Type definition for the new 'projectName' prop
}) {
  const [mounted, setMounted] = React.useState(false);
  const [timestamp] = React.useState(new Date());

  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return <div style={{ width: '720px', padding: '60px', margin: '0 auto', background: 'white' }} />;

  // Constants for pagination (tuned for A4 720px width)
  const ITEMS_PER_FIRST_PAGE = 5;  // Conservative limit for page 1
  const ITEMS_PER_PAGE = 12;       // Conservative limit for data pages

  // Helper to chunk logs
  const chunkLogs = (logs: any[]) => {
    const chunks = [];
    let currentLogIndex = 0;
    
    // First page chunk
    const firstPageCount = Math.min(logs.length, ITEMS_PER_FIRST_PAGE);
    if (firstPageCount > 0) {
        chunks.push(logs.slice(0, firstPageCount));
        currentLogIndex = firstPageCount;
    } else {
        chunks.push([]); 
    }

    // Subsequent page chunks
    while (currentLogIndex < logs.length) {
      const nextChunkSize = Math.min(logs.length - currentLogIndex, ITEMS_PER_PAGE);
      chunks.push(logs.slice(currentLogIndex, currentLogIndex + nextChunkSize));
      currentLogIndex += nextChunkSize;
    }
    
    return chunks;
  };

  const PaginatedReport =({ type }: { type: 'SITE' | 'OFFICE' }) => {
     const logChunks = chunkLogs(logs);
     const totalPages = logChunks.length;

     return (
       <>
         {logChunks.map((chunk, pageIndex) => (
            <div 
              key={`${type}-${pageIndex}`}
              className={`bg-white text-black font-mono leading-relaxed pdf-export-template report-page-section`}
              style={{ 
                width: '720px', 
                height: '1018px',         
                padding: '40px',          
                margin: '0 auto',
                backgroundColor: '#ffffff',
                color: '#000000',
                fontFamily: 'Courier, "Courier New", monospace',
                pageBreakAfter: 'always', 
                marginBottom: '80px',     
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',  
                overflow: 'hidden',
                boxSizing: 'border-box'   // Ensure padding doesn't expand height
              }}
            >
              {/* HEADER (Only on First Page) */}
              {pageIndex === 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', marginBottom: '24px', borderBottom: '2px solid #000000' }}>
                    <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 4px 0', textTransform: 'uppercase' }}>CONSTRUCT TRACK</h1>
                    <div style={{ marginTop: '16px' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>{projectName}</p>
                        <p style={{ fontSize: '12px', margin: '0', textTransform: 'uppercase' }}>Document Ref: #CTR-{timestamp.getTime().toString().slice(-6)}</p>
                        {showCopyLabel && (
                        <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '4px 0 0 0', textTransform: 'uppercase', padding: '4px 8px', border: '1px solid #000', display: 'inline-block' }}>{type} COPY</p>
                        )}
                    </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>Generated Date</p>
                    <p style={{ fontSize: '14px', fontWeight: 'bold', margin: '4px 0 0 0' }}>{timestamp.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p style={{ fontSize: '12px', margin: '2px 0 0 0' }}>{timestamp.toLocaleTimeString('en-BD')}</p>
                    <p style={{ fontSize: '12px', fontWeight: 'bold', margin: '4px 0 0 0' }}>Page {pageIndex + 1} of {totalPages}</p>
                    </div>
                </div>
              )}

              {/* Page Number for subsequent pages */}
              {pageIndex > 0 && (
                 <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 'bold' }}>Page {pageIndex + 1} of {totalPages}</p>
                 </div>
              )}

              {/* CONTENT AREA with Bottom Buffer */}
              <div style={{ flex: 1, paddingBottom: '24px', boxSizing: 'border-box' }}>
                {/* SECTION I & II (Only on First Page) */}
                {pageIndex === 0 && (
                    <>
                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>I. Material Inventory Summary</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
                        <thead style={{ display: 'table-header-group' }}>
                            <tr style={{ backgroundColor: '#f3f4f6' }}>
                            <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'left', fontSize: '10px' }}>Material Category</th>
                            <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'left', fontSize: '10px' }}>Quantity (Total)</th>
                            <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'left', fontSize: '10px' }}>Units</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>Cement Bags</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>{totalCement}</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>Bags</td></tr>
                            <tr><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>Fine Sand (FS)</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>{totalFineSand}</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>CFT</td></tr>
                            <tr><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>Select Sand (SS)</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>{totalSelectSand}</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>CFT</td></tr>
                            <tr><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>Brick Chips</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>{totalChips}</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>CFT</td></tr>
                            <tr><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>Vertical Logistics (Trips)</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>{totalTrips}</td><td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>Trips</td></tr>
                        </tbody>
                        </table>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>II. Project Execution Metrics</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
                        <tbody>
                            <tr>
                            <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'left', fontSize: '10px', backgroundColor: '#f3f4f6', width: '50%' }}>Total Verified Trips</th>
                            <td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>{totalTrips} Trips logged by crane</td>
                            </tr>
                            <tr>
                            <th style={{ border: '1px solid #000000', padding: '8px', textAlign: 'left', fontSize: '10px', backgroundColor: '#f3f4f6' }}>Authorized Operators</th>
                            <td style={{ border: '1px solid #000000', padding: '8px', fontSize: '10px' }}>{uniqueUsers} Site Managers</td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </>
                )}

                {/* SECTION III (Split across pages) */}
                <div style={{ marginBottom: '20px' }}>
                    {pageIndex === 0 && (
                    <h2 style={{ fontSize: '14px', fontWeight: 'bold', margin: '0 0 8px 0', textTransform: 'uppercase' }}>
                        III. Detailed Site Ledger
                    </h2>
                    )}
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000000' }}>
                    <thead style={{ display: 'table-header-group' }}>
                        <tr style={{ backgroundColor: '#f3f4f6' }}>
                        <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px', width: '20%' }}>Timestamp</th>
                        <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px', width: '20%' }}>Operator</th>
                        <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px', width: '15%' }}>Floor</th>
                        <th style={{ border: '1px solid #000000', padding: '10px', textAlign: 'left', fontSize: '10px' }}>Material Consumption</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chunk.map((log: any) => (
                        <tr key={log._id}>
                            <td style={{ border: '1px solid #000000', padding: '8px', fontSize: '9px' }}>
                            {new Date(log.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })}
                            <br/>
                            {new Date(log.timestamp).toLocaleTimeString('en-BD', { hour: '2-digit', minute: '2-digit', hour12: true })}
                            </td>
                            <td style={{ border: '1px solid #000000', padding: '8px', fontSize: '9px' }}>{log.loggedBy}</td>
                            <td style={{ border: '1px solid #000000', padding: '8px', fontSize: '9px' }}>{log.tier}</td>
                            <td style={{ border: '1px solid #000000', padding: '8px', fontSize: '9px' }}>
                            {log.cement > 0 && `C:${log.cement}; `}
                            {log.sand_fine > 0 && `F:${log.sand_fine}; `}
                            {log.sand_selection > 0 && `S:${log.sand_selection}; `}
                            {log.brick_chips > 0 && `B:${log.brick_chips}; `}
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              </div>

              {/* FOOTER & SIGNATURES AREA (Fixed at bottom) */}
              <div style={{ marginTop: 'auto' }}>
                {/* Signatures: Only show on the very last page of the set */}
                {pageIndex === totalPages - 1 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                        <div style={{ textAlign: 'center' }}>
                        <div style={{ borderTop: '1px solid #000000', width: '200px', paddingTop: '10px' }}>
                            <p style={{ fontSize: '9px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>Site Supervisor</p>
                        </div>
                        <p style={{ fontSize: '8px', marginTop: '4px' }}>(Name & Signature)</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                        <div style={{ borderTop: '1px solid #000000', width: '200px', paddingTop: '10px' }}>
                            <p style={{ fontSize: '9px', fontWeight: 'bold', margin: '0', textTransform: 'uppercase' }}>Site In-Charge</p>
                        </div>
                        <p style={{ fontSize: '8px', marginTop: '4px' }}>(Final Seal)</p>
                        </div>
                    </div>
                )}
                
                {/* Footer Content */}
                <div style={{ paddingTop: '12px', borderTop: '1px solid #000000', textAlign: 'center' }}>
                    <p style={{ fontSize: '8px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold', margin: '0' }}>Verified Audit Report • {type} COPY</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '4px', opacity: 0.6 }}>
                        <p style={{ fontSize: '7px', margin: '0' }}>By TANOY</p>
                        <p style={{ fontSize: '7px', margin: '0' }}>+8801753902360</p>
                        <p style={{ fontSize: '7px', margin: '0' }}>Page {pageIndex + 1} of {totalPages}</p>
                    </div>
                </div>
              </div>

            </div>
         ))}
       </>
     );
  };

  return (
    <>
      <PaginatedReport type="SITE" />
      {showOfficeCopy && <PaginatedReport type="OFFICE" />}
    </>
  );
}
