from textblob import TextBlob

BIAS_KEYWORDS = [
    "shocking",
    "unbelievable",
    "outrageous",
    "incredible",
    "unprecedented",
    "unthinkable",
    "unacceptable",
    "unforgivable",
    "secret",
    "exposed",
    "scandal",
    "fake",
    "conspiracy",
    "breaking",
    "controversial",
    "exclusive",
]

def analyze_bias(text):
    blob = TextBlob(text)

    # sentiment polarity (-1 to 1)
    polarity = blob.sentiment.polarity
    # subjectivity (0 to 1)
    subjectivity = blob.sentiment.subjectivity

    # count bias keywords
    bias_count = sum(word.lower() in text.lower() for word in BIAS_KEYWORDS)

    # simple bias score combing subjectivity and bias keywords
    bias_score = subjectivity * 50 + bias_count * 10 # scale subjectivity 

    return {
        "polarity": polarity,
        "subjectivity": subjectivity,
        "bias_count": bias_count,
        "bias_score": min(bias_score, 100)
    }