import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { X, Lock, Eye, EyeOff } from 'lucide-react';

export const AdminLoginModal: React.FC = () => {
  const { showLoginModal, setShowLoginModal, login } = useAdmin();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [showCode, setShowCode] = useState(false);

  if (!showLoginModal) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(code);
    if (success) {
      setCode('');
      setError('');
    } else {
      setError('Invalid admin code. Please try again.');
      setCode('');
    }
  };

  const handleClose = () => {
    setShowLoginModal(false);
    setCode('');
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Admin Access Required</h3>
              <p className="text-sm text-slate-600">Enter admin code to enable editing</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="adminCode" className="block text-sm font-medium text-slate-700 mb-2">
              Admin Code
            </label>
            <div className="relative">
              <input
                id="adminCode"
                type={showCode ? 'text' : 'password'}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                placeholder="Enter 4-digit code"
                maxLength={4}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              View Only
            </button>
            <button
              type="submit"
              disabled={code.length !== 4}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Access Admin
            </button>
          </div>
        </form>

        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-xs text-slate-600">
            <span className="font-medium">View Only Mode:</span> You can browse all data but cannot make changes.
          </p>
          <p className="text-xs text-slate-600 mt-1">
            <span className="font-medium">Admin Mode:</span> Full editing access to create, modify, and delete items.
          </p>
        </div>
      </div>
    </div>
  );
};