import React from "react";
import { Cpu, Smartphone, Terminal, Code2, Volume2, VolumeX, ShieldCheck } from "lucide-react";

interface HeaderProps {
  activeTab: "dashboard" | "trading" | "python" | "phone";
  setActiveTab: (tab: "dashboard" | "trading" | "python" | "phone") => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  isMuted,
  setIsMuted,
  isOnline,
}) => {
  return (
    <header className="border-b border-cyan-950/60 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Identity */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Cpu className="w-5 h-5 animate-pulse text-cyan-400" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950"></div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-wider font-['Chakra_Petch',sans-serif] text-slate-100 uppercase">
                JARVIS <span className="text-cyan-400 text-xs font-normal border border-cyan-500/40 px-1.5 py-0.5 rounded bg-cyan-950/30">v3.8 AI</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-cyan-300 font-['Hind_Siliguri',sans-serif] bg-cyan-950/50 border border-cyan-800/40 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> বাংলা ভয়েস কন্ট্রোলার
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-tight font-['Hind_Siliguri',sans-serif]">
              আপনার ফোনের পূর্ণ নিয়ন্ত্রণ ও পাইথন কোড জেনারেটর
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/90 border border-slate-800 p-1 rounded-xl">
          <button
            id="tab-dashboard-btn"
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "dashboard"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-['Hind_Siliguri',sans-serif]">জারভিস কনসোল</span>
          </button>

          <button
            id="tab-trading-btn"
            onClick={() => setActiveTab("trading")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "trading"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-['Hind_Siliguri',sans-serif]">ট্রেডিং বট</span>
            <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-1 rounded font-mono">LIVE</span>
          </button>

          <button
            id="tab-phone-btn"
            onClick={() => setActiveTab("phone")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "phone"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-['Hind_Siliguri',sans-serif]">ফোন স্ক্রিন</span>
          </button>

          <button
            id="tab-python-btn"
            onClick={() => setActiveTab("python")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "python"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-['Hind_Siliguri',sans-serif]">পাইথন কোড সমূহ</span>
            <span className="bg-amber-500/30 text-amber-300 text-[10px] px-1 rounded font-mono">.py</span>
          </button>
        </div>

        {/* Audio Mute & Telemetry */}
        <div className="flex items-center space-x-2">
          <button
            id="toggle-mute-btn"
            onClick={() => setIsMuted(!isMuted)}
            title={isMuted ? "ভয়েস আনমিউট করুন" : "ভয়েস মিউট করুন"}
            className={`p-2 rounded-lg border transition-all ${
              isMuted
                ? "bg-rose-950/40 border-rose-800/50 text-rose-400"
                : "bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-800/60"
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="hidden md:flex items-center space-x-2 text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-400">STATUS:</span>
            <span className="text-emerald-400 font-semibold">{isOnline ? "ONLINE" : "STANDBY"}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
