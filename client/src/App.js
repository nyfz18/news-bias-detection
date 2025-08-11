import { useState } from 'react';
import "./App.css";

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      setResult(data.analysis);
    } catch (error) {
      console.error("Error during analysis:", error);
      setResult("Error analyzing text");
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>News Bias Analyzer</h1>
      <textarea
        placeholder="Paste your news text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={analyzeText} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      {result && typeof result.polarity === "number" && typeof result.subjectivity === "number" && (
        <div className="result">
          <h2>Analysis Result:</h2>
          <p><strong>Polarity:</strong> {result.polarity.toFixed(2)}</p>
          <p><strong>Subjectivity:</strong> {result.subjectivity.toFixed(2)}</p>
          <p><strong>Bias Keywords Found:</strong> {result.bias_count}</p>
          <p><strong>Bias Score:</strong> {result.bias_score}</p>
        </div>
      )}
    </div>
  );
}

export default App;