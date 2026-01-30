
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TerminalConsole } from './components/TerminalConsole';
import { ServiceGrid } from './components/ServiceGrid';
import { StatusBoard } from './components/StatusBoard';
import { AdminPanel } from './components/AdminPanel';
import { SiteConfig } from './types';

const DEFAULT_CONFIG: SiteConfig = {
  companyName: 'VECTOR NINE',
  slogan: '비전에 정확한 방향을 더하다',
  subLabel: '/// ENGINEERING_COLLECTIVE_V9 ///',
  terminalTitle: 'Main_Console.sh',
  welcomeMessage: 'WELCOME TO VECTOR NINE CONSOLE.',
  inquiryBtnText: '[!] START_INQUIRY',
  adminBtnText: 'ADMIN',
  metricsTitle: 'SYSTEM_METRICS.DAT',
  modulesTitle: 'ENGINEERING_MODULES',
  missionTitle: 'MISSION_CONTROL.LOG',
  missionMainText: 'focuses on deep-tech engineering and high-availability architecture.',
  missionQuote: '비전에 정확한 방향을 더하다',
  missionSubText: '우리는 단순한 코드 작성을 넘어, 비즈니스가 나아가야 할 최적의 궤적을 설계합니다.',
  footerText: '(C) 2024 VECTOR NINE. RAW_ENGINEERING_COLLECTIVE.'
};

const App: React.FC = () => {
  const [booting, setBooting] = useState(true);
  const [extCmd, setExtCmd] = useState<string | undefined>(undefined);
  const [showAdmin, setShowAdmin] = useState(false);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(DEFAULT_CONFIG);

  useEffect(() => {
    const savedConfig = localStorage.getItem('v9_site_config');
    if (savedConfig) {
      setSiteConfig(prev => ({ ...prev, ...JSON.parse(savedConfig) }));
    }
    const timer = setTimeout(() => setBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const triggerCommand = (cmd: string) => {
    setExtCmd(cmd);
    setTimeout(() => setExtCmd(undefined), 100);
  };

  const handleConfigChange = (newConfig: SiteConfig) => {
    setSiteConfig(newConfig);
  };

  if (booting) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#050505] cursor-wait z-50">
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
      <Header 
        companyName={siteConfig.companyName} 
        slogan={siteConfig.slogan} 
        subLabel={siteConfig.subLabel}
      />
      
      <div className="h-1 overflow-hidden opacity-20 flex gap-2 font-mono text-[6px] whitespace-nowrap -mt-4 mb-2 select-none pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>
            {Math.random().toString(16).substr(2, 8).toUpperCase()}
          </span>
        ))}
      </div>

      {showAdmin && (
        <AdminPanel 
          onClose={() => setShowAdmin(false)} 
          onConfigChange={handleConfigChange}
          currentConfig={siteConfig}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex justify-between items-end px-1">
             <h2 className="retro-text text-xl text-slate-500 uppercase tracking-widest">{siteConfig.terminalTitle}</h2>
             <div className="flex gap-2 mb-1">
                <button 
                  onClick={() => triggerCommand('inquiry')}
                  className="text-[9px] border border-[#ff704350] px-2 py-0.5 text-[#ff7043] hover:bg-[#ff7043] hover:text-black transition-all font-mono font-bold"
                >
                  {siteConfig.inquiryBtnText}
                </button>
                <button 
                  onClick={() => setShowAdmin(true)}
                  className="text-[9px] border border-slate-700 px-2 py-0.5 text-slate-500 hover:border-slate-400 transition-all font-mono"
                >
                  {siteConfig.adminBtnText}
                </button>
             </div>
          </div>
          <TerminalConsole 
            externalCommand={extCmd} 
            onAdminAccess={() => setShowAdmin(true)}
            welcomeMessage={siteConfig.welcomeMessage}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <StatusBoard title={siteConfig.metricsTitle} />
             <div className="bg-slate-900/20 border border-slate-800 p-6 border-glow-slate flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#ff704305] to-transparent group-hover:via-[#ff704310] transition-all"></div>
                <h3 className="retro-text text-lg mb-2 text-[#ff7043]">QUICK ACCESS</h3>
                <p className="text-[11px] text-slate-500 font-mono leading-relaxed mb-4 relative">
                  터미널 기반의 상호작용은 엔지니어링의 정수입니다. 
                  직접 <span className="text-slate-300">inquiry</span>를 타이핑하여 작업을 의뢰하십시오.
                </p>
                <div className="grid grid-cols-2 gap-2 relative">
                   <button onClick={() => triggerCommand('about')} className="text-[9px] border border-slate-800 py-2 hover:bg-slate-800 transition-all font-mono">ABOUT_SYSTEM</button>
                   <button onClick={() => triggerCommand('ls')} className="text-[9px] border border-slate-800 py-2 hover:bg-slate-800 transition-all font-mono">FILE_BROWSER</button>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-6">
          <section className="bg-[#0a0a0a] border border-slate-800 p-6 border-glow-slate">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <span className="w-2 h-2 bg-[#ff7043] rounded-full animate-pulse shadow-[0_0_8px_#ff7043]"></span>
              <h2 className="retro-text text-2xl uppercase glow-slate text-slate-100">{siteConfig.modulesTitle}</h2>
            </div>
            <ServiceGrid />
          </section>

          <section className="bg-[#0a0a0a] border border-slate-800 p-6 border-glow-slate flex-grow relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <span className="text-8xl retro-text text-[#ff7043]">09</span>
             </div>
             <h2 className="retro-text text-2xl mb-4 border-b border-slate-800 pb-2 uppercase glow-slate text-slate-100">{siteConfig.missionTitle}</h2>
             <div className="space-y-4">
                <p className="text-slate-400 leading-relaxed text-sm font-mono">
                  <span className="text-slate-100 font-bold uppercase">{siteConfig.companyName}</span> {siteConfig.missionMainText}
                </p>
                <div className="p-4 bg-slate-900/50 border border-slate-800 border-l-4 border-l-[#ff7043]">
                   <p className="text-slate-200 italic text-lg glow-slate">
                     "{siteConfig.missionQuote}"
                   </p>
                </div>
                <p className="text-slate-500 text-xs font-mono">
                  {siteConfig.missionSubText}
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
        <div className="text-center">{siteConfig.footerText}</div>
      </footer>
    </div>
  );
};

export default App;
