#!/usr/bin/env python3
"""Migration script to update legacy overdue invoice statuses to sent."""

import os
import sqlite3


def migrate_overdue_status():
    """Update invoices with an overdue status to sent."""
    db_path = os.path.join(os.path.dirname(__file__), "ledgerflow.db")

    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        return

    conn = None
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='invoices'"
        )
        if cursor.fetchone() is None:
            print("invoices table does not exist in the database.")
            return

        cursor.execute(
            "UPDATE invoices SET status = ? WHERE status = ?",
            ("sent", "overdue"),
        )
        updated = cursor.rowcount
        conn.commit()

        if updated:
            print(f"Successfully updated {updated} invoice(s) from overdue to sent.")
        else:
            print("No invoices with overdue status found.")

    except sqlite3.Error as exc:
        if conn is not None:
            conn.rollback()
        print(f"Error updating invoice statuses: {exc}")
    finally:
        if conn is not None:
            conn.close()


if __name__ == "__main__":
    migrate_overdue_status()
