# LedgerFlow - Accounting Software

LedgerFlow is a comprehensive online accounting software designed specifically for small businesses and freelancers. Built with Angular and Tailwind CSS, it provides an intuitive and modern interface for managing finances, invoicing, expense tracking, customer/vendor management, and more.

## Features

### ✅ Core Features
- **Dashboard** - Overview of business finances with key metrics and charts
- **Invoicing** - Create, manage, and track professional invoices
- **Expense Tracking** - Record and categorize business expenses
- **Bank Reconciliation** - Match bank transactions with accounting records
- **Reporting** - Generate Profit & Loss, Balance Sheet, and Cash Flow reports
- **Customers** - Manage customer records, contacts, payment terms, and credit limits
- **Vendors** - Manage vendor records, categories, payment terms, and account numbers
- **Settings** - Customize application preferences, company info, tax, notifications, and security
- **Backend Connectivity** - Automatic backend health monitoring with error handling and recovery

### 🎨 UI/UX Features
- Clean and intuitive interface
- Responsive design for all devices
- Professional invoice templates
- Real-time data visualization
- Accessibility compliant (WCAG guidelines)
- **Backend Error Handling** - User-friendly error screens with automatic retry and status monitoring

## Technology Stack

- **Frontend**: Angular 17+ with standalone components
- **Styling**: Tailwind CSS with custom component classes
- **Icons**: Heroicons (SVG icons)
- **Typography**: Inter font family
- **Build Tool**: Angular CLI
- **Module System**: ES2022 with lazy loading
- **Backend**: Flask (Python), SQLite

## Key Components

### Layout Components
- **Header**: Top navigation with search, notifications, and user menu
- **Sidebar**: Main navigation with feature links (Dashboard, Invoices, Expenses, Customers, Vendors, etc.)
- **App Component**: Main layout wrapper with responsive design

### Feature Components
- **Dashboard**: Key metrics, charts, and quick actions
- **Invoice List**: Searchable/filterable invoice table with status badges
- **Invoice Create**: Comprehensive invoice creation form with line items
- **Invoice View**: Professional invoice preview with payment tracking
- **Expense List**: Expense tracking with categories and receipt management
- **Customer List**: Manage customers, search/filter, add/edit/delete
- **Vendor List**: Manage vendors, search/filter, add/edit/delete
- **Settings**: Application configuration and preferences
  - **Company**: Company info, addresses, contact
  - **Tax Settings**: Entity type, tax rates
  - **Notifications**: Email/SMS notification preferences
  - **Security**: Password management, 2FA


## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Angular CLI
- Python 3.12+
- pip

### Installation

1. **Install frontend dependencies**:
   ```bash
   npm install
   ```
2. **Install backend dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. **Start backend server** (Required for app to load):
   ```bash
   cd backend
   python app.py
   ```
4. **Start frontend development server**:
   ```bash
   npm start
   # or
   ng serve
   ```
   > When developing inside a container or remote environment, expose the dev server
   > by passing `--host 0.0.0.0 --port 4200` so that Playwright or other tooling can
   > reach the Angular app.
5. **Open browser** and navigate to `http://localhost:4200`
   > The Flask backend listens on `http://localhost:5000` (bound to `0.0.0.0`), which
   > must remain running for customer and vendor tables to load data and icons.

> **Note**: The application will not load if the backend server is not running. You'll see a backend connectivity error screen with instructions and automatic retry functionality.

### Build for Production

```bash
npm run build
# or
ng build --configuration production
```

## Development Guidelines

### Component Structure
- Use standalone components for better tree-shaking
- Implement lazy loading for feature modules
- Follow Angular style guide conventions
- Use TypeScript strict mode

### Styling Guidelines
- Use Tailwind utility classes for styling
- Create custom component classes for reusable styles
- Maintain consistent spacing and typography
- Ensure responsive design across all breakpoints

### Code Organization
- Feature-based folder structure
- Shared components in `/shared` directory
- Lazy-loaded routes for better performance
- Clear separation of concerns
- Backend models in `/backend/models.py`

## Backend Connectivity

LedgerFlow includes comprehensive backend connectivity monitoring to ensure a smooth user experience:

- **Automatic Health Checks**: The app continuously monitors backend availability
- **Error Handling**: Shows user-friendly error screens when backend is unavailable
- **Automatic Recovery**: Automatically reconnects when backend becomes available
- **Status Monitoring**: Real-time status indicators and retry mechanisms

For detailed information about the backend connectivity features, see [BACKEND_CONNECTIVITY.md](./BACKEND_CONNECTIVITY.md).

## Future Enhancements

### Backend Integration
- RESTful API endpoints
- JWT authentication
- Database integration (SQLite/PostgreSQL)
- File upload for receipts

### Advanced Features
- Real-time notifications
- Email integration
- PDF generation
- Data export (CSV, Excel)
- Multi-currency support
- Tax calculation engines

### Performance Optimizations
- Service workers for offline support
- Progressive Web App (PWA) features
- Optimized bundle sizes
- Lazy loading images

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.