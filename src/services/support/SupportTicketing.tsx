import React, { useState, useEffect } from 'react';
import { HeadphonesIcon, Plus, Search, Filter, Clock, User, AlertTriangle, CheckCircle, XCircle, MessageSquare, Star, Calendar } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';

interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerId: string;
  customerName: string;
  subject: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  category: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  lastResponse?: string;
  responseTime?: number; // in minutes
  resolutionTime?: number; // in minutes
  tags: string[];
  attachments: string[];
}

interface SupportStats {
  totalTickets: number;
  openTickets: number;
  resolvedToday: number;
  averageResponseTime: string;
  customerSatisfaction: number;
  escalatedTickets: number;
}

const SupportTicketing: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [supportStats, setSupportStats] = useState<SupportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showCreateTicketModal, setShowCreateTicketModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    category: '',
    assignedTo: '',
    search: ''
  });

  useEffect(() => {
    loadSupportData();
  }, [filters]);

  const loadSupportData = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [ticketsResponse, statsResponse] = await Promise.all([
      //   fetch('/api/v1/support/tickets'),
      //   fetch('/api/v1/support/stats')
      // ]);
      
      // Mock data for demonstration
      const mockStats: SupportStats = {
        totalTickets: 1247,
        openTickets: 89,
        resolvedToday: 34,
        averageResponseTime: '2.3 hours',
        customerSatisfaction: 4.7,
        escalatedTickets: 12
      };

      const mockTickets: SupportTicket[] = Array.from({ length: 20 }, (_, i) => ({
        id: `ticket-${i + 1}`,
        ticketNumber: `SUP-${String(Date.now() + i).slice(-6)}`,
        customerId: `WRM${String(i + 1).padStart(6, '0')}`,
        customerName: [
          'John Smith', 'Sarah Wilson', 'Mike Johnson', 'Lisa Martinez', 'Tom Anderson',
          'Emma Davis', 'Alex Chen', 'Maria Garcia', 'David Brown', 'Jennifer Lee',
          'Robert Taylor', 'Amanda White', 'Chris Martin', 'Nicole Thompson', 'Kevin Clark',
          'Jessica Moore', 'Daniel Wilson', 'Rachel Green', 'Mark Thompson', 'Laura Davis'
        ][i],
        subject: [
          'Unable to complete transaction',
          'Account verification issue',
          'Password reset request',
          'Mobile app not working',
          'Suspicious activity alert',
          'Virtual card activation problem',
          'Savings goal not updating',
          'Transfer failed with error',
          'KYC document upload issue',
          'Billing inquiry about fees',
          'API integration support',
          'Account locked unexpectedly',
          'Currency conversion question',
          'Notification settings not working',
          'Export feature not functioning',
          'Two-factor authentication issue',
          'Investment portfolio question',
          'Loan application status',
          'Referral code not working',
          'General account inquiry'
        ][i],
        description: 'Detailed description of the customer issue...',
        priority: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'][i % 4] as any,
        status: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'][i % 4] as any,
        category: [
          'Technical', 'Account', 'Billing', 'Security', 'General',
          'API', 'Mobile App', 'Web Platform', 'Payments', 'KYC'
        ][i % 10],
        assignedTo: i % 3 === 0 ? ['agent-john', 'agent-sarah', 'agent-mike'][i % 3] : undefined,
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
        updatedAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
        lastResponse: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 3600000 * 24).toISOString() : undefined,
        responseTime: Math.floor(Math.random() * 480) + 30, // 30 minutes to 8 hours
        resolutionTime: Math.random() > 0.5 ? Math.floor(Math.random() * 2880) + 60 : undefined, // 1 hour to 2 days
        tags: ['urgent', 'customer-vip', 'technical-issue'].slice(0, Math.floor(Math.random() * 3) + 1),
        attachments: Math.random() > 0.7 ? ['screenshot.png', 'error-log.txt'] : []
      }));

      setSupportStats(mockStats);
      setTickets(mockTickets);
    } catch (error) {
      console.error('Failed to load support data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = () => {
    setShowCreateTicketModal(true);
  };

  const handleAssignTickets = () => {
    if (selectedTickets.length === 0) {
      alert('Please select tickets to assign.');
      return;
    }
    setShowAssignModal(true);
  };

  const handleTicketAction = (ticketId: string, action: string) => {
    console.log(`Performing action "${action}" on ticket:`, ticketId);
    
    switch (action) {
      case 'assign':
        const agent = prompt('Enter agent ID to assign:');
        if (agent) {
          setTickets(prev => prev.map(ticket =>
            ticket.id === ticketId ? { ...ticket, assignedTo: agent, status: 'IN_PROGRESS' as any } : ticket
          ));
        }
        break;
      case 'resolve':
        setTickets(prev => prev.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status: 'RESOLVED' as any, updatedAt: new Date().toISOString() } : ticket
        ));
        break;
      case 'close':
        setTickets(prev => prev.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status: 'CLOSED' as any, updatedAt: new Date().toISOString() } : ticket
        ));
        break;
      case 'escalate':
        alert(`Ticket ${ticketId} has been escalated to supervisor.`);
        break;
    }
  };

  const handleSelectTicket = (ticketId: string, isSelected: boolean) => {
    setSelectedTickets(prev =>
      isSelected ? [...prev, ticketId] : prev.filter(id => id !== ticketId)
    );
  };

  const handleSelectAll = (isSelected: boolean) => {
    setSelectedTickets(isSelected ? tickets.map(t => t.id) : []);
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      LOW: 'bg-blue-100 text-blue-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      HIGH: 'bg-orange-100 text-orange-800',
      CRITICAL: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      OPEN: 'bg-red-100 text-red-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'IN_PROGRESS':
        return <Clock size={16} className="text-yellow-500" />;
      case 'RESOLVED':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'CLOSED':
        return <XCircle size={16} className="text-gray-500" />;
      default:
        return <AlertTriangle size={16} className="text-gray-500" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else if (minutes < 1440) {
      return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
    } else {
      return `${Math.floor(minutes / 1440)}d ${Math.floor((minutes % 1440) / 60)}h`;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = !filters.search || 
      ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesStatus = !filters.status || ticket.status === filters.status;
    const matchesPriority = !filters.priority || ticket.priority === filters.priority;
    const matchesCategory = !filters.category || ticket.category === filters.category;
    const matchesAssignee = !filters.assignedTo || 
      (filters.assignedTo === 'unassigned' ? !ticket.assignedTo : ticket.assignedTo === filters.assignedTo);

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesAssignee;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-dark-400">Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Support & Ticketing" 
        subtitle="Manage customer support tickets, track resolution times, and ensure customer satisfaction"
        actions={
          <div className="flex space-x-3">
            {selectedTickets.length > 0 && (
              <button
                onClick={handleAssignTickets}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <User size={16} className="mr-2" />
                Assign ({selectedTickets.length})
              </button>
            )}
            <button
              onClick={handleCreateTicket}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Create Ticket
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      {supportStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <StatsCard
            title="Total Tickets"
            value={supportStats.totalTickets.toString()}
            change="+23 today"
            changeType="neutral"
            icon={HeadphonesIcon}
            iconColor="text-blue-500"
          />
          <StatsCard
            title="Open Tickets"
            value={supportStats.openTickets.toString()}
            change="+5 new"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="text-red-500"
          />
          <StatsCard
            title="Resolved Today"
            value={supportStats.resolvedToday.toString()}
            change="+12% vs yesterday"
            changeType="positive"
            icon={CheckCircle}
            iconColor="text-green-500"
          />
          <StatsCard
            title="Avg Response Time"
            value={supportStats.averageResponseTime}
            change="-30min improvement"
            changeType="positive"
            icon={Clock}
            iconColor="text-purple-500"
          />
          <StatsCard
            title="Customer Satisfaction"
            value={`${supportStats.customerSatisfaction}/5.0`}
            change="+0.2 this month"
            changeType="positive"
            icon={Star}
            iconColor="text-yellow-500"
          />
          <StatsCard
            title="Escalated Tickets"
            value={supportStats.escalatedTickets.toString()}
            change="-3 this week"
            changeType="positive"
            icon={AlertTriangle}
            iconColor="text-orange-500"
          />
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search tickets..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Priority</label>
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Categories</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="Billing">Billing</option>
              <option value="Security">Security</option>
              <option value="General">General</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">Assigned To</label>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Agents</option>
              <option value="agent-john">John Smith</option>
              <option value="agent-sarah">Sarah Wilson</option>
              <option value="agent-mike">Mike Johnson</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-700">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Ticket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-dark-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedTickets.includes(ticket.id)}
                      onChange={(e) => handleSelectTicket(ticket.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(ticket.status)}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                          {ticket.ticketNumber}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-dark-500">
                          {ticket.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                        {ticket.customerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-dark-500">
                        {ticket.customerId}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-dark-100 max-w-xs truncate">
                      {ticket.subject}
                    </div>
                    {ticket.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {ticket.tags.map((tag, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-100">
                      {ticket.assignedTo ? (
                        <div className="flex items-center">
                          <User size={14} className="mr-1 text-gray-400" />
                          {ticket.assignedTo}
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-dark-400">Unassigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-dark-100">
                      {ticket.responseTime ? formatDuration(ticket.responseTime) : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 dark:text-dark-400">
                      {formatTime(ticket.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <MessageSquare size={16} />
                      </button>
                      {ticket.status === 'OPEN' && (
                        <button
                          onClick={() => handleTicketAction(ticket.id, 'assign')}
                          className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                          title="Assign"
                        >
                          <User size={16} />
                        </button>
                      )}
                      {ticket.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleTicketAction(ticket.id, 'resolve')}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                          title="Resolve"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Create New Support Ticket
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Ticket creation form will be implemented here with fields for customer, subject, description, priority, and category.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateTicketModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateTicketModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Tickets Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
              Assign Tickets
            </h3>
            <p className="text-gray-600 dark:text-dark-400 mb-4">
              Assign {selectedTickets.length} selected tickets to an agent.
            </p>
            <select className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 text-gray-900 dark:text-dark-100 mb-4">
              <option value="">Select an agent...</option>
              <option value="agent-john">John Smith</option>
              <option value="agent-sarah">Sarah Wilson</option>
              <option value="agent-mike">Mike Johnson</option>
            </select>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedTickets([]);
                  alert('Tickets assigned successfully!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign Tickets
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
                Ticket Details: {selectedTicket.ticketNumber}
              </h3>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-dark-300"
              >
                <XCircle size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Ticket Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-dark-400">Customer:</span>
                    <span className="font-medium text-gray-900 dark:text-dark-100">{selectedTicket.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-dark-400">Subject:</span>
                    <span className="font-medium text-gray-900 dark:text-dark-100">{selectedTicket.subject}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-dark-400">Priority:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityBadge(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-dark-400">Status:</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedTicket.status)}`}>
                      {selectedTicket.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Timeline</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-dark-400">Created:</span>
                    <span className="font-medium text-gray-900 dark:text-dark-100">{formatTime(selectedTicket.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-dark-400">Last Updated:</span>
                    <span className="font-medium text-gray-900 dark:text-dark-100">{formatTime(selectedTicket.updatedAt)}</span>
                  </div>
                  {selectedTicket.responseTime && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-dark-400">Response Time:</span>
                      <span className="font-medium text-gray-900 dark:text-dark-100">{formatDuration(selectedTicket.responseTime)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-900 dark:text-dark-100 mb-3">Description</h4>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-dark-100">{selectedTicket.description}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => handleTicketAction(selectedTicket.id, 'assign')}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Assign
              </button>
              <button
                onClick={() => handleTicketAction(selectedTicket.id, 'resolve')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Resolve
              </button>
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-dark-300 hover:bg-gray-50 dark:hover:bg-dark-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTicketing;