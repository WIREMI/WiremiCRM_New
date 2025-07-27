import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, FileText, Download, Eye, User, Calendar, Shield } from 'lucide-react';

interface KYCDocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentType: string; // e.g., "ID Front", "ID Back", "Selfie"
  idType: string; // e.g., "NATIONAL_ID", "PASSPORT", "DRIVERS_LICENSE"
  idNumber?: string;
  customerName: string;
  submissionDate: string;
}

const KYCDocumentViewerModal: React.FC<KYCDocumentViewerModalProps> = ({
  isOpen,
  onClose,
  documentUrl,
  documentType,
  idType,
  idNumber,
  customerName,
  submissionDate
}) => {
  const formatIdType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'NATIONAL_ID': 'National ID',
      'PASSPORT': 'Passport',
      'DRIVERS_LICENSE': 'Driver\'s License'
    };
    return typeMap[type] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownload = () => {
    // Create a temporary link to download the image
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = `${customerName}_${documentType.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          <div className="fixed inset-0 bg-black bg-opacity-75" />
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
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 text-left align-middle shadow-xl transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-6 h-6 text-blue-500" />
                    <div>
                      <Dialog.Title as="h3" className="text-lg font-medium text-gray-900 dark:text-dark-100">
                        KYC Document: {documentType}
                      </Dialog.Title>
                      <p className="text-sm text-gray-600 dark:text-dark-400">
                        {customerName} • {formatIdType(idType)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Document Information */}
                <div className="p-6 border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-400">Customer</p>
                        <p className="font-medium text-gray-900 dark:text-dark-100">{customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-400">Document Type</p>
                        <p className="font-medium text-gray-900 dark:text-dark-100">{formatIdType(idType)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-dark-400">Submitted</p>
                        <p className="font-medium text-gray-900 dark:text-dark-100">{formatDate(submissionDate)}</p>
                      </div>
                    </div>
                  </div>
                  
                  {idNumber && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          Document ID: {idNumber}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Document Image */}
                <div className="p-6">
                  <div className="text-center">
                    <div className="bg-gray-100 dark:bg-dark-600 rounded-lg p-4 mb-4">
                      <img
                        src={documentUrl}
                        alt={`${documentType} for ${customerName}`}
                        className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const placeholder = target.parentElement?.querySelector('.placeholder');
                          if (placeholder) {
                            (placeholder as HTMLElement).style.display = 'flex';
                          }
                        }}
                      />
                      <div className="placeholder hidden flex-col items-center justify-center h-64 text-gray-400">
                        <FileText size={48} className="mb-4" />
                        <p>Document image not available</p>
                        <p className="text-sm">URL: {documentUrl}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={handleDownload}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download size={16} />
                        <span>Download</span>
                      </button>
                      <button
                        onClick={() => window.open(documentUrl, '_blank')}
                        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-dark-600 text-gray-700 dark:text-dark-300 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                      >
                        <Eye size={16} />
                        <span>Open in New Tab</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200 dark:border-dark-700">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default KYCDocumentViewerModal;