import React from 'react';
import { Users, Activity, CreditCard, Target } from 'lucide-react';

const CoreMetricsSection: React.FC = () => {
  const metrics = [
    {
      title: 'Total Users',
      value: '12,643',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: Users,
      iconColor: 'text-blue-500'
    },
    {
      title: 'Active Users',
      value: '8,957',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: Activity,
      iconColor: 'text-green-500'
    },
    {
      title: 'Total Transfers',
      value: '2,008',
      change: '+15.8%',
      changeType: 'positive' as const,
      icon: CreditCard,
      iconColor: 'text-purple-500'
    },
    {
      title: 'Success Rate',
      value: '99.1%',
      change: '+0.3%',
      changeType: 'positive' as const,
      icon: Target,
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
                  metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
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

export default CoreMetricsSection;