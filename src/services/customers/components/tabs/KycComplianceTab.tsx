import React, { useState } from 'react';
import { Shield, FileText, Calendar, CheckCircle, XCircle, AlertTriangle, Eye, Download, User } from 'lucide-react';
import { PersonalAccount, BusinessAccount, KYCStatus, IDType } from '../../../../types';
import KYCDocumentViewerModal from '../modals/KYCDocumentViewerModal';

interface KycComplianceTabProps {
  customer: PersonalAccount | BusinessAccount;
  customerType: 'personal' | 'business';
  onOpenKYCReview?: () => void;
}

const KycComplianceTab: React.FC<KycComplianceTabProps> = ({ customer, customerType, onOpenKYCReview }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocumentData, setSelectedDocumentData] = useState<any>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getKycStatusIcon = (status: KYCStatus) => {
    switch (status) {
      case KYCStatus.VERIFIED:
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case KYCStatus.REJECTED:
        return <XCircle className="w-6 h-6 text-red-500" />;
      case KYCStatus.PENDING:
      default:
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getKycStatusBadge = (status: KYCStatus) => {
    const colors = {
      [KYCStatus.VERIFIED]: 'bg-green-100 text-green-800',
      [KYCStatus.REJECTED]: 'bg-red-100 text-red-800',
      [KYCStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
      [KYCStatus.REQUIRES_REVIEW]: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleDocumentView = (documentUrl: string) => {
    const documentType = documentUrl.includes('front') ? 'ID Front' : 
                        documentUrl.includes('back') ? 'ID Back' : 
                        documentUrl.includes('selfie') ? 'Selfie with ID' : 'Document';
    
    const isPersonalAccount = customerType === 'personal';
    const personalCustomer = customer as PersonalAccount;
    const businessCustomer = customer as BusinessAccount;

    const idType = isPersonalAccount ? 
      personalCustomer.kycDocuments.idType : 
      (businessCustomer.kycDocuments.directorId?.idType || 'NATIONAL_ID'); // Default for business director
    
    // Generate mock ID number based on document type
    const idNumber = idType === 'PASSPORT' ? 'P123456789' :
                    idType === 'DRIVERS_LICENSE' ? 'DL987654321' :
                    'ID123456789';

    setSelectedDocumentData({
      url: documentUrl,
      type: documentType,
      idType,
      idNumber
    });
    setShowDocumentViewer(true);
  };

  const handleDocumentDownload = (documentUrl: string) => {
    // TODO: Implement secure document download
    console.log('Download document:', documentUrl);
  };

  const isPersonalAccount = customerType === 'personal';
  const personalCustomer = customer as PersonalAccount;
  const businessCustomer = customer as BusinessAccount;

  return (
    <div className="space-y-6">
      {/* KYC Status Overview */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 flex items-center"> {/* Changed text-gray-800 to text-gray-900 */}
            <Shield className="mr-2 text-blue-500" size={20} />
            KYC Status Overview
          </h4>
          <div className="flex items-center space-x-3">
            {getKycStatusIcon(customer.kycStatus)}
            <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getKycStatusBadge(customer.kycStatus)}`}>
              {customer.kycStatus}
            </span>
            {onOpenKYCReview && (
              <button
                onClick={onOpenKYCReview}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Review KYC
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-dark-400">Submission Date:</span>
            <span className="font-medium text-gray-900 dark:text-dark-100"> {/* Changed text-gray-800 to text-gray-900 */}
              {formatDate(customer.kycDocuments.submissionDate)}
            </span>
          </div>
          {customer.kycDocuments.reviewDate && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Review Date:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100"> {/* Changed text-gray-800 to text-gray-900 */}
                {formatDate(customer.kycDocuments.reviewDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Documents Section */}
      {isPersonalAccount ? (
        /* Personal Account Documents */
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 flex items-center"> {/* Changed text-gray-800 to text-gray-900 */}
            <FileText className="mr-2 text-green-500" size={20} />
            Identity Documents
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-dark-400">ID Type</p>
              <p className="font-semibold text-gray-900 dark:text-dark-100 capitalize"> {/* Changed text-gray-800 to text-gray-900 */}
                {personalCustomer.kycDocuments.idType.toLowerCase().replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-dark-400">Document ID Number</p>
              <p className="font-semibold text-gray-900 dark:text-dark-100"> {/* Changed text-gray-800 to text-gray-900 */}
                {personalCustomer.kycDocuments.idNumber ||
                 (personalCustomer.kycDocuments.idType === 'PASSPORT' ? 'P123456789' :
                  personalCustomer.kycDocuments.idType === 'DRIVERS_LICENSE' ? 'DL987654321' :
                  'ID123456789')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Front ID */}
            <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">ID Front</h5> {/* Changed text-gray-800 to text-gray-900 */}
              <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-32 flex items-center justify-center mb-3 overflow-hidden">
                <img 
                  src={personalCustomer.kycDocuments.frontImageUrl} 
                  alt="ID Front"
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDocumentView(personalCustomer.kycDocuments.frontImageUrl)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Eye size={14} className="mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleDocumentDownload(personalCustomer.kycDocuments.frontImageUrl)}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </button>
              </div>
            </div>

            {/* Back ID */}
            <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">ID Back</h5> {/* Changed text-gray-800 to text-gray-900 */}
              <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-32 flex items-center justify-center mb-3 overflow-hidden">
                <img 
                  src={personalCustomer.kycDocuments.backImageUrl} 
                  alt="ID Back"
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDocumentView(personalCustomer.kycDocuments.backImageUrl)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Eye size={14} className="mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleDocumentDownload(personalCustomer.kycDocuments.backImageUrl)}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </button>
              </div>
            </div>

            {/* Selfie */}
            <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Selfie with ID</h5> {/* Changed text-gray-800 to text-gray-900 */}
              <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-32 flex items-center justify-center mb-3 overflow-hidden">
                <img 
                  src={personalCustomer.kycDocuments.selfieUrl} 
                  alt="Selfie with ID"
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const placeholder = target.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-full items-center justify-center">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDocumentView(personalCustomer.kycDocuments.selfieUrl)}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Eye size={14} className="mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleDocumentDownload(personalCustomer.kycDocuments.selfieUrl)}
                  className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
                >
                  <Download size={14} className="mr-1" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Business Account Documents */
        <div className="space-y-6">
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6"> {/* Changed text-gray-800 to text-gray-900 */}
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
              <FileText className="mr-2 text-green-500" size={20} />
              Business Documents
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Certificate of Incorporation */}
              <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4"> {/* Changed text-gray-800 to text-gray-900 */}
                <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Certificate of Incorporation</h5>
                <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-32 flex items-center justify-center mb-3">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDocumentView(businessCustomer.kycDocuments.certificateOfIncorporation)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDocumentDownload(businessCustomer.kycDocuments.certificateOfIncorporation)}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>

              {/* Tax Registration Certificate */}
              <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4"> {/* Changed text-gray-800 to text-gray-900 */}
                <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Tax Registration Certificate</h5>
                <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-32 flex items-center justify-center mb-3">
                  <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDocumentView(businessCustomer.kycDocuments.taxRegistrationCertificate)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDocumentDownload(businessCustomer.kycDocuments.taxRegistrationCertificate)}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Director's ID Documents */}
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6"> {/* Changed text-gray-800 to text-gray-900 */}
            <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Director's/Representative's ID
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Director ID Front */}
              <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">ID Front</h5> {/* Changed text-gray-800 to text-gray-900 */}
                <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-32 flex items-center justify-center mb-3 overflow-hidden">
                  <img 
                    src={businessCustomer.kycDocuments.directorId.frontImageUrl} 
                    alt="Director ID Front"
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDocumentView(businessCustomer.kycDocuments.directorId.frontImageUrl)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDocumentDownload(businessCustomer.kycDocuments.directorId.frontImageUrl)}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>

              {/* Director ID Back */}
              <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4"> {/* Changed text-gray-800 to text-gray-900 */}
                <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">ID Back</h5>
                <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-32 flex items-center justify-center mb-3 overflow-hidden">
                  <img 
                    src={businessCustomer.kycDocuments.directorId.backImageUrl} 
                    alt="Director ID Back"
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDocumentView(businessCustomer.kycDocuments.directorId.backImageUrl)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDocumentDownload(businessCustomer.kycDocuments.directorId.backImageUrl)}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>

              {/* Director Selfie */}
              <div className="border border-gray-200 dark:border-dark-600 rounded-lg p-4"> {/* Changed text-gray-800 to text-gray-900 */}
                <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Selfie with ID</h5>
                <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-32 flex items-center justify-center mb-3 overflow-hidden">
                  <img 
                    src={businessCustomer.kycDocuments.directorId.selfieUrl} 
                    alt="Director Selfie with ID"
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const placeholder = target.nextElementSibling as HTMLElement;
                      if (placeholder) placeholder.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDocumentView(businessCustomer.kycDocuments.directorId.selfieUrl)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Eye size={14} className="mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleDocumentDownload(businessCustomer.kycDocuments.directorId.selfieUrl)}
                    className="flex-1 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm"
                  >
                    <Download size={14} className="mr-1" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Audit Trail */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center"> {/* Changed text-gray-800 to text-gray-900 */}
          <Calendar className="mr-2 text-indigo-500" size={20} />
          KYC Audit Trail
        </h4>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-900 dark:text-dark-100">Documents Submitted</span>
              <span className="text-sm text-gray-500 dark:text-dark-400"> {/* Changed text-gray-800 to text-gray-900 */}
                {formatDate(customer.kycDocuments.submissionDate)}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-dark-400">
              All required KYC documents have been submitted for review.
            </p>
          </div>

          {customer.kycDocuments.reviewDate && (
            <div className={`border-l-4 pl-4 ${
              customer.kycStatus === KYCStatus.VERIFIED ? 'border-green-500' : 
              customer.kycStatus === KYCStatus.REJECTED ? 'border-red-500' : 'border-yellow-500'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-dark-100"> {/* Changed text-gray-800 to text-gray-900 */}
                  Documents {customer.kycStatus === KYCStatus.VERIFIED ? 'Approved' : 
                           customer.kycStatus === KYCStatus.REJECTED ? 'Rejected' : 'Under Review'}
                </span>
                <span className="text-sm text-gray-500 dark:text-dark-400">
                  {formatDate(customer.kycDocuments.reviewDate)}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-dark-400">
                {customer.kycStatus === KYCStatus.VERIFIED ? 
                  'KYC verification completed successfully.' :
                  customer.kycStatus === KYCStatus.REJECTED ?
                  'KYC documents were rejected. Customer may need to resubmit.' :
                  'KYC documents are currently under review.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* KYC Document Viewer Modal */}
      {selectedDocumentData && (
        <KYCDocumentViewerModal
          isOpen={showDocumentViewer}
          onClose={() => setShowDocumentViewer(false)}
          documentUrl={selectedDocumentData.url}
          documentType={selectedDocumentData.type}
          idType={selectedDocumentData.idType}
          idNumber={selectedDocumentData.idNumber}
          customerName={
            customerType === 'personal' 
              ? `${(customer as PersonalAccount).firstName} ${(customer as PersonalAccount).lastName}`
              : (customer as BusinessAccount).businessName
          }
          submissionDate={customer.kycDocuments.submissionDate}
        />
      )}
    </div>
  );
};

export default KycComplianceTab;