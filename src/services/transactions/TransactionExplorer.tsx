import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Download, DollarSign, Flag, RefreshCcw } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';
import TransactionTable from './components/TransactionTable';
import TransactionFilters from './components/TransactionFilters';
import DepositModal from './components/DepositModal';
import { TransactionWithRelations } from './services/TransactionService';

const TransactionExplorer: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [transactions, setTransactions] = useState<TransactionWithRelations[]>([]);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'delayed'>('all');

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filters, activeTab]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      // Apply tab-specific filters
      const tabFilters = { ...filters };
      switch (activeTab) {
        case 'pending':
          tabFilters.status = 'PENDING_APPROVAL';
          break;
        case 'approved':
          tabFilters.status = 'SUCCESS';
          break;
        case 'rejected':
          tabFilters.status = 'FAILED';
          break;
        case 'delayed':
          tabFilters.status = 'PROCESSING';
          break;
      }

      // TODO: Replace with actual API call
      // const response = await fetch(`/api/v1/transactions?page=${currentPage}&limit=20&${new URLSearchParams(tabFilters)}`);
      // const data = await response.json();
      // setTransactions(data.data.transactions);
      // setTotalTransactions(data.data.total);

      // Mock data for demonstration
      const mockTransactions: TransactionWithRelations[] = Array.from({ length: 20 }, (_, i) => ({
        id: `txn-${i + 1}-${Date.now()}`,
        userId: `user-${Math.floor(Math.random() * 1000)}`,
        type: ['DEPOSIT', 'TRANSFER', 'WITHDRAWAL', 'CARD_SERVICE', 'SAVINGS', 'SUBSCRIPTION'][i % 6],
        method: ['BANK', 'MOMO_MTN', 'INTERAC', 'ADMIN_INITIATED', 'WIREMI_INTERNAL', 'CARD_ISSUANCE', 'SAVINGS_CREDIT', 'PREMIUM_SUBSCRIPTION'][i % 8],
        amount: Math.random() * 1000 + 10,
        currency: ['USD', 'CAD', 'EUR'][i % 3],
        fees: Math.random() * 5,
        exchangeRate: Math.random() > 0.5 ? 1.35 : undefined,
        referenceId: `REF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        metadata: { 
          bankName: 'Example Bank', 
          accountNumber: '123456789',
          momoNumber: '+237123456789',
          receiverWiremiId: `WRM${Math.floor(Math.random() * 100000)}`,
          cardLast4: '1234',
          cardScheme: 'VISA',
          cardType: 'DEBIT'
        },
        timeline: [{ timestamp: new Date(), status: 'INITIATED', description: 'Transaction initiated' }],
        walletBefore: { USD: 1000, CAD: 500 },
        walletAfter: { USD: 990, CAD: 500 },
        status: ['SUCCESS', 'PROCESSING', 'FAILED', 'PENDING_APPROVAL'][i % 4],
        adminInitiatedBy: i % 3 === 0 ? 'admin-user' : undefined,
        approvedBy: i % 4 === 0 ? 'super-admin' : undefined,
        createdAt: new Date(Date.now() - i * 3600000),
        updatedAt: new Date(),
        flags: [],
        notes: [],
      }));

      // Filter by tab
      let filteredTransactions = mockTransactions;
      if (activeTab !== 'all') {
        filteredTransactions = mockTransactions.filter(t => {
          switch (activeTab) {
            case 'pending': return t.status === 'PENDING_APPROVAL';
            case 'approved': return t.status === 'SUCCESS';
            case 'rejected': return t.status === 'FAILED';
            case 'delayed': return t.status === 'PROCESSING';
            default: return true;
          }
        });
      }

      setTransactions(filteredTransactions);
      setTotalTransactions(filteredTransactions.length);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectTransaction = (id: string, isSelected: boolean) => {
    setSelectedTransactions(prev =>
      isSelected ? [...prev, id] : prev.filter(txId => txId !== id)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedTransactions(transactions.map(tx => tx.id));
    } else {
      setSelectedTransactions([]);
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Performing bulk action "${action}" on:`, selectedTransactions);
    // TODO: Implement API calls for bulk actions
  };

  const handleExport = async (format: 'CSV' | 'XLSX' | 'PDF') => {
    console.log(`Scheduling export for format: ${format} with filters:`, filters);
    try {
      // Simulate export without backend
      console.log('Export request:', { format, filters: { ...filters, activeTab } });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Export job scheduled successfully! Format: ${format}`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to schedule export. Please try again.');
    }
  };

  const handleOpenDepositModal = () => {
    setShowDepositModal(true);
  };

  const handleDepositSuccess = () => {
    setShowDepositModal(false);
    fetchTransactions();
  };

  const getTabCount = (tab: string) => {
    switch (tab) {
      case 'pending': return transactions.filter(t => t.status === 'PENDING_APPROVAL').length;
      case 'approved': return transactions.filter(t => t.status === 'SUCCESS').length;
      case 'rejected': return transactions.filter(t => t.status === 'FAILED').length;
      case 'delayed': return transactions.filter(t => t.status === 'PROCESSING').length;
      default: return transactions.length;
    }
  };

  return (
    <div>
      <PageHeader 
        title="Transaction Explorer" 
        subtitle="Monitor and manage all financial transactions across the platform"
        actions={
          <div className="flex space-x-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
            <button
              onClick={handleOpenDepositModal}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <DollarSign size={16} className="mr-2" />
              Admin Deposit
            </button>
            <button
              onClick={() => handleExport('CSV')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Transactions"
          value="12,456"
          change="+8.3% today"
          changeType="positive"
          icon={RefreshCcw}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Transaction Volume"
          value="$2.4M"
          change="+12.5% today"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Success Rate"
          value="99.2%"
          change="+0.1% vs yesterday"
          changeType="positive"
          icon={RefreshCcw}
          iconColor="text-emerald-500"
        />
        <StatsCard
          title="Pending Approval"
          value="23"
          change="+5 new today"
          changeType="neutral"
          icon={Flag}
          iconColor="text-orange-500"
        />
      </div>

      {/* Transaction Tabs */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mb-6">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'all', label: 'All Transactions' },
              { id: 'pending', label: 'Pending Approval' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
              { id: 'delayed', label: 'Delayed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
                }`}
              >
                {tab.label} ({getTabCount(tab.id)})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-6">
          <TransactionFilters onApplyFilters={handleFilterChange} currentFilters={filters} />
        </div>
      )}

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">Transaction List</h3>
          {selectedTransactions.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-dark-400">{selectedTransactions.length} selected</span>
              <select
                onChange={(e) => handleBulkAction(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value="">Bulk Actions</option>
                <option value="flag">Flag Selected</option>
                <option value="export">Export Selected</option>
              </select>
            </div>
          )}
        </div>

        <TransactionTable
          transactions={transactions}
          loading={loading}
          selectedTransactions={selectedTransactions}
          onSelectTransaction={handleSelectTransaction}
          onSelectAll={handleSelectAll}
          total={totalTransactions}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onTransactionUpdated={fetchTransactions}
        />
      </div>

      {showDepositModal && (
        <DepositModal
          isOpen={showDepositModal}
          onClose={() => setShowDepositModal(false)}
          onSuccess={handleDepositSuccess}
        />
      )}
    </div>
  );
};

export default TransactionExplorer;