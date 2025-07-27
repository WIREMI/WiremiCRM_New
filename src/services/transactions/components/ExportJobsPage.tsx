import React, { useState, useEffect } from 'react';
import PageHeader from '../../../components/Common/PageHeader';
import { Download, RefreshCw, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ExportJob {
  id: string;
  type: string;
  filters?: any;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  filePath?: string;
  requestedBy: string;
  completedAt?: Date;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ExportJobsPage: React.FC = () => {
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExportJobs();
  }, []);

  const fetchExportJobs = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/export-jobs');
      // const data = await response.json();
      // setExportJobs(data.data);

      // Mock data for demonstration
      const mockJobs: ExportJob[] = [
        {
          id: 'exp-1',
          type: 'transactions_csv',
          filters: {},
          status: 'COMPLETED',
          filePath: '/exports/exp-1.csv',
          requestedBy: 'admin-user',
          completedAt: new Date(),
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(),
        },
        {
          id: 'exp-2',
          type: 'transactions_xlsx',
          filters: { status: 'FAILED' },
          status: 'PROCESSING',
          requestedBy: 'admin-user',
          createdAt: new Date(Date.now() - 3600000),
          updatedAt: new Date(),
        },
        {
          id: 'exp-3',
          type: 'transactions_pdf',
          filters: { minAmount: 1000 },
          status: 'FAILED',
          requestedBy: 'admin-user',
          completedAt: new Date(),
          error: 'Failed to generate PDF',
          createdAt: new Date(Date.now() - 1800000),
          updatedAt: new Date(),
        },
      ];
      setExportJobs(mockJobs);
    } catch (error) {
      console.error('Failed to fetch export jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      PENDING: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
      PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      FAILED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-gray-500" />;
      case 'PROCESSING':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleDownload = (filePath: string) => {
    // In a real app, this would fetch a signed URL or directly download from cloud storage
    window.open(filePath, '_blank');
  };

  return (
    <div>
      <PageHeader
        title="Export Jobs"
        subtitle="Monitor and manage all scheduled data export tasks"
        actions={
          <button
            onClick={fetchExportJobs}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        }
      />

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Job ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Requested By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Requested At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Completed At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Error</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-dark-400">Loading export jobs...</td>
                </tr>
              ) : exportJobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-dark-400">No export jobs found.</td>
                </tr>
              ) : (
                exportJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-dark-100">
                      {job.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">
                      {job.type.replace('transactions_', '').toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">{job.requestedBy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                      {new Date(job.createdAt).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                      {job.completedAt ? new Date(job.completedAt).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                      {job.error || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {job.status === 'COMPLETED' && job.filePath ? (
                        <button
                          onClick={() => handleDownload(job.filePath!)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 inline-flex items-center"
                        >
                          <Download size={16} className="mr-1" /> Download
                        </button>
                      ) : (
                        <span className="text-gray-400 dark:text-dark-500">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExportJobsPage;