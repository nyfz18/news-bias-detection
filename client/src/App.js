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
          
          <p>
            <strong className="tooltip">
              Polarity:
              <span className="tooltiptext">
                Polarity indicates the sentiment from negative (-1) to positive (+1).
              </span>
            </strong> {result.polarity.toFixed(2)}
          </p>
  
          <p>
            <strong className="tooltip">
              Subjectivity:
              <span className="tooltiptext">
                Subjectivity measures how subjective (1) or objective (0) the text is.
              </span>
            </strong> {result.subjectivity.toFixed(2)}
          </p>

          <p>
            <strong className="tooltip">
              Bias Keywords Found:
              <span className="tooltiptext">
                Number of biased words detected in the text.
              </span>
            </strong> {result.bias_count}
          </p>

          <p>
            <strong className="tooltip">
              Bias Score:
              <span className="tooltiptext">
                Overall bias level calculated from keyword frequency and text subjectivity.
              </span>
            </strong> {result.bias_score}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;