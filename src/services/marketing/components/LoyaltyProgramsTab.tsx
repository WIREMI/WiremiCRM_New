import React, { useState, useEffect } from 'react';
import { Gift, Star, Award, Users, TrendingUp, DollarSign, Target, Plus, Edit, Eye, Settings, BarChart3 } from 'lucide-react';

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  type: 'points' | 'cashback' | 'tier' | 'referral';
  status: 'active' | 'inactive' | 'draft';
  participants: number;
  totalRewards: number;
  conversionRate: number;
  createdAt: string;
}

interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  cashValue: number;
  category: string;
  availability: number;
  claimed: number;
  isActive: boolean;
}

interface LoyaltyProgramsTabProps {
  stats: {
    loyaltyMembers: number;
    rewardsDistributed: number;
  };
}

const LoyaltyProgramsTab: React.FC<LoyaltyProgramsTabProps> = ({ stats }) => {
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgram[]>([]);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<'programs' | 'rewards' | 'analytics'>('programs');
  const [showCreateProgramModal, setShowCreateProgramModal] = useState(false);
  const [showCreateRewardModal, setShowCreateRewardModal] = useState(false);

  useEffect(() => {
    loadLoyaltyData();
  }, []);

  const loadLoyaltyData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [programsResponse, rewardsResponse] = await Promise.all([
      //   fetch('/api/v1/marketing/loyalty/programs'),
      //   fetch('/api/v1/marketing/loyalty/rewards')
      // ]);
      
      // Mock data for demonstration
      const mockPrograms: LoyaltyProgram[] = [
        {
          id: 'prog-1',
          name: 'Wiremi Rewards',
          description: 'Earn points for every transaction and referral',
          type: 'points',
          status: 'active',
          participants: 8934,
          totalRewards: 125000,
          conversionRate: 15.2,
          createdAt: '2024-01-01T00:00:00Z'
        },
        {
          id: 'prog-2',
          name: 'Cashback Plus',
          description: 'Get cashback on virtual card transactions',
          type: 'cashback',
          status: 'active',
          participants: 5678,
          totalRewards: 89000,
          conversionRate: 22.8,
          createdAt: '2024-01-15T00:00:00Z'
        },
        {
          id: 'prog-3',
          name: 'VIP Tier Program',
          description: 'Exclusive benefits for high-value customers',
          type: 'tier',
          status: 'active',
          participants: 1234,
          totalRewards: 45000,
          conversionRate: 8.7,
          createdAt: '2024-02-01T00:00:00Z'
        }
      ];

      const mockRewards: RewardItem[] = [
        {
          id: 'reward-1',
          name: 'Amazon Gift Card $25',
          description: '$25 Amazon gift card for online shopping',
          pointsCost: 2500,
          cashValue: 25,
          category: 'Gift Cards',
          availability: 1000,
          claimed: 234,
          isActive: true
        },
        {
          id: 'reward-2',
          name: 'Netflix Subscription (1 Month)',
          description: 'One month Netflix premium subscription',
          pointsCost: 1500,
          cashValue: 15.99,
          category: 'Entertainment',
          availability: 500,
          claimed: 89,
          isActive: true
        },
        {
          id: 'reward-3',
          name: 'Starbucks Gift Card $10',
          description: '$10 Starbucks gift card',
          pointsCost: 1000,
          cashValue: 10,
          category: 'Food & Beverage',
          availability: 2000,
          claimed: 567,
          isActive: true
        },
        {
          id: 'reward-4',
          name: 'Uber Ride Credit $20',
          description: '$20 credit for Uber rides',
          pointsCost: 2000,
          cashValue: 20,
          category: 'Transportation',
          availability: 800,
          claimed: 123,
          isActive: true
        }
      ];

      setLoyaltyPrograms(mockPrograms);
      setRewardItems(mockRewards);
    } catch (error) {
      console.error('Failed to load loyalty data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      points: 'bg-blue-100 text-blue-800',
      cashback: 'bg-green-100 text-green-800',
      tier: 'bg-purple-100 text-purple-800',
      referral: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Loyalty Programs Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Gift className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Loyalty & Rewards Programs</h3>
            <p className="text-amber-100">Engage customers with points, cashback, and exclusive rewards</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{formatNumber(stats.loyaltyMembers)}</div>
            <div className="text-sm text-amber-100">Loyalty Members</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatNumber(stats.rewardsDistributed)}</div>
            <div className="text-sm text-amber-100">Rewards Distributed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">87.3%</div>
            <div className="text-sm text-amber-100">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">$156K</div>
            <div className="text-sm text-amber-100">Total Value Distributed</div>
          </div>
        </div>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'programs', label: 'Loyalty Programs', icon: Gift },
              { id: 'rewards', label: 'Reward Catalog', icon: Star },
              { id: 'analytics', label: 'Program Analytics', icon: BarChart3 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeSubTab === tab.id
                      ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeSubTab === 'programs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                  Active Loyalty Programs
                </h4>
                <button
                  onClick={() => setShowCreateProgramModal(true)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Create Program
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loyaltyPrograms.map((program) => (
                  <div key={program.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Gift className="w-8 h-8 text-amber-500" />
                        <div>
                          <h5 className="text-lg font-bold text-gray-900 dark:text-dark-100">
                            {program.name}
                          </h5>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(program.type)}`}>
                            {program.type}
                          </span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                          <Edit size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 p-1">
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-dark-400 text-sm mb-4">
                      {program.description}
                    </p>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-dark-400">Participants:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100">
                          {formatNumber(program.participants)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-dark-400">Total Rewards:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100">
                          {formatCurrency(program.totalRewards)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-dark-400">Conversion Rate:</span>
                        <span className="font-medium text-green-600">
                          {program.conversionRate}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(program.status)}`}>
                          {program.status}
                        </span>
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === 'rewards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                  Reward Catalog
                </h4>
                <button
                  onClick={() => setShowCreateRewardModal(true)}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
                >
                  <Plus size={16} className="mr-2" />
                  Add Reward
                </button>
              </div>

              <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-dark-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Reward
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Points Cost
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Cash Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Availability
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                      {rewardItems.map((reward) => (
                        <tr key={reward.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <Star className="w-5 h-5 text-amber-500" />
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                                  {reward.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-dark-400">
                                  {reward.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {reward.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                              {reward.pointsCost.toLocaleString()} pts
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-green-600">
                              {formatCurrency(reward.cashValue)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-dark-100">
                              <div>{reward.availability - reward.claimed} available</div>
                              <div className="text-xs text-gray-500 dark:text-dark-400">
                                {reward.claimed} claimed
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              reward.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {reward.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                                <Eye size={16} />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1">
                                <Edit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === 'analytics' && (
            <div className="space-y-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                Loyalty Program Analytics
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Total Members</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                        {formatNumber(stats.loyaltyMembers)}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                      <Users size={24} className="text-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Avg Points per User</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">2,450</p>
                    </div>
                    <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Star size={24} className="text-blue-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Redemption Rate</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">23.8%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                      <Target size={24} className="text-green-500" />
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Program ROI</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">340%</p>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                      <TrendingUp size={24} className="text-purple-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center py-12">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-gray-500 dark:text-dark-400">
                  Detailed loyalty program analytics and insights will be available here
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Program Modal */}
      {showCreateProgramModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Create Loyalty Program
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Loyalty program creation form will be implemented here with fields for program type, rules, rewards structure, and eligibility criteria.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateProgramModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateProgramModal(false)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Create Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Reward Modal */}
      {showCreateRewardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Add New Reward
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Reward creation form will be implemented here with fields for reward name, description, points cost, category, and availability.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateRewardModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateRewardModal(false)}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Add Reward
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoyaltyProgramsTab;