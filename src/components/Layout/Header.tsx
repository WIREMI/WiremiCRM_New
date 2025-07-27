import React from 'react';
import { Bell, Search, User, Settings, Moon, Sun, Plus } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import NotificationModal from '../Common/NotificationModal';

const Header: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    {
      id: '1',
      type: 'warning' as const,
      title: 'High Risk Transaction Detected',
      message: 'Transaction of $15,000 from customer WRM001234 requires review due to unusual pattern.',
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
      isRead: false,
      category: 'compliance' as const,
      actionUrl: '/compliance'
    },
    {
      id: '2',
      type: 'info' as const,
      title: 'New Customer Registration',
      message: 'Sarah Wilson has completed KYC verification and account setup.',
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
      isRead: false,
      category: 'user' as const,
      actionUrl: '/customers'
    },
    {
      id: '3',
      type: 'success' as const,
      title: 'Monthly Reconciliation Complete',
      message: 'All accounts have been successfully reconciled for March 2024.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      isRead: true,
      category: 'finance' as const,
      actionUrl: '/finance'
    },
    {
      id: '4',
      type: 'error' as const,
      title: 'System Alert',
      message: 'API response time has exceeded threshold. Investigation required.',
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      isRead: true,
      category: 'system' as const,
      actionUrl: '/admin'
    },
    {
      id: '5',
      type: 'info' as const,
      title: 'Virtual Card Issued',
      message: 'New virtual card issued to customer John Doe (WRM001567).',
      timestamp: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      isRead: true,
      category: 'transaction' as const,
      actionUrl: '/cards'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  return (
    <>
      <header className="bg-white dark:bg-dark-800 shadow-sm border-b border-gray-200 dark:border-dark-700 px-6 py-3 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-400" size={16} />
              <input
                type="text"
                placeholder="Search for anything"
                className="pl-9 pr-4 py-2 bg-gray-100 dark:bg-dark-700 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-dark-600 w-80 text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-400 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 dark:text-dark-400 hover:text-gray-900 dark:hover:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-600 dark:text-dark-400 hover:text-gray-900 dark:hover:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="p-2 text-gray-600 dark:text-dark-400 hover:text-gray-900 dark:hover:text-dark-100 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
              <Settings size={18} />
            </button>

            <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-dark-600">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">MJ</span>
              </div>
              <div className="text-sm hidden md:block">
                <div className="font-medium text-gray-900 dark:text-dark-100">Michael Joe</div>
                <div className="text-gray-500 dark:text-dark-400 text-xs">@michaeljoe@email.com</div>
              </div>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <NotificationModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
      />
    </>
  );
};

export default Header;