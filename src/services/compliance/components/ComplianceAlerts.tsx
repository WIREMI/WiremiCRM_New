import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, XCircle, Clock, User, Filter } from 'lucide-react';
import { ComplianceAlert, AlertSeverity, AlertStatus } from '../../../types';

const ComplianceAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<ComplianceAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    alertType: '',
    severity: '',
    status: '',
    assignedTo: ''
  });

  useEffect(() => {
    loadComplianceAlerts();
  }, [filters]);

  const loadComplianceAlerts = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/v1/compliance/alerts?' + new URLSearchParams(filters));
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockAlerts: ComplianceAlert[] = Array.from({ length: 10 }, (_, i) => ({
        id: `alert-${i + 1}`,
        alertType: [
          'SUSPICIOUS_TRANSACTION',
          'HIGH_RISK_CUSTOMER',
          'SANCTIONS_MATCH',
          'PEP_DETECTED',
          'VELOCITY_CHECK',
          'LARGE_CASH_TRANSACTION'
        ][i % 6],
        severity: [AlertSeverity.LOW, AlertSeverity.MEDIUM, AlertSeverity.HIGH, AlertSeverity.CRITICAL][i % 4],
        customerId: `WRM${String(i + 1).padStart(6, '0')}`,
        transactionId: i % 2 === 0 ? `txn-${i + 1}` : undefined,
        subject: [
          'Suspicious transaction pattern detected',
          'Customer flagged as high risk',
          'Potential sanctions list match',
          'PEP status requires verification',
          'Unusual transaction velocity',
          'Large cash transaction reported'
        ][i % 6],
        description: 'Detailed description of the compliance alert...',
        status: [AlertStatus.TRIGGERED, AlertStatus.ACKNOWLEDGED, AlertStatus.RESOLVED][i % 3],
        assignedTo: i % 3 === 0 ? `officer-${i + 1}` : undefined,
        createdAt: new Date(Date.now() - i * 3600000).toISOString(),
        updatedAt: new Date().toISOString()
      }));

      setAlerts(mockAlerts);
    } catch (error) {
      console.error('Failed to load compliance alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityBadge = (severity: AlertSeverity) => {
    const colors = {
      [AlertSeverity.LOW]: 'bg-blue-100 text-blue-800',
      [AlertSeverity.MEDIUM]: 'bg-yellow-100 text-yellow-800',
      [AlertSeverity.HIGH]: 'bg-orange-100 text-orange-800',
      [AlertSeverity.CRITICAL]: 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: AlertStatus) => {
    const colors = {
      [AlertStatus.TRIGGERED]: 'bg-red-100 text-red-800',
      [AlertStatus.ACKNOWLEDGED]: 'bg-yellow-100 text-yellow-800',
      [AlertStatus.RESOLVED]: 'bg-green-100 text-green-800',
      [AlertStatus.SUPPRESSED]: 'bg-gray-100 text-gray-800',
      [AlertStatus.ESCALATED]: 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getAlertIcon = (alertType: string) => {
    switch (alertType) {
      case 'SUSPICIOUS_TRANSACTION':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'HIGH_RISK_CUSTOMER':
        return <User className="w-5 h-5 text-orange-500" />;
      case 'SANCTIONS_MATCH':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PEP_DETECTED':
        return <AlertTriangle className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAcknowledge = async (alertId: string) => {
    if (window.confirm('Are you sure you want to acknowledge this alert?')) {
      try {
        // TODO: Replace with actual API call
        console.log('Acknowledging alert:', alertId);
        loadComplianceAlerts();
      } catch (error) {
        console.error('Failed to acknowledge alert:', error);
      }
    }
  };

  const handleResolve = async (alertId: string) => {
    if (window.confirm('Are you sure you want to resolve this alert?')) {
      try {
        // TODO: Replace with actual API call
        console.log('Resolving alert:', alertId);
        loadComplianceAlerts();
      } catch (error) {
        console.error('Failed to resolve alert:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100">
          Compliance Alerts
        </h3>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Alert Type
            </label>
            <select
              value={filters.alertType}
              onChange={(e) => setFilters(prev => ({ ...prev, alertType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Types</option>
              <option value="SUSPICIOUS_TRANSACTION">Suspicious Transaction</option>
              <option value="HIGH_RISK_CUSTOMER">High Risk Customer</option>
              <option value="SANCTIONS_MATCH">Sanctions Match</option>
              <option value="PEP_DETECTED">PEP Detected</option>
              <option value="VELOCITY_CHECK">Velocity Check</option>
              <option value="LARGE_CASH_TRANSACTION">Large Cash Transaction</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Severity
            </label>
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Severities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Statuses</option>
              <option value="TRIGGERED">Triggered</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="RESOLVED">Resolved</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-300 mb-2">
              Assigned To
            </label>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-800 text-gray-900 dark:text-dark-100"
            >
              <option value="">All Officers</option>
              <option value="officer-1">John Smith</option>
              <option value="officer-2">Sarah Johnson</option>
              <option value="officer-3">Mike Wilson</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 dark:bg-dark-600 rounded-lg h-24"></div>
          ))
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.alertType)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-dark-100">
                        {alert.subject}
                      </h4>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityBadge(alert.severity)}`}>
                        {alert.severity}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-dark-400 mb-3">
                      {alert.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-dark-400">
                      <div className="flex items-center">
                        <User size={14} className="mr-1" />
                        Customer: {alert.customerId}
                      </div>
                      {alert.transactionId && (
                        <div>
                          Transaction: {alert.transactionId}
                        </div>
                      )}
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {formatDate(alert.createdAt)}
                      </div>
                      {alert.assignedTo && (
                        <div>
                          Assigned to: {alert.assignedTo}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  {alert.status === AlertStatus.TRIGGERED && (
                    <>
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Acknowledge
                      </button>
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Resolve
                      </button>
                    </>
                  )}
                  {alert.status === AlertStatus.ACKNOWLEDGED && (
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {alerts.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-dark-100 mb-2">No Compliance Alerts</h3>
          <p className="text-gray-500 dark:text-dark-400">
            No compliance alerts match the current filters.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComplianceAlerts;