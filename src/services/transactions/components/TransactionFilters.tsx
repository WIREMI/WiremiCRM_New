import React, { useState } from 'react';

interface TransactionFiltersProps {
  onApplyFilters: (filters: Record<string, any>) => void;
  currentFilters: Record<string, any>;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState<Record<string, any>>(currentFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters({});
    onApplyFilters({});
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Filter Transactions</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Transaction Type</label>
          <select
            id="type"
            name="type"
            value={filters.type || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          >
            <option value="">All Types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="TRANSFER">Transfer</option>
            <option value="WITHDRAWAL">Withdrawal</option>
            <option value="CARD_SERVICE">Card Service</option>
            <option value="SAVINGS">Savings</option>
            <option value="SUBSCRIPTION">Subscription</option>
          </select>
        </div>

        <div>
          <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Method</label>
          <select
            id="method"
            name="method"
            value={filters.method || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          >
            <option value="">All Methods</option>
            <option value="ADMIN_INITIATED">Admin Initiated</option>
            <option value="MANUAL_BANK_DEPOSIT">Manual Bank Deposit</option>
            <option value="BANK">Bank</option>
            <option value="MOMO_MTN">Mobile Money (MTN)</option>
            <option value="MOMO_ORANGE">Mobile Money (Orange)</option>
            <option value="INTERAC">Interac</option>
            <option value="PAYPAL">PayPal</option>
            <option value="CARD">Card</option>
            <option value="WIREMI_INTERNAL">Wiremi Internal</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="MOBILE_MONEY_TRANSFER">Mobile Money Transfer</option>
            <option value="CARD_ISSUANCE">Card Issuance</option>
            <option value="CARD_FUNDING">Card Funding</option>
            <option value="CARD_MAINTENANCE">Card Maintenance</option>
            <option value="SAVINGS_CREDIT">Savings Credit</option>
            <option value="SAVINGS_DEBIT">Savings Debit</option>
            <option value="EMERGENCY_FUNDS_WITHDRAWAL">Emergency Funds Withdrawal</option>
            <option value="INTEREST_CREDIT">Interest Credit</option>
            <option value="PREMIUM_SUBSCRIPTION">Premium Subscription</option>
            <option value="BUSINESS_SUBSCRIPTION">Business Subscription</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Status</label>
          <select
            id="status"
            name="status"
            value={filters.status || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          >
            <option value="">All Statuses</option>
            <option value="SUCCESS">Success</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
            <option value="REVERSED">Reversed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Currency</label>
          <input
            type="text"
            id="currency"
            name="currency"
            value={filters.currency || ''}
            onChange={handleChange}
            placeholder="e.g., USD"
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          />
        </div>

        <div>
          <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Min Amount</label>
          <input
            type="number"
            id="minAmount"
            name="minAmount"
            value={filters.minAmount || ''}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          />
        </div>

        <div>
          <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Max Amount</label>
          <input
            type="number"
            id="maxAmount"
            name="maxAmount"
            value={filters.maxAmount || ''}
            onChange={handleChange}
            placeholder="10000.00"
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          />
        </div>

        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Start Date</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">End Date</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          />
        </div>

        <div>
          <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Reference ID</label>
          <input
            type="text"
            id="referenceId"
            name="referenceId"
            value={filters.referenceId || ''}
            onChange={handleChange}
            placeholder="e.g., REF-XYZ"
            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
        >
          Clear Filters
        </button>
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default TransactionFilters;