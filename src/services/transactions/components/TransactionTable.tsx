import React, { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import TransactionDetailModal from './TransactionDetailModal';
import { TransactionWithRelations } from '../services/TransactionService';

interface TransactionTableProps {
  transactions: TransactionWithRelations[];
  loading: boolean;
  selectedTransactions: string[];
  onSelectTransaction: (id: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  total: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onTransactionUpdated: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  loading,
  selectedTransactions,
  onSelectTransaction,
  onSelectAll,
  total,
  currentPage,
  onPageChange,
  onTransactionUpdated,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithRelations | null>(null);

  const handleRowClick = (transaction: TransactionWithRelations) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      SUCCESS: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      PENDING_APPROVAL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      REVERSED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      CANCELLED: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getMethodBadge = (method: string) => {
    const colors = {
      ADMIN_INITIATED: 'bg-blue-100 text-blue-800',
      MANUAL_BANK_DEPOSIT: 'bg-orange-100 text-orange-800',
      BANK: 'bg-green-100 text-green-800',
      MOMO_MTN: 'bg-purple-100 text-purple-800',
      INTERAC: 'bg-indigo-100 text-indigo-800',
    };
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDownloadReceipt = async (transactionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Simulate receipt generation without backend
      console.log('Generating receipt for transaction:', transactionId);
      
      // Create a mock PDF blob
      const mockPdfContent = `Mock PDF Receipt for Transaction ${transactionId}`;
      const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `wiremi-receipt-${transactionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to download receipt. Please try again.');
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
        <thead className="bg-gray-50 dark:bg-dark-700">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                checked={selectedTransactions.length === transactions.length && transactions.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">TXID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Method</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Amount</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Initiated By</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
          {loading ? (
            <tr>
              <td colSpan={10} className="px-6 py-4 text-center text-gray-500 dark:text-dark-400">Loading transactions...</td>
            </tr>
          ) : transactions.length === 0 ? (
            <tr>
              <td colSpan={10} className="px-6 py-4 text-center text-gray-500 dark:text-dark-400">No transactions found.</td>
            </tr>
          ) : (
            transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer" onClick={() => handleRowClick(transaction)}>
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedTransactions.includes(transaction.id)}
                    onChange={(e) => onSelectTransaction(transaction.id, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  {transaction.id.substring(0, 8)}...
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">{transaction.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">{transaction.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getMethodBadge(transaction.method)}`}>
                    {transaction.method.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-100">
                  {formatCurrency(transaction.amount, transaction.currency)}
                  {transaction.fees > 0 && (
                    <div className="text-xs text-gray-500 dark:text-dark-400">
                      Fee: {formatCurrency(transaction.fees, transaction.currency)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(transaction.status)}`}>
                    {transaction.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                  {transaction.adminInitiatedBy ? (
                    <span className="text-blue-600 dark:text-blue-400">Admin: {transaction.adminInitiatedBy}</span>
                  ) : (
                    <span>User</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                  {new Date(transaction.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => handleDownloadReceipt(transaction.id, e)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
                      title="Download PDF Receipt"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRowClick(transaction);
                      }}
                      className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 inline-flex items-center"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center px-6 py-3 bg-gray-50 dark:bg-dark-700">
        <div className="text-sm text-gray-700 dark:text-dark-300">
          Showing {transactions.length > 0 ? (currentPage - 1) * 20 + 1 : 0} to {Math.min(currentPage * 20, total)} of {total} results
        </div>
        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm font-medium text-gray-500 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm font-medium text-gray-700 dark:text-dark-300">
            Page {currentPage} of {Math.ceil(total / 20)}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage * 20 >= total}
            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-800 text-sm font-medium text-gray-500 dark:text-dark-400 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50"
          >
            Next
          </button>
        </nav>
      </div>

      {selectedTransaction && (
        <TransactionDetailModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedTransaction}
          onTransactionUpdated={onTransactionUpdated}
        />
      )}
    </div>
  );
};

export default TransactionTable;