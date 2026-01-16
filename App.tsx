import React, { useState, useEffect } from 'react';
import { MonthDetail } from './components/MonthDetail';
import { YearOverview } from './components/YearOverview';
import { SalesProvider, useSalesData } from './context/SalesContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AdminLoginModal } from './components/AdminLoginModal';
import { 
  ChevronRight,
  ChevronLeft,
  Download, 
  RefreshCcw, 
  FileJson, 
  FileSpreadsheet, 
  Clipboard, 
  X, 
  Check, 
  Filter,
  Layers,
  Settings,
  CalendarDays,
  FileText,
  Image,
  Mail,
  Shield,
  Eye,
  Menu
} from 'lucide-react';
import { MonthData } from './types';
import { exportToPDF, exportToWord, exportToImage, copyEmailToClipboard } from './lib/exports';
import { clearSalesData } from './lib/neon';
import confetti from 'canvas-confetti';
import physique57Logo from '@/src/assets/physique57-logo.png';

// Advanced Export Modal Component
const ExportModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  data: MonthData[];
  selectedMonthId: string;
}> = ({ isOpen, onClose, data, selectedMonthId }) => {
  const [scope, setScope] = useState<'current' | 'all'>('all');
  const [includeCancelled, setIncludeCancelled] = useState(false);
  const [format, setFormat] = useState<'json' | 'csv' | 'clipboard' | 'pdf' | 'word' | 'image' | 'email'>('pdf');
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const selectedMonth = data.find(m => m.id === selectedMonthId);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // 1. Filter Scope
      let exportData = scope === 'current' ? (selectedMonth ? [selectedMonth] : []) : data;

      // 2. Filter Cancelled
      if (!includeCancelled) {
        exportData = exportData.map(m => ({
          ...m,
          offers: m.offers.filter(o => !o.cancelled)
        }));
      }

      // 3. Handle Formats
      if (format === 'pdf') {
        await exportToPDF(exportData, scope, selectedMonth);
        setTimeout(() => onClose(), 500);
      } else if (format === 'word') {
        await exportToWord(exportData, scope, selectedMonth);
        setTimeout(() => onClose(), 500);
      } else if (format === 'image') {
        await exportToImage(exportData, scope, selectedMonth);
        setTimeout(() => onClose(), 500);
      } else if (format === 'email') {
        await copyEmailToClipboard(exportData, scope, selectedMonth);
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
          onClose();
        }, 1500);
      } else if (format === 'json') {
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sales_plan_${scope}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => onClose(), 500);
      } else if (format === 'csv') {
         const headers = [
           'Month', 'Offer Title', 'Type', 'Description', 'Pricing Display',
           'Price Mumbai (Base)', 'Price Bengaluru (Base)', 
           'Final Price Mumbai', 'Final Price Bengaluru',
           'Discount Amount Mumbai', 'Discount Amount Bengaluru',
           'Discount Percentage', 
           'Savings Full Text',
           'Target Units Total',
           'Target Units Mumbai', 'Target Units Bengaluru',
           'Promote on Ads', 'Status',
           'Why It Works', 'Marketing Collateral', 'Operational Support'
         ];
         const rows = exportData.flatMap(month => 
          month.offers.map(offer => {
            // Calculate discount amounts
            const discountMumbai = (offer.priceMumbai && offer.finalPriceMumbai) 
              ? offer.priceMumbai - offer.finalPriceMumbai 
              : '';
            const discountBengaluru = (offer.priceBengaluru && offer.finalPriceBengaluru) 
              ? offer.priceBengaluru - offer.finalPriceBengaluru 
              : '';
            
            return [
              month.name,
              `"${offer.title.replace(/"/g, '""')}"`,
              offer.type,
              `"${offer.description.replace(/"/g, '""')}"`,
              `"${offer.pricing}"`,
              offer.priceMumbai || '',
              offer.priceBengaluru || '',
              offer.finalPriceMumbai || '',
              offer.finalPriceBengaluru || '',
              discountMumbai,
              discountBengaluru,
              offer.discountPercent || '',
              `"${offer.savings || ''}"`,
              offer.targetUnits || '',
              offer.targetUnitsMumbai || '',
              offer.targetUnitsBengaluru || '',
              offer.promoteOnAds ? 'Yes' : 'No',
              offer.cancelled ? 'Cancelled' : 'Active',
              `"${offer.whyItWorks.replace(/"/g, '""')}"`,
              `"${offer.marketingCollateral?.replace(/"/g, '""') || ''}"`,
              `"${offer.operationalSupport?.replace(/"/g, '""') || ''}"`
            ];
          })
        );
        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sales_offers_${scope}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => onClose(), 500);
      } else if (format === 'clipboard') {
         const text = JSON.stringify(exportData, null, 2);
         await navigator.clipboard.writeText(text);
         setCopied(true);
         setTimeout(() => {
           setCopied(false);
           onClose();
         }, 1000);
      }
    } catch (error) {
      console.error('Export error:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-serif font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-600" /> Advanced Export
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Scope Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4" /> Export Scope
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setScope('current')}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  scope === 'current' 
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-200 shadow-sm' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                Current Month
              </button>
              <button
                onClick={() => setScope('all')}
                className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${
                  scope === 'all' 
                    ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-200 shadow-sm' 
                    : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                }`}
              >
                All Data
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Filter className="w-4 h-4" /> Filters
            </label>
            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors group">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  checked={includeCancelled}
                  onChange={e => setIncludeCancelled(e.target.checked)}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-gray-300 transition-all checked:border-brand-500 checked:bg-brand-500"
                />
                <Check className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
              </div>
              <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">Include Cancelled Offers</span>
            </label>
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <FileJson className="w-4 h-4" /> Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'pdf', label: 'PDF', icon: FileText },
                { value: 'word', label: 'Word', icon: FileText },
                { value: 'image', label: 'Image', icon: Image },
                { value: 'email', label: 'Email', icon: Mail },
                { value: 'json', label: 'JSON', icon: FileJson },
                { value: 'csv', label: 'CSV', icon: FileSpreadsheet },
                { value: 'clipboard', label: 'Copy', icon: Clipboard }
              ].map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.value}
                    onClick={() => setFormat(f.value as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-medium transition-all gap-1.5 uppercase tracking-wide ${
                      format === f.value
                        ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-200 shadow-sm'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
           <button 
             onClick={onClose}
             disabled={isExporting}
             className="flex-1 px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
           >
             Cancel
           </button>
           <button 
             onClick={handleExport}
             disabled={isExporting}
             className={`flex-1 px-4 py-2.5 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${
               copied ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-600 hover:bg-brand-700'
             }`}
           >
             {isExporting ? (
               <>
                 <RefreshCcw className="w-4 h-4 animate-spin" />
                 Exporting...
               </>
             ) : copied ? (
               <>
                 <Check className="w-4 h-4" />
                 Copied!
               </>
             ) : (
               <>
                 <Download className="w-4 h-4" />
                 Export Now
               </>
             )}
           </button>
        </div>
      </div>
    </div>
  );
};

const DashboardContent: React.FC = () => {
  const { data, resetData, isLoading } = useSalesData();
  const { isAdmin, logout, setShowLoginModal } = useAdmin();
  const [selectedMonthId, setSelectedMonthId] = useState<string>('jan');
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  const [hideCancelled, setHideCancelled] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  const selectedMonth = data.find(m => m.id === selectedMonthId) || data[0];
  
  // Navigation helpers
  const currentMonthIndex = data.findIndex(m => m.id === selectedMonthId);
  const hasPrevious = currentMonthIndex > 0;
  const hasNext = currentMonthIndex < data.length - 1;
  
  const goToPreviousMonth = () => {
    if (hasPrevious) {
      setSelectedMonthId(data[currentMonthIndex - 1].id);
    }
  };
  
  const goToNextMonth = () => {
    if (hasNext) {
      setSelectedMonthId(data[currentMonthIndex + 1].id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCcw className="w-12 h-12 text-brand-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 font-medium">Loading Sales Data...</p>
          <p className="text-sm text-gray-400 mt-2">Syncing with Neon Database</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Collapsible Sidebar Navigation */}
      <aside 
        className={`bg-white border-r border-gray-200 md:h-screen md:sticky md:top-0 z-20 flex-shrink-0 flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 ${
          sidebarCollapsed ? 'md:w-20' : 'md:w-72'
        } w-full`}
      >
        <div className="p-6 border-b border-gray-100 bg-white">
          {!sidebarCollapsed ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <img 
                  src={physique57Logo} 
                  alt="Physique 57" 
                  className="w-10 h-10 rounded-lg object-cover shadow-sm"
                />
                <span className="font-serif font-bold text-xl tracking-tight text-gray-900">Physique 57, India</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold pl-12">2026 Sales Plan</p>
            </>
          ) : (
            <div className="flex justify-center">
              <img 
                src={physique57Logo} 
                alt="Physique 57" 
                className="w-10 h-10 rounded-lg object-cover shadow-sm"
              />
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <div className="px-3 pt-3 flex justify-center">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Admin Badge in Sidebar */}
        <div className={`px-3 pt-3 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
          <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
            isAdmin 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            {isAdmin ? (
              <>
                <Shield className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">Admin Mode</span>
                <button
                  onClick={logout}
                  className="ml-auto px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 text-xs rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 flex-shrink-0" />
                <span className="text-xs font-medium">View Only</span>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="ml-auto px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs rounded transition-colors"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`px-3 pt-4 pb-2 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${
                activeTab === 'monthly'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => {
                setActiveTab('yearly');
              }}
              className={`px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all flex items-center justify-center gap-1 ${
                activeTab === 'yearly'
                  ? 'bg-white text-brand-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CalendarDays className="w-3 h-3" />
              Year
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {activeTab === 'monthly' && data.map((month) => (
            <button
              key={month.id}
              onClick={() => setSelectedMonthId(month.id)}
              className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                selectedMonthId === month.id
                  ? 'bg-brand-50 text-brand-700 shadow-sm ring-1 ring-brand-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              title={sidebarCollapsed ? month.name : undefined}
            >
              {sidebarCollapsed ? (
                <span className="text-xs font-bold">{month.name.substring(0, 3)}</span>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full transition-colors ${
                      selectedMonthId === month.id ? 'bg-brand-500' : 'bg-gray-300 group-hover:bg-gray-400'
                    }`} />
                    {month.name}
                  </div>
                  {selectedMonthId === month.id && (
                    <ChevronRight className="w-4 h-4 text-brand-400" />
                  )}
                </>
              )}
            </button>
          ))}
          
          {activeTab === 'yearly' && !sidebarCollapsed && (
            <div className="text-center py-8 text-sm text-gray-500">
              <CalendarDays className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="font-medium">Viewing Full Year</p>
              <p className="text-xs mt-1">All 12 months overview</p>
            </div>
          )}
        </nav>
        
        {/* Month Navigation Buttons */}
        {activeTab === 'monthly' && !sidebarCollapsed && (
          <div className="px-3 pb-3 border-t border-gray-100">
            <div className="pt-3 grid grid-cols-2 gap-2">
              <button
                onClick={goToPreviousMonth}
                disabled={!hasPrevious}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  hasPrevious
                    ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm'
                    : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <button
                onClick={goToNextMonth}
                disabled={!hasNext}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  hasNext
                    ? 'bg-brand-600 text-white hover:bg-brand-700 shadow-sm'
                    : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className={`p-4 border-t border-gray-100 space-y-3 bg-gray-50/50 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
          <button 
            onClick={() => setHideCancelled(!hideCancelled)}
            className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 border rounded-lg text-sm font-medium transition-all shadow-sm ${
              hideCancelled 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Hide Cancelled
            </div>
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              hideCancelled 
                ? 'bg-indigo-600 border-indigo-600' 
                : 'border-gray-300'
            }`}>
              {hideCancelled && <Check className="w-3 h-3 text-white" />}
            </div>
          </button>
          
          <button 
            onClick={() => setShowExportModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            Advanced Export
          </button>

          <button 
            onClick={async () => {
              if (confirm('⚠️ This will clear ALL cached data (localStorage + database) and reload from constants.ts with updated pricing. Continue?')) {
                try {
                  // Clear localStorage
                  localStorage.clear();
                  // Clear Neon database
                  await clearSalesData();
                  // Force reload
                  window.location.reload();
                } catch (error) {
                  console.error('Error clearing data:', error);
                  // Still reload even if database clear fails
                  window.location.reload();
                }
              }
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 border border-orange-200 rounded-lg text-sm font-semibold text-orange-700 hover:bg-orange-100 hover:border-orange-300 transition-all shadow-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Clear Cache & Reload
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-screen bg-slate-50/50">
        {activeTab === 'monthly' ? (
          <MonthDetail data={selectedMonth} hideCancelled={hideCancelled} />
        ) : (
          <YearOverview data={data} hideCancelled={hideCancelled} />
        )}
        
        <footer className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-400">
            © 2026 Physique 57 India Sales Strategy Confidential
          </p>
        </footer>
      </main>

      {/* Export Modal */}
      <ExportModal 
        isOpen={showExportModal} 
        onClose={() => setShowExportModal(false)} 
        data={data}
        selectedMonthId={selectedMonthId}
      />

    </div>
  );
};

const App: React.FC = () => {
  return (
    <AdminProvider>
      <SalesProvider>
        <AdminLoginModal />
        <DashboardContent />
      </SalesProvider>
    </AdminProvider>
  );
};

export default App;
