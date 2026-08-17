"""
Database Fix Runner

Runs the fix_start_time_and_analytics.sql migration against the database.
Fixes three issues:
  1. Removes key_moments rows with NULL start_time
  2. Adds NOT NULL constraint on start_time
  3. Adds missing analytics columns (unique_viewers, total_watch_time, etc.)

Usage:
    python run_db_fix.py
"""

import os
import sys
import logging

# Add backend directory to path so we can import app settings
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger(__name__)


def main():
    """Execute the migration SQL file against the database."""

    # Read the migration SQL
    migration_path = os.path.join(
        os.path.dirname(__file__),
        "backend",
        "migrations",
        "fix_start_time_and_analytics.sql",
    )

    if not os.path.exists(migration_path):
        logger.error(f"Migration file not found: {migration_path}")
        sys.exit(1)

    with open(migration_path, "r") as f:
        sql = f.read()

    # Import the app's database connection
    try:
        from app.core.config import settings
        from sqlalchemy import create_engine, text
    except ImportError as e:
        logger.error(f"Failed to import app modules: {e}")
        logger.error("Make sure you're running from the project root (d:/ClipMind AI)")
        sys.exit(1)

    # Create a direct engine connection (bypassing session/ORM)
    logger.info(f"Connecting to database...")
    engine = create_engine(settings.DATABASE_URL)

    try:
        with engine.connect() as conn:
            logger.info("Executing migration...")
            result = conn.execute(text(sql))
            conn.commit()
            logger.info("Migration executed successfully!")
    except Exception as e:
        logger.error(f"Migration failed: {e}")
        sys.exit(1)

    # Verify the fix by checking key_moments
    try:
        with engine.connect() as conn:
            # Check for remaining NULL start_time rows
            row = conn.execute(
                text("SELECT COUNT(*) FROM key_moments WHERE start_time IS NULL")
            ).scalar()
            if row and row > 0:
                logger.warning(
                    f"  ⚠ {row} row(s) still have NULL start_time"
                )
            else:
                logger.info("  ✓ No NULL start_time rows remain in key_moments")

            # Check analytics columns
            cols = conn.execute(
                text(
                    "SELECT column_name FROM information_schema.columns "
                    "WHERE table_name = 'analytics' "
                    "ORDER BY ordinal_position"
                )
            ).fetchall()
            col_names = [c[0] for c in cols]
            
            expected = [
                "unique_viewers",
                "total_watch_time",
                "completion_rate",
                "avg_watch_duration",
            ]
            for col in expected:
                if col in col_names:
                    logger.info(f"  ✓ analytics.{col} exists")
                else:
                    logger.warning(f"  ⚠ analytics.{col} is MISSING")

    except Exception as e:
        logger.warning(f"Verification query failed (table may not exist yet): {e}")

    logger.info("")
    logger.info("=== Fix Complete ===")
    logger.info("You can now restart the backend and test the /detect endpoint.")


if __name__ == "__main__":
    main()

