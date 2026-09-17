import React from "react";
import {
  Battery,
  BatteryCharging,
  Wifi,
  WifiOff,
  Flashlight,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Camera,
  Youtube,
  MessageSquare,
  ArrowLeft,
  Settings,
  Sparkles,
  Layers,
  Terminal,
  Bot,
  Zap,
} from "lucide-react";
import { PhoneState } from "../types";

interface PhoneSimulatorProps {
  phoneState: PhoneState;
  setPhoneState: React.Dispatch<React.SetStateAction<PhoneState>>;
  lastTermuxCmd: string;
  lastAdbCmd: string;
  onSendCommand?: (cmd: string) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  phoneState,
  setPhoneState,
  lastTermuxCmd,
  lastAdbCmd,
  onSendCommand,
}) => {
  const [showPhoneFloatingMenu, setShowPhoneFloatingMenu] = React.useState(false);

  const toggleTorch = () => {
    setPhoneState((prev) => ({ ...prev, torch: !prev.torch }));
  };

  const toggleWifi = () => {
    setPhoneState((prev) => ({ ...prev, wifi: !prev.wifi }));
  };

  const handleHangup = () => {
    setPhoneState((prev) => ({ ...prev, callingContact: null, activeApp: "Home" }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center justify-center p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
      {/* Smartphone Device Shell */}
      <div className="relative w-[300px] sm:w-[320px] h-[600px] bg-slate-950 rounded-[44px] p-3.5 border-4 border-slate-700/80 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(6,182,212,0.1)] flex flex-col justify-between overflow-hidden">
        {/* Physical Button Accents */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-10 bg-slate-700 rounded-l"></div>
        <div className="absolute -left-[7px] top-42 w-[3px] h-12 bg-slate-700 rounded-l"></div>
        <div className="absolute -right-[7px] top-32 w-[3px] h-14 bg-slate-700 rounded-r"></div>

        {/* Torch Light Flare Beam (When Torch is ON) */}
        {phoneState.torch && (
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-32 bg-amber-300/30 blur-2xl rounded-full pointer-events-none animate-pulse"></div>
        )}

        {/* Smartphone Screen Inner */}
        <div className="w-full h-full bg-slate-900 rounded-[34px] overflow-hidden flex flex-col relative border border-slate-800">
          {/* Top Status Bar */}
          <div className="h-7 bg-slate-950/80 backdrop-blur px-4 flex items-center justify-between text-[11px] text-slate-300 font-mono z-20">
            <span>10:30 PM</span>
            {/* Camera Punchhole Notch */}
            <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-800 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-cyan-950"></div>
            </div>
            <div className="flex items-center space-x-1.5">
              {phoneState.wifi ? <Wifi className="w-3 h-3 text-cyan-400" /> : <WifiOff className="w-3 h-3 text-slate-500" />}
              <span className="text-[10px]">{phoneState.volume}%</span>
              <div className="flex items-center gap-0.5">
                {phoneState.isCharging ? (
                  <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Battery className="w-3.5 h-3.5 text-cyan-400" />
                )}
                <span className="text-[10px]">{phoneState.battery}%</span>
              </div>
            </div>
          </div>

          {/* Screen Content by Active App */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-between relative">
            {/* Screen: Calling */}
            {phoneState.callingContact ? (
              <div className="flex-1 flex flex-col items-center justify-between py-8">
                <div className="text-center mt-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 mx-auto flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-[0_0_20px_rgba(6,182,212,0.4)] animate-pulse">
                    {phoneState.callingContact.charAt(0)}
                  </div>
                  <h3 className="text-base font-bold text-white font-['Hind_Siliguri',sans-serif]">
                    {phoneState.callingContact}
                  </h3>
                  <p className="text-xs text-cyan-400 font-mono mt-1">কল ডায়াল হচ্ছে... (Calling)</p>
                </div>
                <button
                  id="phone-hangup-btn"
                  onClick={handleHangup}
                  className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(225,29,72,0.5)] active:scale-95 transition-all"
                >
                  <PhoneOff className="w-6 h-6" />
                </button>
              </div>
            ) : phoneState.activeApp === "Camera" ? (
              /* Screen: Camera Viewfinder */
              <div className="flex-1 flex flex-col justify-between bg-black rounded-2xl p-3 relative border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <button onClick={() => setPhoneState((p) => ({ ...p, activeApp: "Home" }))}>
                    <ArrowLeft className="w-4 h-4 text-white" />
                  </button>
                  <span className="font-mono text-[11px] text-cyan-400">JARVIS CAM // ON</span>
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></div>
                </div>

                {/* Viewfinder Target */}
                <div className="my-auto h-44 border border-dashed border-cyan-500/40 rounded-xl flex items-center justify-center relative overflow-hidden bg-slate-950/60">
                  <div className="absolute w-8 h-8 border-t-2 border-l-2 border-cyan-400 top-2 left-2"></div>
                  <div className="absolute w-8 h-8 border-t-2 border-r-2 border-cyan-400 top-2 right-2"></div>
                  <div className="absolute w-8 h-8 border-b-2 border-l-2 border-cyan-400 bottom-2 left-2"></div>
                  <div className="absolute w-8 h-8 border-b-2 border-r-2 border-cyan-400 bottom-2 right-2"></div>
                  <Camera className="w-12 h-12 text-cyan-400/40" />
                  <span className="absolute bottom-3 text-[10px] text-slate-400 font-['Hind_Siliguri',sans-serif]">
                    ক্যামেরা প্রস্তুত (Capture Ready)
                  </span>
                </div>

                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-9 h-9 rounded-full bg-white active:scale-90 transition-all"></div>
                  </div>
                </div>
              </div>
            ) : phoneState.activeApp === "YouTube" ? (
              /* Screen: YouTube App */
              <div className="flex-1 flex flex-col bg-slate-950 rounded-2xl p-3 border border-slate-800">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center space-x-1.5 text-rose-500">
                    <Youtube className="w-5 h-5 fill-rose-500 text-transparent" />
                    <span className="text-xs font-bold text-white tracking-tight">YouTube</span>
                  </div>
                  <button
                    onClick={() => setPhoneState((p) => ({ ...p, activeApp: "Home" }))}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full h-36 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-lg">
                    <Youtube className="w-5 h-5" />
                  </div>
                  <span className="absolute bottom-2 left-3 text-[10px] text-slate-300 font-['Hind_Siliguri',sans-serif]">
                    জারভিস ভিডিও স্ট্রিম লোড হচ্ছে
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-3/4 bg-slate-800 rounded"></div>
                  <div className="h-2.5 w-1/2 bg-slate-800/60 rounded"></div>
                </div>
              </div>
            ) : phoneState.activeApp === "TradingView" ? (
              /* Screen: TradingView App */
              <div className="flex-1 flex flex-col bg-slate-950 rounded-2xl p-3 border border-emerald-900/60">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center space-x-1.5 text-emerald-400">
                    <span className="text-xs font-bold text-white tracking-tight">TradingView Mobile</span>
                  </div>
                  <button
                    onClick={() => setPhoneState((p) => ({ ...p, activeApp: "Home" }))}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full h-32 bg-slate-900 rounded-xl flex flex-col items-center justify-center border border-emerald-800/40 relative overflow-hidden">
                  <span className="text-[11px] font-mono text-emerald-400 font-bold">BTC/USDT $68,250</span>
                  <div className="flex items-end gap-1 mt-2 h-12">
                    <div className="w-2 h-6 bg-emerald-500 rounded-t"></div>
                    <div className="w-2 h-10 bg-emerald-400 rounded-t"></div>
                    <div className="w-2 h-8 bg-rose-500 rounded-t"></div>
                    <div className="w-2 h-12 bg-emerald-500 rounded-t"></div>
                    <div className="w-2 h-11 bg-emerald-300 rounded-t"></div>
                  </div>
                  <span className="absolute bottom-1 text-[9px] text-slate-400 font-['Hind_Siliguri',sans-serif]">
                    জারভিস লাইভ চার্ট অ্যানালাইসিস
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-emerald-300 bg-emerald-950/40 p-2 rounded border border-emerald-800/40 font-['Hind_Siliguri',sans-serif]">
                  সংকেত: শক্তিশালী বাই (BUY), টেক প্রফিট $71,200
                </div>
              </div>
            ) : phoneState.activeApp === "Binance" ? (
              /* Screen: Binance App */
              <div className="flex-1 flex flex-col bg-slate-950 rounded-2xl p-3 border border-amber-900/60 overflow-y-auto">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center space-x-1.5 text-amber-400">
                    <span className="text-xs font-bold text-amber-300 tracking-tight">Binance Pro // Auto-Trade</span>
                  </div>
                  <button
                    onClick={() => setPhoneState((p) => ({ ...p, activeApp: "Home" }))}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-full bg-slate-900 rounded-xl p-3 flex flex-col items-center justify-center border border-amber-800/40 relative mb-2">
                  <span className="text-xs font-mono text-white font-bold">Trading Balance: $1,000.00</span>
                  <span className="text-[10px] text-emerald-400 font-mono">+9.87% All-Time PnL</span>
                  <div className="mt-2 w-full bg-emerald-950/60 border border-emerald-800/50 rounded-lg p-2 text-[10px] font-mono text-emerald-300 text-left">
                    <div className="flex justify-between font-bold">
                      <span>ORDER: BUY BTC/USDT</span>
                      <span className="text-emerald-400">ACTIVE</span>
                    </div>
                    <div className="text-[9px] text-slate-300 mt-0.5">
                      Price: $68,250 | SL: $66,900 | TP: $71,200
                    </div>
                    <div className="text-[9px] text-emerald-400 font-sans mt-0.5">
                      ✓ জারভিস নিজে মার্কেট অ্যানালাইসিস করে ট্রেড নিয়েছে
                    </div>
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 bg-slate-900/80 p-2 rounded border border-slate-800 font-['Hind_Siliguri',sans-serif]">
                  স্ট্যাটাস: জারভিস ব্যাকগ্রাউন্ডে মার্কেট পর্যবেক্ষণ করছে এবং স্বয়ংক্রিয় প্রফিট বুকিং চালু আছে।
                </div>
              </div>
            ) : (
              /* Screen: Home Screen */
              <div className="flex-1 flex flex-col justify-between">
                {/* Greeting & Widgets */}
                <div>
                  <div className="text-center my-4">
                    <div className="text-3xl font-light text-slate-100 font-['Chakra_Petch',sans-serif]">
                      10:30
                    </div>
                    <p className="text-[11px] text-cyan-400 font-['Hind_Siliguri',sans-serif]">
                      জারভিস এআই চালিত ফোন
                    </p>
                  </div>

                  {/* Phone Quick Hardware Badges */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div
                      onClick={toggleTorch}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        phoneState.torch
                          ? "bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                          : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Flashlight className={`w-4 h-4 ${phoneState.torch ? "text-amber-400" : ""}`} />
                        <span className="text-[9px] font-mono px-1 rounded bg-slate-800">
                          {phoneState.torch ? "ON" : "OFF"}
                        </span>
                      </div>
                      <span className="text-xs font-['Hind_Siliguri',sans-serif] mt-1 block font-medium">
                        টর্চ লাইট
                      </span>
                    </div>

                    <div
                      onClick={toggleWifi}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                        phoneState.wifi
                          ? "bg-cyan-500/20 border-cyan-500/60 text-cyan-300"
                          : "bg-slate-950/80 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {phoneState.wifi ? <Wifi className="w-4 h-4 text-cyan-400" /> : <WifiOff className="w-4 h-4" />}
                        <span className="text-[9px] font-mono px-1 rounded bg-slate-800">
                          {phoneState.wifi ? "ON" : "OFF"}
                        </span>
                      </div>
                      <span className="text-xs font-['Hind_Siliguri',sans-serif] mt-1 block font-medium">
                        ওয়াই-ফাই
                      </span>
                    </div>
                  </div>

                  {/* Volume Slider */}
                  <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl mb-4">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1 font-['Hind_Siliguri',sans-serif]">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> সাউন্ড ভলিউম:
                      </span>
                      <span className="font-mono text-cyan-400">{phoneState.volume}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={phoneState.volume}
                      onChange={(e) =>
                        setPhoneState((prev) => ({ ...prev, volume: parseInt(e.target.value) }))
                      }
                      className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* App Dock */}
                <div className="bg-slate-950/90 border border-slate-800/80 rounded-2xl p-2.5 flex items-center justify-around">
                  <button
                    onClick={() =>
                      setPhoneState((p) => ({ ...p, callingContact: "০১৭xxxxxxxx", activeApp: "Dialer" }))
                    }
                    className="w-10 h-10 rounded-xl bg-emerald-600/90 hover:bg-emerald-500 text-white flex items-center justify-center shadow-md transition-all active:scale-95"
                    title="ফোন কল"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setPhoneState((p) => ({ ...p, activeApp: "Camera" }))}
                    className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 flex items-center justify-center shadow-md transition-all active:scale-95"
                    title="ক্যামেরা"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setPhoneState((p) => ({ ...p, activeApp: "YouTube" }))}
                    className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-md transition-all active:scale-95"
                    title="ইউটিউব"
                  >
                    <Youtube className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() =>
                      setPhoneState((p) => ({
                        ...p,
                        smsList: [
                          {
                            id: Date.now().toString(),
                            sender: "Jarvis AI",
                            message: "জি স্যার, আমি আপনার ফোনে সক্রিয় আছি।",
                            time: "এখন",
                          },
                          ...p.smsList,
                        ],
                      }))
                    }
                    className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md transition-all active:scale-95"
                    title="মেসেজ"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Always-on-top Phone Floating Assistant Orb (মিমাইজ বা অন্য অ্যাপ চালালেও স্ক্রিনের উপরে ভাসে) */}
            <div className="absolute right-3 bottom-14 z-30 flex flex-col items-end">
              {showPhoneFloatingMenu && (
                <div className="mb-2 w-48 bg-slate-950/95 border border-emerald-500/50 rounded-xl p-2.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 text-[10px]">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5 font-mono text-emerald-400 font-bold">
                    <span>JARVIS OVERLAY</span>
                    <button
                      onClick={() => setShowPhoneFloatingMenu(false)}
                      className="text-slate-400 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="space-y-1 font-['Hind_Siliguri',sans-serif]">
                    <button
                      onClick={() => {
                        onSendCommand?.("নিজে নিজে এনালাইসিস করে ট্রেড নাও");
                        setShowPhoneFloatingMenu(false);
                      }}
                      className="w-full text-left p-1.5 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/60 text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <Zap className="w-3 h-3 text-amber-400" /> অটো ট্রেড এক্সিকিউট
                    </button>
                    <button
                      onClick={() => {
                        setPhoneState((p) => ({ ...p, activeApp: "Binance" }));
                        setShowPhoneFloatingMenu(false);
                      }}
                      className="w-full text-left p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200"
                    >
                      🟡 বাইন্যান্স খুলুন
                    </button>
                    <button
                      onClick={() => {
                        setPhoneState((p) => ({ ...p, activeApp: "TradingView" }));
                        setShowPhoneFloatingMenu(false);
                      }}
                      className="w-full text-left p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200"
                    >
                      📈 ট্রেডিংভিউ চার্ট
                    </button>
                    <button
                      onClick={() => {
                        toggleTorch();
                        setShowPhoneFloatingMenu(false);
                      }}
                      className="w-full text-left p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                    >
                      <span>💡 টর্চ লাইট</span>
                      <span className="font-mono text-[9px] text-amber-400">{phoneState.torch ? "ON" : "OFF"}</span>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowPhoneFloatingMenu((p) => !p)}
                className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-600 via-cyan-600 to-emerald-400 text-white flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.7)] border-2 border-white/80 active:scale-90 transition-all hover:scale-105"
                title="জারভিস ফ্লোটিং আইকন (স্ক্রিনের উপরে সর্বদা সক্রিয়)"
              >
                <Bot className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Bottom Android Navigation Bar */}
          <div className="h-6 bg-slate-950 flex items-center justify-center space-x-12 text-slate-500 border-t border-slate-800/60">
            <button
              onClick={() => setPhoneState((p) => ({ ...p, activeApp: "Home", callingContact: null }))}
              className="w-3 h-3 border-2 border-slate-500 rounded-sm hover:border-cyan-400"
            ></button>
            <button
              onClick={() => setPhoneState((p) => ({ ...p, activeApp: "Home", callingContact: null }))}
              className="w-3 h-3 rounded-full border-2 border-slate-500 hover:border-cyan-400"
            ></button>
            <button
              onClick={() => setPhoneState((p) => ({ ...p, activeApp: "Home", callingContact: null }))}
              className="w-0 h-0 border-y-4 border-y-transparent border-r-6 border-r-slate-500 hover:border-r-cyan-400"
            ></button>
          </div>
        </div>
      </div>

      {/* Real-time Hardware Telemetry & Command Inspection Panel */}
      <div className="flex-1 w-full max-w-lg space-y-4">
        {/* Terminal Live Execution */}
        <div className="bg-slate-950 border border-cyan-900/40 rounded-xl p-4 shadow-[0_0_20px_rgba(6,182,212,0.05)] font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
            <span className="text-cyan-400 flex items-center gap-1.5 font-bold">
              <Terminal className="w-3.5 h-3.5" /> PHONE HARDWARE EXECUTION
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              LINKED
            </span>
          </div>

          <div className="space-y-2.5">
            <div>
              <span className="text-[10px] text-slate-500 block mb-1">TERMUX:API COMMAND EXECUTED:</span>
              <div className="bg-slate-900/90 text-cyan-300 p-2.5 rounded-lg border border-slate-800 break-all select-all">
                $ {lastTermuxCmd || "termux-toast 'JARVIS Active'"}
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block mb-1">ADB SHELL COMMAND EXECUTED:</span>
              <div className="bg-slate-900/90 text-amber-300 p-2.5 rounded-lg border border-slate-800 break-all select-all">
                $ {lastAdbCmd || "adb shell input keyevent 3"}
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Status Gauges */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-['Hind_Siliguri',sans-serif]">টর্চ স্ট্যাটাস:</span>
            <div className="flex items-center justify-between mt-1">
              <span className={`font-bold font-mono ${phoneState.torch ? "text-amber-400" : "text-slate-400"}`}>
                {phoneState.torch ? "ILLUMINATING" : "STANDBY"}
              </span>
              <button
                onClick={toggleTorch}
                className="text-[10px] text-cyan-400 hover:underline font-['Hind_Siliguri',sans-serif]"
              >
                টগল
              </button>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <span className="text-slate-400 block text-[11px] font-['Hind_Siliguri',sans-serif]">ব্যাটারি চার্জিং:</span>
            <div className="flex items-center justify-between mt-1">
              <span className={`font-bold font-mono ${phoneState.isCharging ? "text-emerald-400" : "text-slate-400"}`}>
                {phoneState.isCharging ? "CHARGING" : "DISCHARGING"}
              </span>
              <button
                onClick={() => setPhoneState((p) => ({ ...p, isCharging: !p.isCharging }))}
                className="text-[10px] text-cyan-400 hover:underline font-['Hind_Siliguri',sans-serif]"
              >
                চেঞ্জ
              </button>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-cyan-950/30 border border-cyan-800/40 p-3.5 rounded-xl text-xs text-slate-300 font-['Hind_Siliguri',sans-serif] leading-relaxed">
          <p className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> সম্পূর্ণ ফোন নিয়ন্ত্রণ তথ্য:
          </p>
          জারভিস মুখে বলা যেকোনো বাংলা কমান্ড সরাসরি ফোন নির্দেশনায় রূপান্তর করে। উপরে ফোনের ভার্চুয়াল স্ক্রিনে লাইভ পরিবর্তন লক্ষ্য করুন অথবা <strong>"পাইথন কোড সমূহ"</strong> ট্যাব থেকে স্ক্রিপ্ট নামিয়ে ফোনে চালিয়ে দেখুন।
        </div>
      </div>
    </div>
  );
};
