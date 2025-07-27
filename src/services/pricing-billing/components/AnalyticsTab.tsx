import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Percent, Users } from 'lucide-react';

const AnalyticsTab: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [feeAnalytics, subscriptionAnalytics] = await Promise.all([
      //   fetch(`/api/v1/pricing/analytics/fees?timeRange=${timeRange}`),
      //   fetch('/api/v1/pricing/analytics/subscriptions')
      // ]);
      
      // Mock data for demonstration
      const mockAnalytics = {
        feeAnalytics: {
          totalFeesCollected: 125430.50,
          totalTransactions: 8945,
          totalDiscountsGiven: 12543.25,
          feesByType: [
            { feeType: 'TRANSACTION', totalAmount: 85430.50, transactionCount: 6234 },
            { feeType: 'CARD_SERVICE', totalAmount: 25000.00, transactionCount: 1500 },
            { feeType: 'SAVINGS', totalAmount: 8000.00, transactionCount: 800 },
            { feeType: 'LOAN', totalAmount: 7000.00, transactionCount: 411 }
          ],
          monthlyTrend: [
            { month: 'Jan', fees: 95000, discounts: 8500 },
            { month: 'Feb', fees: 105000, discounts: 9200 },
            { month: 'Mar', fees: 115000, discounts: 10100 },
            { month: 'Apr', fees: 125430, discounts: 12543 }
          ]
        },
        subscriptionAnalytics: {
          totalPlans: 12,
          averagePrice: 29.99,
          priceRange: { min: 9.99, max: 99.99 },
          revenueByBillingCycle: [
            { billingCycle: 'MONTHLY', totalRevenue: 45000, planCount: 8 },
            { billingCycle: 'QUARTERLY', totalRevenue: 25000, planCount: 2 },
            { billingCycle: 'ANNUALLY', totalRevenue: 15000, planCount: 2 }
          ],
          planPopularity: [
            { name: 'Basic', subscribers: 1250, revenue: 12487.50 },
            { name: 'Premium', subscribers: 850, revenue: 25492.50 },
            { name: 'Business', subscribers: 120, revenue: 11988.00 }
          ]
        }
      };

      setAnalytics(mockAnalytics);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Time Range Filter */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          Pricing & Billing Analytics
        </h3>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Total Fees Collected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                {formatCurrency(analytics.feeAnalytics.totalFeesCollected)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <DollarSign size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Total Discounts Given</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                {formatCurrency(analytics.feeAnalytics.totalDiscountsGiven)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Percent size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Fee Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                {analytics.feeAnalytics.totalTransactions.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <TrendingUp size={24} className="text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Avg. Fee per Transaction</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                {formatCurrency(analytics.feeAnalytics.totalFeesCollected / analytics.feeAnalytics.totalTransactions)}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <Users size={24} className="text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fees by Type */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Fee Revenue by Type
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.feeAnalytics.feesByType}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="feeType" 
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-600 dark:text-dark-400"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-600 dark:text-dark-400"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="totalAmount" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Revenue by Billing Cycle */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Subscription Revenue by Billing Cycle
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.subscriptionAnalytics.revenueByBillingCycle}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="totalRevenue"
                  nameKey="billingCycle"
                >
                  {analytics.subscriptionAnalytics.revenueByBillingCycle.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 mt-4">
            {analytics.subscriptionAnalytics.revenueByBillingCycle.map((item: any, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600 dark:text-dark-400">
                  {item.billingCycle}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Fee Trend */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 lg:col-span-2">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Monthly Fee & Discount Trends
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.feeAnalytics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-600 dark:text-dark-400"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-600 dark:text-dark-400"
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value), 
                    name === 'fees' ? 'Fees Collected' : 'Discounts Given'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="fees" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="fees"
                />
                <Line 
                  type="monotone" 
                  dataKey="discounts" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="discounts"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Plan Popularity Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Subscription Plan Performance
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Plan Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Subscribers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Avg. Revenue per User
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {analytics.subscriptionAnalytics.planPopularity.map((plan: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                      {plan.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-100">
                      {plan.subscribers.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                      {formatCurrency(plan.revenue)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-100">
                      {formatCurrency(plan.revenue / plan.subscribers)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;