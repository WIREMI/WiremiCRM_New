import React from 'react';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const SystemStatusSection: React.FC = () => {
  const systemStatus = [
    {
      name: 'API Status',
      status: 'online',
      description: 'All systems operational'
    },
    {
      name: 'Database',
      status: 'warning',
      description: 'High load detected'
    },
    {
      name: 'Payment Gateway',
      status: 'online',
      description: 'Processing normally'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'offline':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'offline':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">System Status</h3>
      <div className="space-y-4">
        {systemStatus.map((system, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
            <div className="flex items-center space-x-3">
              {getStatusIcon(system.status)}
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-dark-100">
                  {system.name}
                </p>
                <p className="text-xs text-gray-600 dark:text-dark-400">
                  {system.description}
                </p>
              </div>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              system.status === 'online' ? 'bg-green-100 text-green-800' :
              system.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {system.status === 'online' ? 'Online' :
               system.status === 'warning' ? 'Warning' : 'Offline'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemStatusSection;