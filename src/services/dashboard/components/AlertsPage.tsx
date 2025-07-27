import React, { useState, useEffect } from 'react';
import { Plus, Bell, BellOff, TestTube, Edit, Trash2, AlertTriangle } from 'lucide-react';
import PageHeader from '../../../components/Common/PageHeader';
import { AlertRule, AlertSeverity, AlertLog } from '../models/MetricDefinition';

const AlertsPage: React.FC = () => {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([]);
  const [alertHistory, setAlertHistory] = useState<AlertLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'rules' | 'history'>('rules');

  useEffect(() => {
    loadAlertData();
  }, []);

  const loadAlertData = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API calls
      // const [rulesResponse, historyResponse] = await Promise.all([
      //   fetch('/api/alerts'),
      //   fetch('/api/alerts/history')
      // ]);
      
      // Mock data
      const mockRules: AlertRule[] = [
        {
          id: '1',
          name: 'High Transaction Volume',
          metricKey: 'transaction_count',
          condition: {
            operator: '>',
            value: 10000
          },
          threshold: 10000,
          frequency: '*/5 * * * *', // Every 5 minutes
          channels: [
            { type: 'email', config: { recipients: ['ops@wiremi.com'] } },
            { type: 'in_app', config: {} }
          ],
          severity: AlertSeverity.HIGH,
          isActive: true,
          cooldownPeriod: 30,
          lastTriggeredAt: '2024-01-15T10:30:00Z',
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          name: 'Low Success Rate',
          metricKey: 'success_rate',
          condition: {
            operator: '<',
            value: 95
          },
          threshold: 95,
          frequency: '*/10 * * * *', // Every 10 minutes
          channels: [
            { type: 'email', config: { recipients: ['tech@wiremi.com'] } },
            { type: 'slack', config: { webhook: 'https://hooks.slack.com/...' } }
          ],
          severity: AlertSeverity.CRITICAL,
          isActive: true,
          cooldownPeriod: 60,
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-10T00:00:00Z'
        }
      ];

      const mockHistory: AlertLog[] = [
        {
          id: '1',
          ruleId: '1',
          metricValue: 15000,
          threshold: 10000,
          condition: 'greater than',
          severity: AlertSeverity.HIGH,
          triggeredAt: '2024-01-15T10:30:00Z',
          payload: {
            ruleName: 'High Transaction Volume',
            metricName: 'Transaction Count',
            currentValue: 15000,
            threshold: 10000,
            condition: '> 10000',
            timestamp: '2024-01-15T10:30:00Z'
          },
          status: 'TRIGGERED' as any,
          createdAt: '2024-01-15T10:30:00Z'
        }
      ];

      setAlertRules(mockRules);
      setAlertHistory(mockHistory);
    } catch (error) {
      console.error('Failed to load alert data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleRule = async (ruleId: string, isActive: boolean) => {
    try {
      // TODO: Implement API call
      // await fetch(`/api/alerts/${ruleId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ isActive })
      // });
      
      setAlertRules(prev => 
        prev.map(rule => 
          rule.id === ruleId ? { ...rule, isActive } : rule
        )
      );
    } catch (error) {
      console.error('Failed to toggle alert rule:', error);
    }
  };

  const handleTestRule = async (ruleId: string) => {
    try {
      // TODO: Implement API call
      // const response = await fetch(`/api/alerts/${ruleId}/test`, { method: 'POST' });
      // const result = await response.json();
      
      console.log('Testing alert rule:', ruleId);
      // Show test result in modal or notification
    } catch (error) {
      console.error('Failed to test alert rule:', error);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    if (window.confirm('Are you sure you want to delete this alert rule?')) {
      try {
        // TODO: Implement API call
        // await fetch(`/api/alerts/${ruleId}`, { method: 'DELETE' });
        
        setAlertRules(prev => prev.filter(rule => rule.id !== ruleId));
      } catch (error) {
        console.error('Failed to delete alert rule:', error);
      }
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case AlertSeverity.LOW:
        return 'bg-blue-100 text-blue-800';
      case AlertSeverity.MEDIUM:
        return 'bg-yellow-100 text-yellow-800';
      case AlertSeverity.HIGH:
        return 'bg-orange-100 text-orange-800';
      case AlertSeverity.CRITICAL:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCondition = (rule: AlertRule) => {
    const { operator, value } = rule.condition;
    const operatorText = {
      '>': 'greater than',
      '<': 'less than',
      '>=': 'greater than or equal to',
      '<=': 'less than or equal to',
      '==': 'equal to',
      '!=': 'not equal to'
    }[operator] || operator;

    return `${operatorText} ${value}`;
  };

  const formatFrequency = (cronExpression: string) => {
    if (cronExpression === '*/5 * * * *') return 'Every 5 minutes';
    if (cronExpression === '*/10 * * * *') return 'Every 10 minutes';
    if (cronExpression === '*/15 * * * *') return 'Every 15 minutes';
    if (cronExpression === '0 * * * *') return 'Every hour';
    return cronExpression;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Alert Management" 
        subtitle="Configure and monitor automated alerts for key metrics"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Create Alert
          </button>
        }
      />

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('rules')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'rules'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Alert Rules ({alertRules.length})
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'history'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Alert History ({alertHistory.length})
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'rules' && (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Alert Rule
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Condition
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Frequency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {alertRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                          {rule.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-dark-400">
                          Metric: {rule.metricKey}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {formatCondition(rule)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {formatFrequency(rule.frequency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(rule.severity)}`}>
                        {rule.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {rule.isActive ? (
                          <Bell size={16} className="text-green-500 mr-2" />
                        ) : (
                          <BellOff size={16} className="text-gray-400 mr-2" />
                        )}
                        <span className={`text-sm ${rule.isActive ? 'text-green-600' : 'text-gray-500'}`}>
                          {rule.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleRule(rule.id, !rule.isActive)}
                          className={`p-1 ${rule.isActive ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'}`}
                          title={rule.isActive ? 'Disable' : 'Enable'}
                        >
                          {rule.isActive ? <BellOff size={16} /> : <Bell size={16} />}
                        </button>
                        <button
                          onClick={() => handleTestRule(rule.id)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Test Rule"
                        >
                          <TestTube size={16} />
                        </button>
                        <button
                          onClick={() => console.log('Edit rule:', rule.id)}
                          className="text-gray-600 hover:text-gray-900 p-1"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Alert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Triggered Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Severity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Triggered At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {alertHistory.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <AlertTriangle size={16} className="text-orange-500 mr-3" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                            {alert.payload.ruleName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-dark-400">
                            {alert.payload.metricName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {alert.metricValue.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-dark-400">
                        Threshold: {alert.threshold.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">
                      {new Date(alert.triggeredAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        {alert.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty States */}
      {activeTab === 'rules' && alertRules.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-dark-400 mb-4">
            No alert rules configured yet
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Alert
          </button>
        </div>
      )}

      {activeTab === 'history' && alertHistory.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-dark-400 mb-4">
            No alerts have been triggered yet
          </div>
        </div>
      )}

      {/* TODO: Add Create Alert Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Create New Alert Rule
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Alert rule creation form will be implemented here.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;