# Wiremi Fintech CRM Services

This directory contains all the core fintech services organized as modular components. Each service is designed to be independent and scalable.

## Service Structure

Each service follows this structure:
```
services/
├── service-name/
│   ├── components/          # Service-specific components
│   ├── hooks/              # Custom hooks for the service
│   ├── types/              # Service-specific TypeScript types
│   ├── utils/              # Service utility functions
│   ├── ServiceName.tsx     # Main service component
│   └── index.ts            # Service exports
```

## Available Services

### Core Financial Services
- **Authentication & Security** - User auth, sessions, security policies
- **Transaction Explorer** - Real-time transaction monitoring and analysis
- **Finance & Reconciliation** - Financial operations and reconciliation
- **Pricing, FX & Billing Engine** - Pricing models and billing systems

### Customer & User Management
- **User & Customer Management** - User accounts and customer profiles
- **Role & Permission Management** - Access control and permissions
- **Goal-Based Savings** - Savings goals and investment tracking
- **Virtual Cards & Wallets** - Card management and digital wallets

### Risk & Compliance
- **Compliance & AML Engine** - Anti-money laundering and compliance
- **Fraud & Risk Management** - Fraud detection and risk assessment
- **Loans & Credit Scoring** - Lending and credit evaluation

### Operations & Analytics
- **Admin Dashboard & Analytics** - Central dashboard and reporting
- **BI Reporting** - Business intelligence and data visualization
- **Support & Ticketing** - Customer support management
- **Messaging & Communication Center** - Internal communications

### Growth & Marketing
- **Marketing & Growth** - Campaign management and growth tracking
- **Loyalty & Rewards** - Customer loyalty programs
- **In-App Advertising & Notifications** - Marketing communications

### Management & Configuration
- **Product & Feature Management** - Feature flags and product management
- **Super-Admin Service Delegation** - Administrative delegation tools

## Development Guidelines

1. Keep services modular and independent
2. Use shared types from `/src/types/index.ts`
3. Follow consistent naming conventions
4. Implement proper error handling
5. Add comprehensive testing for each service
6. Document API interfaces and data flows

## Next Steps

Each service placeholder should be expanded with:
- Detailed component hierarchy
- Service-specific API integrations
- State management (Redux/Zustand)
- Real-time data connections
- Comprehensive test coverage