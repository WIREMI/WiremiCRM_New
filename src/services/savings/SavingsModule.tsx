import React, { useState, useEffect } from 'react';
import { PiggyBank, Plus, TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';
import SavingsAnalyticsCharts from './components/SavingsAnalyticsCharts';
import RecentSavingsList from './components/RecentSavingsList';
import { SavingsInstance } from '../../types';

const SavingsModule: React.FC = () => {
  const [recentSavings, setRecentSavings] = useState<SavingsInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInstances: 0,
    totalVolume: 0,
    activeInstances: 0,
    completedInstances: 0
  });

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [summaryResponse, recentResponse] = await Promise.all([
      //   fetch('/api/v1/savings/summary'),
      //   fetch('/api/v1/savings/recent')
      // ]);
      
      // Mock data for demonstration
      const mockRecentSavings: SavingsInstance[] = Array.from({ length: 8 }, (_, i) => ({
        id: `savings-${i + 1}`,
        customerId: `WRM${String(i + 1).padStart(6, '0')}`,
        name: [
          'Dream Vacation Fund',
          'Emergency Fund',
          'New Car Savings',
          'House Down Payment',
          'Wedding Fund',
          'Education Fund',
          'Retirement Savings',
          'Business Investment'
        ][i],
        type: ['REGULAR', 'BLOCKED', 'RECURRENT', 'GROUP'][i % 4] as any,
        targetAmount: 10000 + (i * 5000),
        currentAmount: Math.random() * (10000 + (i * 5000)),
        expectedAmount: 12000 + (i * 5000),
        frequency: ['MONTHLY', 'WEEKLY', 'DAILY', 'QUARTERLY'][i % 4] as any,
        startDate: new Date(Date.now() - i * 86400000 * 30).toISOString(),
        endDate: new Date(Date.now() + (365 - i * 30) * 86400000).toISOString(),
        interestEarned: Math.random() * 500 + 50,
        status: ['ACTIVE', 'COMPLETED', 'PAUSED'][i % 3] as any,
        createdAt: new Date(Date.now() - i * 86400000 * 30).toISOString(),
        updatedAt: new Date().toISOString()
      }));

      const mockStats = {
        totalInstances: 156,
        totalVolume: 2847392,
        activeInstances: 134,
        completedInstances: 22
      };

      setRecentSavings(mockRecentSavings);
      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load savings data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAllSavings = () => {
    // TODO: Navigate to detailed savings page
    console.log('Navigate to all savings');
  };

  return (
    <div>
      <PageHeader 
        title="Savings Module" 
        subtitle="Monitor savings instances, track performance, and analyze savings patterns"
        actions={
          <button
            onClick={handleViewAllSavings}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            View All Savings
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Instances"
          value={stats.totalInstances.toLocaleString()}
          change="+18 this month"
          changeType="positive"
          icon={PiggyBank}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Total Volume Saved"
          value={`$${(stats.totalVolume / 1000000).toFixed(1)}M`}
          change="+12.5% this quarter"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Active Instances"
          value={stats.activeInstances.toLocaleString()}
          change="+5 new today"
          changeType="positive"
          icon={Activity}
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Completed Goals"
          value={stats.completedInstances.toLocaleString()}
          change="+3 this week"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-purple-500"
        />
      </div>

      {/* Analytics Charts */}
      <div className="mb-8">
        <SavingsAnalyticsCharts />
      </div>

      {/* Recent Savings */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Recent Savings Instances</h3>
              <p className="text-sm text-gray-600 dark:text-dark-400 mt-1">
                Most recently created savings goals and instances
              </p>
            </div>
            <button
              onClick={handleViewAllSavings}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        
        <RecentSavingsList 
          savings={recentSavings} 
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default SavingsModule;