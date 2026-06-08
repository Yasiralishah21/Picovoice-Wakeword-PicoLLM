import { useState, useEffect, useRef, useCallback } from "react";

const ACCENT = "#5B6BF8";
const CYAN = "#22d3ee";
const COLS = 10;
const ROWS = 10;
const TOTAL = COLS * ROWS;
const API_URL = "http://localhost:5000";
const MUTED = "#9095A8";

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

function speak(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  window.speechSynthesis.speak(speech);
}

const WAKE_EXAMPLES = ["siri", "computer", "Moto", "Techelix"];

function speakAsync(text, lang = "en-US") {
  return new Promise((resolve) => {
    if (!text || !window.speechSynthesis) {
      resolve();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    window.speechSynthesis.speak(utterance);
  });
}

function normalizeSpeech(text) {
  return (text || "").toLowerCase().replace(/[^\w\s']/g, "").trim();
}

function matchesWakeWord(transcript, targetWord) {
  const heard = normalizeSpeech(transcript);
  const target = normalizeSpeech(targetWord);
  if (!target || !heard) return false;
  if (heard.includes(target)) return true;

  const heardWords = heard.split(/\s+/);
  const targetWords = target.split(/\s+/);

  if (targetWords.length === 1) {
    return heardWords.some(
      (w) => w === target || w.startsWith(target) || target.startsWith(w)
    );
  }

  return targetWords.every((tw) => heardWords.some((w) => w.includes(tw) || tw.includes(w)));
}

function releaseMicStream(streamRef) {
  streamRef?.current?.getTracks().forEach((t) => t.stop());
  if (streamRef) streamRef.current = null;
}

function getSpeechRecognition() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

function listenUntilWakeWord(language, targetWord, recRef, onPartial) {
  return new Promise((resolve) => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      setTimeout(() => resolve(targetWord), 1500);
      return;
    }

    window.speechSynthesis?.cancel();

    const rec = new SpeechRecognition();
    rec.lang = language === "en" ? "en-US" : language;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 3;

    if (recRef) recRef.current = rec;

    let settled = false;
    let restartTimer = null;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(restartTimer);
      clearTimeout(maxTimer);
      try { rec.stop(); } catch { /* ignore */ }
      if (recRef) recRef.current = null;
      resolve(value);
    };

    const maxTimer = setTimeout(() => {
      console.warn("Wake word listen timed out");
      finish(null);
    }, 25000);

    const restart = () => {
      if (settled) return;
      clearTimeout(restartTimer);
      restartTimer = setTimeout(() => {
        try { rec.start(); } catch (err) {
          console.error("Speech recognition restart failed:", err);
          finish(null);
        }
      }, 250);
    };

    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const transcript = e.results[i][0].transcript;
        onPartial?.(transcript);

        if (matchesWakeWord(transcript, targetWord)) {
          console.log("Wake word matched:", transcript);
          finish(targetWord);
          return;
        }
      }
    };

    rec.onerror = (e) => {
      console.warn("Speech recognition error:", e.error);
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        finish(null);
        return;
      }
      if (e.error === "no-speech" || e.error === "aborted" || e.error === "network") {
        restart();
      }
    };

    rec.onend = () => {
      if (!settled) restart();
    };

    try {
      rec.start();
    } catch (err) {
      console.error("Speech recognition start failed:", err);
      finish(null);
    }
  });
}

function listenForQuestion(language, recRef, onPartial) {
  return new Promise((resolve) => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) {
      const fallback = window.prompt("Speech recognition unavailable. Type your question:") || "";
      resolve(fallback.trim());
      return;
    }

    window.speechSynthesis?.cancel();

    const rec = new SpeechRecognition();
    rec.lang = language === "en" ? "en-US" : language;
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 3;

    if (recRef) recRef.current = rec;

    let settled = false;
    let restartTimer = null;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      clearTimeout(restartTimer);
      clearTimeout(maxTimer);
      try { rec.stop(); } catch { /* ignore */ }
      if (recRef) recRef.current = null;
      resolve(value);
    };

    const maxTimer = setTimeout(() => {
      try { rec.stop(); } catch { /* ignore */ }
      finish("");
    }, 12000);

    const restart = () => {
      if (settled) return;
      clearTimeout(restartTimer);
      restartTimer = setTimeout(() => {
        try { rec.start(); } catch { finish(""); }
      }, 250);
    };

    rec.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      const transcript = last[0].transcript.trim();
      onPartial?.(transcript);

      if (last.isFinal && transcript) {
        finish(transcript);
      }
    };

    rec.onerror = (e) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        finish("");
        return;
      }
      if (e.error === "no-speech" || e.error === "aborted") {
        restart();
      }
    };

    rec.onend = () => {
      if (!settled) restart();
    };

    try { rec.start(); } catch { finish(""); }
  });
}

const STATS = [
  { value: 1288, label: "Models" },
  { value: 4547, label: "Downloads" },
  { value: 809,  label: "Wake Words" },
];

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

function useCountUp(target, active, duration = 1400) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime = null;
    let rafId = null;
    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setDisplay(Math.round(easeOut(progress) * target));
      if (progress < 1) rafId = requestAnimationFrame(tick);
      else setDisplay(target);
    };
    setDisplay(0);
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, target, duration]);
  return display.toLocaleString("en-US");
}

function StatItem({ value, label, animate }) {
  const num = useCountUp(value, animate);
  return (
    <div className="lk-stat">
      <span className="lk-stat-num">{num}</span>
      <span className="lk-stat-label">{label}</span>
    </div>
  );
}

// scattered ambient dots outside the box
const AMBIENT_DOTS = [
  [-45,20],[-45,50],[-45,80],[-45,110],[-45,140],[-45,165],
  [-30,5],[-20,-20],[0,-40],[30,-45],[60,-50],
  [90,-45],[120,-40],[150,-45],[170,-30],[190,-15],
  [215,10],[220,40],[220,70],[220,100],[220,130],[220,160],[215,185],
  [200,200],[170,210],[140,215],[110,215],[80,215],
  [50,210],[20,205],[0,195],[-20,178],[-38,158],
  [-55,-35],[230,-25],[238,198],[-58,195],
  [100,-58],[40,-55],[165,-52],[220,50],[222,115],
  [-42,95],[-48,170],[205,90],[208,50],
];

// ── Dot grid canvas ────────────────────────────────────────────────────────────
function DotGrid({ mousePos, boxRef }) {
  const canvasRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const draw = (ts) => {
      const W = canvas.width;
      const H = canvas.height;
      if (!W || !H) { frameRef.current = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, W, H);

      const cellW = W / COLS;
      const cellH = H / ROWS;
      const t = ts / 1000; // seconds

      // — spiral snake (column-major, same as before but faster + longer) —
      const snakeLen = 5;
      const snakeHead = ((t * 2.2) * ROWS) % TOTAL;

      // — ripple origin: bounces around —
      const rippleX = ((Math.sin(t * 0.7) * 0.5 + 0.5)) * W;
      const rippleY = ((Math.cos(t * 0.5) * 0.5 + 0.5)) * H;
      const rippleR = (t * 80) % (W * 1.2);

      // — second ripple offset in phase —
      const ripple2X = ((Math.sin(t * 0.4 + 2) * 0.5 + 0.5)) * W;
      const ripple2Y = ((Math.cos(t * 0.6 + 1) * 0.5 + 0.5)) * H;
      const ripple2R = ((t * 60 + 40) % (W * 1.2));

      for (let i = 0; i < TOTAL; i++) {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        const cx = col * cellW + cellW / 2;
        const cy = row * cellH + cellH / 2;

        // 1. column-major snake glow
        const travPos = col * ROWS + row;
        let snakeGlow = 0;
        for (let s = 0; s < snakeLen; s++) {
          const sh = (snakeHead - s + TOTAL) % TOTAL;
          const d = Math.min(Math.abs(travPos - sh), TOTAL - Math.abs(travPos - sh));
          if (d === 0) snakeGlow = Math.max(snakeGlow, 1 - s * 0.18);
        }

        // 2. ripple 1 — ring expanding outward
        const dr1 = Math.sqrt((cx - rippleX) ** 2 + (cy - rippleY) ** 2);
        const ring1 = Math.max(0, 1 - Math.abs(dr1 - rippleR) / 18) * 0.85;

        // 3. ripple 2 — second ring, different color
        const dr2 = Math.sqrt((cx - ripple2X) ** 2 + (cy - ripple2Y) ** 2);
        const ring2 = Math.max(0, 1 - Math.abs(dr2 - ripple2R) / 14) * 0.7;

        // 4. twinkle — each dot has its own phase
        const twinkle = Math.pow(Math.max(0, Math.sin(t * 3 + i * 0.97)), 6) * 0.6;

        // 5. wave across grid (diagonal sine)
        const wave = (Math.sin(col * 0.8 - t * 3) * Math.cos(row * 0.8 + t * 2) + 1) / 2 * 0.35;

        // 6. mouse proximity repulsion glow
        let mouseGlow = 0;
        if (mousePos && boxRef.current) {
          const rect = boxRef.current.getBoundingClientRect();
          const mx = mousePos.x * (W / rect.width);
          const my = mousePos.y * (H / rect.height);
          const md = Math.sqrt((cx - mx) ** 2 + (cy - my) ** 2);
          mouseGlow = Math.max(0, 1 - md / 55) * 0.9;
        }

        // combine all effects
        const combined = Math.min(1,
          snakeGlow * 1.0 +
          ring1 +
          ring2 * 0.7 +
          twinkle +
          wave +
          mouseGlow
        );

        const baseAlpha = 0.12;
        const alpha = baseAlpha + combined * 0.88;
        const radius = 1.4 + combined * 1.2;

        // color: blend between accent (ring2), cyan (snake+ring1), white (mouse)
        let r = 34, g = 211, b = 238; // cyan default
        if (ring2 > snakeGlow && ring2 > ring1) {
          // accent purple for second ripple
          r = 91 + combined * 60; g = 107; b = 248;
        }
        if (mouseGlow > 0.4) {
          // white-ish for mouse proximity
          r = 180 + mouseGlow * 75;
          g = 180 + mouseGlow * 75;
          b = 255;
        }

        if (combined > 0.45) {
          ctx.shadowBlur = 10 + combined * 8;
          ctx.shadowColor = mouseGlow > 0.4
            ? `rgba(180,180,255,0.9)`
            : ring2 > ring1 ? `rgba(91,107,248,0.9)` : `rgba(34,211,238,0.9)`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fillStyle = combined > 0.15
          ? `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha})`
          : `rgba(144,149,168,${baseAlpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameRef.current);
  }, [mousePos, boxRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sync = () => {
      canvas.width  = canvas.offsetWidth  || 200;
      canvas.height = canvas.offsetHeight || 200;
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        borderRadius: "14px",
        zIndex: 2,
        pointerEvents: "none",
      }}
      aria-hidden="true"
    />
  );
}

// ── Animated border ────────────────────────────────────────────────────────────
function AnimatedBorder() {
  return (
    <svg
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        overflow: "visible", zIndex: 3, pointerEvents: "none",
      }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lk-bg" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor={ACCENT} stopOpacity="1" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
        rx="13" fill="none" stroke="rgba(144,149,168,0.25)" strokeWidth="1" />
      <rect className="lk-runner" x="1" y="1"
        width="calc(100% - 2px)" height="calc(100% - 2px)"
        rx="13" fill="none" stroke="url(#lk-bg)"
        strokeWidth="1.5" strokeDasharray="60 1000" strokeLinecap="round" />
      <style>{`
        .lk-runner { animation: lk-run 3s linear infinite; }
        @keyframes lk-run { from{stroke-dashoffset:0} to{stroke-dashoffset:-1060} }
        @media(prefers-reduced-motion:reduce){.lk-runner{animation:none}}
      `}</style>
    </svg>
  );
}

function WakeWordHint() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx(i => (i + 1) % WAKE_EXAMPLES.length), 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="lk-wake-hint" aria-hidden="true">
      <span className="lk-wake-hey">hey </span>
      <span className="lk-wake-word" key={WAKE_EXAMPLES[idx]}>
        {WAKE_EXAMPLES[idx]}
      </span>
    </p>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function HeroLiveKit() {
  const [talking, setTalking]           = useState(false);
  const [micOn, setMicOn]               = useState(true);
  const [tooltip, setTooltip]           = useState(null);
  const [tooltipVisible, setTooltipVis] = useState(false);
  const [micError, setMicError]         = useState(false);
  const [wakeWord, setWakeWord]         = useState("");
  const [language, setLanguage]         = useState("en");
  const [trainPhase, setTrainPhase]     = useState("form");
  const [trainTime, setTrainTime]       = useState(0);
  const [finalTime, setFinalTime]       = useState(0);
  const [trainError, setTrainError]     = useState("");
  const boxRef      = useRef(null);
  const streamRef   = useRef(null);
  const tipTimer    = useRef(null);
  const trainTimer  = useRef(null);
  const recRef      = useRef(null);
  const statsRef    = useRef(null);
  const [statsActive, setStatsActive] = useState(false);
  const [aiResponse, setAiResponse]   = useState("");
  const [heardText, setHeardText]     = useState("");
  const [chatInput, setChatInput]     = useState("");

  const resetTrainState = useCallback(() => {
    window.speechSynthesis?.cancel();
    try { recRef.current?.stop(); } catch { /* ignore */ }
    recRef.current = null;
    setWakeWord("");
    setLanguage("en");
    setTrainPhase("form");
    setTrainTime(0);
    setFinalTime(0);
    setTrainError("");
    setAiResponse("");
    setHeardText("");
    setChatInput("");
    if (trainTimer.current) {
      clearInterval(trainTimer.current);
      trainTimer.current = null;
    }
  }, []);

  const transcribeSpeech = useCallback(async (spokenText) => {
    const res = await fetch(`${API_URL}/transcribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: spokenText }),
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.error || "Transcription failed");
    }
    console.log("WHISPER TRANSCRIPT:", data.text);
    return data.text;
  }, []);

  const sendQuery = useCallback(async (text) => {
    console.log("Sending query...");
    const res = await fetch(`${API_URL}/voice-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ audio: text }),
    });

    const data = await res.json();

    if (!data.response) {
      throw new Error(data.error || "AI request failed");
    }

    console.log("Response received...", data.response);
    setAiResponse(data.response);
    speak(data.response);
    return data.response;
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setStatsActive(true); obs.disconnect(); }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!boxRef.current) return;
    const r = boxRef.current.getBoundingClientRect();
    setTooltip({ x: e.clientX - r.left, y: e.clientY - r.top });
    setTooltipVis(true);
    clearTimeout(tipTimer.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => setTooltipVis(false), 80);
  }, []);

  const handleBoxClick = useCallback(async () => {
    if (talking) return;

    setMicError(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setTalking(true);
      setMicOn(true);
      setTooltipVis(false);

      await fetch(`${API_URL}/voice-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recording: true }),
      });
    } catch (err) {
      console.error(err);
      setMicError(true);
    }
  }, [talking]);

  const handleCancel = useCallback(() => {
    fetch(`${API_URL}/voice-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recording: false }),
    });
    window.speechSynthesis?.cancel();
    try { recRef.current?.stop(); } catch { /* ignore */ }
    recRef.current = null;
    releaseMicStream(streamRef);
    resetTrainState();
    setTalking(false);
    setMicOn(true);
    setMicError(false);
  }, [resetTrainState]);

  const toggleMic = useCallback(() => {
    const track = streamRef.current?.getAudioTracks()[0];
    if (track) { track.enabled = !track.enabled; setMicOn(v => !v); }
  }, []);

  const handleTrain = useCallback(async () => {
    if (!wakeWord.trim()) return;
    setTrainError("");
    const trimmed = wakeWord.trim();

    setTrainPhase("training");
    setTrainTime(0);
    const start = performance.now();
    const targetDuration = Math.random() * 5;

    await new Promise((resolve) => {
      trainTimer.current = setInterval(() => {
        const elapsed = (performance.now() - start) / 1000;
        setTrainTime(Math.min(elapsed, targetDuration));
        if (elapsed >= targetDuration) {
          clearInterval(trainTimer.current);
          trainTimer.current = null;
          setFinalTime(targetDuration);
          resolve();
        }
      }, 40);
    });

    setTrainPhase("done");
    await speakAsync(`Wake word trained in ${targetDuration.toFixed(1)} seconds`);

    setTrainPhase("record");
    await speakAsync(`Tap the mic and say ${trimmed}`);
  }, [wakeWord]);

  const stopListening = useCallback(() => {
    window.speechSynthesis?.cancel();
    try { recRef.current?.stop(); } catch { /* ignore */ }
    recRef.current = null;
    releaseMicStream(streamRef);
    setHeardText("");
    setTrainPhase("record");
  }, []);

  const handleRecordMic = useCallback(async () => {
    if (trainPhase !== "record") return;

    setTrainError("");
    setHeardText("");
    setTrainPhase("listening");

    releaseMicStream(streamRef);
    window.speechSynthesis?.cancel();

    const trimmed = wakeWord.trim();
    await speakAsync(`Listening for ${trimmed}`);

    const detected = await listenUntilWakeWord(
      language,
      trimmed,
      recRef,
      (partial) => setHeardText(partial)
    );

    if (!detected) {
      setTrainError("Couldn't hear your wake word. Tap the mic and try again. (Use Chrome/Edge)");
      setTrainPhase("record");
      return;
    }

    try {
      await fetch(`${API_URL}/voice-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ wakeword: detected, language }),
      });
    } catch {
      setTrainError("Could not reach the server. Please try again.");
      setTrainPhase("record");
      return;
    }

    setTrainPhase("detected");
    await speakAsync("Yes!");
    setTrainPhase("choice_mode");
    await speakAsync("How would you like to ask? Choose voice or chat.");
  }, [trainPhase, wakeWord, language]);

  const handleVoiceOption = useCallback(async () => {
    setTrainError("");
    setHeardText("");
    setTrainPhase("listening_question");
    await speakAsync("I'm listening. Ask your question.");

    releaseMicStream(streamRef);
    window.speechSynthesis?.cancel();

    const question = await listenForQuestion(
      language,
      recRef,
      (partial) => setHeardText(partial)
    );

    if (!question) {
      setTrainError("I didn't hear a question. Try voice again or use chat.");
      setTrainPhase("choice_mode");
      return;
    }

    setTrainPhase("answering");

    try {
      const text = await transcribeSpeech(question);
      await sendQuery(text);
      setTrainPhase("answered");
    } catch (err) {
      console.error("Pipeline failed:", err);
      setTrainError("Could not get an AI response. Is the backend and Ollama running?");
      setTrainPhase("choice_mode");
    }
  }, [language, transcribeSpeech, sendQuery]);

  const handleChatOption = useCallback(() => {
    setTrainError("");
    setHeardText("");
    setChatInput("");
    setTrainPhase("chat_input");
  }, []);

  const handleChatSubmit = useCallback(async () => {
    const question = chatInput.trim();
    if (!question) return;

    setTrainError("");
    setTrainPhase("answering");

    try {
      await sendQuery(question);
      setTrainPhase("answered");
    } catch (err) {
      console.error("Chat pipeline failed:", err);
      setTrainError("Could not get an AI response. Is the backend and Ollama running?");
      setTrainPhase("chat_input");
    }
  }, [chatInput, sendQuery]);

  const handleTrainAnother = useCallback(() => {
    if (trainTimer.current) {
      clearInterval(trainTimer.current);
      trainTimer.current = null;
    }
    setWakeWord("");
    setTrainPhase("form");
    setTrainTime(0);
    setFinalTime(0);
    setTrainError("");
    setAiResponse("");
    setChatInput("");
  }, []);

  useEffect(() => () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    clearTimeout(tipTimer.current);
    if (trainTimer.current) clearInterval(trainTimer.current);
  }, []);

  return (
    <section className="lk-section">
      <div className={`lk-inner ${talking ? "lk-inner--talking" : ""}`}>

        <div className="lk-hero-box-area">
          {/* dot box wrapper — overflow:visible so ambient dots show */}
          <div className="lk-box-wrap">
            <svg className="lk-ambient" viewBox="-60 -60 320 320" aria-hidden="true">
              {AMBIENT_DOTS.map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r="1.5" fill="rgba(144,149,168,0.15)" />
              ))}
            </svg>

            <div
              ref={boxRef}
              className="lk-box"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={!talking ? handleBoxClick : undefined}
              style={{ cursor: talking ? "default" : "pointer" }}
              role="button" aria-label="Click to talk" tabIndex={0}
              onKeyDown={e => e.key === "Enter" && !talking && handleBoxClick()}
            >
              <div style={{
                position:"absolute",inset:0,borderRadius:14,
                background:"rgba(10,12,26,0.6)",zIndex:0,pointerEvents:"none"
              }}/>
              <div className="lk-box-dots-bg" aria-hidden="true">
                <svg className="lk-box-dots-svg" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="lk-box-dot-pattern" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="1.15" fill="rgba(255,255,255,0.32)" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#lk-box-dot-pattern)" />
                </svg>
              </div>
              <DotGrid mousePos={tooltip} boxRef={boxRef} />
              <AnimatedBorder />

              {!talking && tooltipVisible && tooltip && (
                <div className="lk-tooltip"
                  style={{ left: tooltip.x, top: tooltip.y }}
                  aria-hidden="true">
                  CLICK TO TALK
                </div>
              )}
            </div>
          </div>

          {talking && (
            <div className="lk-talking-ui" onClick={e => e.stopPropagation()}>
              <div className="lk-controls">
                <button type="button" className="lk-ctrl-btn lk-ctrl-cancel"
                  onClick={handleCancel} aria-label="Cancel">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                  </svg>
                </button>
                <button type="button"
                  className={`lk-ctrl-btn ${micOn ? "lk-ctrl-mic--on" : "lk-ctrl-mic--off"}`}
                  onClick={toggleMic} aria-label={micOn ? "Mute" : "Unmute"}>
                  {micOn ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <line x1="1" y1="1" x2="23" y2="23"/>
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"/>
                      <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8"/>
                    </svg>
                  )}
                </button>
              </div>

              <div className="lk-train-panel">
                {trainPhase === "form" && (
                  <div className="lk-train-form">
                    <div className="lk-train-row">
                      <label className="lk-train-field lk-train-field--lang">
                        <span className="lk-sr-only">Language</span>
                        <select
                          className="lk-train-select"
                          value={language}
                          onChange={e => setLanguage(e.target.value)}
                        >
                          {LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                          ))}
                        </select>
                      </label>
                      <label className="lk-train-field lk-train-field--word">
                        <span className="lk-sr-only">Wake word</span>
                        <input
                          type="text"
                          className="lk-train-input"
                          placeholder="Wake word to train"
                          value={wakeWord}
                          onChange={e => setWakeWord(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && wakeWord.trim() && handleTrain()}
                        />
                      </label>
                    </div>
                    <button
                      type="button"
                      className="lk-train-btn"
                      disabled={!wakeWord.trim()}
                      onClick={handleTrain}
                    >
                      Train
                    </button>
                    <WakeWordHint />
                  </div>
                )}

                {trainPhase === "record" && (
                  <div className="lk-train-record">
                    <p className="lk-train-record-label">
                      Tap the mic and say &ldquo;{wakeWord.trim()}&rdquo;
                    </p>
                    <button
                      type="button"
                      className="lk-train-mic-btn"
                      onClick={handleRecordMic}
                      aria-label={`Record wake word ${wakeWord.trim()}`}
                    >
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                      </svg>
                    </button>
                    {trainError && (
                      <p className="lk-train-error" role="alert">{trainError}</p>
                    )}
                    <button type="button" className="lk-train-back" onClick={handleTrainAnother}>
                      Back
                    </button>
                  </div>
                )}

                {trainPhase === "listening" && (
                  <div className="lk-train-record" role="status" aria-live="polite">
                    <p className="lk-train-record-label">
                      Listening for &ldquo;{wakeWord.trim()}&rdquo;&hellip;
                    </p>
                    {heardText && (
                      <p className="lk-train-heard">Heard: &ldquo;{heardText}&rdquo;</p>
                    )}
                    <div className="lk-train-mic-btn lk-train-mic-btn--active" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                      </svg>
                    </div>
                    <button type="button" className="lk-train-back" onClick={stopListening}>
                      Cancel listening
                    </button>
                  </div>
                )}

                {trainPhase === "detected" && (
                  <div className="lk-train-done" role="status">
                    <p className="lk-train-done-text lk-train-yes">YES!</p>
                  </div>
                )}

                {trainPhase === "choice_mode" && (
                  <div className="lk-train-question">
                    <p className="lk-train-record-label">How would you like to ask?</p>
                    <div className="lk-train-yn">
                      <button type="button" className="lk-train-btn lk-train-btn--voice" onClick={handleVoiceOption}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                          <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                        </svg>
                        Voice
                      </button>
                      <button type="button" className="lk-train-btn lk-train-btn--chat" onClick={handleChatOption}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                        Chat
                      </button>
                    </div>
                    {trainError && (
                      <p className="lk-train-error" role="alert">{trainError}</p>
                    )}
                  </div>
                )}

                {trainPhase === "chat_input" && (
                  <div className="lk-train-chat">
                    <p className="lk-train-record-label">Ask your question</p>
                    <textarea
                      className="lk-train-chat-input"
                      placeholder="Type your question here..."
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleChatSubmit())}
                      rows={3}
                    />
                    <button
                      type="button"
                      className="lk-train-btn"
                      disabled={!chatInput.trim()}
                      onClick={handleChatSubmit}
                    >
                      Ask AI
                    </button>
                    {trainError && (
                      <p className="lk-train-error" role="alert">{trainError}</p>
                    )}
                    <button type="button" className="lk-train-back" onClick={() => setTrainPhase("choice_mode")}>
                      Back
                    </button>
                  </div>
                )}

                {trainPhase === "listening_question" && (
                  <div className="lk-train-record" role="status" aria-live="polite">
                    <p className="lk-train-record-label">Listening for your question&hellip;</p>
                    {heardText && (
                      <p className="lk-train-heard">Heard: &ldquo;{heardText}&rdquo;</p>
                    )}
                    <div className="lk-train-mic-btn lk-train-mic-btn--active" aria-hidden="true">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                      </svg>
                    </div>
                  </div>
                )}

                {trainPhase === "answering" && (
                  <div className="lk-train-progress" role="status" aria-live="polite">
                    <p className="lk-train-progress-text">Thinking&hellip;</p>
                  </div>
                )}

                {trainPhase === "answered" && (
                  <div className="lk-train-done" role="status">
                    <p className="lk-train-done-text">{aiResponse}</p>
                    <button type="button" className="lk-train-back" onClick={() => { setChatInput(""); setTrainPhase("choice_mode"); }}>
                      Ask another
                    </button>
                  </div>
                )}

                {trainPhase === "training" && (
                  <div className="lk-train-progress" role="status" aria-live="polite">
                    <p className="lk-train-progress-text">
                      Model is training &ldquo;{wakeWord.trim()}&rdquo;&hellip;{" "}
                      <span className="lk-train-progress-time">{trainTime.toFixed(2)}s</span>
                    </p>
                    <div className="lk-train-progress-bar" aria-hidden="true">
                      <div
                        className="lk-train-progress-fill"
                        style={{ width: `${Math.min((trainTime / 5) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                {trainPhase === "done" && (
                  <div className="lk-train-done" role="status">
                    <p className="lk-train-done-text">
                      Model trained &middot; &ldquo;{wakeWord.trim()}&rdquo;
                      <br />
                      <span className="lk-train-done-time">in {finalTime.toFixed(2)}s</span>
                    </p>
                  </div>
                )}

                {trainPhase === "finished" && (
                  <div className="lk-train-done" role="status">
                    <p className="lk-train-done-text">All set! Come back anytime.</p>
                    <button type="button" className="lk-train-back" onClick={handleTrainAnother}>
                      Train another
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* button → heading → description */}
        <div className={`lk-content ${talking ? "lk-content--hidden" : ""}`}>
          <div className="lk-cta-block">
            <div className="lk-cta-row">
              <button type="button" className="lk-btn-talk" onClick={handleBoxClick}>
                <svg className="lk-btn-talk-icon" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>
                </svg>
                <span className="lk-btn-talk-slider" aria-hidden="true">
                  <span className="lk-btn-talk-track">
                    <span className="lk-btn-talk-line">Talk to Techelix Agent</span>
                    <span className="lk-btn-talk-line">Talk to Techelix Agent</span>
                  </span>
                </span>
                <span className="lk-sr-only">Talk to LiveKit Agent</span>
              </button>
            </div>
            {micError && (
              <p className="lk-error" role="alert">
                Microphone access denied. Please allow mic permissions.
              </p>
            )}
          </div>

          <h1 className="lk-heading">
            <span className="lk-heading-line">
              Make wake word creation
            </span>
            <span className="lk-heading-line">
              <span className="lk-grad-accessible">simple and accessible</span> for everyone
            </span>
          </h1>

          <p className="lk-desc">
            An open source framework and developer platform for building, testing,
            deploying, scaling, and observing agents in production.
          </p>
        </div>

        <div className="lk-stats" ref={statsRef}>
          {STATS.map(s => (
            <StatItem key={s.label} value={s.value} label={s.label} animate={statsActive} />
          ))}
        </div>

      </div>

      <style>{`
        .lk-section {
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(4rem,10vw,7rem) clamp(1rem,4vw,2rem);
          background: #0a0c1a;
          overflow-x: clip;
        }
        .lk-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(1.5rem,4vw,2.5rem);
          width: 100%;
          max-width: 52rem;
          text-align: center;
        }
        @media (max-width: 1023px) {
          .lk-section {
            padding-left: clamp(1.25rem, 5vw, 1.75rem);
            padding-right: clamp(1.25rem, 5vw, 1.75rem);
          }
          .lk-inner {
            max-width: 100%;
            align-items: center;
          }
        }

        .lk-hero-box-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: min(100%, 26rem);
        }

        /* wrapper allows overflow for ambient dots */
        .lk-box-wrap {
          position: relative;
          width: clamp(140px,28vw,200px);
          height: clamp(140px,28vw,200px);
          flex-shrink: 0;
        }

        .lk-talking-ui {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          gap: clamp(0.875rem, 3vw, 1.25rem);
          margin-top: clamp(0.5rem, 2vw, 0.75rem);
          animation: lk-up 250ms ease;
        }

        /* ambient SVG fills the viewBox which extends well outside box */
        .lk-ambient {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          pointer-events: none;
          z-index: 0;
        }

        /* actual interactive box */
        .lk-box {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          overflow: visible;
          user-select: none;
          z-index: 1;
        }

        .lk-box-dots-bg {
          position: absolute;
          inset: 0;
          border-radius: 14px;
          z-index: 1;
          pointer-events: none;
          overflow: hidden;
          opacity: 0.5;
        }
        .lk-box-dots-svg {
          display: block;
          width: 100%;
          height: 100%;
        }

        .lk-tooltip {
          position: absolute;
          transform: translate(-50%, calc(-100% - 10px));
          background: rgba(10,12,26,0.92);
          border: 1px solid ${CYAN};
          color: ${CYAN};
          font-size: 0.625rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          padding: 0.3rem 0.75rem;
          border-radius: 999px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 30;
          backdrop-filter: blur(4px);
          animation: lk-tip-in 100ms ease;
        }
        @keyframes lk-tip-in {
          from{opacity:0;transform:translate(-50%,calc(-100% - 6px))}
          to{opacity:1;transform:translate(-50%,calc(-100% - 10px))}
        }

        .lk-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          z-index: 30;
        }
        @keyframes lk-up {
          from{opacity:0;transform:translateY(8px)}
          to{opacity:1;transform:translateY(0)}
        }

        .lk-ctrl-btn {
          width: 2.75rem; height: 2.75rem;
          border-radius: 50%; border: none; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: transform 150ms;
        }
        .lk-ctrl-btn:hover{transform:scale(1.1)}
        .lk-ctrl-cancel{
          background:rgba(239,68,68,0.15);color:#ef4444;
          border:1px solid rgba(239,68,68,0.35);
        }
        .lk-ctrl-cancel:hover{background:rgba(239,68,68,0.25)}
        .lk-ctrl-mic--on{
          background:rgba(34,211,238,0.12);color:${CYAN};
          border:1px solid rgba(34,211,238,0.35);
        }
        .lk-ctrl-mic--on:hover{background:rgba(34,211,238,0.22)}
        .lk-ctrl-mic--off{
          background:rgba(144,149,168,0.1);color:#9095A8;
          border:1px solid rgba(144,149,168,0.25);
        }

        .lk-error{
          margin:0;font-size:0.8125rem;color:#f87171;
          text-align:center;line-height:1.4;
          max-width:20rem;padding:0 0.5rem;
          animation:lk-up 200ms ease;
        }

        .lk-content{
          display:flex;flex-direction:column;align-items:center;
          gap:clamp(1rem,2.5vw,1.5rem);
          width:100%;
          max-width:100%;
          transition:opacity 300ms ease,transform 300ms ease;
        }
        .lk-content--hidden{
          opacity:0;transform:translateY(12px);pointer-events:none;
          visibility:hidden;height:0;max-height:0;margin:0;padding:0;
          overflow:hidden;gap:0;
        }
        .lk-inner--talking{
          gap:clamp(0.5rem,1.5vw,0.875rem);
        }
        .lk-inner--talking .lk-stats{
          margin-top:0;
        }

        .lk-heading{
          margin:0;
          width:100%;
          max-width:100%;
          font-size:clamp(1.75rem,7.5vw,3rem);
          font-weight:700;color:#fff;
          letter-spacing:-0.025em;line-height:1.2;
          display:flex;flex-direction:column;align-items:center;
          text-align:center;
        }
        .lk-heading-line{
          display:block;
          width:100%;
          max-width:100%;
          text-align:center;
          white-space:normal;
          overflow-wrap:break-word;
        }
        @media(min-width:640px){
          .lk-heading{ font-size:clamp(2.25rem,6vw,3.5rem); }
        }
        @media(min-width:1024px){
          .lk-heading{ font-size:clamp(4rem,5vw,4.5rem); }
          .lk-heading-line{
            display:inline-block;
            width:auto;
            max-width:none;
            white-space:nowrap;
          }
        }
        .lk-grad-simple{
          background:linear-gradient(90deg,#2dd4bf 0%,#38bdf8 45%,#6b7ff0 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .lk-grad-accessible{
          background:linear-gradient(90deg,#6b7ff0 0%,#8b7cf8 25%,#a78bfa 50%,#e879a8 75%,#f87171 100%);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;
        }
        .lk-desc{
          margin:0;font-size:clamp(0.9rem,2vw,1.0625rem);
          color:rgba(144,149,168,0.9);line-height:1.65;max-width:36rem;
          width:100%;
          text-align:center;
          padding:0 0.25rem;
        }
        .lk-actions{
          display:flex;flex-wrap:wrap;align-items:center;
          justify-content:center;gap:0.875rem;margin-top:0.5rem;
        }
        .lk-btn-primary{
          padding:0.75rem 2rem;border-radius:0.5rem;border:none;
          cursor:pointer;font-size:0.9375rem;font-weight:600;color:#fff;
          background:linear-gradient(135deg,#6B7FF0 0%,#4A5CE8 100%);
          box-shadow:0 4px 20px rgba(91,107,248,0.4);
          transition:opacity 180ms,transform 150ms;
        }
        .lk-btn-primary:hover{opacity:0.9;transform:translateY(-1px)}
        .lk-btn-secondary{
          padding:0.75rem 1.5rem;border-radius:0.5rem;
          border:1px solid rgba(255,255,255,0.15);
          background:rgba(255,255,255,0.05);cursor:pointer;
          font-size:0.9375rem;font-weight:500;color:rgba(255,255,255,0.8);
          display:inline-flex;align-items:center;gap:0.5rem;
          transition:border-color 180ms,background 180ms;
        }
        .lk-btn-secondary:hover{
          border-color:rgba(91,107,248,0.5);
          background:rgba(91,107,248,0.08);color:#fff;
        }

        @media(max-width:1023px){
          .lk-actions{flex-direction:column;width:100%}
          .lk-btn-primary,.lk-btn-secondary,.lk-btn-talk{
            width:100%;
            max-width:100%;
            justify-content:center;
            text-align:center;
          }
          .lk-cta-row{
            width:100%;
            flex-direction:column;
            align-items:stretch;
          }
          .lk-btn-talk-slider{
            max-width:100%;
          }
          .lk-btn-talk-line{
            white-space:normal;
          }
          .lk-stats{
            width:100%;
            gap:1.5rem;
          }
        }
        @media(max-width:480px){
          .lk-box-wrap{
            width:clamp(130px,58vw,180px);
            height:clamp(130px,58vw,180px);
          }
        }

        .lk-cta-block{
          display:flex;flex-direction:column;align-items:center;
          gap:0.5rem;width:100%;
        }
        .lk-cta-row{
          display:flex;flex-wrap:wrap;align-items:center;
          justify-content:center;gap:0.875rem;
          width:100%;
        }
        .lk-btn-talk{
          position:relative;
          display:inline-flex;align-items:center;justify-content:center;gap:0.5rem;
          padding:0.875rem clamp(1rem,4vw,1.5rem);
          border-radius:999px;
          font-size:clamp(0.8125rem,2vw,0.9375rem);
          font-weight:500;color:rgba(255,255,255,0.82);
          background:transparent;
          border:1px solid rgba(255,255,255,0.18);
          cursor:pointer;
          overflow:hidden;
          transition:border-color 220ms ease,background 220ms ease,transform 220ms ease,box-shadow 220ms ease;
          white-space:nowrap;
          min-height:2.75rem;
        }
        @media (hover:hover){
          .lk-btn-talk:hover{
            border-color:rgba(255,255,255,0.45);
            color:#fff;
            background:rgba(255,255,255,0.07);
            transform:translateY(-1px);
            box-shadow:0 6px 20px rgba(0,0,0,0.22);
          }
          .lk-btn-talk:hover .lk-btn-talk-track{transform:translateY(-50%)}
          .lk-btn-talk:hover .lk-btn-talk-icon{transform:scale(1.12)}
        }
        .lk-btn-talk:active{
          transform:scale(0.98);
          background:rgba(255,255,255,0.1);
        }
        .lk-btn-talk-icon{
          flex-shrink:0;
          transition:transform 280ms cubic-bezier(0.22,1,0.36,1);
        }
        .lk-btn-talk-slider{
          display:inline-block;
          height:1.3em;
          overflow:hidden;
          line-height:1.3;
          max-width:min(100%,14rem);
        }
        .lk-btn-talk-track{
          display:flex;
          flex-direction:column;
          transition:transform 320ms cubic-bezier(0.22,1,0.36,1);
        }
        .lk-btn-talk-line{
          display:block;
          white-space:nowrap;
          line-height:1.3;
        }
        .lk-sr-only{
          position:absolute;
          width:1px;height:1px;
          padding:0;margin:-1px;
          overflow:hidden;clip:rect(0,0,0,0);
          white-space:nowrap;border:0;
        }
        .lk-stats{
          display:flex;flex-wrap:wrap;align-items:center;
          justify-content:center;
          gap:clamp(1.5rem,6vw,4rem);
          width:100%;
          margin-top:clamp(0.25rem,1vw,0.75rem);
        }
        .lk-stat{display:flex;flex-direction:column;align-items:center;gap:0.25rem}
        .lk-stat-num{
          font-size:clamp(1.75rem,5vw,2.375rem);
          font-weight:800;color:#fff;line-height:1;
        }
        .lk-stat-label{
          font-size:clamp(0.8125rem,1.8vw,0.875rem);color:#9095A8;
        }

        /* ── Wake word training panel ── */
        .lk-train-panel {
          width: 100%;
          padding: 0 clamp(0.25rem, 2vw, 0.5rem);
        }
        .lk-train-form {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: clamp(0.625rem, 2.5vw, 0.875rem);
          width: 100%;
        }
        .lk-train-row {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          width: 100%;
        }
        @media (min-width: 480px) {
          .lk-train-row {
            flex-direction: row;
            align-items: stretch;
          }
          .lk-train-field--lang { flex: 0 0 38%; min-width: 7rem; }
          .lk-train-field--word { flex: 1 1 auto; min-width: 0; }
        }
        .lk-train-field {
          display: flex;
          min-width: 0;
        }
        .lk-train-select,
        .lk-train-input {
          width: 100%;
          min-height: 2.75rem;
          padding: 0.625rem 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.04);
          color: #fff;
          font-size: clamp(0.8125rem, 2vw, 0.9375rem);
          font-family: inherit;
          outline: none;
          transition: border-color 180ms ease, box-shadow 180ms ease;
        }
        .lk-train-select {
          appearance: none;
          padding-right: 2rem;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239095A8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          cursor: pointer;
        }
        .lk-train-select option {
          background: #161a34;
          color: #fff;
        }
        .lk-train-input::placeholder { color: rgba(144, 149, 168, 0.65); }
        .lk-train-select:focus,
        .lk-train-input:focus {
          border-color: rgba(91, 107, 248, 0.55);
          box-shadow: 0 0 0 3px rgba(91, 107, 248, 0.15);
        }
        .lk-train-btn {
          width: 100%;
          min-height: 2.75rem;
          padding: 0.75rem 1.25rem;
          border: none;
          border-radius: 0.5rem;
          font-size: clamp(0.875rem, 2vw, 0.9375rem);
          font-weight: 600;
          color: #fff;
          cursor: pointer;
          background: linear-gradient(135deg, #6B7FF0 0%, #4A5CE8 100%);
          box-shadow: 0 4px 18px rgba(91, 107, 248, 0.35);
          transition: opacity 180ms ease, transform 150ms ease, box-shadow 180ms ease;
        }
        .lk-train-btn:disabled {
          opacity: 0.38;
          cursor: not-allowed;
          box-shadow: none;
        }
        @media (hover: hover) {
          .lk-train-btn:not(:disabled):hover {
            opacity: 0.92;
            transform: translateY(-1px);
          }
        }
        .lk-wake-hint {
          margin: 0;
          text-align: center;
          font-size: clamp(0.9375rem, 2.5vw, 1.0625rem);
          font-weight: 500;
          line-height: 1.4;
          min-height: 1.4em;
        }
        .lk-wake-hey { color: ${MUTED}; }
        .lk-wake-word {
          display: inline-block;
          color: rgba(144, 149, 168, 0.55);
          animation: lk-word-swap 400ms ease;
        }
        @keyframes lk-word-swap {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .lk-train-record {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.75rem, 3vw, 1rem);
          width: 100%;
          padding: clamp(0.25rem, 2vw, 0.5rem) 0;
        }
        .lk-train-record-label {
          margin: 0;
          font-size: clamp(0.8125rem, 2vw, 0.9375rem);
          color: ${MUTED};
          text-align: center;
          line-height: 1.5;
          max-width: 18rem;
        }
        .lk-train-heard {
          margin: 0;
          font-size: clamp(0.75rem, 1.8vw, 0.875rem);
          color: ${CYAN};
          text-align: center;
          line-height: 1.4;
          max-width: 20rem;
          font-style: italic;
        }
        .lk-train-mic-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(3.75rem, 16vw, 4.75rem);
          height: clamp(3.75rem, 16vw, 4.75rem);
          border-radius: 50%;
          border: 2px solid ${ACCENT};
          background: rgba(91, 107, 248, 0.1);
          color: ${ACCENT};
          cursor: pointer;
          animation: lk-mic-pulse 1.8s ease-in-out infinite;
          transition: background 180ms ease, color 180ms ease;
        }
        @keyframes lk-mic-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(91, 107, 248, 0.35);
          }
          50% {
            transform: scale(1.08);
            box-shadow: 0 0 0 14px rgba(91, 107, 248, 0);
          }
        }
        .lk-train-mic-btn--active {
          pointer-events: none;
          color: #fff;
          background: rgba(91, 107, 248, 0.25);
        }
        @media (hover: hover) {
          .lk-train-mic-btn:hover {
            background: rgba(91, 107, 248, 0.2);
            color: #fff;
          }
        }
        .lk-train-error {
          margin: 0;
          font-size: 0.8125rem;
          color: #f87171;
          text-align: center;
        }
        .lk-train-back {
          margin-top: 0;
          padding: 0.25rem 0.75rem;
          border: none;
          background: none;
          color: ${MUTED};
          font-size: 0.8125rem;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        @media (hover: hover) {
          .lk-train-back:hover { color: #fff; }
        }
        .lk-train-progress {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: clamp(0.5rem, 2vw, 0.75rem) 0;
        }
        .lk-train-progress-text {
          margin: 0;
          font-size: clamp(0.875rem, 2.2vw, 1rem);
          color: rgba(255, 255, 255, 0.88);
          text-align: center;
        }
        .lk-train-progress-time {
          color: ${CYAN};
          font-weight: 600;
          font-variant-numeric: tabular-nums;
        }
        .lk-train-progress-bar {
          width: 100%;
          max-width: 16rem;
          height: 4px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
        }
        .lk-train-progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, ${ACCENT}, ${CYAN});
          transition: width 80ms linear;
        }
        .lk-train-done {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: clamp(0.375rem, 1.5vw, 0.5rem);
          width: 100%;
          padding: clamp(0.125rem, 0.75vw, 0.25rem) 0 0;
          animation: lk-up 300ms ease;
        }
        .lk-train-done-text {
          margin: 0;
          font-size: clamp(0.875rem, 2.2vw, 1rem);
          font-weight: 500;
          color: #fff;
          text-align: center;
          line-height: 1.55;
        }
        .lk-train-done-time {
          color: ${CYAN};
          font-weight: 600;
        }
        .lk-train-yes {
          font-size: clamp(1.5rem, 5vw, 2rem);
          font-weight: 800;
          color: ${CYAN};
        }
        .lk-train-question {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.875rem;
          width: 100%;
        }
        .lk-train-yn {
          display: flex;
          gap: 0.75rem;
          width: 100%;
          max-width: 16rem;
        }
        .lk-train-btn--voice,
        .lk-train-btn--chat {
          flex: 1;
          min-height: 2.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }
        .lk-train-btn--chat {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: none;
        }
        .lk-train-chat {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          gap: 0.75rem;
          width: 100%;
        }
        .lk-train-chat-input {
          width: 100%;
          min-height: 5rem;
          padding: 0.75rem 0.875rem;
          border-radius: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.04);
          color: #fff;
          font-size: clamp(0.8125rem, 2vw, 0.9375rem);
          font-family: inherit;
          resize: vertical;
          outline: none;
        }
        .lk-train-chat-input::placeholder { color: rgba(144, 149, 168, 0.65); }
        .lk-train-chat-input:focus {
          border-color: rgba(91, 107, 248, 0.55);
          box-shadow: 0 0 0 3px rgba(91, 107, 248, 0.15);
        }

        @media (prefers-reduced-motion: reduce){
          .lk-content,.lk-btn-primary,.lk-btn-secondary,.lk-btn-talk-track,.lk-btn-talk-icon{transition:none}
          .lk-btn-talk:hover .lk-btn-talk-track{transform:none}
          .lk-btn-talk:hover{transform:none}
          .lk-train-mic-btn,.lk-wake-word,.lk-talking-ui,.lk-train-done{animation:none}
        }
      `}</style>
    </section>
  );
}
