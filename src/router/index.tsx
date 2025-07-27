import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import DashboardPage from '../services/dashboard/components/DashboardPage';
import AuthService from '../services/auth/AuthService';
import CustomerManagement from '../services/customers/CustomerManagement';
import TransactionExplorer from '../services/transactions/TransactionExplorer';
import RoleManagement from '../services/roles/RoleManagement';
import ComplianceAML from '../services/compliance/ComplianceAML';
import FinanceReconciliation from '../services/finance/FinanceReconciliation';
import PricingBilling from '../services/pricing-billing/PricingBilling';
import SavingsModule from '../services/savings/SavingsModule';
import VirtualCards from '../services/virtual-cards/VirtualCards';
import MessagingCenter from '../services/messaging/MessagingCenter';
import SupportTicketing from '../services/support/SupportTicketing';
import SuperAdminPage from '../services/admin/SuperAdminPage';

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="auth" element={<AuthService />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="transactions" element={<TransactionExplorer />} />
          <Route path="roles" element={<RoleManagement />} />
          <Route path="compliance" element={<ComplianceAML />} />
          <Route path="fraud" element={<div className="p-6">Fraud & Risk Management - Coming Soon</div>} />
          <Route path="finance" element={<FinanceReconciliation />} />
          <Route path="pricing" element={<PricingBilling />} />
          <Route path="savings" element={<SavingsModule />} />
          <Route path="loans" element={<div className="p-6">Loans & Credit - Coming Soon</div>} />
          <Route path="cards" element={<VirtualCards />} />
          <Route path="messaging" element={<MessagingCenter />} />
          <Route path="support" element={<SupportTicketing />} />
          <Route path="products" element={<div className="p-6">Product Management - Coming Soon</div>} />
          <Route path="admin" element={<SuperAdminPage />} />
          <Route path="marketing" element={<div className="p-6">Marketing & Growth - Coming Soon</div>} />
          <Route path="loyalty" element={<div className="p-6">Loyalty & Rewards - Coming Soon</div>} />
          <Route path="reports" element={<div className="p-6">BI Reporting - Coming Soon</div>} />
          <Route path="alerts" element={<div className="p-6">Alert Management - Coming Soon</div>} />
          <Route path="advertising" element={<div className="p-6">Advertising & Notifications - Coming Soon</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;