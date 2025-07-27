import React, { useState, Fragment, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Globe, Plus, Trash2 } from 'lucide-react';
import { Region, Country } from '../../../types';
import { countries as allCountries } from '../../../data/countries';

interface ManageCountriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  region: Region;
  onCountriesUpdated: () => void;
}

const ManageCountriesModal: React.FC<ManageCountriesModalProps> = ({
  isOpen,
  onClose,
  region,
  onCountriesUpdated
}) => {
  const [regionCountries, setRegionCountries] = useState<Country[]>(region.countries || []);
  const [availableCountries, setAvailableCountries] = useState<typeof allCountries>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Filter out countries that are already assigned to this region
    const assignedCodes = regionCountries.map(c => c.code);
    const available = allCountries.filter(c => !assignedCodes.includes(c.code));
    setAvailableCountries(available);
  }, [regionCountries]);

  const handleAddCountry = async () => {
    if (!selectedCountryCode) return;

    setLoading(true);
    try {
      const countryToAdd = allCountries.find(c => c.code === selectedCountryCode);
      if (!countryToAdd) return;

      // TODO: Call API to add country to region
      // const response = await fetch('/api/v1/pricing/countries', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     name: countryToAdd.name,
      //     code: countryToAdd.code,
      //     regionId: region.id
      //   })
      // });

      // Mock adding country
      const newCountry: Country = {
        id: `country-${Date.now()}`,
        name: countryToAdd.name,
        code: countryToAdd.code,
        regionId: region.id,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setRegionCountries(prev => [...prev, newCountry]);
      setSelectedCountryCode('');
      onCountriesUpdated();
    } catch (error) {
      console.error('Error adding country:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCountry = async (countryId: string) => {
    if (window.confirm('Are you sure you want to remove this country from the region?')) {
      setLoading(true);
      try {
        // TODO: Call API to remove country
        // await fetch(`/api/v1/pricing/countries/${countryId}`, { method: 'DELETE' });

        setRegionCountries(prev => prev.filter(c => c.id !== countryId));
        onCountriesUpdated();
      } catch (error) {
        console.error('Error removing country:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getCountryFlag = (countryCode: string) => {
    // Simple flag emoji mapping - in production, use a proper flag library
    const flags: { [key: string]: string } = {
      'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽', 'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷',
      'IT': '🇮🇹', 'ES': '🇪🇸', 'NL': '🇳🇱', 'BE': '🇧🇪', 'CH': '🇨🇭', 'AT': '🇦🇹',
      'SE': '🇸🇪', 'NO': '🇳🇴', 'DK': '🇩🇰', 'FI': '🇫🇮', 'IE': '🇮🇪', 'PT': '🇵🇹',
      'NG': '🇳🇬', 'KE': '🇰🇪', 'ZA': '🇿🇦', 'GH': '🇬🇭', 'UG': '🇺🇬', 'TZ': '🇹🇿',
      'ET': '🇪🇹', 'RW': '🇷🇼', 'SN': '🇸🇳', 'CI': '🇨🇮', 'CM': '🇨🇲', 'BF': '🇧🇫',
      'CN': '🇨🇳', 'JP': '🇯🇵', 'KR': '🇰🇷', 'IN': '🇮🇳', 'ID': '🇮🇩', 'TH': '🇹🇭',
      'VN': '🇻🇳', 'PH': '🇵🇭', 'MY': '🇲🇾', 'SG': '🇸🇬', 'HK': '🇭🇰', 'TW': '🇹🇼',
      'AU': '🇦🇺', 'NZ': '🇳🇿', 'FJ': '🇫🇯', 'PG': '🇵🇬', 'BR': '🇧🇷', 'AR': '🇦🇷',
      'CL': '🇨🇱', 'CO': '🇨🇴', 'PE': '🇵🇪', 'VE': '🇻🇪', 'EC': '🇪🇨', 'BO': '🇧🇴',
      'AE': '🇦🇪', 'SA': '🇸🇦', 'QA': '🇶🇦', 'KW': '🇰🇼', 'BH': '🇧🇭', 'OM': '🇴🇲',
      'JO': '🇯🇴', 'LB': '🇱🇧', 'IL': '🇮🇱', 'TR': '🇹🇷', 'EG': '🇪🇬', 'MA': '🇲🇦'
    };
    return flags[countryCode] || '🏳️';
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-6 h-6 text-blue-500" />
                    <span>Manage Countries - {region.name}</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                <div className="mt-6">
                  {/* Add Country Section */}
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                    <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">
                      Add Country to Region
                    </h4>
                    <div className="flex space-x-3">
                      <select
                        value={selectedCountryCode}
                        onChange={(e) => setSelectedCountryCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                      >
                        <option value="">Select a country to add...</option>
                        {availableCountries.map(country => (
                          <option key={country.code} value={country.code}>
                            {getCountryFlag(country.code)} {country.name} ({country.code})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={handleAddCountry}
                        disabled={!selectedCountryCode || loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                      >
                        <Plus size={16} className="mr-2" />
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Current Countries */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">
                      Countries in {region.name} ({regionCountries.length})
                    </h4>
                    
                    {regionCountries.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-dark-600 rounded-lg">
                        <div className="divide-y divide-gray-200 dark:divide-dark-600">
                          {regionCountries.map(country => (
                            <div key={country.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-dark-700">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">{getCountryFlag(country.code)}</span>
                                <div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                                    {country.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-dark-400">
                                    {country.code}
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveCountry(country.id)}
                                disabled={loading}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 disabled:opacity-50"
                                title="Remove country"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 border border-gray-200 dark:border-dark-600 rounded-lg">
                        <Globe className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 dark:text-dark-400">No countries assigned to this region yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ManageCountriesModal;