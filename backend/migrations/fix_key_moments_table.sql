-- Migration: Fix key_moments table - rename start_time/end_time to timestamp
-- The SQLAlchemy model was updated from (start_time, end_time) to a single timestamp column.

DO $$
BEGIN
    -- Check if table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'key_moments') THEN
        
        -- Case 1: Old schema with start_time and end_time
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'key_moments' AND column_name = 'start_time') AND
           EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'key_moments' AND column_name = 'end_time') THEN
            
            -- Drop end_time, rename start_time to timestamp
            ALTER TABLE key_moments DROP COLUMN IF EXISTS end_time;
            ALTER TABLE key_moments RENAME COLUMN start_time TO timestamp;
            RAISE NOTICE 'Migrated key_moments: start_time/end_time -> timestamp';
        
        -- Case 2: No columns at all, table needs to be recreated
        ELSIF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'key_moments' AND column_name = 'timestamp') AND
              NOT EXISTS (SELECT 1 FROM information_schema.columns 
                          WHERE table_name = 'key_moments' AND column_name = 'start_time') THEN
            RAISE NOTICE 'key_moments table exists but has no recognized columns - skipping';
        
        -- Case 3: Already has timestamp column
        ELSIF EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'key_moments' AND column_name = 'timestamp') THEN
            RAISE NOTICE 'key_moments table already has timestamp column - no migration needed';
        END IF;
    
    ELSE
        RAISE NOTICE 'key_moments table does not exist - SQLAlchemy create_all will handle it';
    END IF;
END $$;

