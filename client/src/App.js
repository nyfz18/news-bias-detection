import { useState } from 'react';
import "./App.css";

function App() {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const [analyzed, setAnalyzed] = useState(false);

  const resetAnalysis = () => {
    setText('');
    setResult(null);
    setAnalyzed(false);
  };

  function highlightBiasKeywords(text, keywords) {
    if (!keywords || keywords.length === 0) return text;

    // Escape regex special chars in keywords
    const escapedKeywords = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

    const pattern = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');

    // Split text by keywords, keep keywords in the array
    const parts = text.split(pattern);

    return parts.map((part, i) => 
      escapedKeywords.some(k => k.toLowerCase() === part.toLowerCase()) ? (
        <mark key={i} style={{ backgroundColor: '#ffea00' }}>{part}</mark>
      ) : (
        part
      )
    );
  }

  const analyzeText = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);
    setAnalyzed(false);

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
      setAnalyzed(true);
    } catch (error) {
      console.error("Error during analysis:", error);
      setResult("Error analyzing text");
      setAnalyzed(false);
    }

    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>U.S. News Bias Analyzer</h1>
      
      {!analyzed ? (
        <textarea
          placeholder="Paste your news text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          style={{ width: '100%', fontSize: '16px' }}
        />
      ) : (
        <div className="highlighted-text" style={{ whiteSpace: 'pre-wrap', fontSize: '16px', border: '1px solid #ccc', padding: '10px', minHeight: '150px' }}>
          {highlightBiasKeywords(text, result.bias_keywords)}
        </div>
      )}

    <div style={{ marginTop: '10px' }}>
      <button onClick={analyzeText} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      {analyzed && (
        <button onClick={resetAnalysis} style={{ marginLeft: '10px' }}>
          Reset
        </button>
      )}
    </div>

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