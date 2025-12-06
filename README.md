# LedgerFlow 

> **⚠️ SECURITY NOTICE**: Before deploying to production, review the security configuration in `backend/.env.example` and the `CODE_REVIEW_REPORT.md` file.

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

1. **Configure environment**:
   ```bash
   # Backend configuration
   cd backend
   cp .env.example .env
   # Edit .env and set secure SECRET_KEY and JWT_SECRET_KEY
   ```

2. **Install dependencies**:
   ```bash
   npm install
   pip install -r backend/requirements.txt
   ```

3. **Start servers**:
   ```bash
   # Backend (required)
   cd backend && python app.py
   
   # Frontend
   npm start
   ```

4. **Open browser**: `http://localhost:4200`

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

## Security

**Important**: Review the `CODE_REVIEW_REPORT.md` file for a complete security assessment.

### Production Checklist

Before deploying to production:

1. ✅ Set secure `SECRET_KEY` and `JWT_SECRET_KEY` in environment variables
2. ✅ Configure `ALLOWED_ORIGINS` for CORS
3. ✅ Use HTTPS/TLS encryption
4. ✅ Set `FLASK_CONFIG=production`
5. ✅ Use a production database (PostgreSQL recommended)
6. ✅ Review and implement authentication on all API endpoints
7. ✅ Enable security headers (already configured in app.py)
8. ✅ Implement rate limiting
9. ✅ Set up monitoring and logging
10. ✅ Review and test all security measures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
