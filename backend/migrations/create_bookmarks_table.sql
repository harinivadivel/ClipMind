-- Migration: Create bookmarks table for video-level bookmarks (save-for-later)
-- Replaces the old timestamp-based bookmarks table.
--
-- Run this migration if you are not using Alembic.
-- If using Alembic, generate an autogenerate migration instead.

-- Drop the old bookmarks table if it exists with the previous schema
DROP TABLE IF EXISTS bookmarks;

CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enforce one bookmark per user/video pair
ALTER TABLE bookmarks
ADD CONSTRAINT uq_bookmark_user_video
UNIQUE (user_id, video_id);
