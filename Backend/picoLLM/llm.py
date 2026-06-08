from flask import Flask, request, jsonify

app = Flask(__name__)

def get_response(text):
    text = text.lower()

    if "capital of france" in text:
        return "The capital of France is Paris."
    elif "hello" in text:
        return "Hello! How can I help you?"
    else:
        return "I am your offline AI. I don't know that yet."

@app.route("/generate", methods=["POST"])
def generate():
    text = request.json["text"]

    return jsonify({
        "response": get_response(text)
    })

if __name__ == "__main__":
    app.run(port=6002)