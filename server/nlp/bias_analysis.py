from textblob import TextBlob

BIAS_KEYWORDS = [
    "shocking", "unbelievable", "outrageous",
    "incredible", "unprecedented", "unthinkable",
    "unacceptable", "unforgivable", "secret",
    "exposed", "scandal", "fake",
    "conspiracy", "breaking", "controversial",
    "exclusive",
]

def analyze_bias(text):
    # sentiment analysis
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity

    # keyword bias detection
    found_keywords = [word for word in BIAS_KEYWORDS if word.lower() in text.lower()]
    keyword_count = len(found_keywords)

    bias_score = min(100, keyword_count * 20 + subjectivity * 50)

    return {
        "polarity": polarity,
        "subjectivity": subjectivity,
        "bias_keywords": found_keywords,
        "bias_count": keyword_count,
        "bias_score": round(bias_score, 2)
    }