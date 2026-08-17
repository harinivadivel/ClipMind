"""
Generate summaries using the SummaryService.
"""

from app.services.summary_service import SummaryService


def generate_summaries():
    """
    Generate short and detailed summaries from sample text.
    """

    sample_transcript = """
    Artificial intelligence is transforming the way we work and live. From healthcare to finance,
    AI technologies are being deployed to solve complex problems and improve efficiency. Machine
    learning algorithms can now analyze vast amounts of data in seconds, identifying patterns
    that would take humans weeks or months to discover. Natural language processing has enabled
    chatbots and virtual assistants that can understand and respond to human queries with
    remarkable accuracy. Computer vision systems can recognize objects, faces, and even emotions
    from images and videos. The impact of AI extends beyond technology sectors, influencing
    fields like education, transportation, and entertainment. As AI continues to evolve, it
    promises to bring even more revolutionary changes to our world, making processes smarter,
    faster, and more accessible to everyone. Deep learning, a subset of machine learning, has
    revolutionized AI by enabling computers to learn from vast amounts of data. Today, AI powers
    everything from recommendation systems to autonomous vehicles, and continues to advance at
    a rapid pace. The future of AI holds tremendous potential for solving some of humanity's
    greatest challenges, from climate change to disease prevention.
    """

    print("=" * 70)
    print("GENERATING SUMMARIES")
    print("=" * 70)

    print(f"\nOriginal text length: {len(sample_transcript.split())} words\n")

    service = SummaryService()

    try:
        summaries = service.generate_all_summaries(sample_transcript)

        print("-" * 70)
        print("SHORT SUMMARY")
        print("-" * 70)
        print(summaries["short_summary"])
        print(
            f"\nLength: {len(summaries['short_summary'].split())} words"
        )

        print()

        print("-" * 70)
        print("DETAILED SUMMARY")
        print("-" * 70)
        print(summaries["detailed_summary"])
        print(
            f"\nLength: {len(summaries['detailed_summary'].split())} words"
        )

    except Exception as e:
        print(f"\nSummary generation failed:\n{e}")

    print("\n" + "=" * 70)
    print("SUMMARY GENERATION COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    generate_summaries()