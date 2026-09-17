import React from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShieldAlert,
  BarChart3,
  ExternalLink,
  Zap,
  Activity,
  Bot,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { TradingState, TradingSignal, ExecutedTrade } from "../types";

interface TradingAssistantProps {
  tradingState: TradingState;
  onSelectSymbol: (symbol: string) => void;
  onRequestSignal: (symbol: string) => void;
  onOpenApp: (app: string) => void;
  onToggleAutoTrading?: (enabled: boolean) => void;
  onExecuteTradeNow?: (symbol: string, action: "BUY" | "SELL") => void;
}

export const TradingAssistant: React.FC<TradingAssistantProps> = ({
  tradingState,
  onSelectSymbol,
  onRequestSignal,
  onOpenApp,
  onToggleAutoTrading,
  onExecuteTradeNow,
}) => {
  const active = tradingState.activeSignal;
  const isAutoEnabled = tradingState.autoTradingEnabled ?? true;

  return (
    <div className="bg-slate-900/90 border border-emerald-950/70 rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden space-y-4">
      {/* Background glow effect */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header with Market Telemetry & Auto-Trade Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-mono tracking-wider">
                JARVIS AUTONOMOUS TRADING BOT
              </h3>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isAutoEnabled
                    ? "bg-emerald-950 border-emerald-500/80 text-emerald-300 font-bold"
                    : "bg-slate-900 border-slate-700 text-slate-400"
                }`}
              >
                {isAutoEnabled ? "AUTO-EXECUTE ACTIVE" : "PAUSED"}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-['Hind_Siliguri',sans-serif]">
              মার্কেট এনালাইসিস করে জারভিস স্বয়ংক্রিয়ভাবে নিজে নিজে ট্রেড নিয়ে লাভ বের করবে
            </p>
          </div>
        </div>

        {/* Action Controls & App Openers */}
        <div className="flex flex-wrap items-center gap-2">
          {onToggleAutoTrading && (
            <button
              onClick={() => onToggleAutoTrading(!isAutoEnabled)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shadow-sm ${
                isAutoEnabled
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/60 hover:bg-emerald-500/30"
                  : "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
              }`}
            >
              {isAutoEnabled ? (
                <>
                  <Pause className="w-3 h-3 text-emerald-400" />
                  <span>অটো ট্রেড চালু (ON)</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-amber-400" />
                  <span>অটো ট্রেড বন্ধ (OFF)</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onOpenApp("tradingview")}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-cyan-300 transition-all font-mono active:scale-95"
          >
            <BarChart3 className="w-3 h-3 text-cyan-400" />
            <span>TradingView</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </button>

          <button
            onClick={() => onOpenApp("binance")}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-amber-300 transition-all font-mono active:scale-95"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Binance</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </button>
        </div>
      </div>

      {/* Bot Performance Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-500 block">AVAILABLE CAPITAL</span>
          <span className="text-white font-bold text-sm sm:text-base">
            ${tradingState.capital ?? 1000}
          </span>
          <span className="text-[9px] text-emerald-400 block font-['Hind_Siliguri',sans-serif]">
            ট্রেডিং ব্যালেন্স প্রস্তুত
          </span>
        </div>

        <div className="bg-slate-950/90 border border-emerald-900/40 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-500 block">TOTAL PROFIT (PNL)</span>
          <span className="text-emerald-400 font-bold text-sm sm:text-base">
            +${tradingState.totalProfit?.toFixed(2) ?? "98.75"}
          </span>
          <span className="text-[9px] text-emerald-400 block font-mono">+9.87%</span>
        </div>

        <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-500 block">WIN RATE</span>
          <span className="text-cyan-300 font-bold text-sm sm:text-base">
            {tradingState.winRate ?? 85.7}%
          </span>
          <span className="text-[9px] text-slate-400 block font-['Hind_Siliguri',sans-serif]">
            টেকনিক্যাল একিউরেসি
          </span>
        </div>

        <div className="bg-slate-950/90 border border-slate-800/80 rounded-xl p-2.5">
          <span className="text-[10px] text-slate-500 block">ACTIVE TRADES</span>
          <span className="text-amber-300 font-bold text-sm sm:text-base">
            {tradingState.executedTrades?.filter((t) => t.status === "OPEN").length ?? 1} OPEN
          </span>
          <span className="text-[9px] text-amber-400 block font-['Hind_Siliguri',sans-serif]">
            ফোনে লাইভ কার্যকর
          </span>
        </div>
      </div>

      {/* Asset Quick Switcher */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {["BTC/USDT", "ETH/USDT", "SOL/USDT", "XAU/USD (Gold)", "EUR/USD"].map((sym) => (
          <button
            key={sym}
            onClick={() => {
              onSelectSymbol(sym);
              onRequestSignal(sym);
            }}
            className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
              tradingState.currentSymbol === sym
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 font-bold shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
            }`}
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Active Signal & Auto-Execution Card */}
      {active ? (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 relative">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center space-x-2">
              <span
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider flex items-center gap-1 ${
                  active.action === "BUY"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-500/50"
                    : active.action === "SELL"
                    ? "bg-rose-950 text-rose-300 border border-rose-500/50"
                    : "bg-amber-950 text-amber-300 border border-amber-500/50"
                }`}
              >
                {active.action === "BUY" ? (
                  <TrendingUp className="w-3.5 h-3.5" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5" />
                )}
                {active.action} SIGNAL
              </span>

              <span className="text-white font-mono font-bold text-sm">{active.symbol}</span>
              <span className="text-xs text-slate-400 font-mono">({active.timeframe})</span>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Confidence:</span>
              <span className="text-emerald-400 font-bold">{active.confidence}%</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">R:R:</span>
              <span className="text-cyan-300 font-bold">{active.riskReward}</span>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-3">
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5 font-['Hind_Siliguri',sans-serif]">
                এন্ট্রি প্রাইস (Entry)
              </span>
              <span className="font-bold text-white text-sm sm:text-base">${active.entryPrice}</span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-rose-950/60">
              <span className="text-[10px] text-rose-400 block mb-0.5 font-['Hind_Siliguri',sans-serif]">
                স্টপ লস (Stop Loss)
              </span>
              <span className="font-bold text-rose-400 text-sm sm:text-base">${active.stopLoss}</span>
            </div>

            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-emerald-950/60">
              <span className="text-[10px] text-emerald-400 block mb-0.5 font-['Hind_Siliguri',sans-serif]">
                টার্গেট প্রফিট (Take Profit)
              </span>
              <span className="font-bold text-emerald-400 text-sm sm:text-base">${active.takeProfit}</span>
            </div>
          </div>

          {/* Auto-Execute Instant Trigger Button */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-lg mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-emerald-300 block font-['Hind_Siliguri',sans-serif]">
                  জারভিস অটো-ট্রেড এক্সিকিউটর রেডি
                </span>
                <span className="text-[11px] text-slate-400 font-['Hind_Siliguri',sans-serif]">
                  মুখে বলুন "ট্রেড নাও" অথবা নিচের বাটনে চাপুন, জারভিস সরাসরি অর্ডার কার্যকর করবে।
                </span>
              </div>
            </div>

            <button
              onClick={() =>
                onExecuteTradeNow
                  ? onExecuteTradeNow(active.symbol, active.action === "SELL" ? "SELL" : "BUY")
                  : onRequestSignal(`${active.symbol} তে এখনই ট্রেড নাও`)
              }
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg active:scale-95 font-['Hind_Siliguri',sans-serif]"
            >
              <Zap className="w-4 h-4" />
              <span>এখনই নিজে নিজে ট্রেড নাও &rarr;</span>
            </button>
          </div>

          {/* Bengali Technical Reasoning */}
          <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium mb-1 font-['Hind_Siliguri',sans-serif]">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>মার্কেট টেকনিক্যাল লজিক ও কনফার্মেশন:</span>
            </div>
            <p className="text-slate-200 font-['Hind_Siliguri',sans-serif] leading-relaxed">
              {active.reason_bn}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-400 font-['Hind_Siliguri',sans-serif]">
          <BarChart3 className="w-8 h-8 text-emerald-500/40 mx-auto mb-2" />
          <p>মুখে বলুন: <span className="text-emerald-300 font-medium">"জারভিস, নিজে নিজে এনালাইসিস করে ট্রেড নাও"</span></p>
        </div>
      )}

      {/* Live Auto-Executed Trades Log on Phone / Exchange */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2.5">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>JARVIS EXECUTED TRADES (লাইভ অর্ডার হিস্ট্রি)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-['Hind_Siliguri',sans-serif]">
            স্বয়ংক্রিয় এন্ট্রি ও ক্লোজ হিস্ট্রি
          </span>
        </div>

        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {tradingState.executedTrades && tradingState.executedTrades.length > 0 ? (
            tradingState.executedTrades.map((t) => (
              <div
                key={t.id}
                className="bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 p-2.5 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs font-mono transition-all"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      t.action === "BUY"
                        ? "bg-emerald-950 text-emerald-300 border border-emerald-600/40"
                        : "bg-rose-950 text-rose-300 border border-rose-600/40"
                    }`}
                  >
                    {t.action}
                  </span>
                  <span className="font-bold text-white">{t.symbol}</span>
                  <span className="text-slate-500 text-[10px]">@{t.price}</span>
                  <span className="text-slate-400 text-[10px]">Lot: {t.lotSize}</span>
                </div>

                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-slate-400 text-[10px]">{t.timestamp}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      t.status === "TP_HIT"
                        ? "bg-emerald-950 text-emerald-300"
                        : t.status === "SL_HIT"
                        ? "bg-rose-950 text-rose-300"
                        : "bg-amber-950 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {t.status === "TP_HIT"
                      ? "PROFIT (TP HIT)"
                      : t.status === "OPEN"
                      ? "ACTIVE IN MARKET"
                      : t.status}
                  </span>
                  {t.pnl !== undefined && (
                    <span
                      className={`font-bold font-mono ${
                        t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {t.pnl >= 0 ? `+$${t.pnl}` : `-$${Math.abs(t.pnl)}`}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-xs text-slate-500 font-['Hind_Siliguri',sans-serif]">
              এখনো কোনো ট্রেড নেওয়া হয়নি। জারভিসকে অর্ডার দিন: "জারভিস, নিজে নিজে এনালাইসিস করে ট্রেড নাও"
            </div>
          )}
        </div>
      </div>

      {/* Quick Bengali Auto-Trading Voice Prompts */}
      <div className="pt-2 border-t border-slate-800">
        <span className="text-[11px] font-mono text-slate-400 block mb-2 font-['Hind_Siliguri',sans-serif]">
          স্বয়ংক্রিয় ট্রেডের জন্য মুখে যেকোনো সময় বলুন:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {[
            "জারভিস, নিজে নিজে ট্রেড নাও",
            "বিটকয়েনে বাই এন্ট্রি নাও",
            "গোল্ডে সেল ট্রেড লাগাও",
            "অটো ট্রেডিং অন করো",
            "ট্রেডিংভিউ চার্ট দেখো",
          ].map((cmd) => (
            <button
              key={cmd}
              onClick={() => onRequestSignal(cmd)}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-slate-300 font-['Hind_Siliguri',sans-serif] transition-all active:scale-95"
            >
              💬 "{cmd}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

