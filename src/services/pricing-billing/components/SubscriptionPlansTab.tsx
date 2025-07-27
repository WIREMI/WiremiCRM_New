import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, DollarSign, Calendar, Globe } from 'lucide-react';
import { SubscriptionPlan, BillingCycle, AccountType } from '../../../types';

const SubscriptionPlansTab: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [planValidationErrors, setPlanValidationErrors] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedAccountType, setSelectedAccountType] = useState<string>('');
  const [newPlanData, setNewPlanData] = useState({
    name: '',
    accountType: '',
    description: '',
    price: '',
    currency: 'USD',
    billingCycle: '',
    regionId: '',
    features: [] as string[],
    maxTransactions: '',
    maxCards: '',
    maxSavingsGoals: '',
    virtualCardIssuanceFee: '',
    virtualCardMaintenanceFee: '',
    selectedFeatures: [] as string[],
    isActive: true
  });

  const regions = [
    { id: 'region-1', name: 'North America', currency: 'USD' },
    { id: 'region-2', name: 'Sub-Saharan Africa', currency: 'XAF' },
    { id: 'region-3', name: 'Europe', currency: 'EUR' },
    { id: 'region-4', name: 'MENA', currency: 'AED' },
    { id: 'region-5', name: 'Asia Pacific', currency: 'USD' },
    { id: 'region-6', name: 'LATAM', currency: 'USD' },
    { id: 'region-7', name: 'Oceania', currency: 'AUD' }
  ];

  useEffect(() => {
    loadSubscriptionPlans();
  }, [selectedRegion, selectedAccountType]);

  const loadSubscriptionPlans = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/v1/pricing/subscriptions${selectedRegion ? `?regionId=${selectedRegion}` : ''}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockPlans: SubscriptionPlan[] = [
        // Personal Plans
        {
          id: '1',
          name: 'FREE',
          accountType: AccountType.PERSONAL,
          description: 'Basic features for personal use',
          price: 0,
          currency: 'USD',
          billingCycle: BillingCycle.MONTHLY,
          features: ['5 Virtual Cards', '100 Transactions/month', 'Basic Support'],
          maxTransactions: 100,
          maxCards: 5,
          maxSavingsGoals: 3,
          regionId: 'region-1',
          isActive: true,
          sortOrder: 1,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'PREMIUM',
          accountType: AccountType.PERSONAL,
          description: 'Advanced features for personal users',
          price: 29.99,
          currency: 'USD',
          billingCycle: BillingCycle.MONTHLY,
          features: ['Unlimited Virtual Cards', 'Unlimited Transactions', 'Priority Support', 'Advanced Analytics'],
          maxTransactions: -1,
          maxCards: -1,
          maxSavingsGoals: 10,
          regionId: 'region-1',
          isActive: true,
          sortOrder: 2,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        // Business Plans
        {
          id: '3',
          name: 'BUSINESS',
          accountType: AccountType.BUSINESS,
          description: 'Comprehensive solution for businesses',
          price: 99.99,
          currency: 'USD',
          billingCycle: BillingCycle.MONTHLY,
          features: ['Multi-user Access', 'Business Analytics', 'API Access', 'Custom Integrations', 'Dedicated Support'],
          maxTransactions: -1, // Unlimited
          maxCards: -1, // Unlimited
          maxSavingsGoals: -1,
          regionId: 'region-1',
          isActive: true,
          sortOrder: 3,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        // Annual Plans
        {
          id: '4',
          name: 'PREMIUM',
          accountType: AccountType.PERSONAL,
          description: 'Advanced features for personal users (Annual)',
          price: 299.99,
          currency: 'USD',
          billingCycle: BillingCycle.ANNUALLY,
          features: ['Unlimited Virtual Cards', 'Unlimited Transactions', 'Priority Support', 'Advanced Analytics'],
          maxTransactions: -1,
          maxCards: -1,
          maxSavingsGoals: 10,
          regionId: 'region-1',
          isActive: true,
          sortOrder: 4,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          name: 'BUSINESS',
          accountType: AccountType.BUSINESS,
          description: 'Comprehensive solution for businesses (Annual)',
          price: 999.99,
          currency: 'USD',
          billingCycle: BillingCycle.ANNUALLY,
          features: ['Multi-user Access', 'Business Analytics', 'API Access', 'Custom Integrations', 'Dedicated Support'],
          maxTransactions: -1,
          maxCards: -1,
          maxSavingsGoals: -1,
          regionId: 'region-1',
          isActive: true,
          sortOrder: 5,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];

      setPlans(mockPlans);
    } catch (error) {
      console.error('Failed to load subscription plans:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBillingCycleBadge = (cycle: BillingCycle) => {
    const colors = {
      [BillingCycle.MONTHLY]: 'bg-blue-100 text-blue-800',
      [BillingCycle.QUARTERLY]: 'bg-green-100 text-green-800',
      [BillingCycle.ANNUALLY]: 'bg-purple-100 text-purple-800'
    };
    return colors[cycle] || 'bg-gray-100 text-gray-800';
  };

  const getAccountTypeBadge = (accountType: AccountType) => {
    const colors = {
      [AccountType.PERSONAL]: 'bg-blue-100 text-blue-800',
      [AccountType.BUSINESS]: 'bg-purple-100 text-purple-800'
    };
    return colors[accountType] || 'bg-gray-100 text-gray-800';
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  };

  const formatLimit = (limit: number) => {
    return limit === -1 ? 'Unlimited' : limit.toLocaleString();
  };

  const handleDeletePlan = async (planId: string) => {
    if (window.confirm('Are you sure you want to delete this subscription plan?')) {
      try {
        // TODO: Call API to delete plan
        console.log('Deleting plan:', planId);
        loadSubscriptionPlans();
      } catch (error) {
        console.error('Failed to delete plan:', error);
      }
    }
  };

  const validatePlanData = () => {
    const errors: string[] = [];
    
    if (!newPlanData.name) {
      errors.push('Plan name is required');
    }
    
    if (!newPlanData.accountType) {
      errors.push('Account type is required');
    }
    
    if (!newPlanData.price || parseFloat(newPlanData.price) < 0) {
      errors.push('Price must be a valid positive number');
    }
    
    if (!newPlanData.currency) {
      errors.push('Currency is required');
    }
    
    if (!newPlanData.billingCycle) {
      errors.push('Billing cycle is required');
    }
    
    if (!newPlanData.regionId) {
      errors.push('Region is required');
    }
    
    if (newPlanData.features.length === 0) {
      errors.push('At least one feature is required');
    }
    
    if (newPlanData.maxTransactions && parseInt(newPlanData.maxTransactions) < -1) {
      errors.push('Max transactions must be -1 (unlimited) or a positive number');
    }
    
    if (newPlanData.maxCards && parseInt(newPlanData.maxCards) < -1) {
      errors.push('Max cards must be -1 (unlimited) or a positive number');
    }
    
    if (newPlanData.maxSavingsGoals && parseInt(newPlanData.maxSavingsGoals) < -1) {
      errors.push('Max savings goals must be -1 (unlimited) or a positive number');
    }
    // Check for duplicate plan in same region
    const existingPlan = plans.find(plan => 
      plan.name === newPlanData.name && 
      plan.accountType === newPlanData.accountType && 
      plan.billingCycle === newPlanData.billingCycle &&
      plan.regionId === newPlanData.regionId
    );
    
    if (existingPlan) {
      errors.push(`A ${newPlanData.name} ${newPlanData.billingCycle.toLowerCase()} plan for ${newPlanData.accountType.toLowerCase()} accounts already exists in this region`);
    }
    
    setPlanValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePlanInputChange = (field: string, value: string | boolean | string[]) => {
    setNewPlanData(prev => ({ ...prev, [field]: value }));
    setPlanValidationErrors([]);
    
    // Auto-set currency based on region
    if (field === 'regionId') {
      const selectedRegion = regions.find(r => r.id === value);
      if (selectedRegion) {
        setNewPlanData(prev => ({ ...prev, currency: selectedRegion.currency }));
      }
    }
  };

  const handleAddFeature = () => {
    if (newFeature.trim() && !newPlanData.features.includes(newFeature.trim())) {
      setNewPlanData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setNewPlanData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleCreatePlan = async () => {
    if (!validatePlanData()) {
      return;
    }
    
    setIsCreatingPlan(true);
    try {
      // TODO: Call API to create subscription plan
      const planData = {
        name: newPlanData.name,
        accountType: newPlanData.accountType,
        description: newPlanData.description,
        price: parseFloat(newPlanData.price),
        currency: newPlanData.currency,
        billingCycle: newPlanData.billingCycle,
        regionId: newPlanData.regionId,
        features: newPlanData.features,
        maxTransactions: newPlanData.maxTransactions ? parseInt(newPlanData.maxTransactions) : undefined,
        maxCards: newPlanData.maxCards ? parseInt(newPlanData.maxCards) : undefined,
        maxSavingsGoals: newPlanData.maxSavingsGoals ? parseInt(newPlanData.maxSavingsGoals) : undefined,
        isActive: newPlanData.isActive
      };
      
      console.log('Creating subscription plan:', planData);
      
      // Reset form
      setNewPlanData({
        name: '',
        accountType: '',
        description: '',
        price: '',
        currency: 'USD',
        billingCycle: '',
        regionId: '',
        features: [],
        maxTransactions: '',
        maxCards: '',
        maxSavingsGoals: '',
        isActive: true
      });
      
      setShowCreateModal(false);
      loadSubscriptionPlans();
    } catch (error) {
      console.error('Failed to create subscription plan:', error);
      setPlanValidationErrors(['Failed to create subscription plan. Please try again.']);
    } finally {
      setIsCreatingPlan(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
            Subscription Plans
          </h3>
          <select
            value={selectedAccountType}
            onChange={(e) => setSelectedAccountType(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          >
            <option value="">All Account Types</option>
            <option value="PERSONAL">Personal</option>
            <option value="BUSINESS">Business</option>
          </select>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          >
            <option value="">All Regions</option>
            <option value="region-1">North America</option>
            <option value="region-2">Europe</option>
            <option value="region-3">Asia Pacific</option>
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Plan
        </button>
      </div>

      {/* Plans Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-dark-600 rounded-lg h-64"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900 dark:text-dark-100">
                  {plan.name}
                </h4>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeletePlan(plan.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeBadge(plan.accountType)}`}>
                  {plan.accountType}
                </span>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900 dark:text-dark-100 mb-1">
                  {formatPrice(plan.price, plan.currency)}
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBillingCycleBadge(plan.billingCycle)}`}>
                  {plan.billingCycle}
                </span>
              </div>

              {plan.description && (
                <p className="text-gray-600 dark:text-dark-400 text-sm mb-4">
                  {plan.description}
                </p>
              )}

              {/* Plan Limits */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-400">Transactions:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-100">
                    {formatLimit(plan.maxTransactions || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-400">Virtual Cards:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-100">
                    {formatLimit(plan.maxCards || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-400">Savings Goals:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-100">
                    {formatLimit(plan.maxSavingsGoals || 0)}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-900 dark:text-dark-100 mb-2">Features:</h5>
                <ul className="space-y-1">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index} className="text-sm text-gray-600 dark:text-dark-400 flex items-center">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                      {feature}
                    </li>
                  ))}
                  {plan.features.length > 3 && (
                    <li className="text-sm text-gray-500 dark:text-dark-500">
                      +{plan.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {plan.isActive ? 'Active' : 'Inactive'}
                </span>
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Plan Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Create Subscription Plan
            </h3>
            
            {planValidationErrors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Please fix the following errors:</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                  {planValidationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Basic Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">Basic Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Plan Name *
                      </label>
                      <select
                        value={newPlanData.name}
                        onChange={(e) => handlePlanInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      >
                        <option value="">Select plan name...</option>
                        <option value="FREE">FREE</option>
                        <option value="PREMIUM">PREMIUM</option>
                        <option value="BUSINESS">BUSINESS</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Account Type *
                      </label>
                      <select
                        value={newPlanData.accountType}
                        onChange={(e) => handlePlanInputChange('accountType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      >
                        <option value="">Select account type...</option>
                        <option value="PERSONAL">Personal</option>
                        <option value="BUSINESS">Business</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Region *
                      </label>
                      <select
                        value={newPlanData.regionId}
                        onChange={(e) => handlePlanInputChange('regionId', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      >
                        <option value="">Select region...</option>
                        {regions.map(region => (
                          <option key={region.id} value={region.id}>
                            {region.name} ({region.currency})
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={newPlanData.description}
                        onChange={(e) => handlePlanInputChange('description', e.target.value)}
                        rows={3}
                        placeholder="Describe the plan benefits..."
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Pricing */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">Pricing</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Price *
                      </label>
                      <input
                        type="number"
                        value={newPlanData.price}
                        onChange={(e) => handlePlanInputChange('price', e.target.value)}
                        min="0"
                        step="0.01"
                        placeholder="29.99"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Currency *
                      </label>
                      <input
                        type="text"
                        value={newPlanData.currency}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-100 dark:bg-dark-600 text-gray-900 dark:text-dark-100"
                      />
                      <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                        Auto-set based on selected region
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Billing Cycle *
                    </label>
                    <select
                      value={newPlanData.billingCycle}
                      onChange={(e) => handlePlanInputChange('billingCycle', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                    >
                      <option value="">Select billing cycle...</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly (3 months)</option>
                      <option value="ANNUALLY">Annually (12 months)</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Features and Limits */}
              <div className="space-y-6">
                {/* Features */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">Features</h4>
                  
                  <div className="space-y-3">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Add a feature..."
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                      />
                      <button
                        type="button"
                        onClick={handleAddFeature}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    
                    {newPlanData.features.length > 0 && (
                      <div className="space-y-2">
                        {newPlanData.features.map((feature, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-dark-700 rounded">
                            <span className="text-sm text-gray-900 dark:text-dark-100">{feature}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveFeature(index)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Limits */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">Usage Limits</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Max Transactions per Month
                      </label>
                      <input
                        type="number"
                        value={newPlanData.maxTransactions}
                        onChange={(e) => handlePlanInputChange('maxTransactions', e.target.value)}
                        min="-1"
                        placeholder="-1 for unlimited"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Max Virtual Cards
                      </label>
                      <input
                        type="number"
                        value={newPlanData.maxCards}
                        onChange={(e) => handlePlanInputChange('maxCards', e.target.value)}
                        min="-1"
                        placeholder="-1 for unlimited"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Max Savings Goals
                      </label>
                      <input
                        type="number"
                        value={newPlanData.maxSavingsGoals}
                        onChange={(e) => handlePlanInputChange('maxSavingsGoals', e.target.value)}
                        min="-1"
                        placeholder="-1 for unlimited"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      />
                    </div>
                    
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newPlanData.isActive}
                          onChange={(e) => handlePlanInputChange('isActive', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">
                          Active Plan
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Preview */}
                {newPlanData.name && newPlanData.accountType && newPlanData.regionId && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">Plan Preview</h5>
                    <div className="text-sm text-green-800 dark:text-green-200">
                      <div>{newPlanData.name} Plan for {newPlanData.accountType} Accounts</div>
                      <div>Region: {regions.find(r => r.id === newPlanData.regionId)?.name}</div>
                      {newPlanData.price && <div>Price: {newPlanData.currency} {newPlanData.price} / {newPlanData.billingCycle?.toLowerCase()}</div>}
                      <div>Features: {newPlanData.features.length} included</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePlan}
                disabled={isCreatingPlan || !newPlanData.name || !newPlanData.accountType || !newPlanData.regionId || !newPlanData.billingCycle || newPlanData.features.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreatingPlan ? 'Creating...' : 'Create Subscription Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlansTab;