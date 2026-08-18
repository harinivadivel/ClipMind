"""
Keyword Extraction Service.
Extracts the most frequent meaningful words from a transcript
using NLTK stopwords and frequency counting.
"""

import os
import re
import logging
from collections import Counter

import nltk
from nltk.corpus import stopwords

logger = logging.getLogger(__name__)


# ----------------------------------------------------------------
# NLTK stopwords bootstrapping
#
# Render's build command downloads the stopwords corpus into
# /opt/render/nltk_data (e.g. `pip install -r requirements.txt &&
# python -m nltk.downloader -d /opt/render/nltk_data stopwords`).
# As a safety net we add that path to NLTK and download the corpus
# on demand, so a missing dataset can never crash app startup.
# Override the location with NLTK_DATA for other environments.
# ----------------------------------------------------------------

NLTK_DATA_PATH = os.getenv("NLTK_DATA", "/opt/render/nltk_data")

if NLTK_DATA_PATH not in nltk.data.path:
    nltk.data.path.append(NLTK_DATA_PATH)

try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    logger.info(
        "NLTK stopwords not found; downloading to %s",
        NLTK_DATA_PATH,
    )
    os.makedirs(NLTK_DATA_PATH, exist_ok=True)
    nltk.download("stopwords", download_dir=NLTK_DATA_PATH, quiet=True)


class KeywordService:
    """
    Extract exact keywords from transcript text.
    Returns words exactly as they appear (lowercased for counting
    but preserving the original form from the transcript).
    """

    def __init__(self):
        try:
            self.stop_words = set(stopwords.words("english"))
        except LookupError:
            # Last-resort fallback: never let a missing corpus stop the backend.
            logger.warning(
                "NLTK stopwords unavailable; keyword filtering disabled"
            )
            self.stop_words = set()

    def extract_keywords(self, transcript: str, top_n: int = 20) -> list[dict]:
        """
        Extract exact keywords from transcript.

        Args:
            transcript: Raw transcript text.
            top_n: Number of top keywords to return (default 20).

        Returns:
            List of dicts with keys: keyword, count.
        """
        if not transcript or not transcript.strip():
            return []

        # Remove punctuation
        text = re.sub(r"[^\w\s]", "", transcript)

        # Split into words
        words = text.split()

        keywords = []

        for word in words:
            w = word.lower()

            if (
                len(w) < 3
                or w.isdigit()
                or w in self.stop_words
            ):
                continue

            keywords.append(w)

        counts = Counter(keywords)

        return [
            {
                "keyword": word,
                "count": count,
            }
            for word, count in counts.most_common(top_n)
        ]