import React from 'react';
import { ReportData, ReportSection } from '../types';

interface ReportViewProps {
  data: ReportData;
}

const CartonGrid: React.FC<{ start: number; qty: number }> = ({ start, qty }) => {
  const cartonNumbers = Array.from({ length: qty }, (_, i) => start + i);
  const rows = [];
  for (let i = 0; i < cartonNumbers.length; i += 30) {
    rows.push(cartonNumbers.slice(i, i + 30));
  }

  return (
    <div className="excel-grid">
      {rows.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((num) => (
            <div key={num} className="excel-cell hover:bg-blue-50 cursor-default">
              {num}
            </div>
          ))}
          {row.length < 30 && Array.from({ length: 30 - row.length }).map((_, i) => (
            <div key={`empty-${i}`} className="excel-cell bg-slate-50 opacity-30"></div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

const SectionBlock: React.FC<{ section: ReportSection; style: string; color: string }> = ({ section, style, color }) => {
  const totalRatio = section.sizeRatios.reduce((acc, curr) => acc + curr.ratio, 0);
  const totalOrderQty = totalRatio * section.cartonQty;

  return (
    <div className="mb-10 break-inside-avoid relative">
      {/* Section Header Card */}
      <div className="bg-slate-900 text-white px-4 py-2 flex justify-between items-center rounded-t-sm shadow-sm">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Section PO</span>
          <span className="text-sm font-black tracking-tight">{section.poNumber}</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="block text-[8px] font-bold text-slate-400 uppercase leading-none">Style / Color</span>
            <span className="text-[10px] font-black uppercase">{style} — {color}</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-700"></div>
          <div className="text-right">
            <span className="block text-[8px] font-bold text-slate-400 uppercase leading-none">Total Sec Qty</span>
            <span className="text-[10px] font-black text-blue-400">{totalOrderQty.toLocaleString()} PCS</span>
          </div>
        </div>
      </div>

      <div className="border border-slate-800 border-t-0 p-4 bg-white shadow-sm">
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="space-y-1">
            <div className="flex justify-between items-end border-b border-slate-100 pb-1">
              <span className="text-[9px] font-black text-slate-400 uppercase">Carton Range</span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {section.startCartonNo} — {section.startCartonNo + section.cartonQty - 1}
              </span>
            </div>
            <div className="flex justify-between items-end border-b border-slate-100 pb-1">
              <span className="text-[9px] font-black text-slate-400 uppercase">Total Cartons</span>
              <span className="text-xs font-bold text-slate-800">{section.cartonQty} CTNS</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between items-end border-b border-slate-100 pb-1">
              <span className="text-[9px] font-black text-slate-400 uppercase">Ratio / CTN</span>
              <span className="text-xs font-bold text-slate-800 font-mono">{totalRatio} PCS</span>
            </div>
            <div className="flex justify-between items-end border-b border-slate-100 pb-1">
              <span className="text-[9px] font-black text-slate-400 uppercase">Verification</span>
              <span className="text-[9px] font-black text-green-600 uppercase italic">Validated</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border border-slate-800">
                <th className="border-r border-slate-800 px-3 py-1.5 text-[9px] uppercase text-left w-1/4 font-black">Size Info</th>
                {section.sizeRatios.map(sr => (
                  <th key={sr.id} className="border-r border-slate-800 px-1 py-1.5 text-[9px] uppercase text-center font-bold">{sr.size || '-'}</th>
                ))}
                <th className="px-1 py-1.5 text-[9px] uppercase text-center font-black bg-slate-200">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border border-slate-800 border-t-0">
                <td className="border-r border-slate-800 px-3 py-1.5 text-[9px] font-bold uppercase bg-slate-50">Assort (PCS)</td>
                {section.sizeRatios.map(sr => (
                  <td key={sr.id} className="border-r border-slate-800 px-1 py-1.5 text-[10px] text-center font-mono font-bold bg-yellow-50/20">{sr.ratio}</td>
                ))}
                <td className="px-1 py-1.5 text-[10px] text-center font-black bg-slate-100 font-mono">{totalRatio}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 flex items-center justify-between">
            <span>Identification & Counting Matrix</span>
            <span className="text-slate-300">30 Units / Row</span>
          </div>
          <CartonGrid start={section.startCartonNo} qty={section.cartonQty} />
        </div>
      </div>
    </div>
  );
};

export const ReportView: React.FC<ReportViewProps> = ({ data }) => {
  const isAssort = data.type === 'ASSORT';
  const totalRatio = data.sizeRatios.reduce((acc, curr) => acc + curr.ratio, 0);
  const totalOrderQty = totalRatio * data.cartonQty;

  return (
    <div className="bg-white p-10 shadow-2xl border border-slate-300 min-h-[297mm] w-full max-w-[210mm] mx-auto overflow-hidden flex flex-col print:p-0 print:shadow-none print:border-none">
      {/* Sheet Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
            {data.companyName || 'ULTRA APPAREL MANUFACTURING LTD.'}
          </h1>
          <p className="text-sm font-medium text-slate-500">{data.address}</p>
        </div>
        <div className="text-right">
          <h2 className="text-lg font-bold text-blue-700 uppercase tracking-tighter">
            {isAssort ? 'Carton Counting Report (Assort)' : 'Carton Counting Report (Solid)'}
          </h2>
          <div className="text-[10px] font-mono font-bold text-slate-400 mt-1 uppercase">Buyer: {data.buyerName}</div>
        </div>
      </div>

      {isAssort ? (
        <>
          <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-8">
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Buyer:</span>
              <span className="text-xs font-bold text-slate-800 uppercase">{data.buyerName}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Qty (PCS):</span>
              <span className="text-xs font-bold text-slate-800 font-mono">{totalOrderQty.toLocaleString()}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Style:</span>
              <span className="text-xs font-bold text-slate-800 uppercase">{data.style}</span>
            </div>
             <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total CTN:</span>
              <span className="text-xs font-bold text-slate-800 font-mono">{data.cartonQty}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Color:</span>
              <span className="text-xs font-bold text-slate-800 uppercase">{data.color}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase">PO Number:</span>
              <span className="text-xs font-bold text-slate-800 font-mono uppercase">{data.poNumber}</span>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full border-collapse border border-slate-800">
              <thead>
                <tr className="bg-slate-50">
                  <th className="border border-slate-800 px-3 py-1.5 text-[10px] uppercase text-left w-1/4 font-black">Description</th>
                  {data.sizeRatios.map(sr => (
                    <th key={sr.id} className="border border-slate-800 px-2 py-1.5 text-[10px] uppercase text-center font-bold">{sr.size || '-'}</th>
                  ))}
                  <th className="border border-slate-800 px-2 py-1.5 text-[10px] uppercase text-center font-black bg-slate-200">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-800 px-3 py-1.5 text-[10px] font-bold uppercase bg-slate-50">PCS/CTN</td>
                  {data.sizeRatios.map(sr => (
                    <td key={sr.id} className="border border-slate-800 px-2 py-1.5 text-xs text-center font-mono font-bold bg-yellow-50/50">{sr.ratio}</td>
                  ))}
                  <td className="border border-slate-800 px-2 py-1.5 text-xs text-center font-black bg-slate-100 font-mono">{totalRatio}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex-1 overflow-hidden mb-8">
            <div className="text-[9px] font-bold text-slate-400 mb-2 flex justify-between items-center px-1">
              <span className="uppercase tracking-widest">Carton Number Checklist (1 — {data.cartonQty})</span>
              <span className="uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">30 Units Per Row</span>
            </div>
            <CartonGrid start={1} qty={data.cartonQty} />
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-visible space-y-2">
          {data.sections.length > 0 ? (
            data.sections.map(section => (
              <SectionBlock key={section.id} section={section} style={data.style} color={data.color} />
            ))
          ) : (
            <div className="h-48 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 font-black italic uppercase tracking-[0.2em]">
              No Sections Defined
            </div>
          )}
        </div>
      )}
      
      {/* No Footer Signatures */}
    </div>
  );
};
