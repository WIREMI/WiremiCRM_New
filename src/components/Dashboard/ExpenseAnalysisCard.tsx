import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

interface ExpenseAnalysisProps {
  totalExpense: number;
  changePercentage: number;
  changeDirection: 'up' | 'down';
  monthlyData: number[];
}

const ExpenseAnalysisCard: React.FC<ExpenseAnalysisProps> = ({
  totalExpense,
  changePercentage,
  changeDirection,
  monthlyData
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const maxValue = Math.max(...monthlyData);

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Expense Analysis</h3>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <div className="text-3xl font-bold text-gray-900 dark:text-dark-100 mb-2">
          {formatCurrency(totalExpense)}
        </div>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
            changeDirection === 'down' 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {changeDirection === 'down' ? (
              <TrendingDown size={12} />
            ) : (
              <TrendingUp size={12} />
            )}
            <span>{changePercentage}%</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-dark-400">From last month</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-end justify-between h-32">
          {monthlyData.map((value, index) => (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div 
                className="w-6 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-sm"
                style={{ 
                  height: `${(value / maxValue) * 100}%`,
                  minHeight: '8px'
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-dark-400">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((month) => (
            <span key={month}>{month}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseAnalysisCard;