/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, FileEdit, Eye, Layers, Grid3X3, Download, Home, Settings, LogOut, Bell, Search } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import { ReportForm } from './components/ReportForm';
import { ReportView } from './components/ReportView';
import { ReportData } from './types';

export default function App() {
  const [isEditing, setIsEditing] = useState(true);
  const [activeMenu, setActiveMenu] = useState('editor');
  const [data, setData] = useState<ReportData>({
    type: 'ASSORT',
    companyName: 'ISHAYAT FASHIONS LTD',
    address: '562/1, Bahadurpur, Banglabazar, Gazipur -1703',
    buyerName: 'GLOBAL EXPORTS INC',
    style: 'EG-2024-SUMMER',
    color: 'NAVY BLUE',
    poNumber: 'PO-882190',
    cartonQty: 100,
    sizeRatios: [
      { id: '1', size: 'S', ratio: 6 },
      { id: '2', size: 'M', ratio: 12 },
      { id: '3', size: 'L', ratio: 12 },
      { id: '4', size: 'XL', ratio: 6 },
    ],
    sections: [],
  });

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    const element = document.getElementById('report-content');
    if (!element) {
      alert('Report content not found. Please try again.');
      return;
    }

    const opt = {
      margin: [5, 5] as [number, number],
      filename: `CTN_Report_${data.poNumber || 'Export'}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Could not generate PDF. You can still use the "Print A4" button and select "Save as PDF" in the print dialog.');
    }
  };

  const setTab = (type: 'ASSORT' | 'SOLID') => {
    if (type === 'SOLID' && data.sections.length === 0) {
      setData({
        ...data,
        type,
        sections: [{
          id: crypto.randomUUID(),
          poNumber: data.poNumber,
          cartonQty: data.cartonQty,
          startCartonNo: 1,
          sizeRatios: JSON.parse(JSON.stringify(data.sizeRatios))
        }]
      });
    } else {
      setData({ ...data, type });
    }
  };

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden font-sans select-none">
      {/* Sidebar Navigation */}
      <aside className="no-print w-64 bg-slate-900 flex flex-col border-r border-slate-800 shadow-2xl z-50">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-10 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="text-white" size={20} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-sm font-black text-white tracking-widest uppercase truncate w-32">
                {data.companyName.split(' ')[0]} ERP
              </h1>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Garment QC Ops</span>
            </div>
          </div>

          <nav className="space-y-8">
            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 ml-2">Main Menu</p>
              <div className="space-y-1">
                <button
                  onClick={() => setIsEditing(true)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    isEditing
                      ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileEdit size={16} />
                  Editor Workspace
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    !isEditing
                      ? 'bg-blue-600/10 text-blue-400 shadow-[inset_0_0_0_1px_rgba(37,99,235,0.2)]'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Eye size={16} />
                  Live Preview
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 ml-2">Packing Lists</p>
              <div className="space-y-1">
                <button
                  onClick={() => setTab('ASSORT')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    data.type === 'ASSORT'
                      ? 'text-blue-400 font-black'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${data.type === 'ASSORT' ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`} />
                  Assort PL Mode
                </button>
                <button
                  onClick={() => setTab('SOLID')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                    data.type === 'SOLID'
                      ? 'text-blue-400 font-black'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <div className={`w-1.5 h-1.5 rounded-full ${data.type === 'SOLID' ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'}`} />
                  Solid PL Mode
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className="mt-auto p-6 space-y-4">
          <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 group hover:bg-slate-800/50 transition-colors">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300 uppercase">QC</div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-white uppercase tracking-tight">Active Session</span>
                  <span className="text-[8px] text-slate-500 font-bold uppercase italic">Admin Operator</span>
                </div>
             </div>
             <button className="w-full py-1.5 rounded bg-slate-700 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:bg-red-900/20 hover:text-red-400 transition-colors flex items-center justify-center gap-2">
                <LogOut size={10} />
                Terminate
             </button>
          </div>
          <p className="text-[8px] text-slate-600 font-bold text-center uppercase tracking-widest italic">System v2.4.5 — Gazipur HUB</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        {/* Header Controls */}
        <header className="no-print bg-white border-b border-slate-200 px-8 py-3.5 flex justify-between items-center shadow-sm z-40">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search PO or Style..." 
                className="bg-slate-100 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 py-1.5 pl-9 pr-4 rounded-full text-xs font-medium w-64 transition-all outline-none"
              />
            </div>
            <div className="h-4 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
               <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
               <span className="text-[10px] font-black text-blue-700 uppercase tracking-tight">{data.type} MODE ACTIVE</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
               <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                 <Bell size={18} />
                 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
               </button>
               <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                 <Settings size={18} />
               </button>
            </div>
            <div className="h-6 w-[1px] bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg shadow-lg shadow-blue-500/20 hover:bg-blue-500 transition-all font-black text-xs uppercase tracking-widest leading-none active:scale-95"
              >
                <Download size={16} />
                Export PDF
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-lg shadow-lg hover:bg-slate-800 transition-all font-black text-xs uppercase tracking-widest hover:-translate-y-0.5 active:scale-95 border border-slate-700"
              >
                <Printer size={16} />
                Print A4
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
          <div className="max-w-5xl mx-auto pb-32">
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 0, scale: 0.98, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: 10 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="no-print"
                >
                  <ReportForm data={data} onChange={setData} />
                  
                  {/* Live Preview Anchor */}
                  <div className="mt-24 opacity-40 hover:opacity-100 transition-all duration-700 grayscale hover:grayscale-0 scale-[0.8] origin-top border-t-8 border-slate-200 pt-24 cursor-zoom-in group">
                    <div className="text-center mb-12">
                       <span className="bg-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-[0.6em] px-20 py-4 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                        Live Drafting Preview
                       </span>
                    </div>
                    <ReportView data={data} />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="view"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 40 }}
                  className="flex justify-center"
                >
                  <ReportView data={data} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="no-print bg-white text-slate-400 px-10 py-4 text-[10px] flex justify-between items-center font-bold border-t border-slate-200 uppercase tracking-widest">
          <div className="flex gap-10 items-center">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span className="text-slate-600">Global QC Terminal Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">|</span>
              <span>Workspace: {data.companyName.split(' ')[0]}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
             <p className="italic font-normal lowercase tracking-tight scale-90">Last saved: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             <div className="w-4 h-4 bg-slate-100 rounded-full flex items-center justify-center text-[8px] border border-slate-200">?</div>
          </div>
        </footer>
      </div>

      {/* PDF Generation Target (Hidden but renderable) */}
      <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none -z-50">
        <div id="report-content" className="bg-white w-[210mm] min-h-[297mm]">
           <ReportView data={data} />
        </div>
      </div>

      {/* Hidden Print View (Standard Browser Print) */}
      <div className="hidden print:block bg-white w-full">
         <ReportView data={data} />
      </div>
    </div>
  );
}

