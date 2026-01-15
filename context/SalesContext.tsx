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
  isLoading: boolean;
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

const STORAGE_KEY = 'physique57_sales_plan_v1';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<MonthData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        
        // Try to load from Neon database first
        console.log('📥 Loading data from Neon...');
        const neonData = await loadSalesData();
        
        if (neonData && Array.isArray(neonData)) {
          console.log('✅ Loaded data from Neon database');
          setData(neonData);
        } else {
          console.log('ℹ️ No Neon data found, checking localStorage...');
          // Fallback to localStorage
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) {
            try {
              const parsedData = JSON.parse(saved);
              console.log('✅ Loaded data from localStorage, syncing to Neon...');
              setData(parsedData);
              // Sync to Neon
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
      const defaultData = MONTHS_DATA.map(month => ({
        ...month,
        offers: month.offers.map(offer => ({
          ...offer,
          id: offer.id || generateId(),
          cancelled: offer.cancelled || false
        }))
      }));
      setData(defaultData);
      // Save to Neon
      console.log('💾 Saving default data to Neon...');
      saveSalesData(defaultData).catch(err => {
        console.error('❌ Failed to save default data to Neon:', err);
      });
    }

    loadData();
  }, []);

  // Save to both local storage and Neon whenever data changes
  useEffect(() => {
    if (!isLoading && data.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      console.log('💾 Saved to localStorage');
      // Async save to Neon (non-blocking)
      saveSalesData(data).catch(err => {
        console.error('Failed to save to Neon:', err);
      });
    }
  }, [data, isLoading]);

  const addOffer = (monthId: string, offer: Omit<Offer, 'id'>) => {
    const newData = data.map(month => {
      if (month.id !== monthId) return month;
      return {
        ...month,
        offers: [...month.offers, { ...offer, id: generateId(), cancelled: false }]
      };
    });
    setData(newData);
    // Save to Neon
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
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
    saveSalesData(newData).catch(console.error);
  };

  const resetData = () => {
    if (!window.confirm("This will factory reset all data. Are you sure?")) return;
    localStorage.removeItem(STORAGE_KEY);
    const resetData = MONTHS_DATA.map(month => ({
      ...month,
      offers: month.offers.map(offer => ({
        ...offer,
        id: generateId(),
        cancelled: false
      }))
    }));
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
      isLoading 
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
