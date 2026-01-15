import React from 'react';
import { MonthData } from '../types';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, DollarSign, Package } from 'lucide-react';

interface YearOverviewProps {
  data: MonthData[];
  hideCancelled?: boolean;
}

export const YearOverview: React.FC<YearOverviewProps> = ({ data, hideCancelled = false }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Calculate total stats
  const totalActiveOffers = data.reduce((sum, month) => 
    sum + month.offers.filter(o => !o.cancelled).length, 0
  );

  const totalOffers = data.reduce((sum, month) => sum + month.offers.length, 0);

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Header Section */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-3 text-brand-600">
          <Calendar className="w-6 h-6" />
          <span className="text-sm font-bold uppercase tracking-widest">2026 Annual Overview</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">Full Year Sales Plan</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          Complete overview of all 12 months of strategic sales initiatives for Physique 57 India
        </p>
      </motion.div>

      {/* Year Stats */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-brand-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900">{totalOffers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Offers</p>
              <p className="text-2xl font-bold text-gray-900">{totalActiveOffers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Months Planned</p>
              <p className="text-2xl font-bold text-gray-900">{data.length}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Monthly Breakdown */}
      <motion.div variants={item} className="space-y-4">
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Monthly Breakdown</h2>
        
        <div className="space-y-6">
          {data.map((month, index) => (
            <motion.div
              key={month.id}
              variants={item}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-bold text-brand-600 uppercase tracking-wider">
                      Month {index + 1}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                    <h3 className="text-xl font-serif font-bold text-gray-900">{month.name}</h3>
                  </div>
                  <p className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600 mb-2">
                    {month.theme}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {month.summary}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-500" />
                      <span className="text-gray-600">
                        <strong className="text-gray-900">{month.offers.filter(o => !o.cancelled).length}</strong> Active Offers
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gray-400" />
                      <span className="text-gray-600">
                        <strong className="text-gray-900">{month.offers.filter(o => o.cancelled).length}</strong> Cancelled
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="text-gray-600">
                        Target: <strong className="text-gray-900">{month.revenueTargetTotal}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Offers Summary */}
              {month.offers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Offers Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {month.offers.filter(o => !o.cancelled).map((offer) => (
                      <div 
                        key={offer.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="flex items-start gap-2 mb-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            offer.type === 'Hero' ? 'bg-purple-100 text-purple-700' :
                            offer.type === 'New' ? 'bg-blue-100 text-blue-700' :
                            offer.type === 'Retention' ? 'bg-green-100 text-green-700' :
                            offer.type === 'Flash' ? 'bg-red-100 text-red-700' :
                            offer.type === 'Event' ? 'bg-yellow-100 text-yellow-700' :
                            offer.type === 'Student' ? 'bg-cyan-100 text-cyan-700' :
                            offer.type === 'Corporate' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {offer.type}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 mb-1">{offer.title}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">{offer.description}</p>
                        <p className="text-xs font-bold text-brand-600 mt-2">{offer.pricing}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Targets Summary */}
              {month.financialTargets && month.financialTargets.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-bold text-gray-700 mb-3">Financial Targets</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {month.financialTargets.map((target, idx) => (
                      <div 
                        key={idx}
                        className="bg-blue-50 rounded-lg p-3 border border-blue-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-blue-900">{target.location}</span>
                          <span className="text-xs text-blue-600">{target.category}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>Target: <strong className="text-gray-900">{target.targetUnits} units</strong></span>
                          <span>Rev: <strong className="text-gray-900">{target.revenueTarget}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
