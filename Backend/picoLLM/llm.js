function askLLM(prompt) {
  // offline fake brain (replace with real PicoLLM later)
  
  if (prompt.toLowerCase().includes("capital of france")) {
    return "The capital of France is Paris.";
  }

  if (prompt.toLowerCase().includes("hello")) {
    return "Hello! How can I help you?";
  }

  return "I am an offline model. I am still learning.";
}

module.exports = { askLLM };