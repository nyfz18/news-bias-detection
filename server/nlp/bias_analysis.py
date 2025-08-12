from textblob import TextBlob

# can add more or connec to a database for more keywords
BIAS_KEYWORDS = [
    "shocking", "unbelievable", "outrageous",
    "incredible", "unprecedented", "unthinkable",
    "unacceptable", "unforgivable", "secret",
    "exposed", "scandal", "fake",
    "conspiracy", "breaking", "controversial",
    "exclusive",
]

# can add more or connect to a database for more media outlets
# this is a sample mapping of media outlets to their political standings
NEWS_MEDIA_STANDINGS = { 
    "New York Times" : "Left-leaning",
    "Fox News" : "Right-leaning",
    "CNN" : "Left-leaning",
    "BBC" : "Center",
    "Al Jazeera" : "Left-leaning",
    "The Guardian" : "Left-leaning",
    "The Wall Street Journal" : "Right-leaning",
    "MSNBC" : "Left-leaning",
    "ABC News" : "Center",
    "CBS News" : "Center",
    "Reuters" : "Center",
    "Bloomberg" : "Center",
    "HuffPost" : "Left-leaning",
    "The Washington Post" : "Left-leaning",
    "The Daily Mail" : "Right-leaning",
    "Boston Globe" : "Left-leaning",
    "Los Angeles Times" : "Left-leaning",
}

# Function to analyze bias in a given text
def analyze_bias(text, media_outlet_input):
    # sentiment analysis
    blob = TextBlob(text)
    polarity = blob.sentiment.polarity
    subjectivity = blob.sentiment.subjectivity

    # Normalize media outlet input
    normalized_input = media_outlet_input.strip().lower()

    # More forgiving matching
    political_standing = "Unknown"
    for key in NEWS_MEDIA_STANDINGS:
        if key.lower() == normalized_input or normalized_input in key.lower():
            political_standing = NEWS_MEDIA_STANDINGS[key]
            break

    # keyword bias detection
    found_keywords = [word for word in BIAS_KEYWORDS if word.lower() in text.lower()]
    keyword_count = len(found_keywords)

    bias_score = min(100, keyword_count * 20 + subjectivity * 50)

    return {
        "polarity": polarity,
        "subjectivity": subjectivity,
        "bias_keywords": found_keywords,
        "bias_count": keyword_count,
        "bias_score": round(bias_score, 2),
        "political_standing": political_standing
    }