-- ==============================================================
-- Migration: Fix start_time NULL issue + Analytics missing columns
-- ==============================================================
-- 
-- Issues fixed:
--   1. key_moments.start_time IS NULL → delete bad rows + add NOT NULL constraint
--   2. analytics table missing unique_viewers, total_watch_time, 
--      completion_rate, avg_watch_duration columns
--
-- ==============================================================

DO $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- ==============================================================
    -- FIX 1: key_moments - Delete rows with NULL start_time
    -- ==============================================================
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'key_moments') THEN
        
        -- Delete rows where start_time IS NULL
        DELETE FROM key_moments WHERE start_time IS NULL;
        GET DIAGNOSTICS deleted_count = ROW_COUNT;
        
        RAISE NOTICE 'Deleted % key_moment(s) with NULL start_time', deleted_count;
        
        -- Ensure start_time column has NOT NULL constraint
        -- First check if it's nullable
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'key_moments' 
              AND column_name = 'start_time' 
              AND is_nullable = 'YES'
        ) THEN
            -- Add NOT NULL constraint (safe because we just deleted NULLs)
            ALTER TABLE key_moments ALTER COLUMN start_time SET NOT NULL;
            RAISE NOTICE 'Added NOT NULL constraint to key_moments.start_time';
        ELSE
            RAISE NOTICE 'key_moments.start_time already has NOT NULL constraint';
        END IF;
        
    ELSE
        RAISE NOTICE 'key_moments table does not exist - skipping';
    END IF;
    
    -- ==============================================================
    -- FIX 2: analytics - Add missing columns
    -- ==============================================================
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'analytics') THEN
        
        -- Add unique_viewers if missing
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'analytics' AND column_name = 'unique_viewers'
        ) THEN
            ALTER TABLE analytics ADD COLUMN unique_viewers INTEGER DEFAULT 0 NOT NULL;
            RAISE NOTICE 'Added analytics.unique_viewers column';
        ELSE
            RAISE NOTICE 'analytics.unique_viewers already exists';
        END IF;
        
        -- Add total_watch_time if missing
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'analytics' AND column_name = 'total_watch_time'
        ) THEN
            ALTER TABLE analytics ADD COLUMN total_watch_time FLOAT DEFAULT 0.0 NOT NULL;
            RAISE NOTICE 'Added analytics.total_watch_time column';
        ELSE
            RAISE NOTICE 'analytics.total_watch_time already exists';
        END IF;
        
        -- Add completion_rate if missing
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'analytics' AND column_name = 'completion_rate'
        ) THEN
            ALTER TABLE analytics ADD COLUMN completion_rate FLOAT DEFAULT 0.0 NOT NULL;
            RAISE NOTICE 'Added analytics.completion_rate column';
        ELSE
            RAISE NOTICE 'analytics.completion_rate already exists';
        END IF;
        
        -- Add avg_watch_duration if missing
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'analytics' AND column_name = 'avg_watch_duration'
        ) THEN
            -- Check if it might exist with old name 'average_watch_duration'
            IF EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'analytics' AND column_name = 'average_watch_duration'
            ) THEN
                ALTER TABLE analytics RENAME COLUMN average_watch_duration TO avg_watch_duration;
                RAISE NOTICE 'Renamed analytics.average_watch_duration to avg_watch_duration';
            ELSE
                ALTER TABLE analytics ADD COLUMN avg_watch_duration FLOAT DEFAULT 0.0 NOT NULL;
                RAISE NOTICE 'Added analytics.avg_watch_duration column';
            END IF;
        ELSE
            RAISE NOTICE 'analytics.avg_watch_duration already exists';
        END IF;
        
    ELSE
        RAISE NOTICE 'analytics table does not exist - skipping';
    END IF;
    
    RAISE NOTICE 'Migration fix_start_time_and_analytics completed successfully';
END $$;

