import React from 'react';
import { Users, CreditCard, DollarSign, AlertTriangle, TrendingUp, Shield, Activity, Clock, CheckCircle, Target } from 'lucide-react';
import CoreMetricsSection from './components/CoreMetricsSection';
import FinancialOverviewSection from './components/FinancialOverviewSection';
import TransactionVolumeChart from './components/TransactionVolumeChart';
import TransactionTypesChart from './components/TransactionTypesChart';
import SupportOverviewSection from './components/SupportOverviewSection';
import RecentActivityList from './components/RecentActivityList';
import QuickActionsGrid from './components/QuickActionsGrid';
import SystemStatusSection from './components/SystemStatusSection';

const Dashboard: React.FC = () => {
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-4 space-y-4 bg-gray-50 dark:bg-dark-900 min-h-screen">
      {/* Welcome Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100 mb-1">
          Welcome back, Alex 👋
        </h1>
        <p className="text-gray-600 dark:text-dark-400">
          Here's what's happening with Wiremi today
        </p>
      </div>

      {/* Core Metrics */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Core Metrics</h2>
        <CoreMetricsSection />
      </div>

      {/* Financial Overview */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Financial Overview</h2>
        <FinancialOverviewSection />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <TransactionVolumeChart />
        <TransactionTypesChart />
      </div>

      {/* Support Overview */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Support Overview</h2>
        <SupportOverviewSection />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <RecentActivityList />
        </div>
        <div className="lg:col-span-1">
          <QuickActionsGrid />
        </div>
        <div className="lg:col-span-1">
          <SystemStatusSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;