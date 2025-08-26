import React, { useState, useEffect } from 'react';
import { X, User, Building, Mail, Phone, MapPin, Calendar, Lock, Repeat, Users } from 'lucide-react';
import { PersonalAccount, BusinessAccount, AccountStatus, BusinessAccountStatus, CustomerTier } from '../../../../types';

interface EditCustomerModalProps {
  customer: PersonalAccount | BusinessAccount;
  customerType: 'personal' | 'business';
  onSave: (updatedData: any) => void;
  onClose: () => void;
}

const EditCustomerModal: React.FC<EditCustomerModalProps> = ({
  customer,
  customerType,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false); // State for loading during save
  const [activeSection, setActiveSection] = useState('basic');

  useEffect(() => {
    // Initialize form data based on customer type
    if (customerType === 'personal') {
      const personalCustomer = customer as PersonalAccount;
      setFormData({
        firstName: personalCustomer.firstName,
        lastName: personalCustomer.lastName,
        email: personalCustomer.email,
        phone: personalCustomer.phone,
        country: personalCustomer.country,
        region: personalCustomer.region,
        city: personalCustomer.city,
        postalCode: personalCustomer.postalCode,
        dateOfBirth: personalCustomer.dateOfBirth,
        accountStatus: personalCustomer.accountStatus,
        userTier: personalCustomer.userTier,
        accountPin: personalCustomer.accountPin,
        transactionPin: personalCustomer.transactionPin,
        transactionPinLastChanged: personalCustomer.transactionPinLastChanged,
      });
    } else {
      const businessCustomer = customer as BusinessAccount;
      setFormData({
        businessName: businessCustomer.businessName,
        businessRegistrationNumber: businessCustomer.businessRegistrationNumber,
        businessType: businessCustomer.businessType,
        primaryContactName: businessCustomer.primaryContact.name,
        primaryContactEmail: businessCustomer.primaryContact.email,
        primaryContactPhone: businessCustomer.primaryContact.phone,
        country: businessCustomer.country,
        region: businessCustomer.region,
        city: businessCustomer.city,
        postalCode: businessCustomer.postalCode,
        accountStatus: businessCustomer.accountStatus,
        userTier: businessCustomer.userTier,
        accountPin: businessCustomer.accountPin,
        transactionPin: businessCustomer.transactionPin,
        transactionPinLastChanged: businessCustomer.transactionPinLastChanged,
      });
    }
  }, [customer, customerType]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // TODO: Add validation
      await onSave(formData);
    } catch (error) {
      console.error('Failed to save customer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'location', label: 'Location', icon: MapPin }, // Changed icon from Calendar to MapPin
    { id: 'account', label: 'Account', icon: Building }
  ];

  const renderPersonalForm = () => (
    <div className="space-y-6">
      {activeSection === 'basic' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-dark-100">Basic Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.dateOfBirth || ''}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            />
          </div>
        </div>
      )}

      {activeSection === 'contact' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-dark-100">Contact Information</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            />
          </div>
        </div>
      )}

      {activeSection === 'location' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-dark-100">Location Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Region/State
              </label>
              <input
                type="text"
                value={formData.region || ''}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode || ''}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === 'account' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-dark-100">Account Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Account Status
              </label>
              <select
                value={formData.accountStatus || ''}
                onChange={(e) => handleInputChange('accountStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value={AccountStatus.ACTIVE}>Active</option>
                <option value={AccountStatus.SUSPENDED}>Suspended</option>
                <option value={AccountStatus.DORMANT}>Dormant</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                User Tier
              </label>
              <select
                value={formData.userTier || ''}
                onChange={(e) => handleInputChange('userTier', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value={CustomerTier.BRONZE}>Bronze</option>
                <option value={CustomerTier.SILVER}>Silver</option>
                <option value={CustomerTier.GOLD}>Gold</option>
                <option value={CustomerTier.PLATINUM}>Platinum</option>
              </select>
            </div>
          </div>
          <h4 className="font-medium text-gray-900 dark:text-dark-100 mt-6">Security Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Account PIN
              </label>
              <div className="relative">
                <input
                  type="password" // Always masked
                  value={formData.accountPin || ''}
                  onChange={(e) => handleInputChange('accountPin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  readOnly // PINs are usually not editable directly here
                />
                <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Transaction PIN
              </label>
              <div className="relative">
                <input
                  type="password" // Always masked
                  value={formData.transactionPin || ''}
                  onChange={(e) => handleInputChange('transactionPin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  readOnly // PINs are usually not editable directly here
                />
                <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Transaction PIN Last Changed
              </label>
              <input
                type="datetime-local"
                value={formData.transactionPinLastChanged ? new Date(formData.transactionPinLastChanged).toISOString().slice(0, 16) : ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderBusinessForm = () => (
    <div className="space-y-6">
      {activeSection === 'basic' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-dark-100">Business Information</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={formData.businessName || ''}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Registration Number
              </label>
              <input
                type="text"
                value={formData.businessRegistrationNumber || ''}
                onChange={(e) => handleInputChange('businessRegistrationNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Business Type
              </label>
              <select
                value={formData.businessType || ''}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value="MERCHANT">Merchant</option>
                <option value="SCHOOL">School</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeSection === 'contact' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-dark-100">Primary Contact</h4>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Contact Name
            </label>
            <input
              type="text"
              value={formData.primaryContactName || ''}
              onChange={(e) => handleInputChange('primaryContactName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.primaryContactEmail || ''}
              onChange={(e) => handleInputChange('primaryContactEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={formData.primaryContactPhone || ''}
              onChange={(e) => handleInputChange('primaryContactPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            />
          </div>
        </div>
      )}

      {activeSection === 'location' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-dark-100">Business Address</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Region/State
              </label>
              <input
                type="text"
                value={formData.region || ''}
                onChange={(e) => handleInputChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode || ''}
                onChange={(e) => handleInputChange('postalCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>
        </div>
      )}

      {activeSection === 'account' && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-dark-100">Account Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Account Status
              </label>
              <select
                value={formData.accountStatus || ''}
                onChange={(e) => handleInputChange('accountStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value={BusinessAccountStatus.ACTIVE}>Active</option>
                <option value={BusinessAccountStatus.SUSPENDED}>Suspended</option>
                <option value={BusinessAccountStatus.PENDING_VERIFICATION}>Pending Verification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                User Tier
              </label>
              <select
                value={formData.userTier || ''}
                onChange={(e) => handleInputChange('userTier', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              >
                <option value={CustomerTier.BRONZE}>Bronze</option>
                <option value={CustomerTier.SILVER}>Silver</option>
                <option value={CustomerTier.GOLD}>Gold</option>
                <option value={CustomerTier.PLATINUM}>Platinum</option>
              </select>
            </div>
          </div>
          <h4 className="font-medium text-gray-900 dark:text-dark-100 mt-6">Security Information</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Account PIN
              </label>
              <div className="relative">
                <input
                  type="password" // Always masked
                  value={formData.accountPin || ''}
                  onChange={(e) => handleInputChange('accountPin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  readOnly
                />
                <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Transaction PIN
              </label>
              <div className="relative">
                <input
                  type="password" // Always masked
                  value={formData.transactionPin || ''}
                  onChange={(e) => handleInputChange('transactionPin', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                  readOnly
                />
                <Lock size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                Transaction PIN Last Changed
              </label>
              <input
                type="datetime-local"
                value={formData.transactionPinLastChanged ? new Date(formData.transactionPinLastChanged).toISOString().slice(0, 16) : ''}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-100 dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
            Edit {customerType === 'personal' ? 'Personal' : 'Business'} Account
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-dark-700 p-4 border-r border-gray-200 dark:border-dark-600">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 dark:text-dark-300 hover:bg-gray-100 dark:hover:bg-dark-600'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {customerType === 'personal' ? renderPersonalForm() : renderBusinessForm()}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCustomerModal;