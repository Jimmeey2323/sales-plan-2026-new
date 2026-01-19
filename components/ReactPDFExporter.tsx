import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, PDFDownloadLink } from '@react-pdf/renderer';
import { MonthData, Offer } from '../types';
import { Download, Sparkles } from 'lucide-react';

// Register fonts for better typography
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
// });

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 15,
    fontFamily: 'Helvetica',
    fontSize: 9,
    lineHeight: 1.3,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#4f46e5',
    paddingBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#f8fafc',
  },
  summaryLabel: {
    fontSize: 7,
    color: '#6b7280',
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  monthSection: {
    marginBottom: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    backgroundColor: '#fefefe',
    breakInside: 'avoid',
  },
  monthHeader: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: 8,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  monthTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  monthTheme: {
    fontSize: 9,
    opacity: 0.9,
  },
  monthContent: {
    padding: 8,
  },
  offersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  offerCard: {
    width: '48%',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    padding: 6,
    backgroundColor: '#ffffff',
    marginBottom: 6,
    breakInside: 'avoid',
  },
  offerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  offerDescription: {
    fontSize: 7,
    color: '#6b7280',
    marginBottom: 4,
  },
  pricingSection: {
    marginBottom: 4,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 1,
  },
  pricingLabel: {
    fontSize: 6,
    color: '#6b7280',
  },
  pricingValue: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  strategySection: {
    backgroundColor: '#eff6ff',
    border: '1px solid #3b82f6',
    borderRadius: 4,
    padding: 6,
    marginTop: 6,
  },
  strategyTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  strategyGrid: {
    flexDirection: 'row',
    gap: 6,
  },
  strategyColumn: {
    flex: 1,
    backgroundColor: '#ffffff',
    border: '1px solid #bfdbfe',
    borderRadius: 3,
    padding: 4,
  },
  strategySubtitle: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 2,
  },
  strategyItem: {
    fontSize: 6,
    color: '#374151',
    marginBottom: 1,
    marginLeft: 3,
  },
});

interface ReactPDFDocumentProps {
  data: MonthData[];
  yearlyStats: {
    totalOffers: number;
    activeOffers: number;
    totalRevenue: number;
    mumbaiRevenue: number;
    bengaluruRevenue: number;
    growthPercent: number;
  };
}

const ReactPDFDocument: React.FC<ReactPDFDocumentProps> = ({ data, yearlyStats }) => {
  const formatCurrency = (amount: number): string => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toFixed(0)}`;
  };

  const getStrategyItems = (monthId: string, type: 'focus' | 'offers'): string[] => {
    const monthNum = parseInt(monthId);
    const strategies: Record<number, { focus: string[], offers: string[] }> = {
      1: {
        focus: ['New Year campaigns', 'Winter collections', 'Goal-setting products'],
        offers: ['Resolution packages', 'Early bird discounts', 'Bundle deals']
      },
      2: {
        focus: ['Valentine promotions', 'Love campaigns', 'Couples packages'],
        offers: ['Romantic packages', 'BOGO offers', 'Date night deals']
      },
      // Add more months as needed...
    };
    return strategies[monthNum]?.[type] || ['Strategic focus areas', 'Tailored offers', 'Seasonal opportunities'];
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>2026 Sales Masterplan</Text>
          <Text style={styles.subtitle}>Complete Strategic Overview - Professional Export</Text>
        </View>

        {/* Summary Stats */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Revenue Target</Text>
            <Text style={styles.summaryValue}>{formatCurrency(yearlyStats.totalRevenue)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Active Offers</Text>
            <Text style={styles.summaryValue}>{yearlyStats.activeOffers}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Growth Target</Text>
            <Text style={styles.summaryValue}>{yearlyStats.growthPercent.toFixed(1)}%</Text>
          </View>
        </View>

        {/* Monthly Sections */}
        {data.map((month, index) => (
          <View key={month.id} style={styles.monthSection} break={index > 0 && index % 3 === 0}>
            <View style={styles.monthHeader}>
              <Text style={styles.monthTitle}>{month.name} - {month.theme}</Text>
              <Text style={styles.monthTheme}>{month.offers.length} offers planned • Target: {formatCurrency(month.revenueTarget || 0)}</Text>
            </View>
            
            <View style={styles.monthContent}>
              {/* Show all offers, not just first 4 */}
              <View style={styles.offersGrid}>
                {month.offers.filter(offer => !offer.cancelled).map((offer) => (
                  <View key={offer.id} style={styles.offerCard}>
                    <Text style={styles.offerTitle}>{offer.title}</Text>
                    <Text style={styles.offerDescription}>{offer.description.length > 100 ? offer.description.substring(0, 100) + '...' : offer.description}</Text>
                    
                    {/* Pricing */}
                    <View style={styles.pricingSection}>
                      {offer.priceMumbai && (
                        <View style={styles.pricingRow}>
                          <Text style={styles.pricingLabel}>Mumbai</Text>
                          <Text style={styles.pricingValue}>₹{offer.priceMumbai.toLocaleString()}</Text>
                        </View>
                      )}
                      {offer.priceBengaluru && (
                        <View style={styles.pricingRow}>
                          <Text style={styles.pricingLabel}>Bengaluru</Text>
                          <Text style={styles.pricingValue}>₹{offer.priceBengaluru.toLocaleString()}</Text>
                        </View>
                      )}
                      {offer.finalPriceMumbai && offer.finalPriceMumbai < (offer.priceMumbai || 0) && (
                        <View style={styles.pricingRow}>
                          <Text style={styles.pricingLabel}>Mumbai Savings</Text>
                          <Text style={styles.pricingValue}>₹{((offer.priceMumbai || 0) - offer.finalPriceMumbai).toLocaleString()}</Text>
                        </View>
                      )}
                      {offer.finalPriceBengaluru && offer.finalPriceBengaluru < (offer.priceBengaluru || 0) && (
                        <View style={styles.pricingRow}>
                          <Text style={styles.pricingLabel}>Bengaluru Savings</Text>
                          <Text style={styles.pricingValue}>₹{((offer.priceBengaluru || 0) - offer.finalPriceBengaluru).toLocaleString()}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>

              {/* Strategy */}
              <View style={styles.strategySection}>
                <Text style={styles.strategyTitle}>{month.name} Strategy</Text>
                <View style={styles.strategyGrid}>
                  <View style={styles.strategyColumn}>
                    <Text style={styles.strategySubtitle}>Focus Areas</Text>
                    {getStrategyItems(month.id, 'focus').map((item, idx) => (
                      <Text key={idx} style={styles.strategyItem}>• {item}</Text>
                    ))}
                  </View>
                  <View style={styles.strategyColumn}>
                    <Text style={styles.strategySubtitle}>Offer Mix</Text>
                    {getStrategyItems(month.id, 'offers').map((item, idx) => (
                      <Text key={idx} style={styles.strategyItem}>• {item}</Text>
                    ))}
                  </View>
                  <View style={styles.strategyColumn}>
                    <Text style={styles.strategySubtitle}>Key Metrics</Text>
                    <Text style={styles.strategyItem}>• Revenue: {formatCurrency(month.revenueTarget || 0)}</Text>
                    <Text style={styles.strategyItem}>• Active: {month.offers.filter(o => !o.cancelled).length}</Text>
                    <Text style={styles.strategyItem}>• Core: {month.offers.filter(o => o.type === 'Core').length}</Text>
                    <Text style={styles.strategyItem}>• Luxury: {month.offers.filter(o => o.type === 'Luxury').length}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
};

interface ProfessionalPDFExporterProps {
  data: MonthData[];
  yearlyStats: {
    totalOffers: number;
    activeOffers: number;
    totalRevenue: number;
    mumbaiRevenue: number;
    bengaluruRevenue: number;
    growthPercent: number;
  };
  filename?: string;
}

export const ProfessionalPDFExporter: React.FC<ProfessionalPDFExporterProps> = ({ 
  data, 
  yearlyStats, 
  filename = 'sales-masterplan-2026-professional' 
}) => {
  return (
    <PDFDownloadLink
      document={<ReactPDFDocument data={data} yearlyStats={yearlyStats} />}
      fileName={`${filename}.pdf`}
      className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg print:hidden"
    >
      {({ blob, url, loading, error }) => (
        loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Generating Professional PDF...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Download Professional PDF
          </>
        )
      )}
    </PDFDownloadLink>
  );
};