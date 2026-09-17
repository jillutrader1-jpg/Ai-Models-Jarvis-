import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Sparkles, Volume2, Radio, Play } from "lucide-react";
import { playJarvisSound, speakBengali, stopSpeaking, createSpeechRecognizer } from "../lib/speech";

interface JarvisCoreProps {
  onSendCommand: (command: string) => void;
  isProcessing: boolean;
  lastResponse: string;
  isSpeaking: boolean;
  setIsSpeaking: (speaking: boolean) => void;
  isMuted: boolean;
  continuousListening: boolean;
  setContinuousListening: (continuous: boolean) => void;
}

export const JarvisCore: React.FC<JarvisCoreProps> = ({
  onSendCommand,
  isProcessing,
  lastResponse,
  isSpeaking,
  setIsSpeaking,
  isMuted,
  continuousListening,
  setContinuousListening,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [recognitionError, setRecognitionError] = useState<string | null>(null);
  const recognizerRef = useRef<any>(null);
  const shouldKeepListeningRef = useRef<boolean>(continuousListening);

  // Keep ref updated
  useEffect(() => {
    shouldKeepListeningRef.current = continuousListening;
  }, [continuousListening]);

  // Speech recognizer setup
  const initRecognizer = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.abort();
      } catch (e) {
        // ignore
      }
    }

    recognizerRef.current = createSpeechRecognizer(
      (transcript) => {
        if (transcript.trim()) {
          onSendCommand(transcript.trim());
        }
        // If continuous mode is ON, don't stay dead; auto restart
        if (!shouldKeepListeningRef.current) {
          setIsListening(false);
        }
      },
      (error) => {
        if (error !== "no-speech") {
          console.warn("Speech error:", error);
        }
      },
      () => {
        // Recognition ended; if continuous listening is desired, restart automatically!
        if (shouldKeepListeningRef.current && !isProcessing) {
          try {
            recognizerRef.current?.start();
            setIsListening(true);
          } catch (e) {
            setTimeout(() => {
              if (shouldKeepListeningRef.current) {
                try {
                  recognizerRef.current?.start();
                  setIsListening(true);
                } catch {
                  // ignore
                }
              }
            }, 300);
          }
        } else if (!shouldKeepListeningRef.current) {
          setIsListening(false);
        }
      },
      continuousListening
    );
  };

  useEffect(() => {
    initRecognizer();
    return () => {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, [onSendCommand, continuousListening]);

  // When continuous listening toggles, start or stop
  const toggleContinuousMode = () => {
    const nextState = !continuousListening;
    setContinuousListening(nextState);
    shouldKeepListeningRef.current = nextState;

    if (nextState) {
      stopSpeaking();
      setIsSpeaking(false);
      playJarvisSound("listen");
      try {
        recognizerRef.current?.start();
        setIsListening(true);
      } catch {
        initRecognizer();
        try {
          recognizerRef.current?.start();
          setIsListening(true);
        } catch (e) {
          console.warn("Could not start continuous listening:", e);
        }
      }
    } else {
      try {
        recognizerRef.current?.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  };

  const toggleListen = () => {
    if (continuousListening) {
      toggleContinuousMode();
      return;
    }

    if (isListening) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch {}
      }
      setIsListening(false);
    } else {
      stopSpeaking();
      setIsSpeaking(false);
      playJarvisSound("listen");
      setRecognitionError(null);

      if (recognizerRef.current) {
        try {
          recognizerRef.current.start();
          setIsListening(true);
        } catch (err) {
          console.warn("Could not start speech recognition:", err);
          initRecognizer();
          try {
            recognizerRef.current?.start();
            setIsListening(true);
          } catch {
            setRecognitionError("আপনার ব্রাউজারে মাইক চালু করা সম্ভব হয়নি। নিচে টাইপ করুন।");
          }
        }
      } else {
        setRecognitionError("আপনার ব্রাউজারে স্পিচ রিকগনিশন সক্রিয় নেই। নিচের বক্সে টাইপ করুন।");
      }
    }
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    const text = inputText;
    setInputText("");
    onSendCommand(text);
  };

  const handleReplayVoice = () => {
    if (!lastResponse || isMuted) return;
    speakBengali(
      lastResponse,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false)
    );
  };

  const quickPrompts = [
    { label: "টর্চ লাইট জ্বালাও", cmd: "টর্চ লাইট জ্বালাও" },
    { label: "ব্যাটারি কত পার্সেন্ট?", cmd: "ফোনে কত পার্সেন্ট ব্যাটারি চার্জ আছে?" },
    { label: "ইউটিউব খোলো", cmd: "ইউটিউব ওপেন করো" },
    { label: "আম্মুকে কল করো", cmd: "আম্মুকে ফোন কল করো" },
    { label: "একটি ছবি তোলো", cmd: "ক্যামেরা দিয়ে একটি ছবি তোলো" },
    { label: "সাউন্ড বাড়াও", cmd: "মিডিয়া সাউন্ড বাড়িয়ে দাও" },
    { label: "টর্চ বন্ধ করো", cmd: "টর্চ লাইট বন্ধ করে দাও" },
  ];

  return (
    <div className="flex flex-col items-center justify-between p-6 bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-cyan-900/30 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.06)] relative overflow-hidden h-full">
      {/* Background HUD Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#08334415_1px,transparent_1px),linear-gradient(to_bottom,#08334415_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Top Telemetry Header */}
      <div className="w-full flex items-center justify-between z-10 border-b border-cyan-950/70 pb-3">
        <div className="flex items-center space-x-2">
          <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono text-cyan-400 tracking-wider">JARVIS AUDIO CORE // BENGALI</span>
        </div>

        {/* ALWAYS LISTENING TOGGLE */}
        <div className="flex items-center space-x-2">
          <button
            id="always-listening-toggle"
            onClick={toggleContinuousMode}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-['Hind_Siliguri',sans-serif] transition-all border ${
              continuousListening
                ? "bg-rose-950/70 border-rose-500/70 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse"
                : "bg-slate-950/80 border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
            title="বারবার মাইক না চেপে একটানা কথা শোনার মোড চালু বা বন্ধ করুন"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                continuousListening ? "bg-rose-500 animate-ping" : "bg-slate-600"
              }`}
            />
            <span className="font-medium text-[11px]">
              {continuousListening ? "একটানা শুনছি (অটো মোড অন)" : "একটানা শোনার মোড"}
            </span>
          </button>
        </div>
      </div>

      {/* Main Holographic Arc Reactor Visualizer */}
      <div className="my-6 relative flex flex-col items-center justify-center z-10">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          {/* Outer Rotating Sci-Fi Ring */}
          <div
            className={`absolute inset-0 rounded-full border border-dashed border-cyan-500/30 ${
              isSpeaking || isListening ? "animate-[spin_8s_linear_infinite]" : "animate-[spin_25s_linear_infinite]"
            }`}
          ></div>

          {/* Secondary Counter-rotating Ring */}
          <div
            className={`absolute inset-3 rounded-full border-2 border-t-cyan-400/80 border-r-transparent border-b-cyan-600/40 border-l-transparent ${
              isSpeaking || isListening ? "animate-[spin_4s_linear_infinite_reverse]" : "animate-[spin_15s_linear_infinite_reverse]"
            }`}
          ></div>

          {/* Tertiary Glowing Ring */}
          <div
            className={`absolute inset-8 rounded-full border border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.25)] ${
              isListening ? "ring-4 ring-cyan-400/30 animate-pulse" : ""
            }`}
          ></div>

          {/* Waveform Equalizer Bars in Ring */}
          <div className="absolute inset-12 flex items-center justify-center space-x-1">
            {[40, 65, 30, 85, 95, 60, 45, 90, 75, 50, 80, 35].map((val, idx) => (
              <div
                key={idx}
                className="w-1 bg-gradient-to-t from-cyan-600 to-cyan-300 rounded-full transition-all duration-150"
                style={{
                  height: isSpeaking || isListening ? `${Math.max(12, (val * (idx % 2 === 0 ? 1 : 0.8)) * 0.9)}px` : "8px",
                  opacity: isSpeaking || isListening ? 0.9 : 0.25,
                }}
              ></div>
            ))}
          </div>

          {/* Center Arc Reactor Core / Mic Button */}
          <button
            id="jarvis-voice-mic-btn"
            onClick={toggleListen}
            disabled={isProcessing}
            title={isListening ? "শোনা বন্ধ করতে চাপুন" : "কথা বলতে চাপুন (বাংলা)"}
            className={`relative z-20 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 transform active:scale-95 ${
              isListening
                ? "bg-gradient-to-tr from-rose-600 to-amber-500 shadow-[0_0_40px_rgba(244,63,94,0.6)] ring-4 ring-rose-400/50"
                : isSpeaking
                ? "bg-gradient-to-tr from-cyan-600 to-emerald-400 shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-pulse"
                : "bg-gradient-to-tr from-cyan-900 to-slate-900 border border-cyan-400/40 hover:border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]"
            }`}
          >
            {isListening ? (
              <>
                <Mic className="w-8 h-8 text-white animate-bounce" />
                <span className="text-[10px] font-bold text-white mt-1 font-['Hind_Siliguri',sans-serif]">শুনছি...</span>
              </>
            ) : isProcessing ? (
              <>
                <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" />
                <span className="text-[10px] font-medium text-cyan-200 mt-1 font-['Hind_Siliguri',sans-serif]">প্রক্রিয়াধীন</span>
              </>
            ) : isSpeaking ? (
              <>
                <Volume2 className="w-8 h-8 text-white animate-pulse" />
                <span className="text-[10px] font-bold text-white mt-1 font-['Hind_Siliguri',sans-serif]">বলছি...</span>
              </>
            ) : (
              <>
                <Mic className="w-8 h-8 text-cyan-300" />
                <span className="text-[10px] font-semibold text-cyan-200 mt-1 font-['Hind_Siliguri',sans-serif]">বলুন স্যার</span>
              </>
            )}
          </button>
        </div>

        {/* State Label */}
        <div className="mt-2 text-center">
          <p className="text-sm font-['Hind_Siliguri',sans-serif] text-slate-300 flex items-center justify-center gap-2">
            {isListening ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                কথা বলুন... জারভিস শুনছে
              </span>
            ) : isProcessing ? (
              <span className="text-cyan-400 font-medium">নির্দেশ বিশ্লেষণ করা হচ্ছে...</span>
            ) : isSpeaking ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                জারভিস উত্তর দিচ্ছে...
              </span>
            ) : (
              <span className="text-slate-400">মাইকে চাপ দিন অথবা নিচে বাংলায় লিখুন</span>
            )}
          </p>

          {recognitionError && (
            <p className="text-xs text-amber-400 mt-1 font-['Hind_Siliguri',sans-serif]">{recognitionError}</p>
          )}
        </div>
      </div>

      {/* Jarvis Bengali Voice Output Display */}
      <div className="w-full z-10 mb-4 bg-slate-950/70 border border-cyan-900/40 rounded-xl p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> JARVIS BENGALI SPEECH
          </span>
          {lastResponse && (
            <button
              onClick={handleReplayVoice}
              disabled={isMuted}
              title="পুনরায় ভয়েস শুনুন"
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/50 px-2 py-0.5 rounded transition-all font-['Hind_Siliguri',sans-serif]"
            >
              <Play className="w-3 h-3" /> পুনরায় শুনুন
            </button>
          )}
        </div>
        <p className="text-slate-200 text-sm font-['Hind_Siliguri',sans-serif] leading-relaxed min-h-[44px]">
          {lastResponse || "জি স্যার, আমি জারভিস। আপনার ফোন নিয়ন্ত্রণে আমি সম্পূর্ণ প্রস্তুত। নির্দেশ দিন..."}
        </p>
      </div>

      {/* Quick Bengali Suggestion Chips */}
      <div className="w-full z-10 mb-4">
        <span className="text-[10px] font-mono text-slate-400 block mb-1.5">QUICK COMMANDS (বাংলায় সরাসরি চাপুন):</span>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              id={`quick-cmd-${idx}`}
              onClick={() => onSendCommand(item.cmd)}
              disabled={isProcessing}
              className="text-xs font-['Hind_Siliguri',sans-serif] bg-slate-900/90 hover:bg-cyan-950/70 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-700/60 px-2.5 py-1 rounded-lg transition-all duration-150 disabled:opacity-50"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Text Command Input Fallback */}
      <form onSubmit={handleTextSubmit} className="w-full z-10 flex items-center space-x-2">
        <div className="relative flex-1">
          <input
            id="jarvis-command-input"
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="বাংলায় বা ইংরেজিতে নির্দেশ লিখুন (যেমন: টর্চ অন করো)..."
            className="w-full bg-slate-950/90 border border-slate-800 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-['Hind_Siliguri',sans-serif]"
          />
        </div>

        <button
          id="jarvis-submit-btn"
          type="submit"
          disabled={!inputText.trim() || isProcessing}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:hover:bg-cyan-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm flex items-center justify-center transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
