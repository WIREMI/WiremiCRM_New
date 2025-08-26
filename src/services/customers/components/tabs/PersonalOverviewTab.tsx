import React from 'react';
import { Calendar, MapPin, Phone, Mail, User, Shield, Clock, Smartphone, Lock } from 'lucide-react';
import { PersonalAccount, AccountStatus, CustomerTier } from '../../../../types';

interface PersonalOverviewTabProps {
  customer: PersonalAccount;
}

const PersonalOverviewTab: React.FC<PersonalOverviewTabProps> = ({ customer }) => {
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

  return (
    <div className="space-y-6">
      {/* Account Type Header */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center">
          <User className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Personal Account Profile</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">Individual customer account with personal banking services</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <User className="mr-2 text-blue-500" size={20} />
            Personal Information
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Wiremi ID:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.wiremiId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Full Name:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.firstName} {customer.lastName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Date of Birth:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {formatDate(customer.dateOfBirth)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Referral Code:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.referralCode || 'None'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <MapPin className="mr-2 text-green-500" size={20} />
            Location Information
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Country:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Region/State:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.region}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">City:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.city}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Postal Code:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">{customer.postalCode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <Mail className="mr-2 text-purple-500" size={20} />
            Contact Information
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-dark-400">Email Address:</span>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-dark-100 mr-2">{customer.email}</span>
                {customer.emailVerified ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verified</span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Unverified</span>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-dark-400">Phone Number:</span>
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-dark-100 mr-2">{customer.phone}</span>
                {customer.phoneVerified ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Verified</span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Unverified</span>
                )}
              </div>
            </div>
          </div>
        </div>

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
                {formatDate(customer.transactionPinLastChanged)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Status & Risk */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <Calendar className="mr-2 text-indigo-500" size={20} />
            Account Timeline
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-dark-400">Created:</span>
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
              <span className="text-gray-600 dark:text-dark-400">Device ID:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {customer.lastLogin.deviceInfo}
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

      {/* Additional Settings */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Preferences & Settings
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-dark-400">Birthday Notifications:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              customer.birthdayNotificationFlag 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {customer.birthdayNotificationFlag ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalOverviewTab;