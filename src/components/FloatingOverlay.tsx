import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Zap,
  Volume2,
  TrendingUp,
  BarChart3,
  Flashlight,
  Wifi,
  Phone,
  X,
  Minimize2,
  Maximize2,
  Move,
  Bot,
  Send,
  Sparkles,
} from "lucide-react";
import { TradingState, PhoneState } from "../types";

interface FloatingOverlayProps {
  onSendCommand: (cmd: string) => void;
  phoneState: PhoneState;
  setPhoneState: React.Dispatch<React.SetStateAction<PhoneState>>;
  tradingState: TradingState;
  isSpeaking: boolean;
  lastResponse: string;
}

export const FloatingOverlay: React.FC<FloatingOverlayProps> = ({
  onSendCommand,
  phoneState,
  setPhoneState,
  tradingState,
  isSpeaking,
  lastResponse,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 24, y: 120 }); // offset from right & bottom
  const [isListening, setIsListening] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isMinimizedMode, setIsMinimizedMode] = useState(false); // phone minimization simulator
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 24,
    posY: 120,
  });

  // Voice speech recognition for floating overlay
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.lang = "bn-BD";
      rec.continuous = false;
      rec.interimResults = false;

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (text) {
          onSendCommand(text);
          setInputVal("");
        }
        setIsListening(false);
      };
      recognitionRef.current = rec;
    }
  }, [onSendCommand]);

  const toggleVoiceListen = () => {
    if (!recognitionRef.current) {
      // Fallback prompt
      const fallbackCmd = prompt("জারভিসকে ভয়েস কমান্ড লিখুন (উদা: 'টর্চ জ্বালাও' বা 'নিজে নিজে ট্রেড নাও'):");
      if (fallbackCmd) onSendCommand(fallbackCmd);
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current.stop();
        setTimeout(() => recognitionRef.current?.start(), 150);
      }
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = dragRef.current.startX - e.clientX;
    const deltaY = dragRef.current.startY - e.clientY;
    setPosition({
      x: Math.max(10, Math.min(window.innerWidth - 80, dragRef.current.posX + deltaX)),
      y: Math.max(10, Math.min(window.innerHeight - 80, dragRef.current.posY + deltaY)),
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSendCommand(inputVal.trim());
    setInputVal("");
  };

  return (
    <>
      {/* Floating System Icon (Always on screen / Picture-in-Picture style) */}
      <div
        style={{ right: `${position.x}px`, bottom: `${position.y}px` }}
        className="fixed z-50 select-none touch-none transition-transform"
      >
        <div className="relative group">
          {/* Pulsing ring indicator */}
          <div
            className={`absolute -inset-1 rounded-full blur-md opacity-75 animate-pulse ${
              isSpeaking
                ? "bg-cyan-400"
                : isListening
                ? "bg-rose-500"
                : "bg-emerald-500/60"
            }`}
          />

          {/* Floating Orb Button */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onClick={() => {
              if (!isDragging) setIsOpen((prev) => !prev);
            }}
            className={`relative w-14 h-14 rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.4)] border-2 transition-all active:scale-95 ${
              isOpen
                ? "bg-slate-900 border-cyan-400 text-cyan-300"
                : isSpeaking
                ? "bg-cyan-950 border-cyan-400 text-cyan-200 animate-bounce"
                : "bg-gradient-to-tr from-slate-950 via-emerald-950 to-slate-900 border-emerald-400/80 text-emerald-400 hover:scale-105"
            }`}
            title="জারভিস ফ্লোটিং আইকন (স্ক্রিনের উপরে সর্বদা সক্রিয়)"
          >
            {isListening ? (
              <Mic className="w-6 h-6 text-rose-400 animate-ping" />
            ) : isSpeaking ? (
              <Volume2 className="w-6 h-6 text-cyan-400 animate-pulse" />
            ) : (
              <Bot className="w-7 h-7 text-emerald-400" />
            )}

            {/* Tiny live status pip */}
            <span
              className={`absolute top-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${
                tradingState.autoTradingEnabled ? "bg-emerald-400" : "bg-amber-400"
              }`}
            />
          </div>

          {/* Hover Hint */}
          {!isOpen && (
            <div className="absolute right-16 top-2 hidden group-hover:flex items-center px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-200 text-[11px] font-['Hind_Siliguri',sans-serif] whitespace-nowrap border border-slate-800 shadow-xl pointer-events-none">
              জারভিস ফ্লোটিং অ্যাসিস্ট্যান্ট (ক্লিক করুন)
            </div>
          )}
        </div>
      </div>

      {/* Floating Interactive Panel Window */}
      {isOpen && (
        <div
          style={{ right: `${Math.min(position.x, window.innerWidth - 340)}px`, bottom: `${position.y + 65}px` }}
          className="fixed z-50 w-80 sm:w-96 max-h-[85vh] flex flex-col bg-slate-950/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950/70 to-slate-900 px-3.5 py-2.5 border-b border-emerald-900/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-1 rounded-lg bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white font-mono">
                    JARVIS FLOATING ASSISTANT
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    OVERLAY
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-['Hind_Siliguri',sans-serif]">
                  স্ক্রিনের উপরে সর্বদা সক্রিয়
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setIsMinimizedMode((prev) => !prev)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                title={isMinimizedMode ? "ফুল স্ক্রিন" : "মিনিমাইজ ভিউ"}
              >
                {isMinimizedMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                title="বন্ধ করুন"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Voice Bar & Live Response */}
          <div className="p-3 bg-slate-900/70 border-b border-slate-800">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={toggleVoiceListen}
                className={`flex-1 py-2 px-3 rounded-xl flex items-center justify-center space-x-2 font-mono text-xs font-bold transition-all shadow-md active:scale-95 ${
                  isListening
                    ? "bg-rose-600 text-white animate-pulse"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="font-['Hind_Siliguri',sans-serif]">
                  {isListening ? "জারভিস শুনছে... বলুন" : "মুখে কথা বলুন (ভয়েস সক্রিয়)"}
                </span>
              </button>

              <button
                onClick={() => onSendCommand("নিজে নিজে এনালাইসিস করে ট্রেড নাও")}
                className="p-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl transition-all active:scale-95"
                title="এখনই নিজে নিজে ট্রেড নাও"
              >
                <Zap className="w-4 h-4 text-amber-400" />
              </button>
            </div>

            {/* Latest AI Bengali Response Bubble */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-['Hind_Siliguri',sans-serif] text-slate-200 flex items-start space-x-2">
              <Bot className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
              <div className="flex-1">
                <span className="text-[9px] font-mono text-slate-500 block">JARVIS REPLY:</span>
                <p className="line-clamp-3 leading-relaxed">{lastResponse}</p>
              </div>
            </div>
          </div>

          {/* Quick Phone Controls Strip */}
          <div className="px-3 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between gap-1">
            <button
              onClick={() => onSendCommand(phoneState.torch ? "টর্চ বন্ধ করো" : "টর্চ অন করো")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-['Hind_Siliguri',sans-serif] flex items-center justify-center space-x-1 border transition-all ${
                phoneState.torch
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Flashlight className="w-3 h-3 text-amber-400" />
              <span>{phoneState.torch ? "টর্চ বন্ধ" : "টর্চ অন"}</span>
            </button>

            <button
              onClick={() => onSendCommand(phoneState.wifi ? "ওয়াইফাই বন্ধ করো" : "ওয়াইফাই অন করো")}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-['Hind_Siliguri',sans-serif] flex items-center justify-center space-x-1 border transition-all ${
                phoneState.wifi
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:text-white"
              }`}
            >
              <Wifi className="w-3 h-3 text-cyan-400" />
              <span>{phoneState.wifi ? "ওয়াইফাই অফ" : "ওয়াইফাই অন"}</span>
            </button>

            <button
              onClick={() => onSendCommand("সাউন্ড বাড়িয়ে দাও")}
              className="flex-1 py-1.5 px-2 rounded-lg text-[10px] font-['Hind_Siliguri',sans-serif] flex items-center justify-center space-x-1 border bg-slate-900 text-slate-300 border-slate-800 hover:text-white"
            >
              <Volume2 className="w-3 h-3 text-cyan-400" />
              <span>ভলিউম +</span>
            </button>
          </div>

          {/* Quick Auto-Trading Mini Panel */}
          <div className="p-3 space-y-2 max-h-56 overflow-y-auto">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1 font-['Hind_Siliguri',sans-serif]">
                <TrendingUp className="w-3 h-3 text-emerald-400" /> অটো ট্রেডিং স্ট্যাটাস:
              </span>
              <span className="text-emerald-400 font-bold">
                {tradingState.autoTradingEnabled ? "সক্রিয় (ACTIVE)" : "বন্ধ"}
              </span>
            </div>

            {/* Quick Action Chips */}
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              <button
                onClick={() => onSendCommand("জারভিস, নিজে নিজে এনালাইসিস করে ট্রেড নাও")}
                className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 text-[11px] font-['Hind_Siliguri',sans-serif] text-left transition-all active:scale-95"
              >
                <span className="font-bold block">⚡ অটো ট্রেড নাও</span>
                <span className="text-[9px] text-slate-400">মার্কেট বুঝে সরাসরি এন্ট্রি</span>
              </button>

              <button
                onClick={() => onSendCommand("বিটকয়েনের ট্রেডিং সিগন্যাল দাও")}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-['Hind_Siliguri',sans-serif] text-left transition-all active:scale-95"
              >
                <span className="font-bold block">📊 BTC সিগন্যাল</span>
                <span className="text-[9px] text-slate-400">এন্ট্রি ও স্টপ লস জানো</span>
              </button>

              <button
                onClick={() => onSendCommand("ট্রেডিংভিউ ওপেন করো")}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-['Hind_Siliguri',sans-serif] text-left transition-all active:scale-95"
              >
                <span className="font-bold block">📈 TradingView</span>
                <span className="text-[9px] text-slate-400">চার্ট স্ক্রিন ওপেন</span>
              </button>

              <button
                onClick={() => onSendCommand("বাইন্যান্স ওপেন করো")}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-['Hind_Siliguri',sans-serif] text-left transition-all active:scale-95"
              >
                <span className="font-bold block">🟡 Binance Pro</span>
                <span className="text-[9px] text-slate-400">অর্ডার এক্সিকিউটর</span>
              </button>
            </div>
          </div>

          {/* Quick Input Bar */}
          <form onSubmit={handleFormSubmit} className="p-2.5 bg-slate-900/90 border-t border-slate-800 flex items-center gap-1.5">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="যেকোনো কমান্ড লিখুন বা বলুন..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-['Hind_Siliguri',sans-serif]"
            />
            <button
              type="submit"
              className="p-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
