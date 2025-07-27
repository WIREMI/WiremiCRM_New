import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertTriangle, MessageSquare, Activity, User, Calendar, Flag, CheckCircle } from 'lucide-react';
import { ComplianceCase, ComplianceCaseStatus, Priority } from '../../../types';

interface CaseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  case: ComplianceCase;
  onCaseUpdated: () => void;
}

const CaseDetailModal: React.FC<CaseDetailModalProps> = ({
  isOpen,
  onClose,
  case: complianceCase,
  onCaseUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'notes' | 'actions'>('details');
  const [newNote, setNewNote] = useState('');
  const [isInternal, setIsInternal] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [resolution, setResolution] = useState('');

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/v1/compliance/cases/${complianceCase.id}/notes`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ content: newNote, isInternal })
      // });

      console.log('Adding note to case:', complianceCase.id, newNote);
      setNewNote('');
      onCaseUpdated();
    } catch (error) {
      console.error('Failed to add note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: ComplianceCaseStatus) => {
    if (window.confirm(`Are you sure you want to change the case status to ${newStatus.replace(/_/g, ' ')}?`)) {
      try {
        // TODO: Replace with actual API call
        // await fetch(`/api/v1/compliance/cases/${complianceCase.id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ status: newStatus })
        // });

        console.log('Updating case status:', complianceCase.id, newStatus);
        onCaseUpdated();
      } catch (error) {
        console.error('Failed to update case status:', error);
      }
    }
  };

  const handleCloseCase = async () => {
    if (!resolution.trim()) {
      alert('Please provide a resolution before closing the case.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/v1/compliance/cases/${complianceCase.id}/close`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ resolution })
      // });

      console.log('Closing case:', complianceCase.id, resolution);
      setShowCloseModal(false);
      onCaseUpdated();
    } catch (error) {
      console.error('Failed to close case:', error);
    } finally {
      setLoading(false);
    }
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <span>Case Details: {complianceCase.caseNumber}</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {/* Case Header */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Customer</p>
                      <p className="font-semibold text-gray-900 dark:text-dark-100">{complianceCase.customerId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Type</p>
                      <p className="font-semibold text-gray-900 dark:text-dark-100">
                        {complianceCase.type.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Priority</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(complianceCase.priority)}`}>
                        {complianceCase.priority}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Status</p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(complianceCase.status)}`}>
                        {complianceCase.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="mt-6">
                  <div className="border-b border-gray-200 dark:border-dark-700">
                    <nav className="-mb-px flex space-x-8">
                      {[
                        { id: 'details', label: 'Case Details', icon: AlertTriangle },
                        { id: 'notes', label: `Notes (${complianceCase.notes?.length || 0})`, icon: MessageSquare },
                        { id: 'actions', label: `Actions (${complianceCase.actions?.length || 0})`, icon: Activity }
                      ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`${
                              activeTab === tab.id
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
                          >
                            <Icon size={16} />
                            <span>{tab.label}</span>
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="mt-6 max-h-96 overflow-y-auto">
                    {activeTab === 'details' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">Case Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm text-gray-600 dark:text-dark-400">Subject:</span>
                                <p className="font-medium text-gray-900 dark:text-dark-100">{complianceCase.subject}</p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-dark-400">Created:</span>
                                <p className="font-medium text-gray-900 dark:text-dark-100">{formatDate(complianceCase.createdAt)}</p>
                              </div>
                              <div>
                                <span className="text-sm text-gray-600 dark:text-dark-400">Created By:</span>
                                <p className="font-medium text-gray-900 dark:text-dark-100">{complianceCase.createdBy}</p>
                              </div>
                              {complianceCase.assignedTo && (
                                <div>
                                  <span className="text-sm text-gray-600 dark:text-dark-400">Assigned To:</span>
                                  <p className="font-medium text-gray-900 dark:text-dark-100">{complianceCase.assignedTo}</p>
                                </div>
                              )}
                            </div>
                            <div className="space-y-3">
                              {complianceCase.riskScore && (
                                <div>
                                  <span className="text-sm text-gray-600 dark:text-dark-400">Risk Score:</span>
                                  <p className="font-medium text-gray-900 dark:text-dark-100">{complianceCase.riskScore}/100</p>
                                </div>
                              )}
                              {complianceCase.dueDate && (
                                <div>
                                  <span className="text-sm text-gray-600 dark:text-dark-400">Due Date:</span>
                                  <p className="font-medium text-gray-900 dark:text-dark-100">{formatDate(complianceCase.dueDate)}</p>
                                </div>
                              )}
                              <div>
                                <span className="text-sm text-gray-600 dark:text-dark-400">Last Updated:</span>
                                <p className="font-medium text-gray-900 dark:text-dark-100">{formatDate(complianceCase.updatedAt)}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">Description</h4>
                          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                            <p className="text-gray-900 dark:text-dark-100 whitespace-pre-wrap">
                              {complianceCase.description}
                            </p>
                          </div>
                        </div>

                        {complianceCase.resolution && (
                          <div>
                            <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">Resolution</h4>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                              <p className="text-gray-900 dark:text-dark-100 whitespace-pre-wrap">
                                {complianceCase.resolution}
                              </p>
                              {complianceCase.closedBy && complianceCase.closedAt && (
                                <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                                  Closed by {complianceCase.closedBy} on {formatDate(complianceCase.closedAt)}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'notes' && (
                      <div className="space-y-4">
                        {/* Add Note Form */}
                        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                          <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">Add Note</h4>
                          <div className="space-y-3">
                            <textarea
                              value={newNote}
                              onChange={(e) => setNewNote(e.target.value)}
                              placeholder="Add a note to this case..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100 resize-none"
                            />
                            <div className="flex items-center justify-between">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isInternal}
                                  onChange={(e) => setIsInternal(e.target.checked)}
                                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 dark:text-dark-300">
                                  Internal note (not visible to customer)
                                </span>
                              </label>
                              <button
                                onClick={handleAddNote}
                                disabled={loading || !newNote.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                {loading ? 'Adding...' : 'Add Note'}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Existing Notes */}
                        <div>
                          <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100 mb-3">Case Notes</h4>
                          {complianceCase.notes && complianceCase.notes.length > 0 ? (
                            <div className="space-y-3">
                              {complianceCase.notes.map((note) => (
                                <div key={note.id} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                      <MessageSquare size={16} className="text-blue-500" />
                                      <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                                        {note.createdBy}
                                      </span>
                                      {note.isInternal && (
                                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                                          Internal
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-dark-400">
                                      {formatDate(note.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-900 dark:text-dark-100 whitespace-pre-wrap">
                                    {note.content}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 dark:text-dark-400">No notes added to this case yet.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'actions' && (
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-900 dark:text-dark-100">Case Actions</h4>
                        {complianceCase.actions && complianceCase.actions.length > 0 ? (
                          <div className="space-y-3">
                            {complianceCase.actions.map((action) => (
                              <div key={action.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                                <Activity size={16} className="text-blue-500 mt-1" />
                                <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900 dark:text-dark-100">
                                      {action.actionType.replace(/_/g, ' ')}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-dark-400">
                                      {formatDate(action.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-dark-400 mt-1">
                                    {action.description}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-dark-500 mt-1">
                                    by {action.performedBy}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 dark:text-dark-400">No actions recorded for this case yet.</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
                  <div className="flex space-x-3">
                    {complianceCase.status !== ComplianceCaseStatus.CLOSED && (
                      <>
                        <button
                          onClick={() => handleStatusChange(ComplianceCaseStatus.IN_REVIEW)}
                          disabled={complianceCase.status === ComplianceCaseStatus.IN_REVIEW}
                          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
                        >
                          Mark In Review
                        </button>
                        <button
                          onClick={() => handleStatusChange(ComplianceCaseStatus.RESOLVED)}
                          disabled={complianceCase.status === ComplianceCaseStatus.RESOLVED}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          Mark Resolved
                        </button>
                        <button
                          onClick={() => setShowCloseModal(true)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                        >
                          <CheckCircle size={16} className="mr-2" />
                          Close Case
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    Close
                  </button>
                </div>

                {/* Close Case Modal */}
                {showCloseModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                    <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
                        Close Compliance Case
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                            Resolution *
                          </label>
                          <textarea
                            value={resolution}
                            onChange={(e) => setResolution(e.target.value)}
                            placeholder="Describe how this case was resolved..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-6">
                        <button
                          onClick={() => setShowCloseModal(false)}
                          className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCloseCase}
                          disabled={loading || !resolution.trim()}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Closing...' : 'Close Case'}
                        </button>
                      </div>
                    </div>
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

export default CaseDetailModal;