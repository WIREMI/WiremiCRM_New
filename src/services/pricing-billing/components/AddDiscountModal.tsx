import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Percent, DollarSign } from 'lucide-react';
import { FeeType, FeeSubType, FeeMethod, DiscountType, AccountType, Region } from '../../../types';
import { countries } from '../../../data/countries';

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discountData: any) => void;
  regions: Region[];
  editingDiscount?: any;
}

const AddDiscountModal: React.FC<AddDiscountModalProps> = ({
  isOpen,
  onClose,
  onSave,
  regions,
  editingDiscount
}) => {
  const [formData, setFormData] = useState({
    name: editingDiscount?.name || '',
    description: editingDiscount?.description || '',
    discountType: editingDiscount?.discountType || DiscountType.PERCENTAGE_OFF,
    value: editingDiscount?.value || '',
    maxDiscount: editingDiscount?.maxDiscount || '',
    appliesToFeeType: editingDiscount?.appliesToFeeType || '',
    appliesToSubType: editingDiscount?.appliesToSubType || '',
    appliesToMethod: editingDiscount?.appliesToMethod || '',
    appliesToAccountType: editingDiscount?.appliesToAccountType || '',
    regionId: editingDiscount?.regionId || '',
    minTransactionAmount: editingDiscount?.minTransactionAmount || '',
    maxTransactionAmount: editingDiscount?.maxTransactionAmount || '',
    usageLimit: editingDiscount?.usageLimit || '',
    startDate: editingDiscount?.startDate ? editingDiscount.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: editingDiscount?.endDate ? editingDiscount.endDate.split('T')[0] : '',
    isActive: editingDiscount?.isActive ?? true
  });

  const [selectedCountries, setSelectedCountries] = useState<string[]>(editingDiscount?.appliesToCountries || []);
  const [loading, setLoading] = useState(false);

  const feeTypeOptions = Object.values(FeeType).map(type => ({
    value: type,
    label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCountryToggle = (countryCode: string) => {
    setSelectedCountries(prev => {
      if (prev.includes(countryCode)) {
        return prev.filter(code => code !== countryCode);
      } else {
        return [...prev, countryCode];
      }
    });
  };

  const handleSelectAllCountries = () => {
    if (selectedCountries.length === countries.length) {
      setSelectedCountries([]);
    } else {
      setSelectedCountries(countries.map(c => c.code));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const discountData = {
        ...formData,
        appliesToCountries: selectedCountries,
        value: parseFloat(formData.value),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
        minTransactionAmount: formData.minTransactionAmount ? parseFloat(formData.minTransactionAmount) : undefined,
        maxTransactionAmount: formData.maxTransactionAmount ? parseFloat(formData.maxTransactionAmount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined,
        appliesToFeeType: formData.appliesToFeeType || undefined,
        appliesToSubType: formData.appliesToSubType || undefined,
        appliesToMethod: formData.appliesToMethod || undefined,
        appliesToAccountType: formData.appliesToAccountType || undefined
      };

      await onSave(discountData);
      onClose();
    } catch (error) {
      console.error('Error saving discount rule:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCountries = () => {
    if (!formData.regionId) return countries;
    const selectedRegion = regions.find(r => r.id === formData.regionId);
    if (!selectedRegion?.countries) return countries;
    return selectedRegion.countries;
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                    <Percent className="w-6 h-6 text-green-500" />
                    <span>{editingDiscount ? 'Edit Discount Rule' : 'Add New Discount Rule'}</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Discount Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          placeholder="e.g., VIP Customer Discount"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          rows={3}
                          placeholder="Describe when this discount applies..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Discount Type *
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value={DiscountType.PERCENTAGE_OFF}
                              checked={formData.discountType === DiscountType.PERCENTAGE_OFF}
                              onChange={(e) => handleInputChange('discountType', e.target.value)}
                              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-dark-300 flex items-center">
                              <Percent size={16} className="mr-1" />
                              Percentage Off
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value={DiscountType.FLAT_OFF}
                              checked={formData.discountType === DiscountType.FLAT_OFF}
                              onChange={(e) => handleInputChange('discountType', e.target.value)}
                              className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-dark-300 flex items-center">
                              <DollarSign size={16} className="mr-1" />
                              Flat Amount Off
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Discount Value * {formData.discountType === DiscountType.PERCENTAGE_OFF ? '(%)' : '($)'}
                          </label>
                          <input
                            type="number"
                            value={formData.value}
                            onChange={(e) => handleInputChange('value', e.target.value)}
                            required
                            min="0"
                            step={formData.discountType === DiscountType.PERCENTAGE_OFF ? "0.01" : "0.01"}
                            placeholder={formData.discountType === DiscountType.PERCENTAGE_OFF ? "10" : "5.00"}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Max Discount ($)
                          </label>
                          <input
                            type="number"
                            value={formData.maxDiscount}
                            onChange={(e) => handleInputChange('maxDiscount', e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="25.00"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Applies to Fee Type
                        </label>
                        <select
                          value={formData.appliesToFeeType}
                          onChange={(e) => handleInputChange('appliesToFeeType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        >
                          <option value="">All Fee Types</option>
                          {feeTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Region
                        </label>
                        <select
                          value={formData.regionId}
                          onChange={(e) => handleInputChange('regionId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        >
                          <option value="">All Regions</option>
                          {regions.map(region => (
                            <option key={region.id} value={region.id}>
                              {region.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Min Transaction Amount ($)
                          </label>
                          <input
                            type="number"
                            value={formData.minTransactionAmount}
                            onChange={(e) => handleInputChange('minTransactionAmount', e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="100.00"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Max Transaction Amount ($)
                          </label>
                          <input
                            type="number"
                            value={formData.maxTransactionAmount}
                            onChange={(e) => handleInputChange('maxTransactionAmount', e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="10000.00"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Usage Limit
                        </label>
                        <input
                          type="number"
                          value={formData.usageLimit}
                          onChange={(e) => handleInputChange('usageLimit', e.target.value)}
                          min="1"
                          placeholder="1000"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        />
                        <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                          Leave empty for unlimited usage
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Start Date *
                          </label>
                          <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => handleInputChange('startDate', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            End Date
                          </label>
                          <input
                            type="date"
                            value={formData.endDate}
                            onChange={(e) => handleInputChange('endDate', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => handleInputChange('isActive', e.target.checked)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">
                            Active
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Right Column - Countries */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300">
                          Applicable Countries
                        </label>
                        <button
                          type="button"
                          onClick={handleSelectAllCountries}
                          className="text-sm text-green-600 hover:text-green-700"
                        >
                          {selectedCountries.length === countries.length ? 'Deselect All' : 'Select All'}
                        </button>
                      </div>
                      
                      <div className="border border-gray-300 dark:border-dark-600 rounded-lg p-3 max-h-96 overflow-y-auto bg-gray-50 dark:bg-dark-700">
                        <div className="grid grid-cols-1 gap-2">
                          {getFilteredCountries().map(country => (
                            <label key={country.code} className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-dark-600 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                checked={selectedCountries.includes(country.code)}
                                onChange={() => handleCountryToggle(country.code)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              <span className="ml-3 text-sm text-gray-700 dark:text-dark-300">
                                {country.name} ({country.code})
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-dark-400 mt-2">
                        {selectedCountries.length} countries selected
                        {selectedCountries.length === 0 && ' (will apply to all countries)'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Account Type
                    </label>
                    <select
                      value={formData.appliesToAccountType}
                      onChange={(e) => handleInputChange('appliesToAccountType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                    >
                      <option value="">All Account Types</option>
                      <option value="PERSONAL">Personal</option>
                      <option value="BUSINESS">Business</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200 dark:border-dark-700">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Saving...' : editingDiscount ? 'Update Discount Rule' : 'Create Discount Rule'}
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

export default AddDiscountModal;