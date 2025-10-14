#!/usr/bin/env python3
"""Migration script to add tax_rate column to invoices table."""

import sqlite3
import os

def add_tax_rate_column():
    """Add tax_rate column to invoices table."""
    db_path = os.path.join(os.path.dirname(__file__), 'ledgerflow.db')

    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        return

    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Check if column already exists
        cursor.execute("PRAGMA table_info(invoices)")
        columns = [column[1] for column in cursor.fetchall()]

        if 'tax_rate' in columns:
            print("tax_rate column already exists in invoices table.")
            conn.close()
            return

        # Add the tax_rate column
        cursor.execute("ALTER TABLE invoices ADD COLUMN tax_rate FLOAT DEFAULT 0.0")

        conn.commit()
        print("Successfully added tax_rate column to invoices table.")

    except sqlite3.Error as e:
        print(f"Error adding column: {e}")
        conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    add_tax_rate_column()