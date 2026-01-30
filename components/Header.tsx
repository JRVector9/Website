
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex flex-col md:flex-row items-center md:justify-between gap-6 py-6 border-b border-slate-800">
      <div className="flex items-center gap-6">
        {/* Reproduced Logo from Image */}
        <div className="relative w-24 h-24 border-2 border-glow-orange flex items-center justify-center bg-black overflow-hidden logo-grid group">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff704310] to-transparent pointer-events-none"></div>
          <div className="retro-text text-5xl font-bold leading-none glow-orange flex items-baseline tracking-tighter">
            <span>9</span>
            <span className="text-4xl mx-1">&gt;</span>
            <span className="text-5xl animate-blink">_</span>
          </div>
        </div>
        
        <div>
          <h1 className="retro-text text-4xl md:text-6xl font-bold glow-orange tracking-widest leading-tight">VECTOR NINE</h1>
          <p className="text-slate-500 text-[10px] tracking-[0.4em] mt-1 uppercase font-mono opacity-60">/// ENGINEERING_COLLECTIVE_V9 ///</p>
        </div>
      </div>

      <div className="text-center md:text-right">
        <div className="text-xl md:text-2xl italic text-slate-300 glow-slate mb-2 font-serif opacity-90">
          비전에 정확한 방향을 더하다
        </div>
        <div className="text-[10px] text-slate-600 uppercase flex justify-center md:justify-end gap-4 tracking-[0.2em] font-mono">
          <span className="flex items-center gap-1"><span className="w-1 h-1 bg-emerald-500 rounded-full"></span> LINK: SECURE</span>
          <span>ST: ONLINE</span>
          <span>CH: CORE_09</span>
        </div>
      </div>
    </header>
  );
};
