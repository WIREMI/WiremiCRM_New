import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck, Eye, CheckCircle, XCircle, AlertTriangle, Clock, User, Filter } from 'lucide-react';
import { KYCReview, KYCReviewStatus, Priority } from '../../../types';

const KYCReviewQueue: React.FC = () => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<KYCReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    kycStatus: '',
    priority: '',
    customerType: '',
    overdue: false
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadKYCReviews();
  }, [filters, currentPage]);

  const loadKYCReviews = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/compliance/kyc-reviews?' + new URLSearchParams({
      //   ...filters,
      //   page: currentPage.toString()
      // }));
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockReviews: KYCReview[] = Array.from({ length: 12 }, (_, i) => ({
        id: `review-${i + 1}`,
        customerId: `WRM${String(i + 1).padStart(6, '0')}`,
        customerType: i % 3 === 0 ? 'BUSINESS' : 'PERSONAL',
        kycStatus: [
          KYCReviewStatus.PENDING_REVIEW,
          KYCReviewStatus.IN_REVIEW,
          KYCReviewStatus.REQUIRES_MORE_INFO,
          KYCReviewStatus.ESCALATED
        ][i % 4],
        submissionDate: new Date(Date.now() - i * 86400000 * 2).toISOString(),
        priority: [Priority.LOW, Priority.MEDIUM, Priority.HIGH, Priority.CRITICAL][i % 4],
        riskFlags: i % 3 === 0 ? ['high_risk_country', 'large_transaction'] : [],
        complianceScore: Math.floor(Math.random() * 100),
        dueDate: new Date(Date.now() + (3 - i) * 86400000).toISOString(),
        reviewedBy: i % 4 === 1 ? 'officer-1' : undefined,
        createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
        updatedAt: new Date().toISOString()
      }));

      setReviews(mockReviews);
    } catch (error) {
      console.error('Failed to load KYC reviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: KYCReviewStatus) => {
    const colors = {
      [KYCReviewStatus.PENDING_REVIEW]: 'bg-yellow-100 text-yellow-800',
      [KYCReviewStatus.IN_REVIEW]: 'bg-blue-100 text-blue-800',
      [KYCReviewStatus.APPROVED]: 'bg-green-100 text-green-800',
      [KYCReviewStatus.REJECTED]: 'bg-red-100 text-red-800',
      [KYCReviewStatus.REQUIRES_MORE_INFO]: 'bg-orange-100 text-orange-800',
      [KYCReviewStatus.ESCALATED]: 'bg-purple-100 text-purple-800'
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDateString: string) => {
    return new Date(dueDateString) < new Date();
  };

  const getDaysUntilDue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewReview = (review: KYCReview) => {
    // Navigate to customer detail page with review context
    navigate(`/customers/${review.customerId}`, {
      state: { 
        reviewId: review.id,
        openKYCTab: true 
      }
    });
  };


  const handleSelectReview = (reviewId: string, isSelected: boolean) => {
    setSelectedReviews(prev =>
      isSelected ? [...prev, reviewId] : prev.filter(id => id !== reviewId)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    if (isSelected) {
      setSelectedReviews(reviews.map(r => r.id));
    } else {
      setSelectedReviews([]);
    }
  };

  const handleBulkAssign = async () => {
    if (selectedReviews.length === 0) return;
    
    const assignTo = prompt('Enter officer ID to assign selected reviews to:');
    if (!assignTo) return;

    try {
      // TODO: Replace with actual API call
      // await fetch('/api/v1/compliance/kyc-reviews/bulk-assign', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ reviewIds: selectedReviews, assignedTo: assignTo })
      // });

      console.log('Bulk assigning reviews:', selectedReviews, 'to:', assignTo);
      setSelectedReviews([]);
      loadKYCReviews();
    } catch (error) {
      console.error('Failed to bulk assign reviews:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          KYC Review Queue
        </h3>
        {selectedReviews.length > 0 && (
          <button
            onClick={handleBulkAssign}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Bulk Assign ({selectedReviews.length})
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Status
            </label>
            <select
              value={filters.kycStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, kycStatus: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Statuses</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="REQUIRES_MORE_INFO">Requires More Info</option>
              <option value="ESCALATED">Escalated</option>
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
              Customer Type
            </label>
            <select
              value={filters.customerType}
              onChange={(e) => setFilters(prev => ({ ...prev, customerType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Types</option>
              <option value="PERSONAL">Personal</option>
              <option value="BUSINESS">Business</option>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.overdue}
                onChange={(e) => setFilters(prev => ({ ...prev, overdue: e.target.checked }))}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">
                Show overdue only
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedReviews.length === reviews.length && reviews.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Submission Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Risk Flags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Assigned To
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
                    <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-200 dark:bg-dark-600 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 dark:bg-dark-600 rounded w-16"></div></td>
                  </tr>
                ))
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedReviews.includes(review.id)}
                        onChange={(e) => handleSelectReview(review.id, e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {review.customerId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        review.customerType === 'BUSINESS' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {review.customerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(review.kycStatus)}`}>
                        {review.kycStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(review.priority)}`}>
                        {review.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-dark-100">
                      {formatDate(review.submissionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${
                        isOverdue(review.dueDate!) ? 'text-red-600 font-semibold' : 'text-gray-900 dark:text-dark-100'
                      }`}>
                        {review.dueDate ? (
                          <div className="flex items-center">
                            {isOverdue(review.dueDate) && <Clock size={14} className="mr-1 text-red-500" />}
                            {formatDate(review.dueDate)}
                            <div className="text-xs text-gray-500 dark:text-dark-400 ml-1">
                              ({getDaysUntilDue(review.dueDate)} days)
                            </div>
                          </div>
                        ) : (
                          'No due date'
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {review.riskFlags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {review.riskFlags.slice(0, 2).map((flag, index) => (
                            <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                              {flag.replace(/_/g, ' ')}
                            </span>
                          ))}
                          {review.riskFlags.length > 2 && (
                            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                              +{review.riskFlags.length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-dark-400 text-sm">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-dark-100">
                        {review.reviewedBy ? (
                          <div className="flex items-center">
                            <User size={14} className="mr-1 text-gray-400" />
                            {review.reviewedBy}
                          </div>
                        ) : (
                          <span className="text-gray-500 dark:text-dark-400">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewReview(review)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                        title="Review KYC"
                      >
                        <Eye size={16} />
                      </button>
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

export default KYCReviewQueue;