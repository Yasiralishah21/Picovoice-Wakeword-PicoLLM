/**
 * Speech-to-text mock — replace with real Whisper later.
 * For now: browser mic captures audio, STT runs in the browser,
 * and this module receives the text (passthrough) on the server.
 */
async function transcribe(input) {
  if (typeof input === "string" && input.trim()) {
    return input.trim();
  }
  return "what is the capital of france";
}

module.exports = { transcribe };