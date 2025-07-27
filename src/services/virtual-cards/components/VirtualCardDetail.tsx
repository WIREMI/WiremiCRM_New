import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, CreditCard, Calendar, DollarSign, Activity, Ban, Trash2 } from 'lucide-react';
import { VirtualCardDetailed } from '../../../types';

interface VirtualCardDetailProps {
  isOpen: boolean;
  onClose: () => void;
  card: VirtualCardDetailed;
  onCardUpdated: () => void;
}

const VirtualCardDetail: React.FC<VirtualCardDetailProps> = ({
  isOpen,
  onClose,
  card,
  onCardUpdated
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      TERMINATED: 'bg-red-100 text-red-800',
      BLOCKED: 'bg-yellow-100 text-yellow-800',
      PENDING: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTransactionStatusBadge = (status: string) => {
    const colors = {
      SUCCESS: 'bg-green-100 text-green-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      FAILED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleBlockCard = async () => {
    if (window.confirm('Are you sure you want to block this card?')) {
      try {
        // TODO: Call API to block card
        console.log('Blocking card:', card.id);
        onCardUpdated();
        onClose();
      } catch (error) {
        console.error('Failed to block card:', error);
      }
    }
  };

  const handleTerminateCard = async () => {
    if (window.confirm('Are you sure you want to terminate this card? This action cannot be undone.')) {
      try {
        // TODO: Call API to terminate card
        console.log('Terminating card:', card.id);
        onCardUpdated();
        onClose();
      } catch (error) {
        console.error('Failed to terminate card:', error);
      }
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-6 h-6 text-blue-500" />
                    <span>Virtual Card Details</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <div className="mt-6">
                  {/* Card Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm opacity-90">Virtual Card</p>
                        <p className="text-2xl font-bold">{card.cardNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">{card.cardBrand}</p>
                        <p className="text-lg font-semibold">{card.cardType}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm opacity-90">Cardholder</p>
                        <p className="font-semibold">{card.userId}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm opacity-90">Expires</p>
                        <p className="font-semibold">{card.expiryDate}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Issue Date</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100">
                            {formatDate(card.issueDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Transaction Volume</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100">
                            {formatCurrency(card.transactionVolume)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Activity className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Status</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(card.status)}`}>
                            {card.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                        Transaction History ({card.transactions.length})
                      </h4>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg overflow-hidden">
                      <div className="max-h-64 overflow-y-auto">
                        {card.transactions.length > 0 ? (
                          <table className="w-full">
                            <thead className="bg-gray-100 dark:bg-dark-600 sticky top-0">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase">
                                  Description
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase">
                                  Amount
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase">
                                  Date
                                </th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase">
                                  Status
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
                              {card.transactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-100 dark:hover:bg-dark-600">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-dark-100">
                                    {transaction.description}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-dark-100">
                                    {formatCurrency(transaction.amount)}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-dark-400">
                                    {new Date(transaction.timestamp).toLocaleDateString()}
                                  </td>
                                  <td className="px-4 py-3">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionStatusBadge(transaction.status)}`}>
                                      {transaction.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="p-8 text-center">
                            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500 dark:text-dark-400">No transactions yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3">
                    {card.status === 'ACTIVE' && (
                      <>
                        <button
                          onClick={handleBlockCard}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center"
                        >
                          <Ban size={16} className="mr-2" />
                          Block Card
                        </button>
                        <button
                          onClick={handleTerminateCard}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Terminate Card
                        </button>
                      </>
                    )}
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VirtualCardDetail;