// Audio and Speech utilities for JARVIS Bengali Assistant

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

// Sci-Fi Jarvis Audio Sound Effects
export function playJarvisSound(type: "startup" | "listen" | "success" | "toggle" | "call") {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "startup") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.35);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === "listen") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(1050, now + 0.1);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === "success") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(780, now + 0.1);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === "toggle") {
      osc.type = "square";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === "call") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(425, now);
      osc.frequency.setValueAtTime(425, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.45);
    }
  } catch (e) {
    console.debug("Audio effect bypassed:", e);
  }
}

// Bengali Speech Synthesis
export function speakBengali(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("SpeechSynthesis not supported");
    return null;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95; // Steady, composed AI speech
  utterance.pitch = 0.98; // Subtle deep tone for Jarvis
  utterance.volume = 1.0;

  // Search for Bengali voice
  const voices = window.speechSynthesis.getVoices();
  const banglaVoice =
    voices.find((v) => v.lang === "bn-BD" || v.lang === "bn_BD") ||
    voices.find((v) => v.lang === "bn-IN" || v.lang === "bn_IN") ||
    voices.find((v) => v.lang.startsWith("bn")) ||
    voices.find((v) => v.lang.includes("bn"));

  if (banglaVoice) {
    utterance.voice = banglaVoice;
    utterance.lang = banglaVoice.lang;
  } else {
    utterance.lang = "bn-BD";
  }

  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  utterance.onerror = (e) => {
    console.warn("TTS Error:", e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// Browser Speech Recognition for Bengali with Continuous "Always Listening" Support
export function createSpeechRecognizer(
  onResult: (transcript: string) => void,
  onError: (error: string) => void,
  onEnd: () => void,
  continuous: boolean = false
) {
  if (typeof window === "undefined") return null;

  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) {
    return null;
  }

  const recognition = new SpeechRecognitionClass();
  recognition.lang = "bn-BD";
  recognition.continuous = continuous;
  recognition.interimResults = false;

  recognition.onresult = (event: any) => {
    // In continuous mode, grab the latest result
    const lastIndex = event.results.length - 1;
    const transcript = event.results?.[lastIndex]?.[0]?.transcript || "";
    if (transcript.trim()) {
      onResult(transcript.trim());
    }
  };

  recognition.onerror = (event: any) => {
    // 'no-speech' is normal when user pauses
    if (event.error !== "no-speech") {
      console.warn("Speech recognition error:", event.error);
    }
    onError(event.error);
  };

  recognition.onend = () => {
    onEnd();
  };

  return recognition;
}
