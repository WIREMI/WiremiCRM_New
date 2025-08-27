import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, UserPlus, Target, DollarSign, Activity, Calendar, Globe } from 'lucide-react';

interface GrowthAnalyticsTabProps {
  stats: {
    totalCustomers: number;
    monthlyGrowthRate: number;
    activeCampaigns: number;
    conversionRate: number;
  };
}

const GrowthAnalyticsTab: React.FC<GrowthAnalyticsTabProps> = ({ stats }) => {
  // Mock data for growth analytics
  const customerGrowthData = [
    { month: 'Jan', newCustomers: 1200, totalCustomers: 18500, churnRate: 2.1 },
    { month: 'Feb', newCustomers: 1450, totalCustomers: 19800, churnRate: 1.8 },
    { month: 'Mar', newCustomers: 1680, totalCustomers: 21300, churnRate: 1.9 },
    { month: 'Apr', newCustomers: 1890, totalCustomers: 23000, churnRate: 1.6 },
    { month: 'May', newCustomers: 2100, totalCustomers: 24800, churnRate: 1.4 },
    { month: 'Jun', newCustomers: 2350, totalCustomers: 26900, churnRate: 1.2 }
  ];

  const acquisitionChannelData = [
    { channel: 'Organic Search', customers: 8500, cost: 0, color: '#10b981' },
    { channel: 'Social Media', customers: 6200, cost: 15000, color: '#3b82f6' },
    { channel: 'Paid Ads', customers: 4800, cost: 25000, color: '#f59e0b' },
    { channel: 'Referrals', customers: 3200, cost: 5000, color: '#8b5cf6' },
    { channel: 'Email Marketing', customers: 2300, cost: 3000, color: '#ef4444' }
  ];

  const cohortRetentionData = [
    { cohort: 'Jan 2024', month1: 100, month2: 85, month3: 72, month4: 65, month5: 58, month6: 52 },
    { cohort: 'Feb 2024', month1: 100, month2: 88, month3: 75, month4: 68, month5: 61 },
    { cohort: 'Mar 2024', month1: 100, month2: 90, month3: 78, month4: 71 },
    { cohort: 'Apr 2024', month1: 100, month2: 92, month3: 80 },
    { cohort: 'May 2024', month1: 100, month2: 94 },
    { cohort: 'Jun 2024', month1: 100 }
  ];

  const conversionFunnelData = [
    { stage: 'Website Visitors', count: 125000, percentage: 100 },
    { stage: 'Sign-up Started', count: 18750, percentage: 15 },
    { stage: 'Email Verified', count: 15000, percentage: 12 },
    { stage: 'KYC Completed', count: 11250, percentage: 9 },
    { stage: 'First Deposit', count: 7500, percentage: 6 },
    { stage: 'Active Users', count: 6250, percentage: 5 }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const calculateCAC = (channel: any) => {
    return channel.cost > 0 ? channel.cost / channel.customers : 0;
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Growth Overview Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Growth Analytics & Customer Acquisition</h3>
            <p className="text-emerald-100">Track customer growth, analyze acquisition channels, and optimize conversion funnels</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatNumber(stats.totalCustomers)}</div>
            <div className="text-sm text-emerald-100">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.monthlyGrowthRate}%</div>
            <div className="text-sm text-emerald-100">Monthly Growth Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <div className="text-sm text-emerald-100">Conversion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">$24.50</div>
            <div className="text-sm text-emerald-100">Avg CAC</div>
          </div>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Growth Trend */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Customer Growth Trend
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={customerGrowthData}>
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
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="newCustomers" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="New Customers"
                />
                <Line 
                  type="monotone" 
                  dataKey="totalCustomers" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Total Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Acquisition Channels */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Customer Acquisition Channels
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={acquisitionChannelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="customers"
                >
                  {acquisitionChannelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatNumber(value), 'Customers']}
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
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {acquisitionChannelData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600 dark:text-dark-400">
                  {item.channel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Acquisition Channel Performance */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
            Acquisition Channel Performance
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Customers Acquired
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Total Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  CAC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {acquisitionChannelData.map((channel, index) => {
                const cac = calculateCAC(channel);
                const roi = channel.cost > 0 ? ((channel.customers * 150) - channel.cost) / channel.cost * 100 : 0; // Assuming $150 LTV
                
                return (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: channel.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                          {channel.channel}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {formatNumber(channel.customers)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-dark-100">
                        {channel.cost > 0 ? formatCurrency(channel.cost) : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {cac > 0 ? formatCurrency(cac) : 'Free'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${roi > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                        {roi > 0 ? `${roi.toFixed(0)}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-dark-600 rounded-full h-2 mr-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${Math.min((channel.customers / Math.max(...acquisitionChannelData.map(c => c.customers))) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-dark-400">
                          {((channel.customers / acquisitionChannelData.reduce((sum, c) => sum + c.customers, 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Customer Conversion Funnel
        </h4>
        <div className="space-y-4">
          {conversionFunnelData.map((stage, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                  {stage.stage}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600 dark:text-dark-400">
                    {formatNumber(stage.count)}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                    {stage.percentage}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-indigo-500' :
                    index === 2 ? 'bg-purple-500' :
                    index === 3 ? 'bg-pink-500' :
                    index === 4 ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
              {index < conversionFunnelData.length - 1 && (
                <div className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                  Drop-off: {((conversionFunnelData[index].count - conversionFunnelData[index + 1].count) / conversionFunnelData[index].count * 100).toFixed(1)}%
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Cohort Retention Analysis */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Customer Retention Cohort Analysis
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Cohort
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Month 1
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Month 2
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Month 3
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Month 4
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Month 5
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Month 6
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {cohortRetentionData.map((cohort, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-100">
                    {cohort.cohort}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                      {cohort.month1}%
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cohort.month2 && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        cohort.month2 >= 80 ? 'bg-green-100 text-green-800' :
                        cohort.month2 >= 60 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month2}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cohort.month3 && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        cohort.month3 >= 70 ? 'bg-green-100 text-green-800' :
                        cohort.month3 >= 50 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month3}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cohort.month4 && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        cohort.month4 >= 60 ? 'bg-green-100 text-green-800' :
                        cohort.month4 >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month4}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cohort.month5 && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        cohort.month5 >= 50 ? 'bg-green-100 text-green-800' :
                        cohort.month5 >= 30 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month5}%
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {cohort.month6 && (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${
                        cohort.month6 >= 45 ? 'bg-green-100 text-green-800' :
                        cohort.month6 >= 25 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {cohort.month6}%
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Growth Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <UserPlus className="w-6 h-6 text-blue-500" />
            <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
              Customer Acquisition
            </h5>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">This Month:</span>
              <span className="font-bold text-green-600">+2,350</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Growth Rate:</span>
              <span className="font-bold text-blue-600">{stats.monthlyGrowthRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Target:</span>
              <span className="font-bold text-gray-900 dark:text-dark-100">2,500</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${(2350 / 2500) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-6 h-6 text-green-500" />
            <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
              Engagement Metrics
            </h5>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Active Users:</span>
              <span className="font-bold text-green-600">18,945</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Engagement Rate:</span>
              <span className="font-bold text-blue-600">76.8%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Session Duration:</span>
              <span className="font-bold text-gray-900 dark:text-dark-100">8.5 min</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-6 h-6 text-purple-500" />
            <h5 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
              Conversion Optimization
            </h5>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Conversion Rate:</span>
              <span className="font-bold text-purple-600">{stats.conversionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">A/B Tests Running:</span>
              <span className="font-bold text-blue-600">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Avg. Time to Convert:</span>
              <span className="font-bold text-gray-900 dark:text-dark-100">3.2 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GrowthAnalyticsTab;