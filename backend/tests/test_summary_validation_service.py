"""
Unit tests for SummaryValidationService.

Run from the backend directory:

    python -m unittest tests.test_summary_validation_service -v
"""

import os
import sys
import unittest

# Make the ``app`` package importable when running from anywhere.
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.schemas.summary_validation import SummaryValidationResponse
from app.services.summary_validation_service import SummaryValidationService


class FakeSummary:
    """Minimal stand-in for the Summary model (no database required)."""

    def __init__(self, detailed="", short="", bullet_points=None):
        self.detailed_summary = detailed
        self.short_summary = short
        self.bullet_points = bullet_points or []


TRANSCRIPT = (
    "Machine learning is a field of artificial intelligence that uses "
    "statistical techniques to give computer systems the ability to learn "
    "from data. Neural networks are a popular family of models that are "
    "loosely inspired by the human brain. Deep learning is a subset of "
    "machine learning that works with many layered neural networks. "
    "Training such models requires large datasets and significant compute."
)

DETAILED_SUMMARY = (
    "Machine learning lets systems learn from data using statistical "
    "techniques. Neural networks are a family of models inspired by the "
    "human brain, and deep learning uses many layered networks."
)


class SummaryValidationServiceTest(unittest.TestCase):

    def _report(self, **kwargs):
        return SummaryValidationService.validate(
            FakeSummary(
                detailed=kwargs.get("detailed", DETAILED_SUMMARY),
                short=kwargs.get(
                    "short",
                    "Machine learning lets systems learn from data using "
                    "neural networks and deep learning.",
                ),
                bullet_points=kwargs.get(
                    "bullet_points",
                    [
                        "Machine learning is part of AI",
                        "Neural networks learn from data",
                        "Deep learning uses layered networks",
                    ],
                ),
            ),
            transcript_text=kwargs.get("transcript", TRANSCRIPT),
        )

    def test_valid_summary_report(self):
        report = self._report()

        self.assertTrue(report["valid"])
        self.assertFalse(report["flags"]["is_empty"])
        self.assertGreater(report["metrics"]["summary_words"], 20)
        self.assertGreater(report["metrics"]["transcript_words"], 40)
        self.assertGreaterEqual(report["metrics"]["compression_ratio"], 40)
        self.assertGreaterEqual(report["quality_score"], 60)
        self.assertIn(report["rating"], ["Excellent", "Good", "Fair"])

    def test_report_validates_against_schema(self):
        report = self._report()
        response = SummaryValidationResponse(**report)
        self.assertEqual(response.valid, report["valid"])
        self.assertEqual(response.quality_score, report["quality_score"])
        self.assertEqual(
            response.metrics.summary_words, report["metrics"]["summary_words"]
        )

    # ----------------------------------------------------------
    # Empty / missing content
    # ----------------------------------------------------------

    def test_empty_summary_is_invalid(self):
        report = self._report(detailed="", short="", bullet_points=[])

        self.assertFalse(report["valid"])
        self.assertTrue(report["flags"]["is_empty"])
        self.assertEqual(report["quality_score"], 0)
        self.assertEqual(report["rating"], "No Summary")

    def test_missing_transcript_degrades_gracefully(self):
        report = self._report(transcript=None)

        self.assertTrue(report["valid"])
        self.assertEqual(report["metrics"]["transcript_words"], 0)
        self.assertEqual(report["metrics"]["compression_ratio"], 0.0)
        self.assertEqual(report["metrics"]["content_coverage"], 0.0)
        # Coverage metrics become neutral, so the summary is not trashed.
        self.assertGreaterEqual(report["quality_score"], 40)

    # ----------------------------------------------------------
    # Flags
    # ----------------------------------------------------------

    def test_too_short_summary_flagged(self):
        report = self._report(detailed="Too short.", bullet_points=[])

        self.assertTrue(report["flags"]["too_short"])
        self.assertLess(report["metrics"]["summary_words"], 20)

    def test_overlong_summary_flagged(self):
        # Summary barely compresses the transcript.
        report = self._report(detailed=TRANSCRIPT, bullet_points=[])

        self.assertTrue(report["flags"]["overlong"])
        self.assertTrue(report["flags"]["poor_compression"])
        self.assertLess(report["metrics"]["compression_ratio"], 40)

    def test_high_uppercase_flagged(self):
        report = self._report(
            detailed="THIS IS A SUMMARY IN ALL CAPITALS FOR TESTING.",
            bullet_points=[],
        )

        self.assertTrue(report["flags"]["high_uppercase"])

    def test_no_bullet_points_flagged(self):
        report = self._report(bullet_points=[])

        self.assertTrue(report["flags"]["no_bullet_points"])

    # ----------------------------------------------------------
    # Score bounds
    # ----------------------------------------------------------

    def test_quality_score_within_bounds(self):
        for kwargs in [
            {},
            {"detailed": ""},
            {"detailed": "x", "transcript": None},
            {"detailed": TRANSCRIPT},
        ]:
            report = self._report(**kwargs)
            self.assertGreaterEqual(report["quality_score"], 0)
            self.assertLessEqual(report["quality_score"], 100)


if __name__ == "__main__":
    unittest.main()