const express = require("express");
const cors = require("cors");
const { getResponse } = require("./picollm");
const { transcribe } = require("./whisper");

const app = express();

app.use(cors());
app.use(express.json());

let isListening = false;

// POST /voice-status — wakeword + recording session events
app.post("/voice-status", (req, res) => {
  const { recording, wakeword, language } = req.body || {};

  if (recording === true) {
    console.log("🎤 Session started");
    isListening = true;
    return res.json({ success: true, status: "listening" });
  }

  if (wakeword) {
    console.log("🧠 Wakeword detected:", wakeword, language ? `(${language})` : "");
    return res.json({ success: true, status: "wakeword_detected", wakeword });
  }

  if (recording === false) {
    console.log("⏹ Session ended");
    isListening = false;
    return res.json({ success: true, status: "stopped" });
  }

  res.json({ success: false, error: "Unknown voice-status payload" });
});

// POST /transcribe — speech-to-text (mock: passthrough browser STT text)
app.post("/transcribe", async (req, res) => {
  const { text } = req.body || {};

  console.log("🎧 Transcribing speech...");
  const transcript = await transcribe(text);
  console.log("📝 Transcript:", transcript);

  res.json({ success: true, text: transcript });
});

// POST /ask-ai — receive question text, return AI answer
app.post("/ask-ai", async (req, res) => {
  const { text } = req.body || {};

  if (!text || !String(text).trim()) {
    return res.status(400).json({ success: false, error: "Missing text" });
  }

  console.log("📩 Question:", text);

  const response = await getResponse(text);

  console.log("🤖 Answer:", response);

  res.json({ success: true, text, response });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, listening: isListening });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
