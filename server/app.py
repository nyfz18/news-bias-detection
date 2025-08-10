from flask import Flask, request, jsonify
from nlp.bias_analysis import analyze_bias

app = Flask(__name__)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.get_json()
    if not data or "text" not in data: 
        return jsonify({"error": "No text provided"}), 400
    
    text = data["text"]
    analysis = analyze_bias(text)

    return jsonify({
        "text": text,
        "analysis": analysis
    })

if __name__ == '__main__':
    app.run(debug=True)
# Run this file to start the Flask server
