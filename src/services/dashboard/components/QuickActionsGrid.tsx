import React from 'react';
import { UserPlus, Flag, FileText, Shield, DollarSign, AlertTriangle, BarChart3, Settings } from 'lucide-react';

const QuickActionsGrid: React.FC = () => {
  const actions = [
    {
      id: 'add-user',
      title: 'Add New User',
      icon: UserPlus,
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600'
    },
    {
      id: 'flag-transaction',
      title: 'Flag Transaction',
      icon: Flag,
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600'
    },
    {
      id: 'financial-report',
      title: 'Financial Report',
      icon: FileText,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600'
    },
    {
      id: 'export-data',
      title: 'Export Data',
      icon: BarChart3,
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600'
    },
    {
      id: 'support-chat',
      title: 'Support Chat',
      icon: Shield,
      color: 'bg-cyan-500',
      hoverColor: 'hover:bg-cyan-600'
    },
    {
      id: 'security-audit',
      title: 'Security Audit',
      icon: AlertTriangle,
      color: 'bg-red-500',
      hoverColor: 'hover:bg-red-600'
    },
    {
      id: 'system-settings',
      title: 'System Settings',
      icon: Settings,
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600'
    },
    {
      id: 'generate-report',
      title: 'Generate Report',
      icon: FileText,
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600'
    }
  ];

  const handleActionClick = (actionId: string) => {
    console.log(`Quick action clicked: ${actionId}`);
    // TODO: Implement navigation or modal opening based on action
  };

  return (
    <div className="bg-white dark:bg-dark-800 rounded-lg p-6 border border-gray-200 dark:border-dark-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              className={`${action.color} ${action.hoverColor} text-white p-4 rounded-lg transition-colors flex flex-col items-center justify-center space-y-2 min-h-[80px]`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium text-center leading-tight">
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionsGrid;