import React, { useState, useEffect } from 'react';
import { Plus, Play, Calendar, Download, Edit, Trash2, Clock } from 'lucide-react';
import PageHeader from '../../../components/Common/PageHeader';
import { SavedReport, ReportFormat } from '../models/MetricDefinition';

const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      // const response = await fetch('/api/reports');
      // const data = await response.json();
      
      // Mock data
      const mockReports: SavedReport[] = [
        {
          id: '1',
          name: 'Monthly Financial Summary',
          description: 'Comprehensive monthly financial performance report',
          queryDefinition: {
            metrics: ['total_revenue', 'transaction_count', 'average_transaction_value'],
            dimensions: ['date', 'product_category'],
            filters: {},
            timeRange: {
              start: 'now-30d',
              end: 'now',
              granularity: 'day'
            },
            sorting: [{ field: 'date', direction: 'desc' }]
          },
          schedule: '0 9 1 * *', // First day of month at 9 AM
          recipients: ['finance@wiremi.com', 'ceo@wiremi.com'],
          format: ReportFormat.PDF,
          isActive: true,
          lastRunAt: '2024-01-15T09:00:00Z',
          nextRunAt: '2024-02-01T09:00:00Z',
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T09:00:00Z'
        },
        {
          id: '2',
          name: 'Weekly Customer Analytics',
          description: 'Customer behavior and engagement metrics',
          queryDefinition: {
            metrics: ['active_users', 'new_signups', 'churn_rate'],
            dimensions: ['date', 'user_segment'],
            filters: {},
            timeRange: {
              start: 'now-7d',
              end: 'now',
              granularity: 'day'
            },
            sorting: [{ field: 'date', direction: 'desc' }]
          },
          schedule: '0 8 * * 1', // Every Monday at 8 AM
          recipients: ['marketing@wiremi.com'],
          format: ReportFormat.XLSX,
          isActive: true,
          lastRunAt: '2024-01-15T08:00:00Z',
          nextRunAt: '2024-01-22T08:00:00Z',
          createdBy: 'admin',
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-15T08:00:00Z'
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunReport = async (reportId: string) => {
    try {
      // TODO: Implement API call
      // await fetch(`/api/reports/${reportId}/run`, { method: 'POST' });
      console.log('Running report:', reportId);
      // Show success message
    } catch (error) {
      console.error('Failed to run report:', error);
    }
  };

  const handleDeleteReport = async (reportId: string) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      try {
        // TODO: Implement API call
        // await fetch(`/api/reports/${reportId}`, { method: 'DELETE' });
        setReports(prev => prev.filter(r => r.id !== reportId));
      } catch (error) {
        console.error('Failed to delete report:', error);
      }
    }
  };

  const formatSchedule = (cronExpression: string): string => {
    // Simple cron expression parser for display
    const parts = cronExpression.split(' ');
    if (parts.length !== 5) return cronExpression;

    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    if (dayOfMonth === '1' && month === '*') {
      return `Monthly at ${hour}:${minute.padStart(2, '0')}`;
    }
    if (dayOfWeek === '1' && dayOfMonth === '*') {
      return `Weekly on Monday at ${hour}:${minute.padStart(2, '0')}`;
    }
    if (dayOfMonth === '*' && dayOfWeek === '*') {
      return `Daily at ${hour}:${minute.padStart(2, '0')}`;
    }

    return cronExpression;
  };

  const getStatusColor = (report: SavedReport) => {
    if (!report.isActive) return 'bg-gray-100 text-gray-800';
    
    const nextRun = new Date(report.nextRunAt || '');
    const now = new Date();
    
    if (nextRun < now) {
      return 'bg-yellow-100 text-yellow-800';
    }
    
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (report: SavedReport) => {
    if (!report.isActive) return 'Inactive';
    
    const nextRun = new Date(report.nextRunAt || '');
    const now = new Date();
    
    if (nextRun < now) {
      return 'Overdue';
    }
    
    return 'Active';
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
        title="Automated Reports" 
        subtitle="Schedule and manage automated report generation"
        actions={
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Create Report
          </button>
        }
      />

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Format
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Recipients
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Last Run
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {report.name}
                      </div>
                      {report.description && (
                        <div className="text-sm text-gray-500 dark:text-dark-400">
                          {report.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-dark-100">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {formatSchedule(report.schedule)}
                    </div>
                    {report.nextRunAt && (
                      <div className="text-xs text-gray-500 dark:text-dark-400">
                        Next: {new Date(report.nextRunAt).toLocaleString()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {report.format}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-100">
                      {report.recipients.length} recipient{report.recipients.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-dark-400">
                      {report.recipients.slice(0, 2).join(', ')}
                      {report.recipients.length > 2 && ` +${report.recipients.length - 2} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report)}`}>
                      {getStatusText(report)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {report.lastRunAt ? (
                      <div className="flex items-center text-sm text-gray-900 dark:text-dark-100">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {new Date(report.lastRunAt).toLocaleDateString()}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-dark-400">Never</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRunReport(report.id)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Run Now"
                      >
                        <Play size={16} />
                      </button>
                      <button
                        onClick={() => console.log('Edit report:', report.id)}
                        className="text-gray-600 hover:text-gray-900 p-1"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(report.id)}
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

      {reports.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-dark-400 mb-4">
            No reports configured yet
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your First Report
          </button>
        </div>
      )}

      {/* TODO: Add Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Create New Report
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Report creation form will be implemented here.
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
                Create Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;