#!/usr/bin/env python3
"""Migration script to add tag column to expenses table."""

import sqlite3
import os

def add_tag_column():
    """Add tag column to expenses table."""
    db_path = os.path.join(os.path.dirname(__file__), 'ledgerflow.db')

    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Check if column already exists
        cursor.execute("PRAGMA table_info(expenses)")
        columns = [column[1] for column in cursor.fetchall()]

        if 'tag' in columns:
            print("tag column already exists in expenses table.")
            conn.close()
            return

        # Add the tag column
        cursor.execute("ALTER TABLE expenses ADD COLUMN tag TEXT")

        conn.commit()
        print("Successfully added tag column to expenses table.")

    except sqlite3.Error as e:
        print(f"Error adding column: {e}")
        conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    add_tag_column()