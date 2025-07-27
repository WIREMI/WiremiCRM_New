import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle, RefreshCw, Download, Upload, Search, Filter, Calendar, BarChart3 } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';

interface ReconciliationRecord {
  id: string;
  date: string;
  accountType: string;
  expectedBalance: number;
  actualBalance: number;
  variance: number;
  status: 'matched' | 'discrepancy' | 'pending';
  lastReconciled: string;
  reconciler: string;
}

interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netPosition: number;
  cashOnHand: number;
  pendingTransactions: number;
  reconciledToday: number;
  discrepanciesFound: number;
  reconciliationRate: number;
}

const FinanceReconciliation: React.FC = () => {
  const [reconciliationRecords, setReconciliationRecords] = useState<ReconciliationRecord[]>([]);
  const [financialSummary, setFinancialSummary] = useState<FinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReconciling, setIsReconciling] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [filters, setFilters] = useState({
    accountType: '',
    status: '',
    dateRange: '7d'
  });

  useEffect(() => {
    loadFinancialData();
  }, [selectedPeriod, filters]);

  const loadFinancialData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [summaryResponse, recordsResponse] = await Promise.all([
      //   fetch('/api/v1/finance/summary'),
      //   fetch('/api/v1/finance/reconciliation')
      // ]);
      
      // Mock data for demonstration
      const mockSummary: FinancialSummary = {
        totalAssets: 15750000.00,
        totalLiabilities: 2340000.00,
        netPosition: 13410000.00,
        cashOnHand: 8920000.00,
        pendingTransactions: 156,
        reconciledToday: 45,
        discrepanciesFound: 3,
        reconciliationRate: 98.7
      };

      const mockRecords: ReconciliationRecord[] = Array.from({ length: 12 }, (_, i) => ({
        id: `recon-${i + 1}`,
        date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0],
        accountType: ['Customer Deposits', 'Virtual Card Balances', 'Savings Accounts', 'Investment Funds', 'Operating Cash'][i % 5],
        expectedBalance: Math.random() * 1000000 + 500000,
        actualBalance: Math.random() * 1000000 + 500000,
        variance: (Math.random() - 0.5) * 10000,
        status: ['matched', 'discrepancy', 'pending'][i % 3] as any,
        lastReconciled: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        reconciler: ['admin-user', 'finance-manager', 'system-auto'][i % 3]
      }));

      setFinancialSummary(mockSummary);
      setReconciliationRecords(mockRecords);
    } catch (error) {
      console.error('Failed to load financial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunReconciliation = async () => {
    setIsReconciling(true);
    try {
      // TODO: Call API to run reconciliation
      console.log('Running reconciliation for period:', selectedPeriod);
      
      // Simulate reconciliation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Reload data after reconciliation
      await loadFinancialData();
      
      alert('Reconciliation completed successfully!');
    } catch (error) {
      console.error('Reconciliation failed:', error);
      alert('Reconciliation failed. Please try again.');
    } finally {
      setIsReconciling(false);
    }
  };

  const handleViewDiscrepancies = () => {
    const discrepancies = reconciliationRecords.filter(record => record.status === 'discrepancy');
    console.log('Viewing discrepancies:', discrepancies);
    alert(`Found ${discrepancies.length} discrepancies. Check console for details.`);
  };

  const handleExportReport = (format: 'PDF' | 'XLSX') => {
    console.log(`Exporting reconciliation report as ${format}`);
    alert(`${format} report export initiated. Download will start shortly.`);
  };

  const handleImportData = () => {
    console.log('Opening file import dialog');
    alert('File import dialog would open here for uploading bank statements or external data.');
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      matched: 'bg-green-100 text-green-800',
      discrepancy: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'matched':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'discrepancy':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'pending':
        return <RefreshCw size={16} className="text-yellow-500" />;
      default:
        return <RefreshCw size={16} className="text-gray-500" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-400">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Finance & Reconciliation" 
        subtitle="Monitor financial positions, reconcile accounts, and ensure data accuracy"
        actions={
          <div className="flex space-x-3">
            <button
              onClick={handleImportData}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
            >
              <Upload size={16} className="mr-2" />
              Import Data
            </button>
            <button
              onClick={() => handleExportReport('XLSX')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Download size={16} className="mr-2" />
              Export Report
            </button>
            <button
              onClick={handleRunReconciliation}
              disabled={isReconciling}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              <RefreshCw size={16} className={`mr-2 ${isReconciling ? 'animate-spin' : ''}`} />
              {isReconciling ? 'Reconciling...' : 'Run Reconciliation'}
            </button>
          </div>
        }
      />

      {/* Financial Summary Cards */}
      {financialSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Assets"
            value={formatCurrency(financialSummary.totalAssets)}
            change="+2.3% this month"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Net Position"
            value={formatCurrency(financialSummary.netPosition)}
            change="+1.8% this month"
            changeType="positive"
            icon={TrendingUp}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Reconciliation Rate"
            value={`${financialSummary.reconciliationRate}%`}
            change="+0.2% this week"
            changeType="positive"
            icon={CheckCircle}
            iconColor="text-emerald-500"
          />
          <StatsCard
            title="Discrepancies Found"
            value={financialSummary.discrepanciesFound.toString()}
            change="-2 from yesterday"
            changeType="positive"
            icon={AlertTriangle}
            iconColor="text-red-500"
          />
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleViewDiscrepancies}
            className="p-4 border border-red-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
          >
            <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-dark-100">View Discrepancies</h4>
            <p className="text-sm text-gray-600 dark:text-dark-400">Review unmatched transactions</p>
          </button>
          
          <button
            onClick={() => handleExportReport('PDF')}
            className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
          >
            <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-dark-100">Generate Report</h4>
            <p className="text-sm text-gray-600 dark:text-dark-400">Create reconciliation report</p>
          </button>
          
          <button
            onClick={() => setSelectedPeriod('month')}
            className="p-4 border border-green-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors text-left"
          >
            <Calendar className="w-8 h-8 text-green-500 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-dark-100">Monthly Close</h4>
            <p className="text-sm text-gray-600 dark:text-dark-400">Run month-end reconciliation</p>
          </button>
          
          <button
            onClick={() => console.log('Opening audit trail')}
            className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left"
          >
            <Search className="w-8 h-8 text-purple-500 mb-2" />
            <h4 className="font-medium text-gray-900 dark:text-dark-100">Audit Trail</h4>
            <p className="text-sm text-gray-600 dark:text-dark-400">Review reconciliation history</p>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Reconciliation Records</h3>
          <div className="flex items-center space-x-4">
            <select
              value={filters.accountType}
              onChange={(e) => setFilters(prev => ({ ...prev, accountType: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Account Types</option>
              <option value="Customer Deposits">Customer Deposits</option>
              <option value="Virtual Card Balances">Virtual Card Balances</option>
              <option value="Savings Accounts">Savings Accounts</option>
              <option value="Investment Funds">Investment Funds</option>
              <option value="Operating Cash">Operating Cash</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Statuses</option>
              <option value="matched">Matched</option>
              <option value="discrepancy">Discrepancy</option>
              <option value="pending">Pending</option>
            </select>
            
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reconciliation Records Table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Account Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Expected Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actual Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Reconciler
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {reconciliationRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                      {record.accountType}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-100">
                      {formatDate(record.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                      {formatCurrency(record.expectedBalance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                      {formatCurrency(record.actualBalance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${
                      record.variance > 0 ? 'text-green-600' : 
                      record.variance < 0 ? 'text-red-600' : 'text-gray-900 dark:text-dark-100'
                    }`}>
                      {record.variance > 0 ? '+' : ''}{formatCurrency(record.variance)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(record.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-100">
                      {record.reconciler}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => console.log('Viewing details for:', record.id)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinanceReconciliation;