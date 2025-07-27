import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import CoreMetricsSection from './CoreMetricsSection';
import FinancialOverviewSection from './FinancialOverviewSection';
import TransactionVolumeChart from './TransactionVolumeChart';
import TransactionTypesChart from './TransactionTypesChart';
import SupportOverviewSection from './SupportOverviewSection';
import RecentActivityList from './RecentActivityList';
import QuickActionsGrid from './QuickActionsGrid';
import SystemStatusSection from './SystemStatusSection';

const DashboardPage: React.FC = () => {
  const getCurrentTime = () => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      {/* Header */}
      <div className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-600 dark:text-dark-400 mb-1">
              Hi, Admin 👋
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
              Welcome back, Alex
            </h1>
            <p className="text-gray-600 dark:text-dark-400">
              Here's what's happening with Wiremi today
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors">
              <Filter size={16} className="text-gray-500" />
              <span className="text-gray-700 dark:text-dark-300">Filter</span>
            </button>
            <select className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
            <button className="bg-gray-900 dark:bg-dark-200 text-white dark:text-dark-900 px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-dark-300 transition-colors font-medium">
              Create a Report
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6">
        <div className="space-y-6">
          {/* Core Metrics */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Core Metrics</h2>
            <CoreMetricsSection />
          </div>

          {/* Financial Overview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Financial Overview</h2>
            <FinancialOverviewSection />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionVolumeChart />
            <TransactionTypesChart />
          </div>

          {/* Support Overview */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Support Overview</h2>
            <SupportOverviewSection />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default DashboardPage;