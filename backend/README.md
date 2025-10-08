# LedgerFlow Backend (Flask + SQLite)

Minimal backend to persist Company information in SQLite.

## Setup

1. Create and activate a virtual environment (optional)
2. Install dependencies
3. Run the server

## Endpoints

- GET /api/company
  - Returns the first (and only) company record or null
- POST /api/company
  - Upserts the company
  - Body shape:
    {
      "companyName": "Acme Inc.",
      "mailing": { "address1": "...", "address2": "...", "city": "...", "state": "...", "postalCode": "...", "country": "..." },
      "physical": { "address1": "...", "address2": "...", "city": "...", "state": "...", "postalCode": "...", "country": "..." }
    }

The SQLite file (ledgerflow.db) is created in the backend directory by default.