import React from 'react';

interface IncomeCategory {
  name: string;
  percentage: number;
  color: string;
}

interface IncomeAnalysisProps {
  totalIncome: number;
  changePercentage: number;
  categories: IncomeCategory[];
}

const IncomeAnalysisCard: React.FC<IncomeAnalysisProps> = ({
  totalIncome,
  changePercentage,
  categories
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Calculate stroke-dasharray for donut chart
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercentage = 0;

  return (
    <div className="bg-white dark:bg-dark-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-dark-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Overall Income</h3>
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-3xl font-bold text-gray-900 dark:text-dark-100 mb-2">
            {formatCurrency(totalIncome)}
          </div>
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <span>+{changePercentage}%</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-dark-400">from last month</span>
          </div>

          <div className="space-y-3">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-600 dark:text-dark-400">{category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                  {category.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-32 h-32 ml-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-dark-600"
            />
            {categories.map((category, index) => {
              const strokeDasharray = `${(category.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercentage * circumference / 100;
              cumulativePercentage += category.percentage;
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke={category.color}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default IncomeAnalysisCard;