import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { Lock, Unlock, Eye, Shield } from 'lucide-react';

export const AdminStatusBar: React.FC = () => {
  const { isAdmin, logout, setShowLoginModal } = useAdmin();

  return (
    <div className={`fixed top-4 right-4 z-40 px-4 py-2 rounded-lg shadow-lg border flex items-center gap-2 ${
      isAdmin 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-amber-50 border-amber-200 text-amber-800'
    }`}>
      {isAdmin ? (
        <>
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Admin Mode</span>
          <button
            onClick={logout}
            className="ml-2 px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded transition-colors"
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <Eye className="w-4 h-4" />
          <span className="text-sm font-medium">View Only</span>
          <button
            onClick={() => setShowLoginModal(true)}
            className="ml-2 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs rounded transition-colors"
          >
            Admin Login
          </button>
        </>
      )}
    </div>
  );
};