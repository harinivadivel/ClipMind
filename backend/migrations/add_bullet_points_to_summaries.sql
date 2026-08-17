-- Migration: Add bullet_points JSON column to summaries table
-- Stores a list of key bullet-point strings extracted from the summary.

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'summaries') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                       WHERE table_name = 'summaries' AND column_name = 'bullet_points') THEN
            ALTER TABLE summaries ADD COLUMN bullet_points JSON;
            RAISE NOTICE 'Added bullet_points column to summaries table';
        ELSE
            RAISE NOTICE 'summaries.bullet_points column already exists';
        END IF;
    ELSE
        RAISE NOTICE 'summaries table does not exist - SQLAlchemy will handle it';
    END IF;
END $$;