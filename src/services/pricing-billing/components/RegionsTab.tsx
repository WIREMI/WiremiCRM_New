import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Globe, MapPin, Settings } from 'lucide-react';
import { Region } from '../../../types';
import ManageCountriesModal from './ManageCountriesModal';

const RegionsTab: React.FC = () => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  useEffect(() => {
    loadRegions();
  }, []);

  const loadRegions = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/pricing/regions');
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockRegions: Region[] = [
        {
          id: '1',
          name: 'North America',
          code: 'NA',
          currency: 'USD',
          timezone: 'America/New_York',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          countries: [
            { id: 'c1', name: 'United States', code: 'US', regionId: '1', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
            { id: 'c2', name: 'Canada', code: 'CA', regionId: '1', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
            { id: 'c3', name: 'Mexico', code: 'MX', regionId: '1', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
          ]
        },
        {
          id: '2',
          name: 'Sub-Saharan Africa',
          code: 'SSA',
          currency: 'XAF',
          timezone: 'Africa/Douala',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          countries: [
            { id: 'c4', name: 'Nigeria', code: 'NG', regionId: '2', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
            { id: 'c5', name: 'Kenya', code: 'KE', regionId: '2', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
            { id: 'c6', name: 'South Africa', code: 'ZA', regionId: '2', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
          ]
        },
        {
          id: '3',
          name: 'Europe',
          code: 'EU',
          currency: 'EUR',
          timezone: 'Europe/London',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          countries: [
            { id: 'c7', name: 'United Kingdom', code: 'GB', regionId: '3', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
            { id: 'c8', name: 'Germany', code: 'DE', regionId: '3', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
            { id: 'c9', name: 'France', code: 'FR', regionId: '3', isActive: true, createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' }
          ]
        },
        {
          id: '4',
          name: 'MENA',
          code: 'MENA',
          currency: 'AED',
          timezone: 'Asia/Dubai',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          countries: []
        },
        {
          id: '5',
          name: 'Asia Pacific',
          code: 'APAC',
          currency: 'USD',
          timezone: 'Asia/Tokyo',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          countries: []
        },
        {
          id: '6',
          name: 'LATAM',
          code: 'LATAM',
          currency: 'USD',
          timezone: 'America/Sao_Paulo',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          countries: []
        },
        {
          id: '7',
          name: 'Oceania',
          code: 'OCE',
          currency: 'AUD',
          timezone: 'Australia/Sydney',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
          countries: []
        }
      ];

      setRegions(mockRegions);
    } catch (error) {
      console.error('Failed to load regions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageCountries = (region: Region) => {
    setSelectedRegion(region);
    setShowCountriesModal(true);
  };

  const getCountryFlag = (countryCode: string) => {
    // Simple flag emoji mapping - in production, use a proper flag library
    const flags: { [key: string]: string } = {
      'US': '🇺🇸', 'CA': '🇨🇦', 'MX': '🇲🇽',
      'GB': '🇬🇧', 'DE': '🇩🇪', 'FR': '🇫🇷', 'IT': '🇮🇹', 'ES': '🇪🇸',
      'JP': '🇯🇵', 'AU': '🇦🇺', 'SG': '🇸🇬', 'HK': '🇭🇰',
      'NG': '🇳🇬', 'KE': '🇰🇪', 'ZA': '🇿🇦', 'GH': '🇬🇭', 'UG': '🇺🇬', 'TZ': '🇹🇿'
    };
    return flags[countryCode] || '🏳️';
  };

  const handleDeleteRegion = async (regionId: string) => {
    if (window.confirm('Are you sure you want to delete this region? This will affect all associated pricing rules.')) {
      try {
        // TODO: Call API to delete region
        console.log('Deleting region:', regionId);
        loadRegions();
      } catch (error) {
        console.error('Failed to delete region:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          Regions & Countries
        </h3>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Add Region
        </button>
      </div>

      {/* Regions Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-dark-600 rounded-lg h-48"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regions.map((region) => (
            <div key={region.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Globe className="w-8 h-8 text-blue-500" />
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 dark:text-dark-100">
                      {region.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-dark-400">
                      {region.code}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDeleteRegion(region.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Countries */}
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Countries:</h5>
                {region.countries && region.countries.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {region.countries.slice(0, 5).map((country) => (
                      <span key={country.code} className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-dark-600 px-2 py-1 rounded-full text-xs">
                        <span>{getCountryFlag(country.code)}</span>
                        <span className="font-medium text-gray-700 dark:text-dark-300">{country.code}</span>
                      </span>
                    ))}
                    {region.countries.length > 5 && (
                      <span className="inline-flex items-center bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-full text-xs">
                        +{region.countries.length - 5} more
                      </span>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-dark-400">No countries assigned</p>
                )}
              </div>

              {/* Region Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-400">Currency:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-100">{region.currency}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-400">Timezone:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-100">{region.timezone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-dark-400">Countries:</span>
                  <span className="font-medium text-gray-900 dark:text-dark-100">{region.countries?.length || 0}</span>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  region.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {region.isActive ? 'Active' : 'Inactive'}
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleManageCountries(region)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium flex items-center"
                  >
                    <Settings size={14} className="mr-1" />
                    Manage Countries
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manage Countries Modal */}
      {selectedRegion && (
        <ManageCountriesModal
          isOpen={showCountriesModal}
          onClose={() => setShowCountriesModal(false)}
          region={selectedRegion}
          onCountriesUpdated={loadRegions}
        />
      )}

      {/* Create Region Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Create New Region
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Region creation form will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Region
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionsTab;