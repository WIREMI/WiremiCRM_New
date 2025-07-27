import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
  rate: number;
  symbol: string;
}

interface CurrencyExchangeProps {
  baseCurrency: string;
  currencies: Currency[];
}

const CurrencyExchangeCard: React.FC<CurrencyExchangeProps> = ({
  baseCurrency,
  currencies
}) => {
  const formatRate = (rate: number) => {
    return rate.toFixed(2);
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Currency</h3>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-xl">
          <span className="text-lg font-semibold text-gray-900 dark:text-dark-100">1</span>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900 dark:text-dark-100">{baseCurrency}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {currencies.map((currency, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 dark:bg-dark-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700 dark:text-dark-300">
                  {currency.symbol}
                </span>
              </div>
              <div>
                <div className="font-medium text-gray-900 dark:text-dark-100">{currency.name}</div>
                <div className="text-sm text-gray-500 dark:text-dark-400">{currency.code}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900 dark:text-dark-100">
                {formatRate(currency.rate)}
              </div>
              <div className="text-sm text-gray-500 dark:text-dark-400">{currency.code}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrencyExchangeCard;