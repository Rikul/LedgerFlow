#!/usr/bin/env python3
"""Migration script to create the payments table."""

import os
import sqlite3


def create_payments_table():
    """Create the payments table if it does not already exist."""
    db_path = os.path.join(os.path.dirname(__file__), 'ledgerflow.db')

    if not os.path.exists(db_path):
        print(f"Database file not found at {db_path}")
        return

    connection = None
    try:
        connection = sqlite3.connect(db_path)
        cursor = connection.cursor()

        # Check if the payments table already exists
        cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='payments'"
        )
        if cursor.fetchone():
            print("payments table already exists.")
            return

        cursor.execute(
            """
            CREATE TABLE payments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                amount REAL NOT NULL DEFAULT 0.0,
                date TEXT NOT NULL,
                payment_method TEXT,
                reference_number TEXT,
                notes TEXT,
                status TEXT,
                invoice_id INTEGER,
                vendor_id INTEGER,
                customer_id INTEGER,
                created_at TEXT,
                updated_at TEXT,
                FOREIGN KEY(invoice_id) REFERENCES invoices(id),
                FOREIGN KEY(vendor_id) REFERENCES vendors(id),
                FOREIGN KEY(customer_id) REFERENCES customers(id)
            )
            """
        )

        connection.commit()
        print("Successfully created payments table.")

    except sqlite3.Error as exc:
        print(f"Error creating payments table: {exc}")
        if connection:
            connection.rollback()
    finally:
        if connection:
            connection.close()


if __name__ == '__main__':
    create_payments_table()
