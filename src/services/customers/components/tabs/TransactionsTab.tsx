import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import { Transaction, TransactionType, TransactionStatus } from '../../../../types';
import TransactionDetailModal from '../../../transactions/components/TransactionDetailModal';

interface TransactionsTabProps {
  customerId: string;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ customerId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    status: '', // Changed from status to status
    dateRange: '30d'
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [customerId, filter]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/customers/${customerId}/transactions?${new URLSearchParams(filter)}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockTransactions: Transaction[] = Array.from({ length: 10 }, (_, i) => ({
        id: `txn-${i + 1}`,
        customerId,
        type: [TransactionType.DEPOSIT, TransactionType.WITHDRAWAL, TransactionType.TRANSFER, TransactionType.PAYMENT][i % 4],
        amount: Math.random() * 10000 + 100,
        currency: 'USD',
        status: [TransactionStatus.COMPLETED, TransactionStatus.PENDING, TransactionStatus.FAILED][i % 3],
        timestamp: new Date(Date.now() - i * 86400000).toISOString(),
        description: `Transaction ${i + 1} - ${['Payment to merchant', 'Account deposit', 'Transfer to friend', 'Bill payment'][i % 4]}`,
        riskFlags: i % 5 === 0 ? ['high_amount'] : undefined
      }));

      setTransactions(mockTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.DEPOSIT:
        return <ArrowDownLeft className="w-5 h-5 text-green-500" />;
      case TransactionType.WITHDRAWAL:
        return <ArrowUpRight className="w-5 h-5 text-red-500" />;
      case TransactionType.TRANSFER:
        return <ArrowUpRight className="w-5 h-5 text-blue-500" />;
      case TransactionType.PAYMENT:
        return <CreditCard className="w-5 h-5 text-purple-500" />;
      default:
        return <CreditCard className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const colors = {
      [TransactionStatus.COMPLETED]: 'bg-green-100 text-green-800',
      [TransactionStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [TransactionStatus.FAILED]: 'bg-red-100 text-red-800',
      [TransactionStatus.CANCELLED]: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewInExplorer = () => {
    // TODO: Navigate to Transaction Explorer with customer filter
    console.log('Navigate to Transaction Explorer for customer:', customerId);
  };

  const handleViewTransactionDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 flex items-center">
            <CreditCard className="mr-2 text-blue-500" size={20} />
            Recent Transactions
          </h4>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {transactions.length} transactions
          </span>
        </div>
        <button
          onClick={handleViewInExplorer}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
        >
          <ExternalLink size={16} className="mr-2" />
          View in Transaction Explorer
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Transaction Type
            </label>
            <select
              value={filter.type}
              onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Types</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
              <option value="TRANSFER">Transfer</option>
              <option value="PAYMENT">Payment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Date Range
            </label>
            <select
              value={filter.dateRange}
              onChange={(e) => setFilter(prev => ({ ...prev, dateRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : transactions.length > 0 ? (
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Status
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
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                            {transaction.id}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-dark-400">
                            {transaction.description}
                          </div>
                          {transaction.riskFlags && transaction.riskFlags.length > 0 && (
                            <div className="flex space-x-1 mt-1">
                              {transaction.riskFlags.map((flag, index) => (
                                <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                  {flag.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900 dark:text-dark-100 capitalize">
                        {transaction.type.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                      {formatDate(transaction.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleViewTransactionDetails(transaction)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">No Transactions Found</h3>
          <p className="text-gray-500 dark:text-dark-400">
            This customer hasn't made any transactions yet or none match the current filters.
          </p>
        </div>
      )}

      {selectedTransaction && (
        <TransactionDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          transaction={selectedTransaction as any} // Cast to any as Transaction type is slightly different
          onTransactionUpdated={loadTransactions}
        />
      )}
    </div>
  );
};

export default TransactionsTab;