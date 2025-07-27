import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, CreditCard } from 'lucide-react';

interface IssueCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onIssue: (cardData: any) => void;
}

const IssueCardModal: React.FC<IssueCardModalProps> = ({ isOpen, onClose, onIssue }) => {
  const [formData, setFormData] = useState({
    userId: '',
    cardBrand: 'VISA',
    cardType: 'VIRTUAL',
    spendLimit: '5000'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onIssue({
        ...formData,
        spendLimit: parseFloat(formData.spendLimit)
      });
    } catch (err: any) {
      setError(err.message || 'Failed to issue card');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-100 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <span>Issue New Virtual Card</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Wiremi ID *
                    </label>
                    <input
                      type="text"
                      id="userId"
                      value={formData.userId}
                      onChange={(e) => handleInputChange('userId', e.target.value)}
                      required
                      placeholder="Enter Wiremi ID (e.g., WRM001234)"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="cardBrand" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Card Brand *
                    </label>
                    <select
                      id="cardBrand"
                      value={formData.cardBrand}
                      onChange={(e) => handleInputChange('cardBrand', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="VISA">Visa</option>
                      <option value="MASTERCARD">Mastercard</option>
                      <option value="AMEX">American Express</option>
                      <option value="VERVE">Verve</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="cardType" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Card Type *
                    </label>
                    <select
                      id="cardType"
                      value={formData.cardType}
                      onChange={(e) => handleInputChange('cardType', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="VIRTUAL">Virtual</option>
                      <option value="DEBIT">Debit</option>
                      <option value="PREPAID">Prepaid</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="spendLimit" className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Spend Limit (USD) *
                    </label>
                    <input
                      type="number"
                      id="spendLimit"
                      value={formData.spendLimit}
                      onChange={(e) => handleInputChange('spendLimit', e.target.value)}
                      required
                      min="100"
                      step="100"
                      placeholder="5000"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Issuing...' : 'Issue Card'}
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

export default IssueCardModal;