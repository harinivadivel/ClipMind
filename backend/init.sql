-- ClipMind AI Database Initialization Script
-- This script creates the initial roles for the application

-- Add role column to users table if it doesn't exist
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'Learner';
CREATE INDEX IF NOT EXISTS ix_users_role ON users(role);

INSERT INTO roles (name, description) VALUES
    ('Administrator', 'Full system access and management'),
    ('Content Creator', 'Can upload and manage video content'),
    ('Educator', 'Can access transcripts and summaries'),
    ('Learner', 'Can view and interact with content')
ON CONFLICT (name) DO NOTHING;
