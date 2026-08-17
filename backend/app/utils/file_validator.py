"""
File validation utilities for video uploads.
"""
import os
from typing import Optional, Tuple

ALLOWED_EXTENSIONS = {"mp4", "mov", "avi", "mkv", "webm", "flv", "wmv"}
MAX_FILE_SIZE = 100 * 1024 * 1024  # 100 MB


def get_file_extension(filename: str) -> str:
    """Get the file extension from a filename."""
    if "." not in filename:
        return ""
    return filename.rsplit(".", 1)[-1].lower()


def is_allowed_file(filename: str) -> bool:
    """Check if the file has an allowed extension."""
    ext = get_file_extension(filename)
    return ext in ALLOWED_EXTENSIONS


def validate_file_size(file_size: int, max_size: int = MAX_FILE_SIZE) -> Tuple[bool, Optional[str]]:
    """
    Validate the file size.

    Args:
        file_size: Size of the file in bytes.
        max_size: Maximum allowed size in bytes.

    Returns:
        Tuple of (is_valid, error_message).
    """
    if file_size <= 0:
        return False, "File is empty"
    if file_size > max_size:
        max_mb = max_size / (1024 * 1024)
        return False, f"File size exceeds maximum allowed size of {max_mb:.0f} MB"
    return True, None


def validate_video_file(filename: str, file_size: int) -> Tuple[bool, Optional[str]]:
    """
    Validate a video file for upload.

    Args:
        filename: The name of the file.
        file_size: The size of the file in bytes.

    Returns:
        Tuple of (is_valid, error_message).
    """
    if not filename:
        return False, "Filename is required"

    if not is_allowed_file(filename):
        allowed = ", ".join(sorted(ALLOWED_EXTENSIONS))
        return False, f"File type not allowed. Allowed types: {allowed}"

    is_valid, error = validate_file_size(file_size)
    if not is_valid:
        return False, error

    return True, None


def generate_safe_filename(filename: str, user_id: int) -> str:
    """
    Generate a safe, unique filename for storage.

    Args:
        filename: Original filename.
        user_id: User ID for uniqueness.

    Returns:
        A safe filename string.
    """
    import uuid

    ext = get_file_extension(filename)
    unique_id = uuid.uuid4().hex[:8]
    safe_name = f"video_{user_id}_{unique_id}.{ext}"
    return safe_name
