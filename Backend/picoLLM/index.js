/**
 * Simple offline AI stub — replace with real PicoLLM later.
 */
async function getResponse(text) {
  const q = (text || "").toLowerCase().trim();

  if (!q) {
    return "I didn't catch a question. Please try again.";
  }

  if (q.includes("capital of france")) {
    return "Paris.";
  }

  if (q.includes("hello") || q.includes("hi")) {
    return "Hello! How can I help you?";
  }

  if (q.includes("your name") || q.includes("who are you")) {
    return "I am a simple offline AI assistant built with Techelix.";
  }

  return "I am a simple offline AI and I don't know that yet.";
}

module.exports = { getResponse };
