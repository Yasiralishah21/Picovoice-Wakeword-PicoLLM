/**
 * Wakeword mock — replace with real Porcupine/custom model later.
 * Returns true when the transcript contains the target word (case-insensitive).
 */
function detectWakeWord(transcript, targetWord) {
  const heard = (transcript || "").toLowerCase().replace(/[^\w\s']/g, "").trim();
  const target = (targetWord || "").toLowerCase().replace(/[^\w\s']/g, "").trim();
  if (!heard || !target) return false;
  return heard.includes(target);
}

module.exports = { detectWakeWord };
