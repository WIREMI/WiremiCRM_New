import React from 'react';
import { Shield, Users, Key, Lock, AlertCircle } from 'lucide-react';
import PageHeader from '../../components/Common/PageHeader';
import StatsCard from '../../components/Common/StatsCard';

const AuthService: React.FC = () => {
  return (
    <div>
      <PageHeader 
        title="Authentication & Security" 
        subtitle="Manage user authentication, sessions, and security policies"
        actions={
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Security Settings
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Active Sessions"
          value="1,456"
          change="+12 new sessions"
          changeType="positive"
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Failed Logins (24h)"
          value="23"
          change="-15% from yesterday"
          changeType="positive"
          icon={AlertCircle}
          iconColor="text-red-500"
        />
        <StatsCard
          title="API Keys Active"
          value="89"
          change="3 expiring soon"
          changeType="neutral"
          icon={Key}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Security Score"
          value="98.5%"
          change="+0.2% this week"
          changeType="positive"
          icon={Lock}
          iconColor="text-emerald-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="mr-2 text-blue-500" size={20} />
            Authentication Methods
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Multi-Factor Authentication</p>
                <p className="text-sm text-gray-600">SMS + Email verification</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Biometric Login</p>
                <p className="text-sm text-gray-600">Fingerprint & Face ID</p>
              </div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">OAuth Integration</p>
                <p className="text-sm text-gray-600">Google, Apple, Facebook</p>
              </div>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Pending</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Lock className="mr-2 text-red-500" size={20} />
            Security Policies
          </h3>
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium text-gray-900">Password Policy</p>
              <p className="text-sm text-gray-600">Min 12 chars, special chars required</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium text-gray-900">Session Timeout</p>
              <p className="text-sm text-gray-600">30 minutes of inactivity</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-medium text-gray-900">Device Limit</p>
              <p className="text-sm text-gray-600">Max 3 devices per user</p>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <p className="font-medium text-gray-900">Failed Login Lock</p>
              <p className="text-sm text-gray-600">5 attempts, 15-minute lockout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthService;