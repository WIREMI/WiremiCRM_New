import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Percent, Calendar, Users, Target } from 'lucide-react';
import { DiscountRule, DiscountType, FeeType } from '../../../types';
import AddDiscountModal from './AddDiscountModal';

const DiscountRulesTab: React.FC = () => {
  const [discounts, setDiscounts] = useState<DiscountRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountRule | null>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    appliesToFeeType: '',
    countryCode: '',
    regionId: '',
    isActive: ''
  });

  useEffect(() => {
    loadDiscountRules();
    loadRegions();
  }, [filters]);

  const loadRegions = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/pricing/regions');
      // const data = await response.json();
      
      // Mock regions data
      setRegions([
        { id: '1', name: 'North America', code: 'NA' },
        { id: '2', name: 'Sub-Saharan Africa', code: 'SSA' },
        { id: '3', name: 'Europe', code: 'EU' },
        { id: '4', name: 'MENA', code: 'MENA' },
        { id: '5', name: 'Asia Pacific', code: 'APAC' },
        { id: '6', name: 'LATAM', code: 'LATAM' },
        { id: '7', name: 'Oceania', code: 'OCE' }
      ]);
    } catch (error) {
      console.error('Failed to load regions:', error);
    }
  };
  const loadDiscountRules = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const queryParams = new URLSearchParams(filters);
      // const response = await fetch(`/api/v1/pricing/discounts?${queryParams}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockDiscounts: DiscountRule[] = [
        {
          id: '1',
          name: 'North America Premium Discount',
          description: 'Special discount for North American customers',
          discountType: DiscountType.PERCENTAGE_OFF,
          value: 50,
          maxDiscount: 25.00,
          appliesToFeeType: FeeType.CARD_DEPOSIT,
          appliesToCountries: ['US', 'CA'],
          regionId: 'region-1',
          minTransactionAmount: 100,
          usageLimit: 1000,
          usageCount: 245,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-12-31T23:59:59Z',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'African Mobile Money Discount',
          description: 'Reduced fees for mobile money transactions in Africa',
          discountType: DiscountType.FLAT_OFF,
          value: 2.00,
          appliesToFeeType: FeeType.MOMO_DEPOSIT_MTN,
          appliesToCountries: ['NG', 'KE', 'GH', 'CM'],
          regionId: 'region-2',
          minTransactionAmount: 10,
          maxTransactionAmount: 500,
          startDate: '2024-01-01T00:00:00Z',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'European High Volume Discount',
          description: 'Discount for high-value transactions in Europe',
          discountType: DiscountType.PERCENTAGE_OFF,
          value: 25,
          maxDiscount: 50.00,
          appliesToFeeType: FeeType.BANK_DEPOSIT,
          appliesToCountries: ['GB', 'DE', 'FR', 'IT'],
          regionId: 'region-3',
          minTransactionAmount: 1000,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2024-06-30T23:59:59Z',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'Crypto Trading Promotion',
          description: 'Reduced fees for crypto on-ramp transactions',
          discountType: DiscountType.FLAT_OFF,
          value: 5.00,
          appliesToFeeType: FeeType.ON_RAMP,
          appliesToCountries: ['US', 'GB', 'DE'],
          regionId: 'region-1',
          minTransactionAmount: 50,
          startDate: '2024-02-01T00:00:00Z',
          endDate: '2024-03-31T23:59:59Z',
          isActive: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];

      setDiscounts(mockDiscounts);
    } catch (error) {
      console.error('Failed to load discount rules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDiscountTypeBadge = (discountType: DiscountType) => {
    const colors = {
      [DiscountType.PERCENTAGE_OFF]: 'bg-blue-100 text-blue-800',
      [DiscountType.FLAT_OFF]: 'bg-green-100 text-green-800'
    };
    return colors[discountType] || 'bg-gray-100 text-gray-800';
  };

  const getFeeTypeBadge = (feeType?: FeeType) => {
    if (!feeType) return 'bg-gray-100 text-gray-800';
    
    const colors = {
      [FeeType.CARD_DEPOSIT]: 'bg-blue-100 text-blue-800',
      [FeeType.MOMO_DEPOSIT_MTN]: 'bg-green-100 text-green-800',
      [FeeType.MOMO_DEPOSIT_ORANGE]: 'bg-orange-100 text-orange-800',
      [FeeType.BANK_DEPOSIT]: 'bg-purple-100 text-purple-800',
      [FeeType.INTERAC_DEPOSIT]: 'bg-indigo-100 text-indigo-800',
      [FeeType.PAYPAL_DEPOSIT]: 'bg-blue-100 text-blue-800',
      [FeeType.GOOGLE_PAY_DEPOSIT]: 'bg-red-100 text-red-800',
      [FeeType.OPAY_DEPOSIT]: 'bg-yellow-100 text-yellow-800',
      [FeeType.MOMO_TRANSFER]: 'bg-green-100 text-green-800',
      [FeeType.WIREMI_TRANSFER]: 'bg-blue-100 text-blue-800',
      [FeeType.BANK_WIRE]: 'bg-purple-100 text-purple-800',
      [FeeType.BANK_TRANSFER]: 'bg-purple-100 text-purple-800',
      [FeeType.INTERAC_TRANSFER]: 'bg-indigo-100 text-indigo-800',
      [FeeType.VIRTUAL_CARDS_WITHDRAWALS]: 'bg-red-100 text-red-800',
      [FeeType.ON_RAMP]: 'bg-yellow-100 text-yellow-800',
      [FeeType.OFF_RAMP]: 'bg-yellow-100 text-yellow-800',
      [FeeType.LOAN_REFINANCE]: 'bg-orange-100 text-orange-800',
      [FeeType.LOAN_PROCESSING]: 'bg-orange-100 text-orange-800',
      [FeeType.LOAN_DEFAULT]: 'bg-red-100 text-red-800',
      [FeeType.CAPITAL]: 'bg-indigo-100 text-indigo-800',
      [FeeType.DONATION]: 'bg-pink-100 text-pink-800',
      [FeeType.INVESTMENT]: 'bg-green-100 text-green-800',
      [FeeType.SUBSCRIPTION]: 'bg-gray-100 text-gray-800'
    };
    return colors[feeType] || 'bg-gray-100 text-gray-800';
  };

  const formatDiscountValue = (discount: DiscountRule) => {
    if (discount.discountType === DiscountType.PERCENTAGE_OFF) {
      return `${discount.value}% off`;
    } else {
      return `$${discount.value} off`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isExpiringSoon = (endDate?: string) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isExpired = (endDate?: string) => {
    if (!endDate) return false;
    return new Date(endDate) < new Date();
  };

  const handleCreateDiscount = () => {
    setEditingDiscount(null);
    setShowCreateModal(true);
  };

  const handleEditDiscount = (discount: DiscountRule) => {
    setEditingDiscount(discount);
    setShowCreateModal(true);
  };

  const handleSaveDiscount = async (discountData: any) => {
    try {
      if (editingDiscount) {
        // TODO: Call API to update discount
        console.log('Updating discount:', discountData);
      } else {
        // TODO: Call API to create discount
        console.log('Creating discount:', discountData);
      }
      loadDiscountRules();
    } catch (error) {
      console.error('Failed to save discount:', error);
    }
  };
  const handleDeleteDiscount = async (discountId: string) => {
    if (window.confirm('Are you sure you want to delete this discount rule?')) {
      try {
        // TODO: Call API to delete discount
        console.log('Deleting discount:', discountId);
        loadDiscountRules();
      } catch (error) {
        console.error('Failed to delete discount:', error);
      }
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatCountryCodes = (countryCodes: string[]) => {
    if (countryCodes.length === 0) return 'All Countries';
    if (countryCodes.length <= 3) return countryCodes.join(', ');
    return `${countryCodes.slice(0, 3).join(', ')} +${countryCodes.length - 3} more`;
  };
  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          Discount Rules
        </h3>
        <button
          onClick={handleCreateDiscount}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Discount
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Applies to Fee Type
            </label>
            <select
              value={filters.appliesToFeeType}
              onChange={(e) => handleFilterChange('appliesToFeeType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Fee Types</option>
              <option value="CARD_DEPOSIT">Card Deposit</option>
              <option value="MOMO_DEPOSIT_MTN">MTN Mobile Money</option>
              <option value="BANK_DEPOSIT">Bank Deposit</option>
              <option value="VIRTUAL_CARDS_WITHDRAWALS">Virtual Card Withdrawals</option>
              <option value="ON_RAMP">Crypto On-Ramp</option>
              <option value="LOAN_PROCESSING">Loan Processing</option>
              <option value="INVESTMENT">Investment</option>
              <option value="SUBSCRIPTION">Subscription</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Country Code
            </label>
            <input
              type="text"
              value={filters.countryCode}
              onChange={(e) => handleFilterChange('countryCode', e.target.value)}
              placeholder="e.g., US, CA, NG"
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Region
            </label>
            <select
              value={filters.regionId}
              onChange={(e) => handleFilterChange('regionId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => handleFilterChange('isActive', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Discount Rules Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Discount Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Discount Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Applies To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Countries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Validity
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
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-dark-400">
                    Loading discount rules...
                  </td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-dark-400">
                    No discount rules found.
                  </td>
                </tr>
              ) : (
                discounts.map((discount) => (
                  <tr key={discount.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                          {discount.name}
                        </div>
                        {discount.description && (
                          <div className="text-sm text-gray-500 dark:text-dark-400">
                            {discount.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDiscountTypeBadge(discount.discountType)}`}>
                          {formatDiscountValue(discount)}
                        </span>
                        {discount.maxDiscount && (
                          <div className="text-xs text-gray-500 dark:text-dark-400">
                            Max: ${discount.maxDiscount}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {discount.appliesToFeeType && (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFeeTypeBadge(discount.appliesToFeeType)}`}>
                            {discount.appliesToFeeType.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {formatCountryCodes(discount.appliesToCountries)}
                        {discount.minTransactionAmount && (
                          <div className="text-xs text-gray-500 dark:text-dark-400">
                            Min: ${discount.minTransactionAmount}
                          </div>
                        )}
                        {discount.maxTransactionAmount && (
                          <div className="text-xs text-gray-500 dark:text-dark-400">
                            Max: ${discount.maxTransactionAmount}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {discount.usageLimit ? (
                          <div>
                            <div>{discount.usageCount} / {discount.usageLimit}</div>
                            <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-1.5 mt-1">
                              <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${(discount.usageCount / discount.usageLimit) * 100}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">Unlimited</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        <div>From: {formatDate(discount.startDate)}</div>
                        {discount.endDate && (
                          <div className={`${
                            isExpired(discount.endDate) ? 'text-red-600' :
                            isExpiringSoon(discount.endDate) ? 'text-yellow-600' : ''
                          }`}>
                            To: {formatDate(discount.endDate)}
                            {isExpiringSoon(discount.endDate) && !isExpired(discount.endDate) && (
                              <span className="ml-1 text-xs">(Expiring Soon)</span>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        discount.isActive && !isExpired(discount.endDate) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {discount.isActive && !isExpired(discount.endDate) ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditDiscount(discount)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteDiscount(discount.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                        >
                          <Trash2 size={16} />
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

      {/* Add/Edit Discount Modal */}
      {showCreateModal && (
        <AddDiscountModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveDiscount}
          regions={regions}
          editingDiscount={editingDiscount}
        />
      )}
    </div>
  );
};

export default DiscountRulesTab;