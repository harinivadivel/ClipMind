-- Migration: Add video_url column to videos table
-- This column stores a browser-accessible URL for the video file
-- (served via the static /uploads mount in FastAPI)

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'videos' AND column_name = 'video_url'
    ) THEN
        ALTER TABLE videos ADD COLUMN video_url VARCHAR(500);
        RAISE NOTICE 'Added video_url column to videos table';
    ELSE
        RAISE NOTICE 'video_url column already exists in videos table';
    END IF;
END $$;

-- Populate video_url for existing records where file_path exists
UPDATE videos
SET video_url = '/uploads/' || user_id || '/' || filename
WHERE video_url IS NULL
  AND filename IS NOT NULL
  AND user_id IS NOT NULL;


