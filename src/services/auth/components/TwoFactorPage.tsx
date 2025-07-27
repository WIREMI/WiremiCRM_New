import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';

const TwoFactorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [useBackupCode, setUseBackupCode] = useState(false);

  const mfaToken = location.state?.mfaToken;

  useEffect(() => {
    if (!mfaToken) {
      navigate('/auth/login');
    }
  }, [mfaToken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!code.trim()) {
      setError('Please enter the verification code');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/verify-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          mfaToken,
          code: code.trim()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'MFA verification failed');
      }

      // MFA verification successful, redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('MFA verification error:', err);
      setError(err instanceof Error ? err.message : (useBackupCode ? 'Invalid backup code' : 'Invalid verification code'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only digits
    if (useBackupCode) {
      setCode(value.toUpperCase().slice(0, 8)); // Backup codes are 8 characters
    } else {
      setCode(value.slice(0, 6)); // TOTP codes are 6 digits
    }
  };

  const handleResendCode = async () => {
    // TODO: Implement resend logic if needed
    console.log('Resend code requested');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Two-Factor Authentication</h1>
            <p className="text-gray-600 mt-2">
              {useBackupCode 
                ? 'Enter one of your backup codes'
                : 'Enter the 6-digit code from your authenticator app'
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                {useBackupCode ? 'Backup Code' : 'Verification Code'}
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={handleCodeChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-2xl font-mono tracking-widest"
                placeholder={useBackupCode ? '12345678' : '123456'}
                maxLength={useBackupCode ? 8 : 6}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length < (useBackupCode ? 8 : 6)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setUseBackupCode(!useBackupCode);
                  setCode('');
                  setError('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {useBackupCode ? 'Use authenticator app instead' : 'Use backup code instead'}
              </button>
            </div>

            {!useBackupCode && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center justify-center"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Didn't receive a code?
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/auth/login')}
              className="text-gray-600 hover:text-gray-700 text-sm"
            >
              ← Back to login
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Having trouble? Contact support for assistance
          </p>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorPage;