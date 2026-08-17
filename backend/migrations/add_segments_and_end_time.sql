-- Migration: Add segments column to transcripts, rename timestamp to start_time in key_moments, add end_time
-- This supports YouTube-style key moments with real Whisper segments and time ranges.

DO $$
BEGIN
    -- === transcripts table: add segments column ===
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'transcripts') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'transcripts' AND column_name = 'segments') THEN
            ALTER TABLE transcripts ADD COLUMN segments JSON;
            RAISE NOTICE 'Added segments column to transcripts table';
        ELSE
            RAISE NOTICE 'transcripts.segments column already exists';
        END IF;
    ELSE
        RAISE NOTICE 'transcripts table does not exist - SQLAlchemy will handle it';
    END IF;

    -- === key_moments table: rename timestamp -> start_time, add end_time ===
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'key_moments') THEN
        
        -- Rename timestamp to start_time if needed
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'key_moments' AND column_name = 'timestamp') THEN
            ALTER TABLE key_moments RENAME COLUMN timestamp TO start_time;
            RAISE NOTICE 'Renamed key_moments.timestamp to start_time';
        END IF;

        -- If there's already start_time but no end_time — just add end_time
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'key_moments' AND column_name = 'start_time') THEN
            -- Fallback: check old start_time column
            IF EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'key_moments' AND column_name = 'timestamp') THEN
                ALTER TABLE key_moments RENAME COLUMN timestamp TO start_time;
            END IF;
        END IF;

        -- Add end_time column if it doesn't exist
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name = 'key_moments' AND column_name = 'end_time') THEN
            ALTER TABLE key_moments ADD COLUMN end_time FLOAT;
            RAISE NOTICE 'Added end_time column to key_moments table';
        ELSE
            RAISE NOTICE 'key_moments.end_time column already exists';
        END IF;

    ELSE
        RAISE NOTICE 'key_moments table does not exist - SQLAlchemy will handle it';
    END IF;

END $$;

