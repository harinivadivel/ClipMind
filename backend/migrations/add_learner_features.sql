-- =====================================================================
-- ClipMind AI — Learner Features Migration
-- ---------------------------------------------------------------------
-- Adds the schema pieces required for:
--   1. Browse / shared library (videos.is_published)
--   2. Per-user learning / watch history (watch_history table)
--   3. Bookmarking summaries & key moments (bookmark_items table)
--
-- The application also self-heals at startup (see main.py
-- initialize_database), so this file exists for manual/scripted use.
-- =====================================================================

-- 1) Publish flag on videos -------------------------------------------
ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE NOT NULL;

-- 2) Watch history -----------------------------------------------------
CREATE TABLE IF NOT EXISTS watch_history (
    id               SERIAL PRIMARY KEY,
    user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_id         INTEGER NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
    watch_duration   FLOAT   NOT NULL DEFAULT 0.0,
    completion_rate  FLOAT   NOT NULL DEFAULT 0.0,
    last_watched_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_watch_history_user_video UNIQUE (user_id, video_id)
);

CREATE INDEX IF NOT EXISTS ix_watch_history_user_id  ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS ix_watch_history_video_id ON watch_history(video_id);

-- 3) Content-item bookmarks (summaries / key moments) -----------------
CREATE TABLE IF NOT EXISTS bookmark_items (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type   VARCHAR(50) NOT NULL,          -- 'summary' | 'key_moment'
    item_id     INTEGER NOT NULL,              -- summaries.id / key_moments.id
    label       VARCHAR(500),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_bookmark_item_user_type_ref UNIQUE (user_id, item_type, item_id)
);

CREATE INDEX IF NOT EXISTS ix_bookmark_items_user_id ON bookmark_items(user_id);