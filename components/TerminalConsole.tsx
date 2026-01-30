
import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine, Inquiry } from '../types';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const ASCII_LOGO = `
 __      ________ _____ _______ ____  _____ 
 \\ \\    / /  ____/ ____|__   __/ __ \\|  __ \\
  \\ \\  / /| |__ | |       | | | |  | | |__) |
   \\ \\/ / |  __|| |       | | | |  | |  _  / 
    \\  /  | |___| |____   | | | |__| | | \\ \\ 
     \\/   |______\\_____|  |_|  \\____/|_|  \\_\\
                                             
          VECTOR NINE [SYSTEM-09]
`;

const SYSTEM_PROMPT = `You are the Vector Nine OS Terminal Agent. Respond in Korean. Style: Professional, concise, DOS terminal. Max 3 sentences.`;

const VFS: Record<string, any> = {
  '/': {
    'about.txt': 'Vector Nine: Adding precise direction to vision.\nIT Solutions Engineering Collective.',
    'mission.txt': 'Our mission is to engineer trajectories, not just software.',
    'projects': {
      'cloud_arch.doc': 'Cloud Architecture implementation log v2.4',
      'neural_core.doc': 'Neural Core integration documentation.'
    }
  }
};

type FormStep = 'IDLE' | 'ASK_NAME' | 'ASK_BUDGET' | 'ASK_DETAILS' | 'SUBMITTING';

interface TerminalProps {
  externalCommand?: string;
  onAdminAccess?: () => void;
  welcomeMessage: string;
}

export const TerminalConsole: React.FC<TerminalProps> = ({ externalCommand, onAdminAccess, welcomeMessage }) => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [glitch, setGlitch] = useState(false);
  
  const [formStep, setFormStep] = useState<FormStep>('IDLE');
  const [formData, setFormData] = useState({ name: '', budget: '', details: '' });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  const playSound = (freq: number, type: OscillatorType = 'square', duration: number = 0.05, vol: number = 0.1) => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.current.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.start();
    osc.stop(audioCtx.current.currentTime + duration);
  };

  const playTypeSound = () => playSound(200 + Math.random() * 50, 'sine', 0.02, 0.03);
  const playErrorSound = () => {
    playSound(80, 'sawtooth', 0.3, 0.1);
    setGlitch(true);
    setTimeout(() => setGlitch(false), 200);
  };
  const playSuccessSound = () => playSound(1000, 'sine', 0.05, 0.05);
  const playStepSound = () => {
    playSound(1200, 'square', 0.05, 0.03);
    setTimeout(() => playSound(1600, 'square', 0.05, 0.03), 50);
  };

  const addLine = (text: string, type: TerminalLine['type'] = 'info') => {
    const newLine: TerminalLine = {
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
    };
    setLines(prev => [...prev, newLine]);
  };

  const saveInquiry = (data: typeof formData) => {
    const existing: Inquiry[] = JSON.parse(localStorage.getItem('v9_inquiries') || '[]');
    const newEntry: Inquiry = { 
      ...data, 
      id: Date.now(), 
      date: new Date().toISOString(),
      status: 'NEW' 
    };
    localStorage.setItem('v9_inquiries', JSON.stringify([...existing, newEntry]));
  };

  useEffect(() => {
    const initialMessages = [
      "V9_OS KERNEL LOADING...",
      "SYSTEM STATUS: STABLE",
      welcomeMessage,
      "-------------------------------------------",
      "입력 가능한 명령어를 확인하려면 'help'를 입력하세요.",
      "작업 문의를 시작하시려면 'inquiry'를 입력하세요."
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < initialMessages.length) {
        const type = (i === 5) ? 'command' : 'info';
        addLine(initialMessages[i], type as any);
        playSound(600 + i * 50, 'sine', 0.05, 0.02);
        i++;
      } else { clearInterval(interval); }
    }, 150);
    return () => clearInterval(interval);
  }, [welcomeMessage]);

  useEffect(() => {
    if (externalCommand) {
      processCommand(externalCommand);
    }
  }, [externalCommand]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const processCommand = async (fullCmd: string) => {
    if (isProcessing) return;
    
    if (formStep !== 'IDLE') {
      addLine(fullCmd, 'command');
      if (formStep === 'ASK_NAME') {
        setFormData(prev => ({ ...prev, name: fullCmd }));
        playStepSound();
        addLine("[01/03] DATA RECEIVED.", 'success');
        addLine("[02/03] 예상 예산(만원) 혹은 협의 여부를 입력해주세요.", 'info');
        setFormStep('ASK_BUDGET');
      } 
      else if (formStep === 'ASK_BUDGET') {
        setFormData(prev => ({ ...prev, budget: fullCmd }));
        playStepSound();
        addLine("[02/03] BUDGET LOGGED.", 'success');
        addLine("[03/03] 요구사항 및 프로젝트 상세 설명을 입력해주세요.", 'info');
        setFormStep('ASK_DETAILS');
      } 
      else if (formStep === 'ASK_DETAILS') {
        const finalData = { ...formData, details: fullCmd };
        setFormData(finalData);
        playStepSound();
        addLine("[03/03] REQUIREMENTS LOGGED.", 'success');
        setIsProcessing(true);
        addLine("--- SAVING TO LOCAL_VFS ---", 'info');
        setTimeout(() => {
          saveInquiry(finalData);
          addLine("SUCCESS: 문의 내용이 시스템에 기록되었습니다.", 'success');
          addLine("Vector Nine 엔지니어가 곧 확인하겠습니다.", 'success');
          setFormStep('IDLE');
          setIsProcessing(false);
          playSuccessSound();
        }, 1200);
      }
      return;
    }

    addLine(fullCmd, 'command');
    setIsProcessing(true);
    const [cmd] = fullCmd.split(' ');
    const lowerCmd = cmd.toLowerCase();

    switch (lowerCmd) {
      case 'admin':
      case 'sudo':
        addLine("ACCESSING RESTRICTED AREA...", 'info');
        setTimeout(() => {
          if (onAdminAccess) {
            onAdminAccess();
            addLine("ACCESS GRANTED. ADMIN PANEL ACTIVATED.", 'success');
          } else {
            addLine("ERR: PERMISSION DENIED.", 'error');
            playErrorSound();
          }
          setIsProcessing(false);
        }, 800);
        break;

      case 'inquiry':
        playSuccessSound();
        addLine("--- PROJECT INQUIRY PROTOCOL ACTIVATED ---", 'success');
        addLine("[01/03] 귀하의 성함 또는 기업명을 입력해주십시오.", 'info');
        setFormStep('ASK_NAME');
        setIsProcessing(false);
        break;

      case 'help':
        addLine("AVAILABLE COMMANDS:", 'info');
        addLine("- inquiry : 프로젝트 문의 시작", 'success');
        addLine("- admin   : 관리자 로그 패널 (SUDO)", 'info');
        addLine("- ls      : 파일 목록 보기", 'info');
        addLine("- clear   : 화면 지우기", 'info');
        playSuccessSound();
        setIsProcessing(false);
        break;

      case 'clear':
        setLines([]);
        setIsProcessing(false);
        break;

      case 'ls':
        const dir = VFS['/'];
        Object.keys(dir).forEach(k => addLine(typeof dir[k] === 'object' ? `<DIR> ${k}` : `      ${k}`, 'info'));
        setIsProcessing(false);
        break;

      default:
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: fullCmd,
            config: { systemInstruction: SYSTEM_PROMPT, temperature: 0.7 },
          });
          addLine(response.text || "NO DATA.", 'info');
          playSuccessSound();
        } catch (error) { addLine("ERR: CONNECTION LOST.", 'error'); playErrorSound(); }
        setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    processCommand(inputValue.trim());
    setInputValue('');
  };

  return (
    <div 
      className={`bg-[#050505] border border-slate-700 flex flex-col h-[480px] border-glow-slate overflow-hidden cursor-text transition-all ${glitch ? 'glitch-active' : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="bg-slate-800/40 px-3 py-1 flex justify-between items-center border-b border-slate-700 shrink-0">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">v9_shell_{currentPath}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-700"></div>
          <div className="w-2 h-2 rounded-full bg-[#ff7043] animate-pulse"></div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-grow p-4 font-mono text-xs md:text-sm overflow-y-auto space-y-1 scroll-smooth scrollbar-hide">
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="text-slate-600 shrink-0 select-none">[{line.timestamp}]</span>
            <pre className={`whitespace-pre-wrap break-all font-mono
              ${line.type === 'command' ? 'text-[#ff7043] glow-orange font-bold' : ''}
              ${line.type === 'error' ? 'text-red-400' : ''}
              ${line.type === 'success' ? 'text-slate-100 glow-slate' : ''}
              ${line.type === 'info' ? 'text-slate-400' : ''}
            `}>
              {line.type === 'command' ? '> ' : ''}
              {line.text}
            </pre>
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex items-center gap-1 mt-1">
          <span className="text-[#ff7043] shrink-0 select-none font-bold">
            {formStep === 'IDLE' ? `v9@user:${currentPath}$` : `[IN_PROGRESS]:`}
          </span>
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent border-none outline-none text-slate-100 flex-grow caret-[#ff7043] font-mono text-sm"
            value={inputValue}
            onChange={(e) => { setInputValue(e.target.value); playTypeSound(); }}
            autoFocus
            disabled={isProcessing}
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  );
};
