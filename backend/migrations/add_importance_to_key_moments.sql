-- Migration: Add importance column to key_moments table
-- This supports YouTube-style chapter importance levels: Low, Medium, High, Very High

ALTER TABLE key_moments
ADD COLUMN IF NOT EXISTS importance VARCHAR(20) DEFAULT 'Medium';

COMMENT ON COLUMN key_moments.importance IS 'Importance level: Low, Medium, High, Very High';