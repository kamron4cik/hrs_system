import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset link sent! Check your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-light dark:bg-gray-950 py-12 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md border border-neutral dark:border-gray-800">
        <h2 className="text-2xl font-bold text-primary dark:text-white mb-2 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
            <p className="text-green-700 dark:text-green-400 font-medium text-sm">
              ✅ Reset link sent to <strong>{email}</strong>.<br />
              Check your inbox (and spam folder).
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Didn't receive it?{' '}
              <button onClick={() => setSent(false)} className="text-secondary hover:underline">Try again</button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-neutral dark:border-gray-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-secondary text-white rounded-lg font-medium text-sm transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-5 text-center">
          <Link to="/login" className="text-sm text-secondary hover:text-primary">
            ← Back to login
          </Link>
        </div>

        {/* Info box when mail is not configured */}
        <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            ℹ️ Email delivery requires SMTP configuration in the server <code>.env</code> file. 
            If not set up, emails are written to the server log.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
