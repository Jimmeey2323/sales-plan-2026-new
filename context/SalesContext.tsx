import React, { createContext, useContext, useState, useEffect } from 'react';
import { MonthData, Offer, MarketingCollateral, CRMTimeline, Note } from '../types';
import { MONTHS_DATA } from '../constants';
import { initializeDatabase, loadSalesData, saveSalesData } from '../lib/neon';

interface SalesContextType {
  data: MonthData[];
  addOffer: (monthId: string, offer: Omit<Offer, 'id'>) => void;
  updateOffer: (monthId: string, offerId: string, offer: Partial<Offer>) => void;
  deleteOffer: (monthId: string, offerId: string) => void;
  toggleCancelled: (monthId: string, offerId: string) => void;
  updateMarketingCollateral: (monthId: string, id: string, updates: Partial<MarketingCollateral>) => void;
  updateCRMTimeline: (monthId: string, id: string, updates: Partial<CRMTimeline>) => void;
  setMonthMarketingCollateral: (monthId: string, items: MarketingCollateral[]) => void;
  setMonthCRMTimeline: (monthId: string, items: CRMTimeline[]) => void;
  addMarketingCollateral: (monthId: string, item: Omit<MarketingCollateral, 'id'>) => void;
  deleteMarketingCollateral: (monthId: string, id: string) => void;
  addCRMTimeline: (monthId: string, item: Omit<CRMTimeline, 'id'>) => void;
  deleteCRMTimeline: (monthId: string, id: string) => void;
  deleteAllMarketingCollateral: (monthId: string) => void;
  deleteAllCRMTimeline: (monthId: string) => void;
  addCustomSection: (monthId: string, sectionName: string, items: any[]) => void;
  updateCustomSection: (monthId: string, sectionName: string, items: any[]) => void;
  deleteCustomSection: (monthId: string, sectionName: string) => void;
  removeDuplicateCRMEvents: (monthId: string) => void;
  addNote: (monthId: string, content: string, userName: string) => Promise<void>;
  deleteNote: (monthId: string, noteId: string) => void;
  resetData: () => void;
  saveAllChanges: () => Promise<void>;
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedTime: string | null;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

const STORAGE_KEY = 'physique57_sales_plan_v1';
const ADS_MIGRATION_KEY = 'physique57_migrate_promote_on_ads_off_v1';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_COLLATERAL_CHANNELS: NonNullable<Offer['collateralChannels']> = {
  whatsapp: true,
  email: true,
  inStudio: true,
  website: false,
  socialMedia: false,
  metaAds: false
};

const DEFAULT_COLLATERAL_TYPES: NonNullable<Offer['collateralTypes']> = {
  tentCards: true,
  imageCreative: true,
  emailTemplate: true,
  easelStandee: true,
  videoCreative: false,
  landingPage: false,
  socialPosts: false,
  storyTemplate: false
};

const normalizeOffer = (offer: Offer, opts?: { forcePromoteOff?: boolean }) => {
  const forcePromoteOff = Boolean(opts?.forcePromoteOff);

  return {
    ...offer,
    id: offer.id || generateId(),
    cancelled: offer.cancelled ?? false,
    // If forcePromoteOff is enabled (one-time migration), turn everything off.
    promoteOnAds: forcePromoteOff ? false : (offer.promoteOnAds ?? false),
    collateralChannels: {
      ...DEFAULT_COLLATERAL_CHANNELS,
      ...(offer.collateralChannels || {})
    },
    collateralTypes: {
      ...DEFAULT_COLLATERAL_TYPES,
      ...(offer.collateralTypes || {})
    }
  };
};

const normalizeSalesData = (input: MonthData[], opts?: { forcePromoteOff?: boolean }) => {
  return input.map(month => ({
    ...month,
    offers: (month.offers || []).map(offer => normalizeOffer(offer, opts))
  }));
};

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MonthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Initialize database and load data on mount
  useEffect(() => {
    async function loadData() {
      try {
        console.log('🔄 Initializing database...');
        // Initialize database schema
        const initResult = await initializeDatabase();
        
        if (!initResult.success) {
          console.warn('⚠️ Database initialization failed, using localStorage fallback');
        }
        
        // One-time migration: turn off promoteOnAds for all existing offers
        const forcePromoteOff = localStorage.getItem(ADS_MIGRATION_KEY) !== '1';

        const applyLoadedData = async (loaded: MonthData[]) => {
          const normalized = normalizeSalesData(loaded, { forcePromoteOff });
          setData(normalized);

          if (forcePromoteOff) {
            localStorage.setItem(ADS_MIGRATION_KEY, '1');
            // Persist the migration immediately
            await saveSalesData(normalized);
          }
        };

        // Try to load from Neon database first
        console.log('📥 Loading data from Neon...');
        const neonData = await loadSalesData();

        if (neonData && Array.isArray(neonData)) {
          console.log('✅ Loaded data from Neon database');
          await applyLoadedData(neonData);
        } else {
          console.log('ℹ️ No Neon data found, checking localStorage...');
          // Fallback to localStorage
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            try {
              const parsedData = JSON.parse(saved);
              console.log('✅ Loaded data from localStorage, syncing to Neon...');
              await applyLoadedData(parsedData);
              // Sync to Neon (always)
              await saveSalesData(parsedData);
            } catch (e) {
              console.error("❌ Failed to parse saved data", e);
              initializeDefaultData();
            }
          } else {
            console.log('ℹ️ No localStorage data, loading from constants.ts...');
            initializeDefaultData();
          }
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        // Fallback to localStorage if Neon fails
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          try {
            console.log('⚠️ Using localStorage fallback');
            setData(JSON.parse(saved));
          } catch (e) {
            initializeDefaultData();
          }
        } else {
          initializeDefaultData();
        }
      } finally {
        setIsLoading(false);
      }
    }

    function initializeDefaultData() {
      console.log('🆕 Initializing default data from constants.ts...');
      const defaultData = normalizeSalesData(MONTHS_DATA, { forcePromoteOff: true });
      setData(defaultData);

      // Mark migration done (defaults are already off)
      localStorage.setItem(ADS_MIGRATION_KEY, '1');

      // Save to Neon
      console.log('💾 Saving default data to Neon...');
      saveSalesData(defaultData).catch(err => {
        console.error('❌ Failed to save default data to Neon:', err);
      });
    }

    loadData();
  }, []);

  // Save to localStorage whenever data changes (but not Neon)
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setHasUnsavedChanges(true);
      console.log('💾 Saved to localStorage (unsaved changes)');
    }
  }, [data, isLoading]);

  // Warn before closing/refreshing with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Manual save function
  const saveAllChanges = async () => {
    if (!hasUnsavedChanges) {
      console.log('ℹ️ No unsaved changes to save');
      return;
    }

    setSaveStatus('saving');
    console.log('📊 Save status set to: saving');

    try {
      const result = await saveSalesData(data);
      console.log('✅ Neon save result:', result);
      
      if (result.success) {
        setSaveStatus('saved');
        setHasUnsavedChanges(false);
        const timeStr = new Date().toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        });
        setLastSavedTime(timeStr);
        console.log('📊 Save status set to: saved at', timeStr);
        
        // Auto-reset to idle after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
          console.log('📊 Save status reset to: idle');
        }, 3000);
      } else {
        throw new Error('Save failed');
      }
    } catch (err) {
      console.error('❌ Failed to save to Neon:', err);
      setSaveStatus('error');
      console.log('📊 Save status set to: error');
      
      // Auto-reset to idle after 5 seconds
      setTimeout(() => {
        setSaveStatus('idle');
        console.log('📊 Save status reset to: idle (after error)');
      }, 5000);
    }
  };

  const addOffer = (monthId: string, offer: Omit<Offer, 'id'>) => {
    const newOffer = normalizeOffer({
      ...(offer as Offer),
      id: generateId(),
      cancelled: false
    });

    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        offers: [...month.offers, newOffer]
      };
    });
    setData(newData);
    // Save to Neon
  };

  const updateOffer = (monthId: string, offerId: string, updates: Partial<Offer>) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        offers: month.offers.map(offer => 
          offer.id === offerId ? { ...offer, ...updates } : offer
        )
      };
    });
    setData(newData);
    // Save to Neon
  };

  const deleteOffer = (monthId: string, offerId: string) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        offers: month.offers.filter(offer => offer.id !== offerId)
      };
    });
    setData(newData);
    // Save to Neon
  };

  const toggleCancelled = (monthId: string, offerId: string) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        offers: month.offers.map(offer => 
          offer.id === offerId ? { ...offer, cancelled: !offer.cancelled } : offer
        )
      };
    });
    setData(newData);
    // Save to Neon
  };

  const updateMarketingCollateral = (monthId: string, id: string, updates: Partial<MarketingCollateral>) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        marketingCollateral: (month.marketingCollateral || []).map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      };
    });
    setData(newData);
    // Save to Neon
  };

  const updateCRMTimeline = (monthId: string, id: string, updates: Partial<CRMTimeline>) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        crmTimeline: (month.crmTimeline || []).map(item =>
          item.id === id ? { ...item, ...updates } : item
        )
      };
    });
    setData(newData);
    // Save to Neon
  };

  const setMonthMarketingCollateral = (monthId: string, items: MarketingCollateral[]) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        marketingCollateral: items
      };
    });
    setData(newData);
    // Save to Neon
  };

  const setMonthCRMTimeline = (monthId: string, items: CRMTimeline[]) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        crmTimeline: items
      };
    });
    setData(newData);
    // Save to Neon
  };

  const addMarketingCollateral = (monthId: string, item: Omit<MarketingCollateral, 'id'>) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        marketingCollateral: [...(month.marketingCollateral || []), { ...item, id: generateId() }]
      };
    });
    setData(newData);
    // Save to Neon
  };

  const deleteMarketingCollateral = (monthId: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this marketing collateral?")) return;
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        marketingCollateral: (month.marketingCollateral || []).filter(item => item.id !== id)
      };
    });
    setData(newData);
    // Save to Neon
  };

  const deleteAllMarketingCollateral = (monthId: string) => {
    if (!window.confirm("Are you sure you want to delete ALL marketing collateral for this month?")) return;
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        marketingCollateral: []
      };
    });
    setData(newData);
    // Save to Neon
  };

  const addCRMTimeline = (monthId: string, item: Omit<CRMTimeline, 'id'>) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        crmTimeline: [...(month.crmTimeline || []), { ...item, id: generateId() }]
      };
    });
    setData(newData);
    // Save to Neon
  };

  const deleteCRMTimeline = (monthId: string, id: string) => {
    if (!window.confirm("Are you sure you want to delete this CRM event?")) return;
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        crmTimeline: (month.crmTimeline || []).filter(item => item.id !== id)
      };
    });
    setData(newData);
    // Save to Neon
  };

  const deleteAllCRMTimeline = (monthId: string) => {
    if (!window.confirm("Are you sure you want to delete ALL CRM timeline events for this month?")) return;
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        crmTimeline: []
      };
    });
    setData(newData);
    // Save to Neon
  };

  const addCustomSection = (monthId: string, sectionName: string, items: any[]) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        customSections: {
          ...((month as any).customSections || {}),
          [sectionName]: items
        }
      };
    });
    setData(newData);
    // Save to Neon
  };

  const updateCustomSection = (monthId: string, sectionName: string, items: any[]) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        customSections: {
          ...((month as any).customSections || {}),
          [sectionName]: items
        }
      };
    });
    setData(newData);
    // Save to Neon
  };

  const deleteCustomSection = (monthId: string, sectionName: string) => {
    if (!window.confirm(`Are you sure you want to delete the entire "${sectionName}" section?`)) return;
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      const { [sectionName]: _, ...remainingCustomSections } = (month as any).customSections || {};
      return {
        ...month,
        customSections: remainingCustomSections
      };
    });
    setData(newData);
    // Save to Neon
  };

  const removeDuplicateCRMEvents = (monthId: string) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      
      const seen = new Map<string, CRMTimeline>();
      
      (month.crmTimeline || []).forEach(event => {
        // Create a comprehensive key for duplicate detection
        const key = `${event.offer?.trim().toLowerCase()}-${event.sendDate?.trim()}-${event.content?.substring(0, 50).trim().toLowerCase()}`;
        
        // Keep the first occurrence of each unique event
        if (!seen.has(key)) {
          seen.set(key, event);
        }
      });
      
      const uniqueEvents = Array.from(seen.values());
      console.log(`Removed ${(month.crmTimeline || []).length - uniqueEvents.length} duplicate CRM events for ${month.name}`);      
      return {
        ...month,
        crmTimeline: uniqueEvents
      };
    });
    setData(newData);
    // Save to Neon
  };

  const addNote = async (monthId: string, content: string, userName: string): Promise<void> => {
    const note: Note = {
      id: generateId(),
      monthId,
      content,
      userName,
      createdAt: new Date().toISOString()
    };

    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        notes: [...(month.notes || []), note]
      };
    });
    
    setData(newData);
    
    // Save to Neon
    await saveSalesData(newData);

    // Send email notification
    try {
      const month = newData.find(m => m.id === monthId);
      const monthName = month?.name || monthId;
      
      await fetch('/api/send-note-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'jimmeey@physique57india.com',
          monthName,
          userName,
          content,
          timestamp: note.createdAt
        })
      });
    } catch (error) {
      console.error('Failed to send email notification:', error);
      // Don't throw - note was saved successfully
    }
  };

  const deleteNote = (monthId: string, noteId: string) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        notes: (month.notes || []).filter(note => note.id !== noteId)
      };
    });
    setData(newData);
    // Save to Neon
  };

  const resetData = () => {
    if (!window.confirm("This will factory reset all data. Are you sure?")) return;
    localStorage.removeItem(STORAGE_KEY);

    // Defaults: promoteOnAds off + collateral defaults applied
    const resetData = normalizeSalesData(MONTHS_DATA, { forcePromoteOff: true });
    localStorage.setItem(ADS_MIGRATION_KEY, '1');

    setData(resetData);
    // Save reset data to Neon
    saveSalesData(resetData).catch(console.error);
  };

  return (
    <SalesContext.Provider value={{ 
      data, 
      addOffer, 
      updateOffer, 
      deleteOffer, 
      toggleCancelled, 
      updateMarketingCollateral, 
      updateCRMTimeline, 
      setMonthMarketingCollateral, 
      setMonthCRMTimeline, 
      addMarketingCollateral, 
      deleteMarketingCollateral, 
      addCRMTimeline, 
      deleteCRMTimeline, 
      deleteAllMarketingCollateral, 
      deleteAllCRMTimeline, 
      addCustomSection, 
      updateCustomSection, 
      deleteCustomSection, 
      removeDuplicateCRMEvents, 
      addNote, 
      deleteNote, 
      resetData, 
      saveAllChanges,
      isLoading,
      hasUnsavedChanges,
      saveStatus,
      lastSavedTime
    }}>
      {children}
    </SalesContext.Provider>
  );
};

export const useSalesData = () => {
  const context = useContext(SalesContext);
  if (context === undefined) {
    throw new Error('useSalesData must be used within a SalesProvider');
  }
  return context;
};
