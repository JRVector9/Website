
import React from 'react';
import { Service } from '../types';

const SERVICES: Service[] = [
  { id: '01', title: 'Cloud Architect', description: 'High-availability infrastructure design.', status: 'ONLINE', version: '2.4.0' },
  { id: '02', title: 'D-Apps Engine', description: 'Smart contract development & Web3 modules.', status: 'DEVELOPING', version: '0.9.1' },
  { id: '03', title: 'Neural Core', description: 'Integrated AI models & automation modules.', status: 'ONLINE', version: '1.2.0' },
  { id: '04', title: 'Security Shield', description: 'End-to-end encryption & pentesting.', status: 'MAINTENANCE', version: '5.0.4' }
];

export const ServiceGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {SERVICES.map((s) => (
        <div 
          key={s.id} 
          className="group p-4 border border-slate-800 hover:border-slate-500 transition-all cursor-pointer bg-slate-900/30 hover:bg-slate-800/40"
        >
          <div className="flex justify-between items-start mb-2">
            <span className="text-slate-600 text-[10px] font-mono">#0x{s.id}</span>
            <span className={`text-[8px] px-2 py-0.5 border font-mono ${
              s.status === 'ONLINE' ? 'border-emerald-500/30 text-emerald-400' :
              s.status === 'MAINTENANCE' ? 'border-rose-500/30 text-rose-400' :
              'border-cyan-500/30 text-cyan-400'
            }`}>
              {s.status}
            </span>
          </div>
          <h3 className="retro-text text-xl glow mb-1 uppercase text-slate-200">{s.title}</h3>
          <p className="text-slate-500 text-xs mb-3 leading-relaxed h-8">
            {s.description}
          </p>
          <div className="flex justify-between items-center">
             <span className="text-[10px] text-slate-700 font-mono">v{s.version}</span>
             <button className="text-[10px] uppercase border border-slate-700 px-2 py-1 hover:bg-slate-200 hover:text-black transition-colors font-mono">
               View Log
             </button>
          </div>
        </div>
      ))}
    </div>
  );
};
