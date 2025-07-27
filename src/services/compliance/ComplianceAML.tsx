import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, FileCheck, Users, Clock, CheckCircle, XCircle, Flag } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import CreateCaseModal from './components/CreateCaseModal';
import StatsCard from '../../components/Common/StatsCard';
import CaseManagement from './components/CaseManagement';
import KYCReviewQueue from './components/KYCReviewQueue';
import ComplianceAlerts from './components/ComplianceAlerts';
import ComplianceDashboard from './components/ComplianceDashboard';

const ComplianceAML: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showCreateCaseModal, setShowCreateCaseModal] = useState(false);
  const [stats, setStats] = useState({
    totalCases: 0,
    openCases: 0,
    highPriorityCases: 0,
    overdueReviews: 0,
    pendingKYC: 0,
    approvedToday: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadComplianceStats();
  }, []);

  const loadComplianceStats = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API calls
      // const [complianceResponse, kycResponse] = await Promise.all([
      //   fetch('/api/v1/compliance/stats'),
      //   fetch('/api/v1/compliance/kyc-stats')
      // ]);
      
      // Mock data for demonstration
      setStats({
        totalCases: 156,
        openCases: 23,
        highPriorityCases: 8,
        overdueReviews: 5,
        pendingKYC: 34,
        approvedToday: 12
      });
    } catch (error) {
      console.error('Failed to load compliance stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'cases', label: 'Case Management', icon: AlertTriangle },
    { id: 'kyc', label: 'KYC Review Queue', icon: FileCheck },
    { id: 'alerts', label: 'Compliance Alerts', icon: Flag }
  ];

  const handleCreateCase = () => {
    setShowCreateCaseModal(true);
  };

  const handleReviewKYC = () => {
    setActiveTab('kyc');
  };

  const handleCaseCreated = () => {
    setShowCreateCaseModal(false);
    loadComplianceStats();
  };
  return (
    <div>
      <PageHeader 
        title="Compliance & AML Engine" 
        subtitle="Manage compliance cases, KYC reviews, and anti-money laundering monitoring"
        actions={
          <div className="flex space-x-3">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
              onClick={handleCreateCase}
              <AlertTriangle size={16} className="mr-2" />
              Create Case
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              onClick={handleReviewKYC}
              <FileCheck size={16} className="mr-2" />
              Review KYC
            </button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <StatsCard
          title="Total Cases"
          value={stats.totalCases.toString()}
          change="+12 this month"
          changeType="neutral"
          icon={Shield}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Open Cases"
          value={stats.openCases.toString()}
          change="+3 today"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
        <StatsCard
          title="High Priority"
          value={stats.highPriorityCases.toString()}
          change="-2 this week"
          changeType="positive"
          icon={Flag}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Overdue Reviews"
          value={stats.overdueReviews.toString()}
          change="Urgent attention"
          changeType="negative"
          icon={Clock}
          iconColor="text-red-600"
        />
        <StatsCard
          title="Pending KYC"
          value={stats.pendingKYC.toString()}
          change="+8 new today"
          changeType="neutral"
          icon={FileCheck}
          iconColor="text-yellow-500"
        />
        <StatsCard
          title="Approved Today"
          value={stats.approvedToday.toString()}
          change="+15% vs yesterday"
          changeType="positive"
          icon={CheckCircle}
          iconColor="text-green-500"
        />
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
        <div className="p-6">
          {activeTab === 'dashboard' && <ComplianceDashboard stats={stats} />}
          {activeTab === 'cases' && <CaseManagement onCreateCase={handleCreateCase} />}
          {activeTab === 'kyc' && <KYCReviewQueue />}
          {activeTab === 'alerts' && <ComplianceAlerts />}
        </div>
      </div>

      {/* Create Case Modal */}
      {showCreateCaseModal && (
        <CreateCaseModal
          isOpen={showCreateCaseModal}
          onClose={() => setShowCreateCaseModal(false)}
          onCaseCreated={handleCaseCreated}
        />
      )}
    </div>
  );
};

export default ComplianceAML;