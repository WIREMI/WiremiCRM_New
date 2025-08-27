import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar, ExternalLink, UserPlus, MessageSquare, MapPin, Clock } from 'lucide-react';
import { Lead, LeadStatus } from '../../../types';
import PageHeader from '../../../components/Common/PageHeader';

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);

  useEffect(() => {
    if (id) {
      loadLeadDetails(id);
    }
  }, [id]);

  const loadLeadDetails = async (leadId: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/leads/${leadId}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockLead: Lead = {
        id: leadId,
        contactInfo: {
          email: `lead${leadId.slice(-1)}@example.com`,
          phone: `+1-555-${Math.floor(Math.random() * 9000) + 1000}`
        },
        leadSource: ['Website Registration', 'Social Media', 'Referral', 'Cold Outreach', 'Marketing Campaign'][Math.floor(Math.random() * 5)],
        leadStatus: [LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.CONVERTED][Math.floor(Math.random() * 3)],
        createdAt: '2024-01-20T10:30:00Z', // Changed to ISO string
        updatedAt: '2024-01-21T14:15:00Z', // Added updatedAt
        lastContactedAt: '2024-01-21T14:15:00Z'
      };

      setLead(mockLead);
    } catch (error) {
      console.error('Failed to load lead details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    const colors = {
      [LeadStatus.NEW]: 'bg-blue-100 text-blue-800',
      [LeadStatus.CONTACTED]: 'bg-yellow-100 text-yellow-800',
      [LeadStatus.CONVERTED]: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleConvertLead = async () => {
    setIsConverting(true);
    try {
      // TODO: Implement lead conversion API call
      // const response = await fetch(`/api/leads/${id}/convert`, { method: 'POST' });
      
      // Simulate conversion process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Lead converted successfully');
      // Navigate to the new customer profile or show success message
    } catch (error) {
      console.error('Failed to convert lead:', error);
    } finally {
      setIsConverting(false);
    }
  };

  const handleUpdateStatus = async (newStatus: LeadStatus) => {
    try {
      // TODO: Implement status update API call
      // const response = await fetch(`/api/leads/${id}/status`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: newStatus })
      // });
      
      if (lead) {
        setLead({ ...lead, leadStatus: newStatus, lastContactedAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Failed to update lead status:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-400">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 dark:text-dark-400">Lead not found</p>
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
            Lead Profile
          </div>
        }
        subtitle="Incomplete registration - No Wiremi ID assigned"
        actions={
          <div className="flex space-x-3">
            <button
              onClick={handleConvertLead}
              disabled={isConverting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            >
              <UserPlus size={16} className="mr-2" />
              {isConverting ? 'Converting...' : 'Convert to Customer'}
            </button>
          </div>
        }
      />

      {/* Lead Header */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-6">
        {/* Lead Type Header */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <User className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100">Lead Profile</h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">Potential customer who has not completed the registration process</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Lead Avatar */}
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              <User size={32} />
            </div>

            {/* Lead Info */}
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-dark-100">
                  Potential Customer
                </h1>
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  Lead
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-dark-400">
                {lead.contactInfo.email && (
                  <div className="flex items-center">
                    <Mail size={16} className="mr-1" />
                    {lead.contactInfo.email}
                  </div>
                )}
                {lead.contactInfo.phone && (
                  <div className="flex items-center">
                    <Phone size={16} className="mr-1" />
                    {lead.contactInfo.phone}
                  </div>
                )}
                <div className="flex items-center">
                  <ExternalLink size={16} className="mr-1" />
                  {lead.leadSource}
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end space-y-2">
            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(lead.leadStatus)}`}>
              {lead.leadStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Lead Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Contact Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-dark-400">Email Address:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {lead.contactInfo.email || 'Not provided'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-dark-400">Phone Number:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {lead.contactInfo.phone || 'Not provided'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-dark-400">Lead Source:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {lead.leadSource}
              </span>
            </div>
          </div>
        </div>

        {/* Lead Source & Status */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Lead Information
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-dark-400">Lead Source:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {lead.leadSource}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-dark-400">Current Status:</span>
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadge(lead.leadStatus)}`}>
                {lead.leadStatus}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-dark-400">Lead ID:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {lead.id}
              </span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <Clock className="mr-2 text-indigo-500" size={20} />
            Timeline
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-dark-400">Created At:</span>
              <span className="font-medium text-gray-900 dark:text-dark-100">
                {new Date(lead.createdAt).toLocaleString()}
              </span>
            </div>
            {lead.lastContactedAt && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-dark-400">Last Contacted:</span>
                <span className="font-medium text-gray-900 dark:text-dark-100">
                  {new Date(lead.lastContactedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Lead Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleUpdateStatus(LeadStatus.CONTACTED)}
              disabled={lead.leadStatus === LeadStatus.CONTACTED}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark as Contacted
            </button>
            <button
              onClick={() => handleUpdateStatus(LeadStatus.NEW)}
              disabled={lead.leadStatus === LeadStatus.NEW}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset to New
            </button>
            <button
              onClick={handleConvertLead}
              disabled={isConverting}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            >
              <UserPlus size={16} className="mr-2" />
              {isConverting ? 'Converting...' : 'Convert to Customer'}
            </button>
          </div>
        </div>

        {/* Lead Activity/Conversation (Mock) */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <MessageSquare className="mr-2 text-blue-500" size={20} />
            Lead Activity & Notes
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-dark-100">Lead Created</span>
                <span className="text-sm text-gray-500 dark:text-dark-400">
                  {new Date(lead.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-dark-400">
                Lead generated from {lead.leadSource}.
              </p>
            </div>
            {lead.lastContactedAt && (
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900 dark:text-dark-100">Last Contacted</span>
                  <span className="text-sm text-gray-500 dark:text-dark-400">
                    {new Date(lead.lastContactedAt).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-dark-400">Status updated to 'Contacted'.</p>
              </div>
            )}
          </div>
        </div>

        {/* Lead Scoring & Qualification */}
        <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 lg:col-span-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4 flex items-center">
            <User className="mr-2 text-purple-500" size={20} />
            Lead Qualification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">Lead Score</h4>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {Math.floor(Math.random() * 100)}
                </div>
                <div className="text-sm text-gray-600 dark:text-dark-400">
                  Qualification Score
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">Engagement Level</h4>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 mb-1">
                  {['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]}
                </div>
                <div className="text-sm text-gray-600 dark:text-dark-400">
                  Based on interactions
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-2">Conversion Probability</h4>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600 mb-1">
                  {Math.floor(Math.random() * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-dark-400">
                  Likelihood to convert
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetailPage;