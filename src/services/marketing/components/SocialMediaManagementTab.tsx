import React, { useState, useEffect } from 'react';
import { MessageSquare, TrendingUp, Users, Heart, Share2, Eye, Calendar, BarChart3, Globe, Plus, Settings, RefreshCw } from 'lucide-react';

interface SocialMediaAccount {
  id: string;
  platform: 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube';
  accountName: string;
  isConnected: boolean;
  followers: number;
  lastSync: string;
}

interface SocialMediaPost {
  id: string;
  platform: string;
  content: string;
  imageUrl?: string;
  scheduledFor?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  metrics: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
    engagement: number;
  };
}

interface PlatformMetrics {
  platform: string;
  followers: number;
  posts: number;
  engagement: number;
  reach: number;
  color: string;
}

const SocialMediaManagementTab: React.FC = () => {
  const [accounts, setAccounts] = useState<SocialMediaAccount[]>([]);
  const [recentPosts, setRecentPosts] = useState<SocialMediaPost[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState<PlatformMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    loadSocialMediaData();
  }, [selectedTimeRange]);

  const loadSocialMediaData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [accountsResponse, postsResponse, metricsResponse] = await Promise.all([
      //   fetch('/api/v1/marketing/social-accounts'),
      //   fetch('/api/v1/marketing/social-posts'),
      //   fetch('/api/v1/marketing/social-metrics')
      // ]);
      
      // Mock data for demonstration
      const mockAccounts: SocialMediaAccount[] = [
        {
          id: '1',
          platform: 'facebook',
          accountName: '@WiremiFintech',
          isConnected: true,
          followers: 12500,
          lastSync: new Date().toISOString()
        },
        {
          id: '2',
          platform: 'instagram',
          accountName: '@wiremi_official',
          isConnected: true,
          followers: 8900,
          lastSync: new Date().toISOString()
        },
        {
          id: '3',
          platform: 'twitter',
          accountName: '@WiremiFintech',
          isConnected: true,
          followers: 6700,
          lastSync: new Date().toISOString()
        },
        {
          id: '4',
          platform: 'linkedin',
          accountName: 'Wiremi Fintech',
          isConnected: true,
          followers: 4200,
          lastSync: new Date().toISOString()
        },
        {
          id: '5',
          platform: 'tiktok',
          accountName: '@wiremifintech',
          isConnected: false,
          followers: 0,
          lastSync: ''
        }
      ];

      const mockPosts: SocialMediaPost[] = Array.from({ length: 10 }, (_, i) => ({
        id: `post-${i + 1}`,
        platform: ['facebook', 'instagram', 'twitter', 'linkedin'][i % 4],
        content: [
          'Exciting news! Our new virtual cards are now available. Get yours today! 💳✨',
          'Smart saving tips for young professionals. Thread 🧵👇',
          'Customer success story: How Sarah saved $10,000 in 6 months with Wiremi 📈',
          'Behind the scenes: Our AI-powered fraud detection keeps your money safe 🛡️',
          'New feature alert: Multi-currency wallets now support 15+ currencies! 🌍'
        ][i % 5],
        status: ['published', 'scheduled', 'draft'][i % 3] as any,
        publishedAt: i % 3 === 0 ? new Date(Date.now() - i * 3600000).toISOString() : undefined,
        scheduledFor: i % 3 === 1 ? new Date(Date.now() + i * 3600000).toISOString() : undefined,
        metrics: {
          likes: Math.floor(Math.random() * 500) + 50,
          shares: Math.floor(Math.random() * 100) + 10,
          comments: Math.floor(Math.random() * 50) + 5,
          views: Math.floor(Math.random() * 5000) + 500,
          engagement: Math.random() * 10 + 2
        }
      }));

      const mockMetrics: PlatformMetrics[] = [
        { platform: 'Facebook', followers: 12500, posts: 45, engagement: 8.2, reach: 45000, color: '#1877f2' },
        { platform: 'Instagram', followers: 8900, posts: 38, engagement: 12.5, reach: 32000, color: '#e4405f' },
        { platform: 'Twitter/X', followers: 6700, posts: 52, engagement: 6.8, reach: 28000, color: '#1da1f2' },
        { platform: 'LinkedIn', followers: 4200, posts: 23, engagement: 15.3, reach: 18000, color: '#0077b5' },
        { platform: 'TikTok', followers: 3100, posts: 15, engagement: 18.7, reach: 25000, color: '#000000' }
      ];

      setAccounts(mockAccounts);
      setRecentPosts(mockPosts);
      setPlatformMetrics(mockMetrics);
    } catch (error) {
      console.error('Failed to load social media data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    // Return appropriate icon for each platform
    return <MessageSquare size={20} className="text-blue-500" />;
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      published: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      draft: 'bg-gray-100 text-gray-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleConnectAccount = (platform: string) => {
    console.log(`Connecting ${platform} account`);
    // TODO: Implement OAuth flow for social media platform
    setShowConnectModal(false);
  };

  const handleSyncAccount = async (accountId: string) => {
    try {
      // TODO: Call API to sync account data
      console.log('Syncing account:', accountId);
      loadSocialMediaData();
    } catch (error) {
      console.error('Failed to sync account:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Social Media Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8" />
            <div>
              <h3 className="text-xl font-bold">Social Media Management</h3>
              <p className="text-blue-100">Monitor and manage all your social media presence</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white"
            >
              <option value="24h" className="text-gray-900">Last 24 hours</option>
              <option value="7d" className="text-gray-900">Last 7 days</option>
              <option value="30d" className="text-gray-900">Last 30 days</option>
              <option value="90d" className="text-gray-900">Last 90 days</option>
            </select>
            <button
              onClick={() => setShowConnectModal(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Connect Account
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{accounts.filter(a => a.isConnected).length}</div>
            <div className="text-sm text-blue-100">Connected Accounts</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{formatNumber(accounts.reduce((sum, acc) => sum + acc.followers, 0))}</div>
            <div className="text-sm text-blue-100">Total Followers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{recentPosts.filter(p => p.status === 'published').length}</div>
            <div className="text-sm text-blue-100">Posts Published</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">8.7%</div>
            <div className="text-sm text-blue-100">Avg Engagement</div>
          </div>
        </div>
      </div>

      {/* Platform Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {platformMetrics.map((platform, index) => (
          <div key={index} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: platform.color }}
              >
                {platform.platform.substring(0, 2).toUpperCase()}
              </div>
              <button
                onClick={() => handleSyncAccount(platform.platform)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300 p-1"
                title="Sync Data"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            
            <h4 className="font-semibold text-gray-900 dark:text-dark-100 mb-2">
              {platform.platform}
            </h4>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-400">Followers:</span>
                <span className="font-medium text-gray-900 dark:text-dark-100">
                  {formatNumber(platform.followers)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-400">Posts:</span>
                <span className="font-medium text-gray-900 dark:text-dark-100">
                  {platform.posts}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-400">Engagement:</span>
                <span className="font-medium text-green-600">
                  {platform.engagement}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-dark-400">Reach:</span>
                <span className="font-medium text-gray-900 dark:text-dark-100">
                  {formatNumber(platform.reach)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Posts Performance */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
              Recent Posts Performance
            </h4>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus size={16} className="mr-2" />
              Schedule Post
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Post Content
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Metrics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-3/4"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                  </tr>
                ))
              ) : (
                recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-dark-100 max-w-xs truncate">
                        {post.content}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                        {post.platform}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp size={16} className="text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">
                          {post.metrics.engagement.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-dark-400">
                        <div className="flex items-center">
                          <Heart size={14} className="mr-1 text-red-500" />
                          {formatNumber(post.metrics.likes)}
                        </div>
                        <div className="flex items-center">
                          <Share2 size={14} className="mr-1 text-blue-500" />
                          {formatNumber(post.metrics.shares)}
                        </div>
                        <div className="flex items-center">
                          <MessageSquare size={14} className="mr-1 text-green-500" />
                          {formatNumber(post.metrics.comments)}
                        </div>
                        <div className="flex items-center">
                          <Eye size={14} className="mr-1 text-purple-500" />
                          {formatNumber(post.metrics.views)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                      {post.publishedAt ? formatDate(post.publishedAt) : 
                       post.scheduledFor ? `Scheduled: ${formatDate(post.scheduledFor)}` : 'Draft'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                          <Eye size={16} />
                        </button>
                        <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1">
                          <BarChart3 size={16} />
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

      {/* Connect Account Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Connect Social Media Account
            </h3>
            <div className="space-y-3">
              {['Facebook', 'Instagram', 'Twitter/X', 'LinkedIn', 'TikTok', 'YouTube'].map(platform => (
                <button
                  key={platform}
                  onClick={() => handleConnectAccount(platform)}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                >
                  <span className="font-medium text-gray-900 dark:text-dark-100">{platform}</span>
                  <Plus size={16} className="text-blue-500" />
                </button>
              ))}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowConnectModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialMediaManagementTab;