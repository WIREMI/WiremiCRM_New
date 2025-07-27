import React, { useState } from 'react';
import { Calculator, DollarSign, Percent, Info } from 'lucide-react';
import { FeeType, FeeSubType, FeeMethod, AccountType, FeeCalculationResult } from '../../../types';

const FeeCalculatorTab: React.FC = () => {
  const [calculationParams, setCalculationParams] = useState({
    userId: '',
    accountType: AccountType.PERSONAL,
    feeType: FeeType.TRANSACTION,
    feeSubType: '',
    feeMethod: '',
    baseAmount: '',
    currency: 'USD',
    countryCode: '',
    regionId: '',
  });
  const [result, setResult] = useState<FeeCalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setCalculationParams(prev => ({ ...prev, [field]: value }));
    setError('');
    setResult(null);
  };

  const handleCalculate = async () => {
    if (!calculationParams.userId || !calculationParams.baseAmount || !calculationParams.countryCode) {
      setError('Please fill in all required fields (User ID, Amount, Country Code)');
      return;
    }

    setIsCalculating(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/pricing/calculate-fee', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...calculationParams,
      //     baseAmount: parseFloat(calculationParams.baseAmount)
      //   })
      // });
      // const data = await response.json();
      
      // Mock calculation for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const baseAmount = parseFloat(calculationParams.baseAmount);
      const mockResult: FeeCalculationResult = {
        baseAmount,
        feeAmount: baseAmount * 0.025, // 2.5% fee
        discountAmount: baseAmount * 0.005, // 0.5% discount
        finalFeeAmount: baseAmount * 0.02, // 2% final fee
        currency: calculationParams.currency,
        appliedFeeRules: ['fee-rule-1', 'fee-rule-2'],
        appliedDiscounts: ['discount-rule-1'],
        calculationDetails: {
          steps: [
            {
              feeDefinitionId: 'fee-rule-1',
              feeName: `${calculationParams.feeType.replace(/_/g, ' ')} Fee`,
              valueType: 'PERCENTAGE',
              value: 2.5,
              calculatedAmount: baseAmount * 0.025
            }
          ],
          countryCode: calculationParams.countryCode,
          regionId: calculationParams.regionId
        }
      };

      setResult(mockResult);
    } catch (err) {
      setError('Failed to calculate fee. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Calculator className="w-6 h-6 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          Fee Calculator
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Calculation Parameters
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                User ID *
              </label>
              <input
                type="text"
                value={calculationParams.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                placeholder="Enter user ID (e.g., WRM001234)"
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Account Type *
              </label>
              <select
                value={calculationParams.accountType}
                onChange={(e) => handleInputChange('accountType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value="PERSONAL">Personal</option>
                <option value="BUSINESS">Business</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Base Amount *
                </label>
                <input
                  type="number"
                  value={calculationParams.baseAmount}
                  onChange={(e) => handleInputChange('baseAmount', e.target.value)}
                  placeholder="100.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Currency
                </label>
                <select
                  value={calculationParams.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="CAD">CAD</option>
                  <option value="XAF">XAF</option>
                  <option value="NGN">NGN</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Fee Type
              </label>
              <select
                value={calculationParams.feeType}
                onChange={(e) => handleInputChange('feeType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value="CARD_DEPOSIT">Card Deposit</option>
                <option value="MOMO_DEPOSIT_MTN">MTN Mobile Money</option>
                <option value="MOMO_DEPOSIT_ORANGE">Orange Mobile Money</option>
                <option value="BANK_DEPOSIT">Bank Deposit</option>
                <option value="INTERAC_DEPOSIT">Interac Deposit</option>
                <option value="PAYPAL_DEPOSIT">PayPal Deposit</option>
                <option value="VIRTUAL_CARDS_WITHDRAWALS">Virtual Card Withdrawals</option>
                <option value="ON_RAMP">Crypto On-Ramp</option>
                <option value="OFF_RAMP">Crypto Off-Ramp</option>
                <option value="LOAN_PROCESSING">Loan Processing</option>
                <option value="INVESTMENT">Investment</option>
                <option value="DONATION">Donation</option>
              </select>
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Country Code *
                </label>
                <input
                  type="text"
                  value={calculationParams.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  required
                  placeholder="e.g., US, CA, NG"
                  maxLength={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                  Region
                </label>
                <select
                  value={calculationParams.regionId}
                  onChange={(e) => handleInputChange('regionId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                >
                  <option value="">Auto-detect from country</option>
                  <option value="region-1">North America</option>
                  <option value="region-2">Sub-Saharan Africa</option>
                  <option value="region-3">Europe</option>
                  <option value="region-4">MENA</option>
                  <option value="region-5">Asia Pacific</option>
                  <option value="region-6">LATAM</option>
                  <option value="region-7">Oceania</option>
                </select>
              </div>
            </div>


            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {isCalculating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Calculating...
                </>
              ) : (
                <>
                  <Calculator size={16} className="mr-2" />
                  Calculate Fee
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Calculation Results
          </h4>

          {result ? (
            <div className="space-y-6">
              {/* Summary */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Base Amount</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(result.baseAmount, result.currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Final Fee</p>
                    <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(result.finalFeeAmount, result.currency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-red-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                      Total Fees
                    </span>
                  </div>
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(result.feeAmount, result.currency)}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center">
                    <Percent size={16} className="text-green-500 mr-2" />
                    <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                      Total Discounts
                    </span>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">
                    -{formatCurrency(result.discountAmount, result.currency)}
                  </span>
                </div>

                <div className="border-t border-gray-200 dark:border-dark-600 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                      Final Amount
                    </span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(result.finalFeeAmount, result.currency)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Applied Rules */}
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-gray-900 dark:text-dark-100">Applied Rules:</h5>
                
                {result.appliedFeeRules.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-dark-400 mb-2">Fee Rules:</p>
                    <div className="space-y-1">
                      {result.appliedFeeRules.map((ruleId, index) => (
                        <div key={index} className="text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 px-2 py-1 rounded">
                          {ruleId}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.appliedDiscounts.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 dark:text-dark-400 mb-2">Discount Rules:</p>
                    <div className="space-y-1">
                      {result.appliedDiscounts.map((discountId, index) => (
                        <div key={index} className="text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 px-2 py-1 rounded">
                          {discountId}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-dark-400">
                Enter calculation parameters and click "Calculate Fee" to see results
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeeCalculatorTab;