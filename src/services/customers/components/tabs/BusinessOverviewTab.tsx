import React from 'react';
import { Building, MapPin, Phone, Mail, User, Shield, Calendar, Smartphone, CheckCircle, XCircle, AlertTriangle, Lock } from 'lucide-react';
import { BusinessAccount, BusinessAccountStatus, CustomerTier } from '../../../../types';

interface BusinessOverviewTabProps {
  customer: BusinessAccount;
}

const BusinessOverviewTab: React.FC<BusinessOverviewTabProps> = ({ customer }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString?: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-blue-600';
    return 'text-green-600';
  };

  const getRiskScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-red-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-blue-100';
    return 'bg-green-100';
  };

  const getBusinessTypeBadge = (type: string) => {
    const colors = {
      MERCHANT: 'bg-blue-100 text-blue-800',
      SCHOOL: 'bg-green-100 text-green-800',
      OTHER: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getKycStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'REJECTED':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'PENDING':
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getKycStatusBadge = (status: string) => {
    const colors = {
      VERIFIED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      REQUIRES_REVIEW: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Account Type Header */}
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
        <div className="flex items-center">
          <Building className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Business Account Profile</h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">Corporate account with business banking services and compliance requirements</p>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <Building className="mr-2 text-blue-500" size={20} />
            Business Information
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Business ID:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.wiremiBusinessId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Business Name:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.businessName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Registration Number:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.businessRegistrationNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-dark-400">Business Type:</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBusinessTypeBadge(customer.businessType)}`}>
                {customer.businessType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Tax ID (TIN):</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.taxIdentificationNumber}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <User className="mr-2 text-purple-500" size={20} />
            Primary Contact
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Contact Name:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.primaryContact.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Email:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.primaryContact.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Phone:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.primaryContact.phone}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <User className="mr-2 text-orange-500" size={20} />
            Business Owner
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Owner Name:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.businessOwner?.firstName} {customer.businessOwner?.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Email:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.businessOwner?.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Phone:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.businessOwner?.phone}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-dark-400">KYC Status:</span>
              <div className="flex items-center space-x-2">
                {getKycStatusIcon(customer.businessOwner?.kycStatus || 'PENDING')}
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusBadge(customer.businessOwner?.kycStatus || 'PENDING')}`}>
                  {customer.businessOwner?.kycStatus || 'PENDING'}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Shareholding:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.businessOwner?.shareholdingPercentage || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KYB Status Overview */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center">
          <Shield className="mr-2 text-blue-600" size={20} />
          Know Your Business (KYB) Status
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h5 className="font-medium text-blue-900 dark:text-blue-100">Business Verification</h5>
            <div className="flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-300">Business Documents:</span>
              <div className="flex items-center space-x-2">
                {getKycStatusIcon(customer.kycStatus)}
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusBadge(customer.kycStatus)}`}>
                  {customer.kycStatus}
                </span>
              </div>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              • Certificate of Incorporation<br/>
              • Tax Registration Certificate<br/>
              • Business Registration Documents
            </div>
          </div>
          <div className="space-y-3">
            <h5 className="font-medium text-blue-900 dark:text-blue-100">Owner Verification</h5>
            <div className="flex items-center justify-between">
              <span className="text-blue-700 dark:text-blue-300">Owner Documents:</span>
              <div className="flex items-center space-x-2">
                {getKycStatusIcon(customer.businessOwner?.kycStatus || 'PENDING')}
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getKycStatusBadge(customer.businessOwner?.kycStatus || 'PENDING')}`}>
                  {customer.businessOwner?.kycStatus || 'PENDING'}
                </span>
              </div>
            </div>
            <div className="text-sm text-blue-600 dark:text-blue-400">
              • Director/Owner ID Documents<br/>
              • Proof of Address<br/>
              • Selfie with ID
            </div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-800/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>KYB Completion:</strong> Both business and owner verification must be completed for full account access.
            {customer.kycStatus === 'VERIFIED' && customer.businessOwner?.kycStatus === 'VERIFIED' ? (
              <span className="text-green-700 dark:text-green-300"> ✓ KYB Complete</span>
            ) : (
              <span className="text-yellow-700 dark:text-yellow-300"> ⚠ KYB Incomplete</span>
            )}
          </p>
        </div>
      </div>

      {/* Business Address */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <MapPin className="mr-2 text-green-500" size={20} />
          Business Address
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-dark-400">Street:</span>
            <span className="font-medium text-gray-900 dark:text-dark-100">{customer.businessAddress.street}</span>
          </div>
          {customer.businessAddress.suite && (
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Suite:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.businessAddress.suite}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-dark-400">City:</span>
            <span className="font-medium text-gray-900 dark:text-dark-100">{customer.businessAddress.city}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-dark-400">Region:</span>
            <span className="font-medium text-gray-900 dark:text-dark-100">{customer.businessAddress.region}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-dark-400">Postal Code:</span>
            <span className="font-medium text-gray-900 dark:text-dark-100">{customer.businessAddress.postalCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-dark-400">Country:</span>
            <span className="font-medium text-gray-900 dark:text-dark-100">{customer.businessAddress.country}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-dark-400">Referral Code:</span>
            <span className="font-medium text-gray-900 dark:text-dark-100">
              {customer.referralCode || 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Security Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <Shield className="mr-2 text-red-500" size={20} />
            Security Information
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-dark-400">Account PIN:</span>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-dark-100">••••••••</span>
                <Lock size={16} className="ml-2 text-gray-400" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-dark-400">Transaction PIN:</span>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-dark-100">••••••••</span>
                <Lock size={16} className="ml-2 text-gray-400" />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">PIN Last Changed:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.transactionPinLastChanged ? formatDate(customer.transactionPinLastChanged) : 'N/A'}
              </span>
            </div>


          </div>
        </div>

        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Risk Assessment
          </h4>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getRiskScoreBackground(customer.riskScore)} mb-3`}>
              <span className={`text-2xl font-bold ${getRiskScoreColor(customer.riskScore)}`}>
                {customer.riskScore}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-dark-400">
              Risk Score (0-100)
            </div>
            <div className={`text-sm font-medium mt-1 ${getRiskScoreColor(customer.riskScore)}`}>
              {customer.riskScore >= 80 ? 'High Risk' : 
               customer.riskScore >= 60 ? 'Medium Risk' : 
               customer.riskScore >= 40 ? 'Low-Medium Risk' : 'Low Risk'}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Credit Score
          </h4>
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${
              customer.creditScore >= 800 ? 'bg-green-100' :
              customer.creditScore >= 700 ? 'bg-blue-100' :
              customer.creditScore >= 600 ? 'bg-yellow-100' : 'bg-red-100'
            } mb-3`}>
              <span className={`text-2xl font-bold ${
                customer.creditScore >= 800 ? 'text-green-600' :
                customer.creditScore >= 700 ? 'text-blue-600' :
                customer.creditScore >= 600 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {customer.creditScore}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-dark-400">
              Credit Score (300-850)
            </div>
            <div className={`text-sm font-medium mt-1 ${
              customer.creditScore >= 800 ? 'text-green-600' :
              customer.creditScore >= 700 ? 'text-blue-600' :
              customer.creditScore >= 600 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {customer.creditScore >= 800 ? 'Excellent' :
               customer.creditScore >= 700 ? 'Good' :
               customer.creditScore >= 600 ? 'Fair' : 'Poor'}
            </div>
          </div>
        </div>
      </div>

      {/* Account Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <Calendar className="mr-2 text-indigo-500" size={20} />
            Account Timeline
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Account Created:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {formatDate(customer.accountCreationDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Last Login:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100"> {/* Changed text-gray-800 to text-gray-900 */}
                {formatDateTime(customer.lastLogin.timestamp)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <Smartphone className="mr-2 text-cyan-500" size={20} />
            Last Login Device
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Device:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.lastLogin.deviceInfo}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">IP Address:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.lastLogin.ipAddress}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessOverviewTab;