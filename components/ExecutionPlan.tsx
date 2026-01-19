import React, { useState, useEffect } from 'react';
import { MonthData, Offer, MarketingCollateral, CRMTimeline } from '../types';
import { Target, TrendingUp, Users, DollarSign, Package, Megaphone, ListTodo, Edit2, Save, X, Trash2, Plus, Calendar, Wand2, Palette } from 'lucide-react';
import { useSalesData } from '../context/SalesContext';
import { useAdmin } from '../context/AdminContext';
import OfferGeneratorModal from './OfferGeneratorModal';

// Indian currency formatter
const formatIndianCurrency = (amount: number): string => {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
};

interface ExecutionPlanProps {
  month: MonthData;
}

export const ExecutionPlan: React.FC<ExecutionPlanProps> = ({ month }) => {
  const { 
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
    removeDuplicateCRMEvents,
    addCustomSection,
    updateCustomSection,
    deleteCustomSection
  } = useSalesData();
  const { isAdmin, setShowLoginModal } = useAdmin();
  const [editingMarketing, setEditingMarketing] = useState<string | null>(null);
  const [editingCRM, setEditingCRM] = useState<string | null>(null);

  // Helper function to handle non-admin interactions
  const requireAdmin = (action: () => void) => {
    if (isAdmin) {
      action();
    } else {
      setShowLoginModal(true);
    }
  };
  const [tempMarketing, setTempMarketing] = useState<Partial<MarketingCollateral>>({});
  const [tempCRM, setTempCRM] = useState<Partial<CRMTimeline>>({});
  const [showNewMarketing, setShowNewMarketing] = useState(false);
  const [showNewCRM, setShowNewCRM] = useState(false);
  const [newMarketing, setNewMarketing] = useState<Partial<MarketingCollateral>>({});
  const [newCRM, setNewCRM] = useState<Partial<CRMTimeline>>({});
  const [showNewCustomSection, setShowNewCustomSection] = useState(false);
  const [newSectionName, setNewSectionName] = useState('');
  const [newSectionData, setNewSectionData] = useState('');
  const [showOfferGenerator, setShowOfferGenerator] = useState(false);
  
  // Filter out cancelled offers
  const activeOffers = month.offers.filter(o => !o.cancelled);
  
  // Calculate revenue projections from each offer using location-specific units
  const calculateOfferRevenue = (offer: Offer): { mumbai: number; bengaluru: number; total: number; mumbaiUnits: number; bengaluruUnits: number } => {
    // Get location-specific units or fall back to targetUnits
    const targetUnitsMumbai = typeof (offer.targetUnitsMumbai || offer.targetUnits) === 'number' 
      ? (offer.targetUnitsMumbai || offer.targetUnits) as number
      : parseInt((offer.targetUnitsMumbai || offer.targetUnits) as string) || 0;
    
    const targetUnitsBengaluru = typeof (offer.targetUnitsBengaluru || offer.targetUnits) === 'number' 
      ? (offer.targetUnitsBengaluru || offer.targetUnits) as number
      : parseInt((offer.targetUnitsBengaluru || offer.targetUnits) as string) || 0;
    
    const mumbaiPrice = offer.finalPriceMumbai || offer.priceMumbai || 0;
    const bengaluruPrice = offer.finalPriceBengaluru || offer.priceBengaluru || 0;
    
    const mumbaiRevenue = mumbaiPrice * targetUnitsMumbai;
    const bengaluruRevenue = bengaluruPrice * targetUnitsBengaluru;
    
    return {
      mumbai: mumbaiRevenue,
      bengaluru: bengaluruRevenue,
      total: mumbaiRevenue + bengaluruRevenue,
      mumbaiUnits: targetUnitsMumbai,
      bengaluruUnits: targetUnitsBengaluru
    };
  };

  // Calculate total projected revenue
  const offerRevenues = activeOffers.map(offer => ({
    offer,
    revenue: calculateOfferRevenue(offer)
  }));

  const totalProjectedRevenue = offerRevenues.reduce((sum, item) => sum + item.revenue.total, 0);
  const totalMumbaiRevenue = offerRevenues.reduce((sum, item) => sum + item.revenue.mumbai, 0);
  const totalBengaluruRevenue = offerRevenues.reduce((sum, item) => sum + item.revenue.bengaluru, 0);
  
  // Parse target revenue (remove ₹, commas, and spaces, then convert to number)
  const parseRevenue = (revenueStr: string | undefined): number => {
    if (!revenueStr) return 0;
    const cleaned = revenueStr.replace(/[₹,\s]/g, '');
    return parseInt(cleaned) || 0;
  };
  
  const targetRevenue = parseRevenue(month.revenueTargetTotal);
  const revenueGap = targetRevenue - totalProjectedRevenue;
  const achievementPercent = targetRevenue > 0 ? Math.round((totalProjectedRevenue / targetRevenue) * 100) : 0;
  
  // Calculate total last year (2025) achievement from correct values
  // These values represent the actual 2025 performance across all three studios
  const kwality2025Total = 20.6 + 20.6 + 15.5 + 31.3 + 16.5 + 20.1 + 21.1 + 45.1 + 25.2 + 26.6 + 18.9 + 18.2; // ₹2.80Cr
  const supreme2025Total = 11.2 + 12.6 + 13.2 + 28.5 + 17.9 + 15.2 + 18.7 + 30.6 + 15.7 + 10.2 + 13.2 + 6.9; // ₹1.94Cr  
  const kenkere2025Total = 7.5 + 8.2 + 6.1 + 9.6 + 6.1 + 7.8 + 9.6 + 7.1 + 11.3 + 4.9 + 9.8 + 4.0; // ₹0.92Cr
  const totalLast2025Revenue = (kwality2025Total + supreme2025Total + kenkere2025Total) * 100000; // Convert to actual rupees

  // Helper functions to get month-specific revenue data
  const monthRevenue2025: { [studio: string]: { [month: string]: number } } = {
    'Kwality': {
      'January': 2060000, 'February': 2060000, 'March': 1550000, 'April': 3130000,
      'May': 1650000, 'June': 2010000, 'July': 2110000, 'August': 4510000,
      'September': 2520000, 'October': 2660000, 'November': 1890000, 'December': 1820000
    },
    'Supreme': {
      'January': 1120000, 'February': 1260000, 'March': 1320000, 'April': 2850000,
      'May': 1790000, 'June': 1520000, 'July': 1870000, 'August': 3060000,
      'September': 1570000, 'October': 1020000, 'November': 1320000, 'December': 690000
    },
    'Kenkere': {
      'January': 750000, 'February': 820000, 'March': 610000, 'April': 960000,
      'May': 610000, 'June': 780000, 'July': 960000, 'August': 710000,
      'September': 1130000, 'October': 490000, 'November': 980000, 'December': 400000
    }
  };

  const monthRevenue2026: { [studio: string]: { [month: string]: number } } = {
    'Kwality': {
      'January': 2520000, 'February': 2360000, 'March': 2520000, 'April': 3110000,
      'May': 3400000, 'June': 3190000, 'July': 3600000, 'August': 3330000,
      'September': 3950000, 'October': 3140000, 'November': 3110000, 'December': 3110000
    },
    'Supreme': {
      'January': 1830000, 'February': 1770000, 'March': 2110000, 'April': 2620000,
      'May': 2710000, 'June': 2850000, 'July': 2850000, 'August': 2850000,
      'September': 2300000, 'October': 1920000, 'November': 2100000, 'December': 1460000
    },
    'Kenkere': {
      'January': 1080000, 'February': 940000, 'March': 1000000, 'April': 1030000,
      'May': 1030000, 'June': 1120000, 'July': 1270000, 'August': 1060000,
      'September': 1060000, 'October': 920000, 'November': 1060000, 'December': 680000
    }
  };

  const getMonthRevenue2025 = (studio: string, monthName: string): number => {
    return monthRevenue2025[studio]?.[monthName] || 0;
  };

  const getMonthRevenue2026 = (studio: string, monthName: string): number => {
    return monthRevenue2026[studio]?.[monthName] || 0;
  };

  // Helper function to parse dates like "Jan 15, 2026"
  const parseDate = (dateStr: string): number => {
    try {
      return new Date(dateStr).getTime();
    } catch {
      return 0;
    }
  };

  // Helper to regenerate marketing collateral from current offer selections
  const regenerateMarketingCollateral = (): MarketingCollateral[] => {
    const newMarketingCollateral: MarketingCollateral[] = [];
    
    // Helper to get specific dates based on month
    const getMonthDates = (monthName: string) => {
      const monthMap: { [key: string]: { launch: string; prelaunched: string; adsStart: string; adsEnd: string } } = {
        'January': { launch: 'Jan 15, 2026', prelaunched: 'Jan 10, 2026', adsStart: 'Jan 15, 2026', adsEnd: 'Jan 31, 2026' },
        'February': { launch: 'Feb 10, 2026', prelaunched: 'Feb 5, 2026', adsStart: 'Feb 10, 2026', adsEnd: 'Feb 28, 2026' },
        'March': { launch: 'Mar 12, 2026', prelaunched: 'Mar 7, 2026', adsStart: 'Mar 12, 2026', adsEnd: 'Mar 31, 2026' },
        'April': { launch: 'Apr 10, 2026', prelaunched: 'Apr 5, 2026', adsStart: 'Apr 10, 2026', adsEnd: 'Apr 30, 2026' },
        'May': { launch: 'May 12, 2026', prelaunched: 'May 7, 2026', adsStart: 'May 12, 2026', adsEnd: 'May 31, 2026' },
        'June': { launch: 'Jun 10, 2026', prelaunched: 'Jun 5, 2026', adsStart: 'Jun 10, 2026', adsEnd: 'Jun 30, 2026' },
        'July': { launch: 'Jul 12, 2026', prelaunched: 'Jul 7, 2026', adsStart: 'Jul 12, 2026', adsEnd: 'Jul 31, 2026' },
        'August': { launch: 'Aug 10, 2026', prelaunched: 'Aug 5, 2026', adsStart: 'Aug 10, 2026', adsEnd: 'Aug 31, 2026' },
        'September': { launch: 'Sep 10, 2026', prelaunched: 'Sep 5, 2026', adsStart: 'Sep 10, 2026', adsEnd: 'Sep 30, 2026' },
        'October': { launch: 'Oct 12, 2026', prelaunched: 'Oct 7, 2026', adsStart: 'Oct 12, 2026', adsEnd: 'Oct 31, 2026' },
        'November': { launch: 'Nov 10, 2026', prelaunched: 'Nov 5, 2026', adsStart: 'Nov 10, 2026', adsEnd: 'Nov 30, 2026' },
        'December': { launch: 'Dec 10, 2026', prelaunched: 'Dec 5, 2026', adsStart: 'Dec 10, 2026', adsEnd: 'Dec 31, 2026' }
      };
      return monthMap[monthName] || monthMap['January'];
    };
    
    const monthDates = getMonthDates(month.name);
    
    // Helper to generate creative messaging based on offer
    const generateCreativeMessaging = (offer: Offer, medium: string): string => {
      const theme = month.theme.toLowerCase();
      let messaging = '';
      
      if (medium === 'Email Marketing') {
        messaging = `Subject line highlighting ${offer.type.toLowerCase()} offer. Feature ${theme} theme imagery. Clear CTA button. Include offer details without specific pricing.`;
      } else if (medium === 'WhatsApp Broadcast') {
        messaging = `Short, engaging message with ${theme} theme. Include offer highlight and booking link. Max 2-3 lines. Friendly, conversational tone.`;
      } else if (medium === 'Physical Posters' || medium === 'Tent Cards') {
        messaging = `Bold headline with ${theme} visuals. Highlight key benefit of ${offer.type.toLowerCase()} offer. Large, easy-to-read text. QR code for booking.`;
      } else if (medium === 'Meta Ads Platform' || medium === 'Instagram' || medium === 'Facebook') {
        messaging = `Eye-catching ${theme} themed imagery. Carousel or single image. Emphasize transformation/results. CTA: Book Now. Target: fitness enthusiasts aged 25-45.`;
      }
      
      return messaging || `${theme} themed creative highlighting ${offer.title}. Focus on benefits, not pricing.`;
    };
    
    activeOffers.forEach(offer => {
      // Generate marketing collateral based on checkbox selections
      if (offer.collateralChannels || offer.collateralTypes) {
        const channels = offer.collateralChannels || {};
        const types = offer.collateralTypes || {};
        
        // Generate collateral items for each selected combination
        if (channels.whatsapp && (types.imageCreative || types.socialPosts)) {
          newMarketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: `WhatsApp ${types.imageCreative ? 'Image Creative' : 'Social Post'}`,
            type: 'WhatsApp Campaign',
            medium: 'WhatsApp Broadcast',
            messaging: generateCreativeMessaging(offer, 'WhatsApp Broadcast'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.email && (types.emailTemplate || types.imageCreative)) {
          newMarketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: `Email ${types.emailTemplate ? 'Template' : 'Creative'}`,
            type: 'Email Campaign',
            medium: 'Email Marketing',
            messaging: generateCreativeMessaging(offer, 'Email Marketing'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.inStudio && (types.tentCards || types.easelStandee)) {
          newMarketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: `${types.tentCards ? 'Tent Cards' : ''} ${types.easelStandee ? 'Easel Standee' : ''}`.trim(),
            type: 'In-Studio Materials',
            medium: 'Physical Display',
            messaging: generateCreativeMessaging(offer, 'Physical Posters'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.socialMedia && (types.socialPosts || types.storyTemplate || types.imageCreative || types.videoCreative)) {
          const creativeTypes = [];
          if (types.socialPosts) creativeTypes.push('Social Posts');
          if (types.storyTemplate) creativeTypes.push('Story Template');
          if (types.imageCreative) creativeTypes.push('Image Creative');
          if (types.videoCreative) creativeTypes.push('Video Creative');
          
          newMarketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: creativeTypes.join(', '),
            type: 'Social Media Content',
            medium: 'Organic Social',
            messaging: generateCreativeMessaging(offer, 'Instagram'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.metaAds && (types.imageCreative || types.videoCreative)) {
          newMarketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: `Meta Ads ${types.videoCreative ? 'Video' : 'Image'} Creative`,
            type: 'Paid Social Ads',
            medium: 'Meta Ads Platform',
            messaging: generateCreativeMessaging(offer, 'Meta Ads Platform'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.website && types.landingPage) {
          newMarketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: 'Landing Page Design & Copy',
            type: 'Website Content',
            medium: 'Website',
            messaging: generateCreativeMessaging(offer, 'Website'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
      }
    });
    
    return newMarketingCollateral;
  };
  
  // Helper to regenerate CRM timeline from current offer selections
  const regenerateCRMTimeline = (): CRMTimeline[] => {
    const newCrmTimeline: CRMTimeline[] = [];
    
    // Helper to get specific dates based on month
    const getMonthDates = (monthName: string) => {
      const monthMap: { [key: string]: { launch: string; prelaunched: string; adsStart: string; adsEnd: string } } = {
        'January': { launch: 'Jan 15, 2026', prelaunched: 'Jan 10, 2026', adsStart: 'Jan 15, 2026', adsEnd: 'Jan 31, 2026' },
        'February': { launch: 'Feb 10, 2026', prelaunched: 'Feb 5, 2026', adsStart: 'Feb 10, 2026', adsEnd: 'Feb 28, 2026' },
        'March': { launch: 'Mar 12, 2026', prelaunched: 'Mar 7, 2026', adsStart: 'Mar 12, 2026', adsEnd: 'Mar 31, 2026' },
        'April': { launch: 'Apr 10, 2026', prelaunched: 'Apr 5, 2026', adsStart: 'Apr 10, 2026', adsEnd: 'Apr 30, 2026' },
        'May': { launch: 'May 12, 2026', prelaunched: 'May 7, 2026', adsStart: 'May 12, 2026', adsEnd: 'May 31, 2026' },
        'June': { launch: 'Jun 10, 2026', prelaunched: 'Jun 5, 2026', adsStart: 'Jun 10, 2026', adsEnd: 'Jun 30, 2026' },
        'July': { launch: 'Jul 12, 2026', prelaunched: 'Jul 7, 2026', adsStart: 'Jul 12, 2026', adsEnd: 'Jul 31, 2026' },
        'August': { launch: 'Aug 10, 2026', prelaunched: 'Aug 5, 2026', adsStart: 'Aug 10, 2026', adsEnd: 'Aug 31, 2026' },
        'September': { launch: 'Sep 10, 2026', prelaunched: 'Sep 5, 2026', adsStart: 'Sep 10, 2026', adsEnd: 'Sep 30, 2026' },
        'October': { launch: 'Oct 12, 2026', prelaunched: 'Oct 7, 2026', adsStart: 'Oct 12, 2026', adsEnd: 'Oct 31, 2026' },
        'November': { launch: 'Nov 10, 2026', prelaunched: 'Nov 5, 2026', adsStart: 'Nov 10, 2026', adsEnd: 'Nov 30, 2026' },
        'December': { launch: 'Dec 10, 2026', prelaunched: 'Dec 5, 2026', adsStart: 'Dec 10, 2026', adsEnd: 'Dec 31, 2026' }
      };
      return monthMap[monthName] || monthMap['January'];
    };
    
    const monthDates = getMonthDates(month.name);
    
    // Helper to generate creative messaging based on offer
    const generateCreativeMessaging = (offer: Offer, medium: string): string => {
      const theme = month.theme.toLowerCase();
      let messaging = '';
      
      if (medium === 'Email Marketing') {
        messaging = `Subject line highlighting ${offer.type.toLowerCase()} offer. Feature ${theme} theme imagery. Clear CTA button. Include offer details without specific pricing.`;
      } else if (medium === 'WhatsApp Broadcast') {
        messaging = `Short, engaging message with ${theme} theme. Include offer highlight and booking link. Max 2-3 lines. Friendly, conversational tone.`;
      } else if (medium === 'Meta Ads Platform' || medium === 'Instagram' || medium === 'Facebook') {
        messaging = `Eye-catching ${theme} themed imagery. Carousel or single image. Emphasize transformation/results. CTA: Book Now. Target: fitness enthusiasts aged 25-45.`;
      }
      
      return messaging || `${theme} themed creative highlighting ${offer.title}. Focus on benefits, not pricing.`;
    };
    
    activeOffers.forEach(offer => {
      // Generate CRM timeline based on checkbox selections
      if (offer.collateralChannels) {
        const channels = offer.collateralChannels;
        
        if (channels.metaAds) {
          newCrmTimeline.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: generateCreativeMessaging(offer, 'Meta Ads Platform'),
            sendDate: monthDates.launch,
            adsStartDate: monthDates.adsStart,
            adsEndDate: monthDates.adsEnd
          });
        }
        
        if (channels.email) {
          newCrmTimeline.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: generateCreativeMessaging(offer, 'Email Marketing'),
            sendDate: monthDates.prelaunched
          });
        }
        
        if (channels.whatsapp) {
          newCrmTimeline.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: generateCreativeMessaging(offer, 'WhatsApp Broadcast'),
            sendDate: monthDates.launch
          });
        }
        
        if (channels.socialMedia) {
          newCrmTimeline.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: `Organic social media posts featuring ${offer.title}. ${month.theme} themed content with engaging visuals and clear CTA.`,
            sendDate: monthDates.prelaunched
          });
        }
      }
    });
    
    return newCrmTimeline;
  };
  
  // Watch for changes in offer collateral selections and regenerate both marketing and CRM
  useEffect(() => {
    if (month.marketingCollateral !== undefined) {
      const newCollateral = regenerateMarketingCollateral();
      // Only update if there are actual changes
      const currentCollateralStr = JSON.stringify(month.marketingCollateral.map(c => ({offer: c.offer, type: c.type, collateralNeeded: c.collateralNeeded})));
      const newCollateralStr = JSON.stringify(newCollateral.map(c => ({offer: c.offer, type: c.type, collateralNeeded: c.collateralNeeded})));
      
      if (currentCollateralStr !== newCollateralStr) {
        setMonthMarketingCollateral(month.id, newCollateral);
      }
    }
    
    if (month.crmTimeline !== undefined) {
      const newCrmTimeline = regenerateCRMTimeline();
      // Only update if there are actual changes
      const currentCrmStr = JSON.stringify(month.crmTimeline.map(c => ({offer: c.offer, content: c.content, sendDate: c.sendDate})));
      const newCrmStr = JSON.stringify(newCrmTimeline.map(c => ({offer: c.offer, content: c.content, sendDate: c.sendDate})));
      
      if (currentCrmStr !== newCrmStr) {
        setMonthCRMTimeline(month.id, newCrmTimeline);
      }
    }
  }, [JSON.stringify(activeOffers.map(o => ({ id: o.id, collateralChannels: o.collateralChannels, collateralTypes: o.collateralTypes })))]);
  
  // Use stored marketing collateral or generate from offers
  const marketingCollateral: MarketingCollateral[] = month.marketingCollateral || [];
  
  // Group marketing collateral by offer name
  const groupedMarketing = marketingCollateral.reduce((groups: { [key: string]: MarketingCollateral[] }, item) => {
    const offerName = item.offer || 'Unknown Offer';
    if (!groups[offerName]) {
      groups[offerName] = [];
    }
    groups[offerName].push(item);
    return groups;
  }, {});
  
  // Remove duplicates from CRM timeline before displaying
  const removeDuplicatesFromArray = (timeline: CRMTimeline[]): CRMTimeline[] => {
    const seen = new Map<string, CRMTimeline>();
    
    timeline.forEach(event => {
      // Create a more comprehensive key for duplicate detection
      const key = `${event.offer?.trim().toLowerCase()}-${event.sendDate?.trim()}-${event.content?.substring(0, 50).trim().toLowerCase()}`;
      
      // Keep the first occurrence of each unique event
      if (!seen.has(key)) {
        seen.set(key, event);
      }
    });
    
    return Array.from(seen.values());
  };
  
  const rawCrmTimeline: CRMTimeline[] = month.crmTimeline || [];
  const crmTimeline: CRMTimeline[] = removeDuplicatesFromArray(rawCrmTimeline);
  
  // Auto-cleanup: If we found duplicates, update the stored data
  useEffect(() => {
    if (rawCrmTimeline.length > crmTimeline.length) {
      console.log(`Removed ${rawCrmTimeline.length - crmTimeline.length} duplicate CRM events`);
      setMonthCRMTimeline(month.id, crmTimeline);
    }
  }, [rawCrmTimeline.length, crmTimeline.length, month.id]);
  
  // Generate marketing collateral from offers only if never initialized (undefined), not if empty array (user deleted all)
  if (month.marketingCollateral === undefined) {
    // Helper to get specific dates based on month
    const getMonthDates = (monthName: string) => {
      const monthMap: { [key: string]: { launch: string; prelaunched: string; adsStart: string; adsEnd: string } } = {
        'January': { launch: 'Jan 15, 2026', prelaunched: 'Jan 10, 2026', adsStart: 'Jan 15, 2026', adsEnd: 'Jan 31, 2026' },
        'February': { launch: 'Feb 10, 2026', prelaunched: 'Feb 5, 2026', adsStart: 'Feb 10, 2026', adsEnd: 'Feb 28, 2026' },
        'March': { launch: 'Mar 12, 2026', prelaunched: 'Mar 7, 2026', adsStart: 'Mar 12, 2026', adsEnd: 'Mar 31, 2026' },
        'April': { launch: 'Apr 10, 2026', prelaunched: 'Apr 5, 2026', adsStart: 'Apr 10, 2026', adsEnd: 'Apr 30, 2026' },
        'May': { launch: 'May 12, 2026', prelaunched: 'May 7, 2026', adsStart: 'May 12, 2026', adsEnd: 'May 31, 2026' },
        'June': { launch: 'Jun 10, 2026', prelaunched: 'Jun 5, 2026', adsStart: 'Jun 10, 2026', adsEnd: 'Jun 30, 2026' },
        'July': { launch: 'Jul 12, 2026', prelaunched: 'Jul 7, 2026', adsStart: 'Jul 12, 2026', adsEnd: 'Jul 31, 2026' },
        'August': { launch: 'Aug 10, 2026', prelaunched: 'Aug 5, 2026', adsStart: 'Aug 10, 2026', adsEnd: 'Aug 31, 2026' },
        'September': { launch: 'Sep 10, 2026', prelaunched: 'Sep 5, 2026', adsStart: 'Sep 10, 2026', adsEnd: 'Sep 30, 2026' },
        'October': { launch: 'Oct 12, 2026', prelaunched: 'Oct 7, 2026', adsStart: 'Oct 12, 2026', adsEnd: 'Oct 31, 2026' },
        'November': { launch: 'Nov 10, 2026', prelaunched: 'Nov 5, 2026', adsStart: 'Nov 10, 2026', adsEnd: 'Nov 30, 2026' },
        'December': { launch: 'Dec 10, 2026', prelaunched: 'Dec 5, 2026', adsStart: 'Dec 10, 2026', adsEnd: 'Dec 31, 2026' }
      };
      return monthMap[monthName] || monthMap['January'];
    };
    
    const monthDates = getMonthDates(month.name);
    
    // Helper to generate creative messaging based on offer
    const generateCreativeMessaging = (offer: Offer, medium: string): string => {
      const theme = month.theme.toLowerCase();
      let messaging = '';
      
      // Base messaging on medium and offer type
      if (medium === 'Email Marketing') {
        messaging = `Subject line highlighting ${offer.type.toLowerCase()} offer. Feature ${theme} theme imagery. Clear CTA button. Include offer details without specific pricing.`;
      } else if (medium === 'WhatsApp Broadcast') {
        messaging = `Short, engaging message with ${theme} theme. Include offer highlight and booking link. Max 2-3 lines. Friendly, conversational tone.`;
      } else if (medium === 'Physical Posters' || medium === 'Tent Cards') {
        messaging = `Bold headline with ${theme} visuals. Highlight key benefit of ${offer.type.toLowerCase()} offer. Large, easy-to-read text. QR code for booking.`;
      } else if (medium === 'Meta Ads Platform' || medium === 'Instagram' || medium === 'Facebook') {
        messaging = `Eye-catching ${theme} themed imagery. Carousel or single image. Emphasize transformation/results. CTA: Book Now. Target: fitness enthusiasts aged 25-45.`;
      }
      
      return messaging || `${theme} themed creative highlighting ${offer.title}. Focus on benefits, not pricing.`;
    };
    
    activeOffers.forEach(offer => {
      // Generate marketing collateral based on checkbox selections first
      if (offer.collateralChannels || offer.collateralTypes) {
        const channels = offer.collateralChannels || {};
        const types = offer.collateralTypes || {};
        
        // Generate collateral items for each selected combination
        if (channels.whatsapp && (types.imageCreative || types.socialPosts)) {
          marketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: `WhatsApp ${types.imageCreative ? 'Image Creative' : 'Social Post'}`,
            type: 'WhatsApp Campaign',
            medium: 'WhatsApp Broadcast',
            messaging: generateCreativeMessaging(offer, 'WhatsApp Broadcast'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.email && (types.emailTemplate || types.imageCreative)) {
          marketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: `Email ${types.emailTemplate ? 'Template' : 'Creative'}`,
            type: 'Email Campaign',
            medium: 'Email Marketing',
            messaging: generateCreativeMessaging(offer, 'Email Marketing'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.inStudio && (types.tentCards || types.easelStandee)) {
          marketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: `${types.tentCards ? 'Tent Cards' : ''} ${types.easelStandee ? 'Easel Standee' : ''}`.trim(),
            type: 'In-Studio Materials',
            medium: 'Physical Display',
            messaging: generateCreativeMessaging(offer, 'Physical Posters'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.socialMedia && (types.socialPosts || types.storyTemplate || types.imageCreative || types.videoCreative)) {
          const creativeTypes = [];
          if (types.socialPosts) creativeTypes.push('Social Posts');
          if (types.storyTemplate) creativeTypes.push('Story Template');
          if (types.imageCreative) creativeTypes.push('Image Creative');
          if (types.videoCreative) creativeTypes.push('Video Creative');
          
          marketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: creativeTypes.join(', '),
            type: 'Social Media Content',
            medium: 'Organic Social',
            messaging: generateCreativeMessaging(offer, 'Instagram'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.metaAds && (types.imageCreative || types.videoCreative)) {
          marketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: `Meta Ads ${types.videoCreative ? 'Video' : 'Image'} Creative`,
            type: 'Paid Social Ads',
            medium: 'Meta Ads Platform',
            messaging: generateCreativeMessaging(offer, 'Meta Ads Platform'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
        
        if (channels.website && types.landingPage) {
          marketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded: 'Landing Page Design & Copy',
            type: 'Website Content',
            medium: 'Website',
            messaging: generateCreativeMessaging(offer, 'Website'),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        }
      }
      
      // Fallback: Generate from legacy marketingCollateral text field if no checkboxes selected
      else if (offer.marketingCollateral) {
        const content = offer.marketingCollateral;
        const lowerContent = content.toLowerCase();
        
        // Skip website/landing page entries
        if (lowerContent.includes('landing page') || lowerContent.includes('website')) {
          return;
        }
        
        // Create separate entries for each collateral type mentioned
        const collateralTypes: Array<{ type: string; medium: string; collateralNeeded: string }> = [];
        
        if (lowerContent.includes('email')) {
          collateralTypes.push({
            type: 'Email Campaign',
            medium: 'Email Marketing',
            collateralNeeded: 'Email design with HTML template'
          });
        }
        
        if (lowerContent.includes('whatsapp')) {
          collateralTypes.push({
            type: 'WhatsApp Blast',
            medium: 'WhatsApp Broadcast',
            collateralNeeded: 'WhatsApp image with text overlay'
          });
        }
        
        if (lowerContent.includes('poster') || lowerContent.includes('easel')) {
          collateralTypes.push({
            type: 'In-Studio Materials',
            medium: 'Physical Posters',
            collateralNeeded: 'A3 poster design (print-ready)'
          });
        }
        
        if (lowerContent.includes('tent card')) {
          collateralTypes.push({
            type: 'In-Studio Materials',
            medium: 'Tent Cards',
            collateralNeeded: 'Tent card design (front desk)'
          });
        }
        
        if (lowerContent.includes('meta ads') || lowerContent.includes('instagram') || lowerContent.includes('facebook')) {
          collateralTypes.push({
            type: 'Social Media Ads',
            medium: 'Meta Ads Platform',
            collateralNeeded: 'Square (1080x1080) and Story (1080x1920) formats'
          });
        }
        
        // If no specific types found, create one generic entry
        if (collateralTypes.length === 0) {
          collateralTypes.push({
            type: 'Mixed Media',
            medium: 'Multi-channel',
            collateralNeeded: content.split(',')[0] || content.substring(0, 50)
          });
        }
        
        // Create separate marketing collateral entry for each type
        collateralTypes.forEach(({ type, medium, collateralNeeded }) => {
          marketingCollateral.push({
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            collateralNeeded,
            type,
            medium,
            messaging: generateCreativeMessaging(offer, medium),
            dueDate: monthDates.prelaunched,
            notes: offer.whyItWorks || ''
          });
        });
      }
    });
    
    // Persist generated marketing collateral data to database
    setMonthMarketingCollateral(month.id, marketingCollateral);
  }

  // Generate CRM timeline from offers only if never initialized (undefined), not if empty array (user deleted all)
  if (month.crmTimeline === undefined) {
    // Helper to get specific dates based on month
    const getMonthDates = (monthName: string) => {
      const monthMap: { [key: string]: { launch: string; prelaunched: string; adsStart: string; adsEnd: string } } = {
        'January': { launch: 'Jan 15, 2026', prelaunched: 'Jan 10, 2026', adsStart: 'Jan 15, 2026', adsEnd: 'Jan 31, 2026' },
        'February': { launch: 'Feb 10, 2026', prelaunched: 'Feb 5, 2026', adsStart: 'Feb 10, 2026', adsEnd: 'Feb 28, 2026' },
        'March': { launch: 'Mar 12, 2026', prelaunched: 'Mar 7, 2026', adsStart: 'Mar 12, 2026', adsEnd: 'Mar 31, 2026' },
        'April': { launch: 'Apr 10, 2026', prelaunched: 'Apr 5, 2026', adsStart: 'Apr 10, 2026', adsEnd: 'Apr 30, 2026' },
        'May': { launch: 'May 12, 2026', prelaunched: 'May 7, 2026', adsStart: 'May 12, 2026', adsEnd: 'May 31, 2026' },
        'June': { launch: 'Jun 10, 2026', prelaunched: 'Jun 5, 2026', adsStart: 'Jun 10, 2026', adsEnd: 'Jun 30, 2026' },
        'July': { launch: 'Jul 12, 2026', prelaunched: 'Jul 7, 2026', adsStart: 'Jul 12, 2026', adsEnd: 'Jul 31, 2026' },
        'August': { launch: 'Aug 10, 2026', prelaunched: 'Aug 5, 2026', adsStart: 'Aug 10, 2026', adsEnd: 'Aug 31, 2026' },
        'September': { launch: 'Sep 10, 2026', prelaunched: 'Sep 5, 2026', adsStart: 'Sep 10, 2026', adsEnd: 'Sep 30, 2026' },
        'October': { launch: 'Oct 12, 2026', prelaunched: 'Oct 7, 2026', adsStart: 'Oct 12, 2026', adsEnd: 'Oct 31, 2026' },
        'November': { launch: 'Nov 10, 2026', prelaunched: 'Nov 5, 2026', adsStart: 'Nov 10, 2026', adsEnd: 'Nov 30, 2026' },
        'December': { launch: 'Dec 10, 2026', prelaunched: 'Dec 5, 2026', adsStart: 'Dec 10, 2026', adsEnd: 'Dec 31, 2026' }
      };
      return monthMap[monthName] || monthMap['January'];
    };
    
    const monthDates = getMonthDates(month.name);
    
    // Helper to generate creative messaging based on offer
    const generateCreativeMessaging = (offer: Offer, medium: string): string => {
      const theme = month.theme.toLowerCase();
      let messaging = '';
      
      // Base messaging on medium and offer type
      if (medium === 'Email Marketing') {
        messaging = `Subject line highlighting ${offer.type.toLowerCase()} offer. Feature ${theme} theme imagery. Clear CTA button. Include offer details without specific pricing.`;
      } else if (medium === 'WhatsApp Broadcast') {
        messaging = `Short, engaging message with ${theme} theme. Include offer highlight and booking link. Max 2-3 lines. Friendly, conversational tone.`;
      } else if (medium === 'Physical Posters' || medium === 'Tent Cards') {
        messaging = `Bold headline with ${theme} visuals. Highlight key benefit of ${offer.type.toLowerCase()} offer. Large, easy-to-read text. QR code for booking.`;
      } else if (medium === 'Meta Ads Platform' || medium === 'Instagram' || medium === 'Facebook') {
        messaging = `Eye-catching ${theme} themed imagery. Carousel or single image. Emphasize transformation/results. CTA: Book Now. Target: fitness enthusiasts aged 25-45.`;
      }
      
      return messaging || `${theme} themed creative highlighting ${offer.title}. Focus on benefits, not pricing.`;
    };
    
    activeOffers.forEach(offer => {
      // Generate CRM timeline based on checkbox selections first
      if (offer.collateralChannels) {
        const channels = offer.collateralChannels;
        
        if (channels.metaAds) {
          const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: generateCreativeMessaging(offer, 'Meta Ads Platform'),
            sendDate: monthDates.launch,
            adsStartDate: monthDates.adsStart,
            adsEndDate: monthDates.adsEnd
          };
          
          const exists = crmTimeline.some(event => 
            event.offer?.trim().toLowerCase() === newEvent.offer?.trim().toLowerCase() && 
            event.sendDate?.trim() === newEvent.sendDate?.trim() &&
            event.content?.substring(0, 50).trim().toLowerCase() === newEvent.content?.substring(0, 50).trim().toLowerCase()
          );
          
          if (!exists) {
            crmTimeline.push(newEvent);
          }
        }
        
        if (channels.email) {
          const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: generateCreativeMessaging(offer, 'Email Marketing'),
            sendDate: monthDates.prelaunched
          };
          
          const exists = crmTimeline.some(event => 
            event.offer?.trim().toLowerCase() === newEvent.offer?.trim().toLowerCase() && 
            event.sendDate?.trim() === newEvent.sendDate?.trim() &&
            event.content?.substring(0, 50).trim().toLowerCase() === newEvent.content?.substring(0, 50).trim().toLowerCase()
          );
          
          if (!exists) {
            crmTimeline.push(newEvent);
          }
        }
        
        if (channels.whatsapp) {
          const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: generateCreativeMessaging(offer, 'WhatsApp Broadcast'),
            sendDate: monthDates.launch
          };
          
          const exists = crmTimeline.some(event => 
            event.offer?.trim().toLowerCase() === newEvent.offer?.trim().toLowerCase() && 
            event.sendDate?.trim() === newEvent.sendDate?.trim() &&
            event.content?.substring(0, 50).trim().toLowerCase() === newEvent.content?.substring(0, 50).trim().toLowerCase()
          );
          
          if (!exists) {
            crmTimeline.push(newEvent);
          }
        }
      }
      
      // Fallback: Generate from legacy marketingCollateral text field if no checkboxes selected
      else if (offer.marketingCollateral) {
        const content = offer.marketingCollateral;
        const lowerContent = content.toLowerCase();
        
        // Add to CRM timeline with specific dates - check for duplicates
        if (lowerContent.includes('meta ads') || lowerContent.includes('instagram') || lowerContent.includes('facebook') || lowerContent.includes('google ads')) {
          const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: generateCreativeMessaging(offer, 'Meta Ads Platform'),
            sendDate: monthDates.launch,
            adsStartDate: monthDates.adsStart,
            adsEndDate: monthDates.adsEnd
          };
          
          // More robust duplicate check
          const exists = crmTimeline.some(event => 
            event.offer?.trim().toLowerCase() === newEvent.offer?.trim().toLowerCase() && 
            event.sendDate?.trim() === newEvent.sendDate?.trim() &&
            event.content?.substring(0, 50).trim().toLowerCase() === newEvent.content?.substring(0, 50).trim().toLowerCase()
          );
          
          if (!exists) {
            crmTimeline.push(newEvent);
          }
        }
        
        if (lowerContent.includes('email')) {
          const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: generateCreativeMessaging(offer, 'Email Marketing'),
            sendDate: monthDates.prelaunched
          };
          
          // More robust duplicate check
          const exists = crmTimeline.some(event => 
            event.offer?.trim().toLowerCase() === newEvent.offer?.trim().toLowerCase() && 
            event.sendDate?.trim() === newEvent.sendDate?.trim() &&
            event.content?.substring(0, 50).trim().toLowerCase() === newEvent.content?.substring(0, 50).trim().toLowerCase()
          );
          
          if (!exists) {
            crmTimeline.push(newEvent);
          }
        }
        
        if (lowerContent.includes('whatsapp')) {
          const newEvent = {
            id: Math.random().toString(36).substr(2, 9),
            offer: offer.title,
            content: generateCreativeMessaging(offer, 'WhatsApp Broadcast'),
            sendDate: monthDates.launch
          };
          
          // More robust duplicate check
          const exists = crmTimeline.some(event => 
            event.offer?.trim().toLowerCase() === newEvent.offer?.trim().toLowerCase() && 
            event.sendDate?.trim() === newEvent.sendDate?.trim() &&
            event.content?.substring(0, 50).trim().toLowerCase() === newEvent.content?.substring(0, 50).trim().toLowerCase()
          );
          
          if (!exists) {
            crmTimeline.push(newEvent);
          }
        }
      }
    });
    
    // Persist generated CRM timeline data to database
    setMonthCRMTimeline(month.id, crmTimeline);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <Target className="w-5 h-5 text-gray-700" />
        </div>
        <div>
          <h3 className="text-2xl font-serif font-bold text-gray-900">Sales Execution Plan</h3>
          <p className="text-sm text-gray-500">Revenue projections & sales targets breakdown</p>
        </div>
      </div>

      {/* Consolidated Revenue Dashboard */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 mb-8 border border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-2xl font-bold text-slate-800">{month.name} Revenue Dashboard</h4>
            <p className="text-base text-slate-600">Financial targets, performance metrics & revenue breakdown</p>
          </div>
        </div>

        {/* Performance Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Card 1: Month Target */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Target</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-2">{formatIndianCurrency(targetRevenue)}</div>
            <div className="text-sm text-slate-600">Monthly target</div>
          </div>

          {/* Card 2: Last Year Achievement */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Last Year</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-2">
              {formatIndianCurrency(
                getMonthRevenue2025('Kwality', month.name) + 
                getMonthRevenue2025('Supreme', month.name) + 
                getMonthRevenue2025('Kenkere', month.name)
              )}
            </div>
            <div className="text-sm text-slate-600">2025 {month.name}</div>
          </div>

          {/* Card 3: Projected Revenue */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Projected</span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-2">{formatIndianCurrency(totalProjectedRevenue)}</div>
            <div className="text-sm text-slate-600">Based on offers</div>
          </div>

          {/* Card 4: Sale Deficit */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                revenueGap > 0 ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <Users className={`w-4 h-4 ${
                  revenueGap > 0 ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                {revenueGap > 0 ? 'Deficit' : 'Surplus'}
              </span>
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-2">
              {formatIndianCurrency(Math.abs(revenueGap))}
            </div>
            <div className={`text-sm ${
              revenueGap > 0 ? 'text-red-600' : 'text-green-600'
            }`}>
              {revenueGap > 0 ? 'Sales needed' : 'Above target'}
            </div>
          </div>
        </div>
        
        {/* Monthly Financial Targets Table */}
        <div className="bg-white rounded-xl border-2 border-indigo-200 overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b-2 border-indigo-200">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Studio Location</th>
                  <th className="px-5 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">2025 Achievement</th>
                  <th className="px-5 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">2026 Target</th>
                  <th className="px-5 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Growth %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {/* Kwality House Row */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Kwality House</div>
                        <div className="text-xs text-gray-600">Mumbai</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-medium text-gray-700">
                    {formatIndianCurrency(getMonthRevenue2025('Kwality', month.name))}
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatIndianCurrency(getMonthRevenue2026('Kwality', month.name))}
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-bold text-green-700">
                    {((getMonthRevenue2026('Kwality', month.name) - getMonthRevenue2025('Kwality', month.name)) / getMonthRevenue2025('Kwality', month.name) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* Supreme HQ Row */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Supreme HQ</div>
                        <div className="text-xs text-gray-600">Mumbai</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-medium text-gray-700">
                    {formatIndianCurrency(getMonthRevenue2025('Supreme', month.name))}
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatIndianCurrency(getMonthRevenue2026('Supreme', month.name))}
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-bold text-green-700">
                    {((getMonthRevenue2026('Supreme', month.name) - getMonthRevenue2025('Supreme', month.name)) / getMonthRevenue2025('Supreme', month.name) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* Kenkere House Row */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">Kenkere House</div>
                        <div className="text-xs text-gray-600">Bangalore</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-medium text-gray-700">
                    {formatIndianCurrency(getMonthRevenue2025('Kenkere', month.name))}
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-semibold text-gray-900">
                    {formatIndianCurrency(getMonthRevenue2026('Kenkere', month.name))}
                  </td>
                  <td className="px-5 py-4 text-center text-sm font-bold text-green-700">
                    {((getMonthRevenue2026('Kenkere', month.name) - getMonthRevenue2025('Kenkere', month.name)) / getMonthRevenue2025('Kenkere', month.name) * 100).toFixed(1)}%
                  </td>
                </tr>

                {/* Total Row */}
                <tr className="bg-indigo-50 font-bold border-t-2 border-indigo-200">
                  <td className="px-5 py-5 text-indigo-900 text-sm">TOTAL</td>
                  <td className="px-5 py-5 text-center text-sm text-indigo-900">
                    {formatIndianCurrency(
                      getMonthRevenue2025('Kwality', month.name) + 
                      getMonthRevenue2025('Supreme', month.name) + 
                      getMonthRevenue2025('Kenkere', month.name)
                    )}
                  </td>
                  <td className="px-5 py-5 text-center text-sm text-indigo-900">
                    {formatIndianCurrency(
                      getMonthRevenue2026('Kwality', month.name) + 
                      getMonthRevenue2026('Supreme', month.name) + 
                      getMonthRevenue2026('Kenkere', month.name)
                    )}
                  </td>
                  <td className="px-5 py-5 text-center text-sm text-green-800">
                    {(((getMonthRevenue2026('Kwality', month.name) + getMonthRevenue2026('Supreme', month.name) + getMonthRevenue2026('Kenkere', month.name)) - 
                       (getMonthRevenue2025('Kwality', month.name) + getMonthRevenue2025('Supreme', month.name) + getMonthRevenue2025('Kenkere', month.name))) / 
                       (getMonthRevenue2025('Kwality', month.name) + getMonthRevenue2025('Supreme', month.name) + getMonthRevenue2025('Kenkere', month.name)) * 100).toFixed(1)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Revenue Breakdown by Offer */}
        {offerRevenues.length > 0 && (
          <div className="bg-white rounded-xl border-2 border-indigo-200 overflow-hidden shadow-sm">
            <div className="bg-white px-6 py-4 border-b-2 border-indigo-200">
              <h4 className="text-lg font-bold text-indigo-700 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" />
                Revenue Breakdown by Offer
              </h4>
              <p className="text-xs text-gray-600 mt-1">Projected revenue calculations based on target units sold</p>
            </div>
        
            <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white border-b-2 border-indigo-200">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Offer</th>
                <th className="px-5 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Units</th>
                <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Mumbai Price</th>
                <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Bengaluru Price</th>
                <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Mumbai Revenue</th>
                <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Bengaluru Revenue</th>
                <th className="px-5 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {offerRevenues.map(({ offer, revenue }) => {
                const targetUnits = typeof offer.targetUnits === 'number' ? offer.targetUnits : parseInt(offer.targetUnits as string) || 0;
                const mumbaiPrice = offer.finalPriceMumbai || offer.priceMumbai || 0;
                const bengaluruPrice = offer.finalPriceBengaluru || offer.priceBengaluru || 0;
                
                return (
                  <tr key={offer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900 text-sm">{offer.title}</div>
                      {offer.promoteOnAds && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                          <Megaphone className="w-3 h-3" />
                          Promoted
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                        {offer.type}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900 text-sm">{targetUnits}</td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-gray-700">{formatIndianCurrency(mumbaiPrice)}</td>
                    <td className="px-5 py-4 text-right text-sm font-medium text-gray-700">{formatIndianCurrency(bengaluruPrice)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900 text-sm">{formatIndianCurrency(revenue.mumbai)}</td>
                    <td className="px-5 py-4 text-right font-semibold text-gray-900 text-sm">{formatIndianCurrency(revenue.bengaluru)}</td>
                    <td className="px-5 py-4 text-right font-bold text-gray-900 text-base">{formatIndianCurrency(revenue.total)}</td>
                  </tr>
                );
              })}
              
              {/* Totals Row */}
              <tr className="bg-indigo-50 font-bold border-t-2 border-indigo-200">
                <td className="px-5 py-5 text-indigo-900 text-sm" colSpan={2}>TOTAL PROJECTED REVENUE</td>
                <td className="px-5 py-5 text-right text-indigo-900 text-sm">
                  {activeOffers.reduce((sum, o) => sum + (typeof o.targetUnits === 'number' ? o.targetUnits : parseInt(o.targetUnits as string) || 0), 0)}
                </td>
                <td className="px-5 py-5" colSpan={2}></td>
                <td className="px-5 py-5 text-right text-indigo-900 text-sm">{formatIndianCurrency(totalMumbaiRevenue)}</td>
                <td className="px-5 py-5 text-right text-indigo-900 text-sm">{formatIndianCurrency(totalBengaluruRevenue)}</td>
                <td className="px-5 py-5 text-right text-indigo-900 text-lg font-black">{formatIndianCurrency(totalProjectedRevenue)}</td>
              </tr>
            </tbody>
          </table>
            </div>
          </div>
        )}
      </div>

      {/* Creative Asset Pipeline - Clean Professional Design */}
      {(marketingCollateral.length > 0 || isAdmin) && (
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 tracking-tight">Creative Asset Pipeline</h4>
                <p className="text-gray-500 text-sm mt-0.5">Design requirements organized by campaign</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {marketingCollateral.length > 0 && (
                <span className="px-3 py-1.5 bg-indigo-50 rounded-full text-sm font-medium text-indigo-700 border border-indigo-100">
                  {marketingCollateral.length} Assets
                </span>
              )}
              {marketingCollateral.length > 0 && (
                <button
                  onClick={() => requireAdmin(() => deleteAllMarketingCollateral(month.id))}
                  disabled={!isAdmin}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isAdmin
                      ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 cursor-pointer'
                      : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                  title={isAdmin ? 'Clear all requirements' : 'Admin access required'}
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
              <button
                onClick={() => requireAdmin(() => {
                  setShowNewMarketing(true);
                  setNewMarketing({
                    offer: activeOffers[0]?.title || '',
                    type: 'Email Campaign',
                    collateralNeeded: '',
                    medium: 'Email Marketing',
                    dueDate: '',
                    messaging: '',
                    notes: ''
                  });
                })}
                disabled={!isAdmin}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isAdmin
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md cursor-pointer'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title={isAdmin ? 'Add creative asset' : 'Admin access required'}
              >
                <Plus className="w-4 h-4" />
                Add Asset
              </button>
            </div>
          </div>
        </div>
          
        <div className="p-6">
          {marketingCollateral.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                <Palette className="w-8 h-8 text-gray-400" />
              </div>
              <h5 className="text-lg font-semibold text-gray-900 mb-2">No Creative Assets Planned</h5>
              <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">Start by selecting collateral types in your offer cards or add specific design requirements</p>
              <button
                onClick={() => requireAdmin(() => setShowNewMarketing(true))}
                disabled={!isAdmin}
                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isAdmin 
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md cursor-pointer' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title={isAdmin ? 'Create Asset Request' : 'Admin access required'}
              >
                Create Asset Request
              </button>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1400px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="w-36 px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Offer</th>
                      <th className="w-28 px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                      <th className="w-56 px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Requirements</th>
                      <th className="w-56 px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                      <th className="w-40 px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Notes</th>
                      <th className="w-40 px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">CTA</th>
                      <th className="w-28 px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Channel</th>
                      <th className="w-24 px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Due</th>
                      <th className="w-20 px-5 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="w-28 px-5 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {marketingCollateral.map((item, index) => {
                      const isEditing = editingMarketing === item.id;
                      const displayItem = isEditing ? { ...item, ...tempMarketing } : item;
                      
                      return (
                        <tr key={item.id || index} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-4 align-top">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></div>
                              <span className="text-sm font-medium text-gray-900">{displayItem.offer}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 align-top">
                            {isEditing ? (
                              <input
                                type="text"
                                value={displayItem.type}
                                onChange={(e) => setTempMarketing({...tempMarketing, type: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg bg-white text-gray-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                              />
                            ) : (
                              <span className="inline-flex px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                {displayItem.type}
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 align-top">
                            {isEditing ? (
                              <textarea
                                value={displayItem.collateralNeeded}
                                onChange={(e) => setTempMarketing({...tempMarketing, collateralNeeded: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                                rows={2}
                                placeholder="Asset requirements..."
                              />
                            ) : (
                              <p className="text-sm text-gray-700 leading-relaxed">{displayItem.collateralNeeded}</p>
                            )}
                          </td>
                          <td className="px-5 py-4 align-top">
                            {isEditing ? (
                              <textarea
                                value={displayItem.messaging || ''}
                                onChange={(e) => setTempMarketing({...tempMarketing, messaging: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                                rows={3}
                                placeholder="Message for the creative..."
                              />
                            ) : (
                              displayItem.messaging ? (
                                <div className="bg-violet-50 p-2.5 rounded-lg border border-violet-100">
                                  <p className="text-sm text-violet-800 italic">"{displayItem.messaging}"</p>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">—</span>
                              )
                            )}
                          </td>
                          <td className="px-5 py-4 align-top">
                            {isEditing ? (
                              <textarea
                                value={displayItem.notes || ''}
                                onChange={(e) => setTempMarketing({...tempMarketing, notes: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                                rows={2}
                                placeholder="Additional notes..."
                              />
                            ) : (
                              displayItem.notes ? (
                                <p className="text-sm text-gray-600">{displayItem.notes}</p>
                              ) : (
                                <span className="text-sm text-gray-400">—</span>
                              )
                            )}
                          </td>
                          <td className="px-5 py-4 align-top">
                            {isEditing ? (
                              <textarea
                                value={displayItem.ctaLinks || ''}
                                onChange={(e) => setTempMarketing({...tempMarketing, ctaLinks: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
                                rows={2}
                                placeholder="CTA links..."
                              />
                            ) : (
                              displayItem.ctaLinks ? (
                                <div className="bg-blue-50 p-2 rounded-lg border border-blue-100">
                                  <p className="text-xs text-blue-700 break-all">{displayItem.ctaLinks}</p>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">—</span>
                              )
                            )}
                          </td>
                          <td className="px-5 py-4 align-top">
                            {isEditing ? (
                              <input
                                type="text"
                                value={displayItem.medium}
                                onChange={(e) => setTempMarketing({...tempMarketing, medium: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                              />
                            ) : (
                              <span className="text-sm text-gray-700">{displayItem.medium}</span>
                            )}
                          </td>
                          <td className="px-5 py-4 align-top">
                            {isEditing ? (
                              <input
                                type="text"
                                value={displayItem.dueDate}
                                onChange={(e) => setTempMarketing({...tempMarketing, dueDate: e.target.value})}
                                className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
                              />
                            ) : (
                              <span className="text-sm text-gray-600">{displayItem.dueDate || '—'}</span>
                            )}
                          </td>
                          <td className="px-5 py-4 align-top">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                              Pending
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center align-top">
                            <div className="flex justify-center gap-1.5">
                              <button
                                onClick={() => requireAdmin(() => {
                                  if (isEditing) {
                                    if (item.id) {
                                      updateMarketingCollateral(month.id, item.id, tempMarketing);
                                    }
                                    setEditingMarketing(null);
                                    setTempMarketing({});
                                  } else {
                                    setEditingMarketing(item.id || null);
                                    setTempMarketing(item);
                                  }
                                })}
                                disabled={!isAdmin}
                                className={`p-1.5 rounded-md transition-all ${
                                  isAdmin 
                                    ? 'hover:bg-indigo-50 text-indigo-600 cursor-pointer' 
                                    : 'text-gray-300 cursor-not-allowed'
                                }`}
                                title={isAdmin ? (isEditing ? 'Save' : 'Edit') : 'Admin required'}
                              >
                                {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                              </button>
                              {isEditing && (
                                <button
                                  onClick={() => { setEditingMarketing(null); setTempMarketing({}); }}
                                  className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => requireAdmin(() => {
                                  if (item.id && confirm('Delete this asset?')) {
                                    deleteMarketingCollateral(month.id, item.id);
                                  }
                                })}
                                disabled={!isAdmin}
                                className={`p-1.5 rounded-md transition-all ${
                                  isAdmin 
                                    ? 'hover:bg-red-50 text-red-500 cursor-pointer' 
                                    : 'text-gray-300 cursor-not-allowed'
                                }`}
                                title={isAdmin ? 'Delete' : 'Admin required'}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {/* Summary Footer */}
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">{marketingCollateral.length}</span> assets across{' '}
                    <span className="font-semibold text-gray-900">{Object.keys(groupedMarketing).length}</span> offers
                  </p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                      Pending: {marketingCollateral.length}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      Complete: 0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Quick Add Buttons */}
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={() => requireAdmin(() => setShowNewMarketing(true))}
              disabled={!isAdmin}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isAdmin 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm cursor-pointer' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title={isAdmin ? 'Add Creative Asset' : 'Admin access required'}
            >
              <Plus className="w-4 h-4" />
              Add Creative Asset
            </button>
            
            <button
              onClick={() => requireAdmin(() => setShowOfferGenerator(true))}
              disabled={!isAdmin}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isAdmin
                  ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title={isAdmin ? 'Generate Custom Offers' : 'Admin access required'}
            >
              <Wand2 className="w-4 h-4" />
              Offer Generator
            </button>
          </div>
        </div>
      </div>
      )}

      {/* CRM & Campaign Timeline */}
      {(crmTimeline.length > 0 || isAdmin) && (
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 overflow-hidden shadow-lg">
        <div className="bg-white/70 backdrop-blur-sm px-8 py-6 border-b border-violet-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-2xl font-bold text-violet-900">Campaign Timeline</h4>
                <p className="text-violet-700 font-medium">Marketing automation & customer touchpoints</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {crmTimeline.length > 0 && (
                <>
                  <button
                    onClick={() => requireAdmin(() => removeDuplicateCRMEvents(month.id))}
                    disabled={!isAdmin}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      isAdmin
                        ? 'bg-amber-500 text-white hover:bg-amber-600 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                    title={isAdmin ? 'Clean duplicates' : 'Admin access required'}
                  >
                    <Target className="w-4 h-4" />
                    Clean Up
                  </button>
                  <button
                    onClick={() => requireAdmin(() => deleteAllCRMTimeline(month.id))}
                    disabled={!isAdmin}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 ${
                      isAdmin
                        ? 'bg-red-500 text-white hover:bg-red-600 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                    title={isAdmin ? 'Clear timeline' : 'Admin access required'}
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                  </button>
                </>
              )}
              <button
                onClick={() => requireAdmin(() => {
                  setShowNewCRM(true);
                  setNewCRM({
                    offer: activeOffers[0]?.title || '',
                    content: '',
                    sendDate: '',
                    adsStartDate: '',
                    adsEndDate: ''
                  });
                })}
                disabled={!isAdmin}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium ${
                  isAdmin
                    ? 'bg-violet-600 text-white hover:bg-violet-700 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                }`}
                title={isAdmin ? 'Add campaign event' : 'Admin access required'}
              >
                <Plus className="w-5 h-5" />
                Add Event
              </button>
            </div>
          </div>
        </div>
        
        <div className="p-8 bg-gradient-to-br from-white to-violet-50/30">
          <div className="relative">
            {/* Modern Timeline line */}
            <div className="absolute left-[29px] top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 via-purple-400 to-violet-400 rounded-full shadow-sm"></div>
            <div className="space-y-6">
              {showNewCRM && (
                <div className="bg-white border-2 border-violet-300 rounded-2xl p-8 shadow-xl relative ml-16 hover:shadow-2xl transition-all duration-300">
                  <div className="absolute -left-6 top-8 w-8 h-8 bg-violet-600 rounded-full flex items-center justify-center shadow-lg">
                    <Plus className="w-4 h-4 text-white" />
                  </div>
                  <button
                    onClick={() => {
                      setShowNewCRM(false);
                      setNewCRM({});
                    }}
                    className="absolute top-4 right-4 p-2 hover:bg-red-50 rounded-xl transition-colors group"
                  >
                    <X className="w-5 h-5 text-red-500 group-hover:text-red-600" />
                  </button>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                        <input
                          type="text"
                          value={newCRM.offer || ''}
                          onChange={(e) => setNewCRM({...newCRM, offer: e.target.value})}
                          className="px-3 py-1.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-lg border border-indigo-300 focus:border-indigo-500 outline-none"
                          placeholder="Offer name"
                        />
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-md">
                          <span className="text-xs font-medium text-gray-600">Send:</span>
                          <input
                            type="text"
                            value={newCRM.sendDate || ''}
                            onChange={(e) => setNewCRM({...newCRM, sendDate: e.target.value})}
                            className="text-xs font-bold text-blue-700 border border-gray-300 rounded px-1 py-0.5 w-24 focus:border-indigo-500 outline-none bg-white"
                            placeholder="Jan 15, 2026"
                          />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-md">
                          <span className="text-xs font-medium text-gray-600">Ads Start:</span>
                          <input
                            type="text"
                            value={newCRM.adsStartDate || ''}
                            onChange={(e) => setNewCRM({...newCRM, adsStartDate: e.target.value})}
                            className="text-xs font-bold text-green-700 border border-gray-300 rounded px-1 py-0.5 w-24 focus:border-indigo-500 outline-none bg-white"
                            placeholder="Optional"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-md">
                          <span className="text-xs font-medium text-gray-600">Ads End:</span>
                          <input
                            type="text"
                            value={newCRM.adsEndDate || ''}
                            onChange={(e) => setNewCRM({...newCRM, adsEndDate: e.target.value})}
                            className="text-xs font-bold text-red-700 border border-gray-300 rounded px-1 py-0.5 w-24 focus:border-indigo-500 outline-none bg-white"
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <textarea
                          value={newCRM.content || ''}
                          onChange={(e) => setNewCRM({...newCRM, content: e.target.value})}
                          className="w-full text-sm text-gray-800 leading-relaxed font-medium border border-gray-300 rounded px-2 py-1 focus:border-indigo-500 outline-none bg-white"
                          rows={3}
                          placeholder="Campaign content and messaging..."
                        />
                      </div>
                      <button
                        onClick={() => requireAdmin(() => {
                          if (newCRM.offer && newCRM.content && newCRM.sendDate) {
                            addCRMTimeline(month.id, {
                              id: Math.random().toString(36).substr(2, 9),
                              offer: newCRM.offer,
                              content: newCRM.content,
                              sendDate: newCRM.sendDate,
                              adsStartDate: newCRM.adsStartDate || undefined,
                              adsEndDate: newCRM.adsEndDate || undefined
                            });
                            setShowNewCRM(false);
                            setNewCRM({});
                          }
                        })}
                        disabled={!isAdmin}
                        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                          isAdmin
                            ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                        title={isAdmin ? 'Save CRM Event' : 'Admin access required'}
                      >
                        <Save className="w-4 h-4" />
                        Save CRM Event
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {[...crmTimeline].sort((a, b) => parseDate(a.sendDate) - parseDate(b.sendDate)).map((item, index) => {
                const isEditing = editingCRM === item.id;
                const displayItem = isEditing ? { ...item, ...tempCRM } : item;
                
                return (
                  <div key={item.id || index} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute left-[25px] top-5 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white shadow-md z-10"></div>
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-indigo-300 hover:shadow-md transition-all relative ml-16">
                      <div className="absolute top-3 right-3 flex gap-2 z-10">
                        <button
                          onClick={() => requireAdmin(() => {
                            if (item.id && confirm('Delete this CRM timeline event?')) {
                              deleteCRMTimeline(month.id, item.id);
                            }
                          })}
                          disabled={!isAdmin}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isAdmin
                              ? 'hover:bg-red-50 cursor-pointer'
                              : 'cursor-not-allowed opacity-50'
                          }`}
                          title={isAdmin ? 'Delete event' : 'Admin access required'}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                        <button
                          onClick={() => requireAdmin(() => {
                            if (isEditing) {
                              if (item.id) {
                                updateCRMTimeline(month.id, item.id, tempCRM);
                          }
                              setEditingCRM(null);
                              setTempCRM({});
                            } else {
                              setEditingCRM(item.id || null);
                              setTempCRM(item);
                            }
                          })}
                          disabled={!isAdmin}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isAdmin
                              ? 'hover:bg-indigo-50 cursor-pointer'
                              : 'cursor-not-allowed opacity-50'
                          }`}
                          title={isAdmin ? (isEditing ? 'Save changes' : 'Edit event') : 'Admin access required'}
                        >
                          {isEditing ? (
                            <Save className="w-4 h-4 text-green-600" />
                          ) : (
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                        {isEditing && (
                          <button
                            onClick={() => {
                              setEditingCRM(null);
                              setTempCRM({});
                            }}
                            className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4 text-red-600" />
                          </button>
                        )}
                      </div>
                    
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                          <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-lg">
                            {displayItem.offer}
                          </span>
                          {(displayItem.sendDate || isEditing) && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-md">
                              <span className="text-xs font-medium text-gray-600">Send:</span>
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={displayItem.sendDate || ''}
                                  onChange={(e) => setTempCRM({...tempCRM, sendDate: e.target.value})}
                                  className="text-xs font-bold text-blue-700 border border-gray-300 rounded px-1 py-0.5 w-24 focus:border-indigo-500 outline-none bg-white"
                                />
                              ) : (
                                <span className="text-xs font-bold text-blue-700">{displayItem.sendDate}</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        {(displayItem.adsStartDate || displayItem.adsEndDate || isEditing) && (
                          <div className="flex flex-wrap items-center gap-3 mb-3 pb-3 border-b border-gray-200">
                            {(displayItem.adsStartDate || isEditing) && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 rounded-md">
                                <span className="text-xs font-medium text-gray-600">Ads Start:</span>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={displayItem.adsStartDate || ''}
                                    onChange={(e) => setTempCRM({...tempCRM, adsStartDate: e.target.value})}
                                    className="text-xs font-bold text-green-700 border border-gray-300 rounded px-1 py-0.5 w-24 focus:border-indigo-500 outline-none bg-white"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-green-700">{displayItem.adsStartDate}</span>
                                )}
                              </div>
                            )}
                            {(displayItem.adsEndDate || isEditing) && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 rounded-md">
                                <span className="text-xs font-medium text-gray-600">Ads End:</span>
                                {isEditing ? (
                                  <input
                                    type="text"
                                    value={displayItem.adsEndDate || ''}
                                    onChange={(e) => setTempCRM({...tempCRM, adsEndDate: e.target.value})}
                                    className="text-xs font-bold text-red-700 border border-gray-300 rounded px-1 py-0.5 w-24 focus:border-indigo-500 outline-none bg-white"
                                  />
                                ) : (
                                  <span className="text-xs font-bold text-red-700">{displayItem.adsEndDate}</span>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          {isEditing ? (
                            <textarea
                              value={displayItem.content}
                              onChange={(e) => setTempCRM({...tempCRM, content: e.target.value})}
                              className="w-full text-sm text-gray-800 leading-relaxed font-medium border border-gray-300 rounded px-2 py-1 focus:border-indigo-500 outline-none bg-white"
                              rows={3}
                            />
                          ) : (
                            <p className="text-sm text-gray-800 leading-relaxed font-medium">{displayItem.content}</p>
                          )}
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Custom Sections */}
      {((month as any).customSections && Object.keys((month as any).customSections).length > 0) && (
        <div className="space-y-6">
          {Object.entries((month as any).customSections || {}).map(([sectionName, items]: [string, any[]]) => (
            <div key={sectionName} className="bg-white rounded-xl border-2 border-purple-200 overflow-hidden shadow-sm">
              <div className="bg-white px-6 py-4 border-b-2 border-purple-200 flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-purple-700 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    {sectionName}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">Custom section with {items.length} items</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => requireAdmin(() => deleteCustomSection(month.id, sectionName))}
                    disabled={!isAdmin}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                      isAdmin
                        ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                    title={isAdmin ? `Delete entire ${sectionName} section` : 'Admin access required'}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Section
                  </button>
                </div>
              </div>
              <div className="p-6 bg-gray-50">
                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No items in this section</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Custom Section - Admin Only */}
      {isAdmin && (
        <div className="bg-white rounded-xl border-2 border-green-200 overflow-hidden shadow-sm">
          <div className="bg-white px-6 py-4 border-b-2 border-green-200 flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-green-700 flex items-center gap-2">
                <Plus className="w-5 h-5 text-green-600" />
                Add New Section
              </h4>
              <p className="text-xs text-gray-600 mt-1">Create custom sections for additional planning needs</p>
            </div>
            <button
              onClick={() => setShowNewCustomSection(true)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Section
            </button>
          </div>
        
        {showNewCustomSection && (
          <div className="p-6 bg-gray-50">
            <div className="bg-white border-2 border-green-400 rounded-xl p-5 shadow-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Name</label>
                  <input
                    type="text"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 outline-none"
                    placeholder="e.g., Social Media Strategy, Partnership Ideas, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Data (JSON format)</label>
                  <textarea
                    value={newSectionData}
                    onChange={(e) => setNewSectionData(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-green-500 outline-none font-mono"
                    rows={6}
                    placeholder={`[
  {
    "title": "Example Item",
    "description": "Description here",
    "notes": "Additional notes"
  }
]`}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      if (newSectionName.trim()) {
                        try {
                          const parsedData = newSectionData.trim() ? JSON.parse(newSectionData) : [];
                          if (Array.isArray(parsedData)) {
                            addCustomSection(month.id, newSectionName.trim(), parsedData);
                            setNewSectionName('');
                            setNewSectionData('');
                            setShowNewCustomSection(false);
                          } else {
                            alert('Data must be a JSON array');
                          }
                        } catch (e) {
                          alert('Invalid JSON format');
                        }
                      } else {
                        alert('Please enter a section name');
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Create Section
                  </button>
                  <button
                    onClick={() => {
                      setShowNewCustomSection(false);
                      setNewSectionName('');
                      setNewSectionData('');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      )}

      {/* Add New Marketing Collateral Modal */}
      {showNewMarketing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Add Creative Asset</h3>
                <button
                  onClick={() => {
                    setShowNewMarketing(false);
                    setNewMarketing({});
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newMarketing.offer || ''}
                    onChange={(e) => setNewMarketing({...newMarketing, offer: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    placeholder="Offer name"
                  />
                  <input
                    type="text"
                    value={newMarketing.type || ''}
                    onChange={(e) => setNewMarketing({...newMarketing, type: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    placeholder="Asset type"
                  />
                </div>
                
                <div>
                  <input
                    type="text"
                    value={newMarketing.collateralNeeded || ''}
                    onChange={(e) => setNewMarketing({...newMarketing, collateralNeeded: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    placeholder="Creative requirements"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newMarketing.medium || ''}
                    onChange={(e) => setNewMarketing({...newMarketing, medium: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    placeholder="Channel"
                  />
                  <input
                    type="text"
                    value={newMarketing.dueDate || ''}
                    onChange={(e) => setNewMarketing({...newMarketing, dueDate: e.target.value})}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
                    placeholder="Due date"
                  />
                </div>
                
                <textarea
                  value={newMarketing.messaging || ''}
                  onChange={(e) => setNewMarketing({...newMarketing, messaging: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none resize-none"
                  rows={3}
                  placeholder="Design brief..."
                />
                
                <textarea
                  value={newMarketing.notes || ''}
                  onChange={(e) => setNewMarketing({...newMarketing, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none resize-none"
                  rows={2}
                  placeholder="Additional notes, specs..."
                />
                
                <textarea
                  value={newMarketing.ctaLinks || ''}
                  onChange={(e) => setNewMarketing({...newMarketing, ctaLinks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none resize-none"
                  rows={2}
                  placeholder="CTA links, URLs..."
                />
                
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => requireAdmin(() => {
                      if (newMarketing.offer && newMarketing.collateralNeeded) {
                        addMarketingCollateral(month.id, {
                          id: Math.random().toString(36).substr(2, 9),
                          offer: newMarketing.offer,
                          type: newMarketing.type || 'Mixed Media',
                          collateralNeeded: newMarketing.collateralNeeded,
                          medium: newMarketing.medium || 'Multi-channel',
                          dueDate: newMarketing.dueDate || '',
                          messaging: newMarketing.messaging || '',
                          notes: newMarketing.notes || '',
                          ctaLinks: newMarketing.ctaLinks || 'Mumbai: https://momence.com/u/physique-57-india-fffoSp | Bangalore: https://momence.com/u/physique-57-bengaluru-0MU0AA'
                        });
                        setShowNewMarketing(false);
                        setNewMarketing({});
                      }
                    })}
                    disabled={!isAdmin}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                      isAdmin 
                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    Save Asset
                  </button>
                  <button
                    onClick={() => {
                      setShowNewMarketing(false);
                      setNewMarketing({});
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Offer Generator Modal */}
        <OfferGeneratorModal
          isOpen={showOfferGenerator}
          onClose={() => setShowOfferGenerator(false)}
          onSave={(offer) => {
            // Add the generated offer as a marketing collateral item
            addMarketingCollateral(month.id, {
              id: offer.id,
              offer: `${offer.membershipType} - ${offer.offerDetails}`,
              type: 'Promotional Campaign',
              collateralNeeded: `${offer.offerType} campaign materials`,
              medium: 'Multi-channel',
              dueDate: offer.validUntil || '',
              messaging: `${offer.description || ''} Value: ${offer.value || 'TBD'}`,
              notes: `Generated offer: ${offer.offerType} for ${offer.membershipType}`,
              ctaLinks: 'Mumbai: https://momence.com/u/physique-57-india-fffoSp | Bangalore: https://momence.com/u/physique-57-bengaluru-0MU0AA'
            });
          }}
        />
    </div>
  );
};
