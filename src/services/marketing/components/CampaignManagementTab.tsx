import React, { useState, useEffect } from 'react';
import { Target, Plus, Play, Pause, Edit, Trash2, BarChart3, Users, DollarSign, Calendar, TrendingUp, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  objective: string;
  targetAudience: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate?: string;
  metrics: {
    reach: number;
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cpc: number;
    roas: number;
  };
  platforms: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

const CampaignManagementTab: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    objective: '',
    platform: ''
  });

  useEffect(() => {
    loadCampaigns();
  }, [filters]);

  const loadCampaigns = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/marketing/campaigns?' + new URLSearchParams(filters));
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockCampaigns: Campaign[] = [
        {
          id: 'camp-1',
          name: 'Summer Savings Campaign',
          description: 'Promote savings accounts for summer vacation planning',
          status: 'active',
          objective: 'Lead Generation',
          targetAudience: 'Young professionals aged 25-35',
          budget: 5000,
          spent: 3200,
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-02-15T00:00:00Z',
          metrics: {
            reach: 45000,
            impressions: 125000,
            clicks: 2800,
            conversions: 156,
            ctr: 2.24,
            cpc: 1.14,
            roas: 4.2
          },
          platforms: ['Facebook', 'Instagram', 'Google Ads'],
          createdBy: 'marketing-manager',
          createdAt: '2024-01-10T00:00:00Z',
          updatedAt: '2024-01-20T00:00:00Z'
        },
        {
          id: 'camp-2',
          name: 'Virtual Card Launch',
          description: 'Launch campaign for new virtual card features',
          status: 'completed',
          objective: 'Product Awareness',
          targetAudience: 'Existing customers and tech-savvy users',
          budget: 3000,
          spent: 2800,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-01-14T00:00:00Z',
          metrics: {
            reach: 32000,
            impressions: 89000,
            clicks: 1900,
            conversions: 89,
            ctr: 2.13,
            cpc: 1.47,
            roas: 3.8
          },
          platforms: ['LinkedIn', 'Twitter/X', 'Google Ads'],
          createdBy: 'product-manager',
          createdAt: '2023-12-28T00:00:00Z',
          updatedAt: '2024-01-14T00:00:00Z'
        },
        {
          id: 'camp-3',
          name: 'Mobile App Promotion',
          description: 'Drive mobile app downloads and engagement',
          status: 'paused',
          objective: 'App Downloads',
          targetAudience: 'Mobile-first users aged 18-45',
          budget: 4000,
          spent: 1500,
          startDate: '2024-01-20T00:00:00Z',
          endDate: '2024-02-20T00:00:00Z',
          metrics: {
            reach: 28000,
            impressions: 67000,
            clicks: 1200,
            conversions: 67,
            ctr: 1.79,
            cpc: 1.25,
            roas: 2.9
          },
          platforms: ['Facebook', 'Instagram', 'TikTok'],
          createdBy: 'marketing-manager',
          createdAt: '2024-01-18T00:00:00Z',
          updatedAt: '2024-01-21T00:00:00Z'
        }
      ];

      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="w-4 h-4 text-green-500" />;
      case 'paused':
        return <Pause className="w-4 h-4 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleCampaignAction = async (campaignId: string, action: 'play' | 'pause' | 'stop') => {
    try {
      // TODO: Call API to update campaign status
      console.log(`${action} campaign:`, campaignId);
      
      const statusMap = {
        play: 'active',
        pause: 'paused',
        stop: 'cancelled'
      };

      setCampaigns(prev => prev.map(campaign =>
        campaign.id === campaignId 
          ? { ...campaign, status: statusMap[action] as any, updatedAt: new Date().toISOString() }
          : campaign
      ));
    } catch (error) {
      console.error(`Failed to ${action} campaign:`, error);
    }
  };

  const handleViewCampaign = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowDetailModal(true);
  };

  const getBudgetUtilization = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Target className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Campaign Management</h3>
            <p className="text-green-100">Create, manage, and optimize your marketing campaigns</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</div>
            <div className="text-sm text-green-100">Active Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatCurrency(campaigns.reduce((sum, c) => sum + c.spent, 0))}
            </div>
            <div className="text-sm text-green-100">Total Spent</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatNumber(campaigns.reduce((sum, c) => sum + c.metrics.reach, 0))}
            </div>
            <div className="text-sm text-green-100">Total Reach</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {campaigns.reduce((sum, c) => sum + c.metrics.conversions, 0)}
            </div>
            <div className="text-sm text-green-100">Total Conversions</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
            Campaign Dashboard
          </h4>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Create Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Objective
            </label>
            <select
              value={filters.objective}
              onChange={(e) => setFilters(prev => ({ ...prev, objective: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Objectives</option>
              <option value="Brand Awareness">Brand Awareness</option>
              <option value="Lead Generation">Lead Generation</option>
              <option value="Product Awareness">Product Awareness</option>
              <option value="App Downloads">App Downloads</option>
              <option value="Customer Retention">Customer Retention</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Platform
            </label>
            <select
              value={filters.platform}
              onChange={(e) => setFilters(prev => ({ ...prev, platform: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Platforms</option>
              <option value="Facebook">Facebook</option>
              <option value="Instagram">Instagram</option>
              <option value="Google Ads">Google Ads</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter/X">Twitter/X</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
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
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Platforms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-28"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                  </tr>
                ))
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Target className="w-5 h-5 text-blue-500" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                            {campaign.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-dark-400">
                            {campaign.objective}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(campaign.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(campaign.status)}`}>
                          {campaign.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        <div className="font-medium">
                          {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${getBudgetUtilization(campaign.spent, campaign.budget)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                          {getBudgetUtilization(campaign.spent, campaign.budget).toFixed(1)}% utilized
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center">
                            <Users size={14} className="mr-1 text-blue-500" />
                            {formatNumber(campaign.metrics.reach)}
                          </div>
                          <div className="flex items-center">
                            <TrendingUp size={14} className="mr-1 text-green-500" />
                            {campaign.metrics.ctr.toFixed(2)}%
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-dark-400">
                          {campaign.metrics.conversions} conversions • ROAS: {campaign.metrics.roas.toFixed(1)}x
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {campaign.platforms.slice(0, 2).map((platform, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            {platform}
                          </span>
                        ))}
                        {campaign.platforms.length > 2 && (
                          <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            +{campaign.platforms.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                      <div>
                        {formatDate(campaign.startDate)}
                      </div>
                      {campaign.endDate && (
                        <div className="text-xs">
                          to {formatDate(campaign.endDate)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCampaign(campaign)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          title="View Details"
                        >
                          <BarChart3 size={16} />
                        </button>
                        {campaign.status === 'active' && (
                          <button
                            onClick={() => handleCampaignAction(campaign.id, 'pause')}
                            className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 p-1"
                            title="Pause Campaign"
                          >
                            <Pause size={16} />
                          </button>
                        )}
                        {campaign.status === 'paused' && (
                          <button
                            onClick={() => handleCampaignAction(campaign.id, 'play')}
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                            title="Resume Campaign"
                          >
                            <Play size={16} />
                          </button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Create New Campaign
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Campaign creation form will be implemented here with fields for name, objective, target audience, budget, platforms, and scheduling.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign Detail Modal */}
      {selectedCampaign && showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                Campaign Details: {selectedCampaign.name}
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">Campaign Information</h4>
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Objective:</span>
                      <span className="font-medium text-gray-900 dark:text-dark-100">{selectedCampaign.objective}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Target Audience:</span>
                      <span className="font-medium text-gray-900 dark:text-dark-100">{selectedCampaign.targetAudience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Created By:</span>
                      <span className="font-medium text-gray-900 dark:text-dark-100">{selectedCampaign.createdBy}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">Budget & Spend</h4>
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 dark:text-dark-400">Budget Utilization:</span>
                      <span className="font-medium text-gray-900 dark:text-dark-100">
                        {getBudgetUtilization(selectedCampaign.spent, selectedCampaign.budget).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getBudgetUtilization(selectedCampaign.spent, selectedCampaign.budget)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-dark-400">
                        Spent: {formatCurrency(selectedCampaign.spent)}
                      </span>
                      <span className="text-gray-600 dark:text-dark-400">
                        Budget: {formatCurrency(selectedCampaign.budget)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">Performance Metrics</h4>
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">
                          {formatNumber(selectedCampaign.metrics.reach)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-dark-400">Reach</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-green-600">
                          {selectedCampaign.metrics.conversions}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-dark-400">Conversions</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-purple-600">
                          {selectedCampaign.metrics.ctr.toFixed(2)}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-dark-400">CTR</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-orange-600">
                          {selectedCampaign.metrics.roas.toFixed(1)}x
                        </div>
                        <div className="text-xs text-gray-600 dark:text-dark-400">ROAS</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">Active Platforms</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCampaign.platforms.map((platform, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignManagementTab;