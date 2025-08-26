import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Plus, Download, User, Building, UserPlus } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';

interface Customer {
  id: string;
  wiremiId?: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  accountType: 'PERSONAL' | 'BUSINESS' | 'LEAD';
  country?: string;
  region?: string;
  kycStatus: 'Pending' | 'Verified' | 'Rejected';
  riskScore: number;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  signupDate: string;
}

interface FilterState {
  search: string;
  accountType: string;
  kycStatus: string;
  country: string;
  riskScoreMin: number;
  riskScoreMax: number;
}

const CustomerManagement: React.FC = () => {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5); // Mock pagination
  const [activeAccountType, setActiveAccountType] = useState<'all' | 'personal' | 'business' | 'leads'>('all');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    accountType: '',
    kycStatus: '',
    country: '',
    riskScoreMin: 0,
    riskScoreMax: 100
  });

  useEffect(() => {
    loadCustomers();
  }, [currentPage, filters, activeAccountType]);

  const loadCustomers = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to backend
      // const response = await fetch('/api/customers?' + new URLSearchParams({
      //   page: currentPage.toString(),
      //   ...filters
      // }));
      // const data = await response.json();
      
      // Mock data for now
      const mockCustomers: Customer[] = Array.from({ length: 20 }, (_, i) => ({
        id: `customer-${i + 1}`,
        wiremiId: `WRM${String(i + 1).padStart(6, '0')}`,
        email: `customer${i + 1}@example.com`,
        phone: `+1-555-${String(i + 1).padStart(4, '0')}`,
        firstName: `Customer`,
        lastName: `${i + 1}`,
        accountType: ['Lead', 'Free', 'Premium', 'Business'][i % 4] as any,
        country: ['United States', 'Canada', 'United Kingdom', 'Nigeria'][i % 4],
        region: ['California', 'Ontario', 'England', 'Lagos'][i % 4],
        kycStatus: ['Pending', 'Verified', 'Rejected'][i % 3] as any,
        riskScore: Math.floor(Math.random() * 100),
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        lastLoginAt: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 86400000 * 7).toISOString() : undefined,
        signupDate: new Date(Date.now() - i * 86400000).toISOString()
      }));

      let filteredCustomers = mockCustomers;
      if (activeAccountType !== 'all') {
        if (activeAccountType === 'leads') {
          filteredCustomers = mockCustomers.filter(c => c.accountType === 'Lead');
        } else if (activeAccountType === 'personal') {
          filteredCustomers = mockCustomers.filter(c => c.accountType === 'Free' || c.accountType === 'Premium');
        } else if (activeAccountType === 'business') {
          filteredCustomers = mockCustomers.filter(c => c.accountType === 'BUSINESS');
        }
      }
      setCustomers(filteredCustomers);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActiveUsersCount = () => {
    // Mock calculation - in real app this would come from API
    return customers.filter(c => c.lastLoginAt && 
      new Date(c.lastLoginAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length;
  };

  const getAccountTypeStats = () => {
    const totalCustomers = customers.length;
    const leads = customers.filter(c => c.accountType === 'LEAD').length;
    const personal = customers.filter(c => c.accountType === 'PERSONAL' || c.accountType === 'Free' || c.accountType === 'Premium').length;
    const business = Math.floor(totalCustomers * 0.15); // 15% business
    
    return { totalCustomers, leads, personal, business };
  };

  const stats = getAccountTypeStats();

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(c => c.id));
    }
  };

  const handleBulkOperation = (operation: string) => {
    // TODO: Implement bulk operations
    console.log(`Bulk operation: ${operation} for customers:`, selectedCustomers);
  };

  const getAccountTypeBadge = (accountType: string) => {
    const colors = {
      LEAD: 'bg-yellow-100 text-yellow-800',
      Free: 'bg-gray-100 text-gray-800',
      Premium: 'bg-blue-100 text-blue-800',
      Business: 'bg-purple-100 text-purple-800'
    };
    return colors[accountType as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getKycStatusBadge = (status: string) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Verified: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-green-600';
  };

  const handleCustomerClick = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer?.accountType === 'LEAD') {
      navigate(`/leads/${customerId}`);
    } else if (customer?.accountType === 'PERSONAL' || customer?.accountType === 'BUSINESS' || customer?.accountType === 'Free' || customer?.accountType === 'Premium') {
      navigate(`/customers/${customerId}`);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Customer Management" 
        subtitle="Manage customers, leads, and user accounts"
        actions={
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              <Plus size={16} className="mr-2" />
              Add Customer
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          change="+12% this month"
          changeType="positive"
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Active Users (7 days)"
          value={getActiveUsersCount().toLocaleString()}
          change="+8% this week"
          changeType="positive"
          icon={Users}
          iconColor="text-green-500"
        />
        <StatsCard
          title="KYC Pending"
          value="89"
          change="-3% this week"
          changeType="positive"
          icon={Users}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="High Risk"
          value="23"
          change="+2 new alerts"
          changeType="negative"
          icon={Users}
          iconColor="text-red-500"
        />
      </div>

      {/* Account Type Tabs */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mb-6">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveAccountType('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeAccountType === 'all'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
              }`}
            >
              All Customers ({stats.totalCustomers.toLocaleString()})
            </button>
            <button
              onClick={() => setActiveAccountType('personal')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeAccountType === 'personal'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
              }`}
            >
              <User size={16} />
              <span>Personal Accounts ({stats.personal.toLocaleString()})</span>
            </button>
            <button
              onClick={() => setActiveAccountType('business')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeAccountType === 'business'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
              }`}
            >
              <Building size={16} />
              <span>Business Accounts ({stats.business.toLocaleString()})</span>
            </button>
            <button
              onClick={() => setActiveAccountType('leads')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeAccountType === 'leads'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
              }`}
            >
              <UserPlus size={16} />
              <span>Leads ({stats.leads.toLocaleString()})</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-dark-400" size={20} />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 placeholder-gray-500 dark:placeholder-dark-400"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
            >
              <Filter size={16} />
              <span>Filters</span>
            </button>
          </div>
          
          {selectedCustomers.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 dark:text-dark-400">
                {selectedCustomers.length} selected
              </span>
              <select
                onChange={(e) => handleBulkOperation(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value="">Bulk Actions</option>
                <option value="upgrade-tier">Upgrade Tier</option>
                <option value="downgrade-tier">Downgrade Tier</option>
                <option value="verify-kyc">Verify KYC</option>
                <option value="export-selected">Export Selected</option>
                <option value="send-email">Send Email</option>
              </select>
            </div>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-dark-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Account Type</label>
              <select
                value={filters.accountType}
                onChange={(e) => handleFilterChange('accountType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value="">All Types</option>
                <option value="LEAD">Lead</option>
                <option value="PERSONAL">Personal</option>
                <option value="BUSINESS">Business</option>
                <option value="Business">Business</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">KYC Status</label>
              <select
                value={filters.kycStatus}
                onChange={(e) => handleFilterChange('kycStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Verified">Verified</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Country</label>
              <select
                value={filters.country}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value="">All Countries</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
                <option value="AU">Australia</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedCustomers.length === customers.length && customers.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Account Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Signup Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  KYC Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-200 dark:bg-dark-600 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                  </tr>
                ))
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedCustomers.includes(customer.id)}
                        onChange={() => handleSelectCustomer(customer.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                          {customer.firstName[0]}{customer.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div 
                            className="text-sm font-medium text-gray-900 dark:text-dark-100 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => handleCustomerClick(customer.id)}
                          >
                            {customer.firstName} {customer.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-dark-400">
                            {customer.email}
                          </div>
                          {customer.wiremiId && (
                            <div className="text-xs text-gray-400 dark:text-dark-500">
                              ID: {customer.wiremiId}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAccountTypeBadge(customer.accountType)}`}>
                        {customer.accountType === 'Free' || customer.accountType === 'Premium' ? 'PERSONAL' : customer.accountType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {new Date(customer.signupDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {customer.phone || 'Not provided'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusBadge(customer.kycStatus)}`}>
                        {customer.kycStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getRiskScoreColor(customer.riskScore)}`}>
                        {customer.riskScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">
                      {customer.country && customer.region ? `${customer.country}, ${customer.region}` : customer.country || 'Unknown'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-dark-400">
                      {customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white dark:bg-dark-800 px-4 py-3 border-t border-gray-200 dark:border-dark-700 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <p className="text-sm text-gray-700 dark:text-dark-300">
                Showing <span className="font-medium">1</span> to <span className="font-medium">20</span> of{' '}
                <span className="font-medium">97</span> results
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-sm font-medium text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-dark-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-sm font-medium text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;