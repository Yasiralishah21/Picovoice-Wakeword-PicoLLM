from flask import Flask, request, jsonify
from faster_whisper import WhisperModel

app = Flask(__name__)

model = WhisperModel("base", compute_type="int8")

@app.route("/transcribe", methods=["POST"])
def transcribe():
    audio_path = request.json["path"]

    segments, info = model.transcribe(audio_path)

    text = ""
    for segment in segments:
        text += segment.text

    return jsonify({
        "text": text.strip()
    })

if __name__ == "__main__":
    app.run(port=6001)