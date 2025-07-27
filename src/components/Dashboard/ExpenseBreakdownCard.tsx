import React from 'react';

interface MonthlyExpense {
  month: string;
  amount: number;
  intensity: number; // 0-1 for color intensity
}

interface ExpenseBreakdownProps {
  totalExpense: number;
  changePercentage: number;
  monthlyData: MonthlyExpense[];
}

const ExpenseBreakdownCard: React.FC<ExpenseBreakdownProps> = ({
  totalExpense,
  changePercentage,
  monthlyData
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getIntensityColor = (intensity: number) => {
    const opacity = Math.max(0.2, intensity);
    return `rgba(34, 197, 94, ${opacity})`; // Green with varying opacity
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Expense Breakdown</h3>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <circle cx="12" cy="12" r="3" fill="currentColor"/>
            <circle cx="12" cy="5" r="3" fill="currentColor"/>
            <circle cx="12" cy="19" r="3" fill="currentColor"/>
          </svg>
        </button>
      </div>

      <div className="mb-6">
        <div className="text-sm text-gray-600 dark:text-dark-400 mb-1">Total Expense</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-dark-100 mb-2">
          {formatCurrency(totalExpense)}
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400">
            <span>+{changePercentage}%</span>
          </div>
          <span className="text-sm text-gray-500 dark:text-dark-400">From last month</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-8 gap-1">
          {monthlyData.map((data, index) => (
            <div key={index} className="space-y-1">
              <div className="text-xs text-gray-500 dark:text-dark-400 text-center">
                {data.month}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {Array.from({ length: 8 }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="h-3 rounded-sm"
                    style={{
                      backgroundColor: rowIndex < (data.intensity * 8) 
                        ? getIntensityColor(data.intensity)
                        : '#f3f4f6'
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpenseBreakdownCard;