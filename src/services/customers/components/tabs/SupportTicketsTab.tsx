import React, { useState, useEffect } from 'react';
import { HeadphonesIcon, Calendar, ExternalLink, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { SupportTicket, Priority, TicketStatus } from '../../../../types';

interface SupportTicketsTabProps {
  customerId: string;
}

const SupportTicketsTab: React.FC<SupportTicketsTabProps> = ({ customerId }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    priority: '',
    category: ''
  });

  useEffect(() => {
    loadSupportTickets();
  }, [customerId, filter]);

  const loadSupportTickets = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/customers/${customerId}/tickets?${new URLSearchParams(filter)}`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockTickets: SupportTicket[] = Array.from({ length: 8 }, (_, i) => ({
        id: `ticket-${i + 1}`,
        customerId,
        subject: [
          'Unable to complete transaction',
          'Account verification issue',
          'Password reset request',
          'Mobile app not working',
          'Suspicious activity alert',
          'Feature request',
          'Billing inquiry',
          'General support'
        ][i],
        priority: [Priority.HIGH, Priority.MEDIUM, Priority.LOW, Priority.CRITICAL][i % 4],
        status: [TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.RESOLVED, TicketStatus.CLOSED][i % 4],
        assignedTo: i % 3 === 0 ? `agent-${i + 1}` : undefined,
        createdAt: new Date(Date.now() - i * 86400000 * 2).toISOString(),
        category: [
          'Technical',
          'Account',
          'Security',
          'Billing',
          'General'
        ][i % 5]
      }));

      setTickets(mockTickets);
    } catch (error) {
      console.error('Failed to load support tickets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    const colors = {
      [Priority.LOW]: 'bg-blue-100 text-blue-800',
      [Priority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [Priority.HIGH]: 'bg-orange-100 text-orange-800',
      [Priority.CRITICAL]: 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: TicketStatus) => {
    const colors = {
      [TicketStatus.OPEN]: 'bg-red-100 text-red-800',
      [TicketStatus.IN_PROGRESS]: 'bg-yellow-100 text-yellow-800',
      [TicketStatus.RESOLVED]: 'bg-green-100 text-green-800',
      [TicketStatus.CLOSED]: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN:
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case TicketStatus.IN_PROGRESS:
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case TicketStatus.RESOLVED:
      case TicketStatus.CLOSED:
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewInSupport = () => {
    // TODO: Navigate to Support module with customer filter
    console.log('Navigate to Support module for customer:', customerId);
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-dark-100 flex items-center">
            <HeadphonesIcon className="mr-2 text-purple-500" size={20} />
            Support Tickets
          </h4>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            {tickets.length} tickets
          </span>
        </div>
        <button
          onClick={handleViewInSupport}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center text-sm"
        >
          <ExternalLink size={16} className="mr-2" />
          View in Support Module
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Status
            </label>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Priority
            </label>
            <select
              value={filter.priority}
              onChange={(e) => setFilter(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Category
            </label>
            <select
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Security">Security</option>
              <option value="Billing">Billing</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : tickets.length > 0 ? (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(ticket.status)}
                    <h5 className="text-lg font-medium text-gray-900 dark:text-dark-100">
                      {ticket.subject}
                    </h5>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-dark-400">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(ticket.createdAt)}
                    </div>
                    <div>
                      Category: {ticket.category}
                    </div>
                    {ticket.assignedTo && (
                      <div>
                        Assigned to: {ticket.assignedTo}
                      </div>
                    )}
                  </div>
                </div>
                
                <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HeadphonesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">No Support Tickets</h3>
          <p className="text-gray-500 dark:text-dark-400">
            This customer hasn't created any support tickets yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default SupportTicketsTab;