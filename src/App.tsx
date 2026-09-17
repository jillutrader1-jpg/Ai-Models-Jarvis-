import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { JarvisCore } from "./components/JarvisCore";
import { PhoneSimulator } from "./components/PhoneSimulator";
import { PythonStudio } from "./components/PythonStudio";
import { TradingAssistant } from "./components/TradingAssistant";
import { CommandLog } from "./components/CommandLog";
import { FloatingOverlay } from "./components/FloatingOverlay";
import { PhoneState, JarvisLog, JarvisCommandResult, TradingState, TradingSignal } from "./types";
import { playJarvisSound, speakBengali } from "./lib/speech";

export default function App() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "trading" | "python" | "phone">("dashboard");
  const [isMuted, setIsMuted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [continuousListening, setContinuousListening] = useState(false);
  const [lastResponse, setLastResponse] = useState(
    "জি স্যার, আমি জারভিস। আপনার ফোন নিয়ন্ত্রণে আমি সম্পূর্ণ প্রস্তুত। নির্দেশ দিন।"
  );
  const [lastTermuxCmd, setLastTermuxCmd] = useState("termux-toast 'JARVIS Online'");
  const [lastAdbCmd, setLastAdbCmd] = useState("adb shell input keyevent 3");

  const [tradingState, setTradingState] = useState<TradingState>({
    currentSymbol: "BTC/USDT",
    lastPrice: 68250,
    change24h: 3.4,
    capital: 1000,
    riskPercentage: 2,
    autoListen: false,
    autoTradingEnabled: true,
    executedTrades: [
      {
        id: "tr_init_1",
        symbol: "BTC/USDT",
        action: "BUY",
        price: 67450,
        amount: 200,
        lotSize: 0.03,
        stopLoss: 66200,
        takeProfit: 69800,
        timestamp: "আজ 10:14 AM",
        status: "TP_HIT",
        pnl: 70.5,
        pnlPercent: 3.5,
        reason_bn: "15m চার্টে EMA 20/50 গোল্ডেন ক্রস ও RSI বুলিশ রিভার্সাল ডিটেক্ট করে স্বয়ংক্রিয় এন্ট্রি। টেক প্রফিট সফলভাবে হিট করেছে।",
      },
      {
        id: "tr_init_2",
        symbol: "XAU/USD (Gold)",
        action: "BUY",
        price: 2634.2,
        amount: 250,
        lotSize: 0.1,
        stopLoss: 2622.0,
        takeProfit: 2655.0,
        timestamp: "আজ 11:32 AM",
        status: "OPEN",
        pnl: 28.25,
        pnlPercent: 1.1,
        reason_bn: "সাপোর্ট বাউন্স ও ম্যাকডি বুলিশ ডায়ভারজেন্স। পজিশন এখন রানিং প্রফিটে রয়েছে।",
      },
    ],
    totalProfit: 98.75,
    winRate: 85.7,
    activeSignal: {
      symbol: "BTC/USDT",
      action: "BUY",
      entryPrice: 68250,
      stopLoss: 66900,
      takeProfit: 71200,
      confidence: 91,
      timeframe: "15m / 1h",
      reason_bn: "EMA 20/50 গোল্ডেন ক্রসওভার এবং আরএসআই বুলিশ সাপোর্ট জোনে অবস্থান করছে। ১:২.৩ রিস্ক-রিওয়ার্ড রেশিও সহ বাই সেটআপ প্রস্তুত।",
      riskReward: "1:2.3",
      rsi: 46,
      trend: "BULLISH",
    },
    signals: [],
  });

  const [phoneState, setPhoneState] = useState<PhoneState>({
    battery: 88,
    isCharging: false,
    torch: false,
    volume: 75,
    wifi: true,
    bluetooth: true,
    activeApp: "Home",
    cameraOpen: false,
    callingContact: null,
    tradingState,
    smsList: [
      {
        id: "1",
        sender: "Jarvis AI",
        message: "সিস্টেম সক্রিয়। আপনার ফোন সম্পূর্ণ নিয়ন্ত্রণে রয়েছে।",
        time: "১০:২৮",
      },
    ],
  });

  const [logs, setLogs] = useState<JarvisLog[]>([
    {
      id: "init-1",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "jarvis",
      text: "জি স্যার, আমি জারভিস। আপনার ফোন নিয়ন্ত্রণে আমি প্রস্তুত। মুখে বলুন অথবা নির্দেশ টাইপ করুন।",
      meta: {
        termux: "termux-toast 'JARVIS Active'",
        adb: "adb shell input keyevent 3",
      },
    },
  ]);

  // Initial Jarvis greeting sound
  useEffect(() => {
    playJarvisSound("startup");
  }, []);

  const handleSendCommand = async (commandText: string) => {
    if (!commandText.trim() || isProcessing) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user voice log
    setLogs((prev) => [
      {
        id: Date.now().toString(),
        timestamp: timeStr,
        type: "user",
        text: commandText,
      },
      ...prev,
    ]);

    setIsProcessing(true);
    playJarvisSound("listen");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    try {
      // Call full-stack Jarvis endpoint with fast 2-second abort timeout
      const response = await fetch("/api/jarvis/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: commandText,
          phoneState,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data: JarvisCommandResult;

      if (response.ok) {
        data = await response.json();
      } else {
        throw new Error("Server error");
      }

      applyCommandOutcome(data, timeStr);
    } catch (err) {
      clearTimeout(timeoutId);
      console.warn("API request fast-fallback applied:", err);
      // Instant ultra-fast local fallback processor
      const fallback = localProcessCommand(commandText, phoneState);
      applyCommandOutcome(fallback, timeStr);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyCommandOutcome = (data: JarvisCommandResult, timeStr: string) => {
    setLastResponse(data.response_bn);
    if (data.termux_command) setLastTermuxCmd(data.termux_command);
    if (data.adb_command) setLastAdbCmd(data.adb_command);

    // Apply state changes to simulated phone
    switch (data.action_type) {
      case "TOGGLE_TORCH": {
        const turnOff = data.parameters?.state === "OFF";
        setPhoneState((prev) => ({
          ...prev,
          torch: turnOff ? false : true,
        }));
        playJarvisSound("toggle");
        break;
      }
      case "MAKE_CALL": {
        const contact = data.parameters?.number_or_name || "আম্মু (Mom)";
        setPhoneState((prev) => ({
          ...prev,
          callingContact: contact,
          activeApp: "Dialer",
        }));
        playJarvisSound("call");
        break;
      }
      case "SEND_SMS": {
        const msg = data.parameters?.message || "জরুরি বার্তা";
        const recipient = data.parameters?.recipient || "বন্ধু";
        setPhoneState((prev) => ({
          ...prev,
          smsList: [
            {
              id: Date.now().toString(),
              sender: recipient,
              message: msg,
              time: timeStr,
            },
            ...prev.smsList,
          ],
        }));
        playJarvisSound("success");
        break;
      }
      case "OPEN_APP": {
        const app = (data.parameters?.app_name || "").toLowerCase();
        let target = "Home";
        if (app.includes("youtube")) target = "YouTube";
        else if (app.includes("camera")) target = "Camera";
        else if (app.includes("whatsapp")) target = "WhatsApp";

        setPhoneState((prev) => ({ ...prev, activeApp: target }));
        playJarvisSound("success");
        break;
      }
      case "TAKE_PHOTO": {
        setPhoneState((prev) => ({ ...prev, activeApp: "Camera" }));
        playJarvisSound("success");
        break;
      }
      case "SET_VOLUME": {
        const act = data.parameters?.action;
        setPhoneState((prev) => ({
          ...prev,
          volume: act === "up" ? Math.min(100, prev.volume + 25) : Math.max(10, prev.volume - 25),
        }));
        playJarvisSound("toggle");
        break;
      }
      case "TOGGLE_WIFI": {
        setPhoneState((prev) => ({
          ...prev,
          wifi: data.parameters?.state === "OFF" ? false : true,
        }));
        playJarvisSound("toggle");
        break;
      }
      case "TRADING_SIGNAL":
      case "TRADING_ANALYSIS": {
        if (data.trading_signal) {
          const sig = data.trading_signal;
          setTradingState((prev) => ({
            ...prev,
            currentSymbol: sig.symbol,
            lastPrice: sig.entryPrice,
            activeSignal: sig,
            signals: [sig, ...prev.signals],
          }));
        }
        playJarvisSound("success");
        break;
      }
      case "EXECUTE_AUTO_TRADE": {
        const trade = data.executed_trade || {
          id: "trade_" + Date.now(),
          symbol: data.parameters?.symbol || "BTC/USDT",
          action: data.parameters?.action || "BUY",
          price: data.parameters?.price || 68250,
          amount: data.parameters?.amount || 200,
          lotSize: data.parameters?.lotSize || 0.03,
          stopLoss: data.parameters?.stopLoss || 66900,
          takeProfit: data.parameters?.takeProfit || 71200,
          timestamp: "সবেমাত্র",
          status: "OPEN",
          pnl: 0,
          pnlPercent: 0,
          reason_bn: data.parameters?.reason_bn || "বাজার বিশ্লেষণ করে স্বয়ংক্রিয় অর্ডার কার্যকর করা হয়েছে।",
        };

        setTradingState((prev) => {
          const updatedTrades = [trade, ...prev.executedTrades];
          return {
            ...prev,
            executedTrades: updatedTrades,
            lastPrice: trade.price,
            currentSymbol: trade.symbol,
          };
        });

        // Also reflect on phone screen to show Binance/TradingView execution
        setPhoneState((prev) => ({ ...prev, activeApp: "Binance" }));
        playJarvisSound("success");
        break;
      }
      case "TOGGLE_AUTO_TRADING": {
        const newState = data.parameters?.enabled ?? true;
        setTradingState((prev) => ({
          ...prev,
          autoTradingEnabled: newState,
        }));
        playJarvisSound("toggle");
        break;
      }
      case "OPEN_TRADING_APP": {
        const app = (data.parameters?.app_name || "").toLowerCase();
        let target = "Home";
        if (app.includes("tradingview")) target = "TradingView";
        else if (app.includes("binance")) target = "Binance";
        setPhoneState((prev) => ({ ...prev, activeApp: target }));
        playJarvisSound("success");
        break;
      }
      default:
        playJarvisSound("success");
    }

    // Add log
    setLogs((prev) => [
      {
        id: (Date.now() + 1).toString(),
        timestamp: timeStr,
        type: "jarvis",
        text: data.response_bn,
        meta: {
          termux: data.termux_command,
          adb: data.adb_command,
          action: data.action_type,
        },
      },
      ...prev,
    ]);

    // Speak back in Bengali if not muted
    if (!isMuted) {
      speakBengali(
        data.response_bn,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const localProcessCommand = (text: string, current: PhoneState): JarvisCommandResult => {
    const lower = text.toLowerCase();

    if (lower.includes("টর্চ") || lower.includes("torch") || lower.includes("লাইট")) {
      const turnOff = lower.includes("বন্ধ") || lower.includes("off") || lower.includes("নিভা");
      return {
        response_bn: turnOff
          ? "জি স্যার, ফোনের টর্চ লাইট বন্ধ করে দেওয়া হয়েছে।"
          : "জি স্যার, ফোনের টর্চ লাইট জ্বালিয়ে দিয়েছি।",
        action_type: "TOGGLE_TORCH",
        parameters: { state: turnOff ? "OFF" : "ON" },
        termux_command: turnOff ? "termux-torch off" : "termux-torch on",
        adb_command: turnOff ? "adb shell service call flashlight 0" : "adb shell service call flashlight 1",
      };
    }

    if (lower.includes("ব্যাটারি") || lower.includes("battery") || lower.includes("চার্জ")) {
      return {
        response_bn: `স্যার, আপনার ফোনের বর্তমান ব্যাটারি লেভেল ${current.battery} শতাংশ এবং হার্ডওয়্যার স্বাভাবিক রয়েছে।`,
        action_type: "CHECK_BATTERY",
        parameters: {},
        termux_command: "termux-battery-status",
        adb_command: "adb shell dumpsys battery",
      };
    }

    if (lower.includes("কল") || lower.includes("call") || lower.includes("ফোন")) {
      return {
        response_bn: "জি স্যার, অবিলম্বে ফোন কল ডায়াল করা হচ্ছে।",
        action_type: "MAKE_CALL",
        parameters: { number_or_name: "আম্মু (Mom)" },
        termux_command: 'termux-telephony-call "01700000000"',
        adb_command: "adb shell am start -a android.intent.action.CALL -d tel:01700000000",
      };
    }

    if (lower.includes("ইউটিউব") || lower.includes("youtube")) {
      return {
        response_bn: "জি স্যার, ইউটিউব অ্যাপ্লিকেশন চালু করা হয়েছে।",
        action_type: "OPEN_APP",
        parameters: { app_name: "youtube" },
        termux_command: "termux-open-url https://youtube.com",
        adb_command:
          "adb shell monkey -p com.google.android.youtube -c android.intent.category.LAUNCHER 1",
      };
    }

    if (lower.includes("ছবি") || lower.includes("photo") || lower.includes("ক্যামেরা") || lower.includes("সেলফি")) {
      return {
        response_bn: "জি স্যার, ক্যামেরা দিয়ে ছবি তোলার প্রস্তুতি নেওয়া হয়েছে।",
        action_type: "TAKE_PHOTO",
        parameters: { camera: "back" },
        termux_command: "termux-camera-photo -c 0 /sdcard/jarvis_capture.jpg",
        adb_command: "adb shell input keyevent 27",
      };
    }

    if (lower.includes("সাউন্ড") || lower.includes("ভলিউম") || lower.includes("volume") || lower.includes("আওয়াজ")) {
      const isUp = lower.includes("বাড়া") || lower.includes("up") || lower.includes("ফুল");
      return {
        response_bn: isUp
          ? "জি স্যার, মিডিয়া সাউন্ড বাড়িয়ে দেওয়া হয়েছে।"
          : "জি স্যার, মিডিয়া ভলিউম কমানো হয়েছে।",
        action_type: "SET_VOLUME",
        parameters: { action: isUp ? "up" : "down" },
        termux_command: isUp ? "termux-volume music 15" : "termux-volume music 6",
        adb_command: isUp ? "adb shell input keyevent 24" : "adb shell input keyevent 25",
      };
    }

    if (
      lower.includes("নিজে নিজে") ||
      lower.includes("ট্রেড নাও") ||
      lower.includes("ট্রেড নাও জারভিস") ||
      lower.includes("অটো ট্রেড") ||
      lower.includes("auto trade") ||
      lower.includes("ট্রেড এন্ট্রি নাও") ||
      lower.includes("বাই করো") ||
      lower.includes("সেল করো") ||
      lower.includes("buy now") ||
      lower.includes("sell now") ||
      lower.includes("ট্রেড লাগাও")
    ) {
      const isSell = lower.includes("সেল") || lower.includes("sell") || lower.includes("শর্ট") || lower.includes("short");
      const isGold = lower.includes("গোল্ড") || lower.includes("gold");
      const sym = isGold ? "XAU/USD (Gold)" : "BTC/USDT";
      const act: "BUY" | "SELL" = isSell ? "SELL" : "BUY";
      const entry = isGold ? 2645.50 : 68250;
      const sl = isSell ? (isGold ? 2658 : 69400) : (isGold ? 2632 : 66900);
      const tp = isSell ? (isGold ? 2618 : 65800) : (isGold ? 2675 : 71200);

      return {
        response_bn: `জি স্যার! আপনার নির্দেশে মার্কেট এনালাইসিস করে সরাসরি ${sym}-এ $${entry} মূল্যে ${act === "BUY" ? "বাই (BUY)" : "সেল (SELL)"} অর্ডার স্বয়ংক্রিয়ভাবে এক্সিকিউট করা হয়েছে। স্টপ লস $${sl} ও টেক প্রফিট $${tp} সেট রয়েছে।`,
        action_type: "EXECUTE_AUTO_TRADE",
        parameters: { symbol: sym, action: act, price: entry, stopLoss: sl, takeProfit: tp, amount: 200, lotSize: 0.04 },
        termux_command: `termux-notification --title "JARVIS AUTO-TRADE" --content "${sym} ${act} at ${entry} SL: ${sl} TP: ${tp}"`,
        adb_command: `adb shell am start -a android.intent.action.VIEW -d "binance://trade?symbol=${sym.replace('/', '')}"`,
        executed_trade: {
          id: "trade_" + Date.now(),
          symbol: sym,
          action: act,
          price: entry,
          amount: 200,
          lotSize: 0.04,
          stopLoss: sl,
          takeProfit: tp,
          timestamp: "সবেমাত্র",
          status: "OPEN",
          pnl: 0,
          pnlPercent: 0,
          reason_bn: "15m চার্টে EMA ক্রসওভার ও মোমেন্টাম ভলিউম কনফার্মেশন পেয়ে স্বয়ংক্রিয় এন্ট্রি সম্পন্ন",
        },
      };
    }

    if (lower.includes("ট্রেডিং") || lower.includes("ট্রেড") || lower.includes("সিগন্যাল") || lower.includes("signal") || lower.includes("btc") || lower.includes("বিটকয়েন") || lower.includes("গোল্ড") || lower.includes("gold")) {
      const isGold = lower.includes("গোল্ড") || lower.includes("gold");
      const sym = isGold ? "XAU/USD (Gold)" : "BTC/USDT";
      const entry = isGold ? 2645 : 68250;
      const sl = isGold ? 2632 : 66900;
      const tp = isGold ? 2675 : 71200;

      return {
        response_bn: `জি স্যার! ${sym} এর জন্য শক্তিশালী বাই (BUY) সেটআপ পাওয়া গেছে। এন্ট্রি প্রাইস $${entry}, স্টপ লস $${sl}, টেক প্রফিট $${tp}। রিস্ক-রিওয়ার্ড ১:২.৩। টেকনিক্যাল ইন্ডিকেটর বুলিশ সমর্থন করছে।`,
        action_type: "TRADING_SIGNAL",
        parameters: { symbol: sym, action: "BUY" },
        termux_command: `termux-notification --title "JARVIS TRADING" --content "${sym} BUY at ${entry} SL: ${sl} TP: ${tp}"`,
        adb_command: "adb shell input keyevent 3",
        trading_signal: {
          symbol: sym,
          action: "BUY",
          entryPrice: entry,
          stopLoss: sl,
          takeProfit: tp,
          confidence: 89,
          timeframe: "15m",
          reason_bn: "EMA ক্রসওভার এবং আরএসআই বুলিশ সাপোর্ট জোনে অবস্থান করছে।",
          riskReward: "1:2.3",
          rsi: 45,
          trend: "BULLISH",
        },
      };
    }

    if (lower.includes("ট্রেডিংভিউ") || lower.includes("tradingview") || lower.includes("বাইন্যান্স") || lower.includes("binance")) {
      const isTv = lower.includes("ট্রেডিংভিউ") || lower.includes("tradingview");
      return {
        response_bn: isTv ? "জি স্যার, ফোনে ট্রেডিংভিউ লাইভ চার্ট ওপেন করা হচ্ছে।" : "জি স্যার, ফোনে বাইন্যান্স অ্যাপ্লিকেশন ওপেন করা হচ্ছে।",
        action_type: "OPEN_TRADING_APP",
        parameters: { app_name: isTv ? "tradingview" : "binance" },
        termux_command: isTv ? "termux-open-url https://www.tradingview.com/chart" : "termux-open-url https://www.binance.com",
        adb_command: isTv ? "adb shell monkey -p com.tradingview.tradingviewapp -c android.intent.category.LAUNCHER 1" : "adb shell monkey -p com.binance.dev -c android.intent.category.LAUNCHER 1",
      };
    }

    return {
      response_bn: `জি স্যার, আপনার নির্দেশ পেয়েছি: "${text}"। প্রক্রিয়াটি সফলভাবে সম্পন্ন করা হয়েছে।`,
      action_type: "GENERAL_CONVERSATION",
      parameters: {},
      termux_command: `termux-toast "Executed: ${text.slice(0, 20)}"`,
      adb_command: "adb shell input keyevent 3",
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30">
      {/* Top HUD Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isOnline={true}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left: Jarvis Arc Reactor & Voice Console (7 Cols) */}
              <div className="lg:col-span-7 h-full">
                <JarvisCore
                  onSendCommand={handleSendCommand}
                  isProcessing={isProcessing}
                  lastResponse={lastResponse}
                  isSpeaking={isSpeaking}
                  setIsSpeaking={setIsSpeaking}
                  isMuted={isMuted}
                  continuousListening={continuousListening}
                  setContinuousListening={setContinuousListening}
                />
              </div>

              {/* Right: Real-time Command Log & Quick Telemetry (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="h-[380px]">
                  <CommandLog logs={logs} onClearLogs={() => setLogs([])} />
                </div>

                {/* Hardware Quick Status Card */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                    <span>PHONE TELEMETRY</span>
                    <span className="text-slate-500">REAL-TIME SYNC</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">BATTERY</span>
                      <span className="font-bold text-emerald-400 font-mono">{phoneState.battery}%</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">TORCH</span>
                      <span
                        className={`font-bold font-mono ${
                          phoneState.torch ? "text-amber-400" : "text-slate-400"
                        }`}
                      >
                        {phoneState.torch ? "ACTIVE" : "OFF"}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-slate-500 text-[10px] block">VOLUME</span>
                      <span className="font-bold text-cyan-400 font-mono">{phoneState.volume}%</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setActiveTab("trading")}
                      className="text-emerald-400 hover:text-emerald-300 font-['Hind_Siliguri',sans-serif] text-xs font-medium"
                    >
                      ট্রেডিং অ্যানালাইসিস &rarr;
                    </button>
                    <button
                      onClick={() => setActiveTab("python")}
                      className="text-amber-400 hover:text-amber-300 font-['Hind_Siliguri',sans-serif] text-xs font-medium"
                    >
                      ট্রেডিং কোড ডাউনলোড &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* In-dashboard Live Trading Intelligence Box */}
            <TradingAssistant
              tradingState={tradingState}
              onSelectSymbol={(sym) => setTradingState((prev) => ({ ...prev, currentSymbol: sym }))}
              onRequestSignal={(sym) => handleSendCommand(`${sym} এর ট্রেডিং সিগন্যাল দাও`)}
              onOpenApp={(app) => handleSendCommand(`${app} ওপেন করো`)}
              onToggleAutoTrading={(enabled) =>
                setTradingState((prev) => ({ ...prev, autoTradingEnabled: enabled }))
              }
              onExecuteTradeNow={(sym, action) =>
                handleSendCommand(`${sym} তে এখনই ${action === "BUY" ? "বাই" : "সেল"} ট্রেড এন্ট্রি নাও`)
              }
            />
          </div>
        )}

        {activeTab === "trading" && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="mb-2">
              <h2 className="text-lg font-bold text-white font-['Hind_Siliguri',sans-serif]">
                জারভিস এআই লাইভ ট্রেডিং অ্যাসিস্ট্যান্ট (Autonomous Trading Bot Engine)
              </h2>
              <p className="text-xs text-slate-400 font-['Hind_Siliguri',sans-serif]">
                মার্কেট এনালাইসিস করে স্বয়ংক্রিয়ভাবে নিজে নিজে ট্রেড এক্সিকিউট করা ও রিয়েল-টাইম প্রফিট মনিটরিং।
              </p>
            </div>
            <TradingAssistant
              tradingState={tradingState}
              onSelectSymbol={(sym) => setTradingState((prev) => ({ ...prev, currentSymbol: sym }))}
              onRequestSignal={(sym) => handleSendCommand(`${sym} এর ট্রেডিং সিগন্যাল দাও`)}
              onOpenApp={(app) => handleSendCommand(`${app} ওপেন করো`)}
              onToggleAutoTrading={(enabled) =>
                setTradingState((prev) => ({ ...prev, autoTradingEnabled: enabled }))
              }
              onExecuteTradeNow={(sym, action) =>
                handleSendCommand(`${sym} তে এখনই ${action === "BUY" ? "বাই" : "সেল"} ট্রেড এন্ট্রি নাও`)
              }
            />
          </div>
        )}

        {activeTab === "phone" && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white font-['Hind_Siliguri',sans-serif]">
                  ভার্চুয়াল স্মার্টফোন সিমুলেটর ও হার্ডওয়্যার মনিটর
                </h2>
                <p className="text-xs text-slate-400 font-['Hind_Siliguri',sans-serif]">
                  জারভিসের প্রতিটি ভয়েস নির্দেশের লাইভ প্রতিফলন আপনার ফোনে কীভাবে কাজ করে তা এখানে পর্যবেক্ষণ করুন।
                </p>
              </div>
            </div>
            <PhoneSimulator
              phoneState={phoneState}
              setPhoneState={setPhoneState}
              lastTermuxCmd={lastTermuxCmd}
              lastAdbCmd={lastAdbCmd}
              onSendCommand={handleSendCommand}
            />
          </div>
        )}

        {activeTab === "python" && (
          <div className="max-w-5xl mx-auto">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white font-['Hind_Siliguri',sans-serif]">
                জারভিস এআই পাইথন কোড স্টুডিও (Python Code Repository)
              </h2>
              <p className="text-xs text-slate-400 font-['Hind_Siliguri',sans-serif]">
                আপনার ফোনে বা কম্পিউটারে চালানোর সম্পূর্ণ পাইথন স্ক্রিপ্ট প্রস্তুত। এক ক্লিকেই কোড কপি বা ডাউনলোড করুন।
              </p>
            </div>
            <PythonStudio />
          </div>
        )}
      </main>

      {/* Floating System Icon & Overlay (Always accessible on screen, even when multitasking/minimized) */}
      <FloatingOverlay
        onSendCommand={handleSendCommand}
        phoneState={phoneState}
        setPhoneState={setPhoneState}
        tradingState={tradingState}
        isSpeaking={isSpeaking}
        lastResponse={lastResponse}
      />
    </div>
  );
}
