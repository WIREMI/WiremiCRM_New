import React from 'react';
import { ExternalLink } from 'lucide-react';

const RecentActivityList: React.FC = () => {
  const activities = [
    {
      id: 1,
      title: 'Large deposit processed',
      description: 'John Doe deposited $25,000 via wire transfer',
      time: '2 minutes ago',
      amount: '+$25,000',
      type: 'positive'
    },
    {
      id: 2,
      title: 'New user registered',
      description: 'Sarah Chen completed KYC verification',
      time: '15 minutes ago',
      amount: null,
      type: 'neutral'
    },
    {
      id: 3,
      title: 'Suspicious activity detected',
      description: 'Multiple login attempts from IP 192.168.1.1',
      time: '1 hour ago',
      amount: null,
      type: 'negative'
    },
    {
      id: 4,
      title: 'Withdrawal approved',
      description: 'Mike Johnson withdrew $5,000 to Bank of America',
      time: '2 hours ago',
      amount: '-$5,000',
      type: 'negative'
    },
    {
      id: 5,
      title: 'System backup completed',
      description: 'Daily backup completed successfully',
      time: '3 hours ago',
      amount: null,
      type: 'positive'
    },
    {
      id: 6,
      title: 'KYC document rejected',
      description: 'Alex Kim - Document quality insufficient',
      time: '4 hours ago',
      amount: null,
      type: 'negative'
    },
    {
      id: 7,
      title: 'Admin role updated',
      description: 'User permissions modified by Super Admin',
      time: '5 hours ago',
      amount: null,
      type: 'neutral'
    }
  ];

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Recent Activity</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center">
          View All
          <ExternalLink size={14} className="ml-1" />
        </button>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              activity.type === 'positive' ? 'bg-green-500' :
              activity.type === 'negative' ? 'bg-red-500' : 'bg-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 dark:text-dark-100 truncate">
                  {activity.title}
                </p>
                {activity.amount && (
                  <span className={`text-sm font-medium ${
                    activity.type === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {activity.amount}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-dark-400 truncate">
                {activity.description}
              </p>
              <p className="text-xs text-gray-500 dark:text-dark-500 mt-1">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Load More Activities
        </button>
      </div>
    </div>
  );
};

export default RecentActivityList;