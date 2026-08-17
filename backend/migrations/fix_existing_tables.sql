-- Fix transcripts table: rename content column to transcript
-- Run this if you have an existing database with the old schema

-- First, check if the old column exists
DO $$
BEGIN
    -- Fix transcripts table
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'transcripts' AND column_name = 'content') THEN
        -- Rename content to transcript
        ALTER TABLE transcripts RENAME COLUMN content TO transcript;
        
        -- Update language column size if needed
        ALTER TABLE transcripts ALTER COLUMN language TYPE VARCHAR(20);
    END IF;
    
    -- Fix summaries table
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'summaries' AND column_name = 'content') THEN
        -- Add new columns
        ALTER TABLE summaries ADD COLUMN short_summary TEXT NOT NULL DEFAULT 'Short summary not available';
        ALTER TABLE summaries ADD COLUMN detailed_summary TEXT NOT NULL DEFAULT 'Detailed summary not available';
        
        -- Copy old content to both new columns
        UPDATE summaries SET short_summary = content, detailed_summary = content;
        
        -- Remove old column
        ALTER TABLE summaries DROP COLUMN content;
    END IF;
    
    -- Fix analytics table - add missing columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'analytics' AND column_name = 'unique_viewers') THEN
        ALTER TABLE analytics ADD COLUMN unique_viewers INTEGER DEFAULT 0 NOT NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'analytics' AND column_name = 'total_watch_time') THEN
        ALTER TABLE analytics ADD COLUMN total_watch_time FLOAT DEFAULT 0.0 NOT NULL;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'analytics' AND column_name = 'watch_time') THEN
        -- Migrate watch_time to total_watch_time
        UPDATE analytics SET total_watch_time = watch_time WHERE total_watch_time = 0.0;
        ALTER TABLE analytics DROP COLUMN watch_time;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'analytics' AND column_name = 'average_watch_duration') THEN
        -- Rename average_watch_duration to avg_watch_duration
        ALTER TABLE analytics RENAME COLUMN average_watch_duration TO avg_watch_duration;
    END IF;
    
    RAISE NOTICE 'Database migration completed successfully';
END $$;