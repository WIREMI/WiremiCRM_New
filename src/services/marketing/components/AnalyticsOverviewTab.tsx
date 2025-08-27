import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Target, DollarSign, Eye, MessageSquare, Share2, Heart } from 'lucide-react';

interface AnalyticsOverviewTabProps {
  stats: {
    activeCampaigns: number;
    totalReach: number;
    engagementRate: number;
    conversionRate: number;
    aiContentGenerated: number;
    pendingApprovals: number;
  };
}

const AnalyticsOverviewTab: React.FC<AnalyticsOverviewTabProps> = ({ stats }) => {
  // Mock data for charts
  const campaignPerformanceData = [
    { name: 'Jan', reach: 45000, engagement: 3200, conversions: 156 },
    { name: 'Feb', reach: 52000, engagement: 4100, conversions: 189 },
    { name: 'Mar', reach: 48000, engagement: 3800, conversions: 167 },
    { name: 'Apr', reach: 61000, engagement: 5200, conversions: 234 },
    { name: 'May', reach: 58000, engagement: 4900, conversions: 198 },
    { name: 'Jun', reach: 65000, engagement: 5600, conversions: 267 }
  ];

  const socialMediaData = [
    { platform: 'Facebook', followers: 12500, engagement: 8.2, color: '#1877f2' },
    { platform: 'Instagram', followers: 8900, engagement: 12.5, color: '#e4405f' },
    { platform: 'Twitter/X', followers: 6700, engagement: 6.8, color: '#1da1f2' },
    { platform: 'LinkedIn', followers: 4200, engagement: 15.3, color: '#0077b5' },
    { platform: 'TikTok', followers: 3100, engagement: 18.7, color: '#000000' }
  ];

  const contentTypeData = [
    { name: 'Video Content', value: 35, color: '#3b82f6' },
    { name: 'Image Posts', value: 28, color: '#10b981' },
    { name: 'Text Posts', value: 22, color: '#f59e0b' },
    { name: 'Stories', value: 15, color: '#8b5cf6' }
  ];

  const recentCampaigns = [
    {
      id: 1,
      name: 'Summer Savings Campaign',
      status: 'active',
      reach: 45000,
      engagement: 8.2,
      budget: 5000,
      spent: 3200,
      conversions: 156
    },
    {
      id: 2,
      name: 'Virtual Card Launch',
      status: 'completed',
      reach: 32000,
      engagement: 12.5,
      budget: 3000,
      spent: 2800,
      conversions: 89
    },
    {
      id: 3,
      name: 'Mobile App Promotion',
      status: 'active',
      reach: 28000,
      engagement: 6.8,
      budget: 4000,
      spent: 1500,
      conversions: 67
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      paused: 'bg-yellow-100 text-yellow-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Marketing Performance Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">Marketing Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{(stats.totalReach / 1000).toFixed(0)}K</div>
            <div className="text-sm opacity-90">Total Reach</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{stats.engagementRate}%</div>
            <div className="text-sm opacity-90">Engagement Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{stats.conversionRate}%</div>
            <div className="text-sm opacity-90">Conversion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{stats.activeCampaigns}</div>
            <div className="text-sm opacity-90">Active Campaigns</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Campaign Performance Trend */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Campaign Performance Trend
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
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
                  dataKey="reach" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="Reach"
                />
                <Line 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Engagement"
                />
                <Line 
                  type="monotone" 
                  dataKey="conversions" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                  name="Conversions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Type Distribution */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Content Type Performance
          </h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {contentTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Performance']}
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
            {contentTypeData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600 dark:text-dark-400">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Performance */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Social Media Platform Performance
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {socialMediaData.map((platform, index) => (
            <div key={index} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 text-center">
              <div 
                className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: platform.color }}
              >
                {platform.platform.substring(0, 2).toUpperCase()}
              </div>
              <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-2">
                {platform.platform}
              </h5>
              <div className="space-y-1">
                <div className="text-sm text-gray-600 dark:text-dark-400">
                  {platform.followers.toLocaleString()} followers
                </div>
                <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                  {platform.engagement}% engagement
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
            Recent Campaigns
          </h4>
          <button
            onClick={handleCreateCampaign}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All Campaigns
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Reach
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Conversions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {recentCampaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                      {campaign.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">
                    {campaign.reach.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">
                    {campaign.engagement}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-100">
                      {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-100">
                    {campaign.conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Content Generation Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            AI Content Generation Summary
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-dark-100">Text Content</span>
              </div>
              <span className="text-sm font-bold text-purple-600">89 generated</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Video className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-dark-100">Video Content</span>
              </div>
              <span className="text-sm font-bold text-blue-600">34 generated</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Image className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-dark-100">Graphics & Flyers</span>
              </div>
              <span className="text-sm font-bold text-green-600">33 generated</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Approval Workflow Status
          </h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-dark-100">Pending Approval</span>
              </div>
              <span className="text-sm font-bold text-yellow-600">{stats.pendingApprovals}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-dark-100">Approved Today</span>
              </div>
              <span className="text-sm font-bold text-green-600">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-900 dark:text-dark-100">Rejected</span>
              </div>
              <span className="text-sm font-bold text-red-600">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverviewTab;