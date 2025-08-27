import React from 'react';
import { Building, MapPin, Phone, Mail, User, Shield, Calendar, Smartphone, CheckCircle, XCircle, AlertTriangle, Lock, RefreshCw, FileText, CreditCard, Star, TrendingUp, DollarSign, Users, Globe, Award } from 'lucide-react';
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

  const handleResetDeviceId = async () => {
    if (window.confirm('Are you sure you want to reset the device ID for this business account? This will require the user to re-authenticate on all devices.')) {
      try {
        // TODO: Call API to reset device ID
        console.log('Resetting device ID for business account:', customer.id);
        alert('Device ID has been reset successfully. The user will need to re-authenticate on all devices.');
      } catch (error) {
        console.error('Failed to reset device ID:', error);
        alert('Failed to reset device ID. Please try again.');
      }
    }
  };

  const getTierBadge = (tier: CustomerTier) => {
    const colors = {
      [CustomerTier.BRONZE]: 'bg-orange-100 text-orange-800',
      [CustomerTier.SILVER]: 'bg-gray-100 text-gray-800',
      [CustomerTier.GOLD]: 'bg-yellow-100 text-yellow-800',
      [CustomerTier.PLATINUM]: 'bg-purple-100 text-purple-800'
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  const getAccountStatusBadge = (status: BusinessAccountStatus) => {
    const colors = {
      [BusinessAccountStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [BusinessAccountStatus.SUSPENDED]: 'bg-red-100 text-red-800',
      [BusinessAccountStatus.PENDING_VERIFICATION]: 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

      {/* Business Account Status & Tier */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Account Status</p>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getAccountStatusBadge(customer.accountStatus)}`}>
                {customer.accountStatus}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <Shield size={24} className="text-green-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Business Tier</p>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTierBadge(customer.userTier)}`}>
                {customer.userTier}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Award size={24} className="text-purple-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Risk Score</p>
              <p className={`text-2xl font-bold ${getRiskScoreColor(customer.riskScore)}`}>
                {customer.riskScore}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-dark-400">Credit Score</p>
              <p className={`text-2xl font-bold ${
                customer.creditScore >= 800 ? 'text-green-600' :
                customer.creditScore >= 700 ? 'text-blue-600' :
                customer.creditScore >= 600 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {customer.creditScore}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <TrendingUp size={24} className="text-blue-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Device & Security Management */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <Smartphone className="mr-2 text-cyan-500" size={20} />
          Device & Security Management
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Device ID:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100 font-mono">
                {customer.lastLogin.deviceInfo.replace(/[^a-zA-Z0-9]/g, '').substring(0, 12)}...
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Last Login Device:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.lastLogin.deviceInfo}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Last Login IP:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.lastLogin.ipAddress}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">User Agent:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100 text-xs truncate max-w-xs">
                {customer.lastLogin.userAgent}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h5 className="font-medium text-red-900 dark:text-red-100 mb-2 flex items-center">
                <Shield className="mr-2" size={16} />
                Security Actions
              </h5>
              <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                Reset device ID to force re-authentication on all devices. Use this if you suspect unauthorized access.
              </p>
              <button
                onClick={handleResetDeviceId}
                className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
              >
                <RefreshCw size={16} className="mr-2" />
                Reset Device ID
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Business Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Account Created:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{formatDate(customer.accountCreationDate)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
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
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Role:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">Primary Contact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Business Owner Details */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <User className="mr-2 text-orange-500" size={20} />
          Business Owner / Director Information
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Personal Details</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-400">Full Name:</span>
                <span className="font-medium text-gray-900 dark:text-dark-100">
                  {customer.businessOwner?.firstName} {customer.businessOwner?.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-400">Date of Birth:</span>
                <span className="font-medium text-gray-900 dark:text-dark-100">
                  {customer.businessOwner?.dateOfBirth ? formatDate(customer.businessOwner.dateOfBirth) : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-400">Nationality:</span>
                <span className="font-medium text-gray-900 dark:text-dark-100">
                  {customer.businessOwner?.nationality || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Contact Information</h5>
            <div className="space-y-2">
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
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Business Role</h5>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-dark-400">Is Director:</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  customer.businessOwner?.isDirector ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {customer.businessOwner?.isDirector ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-dark-400">Shareholding:</span>
                <span className="font-medium text-gray-900 dark:text-dark-100">
                  {customer.businessOwner?.shareholdingPercentage || 0}%
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
            </div>
          </div>
        </div>
      </div>

      {/* Business Address */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
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
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-600">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-dark-400">Referral Code:</span>
            <span className="font-medium text-gray-900 dark:text-dark-100">
              {customer.referralCode || 'None'}
            </span>
          </div>
        </div>
      </div>

      {/* Business Documents & Compliance */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <FileText className="mr-2 text-green-500" size={20} />
          Business Documents & Compliance
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Certificate of Incorporation</h5>
            <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-24 flex items-center justify-center mb-3">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500 dark:text-dark-500">
              Status: {customer.kycStatus === 'VERIFIED' ? 'Verified' : 'Pending Review'}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Tax Registration</h5>
            <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-24 flex items-center justify-center mb-3">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500 dark:text-dark-500">
              Status: {customer.kycStatus === 'VERIFIED' ? 'Verified' : 'Pending Review'}
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Director's ID</h5>
            <div className="bg-gray-100 dark:bg-dark-600 rounded-lg h-24 flex items-center justify-center mb-3">
              <User className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-xs text-gray-500 dark:text-dark-500">
              Status: {customer.businessOwner?.kycStatus || 'Pending Review'}
            </div>
          </div>
        </div>
      </div>

      {/* Business Financial Overview */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <CreditCard className="mr-2 text-blue-500" size={20} />
          Financial Overview
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              ${(customer.cashBalance / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600 dark:text-dark-400">Cash Balance</div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              ${(customer.savingsBalance / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600 dark:text-dark-400">Business Savings</div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              ${(customer.investmentBalance / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-600 dark:text-dark-400">Investments</div>
          </div>
          <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {customer.wallets?.length || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-dark-400">Currency Wallets</div>
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
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-dark-100">••••••••</span>
                <Lock size={16} className="text-gray-400" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-dark-400">Transaction PIN:</span>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-dark-100">••••••••</span>
                <Lock size={16} className="text-gray-400" />
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
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {formatDateTime(customer.lastLogin.timestamp)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Last Login Device:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.lastLogin.deviceInfo}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Currency Wallets */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
          <Globe className="mr-2 text-cyan-500" size={20} />
          Multi-Currency Wallets
        </h4>
        
        {customer.wallets && customer.wallets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {customer.wallets.map((wallet) => (
              <div key={wallet.id} className="border border-gray-200 dark:border-dark-600 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                      wallet.isBaseCurrency ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-gray-400 to-gray-600'
                    }`}>
                      {wallet.currency.substring(0, 2)}
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-dark-100">{wallet.currency}</span>
                    {wallet.isBaseCurrency && (
                      <Star size={16} className="text-yellow-500" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-dark-400">
                    {wallet.currency === 'XAF' ? 'Central African CFA' : 
                     wallet.currency === 'GBP' ? 'British Pound' :
                     wallet.currency === 'EUR' ? 'Euro' :
                     wallet.currency === 'USD' ? 'US Dollar' : wallet.currency}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="text-sm text-gray-600 dark:text-dark-400">Balance</div>
                  <div className="text-xl font-bold text-gray-900 dark:text-dark-100">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: wallet.currency,
                      minimumFractionDigits: 2
                    }).format(wallet.balance)}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 dark:text-dark-500">
                  <div>Wallet ID: {wallet.id}</div>
                  <div>Created: {formatDate(wallet.createdAt)}</div>
                  {wallet.lastTransactionAt && (
                    <div>Last Transaction: {formatDate(wallet.lastTransactionAt)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-dark-400">No wallets configured for this business account</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessOverviewTab;