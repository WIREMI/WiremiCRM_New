import React, { useState, useEffect } from 'react';
import { Settings, Users, Shield, Database, Activity, AlertTriangle, CheckCircle, Clock, BarChart3, Globe } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';
import AdminOnboardingModal from './components/AdminOnboardingModal';

interface SystemMetrics {
  totalUsers: number;
  activeAdmins: number;
  systemUptime: string;
  databaseHealth: string;
  apiResponseTime: string;
  errorRate: number;
  securityAlerts: number;
  backupStatus: string;
}

interface ServiceStatus {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  uptime: string;
  lastCheck: string;
  description: string;
}

const SuperAdminPage: React.FC = () => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [metricsResponse, servicesResponse] = await Promise.all([
      //   fetch('/api/v1/admin/system-metrics'),
      //   fetch('/api/v1/admin/service-status')
      // ]);
      
      // Mock data for demonstration
      const mockMetrics: SystemMetrics = {
        totalUsers: 24567,
        activeAdmins: 12,
        systemUptime: '99.98%',
        databaseHealth: 'Excellent',
        apiResponseTime: '145ms',
        errorRate: 0.02,
        securityAlerts: 3,
        backupStatus: 'Completed'
      };

      const mockServices: ServiceStatus[] = [
        {
          name: 'Authentication Service',
          status: 'healthy',
          uptime: '99.99%',
          lastCheck: new Date().toISOString(),
          description: 'User authentication and authorization'
        },
        {
          name: 'Transaction Engine',
          status: 'healthy',
          uptime: '99.95%',
          lastCheck: new Date().toISOString(),
          description: 'Payment processing and transaction handling'
        },
        {
          name: 'Compliance Engine',
          status: 'warning',
          uptime: '99.87%',
          lastCheck: new Date().toISOString(),
          description: 'KYC, AML, and compliance monitoring'
        },
        {
          name: 'Notification Service',
          status: 'healthy',
          uptime: '99.92%',
          lastCheck: new Date().toISOString(),
          description: 'Email, SMS, and push notifications'
        },
        {
          name: 'Analytics Engine',
          status: 'healthy',
          uptime: '99.89%',
          lastCheck: new Date().toISOString(),
          description: 'Data processing and analytics'
        },
        {
          name: 'File Storage',
          status: 'error',
          uptime: '98.45%',
          lastCheck: new Date().toISOString(),
          description: 'Document and media file storage'
        }
      ];

      setSystemMetrics(mockMetrics);
      setServiceStatuses(mockServices);
    } catch (error) {
      console.error('Failed to load system data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'error':
        return <AlertTriangle size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-gray-500" />;
    }
  };

  const getServiceStatusBadge = (status: string) => {
    const colors = {
      healthy: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleSystemAction = (action: string) => {
    console.log(`Performing system action: ${action}`);
    
    switch (action) {
      case 'backup':
        alert('System backup initiated. This may take several minutes.');
        break;
      case 'maintenance':
        if (window.confirm('Are you sure you want to enable maintenance mode? This will temporarily disable user access.')) {
          alert('Maintenance mode enabled. Users will see a maintenance page.');
        }
        break;
      case 'restart-service':
        const service = prompt('Enter service name to restart:');
        if (service) {
          alert(`Restarting ${service}... This may take a few moments.`);
        }
        break;
      case 'clear-cache':
        if (window.confirm('Are you sure you want to clear all system caches?')) {
          alert('System caches cleared successfully.');
        }
        break;
      case 'export-logs':
        alert('System logs export initiated. Download will start shortly.');
        break;
    }
  };

  const handleOnboardingSuccess = () => {
    setShowOnboardingModal(false);
    // Show success message
    alert('Admin user created successfully!');
    // Optionally reload system data to update user counts
    loadSystemData();
  };

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: BarChart3 },
    { id: 'services', label: 'Service Status', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security Center', icon: Shield },
    { id: 'database', label: 'Database Admin', icon: Database },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-400">Loading system dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Super Admin Portal" 
        subtitle="System administration, monitoring, and configuration management"
        actions={
          <div className="flex space-x-3">
            <button
              onClick={() => handleSystemAction('backup')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Database size={16} className="mr-2" />
              Backup System
            </button>
            <button
              onClick={() => handleSystemAction('maintenance')}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
            >
              <Settings size={16} className="mr-2" />
              Maintenance Mode
            </button>
            <button
              onClick={() => setShowOnboardingModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Users size={16} className="mr-2" />
              Add Admin User
            </button>
          </div>
        }
      />

      {/* System Metrics */}
      {systemMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Users"
            value={systemMetrics.totalUsers.toLocaleString()}
            change="+234 this week"
            changeType="positive"
            icon={Users}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="System Uptime"
            value={systemMetrics.systemUptime}
            change="Last 30 days"
            changeType="positive"
            icon={Activity}
            iconColor="text-green-500"
          />
          <StatsCard
            title="API Response Time"
            value={systemMetrics.apiResponseTime}
            change="-12ms improvement"
            changeType="positive"
            icon={BarChart3}
            iconColor="text-purple-500"
          />
          <StatsCard
            title="Security Alerts"
            value={systemMetrics.securityAlerts.toString()}
            change="-2 resolved today"
            changeType="positive"
            icon={Shield}
            iconColor="text-red-500"
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mb-6">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">System Health</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Database Health:</span>
                      <span className="font-medium text-green-600">{systemMetrics?.databaseHealth}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Error Rate:</span>
                      <span className="font-medium text-gray-900 dark:text-dark-100">{systemMetrics?.errorRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Backup Status:</span>
                      <span className="font-medium text-green-600">{systemMetrics?.backupStatus}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSystemAction('clear-cache')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-600 rounded"
                    >
                      Clear System Cache
                    </button>
                    <button
                      onClick={() => handleSystemAction('restart-service')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-600 rounded"
                    >
                      Restart Service
                    </button>
                    <button
                      onClick={() => handleSystemAction('export-logs')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-600 rounded"
                    >
                      Export System Logs
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Service Status Monitor</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {serviceStatuses.map((service, index) => (
                  <div key={index} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-medium text-gray-900 dark:text-dark-100">{service.name}</h5>
                      {getServiceStatusIcon(service.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-dark-400 mb-3">{service.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-dark-400">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getServiceStatusBadge(service.status)}`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-dark-400">Uptime:</span>
                        <span className="font-medium text-gray-900 dark:text-dark-100">{service.uptime}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">User Management</h3>
              <p className="text-gray-500 dark:text-dark-400">
                Advanced user management tools will be implemented here.
              </p>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="text-center py-12">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">Security Center</h3>
              <p className="text-gray-500 dark:text-dark-400">
                Security monitoring and configuration tools will be implemented here.
              </p>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="text-center py-12">
              <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">Database Administration</h3>
              <p className="text-gray-500 dark:text-dark-400">
                Database management and monitoring tools will be implemented here.
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">System Settings</h3>
              <p className="text-gray-500 dark:text-dark-400">
                System configuration and settings will be implemented here.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Admin Onboarding Modal */}
      <AdminOnboardingModal
        isOpen={showOnboardingModal}
        onClose={() => setShowOnboardingModal(false)}
        onSuccess={handleOnboardingSuccess}
      />
    </div>
  );
};

export default SuperAdminPage;