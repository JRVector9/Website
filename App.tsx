
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TerminalConsole } from './components/TerminalConsole';
import { ServiceGrid } from './components/ServiceGrid';
import { StatusBoard } from './components/StatusBoard';

const App: React.FC = () => {
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (booting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] cursor-wait">
        <div className="text-[#ff7043] retro-text text-4xl glow-orange animate-pulse text-center">
          <div className="mb-2">SYSTEM BOOTING...</div>
          <div className="text-xs opacity-40 font-mono text-slate-500">V9_KERNEL_OS v4.0.12</div>
          <div className="mt-4 w-48 h-1 bg-slate-900 border border-slate-800 mx-auto overflow-hidden">
            <div className="h-full bg-[#ff7043] animate-[loading_2s_ease-in-out]"></div>
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col gap-6 max-w-7xl mx-auto text-slate-300">
      <Header />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 flex flex-col gap-6">
          <TerminalConsole />
          <StatusBoard />
        </div>

        <div className="lg:col-span-6 flex flex-col gap-6">
          <section className="bg-[#0a0a0a] border border-slate-800 p-6 border-glow-slate">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 bg-[#ff7043] rounded-full animate-pulse shadow-[0_0_8px_#ff7043]"></span>
              <h2 className="retro-text text-2xl uppercase glow-slate text-slate-100">ENGINEERING_MODULES</h2>
            </div>
            <ServiceGrid />
          </section>

          <section className="bg-[#0a0a0a] border border-slate-800 p-6 border-glow-slate flex-grow relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <span className="text-8xl retro-text text-[#ff7043]">09</span>
             </div>
             <h2 className="retro-text text-2xl mb-4 border-b border-slate-800 pb-2 uppercase glow-slate text-slate-100">MISSION_CONTROL.LOG</h2>
             <div className="space-y-4">
                <p className="text-slate-400 leading-relaxed text-sm font-mono">
                  <span className="text-slate-100 font-bold uppercase">Vector Nine</span> focuses on deep-tech engineering and high-availability architecture.
                </p>
                <div className="p-4 bg-slate-900/50 border border-slate-800 border-l-4 border-l-[#ff7043]">
                   <p className="text-slate-200 italic text-lg glow-slate">
                     "비전에 정확한 방향을 더하다"
                   </p>
                </div>
                <p className="text-slate-500 text-xs font-mono">
                  Trajectory accuracy is our primary metric. We design, build, and maintain mission-critical systems.
                </p>
             </div>
          </section>
        </div>
      </div>

      <footer className="mt-auto pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] opacity-40 uppercase tracking-widest gap-2 font-mono">
        <div className="flex gap-4">
          <span>OS: V9_STABLE</span>
          <span>UPTIME: 100%</span>
          <span>LOC: SEOUL_KR</span>
        </div>
        <div>(C) 2024 VECTOR NINE. RAW_ENGINEERING_COLLECTIVE.</div>
      </footer>
    </div>
  );
};

export default App;
