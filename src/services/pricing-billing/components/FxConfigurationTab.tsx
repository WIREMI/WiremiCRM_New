import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, RefreshCw, TrendingUp, DollarSign, Globe } from 'lucide-react';
import { ExchangeRate, CurrencyPairConfiguration } from '../../../types';
import { currencies } from '../../../data/currencies';

const FxConfigurationTab: React.FC = () => {
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [currencyPairs, setCurrencyPairs] = useState<CurrencyPairConfiguration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRateModal, setShowAddRateModal] = useState(false);
  const [showAddPairModal, setShowAddPairModal] = useState(false);
  const [newPairData, setNewPairData] = useState({
    baseCurrency: '',
    targetCurrency: '',
    refreshInterval: '3600',
    autoUpdate: false,
    tolerance: '',
    markup: '',
    spread: ''
  });
  const [pairValidationErrors, setPairValidationErrors] = useState<string[]>([]);
  const [isCreatingPair, setIsCreatingPair] = useState(false);

  useEffect(() => {
    loadFxData();
  }, []);

  const loadFxData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [ratesResponse, pairsResponse] = await Promise.all([
      //   fetch('/api/v1/pricing/fx/rates'),
      //   fetch('/api/v1/pricing/fx/pairs')
      // ]);
      
      // Mock data for demonstration
      const mockRates: ExchangeRate[] = [
        {
          id: '1',
          fromCurrency: 'USD',
          toCurrency: 'EUR',
          rate: 0.85,
          lastUpdated: new Date().toISOString(),
          source: 'ECB',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          fromCurrency: 'USD',
          toCurrency: 'CAD',
          rate: 1.35,
          lastUpdated: new Date().toISOString(),
          source: 'Bank of Canada',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        },
        {
          id: '3',
          fromCurrency: 'USD',
          toCurrency: 'XAF',
          rate: 600.50,
          lastUpdated: new Date().toISOString(),
          source: 'BEAC',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        },
        {
          id: '4',
          fromCurrency: 'EUR',
          toCurrency: 'GBP',
          rate: 0.86,
          lastUpdated: new Date().toISOString(),
          source: 'Bank of England',
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        }
      ];

      const mockPairs: CurrencyPairConfiguration[] = [
        {
          id: '1',
          baseCurrency: 'USD',
          targetCurrency: 'EUR',
          isActive: true,
          refreshInterval: 3600,
          autoUpdate: true,
          tolerance: 0.05,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        },
        {
          id: '2',
          baseCurrency: 'USD',
          targetCurrency: 'CAD',
          isActive: true,
          refreshInterval: 1800,
          autoUpdate: true,
          tolerance: 0.03,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: new Date().toISOString()
        }
      ];

      setExchangeRates(mockRates);
      setCurrencyPairs(mockPairs);
    } catch (error) {
      console.error('Failed to load FX data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRate = (rate: number) => {
    return rate.toFixed(4);
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
  };

  const getSourceBadge = (source: string) => {
    const colors = {
      'ECB': 'bg-blue-100 text-blue-800',
      'Bank of Canada': 'bg-red-100 text-red-800',
      'BEAC': 'bg-green-100 text-green-800',
      'Bank of England': 'bg-purple-100 text-purple-800',
      'manual': 'bg-gray-100 text-gray-800'
    };
    return colors[source as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleRefreshRate = async (rateId: string) => {
    try {
      // TODO: Call API to refresh specific rate
      console.log('Refreshing rate:', rateId);
      loadFxData();
    } catch (error) {
      console.error('Failed to refresh rate:', error);
    }
  };

  const handleRefreshAllRates = async () => {
    try {
      // TODO: Call API to refresh all rates
      console.log('Refreshing all rates');
      loadFxData();
    } catch (error) {
      console.error('Failed to refresh all rates:', error);
    }
  };

  const validatePairData = () => {
    const errors: string[] = [];
    
    if (!newPairData.baseCurrency) {
      errors.push('Base currency is required');
    }
    
    if (!newPairData.targetCurrency) {
      errors.push('Target currency is required');
    }
    
    if (newPairData.baseCurrency === newPairData.targetCurrency) {
      errors.push('Base and target currencies must be different');
    }
    
    if (newPairData.tolerance && (parseFloat(newPairData.tolerance) < 0 || parseFloat(newPairData.tolerance) > 100)) {
      errors.push('Tolerance must be between 0 and 100%');
    }
    
    if (newPairData.markup && (parseFloat(newPairData.markup) < 0 || parseFloat(newPairData.markup) > 100)) {
      errors.push('Admin markup must be between 0 and 100%');
    }
    
    if (newPairData.spread && (parseFloat(newPairData.spread) < 0 || parseFloat(newPairData.spread) > 100)) {
      errors.push('Spread must be between 0 and 100%');
    }
    
    if (parseInt(newPairData.refreshInterval) < 60) {
      errors.push('Refresh interval must be at least 60 seconds');
    }
    
    setPairValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePairInputChange = (field: string, value: string | boolean) => {
    setNewPairData(prev => ({ ...prev, [field]: value }));
    setPairValidationErrors([]);
  };

  const handleCreatePair = async () => {
    if (!validatePairData()) {
      return;
    }
    
    setIsCreatingPair(true);
    try {
      // TODO: Call API to create currency pair
      const pairData = {
        baseCurrency: newPairData.baseCurrency,
        targetCurrency: newPairData.targetCurrency,
        refreshInterval: parseInt(newPairData.refreshInterval),
        autoUpdate: newPairData.autoUpdate,
        tolerance: newPairData.tolerance ? parseFloat(newPairData.tolerance) / 100 : undefined,
        markup: newPairData.markup ? parseFloat(newPairData.markup) / 100 : undefined,
        spread: newPairData.spread ? parseFloat(newPairData.spread) / 100 : undefined,
        isActive: true
      };
      
      console.log('Creating currency pair:', pairData);
      
      // Reset form
      setNewPairData({
        baseCurrency: '',
        targetCurrency: '',
        refreshInterval: '3600',
        autoUpdate: false,
        tolerance: '',
        markup: '',
        spread: ''
      });
      
      setShowAddPairModal(false);
      loadFxData();
    } catch (error) {
      console.error('Failed to create currency pair:', error);
      setPairValidationErrors(['Failed to create currency pair. Please try again.']);
    } finally {
      setIsCreatingPair(false);
    }
  };

  const handleDeletePair = async (pairId: string) => {
    if (window.confirm('Are you sure you want to delete this currency pair configuration?')) {
      try {
        // TODO: Call API to delete currency pair
        console.log('Deleting currency pair:', pairId);
        loadFxData();
      } catch (error) {
        console.error('Failed to delete currency pair:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Globe className="w-6 h-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
            FX Configuration
          </h3>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleRefreshAllRates}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh All Rates
          </button>
          <button
            onClick={() => setShowAddRateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Exchange Rate
          </button>
        </div>
      </div>

      {/* Exchange Rates Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Current Exchange Rates</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Currency Pair
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Exchange Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-dark-400">
                    Loading exchange rates...
                  </td>
                </tr>
              ) : exchangeRates.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-dark-400">
                    No exchange rates configured.
                  </td>
                </tr>
              ) : (
                exchangeRates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                          {rate.fromCurrency}
                        </span>
                        <TrendingUp size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                          {rate.toCurrency}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-bold text-gray-900 dark:text-dark-100">
                        {formatRate(rate.rate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSourceBadge(rate.source)}`}>
                        {rate.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500 dark:text-dark-400">
                        {formatLastUpdated(rate.lastUpdated)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rate.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {rate.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRefreshRate(rate.id)}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1"
                          title="Refresh Rate"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                          <Edit size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Currency Pair Configurations */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Currency Pair Configurations</h4>
            <button
              onClick={() => setShowAddPairModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Add Currency Pair
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Currency Pair
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Refresh Interval
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Auto Update
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Tolerance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Markup & Spread
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {currencyPairs.map((pair) => (
                <tr key={pair.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {pair.baseCurrency}
                      </span>
                      <span className="text-gray-400">/</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {pair.targetCurrency}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-dark-100">
                      {Math.floor(pair.refreshInterval / 60)} minutes
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      pair.autoUpdate ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {pair.autoUpdate ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-dark-100">
                      {pair.tolerance ? `${(pair.tolerance * 100).toFixed(2)}%` : 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-100">
                      {pair.markup && <div>Markup: {(pair.markup * 100).toFixed(2)}%</div>}
                      {pair.spread && <div>Spread: {(pair.spread * 100).toFixed(2)}%</div>}
                      {!pair.markup && !pair.spread && <span className="text-gray-500">No markup/spread</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      pair.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {pair.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeletePair(pair.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddRateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Add Exchange Rate
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Exchange rate form will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddRateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddRateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Rate
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddPairModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Add Currency Pair Configuration
            </h3>
            
            {pairValidationErrors.length > 0 && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Please fix the following errors:</h4>
                <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                  {pairValidationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Currency Selection */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-dark-100">Currency Pair</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    From Currency *
                  </label>
                  <select
                    value={newPairData.baseCurrency}
                    onChange={(e) => handlePairInputChange('baseCurrency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  >
                    <option value="">Select base currency...</option>
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    To Currency *
                  </label>
                  <select
                    value={newPairData.targetCurrency}
                    onChange={(e) => handlePairInputChange('targetCurrency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  >
                    <option value="">Select target currency...</option>
                    {currencies.filter(c => c.code !== newPairData.baseCurrency).map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} - {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Refresh Interval (seconds) *
                  </label>
                  <select
                    value={newPairData.refreshInterval}
                    onChange={(e) => handlePairInputChange('refreshInterval', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  >
                    <option value="60">1 minute</option>
                    <option value="300">5 minutes</option>
                    <option value="900">15 minutes</option>
                    <option value="1800">30 minutes</option>
                    <option value="3600">1 hour</option>
                    <option value="21600">6 hours</option>
                    <option value="86400">24 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPairData.autoUpdate}
                      onChange={(e) => handlePairInputChange('autoUpdate', e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">
                      Enable Auto Update
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Pricing Configuration */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-dark-100">Pricing Configuration</h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Admin Markup (%)
                  </label>
                  <input
                    type="number"
                    value={newPairData.markup}
                    onChange={(e) => handlePairInputChange('markup', e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g., 2.5"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                    Additional markup applied to the base exchange rate
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Spread (%)
                  </label>
                  <input
                    type="number"
                    value={newPairData.spread}
                    onChange={(e) => handlePairInputChange('spread', e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g., 1.0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                    Bid-ask spread for currency conversion
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                    Rate Change Tolerance (%)
                  </label>
                  <input
                    type="number"
                    value={newPairData.tolerance}
                    onChange={(e) => handlePairInputChange('tolerance', e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="e.g., 5.0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                    Alert threshold for significant rate changes
                  </p>
                </div>
                
                {/* Preview Calculation */}
                {newPairData.baseCurrency && newPairData.targetCurrency && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Preview</h5>
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <div>Pair: {newPairData.baseCurrency}/{newPairData.targetCurrency}</div>
                      <div>Refresh: Every {Math.floor(parseInt(newPairData.refreshInterval) / 60)} minutes</div>
                      {newPairData.markup && <div>Markup: {newPairData.markup}%</div>}
                      {newPairData.spread && <div>Spread: {newPairData.spread}%</div>}
                      {newPairData.tolerance && <div>Alert Tolerance: {newPairData.tolerance}%</div>}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddPairModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePair}
                disabled={isCreatingPair || !newPairData.baseCurrency || !newPairData.targetCurrency || newPairData.baseCurrency === newPairData.targetCurrency}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCreatingPair ? 'Creating...' : 'Create Currency Pair'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FxConfigurationTab;