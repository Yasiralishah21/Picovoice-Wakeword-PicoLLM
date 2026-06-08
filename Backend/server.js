const express = require("express");
const cors = require("cors");
const { transcribe } = require("./whisper");

const app = express();

app.use(cors());
app.use(express.json());

let isListening = false;

async function askOllama(prompt) {
  console.log("Sending to Ollama...");

  const ollamaRes = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "tinyllama",
      prompt: prompt,
      stream: false,
    }),
  });

  if (!ollamaRes.ok) {
    throw new Error(`Ollama returned status ${ollamaRes.status}`);
  }

  const data = await ollamaRes.json();
  console.log("AI Response received:", data.response);
  return data.response;
}

// POST /voice-status — session events + AI queries via Ollama
app.post("/voice-status", async (req, res) => {
  const { recording, wakeword, language, audio } = req.body || {};

  if (audio && String(audio).trim()) {
    const text = String(audio).trim();
    console.log("Received text:", text);

    try {
      const response = await askOllama(text);
      return res.json({ response });
    } catch (err) {
      console.error("Ollama error:", err.message);
      return res.status(500).json({
        response: "Sorry, I could not reach Ollama. Make sure it is running with the tinyllama model.",
      });
    }
  }

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

// POST /transcribe — speech-to-text passthrough
app.post("/transcribe", async (req, res) => {
  const { text } = req.body || {};

  console.log("🎧 Transcribing speech...");
  const transcript = await transcribe(text);
  console.log("📝 Transcript:", transcript);

  res.json({ success: true, text: transcript });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, listening: isListening });
});

app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
