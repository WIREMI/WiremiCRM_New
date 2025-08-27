import React, { useState, useEffect } from 'react';
import { Megaphone, Search, TrendingUp, Target, DollarSign, BarChart3, Globe, Plus, Settings, Play, Pause, Edit, Eye } from 'lucide-react';

interface GoogleAdsAccount {
  id: string;
  accountName: string;
  accountId: string;
  isConnected: boolean;
  currency: string;
  timeZone: string;
}

interface AdCampaign {
  id: string;
  name: string;
  type: 'search' | 'display' | 'video' | 'shopping';
  status: 'active' | 'paused' | 'ended' | 'draft';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  ctr: number;
  cpc: number;
  conversionRate: number;
  startDate: string;
  endDate?: string;
  keywords?: string[];
}

interface SEOKeyword {
  keyword: string;
  searchVolume: number;
  competition: 'low' | 'medium' | 'high';
  cpc: number;
  difficulty: number;
}

const AdvertisementOperationsTab: React.FC = () => {
  const [googleAdsAccounts, setGoogleAdsAccounts] = useState<GoogleAdsAccount[]>([]);
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>([]);
  const [seoKeywords, setSeoKeywords] = useState<SEOKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'google-ads' | 'seo' | 'brand'>('google-ads');
  const [showCreateAdModal, setShowCreateAdModal] = useState(false);
  const [keywordResearchQuery, setKeywordResearchQuery] = useState('');
  const [isResearchingKeywords, setIsResearchingKeywords] = useState(false);

  useEffect(() => {
    loadAdvertisementData();
  }, []);

  const loadAdvertisementData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [adsResponse, campaignsResponse, keywordsResponse] = await Promise.all([
      //   fetch('/api/v1/marketing/google-ads/accounts'),
      //   fetch('/api/v1/marketing/google-ads/campaigns'),
      //   fetch('/api/v1/marketing/seo/keywords')
      // ]);
      
      // Mock data for demonstration
      const mockGoogleAdsAccounts: GoogleAdsAccount[] = [
        {
          id: 'ads-1',
          accountName: 'Wiremi Fintech - Main',
          accountId: '123-456-7890',
          isConnected: true,
          currency: 'USD',
          timeZone: 'America/New_York'
        }
      ];

      const mockAdCampaigns: AdCampaign[] = [
        {
          id: 'ad-camp-1',
          name: 'Savings Account - Search Campaign',
          type: 'search',
          status: 'active',
          budget: 2000,
          spent: 1250,
          impressions: 45000,
          clicks: 1200,
          conversions: 89,
          ctr: 2.67,
          cpc: 1.04,
          conversionRate: 7.42,
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-02-15T00:00:00Z',
          keywords: ['savings account', 'high yield savings', 'online banking', 'digital wallet']
        },
        {
          id: 'ad-camp-2',
          name: 'Virtual Cards - Display Campaign',
          type: 'display',
          status: 'active',
          budget: 1500,
          spent: 890,
          impressions: 125000,
          clicks: 2100,
          conversions: 156,
          ctr: 1.68,
          cpc: 0.42,
          conversionRate: 7.43,
          startDate: '2024-01-10T00:00:00Z',
          endDate: '2024-02-10T00:00:00Z'
        },
        {
          id: 'ad-camp-3',
          name: 'Mobile App - Video Campaign',
          type: 'video',
          status: 'paused',
          budget: 3000,
          spent: 1800,
          impressions: 89000,
          clicks: 1500,
          conversions: 67,
          ctr: 1.69,
          cpc: 1.20,
          conversionRate: 4.47,
          startDate: '2024-01-05T00:00:00Z',
          endDate: '2024-02-05T00:00:00Z'
        }
      ];

      const mockSEOKeywords: SEOKeyword[] = [
        { keyword: 'digital banking', searchVolume: 12000, competition: 'high', cpc: 2.45, difficulty: 78 },
        { keyword: 'virtual credit card', searchVolume: 8900, competition: 'medium', cpc: 1.89, difficulty: 65 },
        { keyword: 'online savings account', searchVolume: 15600, competition: 'high', cpc: 3.12, difficulty: 82 },
        { keyword: 'fintech app', searchVolume: 6700, competition: 'medium', cpc: 1.67, difficulty: 58 },
        { keyword: 'mobile banking', searchVolume: 22000, competition: 'high', cpc: 2.98, difficulty: 85 }
      ];

      setGoogleAdsAccounts(mockGoogleAdsAccounts);
      setAdCampaigns(mockAdCampaigns);
      setSeoKeywords(mockSEOKeywords);
    } catch (error) {
      console.error('Failed to load advertisement data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAdTypeBadge = (type: string) => {
    const colors = {
      search: 'bg-blue-100 text-blue-800',
      display: 'bg-green-100 text-green-800',
      video: 'bg-purple-100 text-purple-800',
      shopping: 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800',
      ended: 'bg-gray-100 text-gray-800',
      draft: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getCompetitionBadge = (competition: string) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    return colors[competition as keyof typeof colors] || 'bg-gray-100 text-gray-800';
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

  const handleKeywordResearch = async () => {
    if (!keywordResearchQuery.trim()) {
      alert('Please enter a keyword to research.');
      return;
    }

    setIsResearchingKeywords(true);
    try {
      // TODO: Call keyword research API
      console.log('Researching keywords for:', keywordResearchQuery);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock additional keywords
      const newKeywords: SEOKeyword[] = [
        { keyword: keywordResearchQuery, searchVolume: Math.floor(Math.random() * 20000) + 1000, competition: 'medium', cpc: Math.random() * 3 + 0.5, difficulty: Math.floor(Math.random() * 40) + 40 },
        { keyword: `${keywordResearchQuery} app`, searchVolume: Math.floor(Math.random() * 10000) + 500, competition: 'low', cpc: Math.random() * 2 + 0.3, difficulty: Math.floor(Math.random() * 30) + 30 },
        { keyword: `best ${keywordResearchQuery}`, searchVolume: Math.floor(Math.random() * 15000) + 800, competition: 'high', cpc: Math.random() * 4 + 1, difficulty: Math.floor(Math.random() * 50) + 50 }
      ];

      setSeoKeywords(prev => [...newKeywords, ...prev]);
      setKeywordResearchQuery('');
    } catch (error) {
      console.error('Keyword research failed:', error);
    } finally {
      setIsResearchingKeywords(false);
    }
  };

  const handleCampaignAction = async (campaignId: string, action: 'play' | 'pause') => {
    try {
      // TODO: Call Google Ads API
      console.log(`${action} campaign:`, campaignId);
      
      setAdCampaigns(prev => prev.map(campaign =>
        campaign.id === campaignId 
          ? { ...campaign, status: action === 'play' ? 'active' : 'paused' }
          : campaign
      ));
    } catch (error) {
      console.error(`Failed to ${action} campaign:`, error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Advertisement Operations Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3 mb-4">
          <Megaphone className="w-8 h-8" />
          <div>
            <h3 className="text-xl font-bold">Advertisement Operations</h3>
            <p className="text-orange-100">Manage Google Ads, SEO, and brand positioning</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{adCampaigns.filter(c => c.status === 'active').length}</div>
            <div className="text-sm text-orange-100">Active Ad Campaigns</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatCurrency(adCampaigns.reduce((sum, c) => sum + c.spent, 0))}
            </div>
            <div className="text-sm text-orange-100">Total Ad Spend</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {formatNumber(adCampaigns.reduce((sum, c) => sum + c.clicks, 0))}
            </div>
            <div className="text-sm text-orange-100">Total Clicks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {adCampaigns.reduce((sum, c) => sum + c.conversions, 0)}
            </div>
            <div className="text-sm text-orange-100">Total Conversions</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'google-ads', label: 'Google Ads', icon: Megaphone },
              { id: 'seo', label: 'SEO & Keywords', icon: Search },
              { id: 'brand', label: 'Brand Positioning', icon: TrendingUp }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
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
          {activeTab === 'google-ads' && (
            <div className="space-y-6">
              {/* Google Ads Account Status */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                    Google Ads Accounts
                  </h4>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                    <Plus size={16} className="mr-2" />
                    Connect Account
                  </button>
                </div>
                
                {googleAdsAccounts.map((account) => (
                  <div key={account.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-dark-100">{account.accountName}</h5>
                        <p className="text-sm text-gray-600 dark:text-dark-400">ID: {account.accountId}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                          Connected
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300 p-1">
                          <Settings size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ad Campaigns */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                    Google Ads Campaigns
                  </h4>
                  <button
                    onClick={() => setShowCreateAdModal(true)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                  >
                    <Plus size={16} className="mr-2" />
                    Create Ad Campaign
                  </button>
                </div>

                <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-dark-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                            Campaign
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                            Type
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
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                        {adCampaigns.map((campaign) => (
                          <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                            <td className="px-6 py-4">
                              <div>
                                <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                                  {campaign.name}
                                </div>
                                {campaign.keywords && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {campaign.keywords.slice(0, 3).map((keyword, index) => (
                                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                        {keyword}
                                      </span>
                                    ))}
                                    {campaign.keywords.length > 3 && (
                                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                                        +{campaign.keywords.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAdTypeBadge(campaign.type)}`}>
                                {campaign.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(campaign.status)}`}>
                                {campaign.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-dark-100">
                                <div className="font-medium">
                                  {formatCurrency(campaign.spent)} / {formatCurrency(campaign.budget)}
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-1.5 mt-1">
                                  <div 
                                    className="bg-orange-600 h-1.5 rounded-full" 
                                    style={{ width: `${Math.min((campaign.spent / campaign.budget) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                <div className="flex items-center space-x-4 text-sm">
                                  <div>
                                    <span className="text-gray-600 dark:text-dark-400">CTR:</span>
                                    <span className="font-medium text-gray-900 dark:text-dark-100 ml-1">
                                      {campaign.ctr.toFixed(2)}%
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600 dark:text-dark-400">CPC:</span>
                                    <span className="font-medium text-gray-900 dark:text-dark-100 ml-1">
                                      {formatCurrency(campaign.cpc)}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-xs text-gray-500 dark:text-dark-400">
                                  {campaign.conversions} conversions • {campaign.conversionRate.toFixed(2)}% rate
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
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
                                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                                  <BarChart3 size={16} />
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
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* Keyword Research */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                  Keyword Research
                </h4>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={keywordResearchQuery}
                    onChange={(e) => setKeywordResearchQuery(e.target.value)}
                    placeholder="Enter keyword to research (e.g., 'digital banking')"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                    onKeyPress={(e) => e.key === 'Enter' && handleKeywordResearch()}
                  />
                  <button
                    onClick={handleKeywordResearch}
                    disabled={isResearchingKeywords || !keywordResearchQuery.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    {isResearchingKeywords ? (
                      <>
                        <Search size={16} className="mr-2 animate-spin" />
                        Researching...
                      </>
                    ) : (
                      <>
                        <Search size={16} className="mr-2" />
                        Research Keywords
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Keywords Table */}
              <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
                <div className="p-6 border-b border-gray-200 dark:border-dark-700">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                    SEO Keywords Analysis
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-dark-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Keyword
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Search Volume
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Competition
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          CPC
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Difficulty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                      {seoKeywords.map((keyword, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                              {keyword.keyword}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-dark-100">
                              {formatNumber(keyword.searchVolume)}/month
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCompetitionBadge(keyword.competition)}`}>
                              {keyword.competition}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                              {formatCurrency(keyword.cpc)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 dark:bg-dark-600 rounded-full h-2 mr-2">
                                <div 
                                  className={`h-2 rounded-full ${
                                    keyword.difficulty >= 80 ? 'bg-red-500' :
                                    keyword.difficulty >= 60 ? 'bg-yellow-500' :
                                    keyword.difficulty >= 40 ? 'bg-blue-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${keyword.difficulty}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-900 dark:text-dark-100">
                                {keyword.difficulty}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                              Add to Campaign
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'seo' && seoKeywords.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">No Keywords Researched Yet</h3>
              <p className="text-gray-500 dark:text-dark-400 mb-4">
                Start by researching keywords relevant to your business
              </p>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">Brand Positioning Tools</h3>
              <p className="text-gray-500 dark:text-dark-400">
                Brand monitoring and positioning tools will be implemented here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ad Campaign Modal */}
      {showCreateAdModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Create Google Ads Campaign
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Google Ads campaign creation form will be implemented here with fields for campaign type, keywords, budget, targeting, and ad creatives.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateAdModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateAdModal(false)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisementOperationsTab;