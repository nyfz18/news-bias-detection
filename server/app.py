from flask import Flask, request, jsonify
from flask_cors import CORS
from nlp.bias_analysis import analyze_bias
from nlp.summarizer import summarize_text

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "No text provided"}), 400

    text = data.get("text", "").strip()
    media_outlet_input = data.get("media_outlet", "").strip()

    analysis = analyze_bias(text, media_outlet_input)
    summary = summarize_text(text)

    return jsonify({
        "text": text,
        "analysis": { **analysis, "summary": summary }
    })

if __name__ == '__main__':
    app.run(debug=True)
