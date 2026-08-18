import psycopg2
import sys

# Render PostgreSQL credentials
password = "jlcGDWLqgGbRA02hnUVnOnMTIFh8p3jk"
conn_str = f"postgresql://clipmind_db_rvh9_user:{password}@dpg-da27r961egvs73abjcj0-a.oregon-postgres.render.com/clipmind_db_rvh9?sslmode=require"

# Read backup file
try:
    with open(r"D:\ClipMind AI\backend\clipmind_ai_fresh.sql", "r", encoding="utf-8-sig") as f:
        sql_script = f.read()
except Exception as e:
    print(f"ERROR: Could not read backup file: {e}")
    sys.exit(1)

# Connect and execute
conn = None
try:
    conn = psycopg2.connect(conn_str)
    conn.autocommit = True
    cur = conn.cursor()
    
    # Split by semicolons and execute statements one by one
    statements = [s.strip() for s in sql_script.split(';') if s.strip()]
    
    for i, statement in enumerate(statements):
        try:
            cur.execute(statement)
            if (i + 1) % 50 == 0:
                print(f"  Executed {i + 1}/{len(statements)} statements...")
        except Exception as e:
            print(f"  Warning on statement {i + 1}: {str(e)[:100]}")
            continue
    
    print(f"OK: Database imported successfully ({len(statements)} statements)")
    
except Exception as e:
    print(f"ERROR: Connection/import failed: {str(e)[:200]}")
finally:
    if conn:
        try:
            cur.close()
            conn.close()
        except:
            pass
