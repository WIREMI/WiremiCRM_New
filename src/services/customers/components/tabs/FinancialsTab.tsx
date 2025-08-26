import React, { useState } from 'react';
import { Wallet, DollarSign, PiggyBank, TrendingUp, CreditCard, Star, Eye, EyeOff, Lock, Repeat, Users } from 'lucide-react';
import { PersonalAccount, BusinessAccount, Wallet as WalletType } from '../../../../types';

interface FinancialsTabProps {
  customer: PersonalAccount | BusinessAccount;
  customerType: 'personal' | 'business';
}

const FinancialsTab: React.FC<FinancialsTabProps> = ({ customer, customerType }) => {
  const [showBalances, setShowBalances] = useState(true);

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    if (amount === undefined || amount === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCreditScoreColor = (score: number) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCreditScoreBackground = (score: number) => {
    if (score >= 800) return 'bg-green-100';
    if (score >= 700) return 'bg-blue-100';
    if (score >= 600) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getCreditScoreLabel = (score: number) => {
    if (score >= 800) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 600) return 'Fair';
    return 'Poor';
  };

  const getTotalBalance = () => {
    return (customer.wallets || []).reduce((total, wallet) => {
      // Convert all to base currency for total (simplified calculation)
      return total + wallet.balance;
    }, 0);
  };

  const getBaseCurrencyWallet = () => {
    return (customer.wallets || []).find(wallet => wallet.isBaseCurrency);
  };

  const getNonBaseCurrencyWallets = () => {
    return (customer.wallets || []).filter(wallet => !wallet.isBaseCurrency);
  };

  const baseCurrencyWallet = getBaseCurrencyWallet();

  return (
    <div className="space-y-6">
      {/* Financial Overview Header */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Wallet className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Financial Overview</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Multi-currency wallets and financial portfolio</p>
            </div>
          </div>
          <button
            onClick={() => setShowBalances(!showBalances)}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {showBalances ? <EyeOff size={16} /> : <Eye size={16} />}
            <span>{showBalances ? 'Hide' : 'Show'} Balances</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Cash Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                {showBalances ? formatCurrency(customer.cashBalance, baseCurrencyWallet?.currency) : '••••••'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <DollarSign size={24} className="text-blue-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Savings Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                {showBalances ? formatCurrency(customer.savingsBalance, baseCurrencyWallet?.currency) : '••••••'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <PiggyBank size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Investment Balance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                {showBalances ? formatCurrency(customer.investmentBalance, baseCurrencyWallet?.currency) : '••••••'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <TrendingUp size={24} className="text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Accrued Interest</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                {showBalances ? formatCurrency(customer.accruedInterest, baseCurrencyWallet?.currency) : '••••••'}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <Star size={24} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Credit Score */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <CreditCard className="mr-2 text-indigo-500" size={20} />
          Credit Score
        </h4>
        <div className="flex items-center justify-between">
          <div className={`flex items-center justify-center w-24 h-24 rounded-full ${getCreditScoreBackground(customer.creditScore || 0)}`}>
            <div className={`flex items-center justify-center w-24 h-24 rounded-full ${getCreditScoreBackground(customer.creditScore)}`}>
              <span className={`text-3xl font-bold ${getCreditScoreColor(customer.creditScore)}`}>
                {customer.creditScore}
              </span>
            </div>
            <div>
              <div className={`text-xl font-semibold ${getCreditScoreColor(customer.creditScore)}`}>
                {getCreditScoreLabel(customer.creditScore)}
              </div>
              <div className="text-sm text-gray-600 dark:text-dark-400">
                Credit Score Range: 300-850
              </div>
              <div className="text-xs text-gray-500 dark:text-dark-500 mt-1">
                Last updated: {formatDate(new Date().toISOString())}
              Last updated: {formatDate(customer.updatedAt || new Date().toISOString())}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-dark-400 mb-2">Credit Utilization</div>
            <div className="w-32 bg-gray-200 dark:bg-dark-600 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: '35%' }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-dark-500 mt-1">35% utilization</div>
          </div>
        </div>
      </div>

      {/* Base Currency Wallet */}
      {baseCurrencyWallet && customer.wallets && customer.wallets.length > 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <Wallet className="mr-2 text-blue-500" size={20} />
            Base Currency Wallet
          </h4>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm opacity-90">Base Currency</div>
                <div className="text-2xl font-bold">{baseCurrencyWallet.currency}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">Primary</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-sm opacity-90">Available Balance</div>
              <div className="text-3xl font-bold">
                {showBalances ? formatCurrency(baseCurrencyWallet.balance, baseCurrencyWallet.currency) : '••••••••'}
              </div>
            </div>
            <div className="flex justify-between text-sm opacity-90">
              <span>Wallet ID: {baseCurrencyWallet.id}</span>
              <span>Last Transaction: {baseCurrencyWallet.lastTransactionAt ? formatDate(baseCurrencyWallet.lastTransactionAt) : 'None'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Currency Wallets */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <CreditCard className="mr-2 text-green-500" size={20} />
          Multi-Currency Wallets
        </h4>
        
        {getNonBaseCurrencyWallets().length > 0 && customer.wallets && customer.wallets.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getNonBaseCurrencyWallets().map((wallet) => (
              <div key={wallet.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {wallet.currency.substring(0, 2)}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-dark-100">{wallet.currency}</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-dark-400">
                    {wallet.currency === 'XAF' ? 'Central African CFA' : 
                     wallet.currency === 'GBP' ? 'British Pound' :
                     wallet.currency === 'EUR' ? 'Euro' :
                     wallet.currency === 'USD' ? 'US Dollar' : wallet.currency}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-600 dark:text-dark-400">Balance</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-dark-100">
                    {showBalances ? formatCurrency(wallet.balance, wallet.currency) : '••••••'}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-dark-500">
                  <div>Created: {formatDate(wallet.createdAt)}</div>
                  {wallet.lastTransactionAt && (
                    <div>Last Transaction: {formatDate(wallet.lastTransactionAt)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-dark-400">No additional currency wallets</p>
          </div>
        )}
      </div>

      {/* Savings Overview */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <PiggyBank className="mr-2 text-orange-500" size={20} />
          Savings Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-400">Total Savings Balance</p>
                <p className="font-semibold text-gray-900 dark:text-dark-100">
                  {showBalances ? formatCurrency(customer.savingsBalance, baseCurrencyWallet?.currency) : '••••••'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-400">Blocked Savings</p>
                <p className="font-semibold text-gray-900 dark:text-dark-100">
                  {showBalances ? formatCurrency(customer.savingsBalance * 0.3, baseCurrencyWallet?.currency) : '••••••'} {/* Mock data */}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Repeat className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-400">Recurrent Savings</p>
                <p className="font-semibold text-gray-900 dark:text-dark-100">
                  {showBalances ? formatCurrency(customer.savingsBalance * 0.5, baseCurrencyWallet?.currency) : '••••••'} {/* Mock data */}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-dark-400">Group Savings</p>
                <p className="font-semibold text-gray-900 dark:text-dark-100">
                  {showBalances ? formatCurrency(customer.savingsBalance * 0.2, baseCurrencyWallet?.currency) : '••••••'} {/* Mock data */}
                </p>
              </div>
            </div>
          </div>
        </div>
        {customer.savingsBalance === 0 && (
          <div className="text-center py-8">
            <PiggyBank className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-dark-400">No savings instances found for this customer.</p>
          </div>
        )}
      </div>

      {/* Portfolio Summary */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-purple-500" size={20} />
          Portfolio Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Asset Allocation</h5>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-dark-400">Cash</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-dark-100">40%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-dark-400">Savings</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '35%' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-dark-100">35%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-dark-400">Investments</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '25%' }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-dark-100">25%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Performance Metrics</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-400">Total Portfolio Value:</span>
                <span className="font-medium text-gray-900 dark:text-dark-100">
                  {showBalances ? formatCurrency(customer.cashBalance + customer.savingsBalance + customer.investmentBalance, baseCurrencyWallet?.currency) : '••••••'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-400">Monthly Interest:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {showBalances ? formatCurrency(customer.accruedInterest, baseCurrencyWallet?.currency) : '••••••'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-400">Annual Return:</span>
                <span className="font-medium text-green-600 dark:text-green-400">+8.5%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialsTab;