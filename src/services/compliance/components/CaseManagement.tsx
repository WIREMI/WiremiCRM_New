import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Flag, Clock, User, AlertTriangle } from 'lucide-react';
import { ComplianceCase, ComplianceCaseType, ComplianceCaseStatus, Priority } from '../../../types';
import CreateCaseModal from './CreateCaseModal';
import CaseDetailModal from './CaseDetailModal';

interface CaseManagementProps {
  onCreateCase?: () => void;
}

const CaseManagement: React.FC<CaseManagementProps> = ({ onCreateCase }) => {
  const [cases, setCases] = useState<ComplianceCase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState<ComplianceCase | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    priority: '',
    assignedTo: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadCases();
  }, [filters, currentPage]);

  const loadCases = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/compliance/cases?' + new URLSearchParams({
      //   ...filters,
      //   page: currentPage.toString()
      // }));
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockCases: ComplianceCase[] = Array.from({ length: 15 }, (_, i) => ({
        id: `case-${i + 1}`,
        caseNumber: `COMP-202401-${String(i + 1).padStart(4, '0')}`,
        customerId: `WRM${String(i + 1).padStart(6, '0')}`,
        type: [
          ComplianceCaseType.AML_SUSPICIOUS_ACTIVITY,
          ComplianceCaseType.KYC_NON_COMPLIANCE,
          ComplianceCaseType.SANCTIONS_SCREENING,
          ComplianceCaseType.PEP_MATCH,
          ComplianceCaseType.FRAUD_RELATED
        ][i % 5],
        status: [
          ComplianceCaseStatus.OPEN,
          ComplianceCaseStatus.IN_REVIEW,
          ComplianceCaseStatus.PENDING_APPROVAL,
          ComplianceCaseStatus.RESOLVED,
          ComplianceCaseStatus.ESCALATED
        ][i % 5],
        priority: [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL][i % 4],
        subject: [
          'Suspicious transaction pattern detected',
          'KYC documents require verification',
          'Customer appears on sanctions list',
          'PEP status confirmation needed',
          'Fraudulent activity reported'
        ][i % 5],
        description: 'Detailed description of the compliance case...',
        assignedTo: i % 3 === 0 ? `officer-${i + 1}` : undefined,
        riskScore: Math.floor(Math.random() * 100),
        dueDate: new Date(Date.now() + (i * 86400000)).toISOString(),
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system',
        notes: [],
        actions: []
      }));

      setCases(mockCases);
      setTotalPages(3); // Mock pagination
    } catch (error) {
      console.error('Failed to load compliance cases:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeBadge = (type: ComplianceCaseType) => {
    const colors = {
      [ComplianceCaseType.AML_SUSPICIOUS_ACTIVITY]: 'bg-red-100 text-red-800',
      [ComplianceCaseType.KYC_NON_COMPLIANCE]: 'bg-yellow-100 text-yellow-800',
      [ComplianceCaseType.SANCTIONS_SCREENING]: 'bg-purple-100 text-purple-800',
      [ComplianceCaseType.PEP_MATCH]: 'bg-blue-100 text-blue-800',
      [ComplianceCaseType.FRAUD_RELATED]: 'bg-orange-100 text-orange-800',
      [ComplianceCaseType.TRANSACTION_MONITORING]: 'bg-indigo-100 text-indigo-800',
      [ComplianceCaseType.CUSTOMER_DUE_DILIGENCE]: 'bg-green-100 text-green-800',
      [ComplianceCaseType.ENHANCED_DUE_DILIGENCE]: 'bg-pink-100 text-pink-800',
      [ComplianceCaseType.OTHER]: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: ComplianceCaseStatus) => {
    const colors = {
      [ComplianceCaseStatus.OPEN]: 'bg-blue-100 text-blue-800',
      [ComplianceCaseStatus.IN_REVIEW]: 'bg-yellow-100 text-yellow-800',
      [ComplianceCaseStatus.PENDING_APPROVAL]: 'bg-orange-100 text-orange-800',
      [ComplianceCaseStatus.RESOLVED]: 'bg-green-100 text-green-800',
      [ComplianceCaseStatus.CLOSED]: 'bg-gray-100 text-gray-800',
      [ComplianceCaseStatus.ESCALATED]: 'bg-red-100 text-red-800',
      [ComplianceCaseStatus.SUSPENDED]: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityBadge = (priority: Priority) => {
    const colors = {
      [Priority.LOW]: 'bg-blue-100 text-blue-800',
      [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [Priority.HIGH]: 'bg-orange-100 text-orange-800',
      [Priority.CRITICAL]: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 font-bold';
    if (score >= 60) return 'text-orange-600 font-semibold';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDateString?: string) => {
    if (!dueDateString) return false;
    return new Date(dueDateString) < new Date();
  };

  const handleViewCase = (complianceCase: ComplianceCase) => {
    setSelectedCase(complianceCase);
    setShowDetailModal(true);
  };

  const handleCreateCase = () => {
    if (onCreateCase) {
      onCreateCase();
    }
  };


  const handleCaseUpdated = () => {
    setShowDetailModal(false);
    loadCases();
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          Compliance Cases
        </h3>
        <button
          onClick={handleCreateCase}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2" />
          Create Case
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search cases..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Types</option>
              <option value="AML_SUSPICIOUS_ACTIVITY">AML Suspicious Activity</option>
              <option value="KYC_NON_COMPLIANCE">KYC Non-Compliance</option>
              <option value="SANCTIONS_SCREENING">Sanctions Screening</option>
              <option value="PEP_MATCH">PEP Match</option>
              <option value="FRAUD_RELATED">Fraud Related</option>
              <option value="TRANSACTION_MONITORING">Transaction Monitoring</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="PENDING_APPROVAL">Pending Approval</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ESCALATED">Escalated</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Priority
            </label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Assigned To
            </label>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Officers</option>
              <option value="officer-1">John Smith</option>
              <option value="officer-2">Sarah Johnson</option>
              <option value="officer-3">Mike Wilson</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Case
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Risk Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-12"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                  </tr>
                ))
              ) : (
                cases.map((complianceCase) => (
                  <tr key={complianceCase.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                          {complianceCase.caseNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-dark-400 truncate max-w-xs">
                          {complianceCase.subject}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {complianceCase.customerId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeBadge(complianceCase.type)}`}>
                        {complianceCase.type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(complianceCase.priority)}`}>
                        {complianceCase.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(complianceCase.status)}`}>
                        {complianceCase.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getRiskScoreColor(complianceCase.riskScore || 0)}`}>
                        {complianceCase.riskScore || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {complianceCase.assignedTo ? (
                          <div className="flex items-center">
                            <User size={14} className="mr-1 text-gray-400" />
                            {complianceCase.assignedTo}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-dark-400">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        isOverdue(complianceCase.dueDate) ? 'text-red-600 font-semibold' : 'text-gray-900 dark:text-dark-100'
                      }`}>
                        {complianceCase.dueDate ? (
                          <div className="flex items-center">
                            {isOverdue(complianceCase.dueDate) && <Clock size={14} className="mr-1 text-red-500" />}
                            {formatDate(complianceCase.dueDate)}
                          </div>
                        ) : (
                          'No due date'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewCase(complianceCase)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300 p-1"
                          title="Edit Case"
                        >
                          <Edit size={16} />
                        </button>
                        {complianceCase.priority === Priority.CRITICAL && (
                          <Flag size={16} className="text-red-500" title="Critical Priority" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-gray-50 dark:bg-dark-700 px-4 py-3 border-t border-gray-200 dark:border-dark-600 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-dark-300">
              Showing {cases.length} of {cases.length * totalPages} results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-sm font-medium text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-dark-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-sm font-medium text-gray-500 dark:text-dark-400 hover:text-gray-700 dark:hover:text-dark-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedCase && (
        <CaseDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          case={selectedCase}
          onCaseUpdated={handleCaseUpdated}
        />
      )}
    </div>
  );
};

export default CaseManagement;