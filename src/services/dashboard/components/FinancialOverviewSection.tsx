import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const FinancialOverviewSection: React.FC = () => {
  const metrics = [
    {
      title: 'Total Deposits',
      value: '$287,944,667',
      change: '+8.7%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      iconColor: 'text-green-500'
    },
    {
      title: 'Total Withdrawals',
      value: '$123,456,78',
      change: '+2.3%',
      changeType: 'positive' as const,
      icon: TrendingDown,
      iconColor: 'text-red-500'
    },
    {
      title: 'Net Balance',
      value: '$111,111.11',
      change: '+15.8%',
      changeType: 'positive' as const,
      icon: DollarSign,
      iconColor: 'text-blue-500'
    },
    {
      title: 'Financial Health',
      value: 'Excellent',
      change: 'Stable',
      changeType: 'neutral' as const,
      icon: Activity,
      iconColor: 'text-emerald-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="bg-white dark:bg-dark-800 rounded-lg p-3 border border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-dark-400 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-dark-100 mb-1">{metric.value}</p>
                <p className={`text-sm ${
                  metric.changeType === 'positive' ? 'text-green-600' : 
                  metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change}
                </p>
              </div>
              <div className={`p-2 rounded-lg bg-gray-50 dark:bg-dark-700`}>
                <Icon size={20} className={metric.iconColor} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FinancialOverviewSection;