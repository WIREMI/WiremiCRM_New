import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Flag, MessageSquare, RefreshCcw, Download, CheckCircle, XCircle, AlertTriangle, Eye, Printer } from 'lucide-react';
import { TransactionWithRelations } from '../services/TransactionService';
import { ExportService } from '../services/ExportService';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionWithRelations;
  onTransactionUpdated: () => void;
}

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction, 
  onTransactionUpdated 
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'receipt' | 'notes' | 'flags' | 'actions'>('details');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [flagReason, setFlagReason] = useState('');
  const [flagSeverity, setFlagSeverity] = useState('MEDIUM');
  const [loading, setLoading] = useState(false);
  const [receiptHtml, setReceiptHtml] = useState<string>('');
  const [loadingReceipt, setLoadingReceipt] = useState(false);

  const exportService = new ExportService();

  // Mock user roles - in real app, get from auth context
  const currentUserRoles = ['super_admin'];

  const handleAddNote = async () => {
    if (!newNoteContent.trim()) return;
    setLoading(true);
    try {
      // TODO: Call API
      console.log(`Adding note to ${transaction.id}: ${newNoteContent}`);
      setNewNoteContent('');
      onTransactionUpdated();
    } catch (error) {
      console.error('Error adding note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagTransaction = async () => {
    if (!flagReason.trim()) return;
    setLoading(true);
    try {
      // TODO: Call API
      console.log(`Flagging ${transaction.id} with reason: ${flagReason}, severity: ${flagSeverity}`);
      setFlagReason('');
      onTransactionUpdated();
    } catch (error) {
      console.error('Error flagging transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReverseTransaction = async () => {
    if (window.confirm(`Are you sure you want to request a reversal for transaction ${transaction.id}?`)) {
      setLoading(true);
      try {
        // TODO: Call API
        console.log(`Requesting reversal for ${transaction.id}`);
        onTransactionUpdated();
      } catch (error) {
        console.error('Error requesting reversal:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      // TODO: Replace with actual API call
      console.log(`Downloading receipt for ${transaction.id}`);
      
      const receiptBuffer = await exportService.generatePdfReceipt(transaction.id);
      if (receiptBuffer) {
        // Create blob and download
        const blob = new Blob([receiptBuffer], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wiremi-receipt-${transaction.id}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading receipt:', error);
      alert('Failed to generate receipt. Please try again.');
    }
  };

  const handleViewReceipt = async () => {
    if (receiptHtml) {
      setActiveTab('receipt');
      return;
    }

    setLoadingReceipt(true);
    try {
      const receiptBuffer = await exportService.generatePdfReceipt(transaction.id);
      if (receiptBuffer) {
        // Convert buffer to HTML string for preview
        const htmlContent = receiptBuffer.toString();
        setReceiptHtml(htmlContent);
        setActiveTab('receipt');
      }
    } catch (error) {
      console.error('Error generating receipt preview:', error);
      alert('Failed to generate receipt preview.');
    } finally {
      setLoadingReceipt(false);
    }
  };



  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAILED':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'PENDING_APPROVAL':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                    {getStatusIcon(transaction.status)}
                    <span>Transaction Details: {transaction.id.substring(0, 12)}...</span>
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {/* Transaction Header */}
                <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Amount</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Type</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-dark-100">{transaction.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Method</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                        {transaction.method.replace(/_/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-dark-400">Status</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                        {transaction.status.replace(/_/g, ' ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="mt-6">
                  <div className="border-b border-gray-200 dark:border-dark-700">
                    <nav className="-mb-px flex space-x-8">
                      {[
                        { id: 'details', label: 'Details', icon: MessageSquare },
                        { id: 'receipt', label: 'Receipt', icon: Eye },
                        { id: 'notes', label: `Notes (${transaction.notes?.length || 0})`, icon: MessageSquare },
                        { id: 'flags', label: `Flags (${transaction.flags?.length || 0})`, icon: Flag },
                        { id: 'actions', label: 'Actions', icon: RefreshCcw },
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 dark:text-dark-200 mb-3">Transaction Information</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-dark-400">Transaction ID:</span>
                                <span className="font-medium text-gray-900 dark:text-dark-100">{transaction.id}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-dark-400">User ID:</span>
                                <span className="font-medium text-gray-900 dark:text-dark-100">{transaction.userId}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-dark-400">Fees:</span>
                                <span className="font-medium text-gray-900 dark:text-dark-100">
                                  {formatCurrency(transaction.fees, transaction.currency)}
                                </span>
                              </div>
                              {transaction.exchangeRate && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-dark-400">Exchange Rate:</span>
                                  <span className="font-medium text-gray-900 dark:text-dark-100">{transaction.exchangeRate.toFixed(4)}</span>
                                </div>
                              )}
                              {transaction.referenceId && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-dark-400">Reference ID:</span>
                                  <span className="font-medium text-gray-900 dark:text-dark-100">{transaction.referenceId}</span>
                                </div>
                              )}
                              {transaction.adminInitiatedBy && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-dark-400">Initiated By:</span>
                                  <span className="font-medium text-blue-600 dark:text-blue-400">{transaction.adminInitiatedBy}</span>
                                </div>
                              )}
                              {transaction.approvedBy && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-dark-400">Approved By:</span>
                                  <span className="font-medium text-green-600 dark:text-green-400">{transaction.approvedBy}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h4 className="text-md font-semibold text-gray-800 dark:text-dark-200 mb-3">Timestamps</h4>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-dark-400">Created:</span>
                                <span className="font-medium text-gray-900 dark:text-dark-100">
                                  {new Date(transaction.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-dark-400">Last Updated:</span>
                                <span className="font-medium text-gray-900 dark:text-dark-100">
                                  {new Date(transaction.updatedAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {transaction.metadata && (
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 dark:text-dark-200 mb-3">Metadata</h4>
                            <pre className="bg-gray-100 dark:bg-dark-600 p-3 rounded-md text-sm overflow-x-auto text-gray-900 dark:text-dark-100">
                              {JSON.stringify(transaction.metadata, null, 2)}
                            </pre>
                          </div>
                        )}

                        {(transaction.walletBefore || transaction.walletAfter) && (
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 dark:text-dark-200 mb-3">Wallet Balances</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="font-medium text-gray-700 dark:text-dark-300 mb-2">Before Transaction:</p>
                                <pre className="bg-gray-100 dark:bg-dark-600 p-3 rounded-md text-sm overflow-x-auto text-gray-900 dark:text-dark-100">
                                  {JSON.stringify(transaction.walletBefore, null, 2)}
                                </pre>
                              </div>
                              <div>
                                <p className="font-medium text-gray-700 dark:text-dark-300 mb-2">After Transaction:</p>
                                <pre className="bg-gray-100 dark:bg-dark-600 p-3 rounded-md text-sm overflow-x-auto text-gray-900 dark:text-dark-100">
                                  {JSON.stringify(transaction.walletAfter, null, 2)}
                                </pre>
                              </div>
                            </div>
                          </div>
                        )}

                        {transaction.timeline && (
                          <div>
                            <h4 className="text-md font-semibold text-gray-800 dark:text-dark-200 mb-3">Timeline</h4>
                            <div className="space-y-3">
                              {(transaction.timeline as any[] || []).map((event, index) => (
                                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-dark-100">{event.status}</p>
                                    <p className="text-sm text-gray-600 dark:text-dark-400">{event.description}</p>
                                    <p className="text-xs text-gray-500 dark:text-dark-500">
                                      {new Date(event.timestamp).toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'receipt' && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-md font-semibold text-gray-800 dark:text-dark-200">Transaction Receipt</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={handleViewReceipt}
                              disabled={loadingReceipt}
                              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center text-sm"
                            >
                              {loadingReceipt ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Loading...
                                </>
                              ) : (
                                <>
                                  <Eye size={16} className="mr-2" />
                                  Refresh Preview
                                </>
                              )}
                            </button>
                            <button
                              onClick={handleDownloadReceipt}
                              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                            >
                              <Download size={16} className="mr-2" />
                              Download PDF
                            </button>
                          </div>
                        </div>
                        
                        {receiptHtml ? (
                          <div className="border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden">
                            <div 
                              className="receipt-preview bg-white p-4 max-h-96 overflow-y-auto"
                              dangerouslySetInnerHTML={{ __html: receiptHtml }}
                            />
                          </div>
                        ) : (
                          <div className="text-center py-12 border border-gray-200 dark:border-dark-600 rounded-lg">
                            <Printer className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 dark:text-dark-400 mb-4">
                              Click "Refresh Preview" to generate the receipt preview
                            </p>
                            <button
                              onClick={handleViewReceipt}
                              disabled={loadingReceipt}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              {loadingReceipt ? 'Generating...' : 'Generate Receipt Preview'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === 'notes' && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <textarea
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            placeholder="Add a new note..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                          />
                          <button
                            onClick={handleAddNote}
                            disabled={loading || !newNoteContent.trim()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Adding...' : 'Add Note'}
                          </button>
                        </div>

                        <div>
                          <h4 className="text-md font-semibold text-gray-800 dark:text-dark-200 mb-3">Existing Notes</h4>
                          {transaction.notes && transaction.notes.length > 0 ? (
                            <div className="space-y-3">
                              {transaction.notes.map((note: any, index: number) => (
                                <div key={index} className="bg-gray-50 dark:bg-dark-700 p-3 rounded-lg">
                                  <p className="text-sm text-gray-800 dark:text-dark-200">{note.content}</p>
                                  <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                                    Added by {note.createdBy} on {new Date(note.createdAt).toLocaleString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-dark-400">No notes for this transaction.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'flags' && (
                      <div className="space-y-4">
                        <div className="space-y-3">
                          <textarea
                            value={flagReason}
                            onChange={(e) => setFlagReason(e.target.value)}
                            placeholder="Reason for flagging..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                          />
                          <select
                            value={flagSeverity}
                            onChange={(e) => setFlagSeverity(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                          >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                            <option value="CRITICAL">Critical</option>
                          </select>
                          <button
                            onClick={handleFlagTransaction}
                            disabled={loading || !flagReason.trim()}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loading ? 'Flagging...' : 'Flag Transaction'}
                          </button>
                        </div>

                        <div>
                          <h4 className="text-md font-semibold text-gray-800 dark:text-dark-200 mb-3">Existing Flags</h4>
                          {transaction.flags && transaction.flags.length > 0 ? (
                            <div className="space-y-3">
                              {transaction.flags.map((flag: any, index: number) => (
                                <div key={index} className={`p-3 rounded-lg ${flag.resolved ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <p className="text-sm font-medium text-gray-800 dark:text-dark-200">
                                        Severity: {flag.severity}
                                      </p>
                                      <p className="text-sm text-gray-800 dark:text-dark-200">{flag.reason}</p>
                                      <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                                        Flagged by {flag.flaggedBy} on {new Date(flag.createdAt).toLocaleString()}
                                      </p>
                                      {flag.resolved && (
                                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                                          Resolved by {flag.resolvedBy} on {new Date(flag.resolvedAt).toLocaleString()}
                                        </p>
                                      )}
                                    </div>
                                    {!flag.resolved && (
                                      <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 text-sm">
                                        Resolve
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-dark-400">No flags for this transaction.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'actions' && (
                      <div className="space-y-4">
                        <h4 className="text-md font-semibold text-gray-800 dark:text-dark-200">Available Actions</h4>
                        

                        <div className="flex flex-col space-y-3">
                          <button
                            onClick={handleReverseTransaction}
                            disabled={loading}
                            className="flex items-center justify-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                          >
                            <RefreshCcw size={16} className="mr-2" />
                            {loading ? 'Processing...' : 'Request Reversal'}
                          </button>
                          <button
                            onClick={handleDownloadReceipt}
                            className="flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            <Download size={16} className="mr-2" />
                            Download PDF Receipt
                          </button>
                          <button
                            onClick={handleViewReceipt}
                            disabled={loadingReceipt}
                            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                          >
                            <Eye size={16} className="mr-2" />
                            {loadingReceipt ? 'Loading...' : 'View Receipt Preview'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransactionDetailModal;