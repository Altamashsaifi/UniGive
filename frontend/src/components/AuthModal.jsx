import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, AlertCircle, Sparkles, CheckCircle2, Shield } from 'lucide-react';

export default function AuthModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    department: '',
    semester: '1',
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Clear fields and error status whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      setFormData({
        full_name: '',
        email: '',
        password: '',
        department: '',
        semester: '1',
      });
      setError('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  // Cleanly switch between Sign In and Registration without carrying over inputs
  const handleToggleMode = (targetRegister) => {
    setIsRegister(targetRegister);
    setFormData({
      full_name: '',
      email: '',
      password: '',
      department: '',
      semester: '1',
    });
    setError('');
    setSuccessMsg('');
  };

  if (!isOpen) return null;

  // Admin emails whitelist from environment (comma-separated, e.g. "admin@gmail.com,altamash@gmail.com")
  const adminEmails = (import.meta.env.VITE_ADMIN_EMAILS || '')
    .toLowerCase()
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  // Domain verification check
  const isCampusDomain =
    formData.email.endsWith('.ac.in') ||
    formData.email.endsWith('.edu') ||
    formData.email.includes('.ac.in') ||
    formData.email.includes('.edu');

  const isAdminWhitelisted = Boolean(
    formData.email && adminEmails.includes(formData.email.toLowerCase().trim())
  );

  const isAllowedToRegister = isCampusDomain || isAdminWhitelisted;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (isRegister && !isAllowedToRegister) {
      setError('Registration is restricted to official university domains (@college.ac.in or .edu), unless whitelisted as Admin.');
      return;
    }

    try {
      setLoading(true);
      if (isRegister) {
        const res = await register({
          ...formData,
          department: formData.department || (isAdminWhitelisted ? 'Administration' : 'Engineering'),
          semester: formData.semester ? parseInt(formData.semester, 10) : 1,
        });
        if (res?.confirmationRequired) {
          setSuccessMsg(res.message || 'Please check your email inbox to confirm your account.');
          return;
        }
      } else {
        await login(formData.email, formData.password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="UniGive Logo"
              className="h-14 sm:h-16 w-auto object-contain shrink-0 no-outline !outline-none"
            />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {isRegister ? 'Campus Registration' : 'Campus Sign In'}
              </h2>
              <p className="text-xs text-slate-500">Intra-University Verified Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5" autoComplete="off">
          {isRegister && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="e.g. Altamash Saifi"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          )}

          {/* Email with Domain / Admin Badge */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {isAdminWhitelisted ? 'Admin Email' : 'Institutional Email'}
              </label>
              {formData.email && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isAdminWhitelisted
                      ? 'bg-purple-100 text-purple-800 border border-purple-200'
                      : isCampusDomain
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {isAdminWhitelisted ? (
                    <>
                      <Shield className="w-3 h-3 text-purple-600" />
                      Admin Authorized
                    </>
                  ) : isCampusDomain ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Domain Verified
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      Requires @college.ac.in
                    </>
                  )}
                </span>
              )}
            </div>
            <input
              type="email"
              required
              autoComplete="off"
              placeholder={isAdminWhitelisted ? 'e.g. admin@gmail.com' : 'e.g. yourname@college.ac.in'}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {isRegister && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  placeholder="e.g. CSE / Mechanical"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
          >
            {loading ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-5 text-center text-xs text-slate-500 pt-4 border-t border-slate-100">
          {isRegister ? (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => handleToggleMode(false)}
                className="text-emerald-600 font-bold hover:underline"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New student on campus?{' '}
              <button
                type="button"
                onClick={() => handleToggleMode(true)}
                className="text-emerald-600 font-bold hover:underline"
              >
                Register Account
              </button>
            </span>
          )}
        </div>

      </div>
    </div>
  );
}
