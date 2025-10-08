# LedgerFlow - Accounting Software

LedgerFlow is a comprehensive online accounting software designed specifically for small businesses and freelancers. Built with Angular and Tailwind CSS, it provides an intuitive and modern interface for managing finances, invoicing, expense tracking, and more.

## Features

### ✅ Core Features
- **Dashboard** - Overview of business finances with key metrics and charts
- **Invoicing** - Create, manage, and track professional invoices
- **Expense Tracking** - Record and categorize business expenses
- **Bank Reconciliation** - Match bank transactions with accounting records
- **Reporting** - Generate Profit & Loss, Balance Sheet, and Cash Flow reports
- **User Management** - Role-based access control for team members
- **Settings** - Customize application preferences and company settings

### 🎨 UI/UX Features
- Clean and intuitive interface
- Responsive design for all devices
- Professional invoice templates
- Real-time data visualization
- Accessibility compliant (WCAG guidelines)

## Technology Stack

- **Frontend**: Angular 17+ with standalone components
- **Styling**: Tailwind CSS with custom component classes
- **Icons**: Heroicons (SVG icons)
- **Typography**: Inter font family
- **Build Tool**: Angular CLI
- **Module System**: ES2022 with lazy loading

## Key Components

### Layout Components
- **Header**: Top navigation with search, notifications, and user menu
- **Sidebar**: Main navigation with feature links and role-based access
- **App Component**: Main layout wrapper with responsive design

### Feature Components
- **Dashboard**: Key metrics, charts, and quick actions
- **Invoice List**: Searchable/filterable invoice table with status badges
- **Invoice Create**: Comprehensive invoice creation form with line items
- **Invoice View**: Professional invoice preview with payment tracking
- **Expense List**: Expense tracking with categories and receipt management
- **Settings**: Application configuration and preferences
- **User Management**: Team member and permission management

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Angular CLI

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install Angular CLI** (if not already installed):
   ```bash
   npm install -g @angular/cli
   ```

3. **Start development server**:
   ```bash
   npm start
   # or
   ng serve
   ```

4. **Open browser** and navigate to `http://localhost:4200`

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