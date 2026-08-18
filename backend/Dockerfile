# ============================================================================
# ClipMind AI — Backend image
#
# Base:   Python 3.11 slim (matches backend/runtime.txt -> 3.11.13)
# Adds:   FFmpeg/FFprobe via apt (detected on PATH by
#         app/services/ffmpeg_service.py -> shutil.which("ffmpeg"))
#         CPU-only PyTorch (avoids pulling ~3 GB of CUDA libraries)
# ============================================================================
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# System packages:
#   ffmpeg          -> audio extraction + thumbnails (provides ffmpeg AND ffprobe on PATH)
#   build-essential -> compilers needed if any dependency ships an sdist instead of a wheel
#   curl            -> used by the container HEALTHCHECK below
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ffmpeg \
        build-essential \
        curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# ---------------------------------------------------------------------------
# Python dependencies
#
# requirements.txt pins `torch==2.5.0` (the CUDA build from PyPI). For a
# CPU-only backend container we install the matching CPU wheel instead so the
# image stays ~5 GB smaller. The sed rewrite makes pip resolve the exact
# `torch==2.5.0+cpu` wheel from the PyTorch CPU index.
# ---------------------------------------------------------------------------
COPY requirements.txt .
RUN sed -i 's/^torch==2.5.0$/torch==2.5.0+cpu/' requirements.txt \
    && pip install --no-cache-dir \
        --extra-index-url https://download.pytorch.org/whl/cpu \
        -r requirements.txt

# Application code
COPY app ./app

# Writable runtime directories (mounted as named volumes in docker-compose.yml)
RUN mkdir -p /app/app/uploads /app/audio /app/thumbnails /app/nltk_data

# Container healthcheck (hits the FastAPI /health endpoint)
HEALTHCHECK --interval=30s --timeout=5s --start-period=90s --retries=5 \
    CMD curl -fsS http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
