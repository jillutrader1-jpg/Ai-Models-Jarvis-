import React from "react";
import { Terminal, CheckCircle2, User, Cpu, Trash2 } from "lucide-react";
import { JarvisLog } from "../types";

interface CommandLogProps {
  logs: JarvisLog[];
  onClearLogs: () => void;
}

export const CommandLog: React.FC<CommandLogProps> = ({ logs, onClearLogs }) => {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col h-full shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 tracking-wider">
            JARVIS CONSOLE & VOICE LOGS
          </h3>
        </div>
        <button
          onClick={onClearLogs}
          title="লগ ক্লিয়ার করুন"
          className="text-slate-500 hover:text-rose-400 text-xs transition-colors flex items-center gap-1 font-['Hind_Siliguri',sans-serif]"
        >
          <Trash2 className="w-3 h-3" /> ক্লিয়ার
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2.5 max-h-72 pr-1 text-xs">
        {logs.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-['Hind_Siliguri',sans-serif]">
            কোনো কমান্ড বা লগ নেই। কথা বলুন বা নির্দেশের বাটন চাপুন।
          </div>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-xl border transition-all ${
                log.type === "user"
                  ? "bg-slate-950/70 border-slate-800 text-slate-200"
                  : log.type === "jarvis"
                  ? "bg-cyan-950/40 border-cyan-800/40 text-cyan-200"
                  : "bg-slate-950 border-slate-800 font-mono text-emerald-300"
              }`}
            >
              <div className="flex items-center justify-between mb-1 text-[10px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 font-semibold">
                  {log.type === "user" ? (
                    <>
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="font-['Hind_Siliguri',sans-serif] text-slate-300">আপনি (User Voice):</span>
                    </>
                  ) : log.type === "jarvis" ? (
                    <>
                      <Cpu className="w-3 h-3 text-cyan-400" />
                      <span className="font-['Hind_Siliguri',sans-serif] text-cyan-300">জারভিস (Jarvis Speech):</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>PHONE COMMAND:</span>
                    </>
                  )}
                </span>
                <span>{log.timestamp}</span>
              </div>

              <p className="font-['Hind_Siliguri',sans-serif] leading-relaxed text-sm">{log.text}</p>

              {log.meta?.termux && (
                <div className="mt-1.5 pt-1.5 border-t border-slate-800/80 font-mono text-[11px] text-cyan-400/90 break-all">
                  <span className="text-slate-500">Termux:</span> {log.meta.termux}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
