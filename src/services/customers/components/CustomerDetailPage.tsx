import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Building, Phone, Mail, MapPin, Shield, AlertTriangle, CheckCircle, XCircle, Edit, Bell, CreditCard } from 'lucide-react';
import { PersonalAccount, BusinessAccount, AccountStatus, BusinessAccountStatus, CustomerTier, KYCStatus } from '../../../types';
import PageHeader from '../../../components/Common/PageHeader';
import EditCustomerModal from './modals/EditCustomerModal';
import KYCDocumentViewerModal from './modals/KYCDocumentViewerModal';
// Tab components
import PersonalOverviewTab from './tabs/PersonalOverviewTab';
import BusinessOverviewTab from './tabs/BusinessOverviewTab';
import FinancialsTab from './tabs/FinancialsTab';
import KycComplianceTab from './tabs/KycComplianceTab';
import TransactionsTab from './tabs/TransactionsTab';
import SupportTicketsTab from './tabs/SupportTicketsTab';
import NotesFlagsTab from './tabs/NotesFlagsTab';

type CustomerType = 'personal' | 'business';

interface CustomerDetailPageProps {}

const CustomerDetailPage: React.FC<CustomerDetailPageProps> = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<PersonalAccount | BusinessAccount | null>(null);
  const [customerType, setCustomerType] = useState<CustomerType>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditModal, setShowEditModal] = useState(false); // State for EditCustomerModal
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadCustomerDetails(id);
    }
  }, [id]);

  const loadCustomerDetails = async (customerId: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/customers/${customerId}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockPersonalAccount: PersonalAccount = {
        id: customerId,
        wiremiId: `WRM${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        emailVerified: true,
        phone: '+1-555-0123',
        phoneVerified: true,
        country: 'United States',
        region: 'California',
        city: 'San Francisco',
        postalCode: '94102',
        dateOfBirth: '1990-05-15',
        accountPin: '****', // Encrypted/masked
        transactionPin: '****', // Encrypted/masked
        transactionPinLastChanged: '2024-01-15T10:30:00Z',
        referralCode: 'REF123456',
        kycStatus: KYCStatus.VERIFIED,
        kycDocuments: {
          idType: 'NATIONAL_ID' as any,
          idNumber: 'ID123456789',
          frontImageUrl: '/images/id-front.jpg',
          backImageUrl: '/images/id-back.jpg',
          selfieUrl: '/images/selfie.jpg',
          submissionDate: '2024-01-10T09:00:00Z',
          reviewDate: '2024-01-12T14:30:00Z'
        },
        accountStatus: AccountStatus.ACTIVE,
        userTier: CustomerTier.GOLD,
        accountCreationDate: '2024-01-01T00:00:00Z',
        lastLogin: {
          timestamp: '2024-01-20T15:45:00Z',
          deviceInfo: 'iPhone 13 Pro',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'
        },
        riskScore: 25,
        creditScore: 750,
        wallets: [
          {
            id: 'wallet-1',
            currency: 'CAD',
            balance: 15420.50,
            isBaseCurrency: true,
            createdAt: '2024-01-01T00:00:00Z',
            lastTransactionAt: '2024-01-20T14:30:00Z'
          },
          {
            id: 'wallet-2',
            currency: 'USD',
            balance: 8750.25,
            isBaseCurrency: false,
            createdAt: '2024-01-05T00:00:00Z',
            lastTransactionAt: '2024-01-19T16:45:00Z'
          },
          {
            id: 'wallet-3',
            currency: 'GBP',
            balance: 3200.75,
            isBaseCurrency: false,
            createdAt: '2024-01-10T00:00:00Z',
            lastTransactionAt: '2024-01-18T11:20:00Z'
          },
          {
            id: 'wallet-4',
            currency: 'EUR',
            balance: 5680.90,
            isBaseCurrency: false,
            createdAt: '2024-01-12T00:00:00Z',
            lastTransactionAt: '2024-01-17T09:15:00Z'
          },
          {
            id: 'wallet-5',
            currency: 'XAF',
            balance: 2500000.00,
            isBaseCurrency: false,
            createdAt: '2024-01-15T00:00:00Z',
            lastTransactionAt: '2024-01-16T13:30:00Z'
          }
        ],
        cashBalance: 25000.00,
        savingsBalance: 45000.00,
        investmentBalance: 75000.00,
        accruedInterest: 1250.75,
        profilePhotoUrl: '/images/profile.jpg',
        birthdayNotificationFlag: true
      };

      setCustomer(mockPersonalAccount);
      setCustomerType('personal'); // Default to personal for mock
    } catch (error) {
      console.error('Failed to load customer details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCustomer = () => {
    setShowEditModal(true);
  };

  const handleSendNotification = () => {
    setShowNotificationModal(true);
  };

  const handleOpenKYCReview = () => {
    setActiveTab('kyc');
  };

  const handleSaveCustomer = (updatedData: any) => {
    // TODO: Implement API call to update customer
    console.log('Saving customer data:', updatedData);
    setShowEditModal(false);
    // Reload customer data
    if (id) {
      loadCustomerDetails(id);
    }
  };

  const getStatusBadge = (status: AccountStatus | BusinessAccountStatus) => {
    const colors = {
      [AccountStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [AccountStatus.SUSPENDED]: 'bg-red-100 text-red-800',
      [AccountStatus.DORMANT]: 'bg-yellow-100 text-yellow-800',
      [BusinessAccountStatus.ACTIVE]: 'bg-green-100 text-green-800',
      [BusinessAccountStatus.SUSPENDED]: 'bg-red-100 text-red-800',
      [BusinessAccountStatus.PENDING_VERIFICATION]: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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

  const getKycStatusIcon = (status: KYCStatus) => {
    switch (status) {
      case KYCStatus.VERIFIED:
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case KYCStatus.REJECTED:
        return <XCircle className="w-5 h-5 text-red-500" />;
      case KYCStatus.PENDING:
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getVerificationIcon = (isVerified: boolean) => {
    return isVerified ? (
      <CheckCircle className="w-4 h-4 text-green-500 ml-1" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500 ml-1" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-400">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-dark-400">Customer not found</p>
          <button
            onClick={() => navigate('/customers')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Customers
          </button>
        </div>
      </div>
    );
  }

  const isPersonalAccount = customerType === 'personal';
  const personalCustomer = customer as PersonalAccount;
  const businessCustomer = customer as BusinessAccount;

  // Dynamic tab configuration based on customer type (simplified for now)
  const tabs = [
    { 
      id: 'overview', 
      label: isPersonalAccount ? 'Personal Overview' : 'Business Overview', 
      icon: isPersonalAccount ? User : Building 
    },
    { id: 'financials', label: 'Wallets & Financials', icon: CreditCard },
    { id: 'kyc', label: 'KYC & Compliance', icon: Shield },
    { id: 'transactions', label: 'Transactions', icon: Calendar },
    { id: 'tickets', label: 'Support Tickets', icon: AlertTriangle },
    { id: 'notes', label: 'Notes & Flags', icon: User }
  ];

  return (
    <div>
      <PageHeader 
        title={
          <div className="flex items-center">
            <button
              onClick={() => navigate('/customers')}
              className="mr-4 p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            Customer Profile
          </div>
        }
        subtitle={`Detailed view for ${isPersonalAccount ? personalCustomer.firstName + ' ' + personalCustomer.lastName : businessCustomer.businessName}`}
        actions={
          <div className="flex space-x-3">
            <button
              onClick={handleSendNotification}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Bell size={16} className="mr-2" />
              Send Notification
            </button>
            <button
              onClick={handleEditCustomer}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Edit size={16} className="mr-2" />
              Edit Details
            </button>
          </div>
        }
      />

      {/* Customer Header */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Profile Photo/Logo */}
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {isPersonalAccount ? (
                personalCustomer.profilePhotoUrl ? (
                  <img src={personalCustomer.profilePhotoUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  `${personalCustomer.firstName[0]}${personalCustomer.lastName[0]}`
                )
              ) : (
                businessCustomer.profileLogoUrl ? (
                  <img src={businessCustomer.profileLogoUrl} alt="Logo" className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <Building size={32} />
                )
              )}
            </div>

            {/* Customer Info */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                  {isPersonalAccount ? `${personalCustomer.firstName} ${personalCustomer.lastName}` : businessCustomer.businessName}
                </h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isPersonalAccount 
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                }`}>
                  {isPersonalAccount ? 'Personal Account' : 'Business Account'}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-dark-400">
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  {isPersonalAccount ? personalCustomer.wiremiId : businessCustomer.wiremiBusinessId}
                </div>
                <div className="flex items-center">
                  <Mail size={16} className="mr-1" />
                  {isPersonalAccount ? personalCustomer.email : businessCustomer.primaryContact.email}
                  {isPersonalAccount && personalCustomer.emailVerified !== undefined && getVerificationIcon(personalCustomer.emailVerified)}
                </div>
                <div className="flex items-center">
                  <Phone size={16} className="mr-1" />
                  {isPersonalAccount ? personalCustomer.phone : businessCustomer.primaryContact.phone}
                  {isPersonalAccount && getVerificationIcon(personalCustomer.phoneVerified)}
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {customer.country}
                </div>
              </div>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-col items-end space-y-2">
            {customer.kycStatus && <div className="flex items-center space-x-2">
              {getKycStatusIcon(customer.kycStatus)}
              <span className="text-sm font-medium">
                KYC {customer.kycStatus}
              </span>
            </div>}
            {customer.accountStatus && <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(customer.accountStatus)}`}>
              {customer.accountStatus}
            </div>}
            <>
              {customer.accountStatus && <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(customer.accountStatus)}`}>
                {customer.accountStatus}
              </span>}
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTierBadge(customer.userTier)}`}>
                {customer.userTier} Tier
              </span>
            </>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 mb-6">
        <div className="border-b border-gray-200 dark:border-dark-700">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-dark-400 dark:hover:text-dark-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[400px]">
          {activeTab === 'overview' && (
            isPersonalAccount ? (
              <PersonalOverviewTab customer={personalCustomer} />
            ) : (
              <BusinessOverviewTab customer={businessCustomer} />
            )
          )}
          {activeTab === 'financials' && (
            <FinancialsTab customer={customer} customerType={customerType} />
          )}
          {activeTab === 'kyc' && (
            <KycComplianceTab customer={customer} customerType={customerType} onOpenKYCReview={handleOpenKYCReview} />
          )}
          {activeTab === 'transactions' && (
            <TransactionsTab customerId={customer.id} />
          )}
          {activeTab === 'tickets' && (
            <SupportTicketsTab customerId={customer.id} />
          )}
          {activeTab === 'notes' && (
            <NotesFlagsTab customerId={customer.id} />
          )}
        </div>
      </div>

      {/* Edit Customer Modal */}
      {showEditModal && (
        <EditCustomerModal
          customer={customer}
          customerType={customerType}
          onSave={handleSaveCustomer}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Send Notification Modal */}
      {showNotificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Send Notification
            </h3>
            <textarea
              placeholder="Enter notification message..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
            />
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setShowNotificationModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Sending notification...');
                  setShowNotificationModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetailPage;