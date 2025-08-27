import React, { useState, useEffect } from 'react';
import { TrendingUp, Megaphone, Target, BarChart3, Users, Zap, Brain, Video, Image, MessageSquare, Calendar, DollarSign, Eye, Plus, Settings, Play, Pause, Edit, Trash2, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';
import AIContentGenerationTab from './components/AIContentGenerationTab';
import SocialMediaManagementTab from './components/SocialMediaManagementTab';
import CampaignManagementTab from './components/CampaignManagementTab';
import AdvertisementOperationsTab from './components/AdvertisementOperationsTab';
import TeamCollaborationTab from './components/TeamCollaborationTab';
import AnalyticsOverviewTab from './components/AnalyticsOverviewTab';

const MarketingAdvertisementPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalReach: 0,
    engagementRate: 0,
    conversionRate: 0,
    aiContentGenerated: 0,
    pendingApprovals: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadMarketingStats();
  }, []);

  const loadMarketingStats = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const response = await fetch('/api/v1/marketing/stats');
      // const data = await response.json();
      
      // Mock data for demonstration
      setStats({
        activeCampaigns: 12,
        totalReach: 245000,
        engagementRate: 8.7,
        conversionRate: 3.2,
        aiContentGenerated: 156,
        pendingApprovals: 8
      });
    } catch (error) {
      console.error('Failed to load marketing stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Analytics Overview', icon: BarChart3 },
    { id: 'ai-content', label: 'AI Content Generation', icon: Brain },
    { id: 'social-media', label: 'Social Media Management', icon: MessageSquare },
    { id: 'campaigns', label: 'Campaign Management', icon: Target },
    { id: 'advertisements', label: 'Advertisement Operations', icon: Megaphone },
    { id: 'team', label: 'Team Collaboration', icon: Users }
  ];

  const handleCreateCampaign = () => {
    setActiveTab('campaigns');
  };

  const handleGenerateContent = () => {
    setActiveTab('ai-content');
  };

  return (
    <div>
      <PageHeader 
        title="Marketing & Advertisement" 
        subtitle="AI-powered marketing suite for content generation, campaign management, and performance analytics"
        actions={
          <div className="flex space-x-3">
            <button
              onClick={handleGenerateContent}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
            >
              <Brain size={16} className="mr-2" />
              Generate AI Content
            </button>
            <button
              onClick={handleCreateCampaign}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Create Campaign
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <StatsCard
          title="Active Campaigns"
          value={stats.activeCampaigns.toString()}
          change="+3 this month"
          changeType="positive"
          icon={Target}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Total Reach"
          value={`${(stats.totalReach / 1000).toFixed(0)}K`}
          change="+15.2% this week"
          changeType="positive"
          icon={Users}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Engagement Rate"
          value={`${stats.engagementRate}%`}
          change="+0.8% vs last month"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          change="+0.3% this week"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="AI Content Generated"
          value={stats.aiContentGenerated.toString()}
          change="+23 today"
          changeType="positive"
          icon={Brain}
          iconColor="text-indigo-500"
        />
        <StatsCard
          title="Pending Approvals"
          value={stats.pendingApprovals.toString()}
          change="-2 from yesterday"
          changeType="positive"
          icon={Clock}
          iconColor="text-orange-500"
        />
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mb-6">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
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

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <AnalyticsOverviewTab stats={stats} />}
          {activeTab === 'ai-content' && <AIContentGenerationTab />}
          {activeTab === 'social-media' && <SocialMediaManagementTab />}
          {activeTab === 'campaigns' && <CampaignManagementTab />}
          {activeTab === 'advertisements' && <AdvertisementOperationsTab />}
          {activeTab === 'team' && <TeamCollaborationTab />}
        </div>
      </div>
    </div>
  );
};

export default MarketingAdvertisementPage;