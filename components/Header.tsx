
import React from 'react';
import { AnimatedLogo } from './Logo';

interface HeaderProps {
  companyName: string;
  slogan: string;
  subLabel: string;
}

export const Header: React.FC<HeaderProps> = ({ companyName, slogan, subLabel }) => {
  return (
    <header className="flex flex-col md:flex-row items-center md:justify-between gap-6 py-6 border-b border-slate-800">
      <div className="flex items-center gap-6">
        <AnimatedLogo className="w-20 h-20 md:w-24 md:h-24" />
        
        <div>
          <h1 className="font-mono text-3xl md:text-5xl font-bold glow-orange tracking-wider leading-tight uppercase">{companyName}</h1>
          <p className="text-slate-500 text-[10px] tracking-[0.4em] mt-1 uppercase font-mono opacity-60">{subLabel}</p>
        </div>
      </div>

      <div className="text-center md:text-right">
        <div className="text-xl md:text-2xl italic text-slate-300 glow-slate mb-2 font-serif opacity-90">
          {slogan}
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
