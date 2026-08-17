
"""
FFmpeg service: video processing using FFmpeg.

Works on:
- Windows local development using backend/ffmpeg/bin/ffmpeg.exe
- Linux/Render using FFmpeg installed in the system PATH
"""

import json
import os
import shutil
import imageio_ffmpeg
import subprocess
from pathlib import Path


# ============================================================
# Directories
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

UPLOADS = BASE_DIR / "app" / "uploads"
AUDIO = BASE_DIR / "audio"
THUMBNAILS = BASE_DIR / "thumbnails"

AUDIO.mkdir(parents=True, exist_ok=True)
THUMBNAILS.mkdir(parents=True, exist_ok=True)


# ============================================================
# FFmpeg path detection
# ============================================================

def find_ffmpeg() -> str:
    """
    Find FFmpeg executable.

    Priority:
    1. FFMPEG_PATH environment variable
    2. System PATH
    3. imageio-ffmpeg bundled executable
    4. Local Windows binary
    """

    # 1. Environment variable
    env_path = os.getenv("FFMPEG_PATH")

    if env_path and Path(env_path).exists():
        return env_path

    # 2. System PATH
    system_ffmpeg = shutil.which("ffmpeg")

    if system_ffmpeg:
        return system_ffmpeg

    # 3. imageio-ffmpeg
    try:
        bundled_ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

        if bundled_ffmpeg and Path(bundled_ffmpeg).exists():
            return bundled_ffmpeg

    except Exception:
        pass

    # 4. Windows local binary
    local_ffmpeg = BASE_DIR / "ffmpeg" / "bin" / "ffmpeg.exe"

    if local_ffmpeg.exists():
        return str(local_ffmpeg)

    raise FileNotFoundError(
        "FFmpeg not found. Install FFmpeg or add imageio-ffmpeg "
        "to the Python dependencies."
    )

def find_ffprobe() -> str:
    """
    Find FFprobe executable.

    Priority:
    1. FFPROBE_PATH environment variable
    2. System PATH
    3. imageio-ffmpeg executable
    4. Local Windows binary
    """

    # 1. Environment variable
    env_path = os.getenv("FFPROBE_PATH")

    if env_path and Path(env_path).exists():
        return env_path

    # 2. System PATH
    system_ffprobe = shutil.which("ffprobe")

    if system_ffprobe:
        return system_ffprobe

    # 3. imageio-ffmpeg
    try:
        bundled_ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()

        if bundled_ffmpeg and Path(bundled_ffmpeg).exists():
            return bundled_ffmpeg

    except Exception:
        pass

    # 4. Windows local binary
    local_ffprobe = BASE_DIR / "ffmpeg" / "bin" / "ffprobe.exe"

    if local_ffprobe.exists():
        return str(local_ffprobe)

    raise FileNotFoundError(
        "FFprobe not found. Install FFmpeg or add a valid FFPROBE_PATH."
    )


# Resolve paths when the module loads
FFMPEG = find_ffmpeg()
FFPROBE = find_ffprobe()


# ============================================================
# FFmpeg Service
# ============================================================

class FFmpegService:

    def __init__(self):
        """Instantiate FFmpegService and verify FFmpeg availability."""
        self.check_ffmpeg()

    # ========================================================
    # Check FFmpeg
    # ========================================================

    @staticmethod
    def check_ffmpeg():
        """Verify that FFmpeg and FFprobe are available."""

        global FFMPEG, FFPROBE

        # Re-detect in case environment changed
        if not FFMPEG or not Path(FFMPEG).exists():
            FFMPEG = find_ffmpeg()

        if not FFPROBE or not Path(FFPROBE).exists():
            FFPROBE = find_ffprobe()

        return True

    # ========================================================
    # Check availability without raising an exception
    # ========================================================

    @staticmethod
    def is_ffmpeg_available() -> bool:
        """
        Check whether FFmpeg and FFprobe are available.

        Returns:
            True if both are available, otherwise False.
        """

        try:
            FFmpegService.check_ffmpeg()
            return True
        except FileNotFoundError:
            return False

    # ========================================================
    # Extract audio
    # ========================================================

    @staticmethod
    def extract_audio(
        video_path: str,
        output_dir: str = None
    ) -> str:
        """
        Extract audio from a video as 16kHz mono WAV.

        Args:
            video_path: Path to video file.
            output_dir: Optional output directory.

        Returns:
            Path to extracted WAV file.
        """

        FFmpegService.check_ffmpeg()

        dest = Path(output_dir) if output_dir else AUDIO
        dest.mkdir(parents=True, exist_ok=True)

        audio_path = dest / (Path(video_path).stem + ".wav")

        cmd = [
            FFMPEG,
            "-y",
            "-i",
            str(video_path),
            "-vn",
            "-acodec",
            "pcm_s16le",
            "-ar",
            "16000",
            "-ac",
            "1",
            str(audio_path),
        ]

        subprocess.run(
            cmd,
            check=True,
        )

        return str(audio_path)

    # ========================================================
    # Extract audio to specific path
    # ========================================================

    @staticmethod
    def extract_audio_to(
        video_path: str,
        output_path: str
    ) -> str:
        """
        Extract audio and save it to a specific output path.

        Args:
            video_path: Input video path.
            output_path: Output WAV path.

        Returns:
            Output path.
        """

        FFmpegService.check_ffmpeg()

        output = Path(output_path)
        output.parent.mkdir(parents=True, exist_ok=True)

        cmd = [
            FFMPEG,
            "-y",
            "-i",
            str(video_path),
            "-vn",
            "-acodec",
            "pcm_s16le",
            "-ar",
            "16000",
            "-ac",
            "1",
            str(output),
        ]

        subprocess.run(
            cmd,
            check=True,
        )

        return str(output)

    # ========================================================
    # Get video information
    # ========================================================

    @staticmethod
    def get_video_info(video_path: str) -> dict:
        """
        Get video metadata using FFprobe.

        Returns:
            Dictionary containing format and stream information.
        """

        FFmpegService.check_ffmpeg()

        cmd = [
            FFPROBE,
            "-v",
            "quiet",
            "-print_format",
            "json",
            "-show_format",
            "-show_streams",
            str(video_path),
        ]

        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            check=True,
        )

        return json.loads(result.stdout)

    # ========================================================
    # Get video duration
    # ========================================================

    @staticmethod
    def get_duration(video_path: str) -> float:
        """
        Get video duration in seconds.
        """

        info = FFmpegService.get_video_info(video_path)

        return float(
            info["format"]["duration"]
        )

    # ========================================================
    # Get video file size
    # ========================================================

    @staticmethod
    def get_file_size(video_path: str) -> int:
        """
        Get video file size in bytes.
        """

        return Path(video_path).stat().st_size

    # ========================================================
    # Generate thumbnail
    # ========================================================

    @staticmethod
    def generate_thumbnail(video_path: str) -> str:
        """
        Generate thumbnail at 3-second mark.
        """

        thumbnail = (
            THUMBNAILS /
            (Path(video_path).stem + ".jpg")
        )

        return FFmpegService.generate_thumbnail_to(
            video_path,
            str(thumbnail),
        )

    # ========================================================
    # Generate thumbnail to specific path
    # ========================================================

    @staticmethod
    def generate_thumbnail_to(
        video_path: str,
        output_path: str
    ) -> str:
        """
        Generate thumbnail at the 3-second mark.
        """

        FFmpegService.check_ffmpeg()

        output = Path(output_path)
        output.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        cmd = [
            FFMPEG,
            "-y",
            "-i",
            str(video_path),
            "-ss",
            "00:00:03",
            "-frames:v",
            "1",
            str(output),
        ]

        subprocess.run(
            cmd,
            check=True,
        )

        return str(output)
