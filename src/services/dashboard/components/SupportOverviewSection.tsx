import React from 'react';
import { MessageSquare, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

const SupportOverviewSection: React.FC = () => {
  const metrics = [
    {
      title: 'Open Tickets',
      value: '47',
      change: '+12%',
      changeType: 'negative' as const,
      icon: MessageSquare,
      iconColor: 'text-blue-500'
    },
    {
      title: 'Avg Response Time',
      value: '2.3h',
      change: '-18%',
      changeType: 'positive' as const,
      icon: Clock,
      iconColor: 'text-yellow-500'
    },
    {
      title: 'Resolution Rate',
      value: '94.2%',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    {
      title: 'Escalated Cases',
      value: '8',
      change: '-25%',
      changeType: 'positive' as const,
      icon: AlertTriangle,
      iconColor: 'text-red-500'
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

export default SupportOverviewSection;