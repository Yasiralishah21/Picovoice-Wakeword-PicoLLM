/**
 * Ollama LLM — calls local TinyLlama via Ollama API.
 */
async function getResponse(prompt) {
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "tinyllama",
      prompt: prompt,
      stream: false,
    }),
  });

  if (!res.ok) {
    throw new Error(`Ollama returned status ${res.status}`);
  }

  const data = await res.json();
  return data.response;
}

module.exports = { getResponse };
