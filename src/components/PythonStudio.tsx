import React, { useState } from "react";
import { Copy, Check, Download, FileCode, BookOpen, Terminal, Smartphone, Laptop, TrendingUp } from "lucide-react";
import {
  PYTHON_TERMUX_CODE,
  PYTHON_ADB_CODE,
  PYTHON_TRADING_CODE,
  REQUIREMENTS_TXT,
  SETUP_GUIDE_BN,
} from "../data/pythonCodes";

export const PythonStudio: React.FC = () => {
  const [activeFile, setActiveFile] = useState<"trading" | "termux" | "adb" | "reqs" | "guide">("trading");
  const [copied, setCopied] = useState(false);

  const getActiveContent = () => {
    switch (activeFile) {
      case "trading":
        return { code: PYTHON_TRADING_CODE, filename: "jarvis_trading_bot.py" };
      case "termux":
        return { code: PYTHON_TERMUX_CODE, filename: "jarvis_termux.py" };
      case "adb":
        return { code: PYTHON_ADB_CODE, filename: "jarvis_adb.py" };
      case "reqs":
        return { code: REQUIREMENTS_TXT, filename: "requirements.txt" };
      case "guide":
        return { code: SETUP_GUIDE_BN, filename: "README_BANGLA.md" };
    }
  };

  const current = getActiveContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([current.code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = current.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Studio Header & Tab Switcher */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-xs font-mono text-slate-400 ml-2">PYTHON CODE REPOSITORY // JARVIS AI</span>
        </div>

        {/* Action Buttons: Copy & Download */}
        <div className="flex items-center space-x-2">
          <button
            id="copy-code-btn"
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all active:scale-95 font-['Hind_Siliguri',sans-serif]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? "কপি হয়েছে!" : "কোড কপি করুন"}</span>
          </button>

          <button
            id="download-code-btn"
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] active:scale-95 font-['Hind_Siliguri',sans-serif]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ডাউনলোড ({current.filename})</span>
          </button>
        </div>
      </div>

      {/* File Select Tabs */}
      <div className="bg-slate-950/60 px-4 pt-2 flex items-center space-x-1 border-b border-slate-800 overflow-x-auto">
        <button
          id="tab-trading-code"
          onClick={() => setActiveFile("trading")}
          className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-t-lg transition-all border-t-2 shrink-0 ${
            activeFile === "trading"
              ? "bg-slate-900 text-emerald-400 border-emerald-400 font-bold"
              : "text-slate-400 hover:text-slate-200 border-transparent"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          <span>jarvis_trading_bot.py</span>
          <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded font-['Hind_Siliguri',sans-serif]">
            ট্রেডিং + অটো লিসেনিং
          </span>
        </button>

        <button
          id="tab-termux-code"
          onClick={() => setActiveFile("termux")}
          className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-t-lg transition-all border-t-2 shrink-0 ${
            activeFile === "termux"
              ? "bg-slate-900 text-cyan-400 border-cyan-400"
              : "text-slate-400 hover:text-slate-200 border-transparent"
          }`}
        >
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>jarvis_termux.py</span>
          <span className="text-[10px] bg-cyan-950/80 text-cyan-300 px-1.5 py-0.5 rounded font-['Hind_Siliguri',sans-serif]">
            ফোনে সরাসরি
          </span>
        </button>

        <button
          id="tab-adb-code"
          onClick={() => setActiveFile("adb")}
          className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-t-lg transition-all border-t-2 shrink-0 ${
            activeFile === "adb"
              ? "bg-slate-900 text-amber-400 border-amber-400"
              : "text-slate-400 hover:text-slate-200 border-transparent"
          }`}
        >
          <Laptop className="w-3.5 h-3.5 text-amber-400" />
          <span>jarvis_adb.py</span>
          <span className="text-[10px] bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded font-['Hind_Siliguri',sans-serif]">
            পিসি থেকে ফোন
          </span>
        </button>

        <button
          id="tab-reqs-code"
          onClick={() => setActiveFile("reqs")}
          className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-t-lg transition-all border-t-2 ${
            activeFile === "reqs"
              ? "bg-slate-900 text-emerald-400 border-emerald-400"
              : "text-slate-400 hover:text-slate-200 border-transparent"
          }`}
        >
          <FileCode className="w-3.5 h-3.5 text-emerald-400" />
          <span>requirements.txt</span>
        </button>

        <button
          id="tab-guide-code"
          onClick={() => setActiveFile("guide")}
          className={`flex items-center space-x-2 px-3 py-2 text-xs font-medium rounded-t-lg transition-all border-t-2 ${
            activeFile === "guide"
              ? "bg-slate-900 text-purple-400 border-purple-400"
              : "text-slate-400 hover:text-slate-200 border-transparent"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-['Hind_Siliguri',sans-serif]">সেটআপ গাইড (বাংলা)</span>
        </button>
      </div>

      {/* Code Viewer */}
      <div className="relative p-4 max-h-[550px] overflow-auto font-mono text-xs text-slate-200 bg-slate-950/90 leading-relaxed selection:bg-cyan-500/30">
        <pre className="font-mono whitespace-pre-wrap break-words">{current.code}</pre>
      </div>

      {/* Quick Setup Snippet Bar */}
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 font-['Hind_Siliguri',sans-serif]">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            ফোনে চালাতে Termux খুলে চালান:{" "}
            <code className="bg-slate-900 text-cyan-300 px-2 py-0.5 rounded font-mono select-all">
              pkg install python termux-api mpv -y && pip install gtts google-genai
            </code>
          </span>
        </div>
        <span className="text-[11px] text-slate-500 font-mono shrink-0">UTF-8 // Python 3.10+</span>
      </div>
    </div>
  );
};
