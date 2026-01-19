import React from 'react';
import { useAdmin } from '../context/AdminContext';
import { useSalesData } from '../context/SalesContext';
import { Eye, Shield, HardDrive, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminStatusBar: React.FC = () => {
  const { isAdmin, logout, setShowLoginModal } = useAdmin();
  const { saveStatus, lastSavedTime } = useSalesData();

  const getSaveStatusColor = () => {
    switch (saveStatus) {
      case 'saving':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'saved':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      default:
        return '';
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <HardDrive className="w-3.5 h-3.5 animate-pulse" />;
      case 'saved':
        return <CheckCircle className="w-3.5 h-3.5" />;
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  const getSaveStatusLabel = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return `Saved ${lastSavedTime ? `at ${lastSavedTime}` : 'successfully'}`;
      case 'error':
        return 'Save failed';
      default:
        return null;
    }
  };

  const adminBgClass = isAdmin
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-amber-50 border-amber-200 text-amber-800';

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col gap-2">
      <div className={`px-4 py-2 rounded-lg shadow-lg border flex items-center gap-2 ${adminBgClass}`}>
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

      {/* Save Status Indicator */}
      {saveStatus !== 'idle' && (
        <div className={`px-3 py-2 rounded-lg shadow-lg border flex items-center gap-2 text-xs font-medium transition-all duration-300 ${getSaveStatusColor()}`}>
          {getSaveStatusIcon()}
          <span>{getSaveStatusLabel()}</span>
        </div>
      )}
    </div>
  );
}