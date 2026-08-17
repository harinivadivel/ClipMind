-- Migration: Add keywords table for storing extracted transcript keywords
-- Each row represents a single keyword extracted from a video's transcript,
-- with its frequency count.
--
-- Run this migration if you are not using Alembic.
-- If using Alembic, generate an autogenerate migration instead.

CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    video_id INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast keyword lookup by video
CREATE INDEX IF NOT EXISTS ix_keywords_video_id ON keywords(video_id);

-- Index for fast keyword search by keyword text
CREATE INDEX IF NOT EXISTS ix_keywords_keyword ON keywords(keyword);

-- Enforce unique keyword per video
ALTER TABLE keywords
ADD CONSTRAINT uq_keyword_video
UNIQUE (video_id, keyword);