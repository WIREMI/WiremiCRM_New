import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, Percent, Filter } from 'lucide-react';
import { FeeDefinition, FeeType, FeeSubType, FeeMethod, FeeValueType } from '../../../types';
import AddFeeRuleModal from './AddFeeRuleModal';

const FeeDefinitionsTab: React.FC = () => {
  const [fees, setFees] = useState<FeeDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingFee, setEditingFee] = useState<FeeDefinition | null>(null);
  const [regions, setRegions] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    feeType: '',
    feeSubType: '',
    regionId: '',
    countryCode: '',
    isActive: ''
  });

  useEffect(() => {
    loadFeeDefinitions();
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
  const loadFeeDefinitions = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const queryParams = new URLSearchParams(filters);
      // const response = await fetch(`/api/v1/pricing/fees?${queryParams}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockFees: FeeDefinition[] = [
        {
          id: '1',
          name: 'Visa Card Deposit Fee',
          description: 'Fee for depositing funds via Visa credit/debit card',
          feeType: FeeType.CARD_DEPOSIT,
          valueType: FeeValueType.PERCENTAGE,
          value: 2.5,
          cap: 10.00,
          minFee: 0.50,
          currency: 'USD',
          regionId: 'region-1',
          countryCodes: ['US', 'CA'],
          isActive: true,
          effectiveFrom: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'MTN Mobile Money Deposit Fee',
          description: 'Fee for depositing funds via MTN mobile money',
          feeType: FeeType.MOMO_DEPOSIT_MTN,
          valueType: FeeValueType.PERCENTAGE,
          value: 1.5,
          cap: 5.00,
          minFee: 0.25,
          currency: 'XAF',
          regionId: 'region-1',
          countryCodes: ['CM', 'CI', 'BF'],
          isActive: true,
          effectiveFrom: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Virtual Card Withdrawal Fee',
          description: 'Fee for withdrawing funds using virtual card',
          feeType: FeeType.VIRTUAL_CARDS_WITHDRAWALS,
          valueType: FeeValueType.FLAT,
          value: 2.00,
          currency: 'USD',
          regionId: 'region-1',
          countryCodes: ['US', 'CA', 'GB'],
          isActive: true,
          effectiveFrom: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '4',
          name: 'Crypto On-Ramp Fee',
          description: 'Fee for converting fiat to cryptocurrency',
          feeType: FeeType.ON_RAMP,
          valueType: FeeValueType.FLAT,
          value: 10.00,
          currency: 'USD',
          regionId: 'region-1',
          countryCodes: ['US', 'GB', 'DE'],
          isActive: true,
          effectiveFrom: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '5',
          name: 'Loan Processing Fee',
          description: 'Fee for processing loan applications',
          feeType: FeeType.LOAN_PROCESSING,
          valueType: FeeValueType.PERCENTAGE,
          value: 1.0,
          cap: 100.00,
          minFee: 25.00,
          currency: 'USD',
          regionId: 'region-1',
          countryCodes: ['US', 'CA', 'AU'],
          isActive: true,
          effectiveFrom: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];

      setFees(mockFees);
    } catch (error) {
      console.error('Failed to load fee definitions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFeeTypeBadge = (feeType: FeeType) => {
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

  const formatFeeValue = (fee: FeeDefinition) => {
    if (fee.valueType === FeeValueType.PERCENTAGE) {
      return `${fee.value}%`;
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: fee.currency
      }).format(fee.value);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const handleCreateFee = () => {
    setEditingFee(null);
    setShowCreateModal(true);
  };

  const handleEditFee = (fee: FeeDefinition) => {
    setEditingFee(fee);
    setShowCreateModal(true);
  };

  const handleSaveFee = async (feeData: any) => {
    try {
      if (editingFee) {
        // TODO: Call API to update fee
        console.log('Updating fee:', feeData);
      } else {
        // TODO: Call API to create fee
        console.log('Creating fee:', feeData);
      }
      loadFeeDefinitions();
    } catch (error) {
      console.error('Failed to save fee:', error);
    }
  };
  const handleDeleteFee = async (feeId: string) => {
    if (window.confirm('Are you sure you want to delete this fee definition?')) {
      try {
        // TODO: Call API to delete fee
        console.log('Deleting fee:', feeId);
        loadFeeDefinitions();
      } catch (error) {
        console.error('Failed to delete fee:', error);
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
          Fee Definitions
        </h3>
        <button
          onClick={handleCreateFee}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Fee Rule
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Fee Type
            </label>
            <select
              value={filters.feeType}
              onChange={(e) => handleFilterChange('feeType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Types</option>
              <option value="CARD_DEPOSIT">Card Deposit</option>
              <option value="MOMO_DEPOSIT_MTN">MTN Mobile Money</option>
              <option value="MOMO_DEPOSIT_ORANGE">Orange Mobile Money</option>
              <option value="BANK_DEPOSIT">Bank Deposit</option>
              <option value="INTERAC_DEPOSIT">Interac Deposit</option>
              <option value="PAYPAL_DEPOSIT">PayPal Deposit</option>
              <option value="VIRTUAL_CARDS_WITHDRAWALS">Virtual Card Withdrawals</option>
              <option value="ON_RAMP">Crypto On-Ramp</option>
              <option value="OFF_RAMP">Crypto Off-Ramp</option>
              <option value="LOAN_PROCESSING">Loan Processing</option>
              <option value="INVESTMENT">Investment</option>
              <option value="DONATION">Donation</option>
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

      {/* Fee Definitions Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Fee Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Countries
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Fee Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Limits
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
                    Loading fee definitions...
                  </td>
                </tr>
              ) : fees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-dark-400">
                    No fee definitions found.
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                          {fee.name}
                        </div>
                        {fee.description && (
                          <div className="text-sm text-gray-500 dark:text-dark-400">
                            {fee.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getFeeTypeBadge(fee.feeType)}`}>
                        {fee.feeType.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {formatCountryCodes(fee.countryCodes)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {fee.valueType === FeeValueType.PERCENTAGE ? (
                          <Percent size={16} className="text-blue-500 mr-1" />
                        ) : (
                          <DollarSign size={16} className="text-green-500 mr-1" />
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                          {formatFeeValue(fee)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {fee.cap && (
                          <div>Cap: {formatCurrency(fee.cap, fee.currency)}</div>
                        )}
                        {fee.minFee && (
                          <div>Min: {formatCurrency(fee.minFee, fee.currency)}</div>
                        )}
                        {!fee.cap && !fee.minFee && <span className="text-gray-500">No limits</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        <div>From: {new Date(fee.effectiveFrom).toLocaleDateString()}</div>
                        {fee.effectiveTo && (
                          <div>To: {new Date(fee.effectiveTo).toLocaleDateString()}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        fee.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {fee.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditFee(fee)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteFee(fee.id)}
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

      {/* Add/Edit Fee Modal */}
      {showCreateModal && (
        <AddFeeRuleModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveFee}
          regions={regions}
          editingFee={editingFee}
        />
      )}
    </div>
  );
};

export default FeeDefinitionsTab;