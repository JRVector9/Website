
import React from 'react';

export const StatusBoard: React.FC = () => {
  return (
    <div className="bg-[#0a0a0a] border border-slate-800 p-6 border-glow-slate">
      <h2 className="retro-text text-2xl mb-4 border-b border-slate-800 pb-2 uppercase glow-slate text-slate-100">SYSTEM_METRICS.DAT</h2>
      
      <div className="space-y-6">
        <div>
          <div className="flex justify-between text-[10px] uppercase mb-1 text-slate-500 font-mono">
            <span>Project Completion</span>
            <span className="text-[#ff7043]">87%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 border border-slate-800 p-[2px]">
            <div className="h-full bg-[#ff7043] shadow-[0_0_10px_#ff704380]" style={{ width: '87%' }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] uppercase mb-1 text-slate-500 font-mono">
            <span>Resource Efficiency</span>
            <span className="text-[#ff7043]">94%</span>
          </div>
          <div className="w-full h-3 bg-slate-900 border border-slate-800 p-[2px]">
            <div className="h-full bg-[#ff7043] shadow-[0_0_10px_#ff704380]" style={{ width: '94%' }}></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
           <div className="border border-slate-800 p-3 text-center bg-slate-900/50 hover:border-[#ff704340] transition-colors">
              <div className="text-2xl retro-text glow-slate text-slate-100">2,048</div>
              <div className="text-[8px] uppercase tracking-tighter text-slate-600 font-mono">Lines Written</div>
           </div>
           <div className="border border-slate-800 p-3 text-center bg-slate-900/50 hover:border-[#ff704340] transition-colors">
              <div className="text-2xl retro-text glow-slate text-slate-100">42</div>
              <div className="text-[8px] uppercase tracking-tighter text-slate-600 font-mono">Modules</div>
           </div>
           <div className="border border-slate-800 p-3 text-center bg-slate-900/50 hover:border-[#ff704340] transition-colors">
              <div className="text-2xl retro-text glow-slate text-slate-100">9.2s</div>
              <div className="text-[8px] uppercase tracking-tighter text-slate-600 font-mono">Latency</div>
           </div>
           <div className="border border-slate-800 p-3 text-center bg-slate-900/50 hover:border-[#ff704340] transition-colors">
              <div className="text-2xl retro-text glow-orange font-bold text-[#ff7043]">∞</div>
              <div className="text-[8px] uppercase tracking-tighter text-slate-600 font-mono">Direction</div>
           </div>
        </div>
      </div>
    </div>
  );
};
