
import React, { useState, useEffect, useRef } from 'react';
import { TerminalLine } from '../types';
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

const SYSTEM_PROMPT = `You are the Vector Nine OS Terminal Agent. 
Company Name: Vector Nine (벡터 나인)
Slogan: "비전에 정확한 방향을 더하다"
Nature: Engineering-first IT company. Respond in Korean.
Style: Professional, concise, DOS terminal. Max 3 sentences.`;

const VFS: Record<string, any> = {
  '/': {
    'about.txt': 'Vector Nine: Adding precise direction to vision.\nIT Solutions Engineering Collective.',
    'mission.txt': 'Our mission is to engineer trajectories, not just software.',
    'secret.txt': 'SYSTEM_MSG: Use code V9_ALPHA_2024 for a 9% priority pass.',
    'projects': {
      'cloud_arch.doc': 'Cloud Architecture implementation log v2.4',
      'neural_core.doc': 'Neural Core integration documentation.',
      'dapps.doc': 'Decentralized Applications engine v0.9'
    }
  }
};

type FormStep = 'IDLE' | 'ASK_NAME' | 'ASK_CONTACT' | 'ASK_DETAILS' | 'SUBMITTING';

export const TerminalConsole: React.FC = () => {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  const [glitch, setGlitch] = useState(false);
  
  const [formStep, setFormStep] = useState<FormStep>('IDLE');
  const [formData, setFormData] = useState({ name: '', contact: '', details: '' });

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
  const playSuccessSound = () => {
    playSound(1000, 'sine', 0.05, 0.05);
  };

  const addLine = (text: string, type: TerminalLine['type'] = 'info') => {
    const newLine: TerminalLine = {
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour12: false }),
    };
    setLines(prev => [...prev, newLine]);
  };

  useEffect(() => {
    const initialMessages = [
      "V9_OS KERNEL LOADING...",
      "SYSTEM CHECK... [STABLE]",
      "TYPE 'help' FOR COMMANDS OR 'inquiry' TO START PROJECT LOG."
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < initialMessages.length) {
        addLine(initialMessages[i], 'info');
        playSound(600 + i * 100, 'sine', 0.05, 0.02);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  const getDirContent = (path: string) => {
    const parts = path.split('/').filter(Boolean);
    let current = VFS['/'];
    for (const part of parts) {
      if (current[part] && typeof current[part] === 'object') {
        current = current[part];
      } else { return null; }
    }
    return current;
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;

    const fullCmd = inputValue.trim();
    setInputValue('');
    
    if (formStep !== 'IDLE') {
      addLine(fullCmd, 'command');
      if (formStep === 'ASK_NAME') {
        setFormData(prev => ({ ...prev, name: fullCmd }));
        addLine("연락처를 입력해주세요.", 'info');
        setFormStep('ASK_CONTACT');
      } 
      else if (formStep === 'ASK_CONTACT') {
        setFormData(prev => ({ ...prev, contact: fullCmd }));
        addLine("상세 내용을 입력해주세요.", 'info');
        setFormStep('ASK_DETAILS');
      } 
      else if (formStep === 'ASK_DETAILS') {
        setFormData(prev => ({ ...prev, details: fullCmd }));
        setIsProcessing(true);
        addLine("데이터 기록 중...", 'info');
        setTimeout(() => {
          addLine("프로젝트 인콰이어리가 성공적으로 기록되었습니다.", 'success');
          setFormStep('IDLE');
          setIsProcessing(false);
          playSuccessSound();
        }, 1200);
      }
      return;
    }

    const [cmd, ...args] = fullCmd.split(' ');
    addLine(fullCmd, 'command');
    setIsProcessing(true);
    const lowerCmd = cmd.toLowerCase();

    switch (lowerCmd) {
      case 'inquiry':
        addLine("--- PROJECT INQUIRY PROTOCOL ---", 'success');
        addLine("성함을 입력해주십시오.", 'info');
        setFormStep('ASK_NAME');
        setIsProcessing(false);
        break;

      case 'help':
        addLine("AVAILABLE PROTOCOLS:", 'info');
        addLine("ls/dir - List data", 'info');
        addLine("cd [dir] - Nav directory", 'info');
        addLine("cat [file] - Read data", 'info');
        addLine("inquiry - Start project consultation", 'success');
        addLine("about - System meta", 'info');
        addLine("clear - Flush buffer", 'info');
        playSuccessSound();
        setIsProcessing(false);
        break;

      case 'about':
        addLine(ASCII_LOGO, 'success');
        addLine("VECTOR NINE: ADDING PRECISE DIRECTION TO VISION.", 'success');
        playSuccessSound();
        setIsProcessing(false);
        break;

      case 'ls':
      case 'dir':
        const dir = getDirContent(currentPath);
        if (dir) {
          Object.keys(dir).forEach(k => addLine(typeof dir[k] === 'object' ? `<DIR> ${k}` : `      ${k}`, 'info'));
        }
        setIsProcessing(false);
        break;

      case 'cd':
        const target = args[0];
        if (!target || target === '/') setCurrentPath('/');
        else if (target === '..') {
          const p = currentPath.split('/').filter(Boolean); p.pop();
          setCurrentPath('/' + p.join('/'));
        } else {
          const cur = getDirContent(currentPath);
          if (cur && cur[target] && typeof cur[target] === 'object') {
            setCurrentPath(currentPath === '/' ? `/${target}` : `${currentPath}/${target}`);
          } else { addLine(`ERR: PATH NOT FOUND`, 'error'); playErrorSound(); }
        }
        setIsProcessing(false);
        break;

      case 'cat':
        const file = args[0];
        const cDir = getDirContent(currentPath);
        if (cDir && cDir[file] && typeof cDir[file] === 'string') {
          addLine(cDir[file], 'success');
          playSuccessSound();
        } else { addLine(`ERR: FILE NOT FOUND`, 'error'); playErrorSound(); }
        setIsProcessing(false);
        break;

      case 'clear':
        setLines([]);
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
        } catch (error) { addLine("CONNECTION ERROR.", 'error'); playErrorSound(); }
        setIsProcessing(false);
    }
  };

  return (
    <div 
      className={`bg-[#050505] border border-slate-700 flex flex-col h-[480px] border-glow-slate overflow-hidden cursor-text transition-all ${glitch ? 'glitch-active' : ''}`}
      onClick={() => inputRef.current?.focus()}
    >
      <div className="bg-slate-800/40 px-3 py-1 flex justify-between items-center border-b border-slate-700 shrink-0">
        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">v9_shell_{currentPath}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-slate-600"></div>
          <div className="w-2 h-2 rounded-full bg-[#ff7043] animate-pulse"></div>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-grow p-4 font-mono text-xs md:text-sm overflow-y-auto space-y-1 scroll-smooth">
        {lines.map((line, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="text-slate-600 shrink-0 select-none">[{line.timestamp}]</span>
            <pre className={`whitespace-pre-wrap break-all font-mono
              ${line.type === 'command' ? 'text-[#ff7043]' : ''}
              ${line.type === 'error' ? 'text-red-400' : ''}
              ${line.type === 'success' ? 'text-slate-100 glow-slate' : ''}
              ${line.type === 'info' ? 'text-slate-400' : ''}
            `}>
              {line.type === 'command' ? '> ' : ''}
              {line.text}
            </pre>
          </div>
        ))}
        
        <form onSubmit={handleCommand} className="flex items-center gap-1 mt-1">
          <span className="text-[#ff7043] shrink-0 select-none">
            {formStep === 'IDLE' ? `v9@user:${currentPath}$` : `[FORM_INPUT]:`}
          </span>
          <input
            ref={inputRef}
            type="text"
            className="bg-transparent border-none outline-none text-slate-200 flex-grow caret-[#ff7043] font-mono text-sm"
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
