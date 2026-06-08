const { Porcupine, BuiltinKeyword } = require("@picovoice/porcupine-node");

let porcupine;

function initWakeWord(accessKey) {
  porcupine = new Porcupine(
    accessKey,
    [BuiltinKeyword.PORCUPINE], // later we replace with custom
    [0.6]
  );

  return porcupine;
}

function detectWakeWord(audioFrame) {
  return porcupine.process(audioFrame);
}

function releaseWakeWord() {
  porcupine.release();
}

module.exports = {
  initWakeWord,
  detectWakeWord,
  releaseWakeWord
};