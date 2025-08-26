import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertTriangle } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [userId, setUserId] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [method, setMethod] = useState('ADMIN_INITIATED');
  const [fees, setFees] = useState('0');
  const [referenceId, setReferenceId] = useState('');
  const [metadata, setMetadata] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        userId,
        amount: parseFloat(amount),
        currency,
        method,
        fees: parseFloat(fees),
        referenceId: referenceId || undefined,
        metadata: metadata ? JSON.parse(metadata) : undefined,
      };

      // Simulate deposit creation without backend
      console.log('Creating deposit:', payload);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock success
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to process deposit');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUserId('');
    setAmount('');
    setCurrency('USD');
    setMethod('ADMIN_INITIATED');
    setFees('0');
    setReferenceId('');
    setMetadata('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-100 flex justify-between items-center">
                  Admin Deposit
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      User ID *
                    </label>
                    <input
                      type="text"
                      id="userId"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      placeholder="Enter user ID"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Amount *
                      </label>
                      <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                        Currency *
                      </label>
                      <select
                        id="currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="USD">USD</option>
                        <option value="CAD">CAD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="XAF">XAF</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="method" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Method *
                    </label>
                    <select
                      id="method"
                      name="method"
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ADMIN_INITIATED">Admin Initiated</option>
                      <option value="BANK">Bank Transfer</option>
                      <option value="MOMO_MTN">Mobile Money (MTN)</option>
                      <option value="MOMO_ORANGE">Mobile Money (Orange)</option>
                      <option value="INTERAC">Interac</option>
                      <option value="PAYPAL">PayPal</option>
                      <option value="CARD">Card</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="fees" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Fees
                    </label>
                    <input
                      type="number"
                      id="fees"
                      value={fees}
                      onChange={(e) => setFees(e.target.value)}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="referenceId" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Reference ID
                    </label>
                    <input
                      type="text"
                      id="referenceId"
                      value={referenceId}
                      onChange={(e) => setReferenceId(e.target.value)}
                      placeholder="Optional external reference"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="metadata" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Metadata (JSON)
                    </label>
                    <textarea
                      id="metadata"
                      value={metadata}
                      onChange={(e) => setMetadata(e.target.value)}
                      rows={3}
                      placeholder='{"bankName": "ABC Bank", "accountNumber": "123456789"}'
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                      Optional JSON metadata for additional transaction details
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Processing...' : 'Create Deposit'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DepositModal;