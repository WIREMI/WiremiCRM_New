import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, AlertTriangle, FileCheck, Clock, Shield, Users, XCircle, CheckCircle } from 'lucide-react';

interface ComplianceDashboardProps {
  stats: {
    totalCases: number;
    openCases: number;
    highPriorityCases: number;
    overdueReviews: number;
    pendingKYC: number;
    approvedToday: number;
  };
}

const ComplianceDashboard: React.FC<ComplianceDashboardProps> = ({ stats }) => {
  // Mock data for charts
  const casesByType = [
    { type: 'AML Suspicious', count: 45, color: '#ef4444' },
    { type: 'KYC Non-Compliance', count: 32, color: '#f59e0b' },
    { type: 'Sanctions Screening', count: 28, color: '#8b5cf6' },
    { type: 'PEP Match', count: 15, color: '#06b6d4' },
    { type: 'Fraud Related', count: 22, color: '#10b981' },
    { type: 'Other', count: 14, color: '#6b7280' }
  ];

  const monthlyTrend = [
    { month: 'Jan', cases: 45, resolved: 42, kyc: 89 },
    { month: 'Feb', cases: 52, resolved: 48, kyc: 95 },
    { month: 'Mar', cases: 38, resolved: 41, kyc: 78 },
    { month: 'Apr', cases: 61, resolved: 55, kyc: 102 },
    { month: 'May', cases: 49, resolved: 52, kyc: 87 },
    { month: 'Jun', cases: 43, resolved: 46, kyc: 91 }
  ];

  const kycStatusData = [
    { status: 'Pending Review', count: 34, color: '#f59e0b' },
    { status: 'In Review', count: 18, color: '#3b82f6' },
    { status: 'Approved', count: 156, color: '#10b981' },
    { status: 'Rejected', count: 23, color: '#ef4444' },
    { status: 'More Info Required', count: 12, color: '#8b5cf6' }
  ];

  const riskDistribution = [
    { range: '0-20', count: 45, color: '#10b981' },
    { range: '21-40', count: 67, color: '#3b82f6' },
    { range: '41-60', count: 34, color: '#f59e0b' },
    { range: '61-80', count: 18, color: '#ef4444' },
    { range: '81-100', count: 8, color: '#7c2d12' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Case Resolution Rate</p>
              <p className="text-3xl font-bold">94.2%</p>
              <p className="text-blue-100 text-sm">+2.1% this month</p>
            </div>
            <Shield size={32} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">KYC Approval Rate</p>
              <p className="text-3xl font-bold">87.5%</p>
              <p className="text-green-100 text-sm">+1.8% this month</p>
            </div>
            <FileCheck size={32} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg Review Time</p>
              <p className="text-3xl font-bold">2.3 days</p>
              <p className="text-orange-100 text-sm">-0.5 days improved</p>
            </div>
            <Clock size={32} className="text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Risk Score Average</p>
              <p className="text-3xl font-bold">32.1</p>
              <p className="text-red-100 text-sm">-2.3 points lower</p>
            </div>
            <AlertTriangle size={32} className="text-red-200" />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cases by Type */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Cases by Type
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={casesByType}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="type" 
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-600 dark:text-dark-400"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-600 dark:text-dark-400"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* KYC Status Distribution */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            KYC Status Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={kycStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="count"
                >
                  {kycStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {kycStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-600 dark:text-dark-400">
                  {item.status} ({item.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
            Monthly Compliance Trends
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-600 dark:text-dark-400"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  className="text-gray-600 dark:text-dark-400"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="cases" 
                  stroke="#ef4444" 
                  strokeWidth={3}
                  dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                  name="New Cases"
                />
                <Line 
                  type="monotone" 
                  dataKey="resolved" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  name="Resolved Cases"
                />
                <Line 
                  type="monotone" 
                  dataKey="kyc" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  name="KYC Reviews"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Distribution */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Customer Risk Score Distribution
        </h3>
        <div className="grid grid-cols-5 gap-4">
          {riskDistribution.map((range, index) => (
            <div key={index} className="text-center">
              <div 
                className="h-32 rounded-lg flex items-end justify-center text-white font-bold text-lg mb-2"
                style={{ 
                  backgroundColor: range.color,
                  height: `${Math.max(20, (range.count / Math.max(...riskDistribution.map(r => r.count))) * 128)}px`
                }}
              >
                {range.count}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-dark-100">
                {range.range}
              </div>
              <div className="text-xs text-gray-500 dark:text-dark-400">
                Risk Score
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-100 mb-4">
          Recent Compliance Activity
        </h3>
        <div className="space-y-4">
          {[
            {
              id: 1,
              type: 'case_created',
              message: 'New AML case created for customer WRM001234',
              time: '5 minutes ago',
              severity: 'high',
              icon: AlertTriangle
            },
            {
              id: 2,
              type: 'kyc_approved',
              message: 'KYC review approved for customer WRM001567',
              time: '12 minutes ago',
              severity: 'low',
              icon: FileCheck
            },
            {
              id: 3,
              type: 'case_escalated',
              message: 'Sanctions screening case escalated to supervisor',
              time: '25 minutes ago',
              severity: 'critical',
              icon: TrendingUp
            },
            {
              id: 4,
              type: 'kyc_rejected',
              message: 'KYC review rejected - insufficient documentation',
              time: '1 hour ago',
              severity: 'medium',
              icon: XCircle
            },
            {
              id: 5,
              type: 'case_resolved',
              message: 'PEP match case resolved - false positive confirmed',
              time: '2 hours ago',
              severity: 'low',
              icon: CheckCircle
            }
          ].map((activity) => {
            const Icon = activity.icon;
            const severityColors = {
              low: 'text-green-500',
              medium: 'text-yellow-500',
              high: 'text-orange-500',
              critical: 'text-red-500'
            };

            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg transition-colors">
                <Icon size={20} className={severityColors[activity.severity as keyof typeof severityColors]} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-dark-100">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-dark-400">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ComplianceDashboard;