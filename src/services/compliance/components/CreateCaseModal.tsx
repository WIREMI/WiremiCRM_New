import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertTriangle, User, Calendar, Flag } from 'lucide-react';
import { ComplianceCaseType, Priority } from '../../../types';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: () => void;
}

const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated
}) => {
  const [formData, setFormData] = useState({
    customerId: '',
    type: '',
    subject: '',
    description: '',
    priority: Priority.MEDIUM,
    assignedTo: '',
    riskScore: '',
    dueDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const caseTypes = [
    { value: ComplianceCaseType.AML_SUSPICIOUS_ACTIVITY, label: 'AML Suspicious Activity' },
    { value: ComplianceCaseType.KYC_NON_COMPLIANCE, label: 'KYC Non-Compliance' },
    { value: ComplianceCaseType.SANCTIONS_SCREENING, label: 'Sanctions Screening' },
    { value: ComplianceCaseType.PEP_MATCH, label: 'PEP Match' },
    { value: ComplianceCaseType.FRAUD_RELATED, label: 'Fraud Related' },
    { value: ComplianceCaseType.TRANSACTION_MONITORING, label: 'Transaction Monitoring' },
    { value: ComplianceCaseType.CUSTOMER_DUE_DILIGENCE, label: 'Customer Due Diligence' },
    { value: ComplianceCaseType.ENHANCED_DUE_DILIGENCE, label: 'Enhanced Due Diligence' },
    { value: ComplianceCaseType.OTHER, label: 'Other' }
  ];

  const complianceOfficers = [
    { id: 'officer-1', name: 'John Smith' },
    { id: 'officer-2', name: 'Sarah Johnson' },
    { id: 'officer-3', name: 'Mike Wilson' },
    { id: 'officer-4', name: 'Lisa Chen' },
    { id: 'officer-5', name: 'David Brown' }
  ];

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!formData.customerId.trim()) {
      newErrors.push('Customer ID is required');
    }

    if (!formData.type) {
      newErrors.push('Case type is required');
    }

    if (!formData.subject.trim()) {
      newErrors.push('Subject is required');
    } else if (formData.subject.length < 5) {
      newErrors.push('Subject must be at least 5 characters');
    } else if (formData.subject.length > 500) {
      newErrors.push('Subject must be less than 500 characters');
    }

    if (!formData.description.trim()) {
      newErrors.push('Description is required');
    } else if (formData.description.length < 10) {
      newErrors.push('Description must be at least 10 characters');
    } else if (formData.description.length > 5000) {
      newErrors.push('Description must be less than 5000 characters');
    }

    if (formData.riskScore && (isNaN(Number(formData.riskScore)) || Number(formData.riskScore) < 0 || Number(formData.riskScore) > 100)) {
      newErrors.push('Risk score must be a number between 0 and 100');
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.push('Due date cannot be in the past');
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors([]); // Clear errors when user starts typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/compliance/cases', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     riskScore: formData.riskScore ? parseInt(formData.riskScore) : undefined
      //   })
      // });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Creating compliance case:', formData);
      onCaseCreated();
    } catch (error) {
      console.error('Failed to create compliance case:', error);
      setErrors(['Failed to create compliance case. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      type: '',
      subject: '',
      description: '',
      priority: Priority.MEDIUM,
      assignedTo: '',
      riskScore: '',
      dueDate: ''
    });
    setErrors([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900 dark:text-dark-100 flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                    <span>Create Compliance Case</span>
                  </div>
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300">
                    <X size={20} />
                  </button>
                </Dialog.Title>

                {errors.length > 0 && (
                  <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-200 mb-2">Please fix the following errors:</h4>
                    <ul className="text-sm text-red-700 dark:text-red-300 list-disc list-inside">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Customer ID *
                        </label>
                        <input
                          type="text"
                          value={formData.customerId}
                          onChange={(e) => handleInputChange('customerId', e.target.value)}
                          placeholder="Enter Wiremi ID (e.g., WRM001234)"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Case Type *
                        </label>
                        <select
                          value={formData.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        >
                          <option value="">Select case type...</option>
                          {caseTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Priority *
                        </label>
                        <select
                          value={formData.priority}
                          onChange={(e) => handleInputChange('priority', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        >
                          <option value={Priority.LOW}>Low</option>
                          <option value={Priority.MEDIUM}>Medium</option>
                          <option value={Priority.HIGH}>High</option>
                          <option value={Priority.CRITICAL}>Critical</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Assign To
                        </label>
                        <select
                          value={formData.assignedTo}
                          onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        >
                          <option value="">Unassigned</option>
                          {complianceOfficers.map(officer => (
                            <option key={officer.id} value={officer.id}>
                              {officer.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Risk Score (0-100)
                        </label>
                        <input
                          type="number"
                          value={formData.riskScore}
                          onChange={(e) => handleInputChange('riskScore', e.target.value)}
                          min="0"
                          max="100"
                          placeholder="Enter risk score"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Due Date
                        </label>
                        <input
                          type="date"
                          value={formData.dueDate}
                          onChange={(e) => handleInputChange('dueDate', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                          Subject *
                        </label>
                        <input
                          type="text"
                          value={formData.subject}
                          onChange={(e) => handleInputChange('subject', e.target.value)}
                          placeholder="Brief description of the issue"
                          maxLength={500}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
                        />
                        <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                          {formData.subject.length}/500 characters
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      placeholder="Detailed description of the compliance issue, including relevant facts, timeline, and any supporting evidence..."
                      maxLength={5000}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 resize-none"
                    />
                    <p className="text-xs text-gray-500 dark:text-dark-400 mt-1">
                      {formData.description.length}/5000 characters
                    </p>
                  </div>

                  {/* Preview Section */}
                  {formData.customerId && formData.type && formData.subject && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Case Preview</h4>
                      <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <div>Customer: {formData.customerId}</div>
                        <div>Type: {caseTypes.find(t => t.value === formData.type)?.label}</div>
                        <div>Priority: {formData.priority}</div>
                        <div>Subject: {formData.subject}</div>
                        {formData.assignedTo && (
                          <div>Assigned to: {complianceOfficers.find(o => o.id === formData.assignedTo)?.name}</div>
                        )}
                        {formData.dueDate && (
                          <div>Due: {new Date(formData.dueDate).toLocaleDateString()}</div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-dark-700">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.customerId || !formData.type || !formData.subject || !formData.description}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <AlertTriangle size={16} className="mr-2" />
                          Create Case
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateCaseModal;