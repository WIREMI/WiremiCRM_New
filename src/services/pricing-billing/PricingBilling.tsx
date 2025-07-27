import React, { useState, useEffect } from 'react';
import { Plus, Calculator, DollarSign, Percent, Globe, Users, Settings, BarChart3 } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';
import RegionsTab from './components/RegionsTab';
import SubscriptionPlansTab from './components/SubscriptionPlansTab';
import FeeDefinitionsTab from './components/FeeDefinitionsTab';
import DiscountRulesTab from './components/DiscountRulesTab';
import FeeCalculatorTab from './components/FeeCalculatorTab';
import AnalyticsTab from './components/AnalyticsTab';
import FxConfigurationTab from './components/FxConfigurationTab';

const PricingBilling: React.FC = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [stats, setStats] = useState({
    totalRegions: 0,
    activeSubscriptions: 0,
    totalFeeRules: 0,
    activeDiscounts: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [regionsResponse, subscriptionsResponse, feesResponse, discountsResponse] = await Promise.all([
      //   fetch('/api/v1/pricing/regions'),
      //   fetch('/api/v1/pricing/subscriptions'),
      //   fetch('/api/v1/pricing/fees'),
      //   fetch('/api/v1/pricing/discounts')
      // ]);
      
      // Mock data for demonstration
      setStats({
        totalRegions: 5,
        activeSubscriptions: 12,
        totalFeeRules: 45,
        activeDiscounts: 8
      });
    } catch (error) {
      console.error('Failed to load pricing stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'subscriptions', label: 'Subscription Plans', icon: Users },
    { id: 'regions', label: 'Regions & Countries', icon: Globe },
    { id: 'fees', label: 'Fee Definitions', icon: DollarSign },
    { id: 'discounts', label: 'Discount Rules', icon: Percent },
    { id: 'calculator', label: 'Fee Calculator', icon: Calculator },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'fx', label: 'FX Configuration', icon: Settings }
  ];

  return (
    <div>
      <PageHeader 
        title="Pricing, FX & Billing Engine" 
        subtitle="Manage subscription plans, transaction fees, discounts, and billing configurations"
        actions={
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
              <Calculator size={16} className="mr-2" />
              Calculate Fee
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus size={16} className="mr-2" />
              Add Configuration
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Regions"
          value={stats.totalRegions.toString()}
          change="+2 new regions"
          changeType="positive"
          icon={Globe}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Subscription Plans"
          value={stats.activeSubscriptions.toString()}
          change="+3 this month"
          changeType="positive"
          icon={Users}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Fee Rules"
          value={stats.totalFeeRules.toString()}
          change="5 updated today"
          changeType="neutral"
          icon={DollarSign}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Active Discounts"
          value={stats.activeDiscounts.toString()}
          change="2 expiring soon"
          changeType="neutral"
          icon={Percent}
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
          {activeTab === 'regions' && <RegionsTab />}
          {activeTab === 'subscriptions' && <SubscriptionPlansTab />}
          {activeTab === 'fees' && <FeeDefinitionsTab />}
          {activeTab === 'discounts' && <DiscountRulesTab />}
          {activeTab === 'calculator' && <FeeCalculatorTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'fx' && <FxConfigurationTab />}
        </div>
      </div>
    </div>
  );
};

export default PricingBilling;