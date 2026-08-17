-- Migration: Fix transcripts table - add missing transcript column
-- The transcript column was missing from the database table.
-- This ALTER TABLE adds the column.

-- Check if the column already exists before adding
DO $$
BEGIN
    -- Fix 1: transcripts table - rename/ensure 'transcript' column
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'transcripts' AND column_name = 'content'
    ) THEN
        -- Old schema had 'content' column, rename to 'transcript'
        ALTER TABLE transcripts RENAME COLUMN content TO transcript;
        RAISE NOTICE 'Renamed content column to transcript in transcripts table';
    ELSIF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'transcripts' AND column_name = 'transcript'
    ) THEN
        -- Neither column exists, add 'transcript' column
        ALTER TABLE transcripts ADD COLUMN transcript TEXT NOT NULL DEFAULT '';
        RAISE NOTICE 'Added transcript column to transcripts table';
    ELSE
        RAISE NOTICE 'transcript column already exists in transcripts table';
    END IF;

    -- Fix 2: summaries table - add short_summary and detailed_summary columns
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'summaries' AND column_name = 'content'
    ) THEN
        -- Old schema had single 'content' column
        -- Add new columns
        ALTER TABLE summaries ADD COLUMN IF NOT EXISTS short_summary TEXT NOT NULL DEFAULT '';
        ALTER TABLE summaries ADD COLUMN IF NOT EXISTS detailed_summary TEXT NOT NULL DEFAULT '';
        ALTER TABLE summaries ADD COLUMN IF NOT EXISTS model_used VARCHAR(100);
        -- Drop old content column
        ALTER TABLE summaries DROP COLUMN content;
        RAISE NOTICE 'Migrated summaries table: content -> short_summary + detailed_summary';
    ELSE
        -- Ensure new columns exist
        ALTER TABLE summaries ADD COLUMN IF NOT EXISTS short_summary TEXT NOT NULL DEFAULT '';
        ALTER TABLE summaries ADD COLUMN IF NOT EXISTS detailed_summary TEXT NOT NULL DEFAULT '';
        ALTER TABLE summaries ADD COLUMN IF NOT EXISTS model_used VARCHAR(100);
        RAISE NOTICE 'Ensured summaries table has short_summary, detailed_summary, model_used columns';
    END IF;
END $$;

