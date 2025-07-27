import React, { useState, useEffect } from 'react';
import { Shield, Smartphone, Monitor, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import PageHeader from '../../../components/Common/PageHeader';

interface TrustedDevice {
  id: string;
  name: string;
  deviceType: string;
  browser?: string;
  os?: string;
  lastSeenAt: Date;
  isCurrent: boolean;
}

interface ApiToken {
  id: string;
  name: string;
  scopes: string[];
  lastUsedAt?: Date;
  createdAt: Date;
  expiresAt?: Date;
}

const AccountSettingsPage: React.FC = () => {
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [showMfaSetup, setShowMfaSetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([]);
  const [apiTokens, setApiTokens] = useState<ApiToken[]>([]);
  const [showNewTokenForm, setShowNewTokenForm] = useState(false);
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenScopes, setNewTokenScopes] = useState<string[]>([]);

  useEffect(() => {
    loadAccountData();
  }, []);

  const loadAccountData = async () => {
    // TODO: Load user's MFA status, trusted devices, and API tokens
    // Simulate data loading
    setMfaEnabled(false);
    setTrustedDevices([
      {
        id: '1',
        name: 'MacBook Pro',
        deviceType: 'desktop',
        browser: 'Chrome',
        os: 'macOS',
        lastSeenAt: new Date(),
        isCurrent: true
      },
      {
        id: '2',
        name: 'iPhone 13',
        deviceType: 'mobile',
        browser: 'Safari',
        os: 'iOS',
        lastSeenAt: new Date(Date.now() - 86400000),
        isCurrent: false
      }
    ]);
    setApiTokens([
      {
        id: '1',
        name: 'Mobile App Token',
        scopes: ['read:profile', 'read:transactions'],
        lastUsedAt: new Date(),
        createdAt: new Date(Date.now() - 7 * 86400000)
      }
    ]);
  };

  const handleEnableMfa = async () => {
    try {
      // TODO: Generate MFA secret and QR code
      // const response = await authService.generateMfaSecret();
      
      // Simulate API response
      setQrCodeUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
      setBackupCodes(['12345678', '87654321', '11111111', '22222222', '33333333']);
      setShowMfaSetup(true);
    } catch (error) {
      console.error('Failed to enable MFA:', error);
    }
  };

  const handleDisableMfa = async () => {
    if (window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      try {
        // TODO: Disable MFA
        setMfaEnabled(false);
      } catch (error) {
        console.error('Failed to disable MFA:', error);
      }
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    if (window.confirm('Are you sure you want to revoke trust for this device?')) {
      try {
        // TODO: Revoke device trust
        setTrustedDevices(prev => prev.filter(device => device.id !== deviceId));
      } catch (error) {
        console.error('Failed to revoke device:', error);
      }
    }
  };

  const handleCreateApiToken = async () => {
    if (!newTokenName.trim()) return;

    try {
      // TODO: Create new API token
      const newToken: ApiToken = {
        id: Date.now().toString(),
        name: newTokenName,
        scopes: newTokenScopes,
        createdAt: new Date()
      };
      
      setApiTokens(prev => [...prev, newToken]);
      setNewTokenName('');
      setNewTokenScopes([]);
      setShowNewTokenForm(false);
    } catch (error) {
      console.error('Failed to create API token:', error);
    }
  };

  const handleRevokeApiToken = async (tokenId: string) => {
    if (window.confirm('Are you sure you want to revoke this API token? Applications using this token will lose access.')) {
      try {
        // TODO: Revoke API token
        setApiTokens(prev => prev.filter(token => token.id !== tokenId));
      } catch (error) {
        console.error('Failed to revoke API token:', error);
      }
    }
  };

  return (
    <div>
      <PageHeader 
        title="Account Security" 
        subtitle="Manage your security settings and trusted devices"
      />

      <div className="space-y-8">
        {/* Two-Factor Authentication */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-blue-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
              </div>
            </div>
            <div className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                mfaEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {mfaEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <button
                onClick={mfaEnabled ? handleDisableMfa : handleEnableMfa}
                className={`ml-4 px-4 py-2 rounded-lg font-medium transition-colors ${
                  mfaEnabled 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {mfaEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>

          {showMfaSetup && (
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Scan QR Code</h4>
                  <div className="bg-gray-100 p-4 rounded-lg text-center">
                    <img src={qrCodeUrl} alt="QR Code" className="mx-auto w-32 h-32" />
                    <p className="text-sm text-gray-600 mt-2">
                      Scan with your authenticator app
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Backup Codes</h4>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 mb-3">
                      Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator device.
                    </p>
                    <div className="grid grid-cols-1 gap-2 font-mono text-sm">
                      {backupCodes.map((code, index) => (
                        <div key={index} className="bg-white px-3 py-2 rounded border">
                          {showBackupCodes ? code : '••••••••'}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowBackupCodes(!showBackupCodes)}
                      className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      {showBackupCodes ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="ml-1">{showBackupCodes ? 'Hide' : 'Show'} codes</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Trusted Devices */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Monitor className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Trusted Devices</h3>
                <p className="text-sm text-gray-600">Devices you've marked as trusted</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {trustedDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  {device.deviceType === 'mobile' ? (
                    <Smartphone className="w-5 h-5 text-gray-500 mr-3" />
                  ) : (
                    <Monitor className="w-5 h-5 text-gray-500 mr-3" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {device.name}
                      {device.isCurrent && (
                        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Current
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      {device.browser} on {device.os} • Last seen {device.lastSeenAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {!device.isCurrent && (
                  <button
                    onClick={() => handleRevokeDevice(device.id)}
                    className="text-red-600 hover:text-red-700 p-2"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* API Tokens */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-purple-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">API Tokens</h3>
                <p className="text-sm text-gray-600">Manage API access tokens for applications</p>
              </div>
            </div>
            <button
              onClick={() => setShowNewTokenForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              New Token
            </button>
          </div>

          {showNewTokenForm && (
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-4">Create New API Token</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Token Name
                  </label>
                  <input
                    type="text"
                    value={newTokenName}
                    onChange={(e) => setNewTokenName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Mobile App Token"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Scopes
                  </label>
                  <div className="space-y-2">
                    {['read:profile', 'read:transactions', 'write:transactions', 'admin'].map((scope) => (
                      <label key={scope} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newTokenScopes.includes(scope)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewTokenScopes(prev => [...prev, scope]);
                            } else {
                              setNewTokenScopes(prev => prev.filter(s => s !== scope));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">{scope}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={handleCreateApiToken}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create Token
                  </button>
                  <button
                    onClick={() => setShowNewTokenForm(false)}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {apiTokens.map((token) => (
              <div key={token.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{token.name}</p>
                  <p className="text-sm text-gray-600">
                    Scopes: {token.scopes.join(', ')} • Created {token.createdAt.toLocaleDateString()}
                    {token.lastUsedAt && ` • Last used ${token.lastUsedAt.toLocaleDateString()}`}
                  </p>
                </div>
                <button
                  onClick={() => handleRevokeApiToken(token.id)}
                  className="text-red-600 hover:text-red-700 p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsPage;