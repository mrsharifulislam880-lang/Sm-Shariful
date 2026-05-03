import React from 'react';
import { Plus, Trash2, Copy, Home, Grid3X3, Layers } from 'lucide-react';
import { ReportData, SizeRatio, ReportSection } from '../types';

interface ReportFormProps {
  data: ReportData;
  onChange: (data: ReportData) => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleSectionChange = (sectionId: string, field: keyof ReportSection, value: any) => {
    onChange({
      ...data,
      sections: data.sections.map(s => s.id === sectionId ? { ...s, [field]: value } : s)
    });
  };

  const addSection = () => {
    const lastSection = data.sections[data.sections.length - 1];
    const nextStart = lastSection ? lastSection.startCartonNo + lastSection.cartonQty : 1;
    
    const newSection: ReportSection = {
      id: crypto.randomUUID(),
      poNumber: data.poNumber || '',
      cartonQty: 0,
      startCartonNo: nextStart,
      sizeRatios: data.sizeRatios.length > 0 ? JSON.parse(JSON.stringify(data.sizeRatios)) : [{ id: crypto.randomUUID(), size: '', ratio: 0 }],
    };
    onChange({ ...data, sections: [...data.sections, newSection] });
  };

  const addSizeRatio = (sectionId?: string) => {
    const newSize: SizeRatio = { id: crypto.randomUUID(), size: '', ratio: 0 };
    if (!sectionId) {
      onChange({ ...data, sizeRatios: [...data.sizeRatios, newSize] });
    } else {
      onChange({
        ...data,
        sections: data.sections.map(s => s.id === sectionId ? { ...s, sizeRatios: [...s.sizeRatios, newSize] } : s)
      });
    }
  };

  const updateSizeRatio = (id: string, field: keyof SizeRatio, value: any, sectionId?: string) => {
    if (!sectionId) {
      onChange({
        ...data,
        sizeRatios: data.sizeRatios.map(sr => sr.id === id ? { ...sr, [field]: value } : sr)
      });
    } else {
      onChange({
        ...data,
        sections: data.sections.map(s => s.id === sectionId ? {
          ...s,
          sizeRatios: s.sizeRatios.map(sr => sr.id === id ? { ...sr, [field]: value } : sr)
        } : s)
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Global Header Info */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2">
          <Home size={14} className="text-slate-400" />
          <h3 className="text-xs font-black uppercase text-slate-800 tracking-widest">Base Production Data</h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-6">
          <div className="space-y-1 md:col-span-2">
            <label className="label-text">Company Name</label>
            <input type="text" name="companyName" value={data.companyName} onChange={handleChange} placeholder="e.g. ULTRA APPAREL LTD" className="input-field font-black" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="label-text">Factory Address</label>
            <input type="text" name="address" value={data.address} onChange={handleChange} placeholder="Full factory location" className="input-field" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="label-text">Buyer / Client</label>
            <input type="text" name="buyerName" value={data.buyerName} onChange={handleChange} placeholder="Customer Name" className="input-field font-bold" />
          </div>
          <div className="space-y-1">
            <label className="label-text">Internal Style</label>
            <input type="text" name="style" value={data.style} onChange={handleChange} placeholder="Style #" className="input-field uppercase" />
          </div>
          <div className="space-y-1">
            <label className="label-text">Color Variant</label>
            <input type="text" name="color" value={data.color} onChange={handleChange} placeholder="Color Name" className="input-field uppercase" />
          </div>
        </div>
      </div>

      {data.type === 'ASSORT' ? (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30 flex items-center gap-2">
              <Grid3X3 size={14} className="text-slate-400" />
              <h3 className="text-xs font-black uppercase text-slate-800 tracking-widest">Carton Batch Details</h3>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <label className="label-text">Global PO Number</label>
                <input type="text" name="poNumber" value={data.poNumber} onChange={handleChange} placeholder="e.g. PO-77281" className="input-field font-mono font-bold" />
              </div>
              <div className="space-y-1">
                <label className="label-text">Total Carton Volume</label>
                <input type="number" name="cartonQty" value={data.cartonQty} onChange={(e) => onChange({ ...data, cartonQty: parseInt(e.target.value) || 0 })} placeholder="0" className="input-field font-mono font-bold" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Layers size={14} className="text-slate-400" />
                <h3 className="text-xs font-black uppercase text-slate-900 tracking-widest">Size & Ratio Configuration</h3>
              </div>
              <button onClick={() => addSizeRatio()} className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg shadow-sm hover:bg-slate-800 transition-all text-[10px] font-black uppercase tracking-wider">
                <Plus size={14} /> Add Scale Size
              </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.sizeRatios.map(sr => (
                <div key={sr.id} className="group relative bg-slate-50 p-5 rounded-xl border border-slate-200 hover:border-blue-300 transition-all hover:bg-white hover:shadow-md">
                  <div className="flex gap-4 items-end">
                    <div className="flex-1 space-y-1">
                      <label className="label-text">Size</label>
                      <input type="text" value={sr.size} onChange={(e) => updateSizeRatio(sr.id, 'size', e.target.value)} placeholder="S/M/L" className="input-field text-center font-black bg-white" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <label className="label-text">PCS/CTN</label>
                      <input type="number" value={sr.ratio} onChange={(e) => updateSizeRatio(sr.id, 'ratio', parseInt(e.target.value) || 0)} className="input-field text-center font-mono font-black bg-white" />
                    </div>
                  </div>
                  <button 
                    onClick={() => onChange({ ...data, sizeRatios: data.sizeRatios.filter(x => x.id !== sr.id) })}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 hover:border-red-200 shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-center justify-between bg-slate-900 px-6 py-6 rounded-xl shadow-lg border border-slate-800">
            <div className="flex flex-col">
              <h3 className="text-sm font-black uppercase text-white tracking-widest">Multi-Section Management</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Active Protocol: Solid PL Sectioning</p>
            </div>
            <button onClick={addSection} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all font-black text-xs uppercase tracking-widest">
              <Plus size={18} /> Append New Section
            </button>
          </div>

          {data.sections.map((section, idx) => (
            <div key={section.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden border-t-4 border-t-blue-600 group">
              <div className="px-6 py-4 bg-slate-50 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-black">
                    {idx + 1}
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Operational Section #{idx + 1}</span>
                </div>
                <button 
                  onClick={() => onChange({ ...data, sections: data.sections.filter(s => s.id !== section.id) })}
                  className="w-8 h-8 rounded-full border border-slate-200 text-slate-300 hover:text-red-500 hover:border-red-200 transition-all flex items-center justify-center bg-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-1">
                    <label className="label-text">PO Number</label>
                    <input type="text" value={section.poNumber} onChange={(e) => handleSectionChange(section.id, 'poNumber', e.target.value)} className="input-field font-mono font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="label-text">Carton Qty</label>
                    <input type="number" value={section.cartonQty} onChange={(e) => handleSectionChange(section.id, 'cartonQty', parseInt(e.target.value) || 0)} className="input-field font-mono font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="label-text">Starting CTN #</label>
                    <input type="number" value={section.startCartonNo} onChange={(e) => handleSectionChange(section.id, 'startCartonNo', parseInt(e.target.value) || 0)} className="input-field font-mono font-bold bg-slate-50 border-dashed" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                   <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-2">
                       <Grid3X3 size={14} className="text-slate-400" />
                       <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Section Matrix Distribution</span>
                     </div>
                     <button onClick={() => addSizeRatio(section.id)} className="text-[10px] font-black text-blue-600 uppercase hover:text-blue-700 tracking-wider flex items-center gap-1">
                       <Plus size={12} /> Add Metric
                     </button>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                     {section.sizeRatios.map(sr => (
                        <div key={sr.id} className="relative group/size p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white hover:border-blue-200 transition-all">
                          <div className="space-y-3">
                            <input type="text" value={sr.size} placeholder="SIZE" onChange={(e) => updateSizeRatio(sr.id, 'size', e.target.value, section.id)} className="w-full bg-transparent text-xs font-black text-center outline-none border-b border-transparent focus:border-blue-400 transition-all p-1" />
                            <input type="number" value={sr.ratio} placeholder="RATIO" onChange={(e) => updateSizeRatio(sr.id, 'ratio', parseInt(e.target.value) || 0, section.id)} className="w-full bg-transparent text-xs font-mono font-black text-center outline-none border-b border-transparent focus:border-blue-400 transition-all p-1" />
                          </div>
                          <button 
                            onClick={() => handleSectionChange(section.id, 'sizeRatios', section.sizeRatios.filter(x => x.id !== sr.id))}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-300 hover:text-red-500 opacity-0 group-hover/size:opacity-100 transition-all shadow-sm"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
