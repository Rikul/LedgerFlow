# LedgerFlow 

## Features

- **Dashboard** - Business overview with key metrics
- **Invoicing** - Create and manage professional invoices
- **Expense Tracking** - Record and categorize expenses
- **Customer & Vendor Management** - Contact and payment tracking
- **Settings** - Company, tax, notification, and security configuration

## Technology Stack

- **Frontend**: Angular 17+, Tailwind CSS, Heroicons
- **Backend**: Python Flask, SQLite
- **Build**: Angular CLI, TypeScript

## Getting Started

### Prerequisites
- Node.js 18+, Angular CLI
- Python 3.12+, pip

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   pip install -r backend/requirements.txt
   ```

2. **Start servers**:
   ```bash
   # Backend (required)
   cd backend && python app.py
   
   # Frontend
   npm start
   ```

3. **Open browser**: `http://localhost:4200`

> **Note**: Backend must be running for the app to function properly.

### Docker Compose (Alternative)

Run the entire stack with Docker:

```bash
docker-compose up
```

Access the app at `http://localhost:8000`

### Build for Production

```bash
ng build --configuration production
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
