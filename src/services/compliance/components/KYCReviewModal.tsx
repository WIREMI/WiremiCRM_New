import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, FileCheck, CheckCircle, XCircle, AlertTriangle, Download, Eye } from 'lucide-react';
import { KYCReview, KYCReviewStatus } from '../../../types';

interface KYCReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  review: KYCReview;
  onReviewUpdated: () => void;
}

const KYCReviewModal: React.FC<KYCReviewModalProps> = ({
  isOpen,
  onClose,
  review,
  onReviewUpdated
}) => {
  const [activeAction, setActiveAction] = useState<'approve' | 'reject' | 'request-info' | null>(null);
  const [notes, setNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [requestDetails, setRequestDetails] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this KYC review?')) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/v1/compliance/kyc-reviews/${review.id}/approve`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ notes })
      // });

      console.log('Approving KYC review:', review.id, notes);
      onReviewUpdated();
    } catch (error) {
      console.error('Failed to approve KYC review:', error);
    } finally {
      setLoading(false);
      setActiveAction(null);
      setNotes('');
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }

    if (!window.confirm('Are you sure you want to reject this KYC review?')) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/v1/compliance/kyc-reviews/${review.id}/reject`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ rejectionReason, notes })
      // });

      console.log('Rejecting KYC review:', review.id, rejectionReason, notes);
      onReviewUpdated();
    } catch (error) {
      console.error('Failed to reject KYC review:', error);
    } finally {
      setLoading(false);
      setActiveAction(null);
      setRejectionReason('');
      setNotes('');
    }
  };

  const handleRequestMoreInfo = async () => {
    if (!requestDetails.trim()) {
      alert('Please specify what additional information is needed.');
      return;
    }

    if (!window.confirm('Are you sure you want to request more information?')) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/v1/compliance/kyc-reviews/${review.id}/request-info`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ requestDetails, notes })
      // });

      console.log('Requesting more info for KYC review:', review.id, requestDetails, notes);
      onReviewUpdated();
    } catch (error) {
      console.error('Failed to request more info:', error);
    } finally {
      setLoading(false);
      setActiveAction(null);
      setRequestDetails('');
      setNotes('');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-6 h-6 text-blue-500" />
                    <span>KYC Review: {review.customerId}</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {/* Review Header */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Customer ID</p>
                      <p className="font-semibold text-gray-900 dark:text-dark-100">{review.customerId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Customer Type</p>
                      <p className="font-semibold text-gray-900 dark:text-dark-100">{review.customerType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(review.kycStatus)}`}>
                        {review.kycStatus.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Compliance Score</p>
                      <p className="font-semibold text-gray-900 dark:text-dark-100">
                        {review.complianceScore || 'N/A'}/100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Review Details */}
                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">Review Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-dark-400">Submission Date:</span>
                          <span className="font-medium text-gray-900 dark:text-dark-100">
                            {formatDate(review.submissionDate)}
                          </span>
                        </div>
                        {review.dueDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-400">Due Date:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-100">
                              {formatDate(review.dueDate)}
                            </span>
                          </div>
                        )}
                        {review.reviewedBy && (
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-dark-400">Reviewed By:</span>
                            <span className="font-medium text-gray-900 dark:text-dark-100">
                              {review.reviewedBy}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">Risk Assessment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-dark-400">Priority:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(review.priority)}`}>
                            {review.priority}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600 dark:text-dark-400">Risk Flags:</span>
                          <div className="mt-1">
                            {review.riskFlags.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {review.riskFlags.map((flag, index) => (
                                  <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
                                    {flag.replace(/_/g, ' ')}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-gray-500 dark:text-dark-400 text-sm">No risk flags</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Documents Section */}
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">KYC Documents</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {['ID Front', 'ID Back', 'Selfie with ID'].map((docType, index) => (
                        <div key={index} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                          <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-2">{docType}</h5>
                          <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-32 flex items-center justify-center mb-3">
                            <FileCheck className="w-8 h-8 text-gray-400" />
                          </div>
                          <div className="flex space-x-2">
                            <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm">
                              <Eye size={14} className="mr-1" />
                              View
                            </button>
                            <button className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm">
                              <Download size={14} className="mr-1" />
                              Download
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes Section */}
                  {review.notes && (
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">Review Notes</h4>
                      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                        <p className="text-gray-900 dark:text-dark-100 whitespace-pre-wrap">
                          {review.notes}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Forms */}
                  {activeAction && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="text-md font-semibold text-blue-900 dark:text-blue-100 mb-3">
                        {activeAction === 'approve' && 'Approve KYC Review'}
                        {activeAction === 'reject' && 'Reject KYC Review'}
                        {activeAction === 'request-info' && 'Request Additional Information'}
                      </h4>

                      <div className="space-y-4">
                        {activeAction === 'reject' && (
                          <div>
                            <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                              Rejection Reason *
                            </label>
                            <textarea
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                              placeholder="Explain why this KYC submission is being rejected..."
                              rows={3}
                              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                            />
                          </div>
                        )}

                        {activeAction === 'request-info' && (
                          <div>
                            <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                              Information Required *
                            </label>
                            <textarea
                              value={requestDetails}
                              onChange={(e) => setRequestDetails(e.target.value)}
                              placeholder="Specify what additional information or documents are needed..."
                              rows={3}
                              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                            Additional Notes
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add any additional notes about this review..."
                            rows={2}
                            className="w-full px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                          />
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() => {
                              if (activeAction === 'approve') handleApprove();
                              else if (activeAction === 'reject') handleReject();
                              else if (activeAction === 'request-info') handleRequestMoreInfo();
                            }}
                            disabled={loading || (activeAction === 'reject' && !rejectionReason.trim()) || (activeAction === 'request-info' && !requestDetails.trim())}
                            className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                              activeAction === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                              activeAction === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                              'bg-orange-600 hover:bg-orange-700'
                            }`}
                          >
                            {loading ? 'Processing...' : 
                             activeAction === 'approve' ? 'Approve' :
                             activeAction === 'reject' ? 'Reject' : 'Request Info'}
                          </button>
                          <button
                            onClick={() => setActiveAction(null)}
                            className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {!activeAction && review.kycStatus !== KYCReviewStatus.APPROVED && review.kycStatus !== KYCReviewStatus.REJECTED && (
                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setActiveAction('approve')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => setActiveAction('reject')}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                      >
                        <XCircle size={16} className="mr-2" />
                        Reject
                      </button>
                      <button
                        onClick={() => setActiveAction('request-info')}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                      >
                        <AlertTriangle size={16} className="mr-2" />
                        Request More Info
                      </button>
                    </div>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default KYCReviewModal;