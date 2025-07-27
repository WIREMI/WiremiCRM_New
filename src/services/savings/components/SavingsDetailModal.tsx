import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, PiggyBank, Calendar, DollarSign, TrendingUp, Target, Clock } from 'lucide-react';
import { SavingsInstance } from '../../../types';

interface SavingsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  saving: SavingsInstance;
}

const SavingsDetailModal: React.FC<SavingsDetailModalProps> = ({
  isOpen,
  onClose,
  saving
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
      day: 'numeric'
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getTypeBadge = (type: string) => {
    const colors = {
      REGULAR: 'bg-blue-100 text-blue-800',
      BLOCKED: 'bg-red-100 text-red-800',
      RECURRENT: 'bg-green-100 text-green-800',
      GROUP: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      PAUSED: 'bg-yellow-100 text-yellow-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const progressPercentage = getProgressPercentage(saving.currentAmount, saving.targetAmount);
  const remainingAmount = saving.targetAmount - saving.currentAmount;

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
                    <PiggyBank className="w-6 h-6 text-blue-500" />
                    <span>Savings Instance Details</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <div className="mt-6">
                  {/* Savings Header Card */}
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{saving.name}</h2>
                        <p className="text-sm opacity-90">Customer: {saving.customerId}</p>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTypeBadge(saving.type)} text-gray-800`}>
                          {saving.type}
                        </span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{progressPercentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                        <div 
                          className="bg-white h-3 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm opacity-90">Current Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(saving.currentAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Target Amount</p>
                        <p className="text-xl font-bold">{formatCurrency(saving.targetAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">Remaining</p>
                        <p className="text-xl font-bold">{formatCurrency(remainingAmount)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Expected Amount</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100">
                            {formatCurrency(saving.expectedAmount)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Frequency</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100 capitalize">
                            {saving.frequency.toLowerCase()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Interest Earned</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100">
                            {formatCurrency(saving.interestEarned)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-indigo-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Start Date</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100">
                            {formatDate(saving.startDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Target className="w-5 h-5 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">End Date</p>
                          <p className="font-semibold text-gray-900 dark:text-dark-100">
                            {saving.endDate ? formatDate(saving.endDate) : 'No end date'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <PiggyBank className="w-5 h-5 text-emerald-500" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-dark-400">Status</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(saving.status)}`}>
                            {saving.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                      Savings Summary
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-2">Performance Metrics</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-400">Completion Rate:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-100">{progressPercentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-400">Interest Rate:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-100">
                              {((saving.interestEarned / saving.currentAmount) * 100).toFixed(2)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-400">Days Active:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-100">
                              {Math.floor((new Date().getTime() - new Date(saving.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-2">Goal Information</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-400">Savings Type:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-100">{saving.type}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-400">Created:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-100">{formatDate(saving.createdAt)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-400">Last Updated:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-100">{formatDate(saving.updatedAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end space-x-3 mt-6">
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

export default SavingsDetailModal;