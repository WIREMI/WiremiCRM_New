import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, DollarSign, Percent } from 'lucide-react';
import { FeeType, FeeSubType, FeeMethod, FeeValueType, Region } from '../../../types';
import { countries } from '../../../data/countries';

interface AddFeeRuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (feeData: any) => void;
  regions: Region[];
  editingFee?: any;
}

const AddFeeRuleModal: React.FC<AddFeeRuleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  regions,
  editingFee
}) => {
  const [formData, setFormData] = useState({
    name: editingFee?.name || '',
    description: editingFee?.description || '',
    feeType: editingFee?.feeType || FeeType.CARD_DEPOSIT,
    feeSubType: editingFee?.feeSubType || '',
    feeMethod: editingFee?.feeMethod || '',
    valueType: editingFee?.valueType || FeeValueType.PERCENTAGE,
    value: editingFee?.value || '',
    cap: editingFee?.cap || '',
    minFee: editingFee?.minFee || '',
    currency: editingFee?.currency || 'USD',
    regionId: editingFee?.regionId || '',
    countryCodes: editingFee?.countryCodes || [],
    effectiveFrom: editingFee?.effectiveFrom ? editingFee.effectiveFrom.split('T')[0] : new Date().toISOString().split('T')[0],
    effectiveTo: editingFee?.effectiveTo ? editingFee.effectiveTo.split('T')[0] : '',
    isActive: editingFee?.isActive ?? true
  });

  const [selectedCountries, setSelectedCountries] = useState<string[]>(editingFee?.countryCodes || []);
  const [loading, setLoading] = useState(false);

  const feeTypeOptions = Object.values(FeeType).map(type => ({
    value: type,
    label: type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  const currencyOptions = [
    { value: 'USD', label: 'USD - US Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'GBP', label: 'GBP - British Pound' },
    { value: 'CAD', label: 'CAD - Canadian Dollar' },
    { value: 'XAF', label: 'XAF - Central African CFA Franc' },
    { value: 'NGN', label: 'NGN - Nigerian Naira' },
    { value: 'KES', label: 'KES - Kenyan Shilling' },
    { value: 'ZAR', label: 'ZAR - South African Rand' },
    { value: 'AUD', label: 'AUD - Australian Dollar' },
    { value: 'JPY', label: 'JPY - Japanese Yen' },
    { value: 'CNY', label: 'CNY - Chinese Yuan' },
    { value: 'INR', label: 'INR - Indian Rupee' },
    { value: 'BRL', label: 'BRL - Brazilian Real' },
    { value: 'MXN', label: 'MXN - Mexican Peso' }
  ];

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
      const feeData = {
        ...formData,
        countryCodes: selectedCountries,
        value: parseFloat(formData.value),
        cap: formData.cap ? parseFloat(formData.cap) : undefined,
        minFee: formData.minFee ? parseFloat(formData.minFee) : undefined,
        effectiveFrom: new Date(formData.effectiveFrom).toISOString(),
        effectiveTo: formData.effectiveTo ? new Date(formData.effectiveTo).toISOString() : undefined
      };

      await onSave(feeData);
      onClose();
    } catch (error) {
      console.error('Error saving fee rule:', error);
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
                    <DollarSign className="w-6 h-6 text-blue-500" />
                    <span>{editingFee ? 'Edit Fee Rule' : 'Add New Fee Rule'}</span>
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
                          Fee Name *
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          placeholder="e.g., Card Deposit Fee"
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
                          placeholder="Describe when this fee applies..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Fee Type *
                        </label>
                        <select
                          value={formData.feeType}
                          onChange={(e) => handleInputChange('feeType', e.target.value)}
                          required
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        >
                          {feeTypeOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Currency *
                          </label>
                          <select
                            value={formData.currency}
                            onChange={(e) => handleInputChange('currency', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          >
                            {currencyOptions.map(option => (
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
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Value Type *
                        </label>
                        <div className="flex space-x-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value={FeeValueType.PERCENTAGE}
                              checked={formData.valueType === FeeValueType.PERCENTAGE}
                              onChange={(e) => handleInputChange('valueType', e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-dark-300 flex items-center">
                              <Percent size={16} className="mr-1" />
                              Percentage
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              value={FeeValueType.FLAT}
                              checked={formData.valueType === FeeValueType.FLAT}
                              onChange={(e) => handleInputChange('valueType', e.target.value)}
                              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-dark-300 flex items-center">
                              <DollarSign size={16} className="mr-1" />
                              Flat Amount
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Value * {formData.valueType === FeeValueType.PERCENTAGE ? '(%)' : `(${formData.currency})`}
                          </label>
                          <input
                            type="number"
                            value={formData.value}
                            onChange={(e) => handleInputChange('value', e.target.value)}
                            required
                            min="0"
                            step={formData.valueType === FeeValueType.PERCENTAGE ? "0.01" : "0.01"}
                            placeholder={formData.valueType === FeeValueType.PERCENTAGE ? "2.5" : "5.00"}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Cap ({formData.currency})
                          </label>
                          <input
                            type="number"
                            value={formData.cap}
                            onChange={(e) => handleInputChange('cap', e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="10.00"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Min Fee ({formData.currency})
                          </label>
                          <input
                            type="number"
                            value={formData.minFee}
                            onChange={(e) => handleInputChange('minFee', e.target.value)}
                            min="0"
                            step="0.01"
                            placeholder="0.50"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Effective From *
                          </label>
                          <input
                            type="date"
                            value={formData.effectiveFrom}
                            onChange={(e) => handleInputChange('effectiveFrom', e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Effective To
                          </label>
                          <input
                            type="date"
                            value={formData.effectiveTo}
                            onChange={(e) => handleInputChange('effectiveTo', e.target.value)}
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
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                          className="text-sm text-blue-600 hover:text-blue-700"
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
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Saving...' : editingFee ? 'Update Fee Rule' : 'Create Fee Rule'}
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

export default AddFeeRuleModal;