import React from 'react';
import { MonthData, Offer } from '../types';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, DollarSign, Package, CalendarDays, Target, Users, Sparkles, Trophy } from 'lucide-react';
import { OfferCard } from './OfferCard';
import { PDFExporter, AdvancedPDFExporter } from './PDFExporter';
import { ProfessionalPDFExporter } from './ReactPDFExporter';

interface YearOverviewProps {
  data: MonthData[];
  hideCancelled?: boolean;
}

// Indian currency formatter
const formatIndianCurrency = (amount: number | undefined | null): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toFixed(0)}`;
};

// Get monthly strategy content
const getMonthStrategy = (monthId: string, type: 'focus' | 'offers'): string[] => {
  const monthNum = parseInt(monthId);
  const strategies: Record<number, { focus: string[], offers: string[] }> = {
    1: {
      focus: ['New Year motivation campaigns', 'Winter collections launch', 'Goal-setting products'],
      offers: ['Resolution packages', 'Early bird discounts', 'Bundle deals for fresh starts']
    },
    2: {
      focus: ['Valentine\'s Day promotions', 'Love-themed campaigns', 'Couples packages'],
      offers: ['Romantic packages', 'Buy-one-get-one offers', 'Special date night deals']
    },
    3: {
      focus: ['Spring collection launch', 'Festival preparations', 'Color festival campaigns'],
      offers: ['Holi specials', 'Spring refresh deals', 'Colorful product launches']
    },
    4: {
      focus: ['Summer preparation', 'Vacation planning', 'Outdoor activity gear'],
      offers: ['Summer essentials', 'Travel packages', 'Hot weather solutions']
    },
    5: {
      focus: ['Mother\'s Day campaigns', 'Summer peak season', 'Graduation gifts'],
      offers: ['Mom appreciation deals', 'Graduate specials', 'Summer luxury items']
    },
    6: {
      focus: ['Father\'s Day promotions', 'Summer vacation peak', 'Monsoon prep'],
      offers: ['Dad\'s special deals', 'Vacation packages', 'Monsoon essentials']
    },
    7: {
      focus: ['Monsoon collections', 'Indoor activities', 'Rainy season comfort'],
      offers: ['Monsoon gear', 'Comfort packages', 'Indoor entertainment deals']
    },
    8: {
      focus: ['Independence Day campaigns', 'Back-to-school prep', 'Patriotic themes'],
      offers: ['Freedom sale', 'Student packages', 'National pride collections']
    },
    9: {
      focus: ['Ganesh festival prep', 'Autumn collections', 'Teacher\'s Day specials'],
      offers: ['Festival packages', 'Autumn essentials', 'Education appreciation deals']
    },
    10: {
      focus: ['Diwali preparation', 'Festive season launch', 'Gold and luxury items'],
      offers: ['Pre-Diwali deals', 'Festive packages', 'Luxury collections']
    },
    11: {
      focus: ['Diwali peak season', 'Wedding season prep', 'Year-end planning'],
      offers: ['Diwali bonanza', 'Wedding packages', 'Celebration deals']
    },
    12: {
      focus: ['Year-end celebrations', 'Christmas campaigns', 'New Year prep'],
      offers: ['Holiday specials', 'Year-end clearance', 'New Year packages']
    }
  };

  return strategies[monthNum]?.[type] || ['Strategic focus areas to be defined', 'Tailored offer mix to be planned', 'Seasonal opportunities to be leveraged'];
};

export const YearOverview: React.FC<YearOverviewProps> = ({ data, hideCancelled = false }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Aggregate all offers from all months
  const allOffers = data.reduce((acc, month) => {
    return acc.concat(month.offers.map(offer => ({ ...offer, monthName: month.name, monthId: month.id })));
  }, [] as (Offer & { monthName: string; monthId: string })[]);

  // Filter offers based on hideCancelled
  const displayOffers = hideCancelled 
    ? allOffers.filter(offer => !offer.cancelled)
    : allOffers;

  // Calculate total stats
  const totalActiveOffers = allOffers.filter(o => !o.cancelled).length;
  const totalOffers = allOffers.length;

  // Calculate yearly revenue projections
  const calculateYearlyRevenue = () => {
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

    const studios = ['Kwality', 'Supreme', 'Kenkere'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];

    let total2025 = 0;
    let total2026 = 0;
    let kwalityTotal2025 = 0, kwalityTotal2026 = 0;
    let supremeTotal2025 = 0, supremeTotal2026 = 0;
    let kenkereTotal2025 = 0, kenkereTotal2026 = 0;

    studios.forEach(studio => {
      months.forEach(month => {
        const revenue2025 = monthRevenue2025[studio]?.[month] || 0;
        const revenue2026 = monthRevenue2026[studio]?.[month] || 0;
        total2025 += revenue2025;
        total2026 += revenue2026;
        
        if (studio === 'Kwality') {
          kwalityTotal2025 += revenue2025;
          kwalityTotal2026 += revenue2026;
        } else if (studio === 'Supreme') {
          supremeTotal2025 += revenue2025;
          supremeTotal2026 += revenue2026;
        } else if (studio === 'Kenkere') {
          kenkereTotal2025 += revenue2025;
          kenkereTotal2026 += revenue2026;
        }
      });
    });

    const mumbaiTotal2025 = kwalityTotal2025 + supremeTotal2025;
    const mumbaiTotal2026 = kwalityTotal2026 + supremeTotal2026;
    
    return {
      total2025,
      total2026,
      mumbai2025: mumbaiTotal2025,
      mumbai2026: mumbaiTotal2026,
      bengaluru2025: kenkereTotal2025,
      bengaluru2026: kenkereTotal2026,
      growthPercent: total2025 > 0 ? ((total2026 - total2025) / total2025 * 100) : 0
    };
  };

  const yearlyRevenue = calculateYearlyRevenue();

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 print:max-w-none print:px-0 print:py-0 print:space-y-4 print:mx-0"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Enhanced Print Styles */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 15mm;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          html, body {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin: 0 !important;
            padding: 0 !important;
            height: auto !important;
            overflow: visible !important;
          }
          
          .no-print {
            display: none !important;
          }
          
          /* Main container adjustments */
          .max-w-7xl {
            max-width: none !important;
            width: 100% !important;
          }
          
          /* Allow natural page flow */
          .yearly-overview {
            page-break-after: auto !important;
            break-after: auto !important;
            margin-bottom: 20mm !important;
          }
          
          /* Month containers - allow breaking but try to keep together */
          .month-container {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 15mm !important;
            margin-top: 10mm !important;
          }
          
          /* If month container is too long, allow breaking */
          @supports (break-inside: auto) {
            .month-container {
              break-inside: auto !important;
            }
          }
          
          /* Month headers should not break from content */
          .month-header {
            page-break-after: avoid !important;
            break-after: avoid !important;
            margin-bottom: 5mm !important;
          }
          
          /* Offers grid - allow natural flow */
          .offers-grid {
            page-break-inside: auto !important;
            break-inside: auto !important;
            margin-bottom: 8mm !important;
          }
          
          /* Individual offer cards */
          .offer-card {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin-bottom: 5mm !important;
            box-shadow: none !important;
            border: 1px solid #666 !important;
          }
          
          /* Strategy sections */
          .strategy-section {
            page-break-inside: auto !important;
            break-inside: auto !important;
            margin-top: 8mm !important;
            margin-bottom: 8mm !important;
            border: 1px solid #666 !important;
            box-shadow: none !important;
          }
          
          /* Compact spacing */
          .print\\:space-y-4 > * + * {
            margin-top: 5mm !important;
          }
          
          .print\\:space-y-2 > * + * {
            margin-top: 3mm !important;
          }
          
          .print\\:gap-2 {
            gap: 3mm !important;
          }
          
          .print\\:gap-4 {
            gap: 5mm !important;
          }
          
          .print\\:gap-6 {
            gap: 8mm !important;
          }
          
          /* Padding adjustments */
          .print\\:p-2 {
            padding: 3mm !important;
          }
          
          .print\\:p-4 {
            padding: 5mm !important;
          }
          
          .print\\:py-4 {
            padding-top: 5mm !important;
            padding-bottom: 5mm !important;
          }
          
          /* Typography */
          .print\\:text-xs {
            font-size: 8px !important;
          }
          
          .print\\:text-sm {
            font-size: 9px !important;
          }
          
          .print\\:text-base {
            font-size: 10px !important;
          }
          
          .print\\:text-lg {
            font-size: 12px !important;
          }
          
          .print\\:text-xl {
            font-size: 14px !important;
          }
          
          .print\\:text-2xl {
            font-size: 16px !important;
          }
          
          /* Colors for print */
          .print\\:text-black, .print\\:text-black * {
            color: #000 !important;
          }
          
          .print\\:bg-white {
            background-color: #fff !important;
          }
          
          .print\\:bg-transparent {
            background-color: transparent !important;
          }
          
          .print\\:border-gray-400 {
            border-color: #666 !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          /* Headers */
          h1, h2, h3, h4, h5, h6 {
            page-break-after: avoid !important;
            break-after: avoid !important;
            margin-bottom: 2mm !important;
            color: #000 !important;
          }
          
          /* Tables and grids */
          table, .grid {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          
          /* Ensure content flows naturally */
          * {
            max-width: none !important;
            overflow: visible !important;
          }
          
          /* Remove transforms and fixed positioning */
          [style*="transform"], [style*="position: fixed"], [style*="position: sticky"] {
            transform: none !important;
            position: static !important;
          }
          
          /* Grid responsiveness for print */
          .grid-cols-1 {
            grid-template-columns: 1fr !important;
          }
          
          .md\\:grid-cols-2, .lg\\:grid-cols-2 {
            grid-template-columns: 1fr 1fr !important;
          }
          
          .md\\:grid-cols-3 {
            grid-template-columns: 1fr 1fr 1fr !important;
          }
          
          .md\\:grid-cols-4 {
            grid-template-columns: 1fr 1fr 1fr 1fr !important;
          }
          
          /* Force visibility of important elements */
          .bg-gradient-to-r, .bg-indigo-50, .bg-purple-50 {
            background: #f9f9f9 !important;
            border: 1px solid #ccc !important;
          }
          
          /* Month separator styling */
          .month-separator {
            page-break-before: auto !important;
            break-before: auto !important;
            margin: 10mm 0 !important;
          }
        }
      `}</style>

      {/* PDF Export Controls */}
      <div id="yearly-overview-content">
        <motion.div variants={item} className="flex justify-between items-center mb-8 print:hidden">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Export Options</h2>
            <p className="text-gray-600 text-sm">Choose your preferred PDF export format</p>
          </div>
          <div className="flex gap-3">
            <PDFExporter 
              targetElementId="yearly-overview-content" 
              filename="sales-plan-2026-standard"
              title="Standard PDF"
            />
            <AdvancedPDFExporter 
              targetElementId="yearly-overview-content" 
              filename="sales-plan-2026-advanced"
              title="Advanced PDF"
            />
            <ProfessionalPDFExporter 
              data={data}
              yearlyStats={{
                totalOffers: allOffers.length,
                activeOffers: totalActiveOffers,
                totalRevenue: yearlyRevenue.total2026,
                mumbaiRevenue: yearlyRevenue.mumbai2026,
                bengaluruRevenue: yearlyRevenue.bengaluru2026,
                growthPercent: yearlyRevenue.growthPercent
              }}
              filename="sales-masterplan-2026-professional"
            />
          </div>
        </motion.div>

      {/* Hero Section - styled like MonthDetail */}
      <motion.div variants={item} className="yearly-overview space-y-4 print:space-y-2">
        <div className="flex items-center gap-3 text-brand-600 print:text-black">
          <CalendarDays className="w-6 h-6 print:w-4 print:h-4" />
          <span className="text-sm font-bold uppercase tracking-widest print:text-xs">2026 Sales Masterplan</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 print:text-black print:text-xl">
          Full Year Overview: <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 print:text-black">Complete Strategic Plan</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed print:text-black print:text-xs print:leading-tight">
          Comprehensive overview of all 12 months of strategic sales initiatives across Mumbai and Bengaluru locations
        </p>
      </motion.div>

      {/* Year Stats - styled like MonthDetail stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4 print:break-inside-avoid">
        {[
          { label: 'Total Offers', value: totalOffers.toString(), icon: '🎁' },
          { label: 'Active Offers', value: totalActiveOffers.toString(), icon: '✨' },
          { label: 'Revenue Target', value: formatIndianCurrency(yearlyRevenue.total2026), icon: '💰' },
          { label: 'Growth Target', value: `${yearlyRevenue.growthPercent.toFixed(1)}%`, icon: '📈' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-brand-100 shadow-sm print:bg-white print:shadow-none print:border-gray-400">
            <span className="text-2xl print:text-lg">{stat.icon}</span>
            <p className="text-2xl font-bold text-gray-900 mt-1 print:text-lg print:text-black">{stat.value}</p>
            <p className="text-sm text-gray-500 print:text-black">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Financial Overview - Mumbai and Bengaluru Side by Side */}
      <motion.div variants={item} className="print:break-inside-avoid">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 print:text-black print:text-xl">Annual Financial Overview</h2>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 print:text-black print:bg-transparent print:border print:border-gray-400">
            Full Year Targets
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 print:grid-cols-2">
          {/* Mumbai Column */}
          <div className="bg-white rounded-xl border-2 border-blue-200 overflow-hidden shadow-sm print:bg-white print:shadow-none print:border-gray-400">
            <div className="bg-blue-50 px-6 py-4 border-b-2 border-blue-200 print:bg-white print:border-gray-400">
              <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2 print:text-black">
                <div className="w-3 h-3 bg-blue-500 rounded-full print:bg-gray-400"></div>
                Mumbai Operations
              </h3>
              <p className="text-xs text-blue-600 mt-1 print:text-black">Kwality House + Supreme HQ</p>
            </div>
            <div className="p-6 space-y-4 print:p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium print:text-black">2025 Achievement</p>
                  <p className="text-2xl font-bold text-gray-900 print:text-lg print:text-black">{formatIndianCurrency(yearlyRevenue.mumbai2025)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium print:text-black">2026 Target</p>
                  <p className="text-2xl font-bold text-blue-700 print:text-lg print:text-black">{formatIndianCurrency(yearlyRevenue.mumbai2026)}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 print:border-gray-400">
                <p className="text-sm text-gray-600 print:text-black">Growth Required</p>
                <p className="text-lg font-bold text-green-600 print:text-black">
                  {yearlyRevenue.mumbai2025 > 0 ? ((yearlyRevenue.mumbai2026 - yearlyRevenue.mumbai2025) / yearlyRevenue.mumbai2025 * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Bengaluru Column */}
          <div className="bg-white rounded-xl border-2 border-orange-200 overflow-hidden shadow-sm print:bg-white print:shadow-none print:border-gray-400">
            <div className="bg-orange-50 px-6 py-4 border-b-2 border-orange-200 print:bg-white print:border-gray-400">
              <h3 className="text-lg font-bold text-orange-700 flex items-center gap-2 print:text-black">
                <div className="w-3 h-3 bg-orange-500 rounded-full print:bg-gray-600"></div>
                Bengaluru Operations
              </h3>
              <p className="text-xs text-orange-600 mt-1 print:text-black">Kenkere House</p>
            </div>
            <div className="p-6 space-y-4 print:p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium print:text-black">2025 Achievement</p>
                  <p className="text-2xl font-bold text-gray-900 print:text-lg print:text-black">{formatIndianCurrency(yearlyRevenue.bengaluru2025)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium print:text-black">2026 Target</p>
                  <p className="text-2xl font-bold text-orange-700 print:text-lg print:text-black">{formatIndianCurrency(yearlyRevenue.bengaluru2026)}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-100 print:border-gray-400">
                <p className="text-sm text-gray-600 print:text-black">Growth Required</p>
                <p className="text-lg font-bold text-green-600 print:text-black">
                  {yearlyRevenue.bengaluru2025 > 0 ? ((yearlyRevenue.bengaluru2026 - yearlyRevenue.bengaluru2025) / yearlyRevenue.bengaluru2025 * 100).toFixed(1) : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Summary Row */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200 p-6 print:bg-white print:border-gray-400 print:shadow-none">
          <div className="text-center">
            <h4 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2 print:text-black">Annual Total</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:grid-cols-3">
              <div>
                <p className="text-xs text-gray-500 print:text-black">2025 Achievement</p>
                <p className="text-2xl font-bold text-gray-900 print:text-lg print:text-black">{formatIndianCurrency(yearlyRevenue.total2025)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 print:text-black">2026 Target</p>
                <p className="text-3xl font-bold text-indigo-700 print:text-xl print:text-black">{formatIndianCurrency(yearlyRevenue.total2026)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 print:text-black">Growth Required</p>
                <p className="text-2xl font-bold text-green-600 print:text-lg print:text-black">{yearlyRevenue.growthPercent.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* All Strategic Offers Grid - styled like MonthDetail */}
      <motion.div variants={item}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif font-bold text-gray-900">All Strategic Offers</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {displayOffers.length} {hideCancelled ? 'Active' : 'Total'} Across All Months
            </span>
          </div>
        </div>
        
        {/* Group offers by month */}
        <div className="space-y-8 print:space-y-4">
          {data.map((month, monthIndex) => {
            const monthOffers = displayOffers.filter(offer => offer.monthId === month.id);
            if (monthOffers.length === 0) return null;

            return (
              <motion.div 
                key={month.id} 
                variants={item}
                className="month-container space-y-6 print:space-y-2"
              >
                {/* Month Separator */}
                <div className="month-separator relative py-8 print:py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-indigo-200 print:border-gray-400"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <div className="bg-white px-6 py-2 border-2 border-indigo-300 rounded-full shadow-sm print:shadow-none print:border-gray-400 print:px-4 print:py-1">
                      <span className="text-sm font-bold text-indigo-800 uppercase tracking-widest print:text-black print:text-xs">
                        Month {monthIndex + 1} • {month.name}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Month Header with Full Details */}
                <div className="month-header bg-white rounded-2xl border-2 border-indigo-200 shadow-sm overflow-hidden print:bg-white print:shadow-none print:border-gray-400 print:rounded-lg">
                  {/* Main Header */}
                  <div className="px-8 py-6 border-b-2 border-indigo-100 print:border-gray-400 print:px-4 print:py-3">
                    <div className="flex items-start justify-between print:flex-col print:gap-2">
                      <div className="flex-1">
                        <h3 className="text-2xl font-serif font-bold text-indigo-900 mb-2 print:text-black print:text-lg print:mb-1">{month.name}</h3>
                        <p className="text-lg font-medium text-indigo-700 mb-3 print:text-black print:text-sm print:mb-1">
                          {month.theme}
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl print:text-black print:text-xs print:leading-tight">
                          {month.summary}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-6 print:ml-0 print:flex-row print:gap-1">
                        <div className="px-3 py-1 bg-indigo-100 border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 text-center print:text-black print:bg-transparent print:border-gray-400 print:px-2">
                          {monthOffers.length} Offers
                        </div>
                        {month.revenueTargetTotal && (
                          <div className="px-3 py-1 bg-indigo-100 border border-indigo-200 rounded-full text-xs font-medium text-indigo-700 text-center print:text-black print:bg-transparent print:border-gray-400 print:px-2">
                            {month.revenueTargetTotal}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Month Statistics */}
                  <div className="px-8 py-6 bg-indigo-50 print:bg-white border-b border-indigo-100 print:border-gray-400">
                    <div className="grid grid-cols-4 gap-6 print:gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-900 print:text-black">{monthOffers.filter(o => !o.cancelled).length}</div>
                        <div className="text-xs text-indigo-600 font-medium mt-1 print:text-black">Active</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-900 print:text-black">
                          {monthOffers.filter(o => o.type === 'Hero').length}
                        </div>
                        <div className="text-xs text-indigo-600 font-medium mt-1 print:text-black">Hero</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-900 print:text-black">
                          {monthOffers.filter(o => o.type === 'New').length}
                        </div>
                        <div className="text-xs text-indigo-600 font-medium mt-1 print:text-black">New</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-900 print:text-black">
                          {monthOffers.filter(o => o.cancelled).length}
                        </div>
                        <div className="text-xs text-indigo-600 font-medium mt-1 print:text-black">Cancelled</div>
                      </div>
                    </div>
                  </div>

                  {/* Month Strategy */}
                  <div className="px-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 print:bg-white border-b border-indigo-100 print:border-gray-400">
                    <h5 className="text-sm font-bold text-indigo-900 mb-4 print:text-black flex items-center gap-2">
                      <div className="w-4 h-4 bg-indigo-500 rounded-full print:bg-gray-600"></div>
                      Monthly Strategy
                    </h5>
                    <div className="bg-white/80 rounded-lg p-4 border border-indigo-200 print:bg-white print:border-gray-400">
                      <p className="text-sm text-gray-700 leading-relaxed print:text-black italic">
                        "{month.summary}"
                      </p>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h6 className="text-xs font-bold text-indigo-800 mb-2 print:text-black">Key Focus Areas</h6>
                          <div className="space-y-1">
                            <div className="text-xs text-gray-600 print:text-black">• {month.theme} themed campaigns</div>
                            <div className="text-xs text-gray-600 print:text-black">• Target {monthOffers.filter(o => !o.cancelled).length} active offers</div>
                            <div className="text-xs text-gray-600 print:text-black">• Revenue goal: {month.revenueTargetTotal || 'TBD'}</div>
                          </div>
                        </div>
                        <div>
                          <h6 className="text-xs font-bold text-indigo-800 mb-2 print:text-black">Offer Mix Strategy</h6>
                          <div className="flex flex-wrap gap-1">
                            {['Hero', 'New', 'Retention', 'Flash'].map(type => {
                              const count = monthOffers.filter(o => o.type === type && !o.cancelled).length;
                              if (count === 0) return null;
                              return (
                                <span key={type} className="px-2 py-1 rounded text-xs font-medium bg-indigo-100 text-indigo-700 print:text-black print:bg-transparent print:border print:border-gray-400">
                                  {type}: {count}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financial Targets if available */}
                  {month.financialTargets && month.financialTargets.length > 0 && (
                    <div className="px-8 py-6 border-b border-indigo-100 print:border-gray-400">
                      <h5 className="text-sm font-bold text-indigo-900 mb-4 print:text-black flex items-center gap-2">
                        <div className="w-4 h-4 bg-indigo-500 rounded-full print:bg-gray-600"></div>
                        Financial Targets
                      </h5>
                      <div className="bg-white rounded-lg border-2 border-indigo-200 overflow-hidden print:border-gray-400">
                        <table className="w-full text-sm">
                          <thead className="bg-indigo-50 print:bg-white">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-bold text-indigo-900 uppercase tracking-wider print:text-black">Location</th>
                              <th className="px-4 py-3 text-center text-xs font-bold text-indigo-900 uppercase tracking-wider print:text-black">Category</th>
                              <th className="px-4 py-3 text-center text-xs font-bold text-indigo-900 uppercase tracking-wider print:text-black">Target Units</th>
                              <th className="px-4 py-3 text-right text-xs font-bold text-indigo-900 uppercase tracking-wider print:text-black">Revenue Target</th>
                              <th className="px-4 py-3 text-left text-xs font-bold text-indigo-900 uppercase tracking-wider print:text-black">Strategy</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-indigo-100 print:divide-gray-400">
                            {month.financialTargets.map((target, idx) => (
                              <tr key={idx} className="hover:bg-indigo-50 transition-colors print:hover:bg-white">
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-indigo-400 print:bg-gray-600"></div>
                                    <span className="font-medium text-gray-900 print:text-black">{target.location}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 border border-indigo-200 text-indigo-800 print:text-black print:bg-transparent print:border-gray-400">
                                    {target.category}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span className="font-semibold text-gray-900 print:text-black">{target.targetUnits}</span>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <span className="font-bold text-indigo-700 print:text-black">{target.revenueTarget}</span>
                                </td>
                                <td className="px-4 py-3">
                                  {target.logic && (
                                    <p className="text-xs text-gray-600 italic max-w-xs leading-relaxed print:text-black">"{target.logic}"</p>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Offers Grid */}
                <div className="offers-grid grid grid-cols-1 lg:grid-cols-2 gap-6 print:gap-4 print:grid-cols-1">
                  {monthOffers.map((offer) => (
                    <div key={`${offer.monthId}-${offer.id}`} className={`offer-card bg-white rounded-xl border-2 border-indigo-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-indigo-300 print:shadow-none print:border-gray-400 print:break-inside-avoid ${offer.cancelled ? 'opacity-60' : ''}`}>
                      <div className="p-6">
                        {/* Offer Header */}
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                            offer.cancelled ? 'bg-gray-100 text-gray-500 border-gray-300 print:text-black print:bg-transparent print:border-gray-400' :
                            'bg-indigo-100 text-indigo-700 border-indigo-300 print:text-black print:bg-transparent print:border-gray-400'
                          }`}>
                            {offer.cancelled ? 'Cancelled' : `${offer.type} Offer`}
                          </span>
                        </div>

                        <h4 className={`text-lg font-serif font-semibold mb-2 leading-tight ${offer.cancelled ? 'text-gray-400 line-through print:text-black' : 'text-indigo-900 print:text-black'}`}>
                          {offer.title}
                        </h4>
                        
                        <p className={`text-sm mb-4 ${offer.cancelled ? 'text-gray-400 print:text-black' : 'text-gray-600 print:text-black'}`}>
                          {offer.description}
                        </p>

                        {/* Pricing Information - Side by Side */}
                        <div className={`space-y-4 ${offer.cancelled ? 'opacity-50' : ''}`}>
                          {(offer.priceMumbai || offer.priceBengaluru) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Mumbai Pricing */}
                              {offer.priceMumbai && (
                                <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200 print:bg-white print:border-gray-400">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full print:bg-gray-600"></div>
                                    <h5 className="text-sm font-bold text-indigo-800 print:text-black">Mumbai</h5>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-indigo-700 print:text-black">Standard Price</span>
                                      <span className="text-sm text-gray-400 line-through print:text-black">₹{offer.priceMumbai.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-indigo-700 print:text-black">Offer Price</span>
                                      <div className="flex items-center gap-2">
                                        {(offer.finalPriceMumbai && offer.finalPriceMumbai < offer.priceMumbai) && (
                                          <span className="text-xs font-bold text-white bg-indigo-600 px-2 py-0.5 rounded print:text-black print:bg-transparent print:border print:border-gray-400">
                                            {Math.round(((offer.priceMumbai - offer.finalPriceMumbai) / offer.priceMumbai) * 100)}% off
                                          </span>
                                        )}
                                        <span className="font-bold text-indigo-900 print:text-black">
                                          ₹{(offer.finalPriceMumbai || offer.priceMumbai).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {offer.finalPriceMumbai && offer.finalPriceMumbai < offer.priceMumbai && (
                                      <div className="flex items-center justify-between border-t border-indigo-300 pt-2 print:border-gray-400">
                                        <span className="text-xs text-indigo-700 print:text-black">Total Savings</span>
                                        <span className="text-sm font-semibold text-indigo-800 print:text-black">
                                          ₹{(offer.priceMumbai - offer.finalPriceMumbai).toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {(offer.targetUnitsMumbai || offer.targetUnits) && (
                                      <div className="flex items-center justify-between border-t border-indigo-300 pt-2 print:border-gray-400">
                                        <span className="text-xs text-indigo-700 print:text-black">Target Units</span>
                                        <span className="text-sm font-bold text-indigo-900 print:text-black">{offer.targetUnitsMumbai || offer.targetUnits}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Bengaluru Pricing */}
                              {offer.priceBengaluru && (
                                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200 print:bg-white print:border-gray-400">
                                  <div className="flex items-center gap-2 mb-3">
                                    <div className="w-2 h-2 bg-purple-600 rounded-full print:bg-gray-800"></div>
                                    <h5 className="text-sm font-bold text-purple-800 print:text-black">Bengaluru</h5>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-purple-700 print:text-black">Standard Price</span>
                                      <span className="text-sm text-gray-400 line-through print:text-black">₹{offer.priceBengaluru.toLocaleString()}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-purple-700 print:text-black">Offer Price</span>
                                      <div className="flex items-center gap-2">
                                        {(offer.finalPriceBengaluru && offer.finalPriceBengaluru < offer.priceBengaluru) && (
                                          <span className="text-xs font-bold text-white bg-purple-600 px-2 py-0.5 rounded print:text-black print:bg-transparent print:border print:border-gray-400">
                                            {Math.round(((offer.priceBengaluru - offer.finalPriceBengaluru) / offer.priceBengaluru) * 100)}% off
                                          </span>
                                        )}
                                        <span className="font-bold text-purple-900 print:text-black">
                                          ₹{(offer.finalPriceBengaluru || offer.priceBengaluru).toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                    
                                    {offer.finalPriceBengaluru && offer.finalPriceBengaluru < offer.priceBengaluru && (
                                      <div className="flex items-center justify-between border-t border-purple-300 pt-2 print:border-gray-400">
                                        <span className="text-xs text-purple-700 print:text-black">Total Savings</span>
                                        <span className="text-sm font-semibold text-purple-800 print:text-black">
                                          ₹{(offer.priceBengaluru - offer.finalPriceBengaluru).toLocaleString()}
                                        </span>
                                      </div>
                                    )}
                                    
                                    {(offer.targetUnitsBengaluru || offer.targetUnits) && (
                                      <div className="flex items-center justify-between border-t border-purple-300 pt-2 print:border-gray-400">
                                        <span className="text-xs text-purple-700 print:text-black">Target Units</span>
                                        <span className="text-sm font-bold text-purple-900 print:text-black">{offer.targetUnitsBengaluru || offer.targetUnits}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200 print:bg-white print:border-gray-400">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-indigo-700 print:text-black">Price</span>
                                <span className={`font-semibold ${offer.cancelled ? 'text-gray-500' : 'text-indigo-900'} print:text-black`}>
                                  {offer.pricing}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Why It Works */}
                          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200 print:bg-white print:border-gray-400">
                            <div className="flex items-start gap-2">
                              <TrendingUp className={`w-4 h-4 mt-0.5 ${offer.cancelled ? 'text-gray-300' : 'text-indigo-500'} print:text-black`} />
                              <p className={`text-xs italic leading-relaxed ${offer.cancelled ? 'text-gray-400' : 'text-indigo-700'} print:text-black`}>
                                "{offer.whyItWorks}"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Strategy Section */}
                <div className="strategy-section mt-8 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl p-6 border-2 border-indigo-200 print:bg-white print:border-gray-400 print:mt-4 print:p-3 print:rounded-lg">
                  <div className="flex items-center gap-3 mb-4 print:mb-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 text-white rounded-lg text-sm font-bold print:bg-gray-600 print:w-6 print:h-6 print:text-xs">
                      📈
                    </div>
                    <h4 className="text-lg font-serif font-bold text-indigo-900 print:text-black print:text-sm">
                      {month?.name || 'Unknown Month'} Strategy
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:gap-2 print:grid-cols-1">
                    <div className="bg-white rounded-lg p-4 border-2 border-indigo-200 print:border-gray-400 print:p-2">
                      <h5 className="font-semibold text-indigo-800 mb-2 text-sm print:text-black print:text-xs print:mb-1">Focus Areas</h5>
                      <ul className="text-xs text-indigo-700 space-y-1 print:text-black print:text-xs print:space-y-0">
                        {getMonthStrategy(month.id, 'focus').map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 print:gap-1">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full print:bg-gray-600 print:w-0.5 print:h-0.5"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border-2 border-indigo-200 print:border-gray-400 print:p-2">
                      <h5 className="font-semibold text-indigo-800 mb-2 text-sm print:text-black print:text-xs print:mb-1">Offer Mix</h5>
                      <ul className="text-xs text-indigo-700 space-y-1 print:text-black print:text-xs print:space-y-0">
                        {getMonthStrategy(month.id, 'offers').map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 print:gap-1">
                            <div className="w-1 h-1 bg-indigo-500 rounded-full print:bg-gray-600 print:w-0.5 print:h-0.5"></div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border-2 border-indigo-200 print:border-gray-400 print:p-2">
                      <h5 className="font-semibold text-indigo-800 mb-2 text-sm print:text-black print:text-xs print:mb-1">Key Metrics</h5>
                      <ul className="text-xs text-indigo-700 space-y-1 print:text-black print:text-xs print:space-y-0">
                        <li className="flex items-center gap-2 print:gap-1">
                          <div className="w-1 h-1 bg-indigo-500 rounded-full print:bg-gray-600 print:w-0.5 print:h-0.5"></div>
                          Target: {formatIndianCurrency(month.revenueTarget || 0)}
                        </li>
                        <li className="flex items-center gap-2 print:gap-1">
                          <div className="w-1 h-1 bg-indigo-500 rounded-full print:bg-gray-600 print:w-0.5 print:h-0.5"></div>
                          Offers: {monthOffers.length} planned
                        </li>
                        <li className="flex items-center gap-2 print:gap-1">
                          <div className="w-1 h-1 bg-indigo-500 rounded-full print:bg-gray-600 print:w-0.5 print:h-0.5"></div>
                          Mix: {monthOffers.filter(o => o.type === 'Core').length} Core, {monthOffers.filter(o => o.type === 'Luxury').length} Luxury
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      </div>
    </motion.div>
  );
};
