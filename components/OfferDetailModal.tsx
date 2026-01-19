import React, { useState } from 'react';
import { Offer } from '../types';
import { X, Tag, TrendingUp, Users, Zap, Award, Briefcase, GraduationCap, History, Megaphone, MapPin, Package, Target, BarChart3, Clock } from 'lucide-react';
import { formatCurrency, formatCurrencyFull, formatNumber } from '../lib/formatters';

interface OfferDetailModalProps {
  offer: Offer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OfferDetailModal: React.FC<OfferDetailModalProps> = ({ offer, isOpen, onClose }) => {
  const [activeLocationTab, setActiveLocationTab] = useState<'mumbai' | 'bengaluru'>('mumbai');

  if (!isOpen || !offer) return null;

  const getIcon = () => {
    switch (offer.type) {
      case 'Hero': return <Award className="w-6 h-6 text-purple-600" />;
      case 'New': return <Users className="w-6 h-6 text-blue-600" />;
      case 'Flash': return <Zap className="w-6 h-6 text-yellow-600" />;
      case 'Retention': return <History className="w-6 h-6 text-green-600" />;
      case 'Corporate': return <Briefcase className="w-6 h-6 text-slate-600" />;
      case 'Student': return <GraduationCap className="w-6 h-6 text-pink-600" />;
      default: return <Tag className="w-6 h-6 text-gray-600" />;
    }
  };

  const getTypeStyles = () => {
    if (offer.cancelled) return 'bg-gray-100 border-gray-200 text-gray-500';
    switch (offer.type) {
      case 'Hero': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'New': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'Flash': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'Retention': return 'bg-green-50 border-green-200 text-green-800';
      case 'Student': return 'bg-pink-50 border-pink-200 text-pink-800';
      case 'Corporate': return 'bg-slate-50 border-slate-200 text-slate-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const hasLocationPricing = offer.priceMumbai || offer.priceBengaluru;
  const hasCollateralChannels = offer.collateralChannels && Object.values(offer.collateralChannels).some(Boolean);
  const hasCollateralTypes = offer.collateralTypes && Object.values(offer.collateralTypes).some(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-start justify-between z-10">
          <div className="flex items-start gap-4 flex-1">
            <div className="mt-1">
              {getIcon()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border flex items-center gap-2 ${getTypeStyles()}`}>
                  {offer.cancelled ? 'Cancelled' : `${offer.type} Offer`}
                </span>
                {(offer.targetUnitsMumbai || offer.targetUnitsBengaluru || offer.targetUnits) && (
                  <span className={`text-xs font-medium ${offer.cancelled ? 'text-gray-300' : 'text-gray-400'}`}>
                    Goal: {offer.targetUnitsMumbai || offer.targetUnitsBengaluru || offer.targetUnits} units
                  </span>
                )}
              </div>
              <h2 className={`text-2xl font-serif font-bold ${offer.cancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {offer.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
            <p className={`text-base leading-relaxed ${offer.cancelled ? 'text-gray-400' : 'text-gray-600'}`}>
              {offer.description}
            </p>
          </div>

          {/* Why It Works */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <TrendingUp className={`w-5 h-5 mt-0.5 ${offer.cancelled ? 'text-gray-300' : 'text-blue-600'}`} />
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Why This Works</h3>
                <p className={`text-sm italic leading-relaxed ${offer.cancelled ? 'text-gray-400' : 'text-gray-600'}`}>
                  "{offer.whyItWorks}"
                </p>
              </div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {offer.validityPeriod && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">VALIDITY</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{offer.validityPeriod}</p>
              </div>
            )}
            
            {offer.validitySessions && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">SESSIONS</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{formatNumber(offer.validitySessions)}</p>
              </div>
            )}
            
            {offer.freezeAttempts !== undefined && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">FREEZES</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{offer.freezeAttempts} attempts</p>
              </div>
            )}
            
            {(offer.targetUnitsMumbai || offer.targetUnitsBengaluru || offer.targetUnits) && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600">TARGET UNITS</span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {offer.targetUnitsMumbai && offer.targetUnitsBengaluru 
                    ? `${offer.targetUnitsMumbai}+${offer.targetUnitsBengaluru}`
                    : offer.targetUnits
                  }
                </p>
              </div>
            )}
          </div>

          {/* Operational Support */}
          {offer.operationalSupport && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Operational Support
              </h3>
              <p className="text-sm text-amber-800">{offer.operationalSupport}</p>
            </div>
          )}

          {/* Package Details */}
          {offer.packages && offer.packages.length > 0 && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Available Packages
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Package Name</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Price</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Sessions</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Validity</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Freezes</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">After Tax</th>
                      <th className="px-4 py-2 text-left font-semibold text-gray-700">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {offer.packages.map((pkg, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-900 font-medium">{pkg.name}</td>
                        <td className="px-4 py-3 text-gray-700">{formatCurrencyFull(pkg.price)}</td>
                        <td className="px-4 py-3 text-gray-700">{pkg.noOfSessions || '-'}</td>
                        <td className="px-4 py-3 text-gray-700">{pkg.validity} {pkg.validityUnit}</td>
                        <td className="px-4 py-3 text-gray-700">{pkg.freezeAttempts || '-'}</td>
                        <td className="px-4 py-3 font-semibold text-gray-900">{formatCurrencyFull(pkg.priceAfterTax)}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                            {pkg.location === 'Mumbai' ? 'MUM' : pkg.location === 'Bengaluru' ? 'BLR' : pkg.location}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pricing Details */}
          {hasLocationPricing ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location-Based Pricing
              </h3>
              
              {/* Location Tabs */}
              <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
                <button
                  onClick={() => setActiveLocationTab('mumbai')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                    activeLocationTab === 'mumbai'
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mumbai
                </button>
                <button
                  onClick={() => setActiveLocationTab('bengaluru')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                    activeLocationTab === 'bengaluru'
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Bengaluru
                </button>
              </div>

              {/* Pricing Grid */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                {activeLocationTab === 'mumbai' && offer.priceMumbai ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Standard Price</div>
                        <div className="text-xl text-gray-400 line-through">₹{offer.priceMumbai.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Offer Price</div>
                        <div className="flex items-center gap-2">
                          <div className={`text-2xl font-bold ${offer.cancelled ? 'text-gray-400' : 'text-gray-900'}`}>
                            ₹{(offer.finalPriceMumbai || offer.priceMumbai).toLocaleString()}
                          </div>
                          {offer.finalPriceMumbai && offer.finalPriceMumbai < offer.priceMumbai && (
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                              {Math.round(((offer.priceMumbai - offer.finalPriceMumbai) / offer.priceMumbai) * 100)}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {offer.finalPriceMumbai && offer.finalPriceMumbai < offer.priceMumbai && (
                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Total Savings</div>
                        <div className="text-xl font-semibold text-green-700">
                          ₹{(offer.priceMumbai - offer.finalPriceMumbai).toLocaleString()}
                        </div>
                      </div>
                    )}

                    {(offer.targetUnitsMumbai || offer.targetUnits) && (
                      <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Target Units</div>
                          <div className="text-xl font-bold text-gray-900">
                            {offer.targetUnitsMumbai || offer.targetUnits}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Projected Revenue</div>
                          <div className="text-xl font-bold text-gray-900">
                            {formatCurrency((offer.finalPriceMumbai || offer.priceMumbai) * (typeof (offer.targetUnitsMumbai || offer.targetUnits) === 'number' ? (offer.targetUnitsMumbai || offer.targetUnits) : parseInt((offer.targetUnitsMumbai || offer.targetUnits) as string) || 0))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : activeLocationTab === 'bengaluru' && offer.priceBengaluru ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Standard Price</div>
                        <div className="text-xl text-gray-400 line-through">₹{offer.priceBengaluru.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Offer Price</div>
                        <div className="flex items-center gap-2">
                          <div className={`text-2xl font-bold ${offer.cancelled ? 'text-gray-400' : 'text-gray-900'}`}>
                            ₹{(offer.finalPriceBengaluru || offer.priceBengaluru).toLocaleString()}
                          </div>
                          {offer.finalPriceBengaluru && offer.finalPriceBengaluru < offer.priceBengaluru && (
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                              {Math.round(((offer.priceBengaluru - offer.finalPriceBengaluru) / offer.priceBengaluru) * 100)}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {offer.finalPriceBengaluru && offer.finalPriceBengaluru < offer.priceBengaluru && (
                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Total Savings</div>
                        <div className="text-xl font-semibold text-green-700">
                          ₹{(offer.priceBengaluru - offer.finalPriceBengaluru).toLocaleString()}
                        </div>
                      </div>
                    )}

                    {(offer.targetUnitsBengaluru || offer.targetUnits) && (
                      <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-6">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Target Units</div>
                          <div className="text-xl font-bold text-gray-900">
                            {offer.targetUnitsBengaluru || offer.targetUnits}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Projected Revenue</div>
                          <div className="text-xl font-bold text-gray-900">
                            {formatCurrency((offer.finalPriceBengaluru || offer.priceBengaluru) * (typeof (offer.targetUnitsBengaluru || offer.targetUnits) === 'number' ? (offer.targetUnitsBengaluru || offer.targetUnits) : parseInt((offer.targetUnitsBengaluru || offer.targetUnits) as string) || 0))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p className="text-sm">No pricing available for this location</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Pricing</h3>
              <div className={`text-xl font-semibold ${offer.cancelled ? 'text-gray-500' : 'text-gray-900'}`}>
                {offer.pricing}
              </div>
            </div>
          )}

          {/* Revenue Forecast */}
          {offer.revenueForecast && (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Revenue Forecast
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {offer.revenueForecast.mumbai && (
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-green-700 font-semibold mb-1">Mumbai</p>
                    <p className="text-lg font-bold text-green-900">{offer.revenueForecast.mumbai}</p>
                  </div>
                )}
                {offer.revenueForecast.bengaluru && (
                  <div className="bg-white/60 rounded-lg p-3">
                    <p className="text-xs text-green-700 font-semibold mb-1">Bengaluru</p>
                    <p className="text-lg font-bold text-green-900">{offer.revenueForecast.bengaluru}</p>
                  </div>
                )}
                {offer.revenueForecast.total && (
                  <div className="bg-green-100 rounded-lg p-3">
                    <p className="text-xs text-green-900 font-semibold mb-1">TOTAL</p>
                    <p className="text-lg font-bold text-green-900">{offer.revenueForecast.total}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Ad Promotion Status */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-semibold text-gray-700">Advertising</h3>
                  <p className="text-xs text-gray-500">Promotion status</p>
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                offer.promoteOnAds 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {offer.promoteOnAds ? 'Active' : 'Not Active'}
              </div>
            </div>
          </div>

          {/* Marketing Collateral */}
          {(hasCollateralChannels || hasCollateralTypes) && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <Megaphone className="w-4 h-4" />
                Marketing Collateral Required
              </h3>
              
              <div className="space-y-4">
                {/* Channels */}
                {hasCollateralChannels && (
                  <div>
                    <div className="text-xs font-medium text-blue-800 mb-2">Channels</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(offer.collateralChannels || {}).map(([key, value]) => 
                        value && (
                          <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {key === 'whatsapp' && 'WhatsApp'}
                            {key === 'email' && 'Email'}
                            {key === 'inStudio' && 'In-Studio'}
                            {key === 'website' && 'Website'}
                            {key === 'socialMedia' && 'Social Media'}
                            {key === 'metaAds' && 'Meta Ads'}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
                
                {/* Types */}
                {hasCollateralTypes && (
                  <div>
                    <div className="text-xs font-medium text-blue-800 mb-2">Collateral Types</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(offer.collateralTypes || {}).map(([key, value]) => 
                        value && (
                          <span key={key} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {key === 'tentCards' && 'Tent Cards'}
                            {key === 'imageCreative' && 'Image Creative'}
                            {key === 'videoCreative' && 'Video Creative'}
                            {key === 'easelStandee' && 'Easel Standee'}
                            {key === 'emailTemplate' && 'Email Template'}
                            {key === 'landingPage' && 'Landing Page'}
                            {key === 'socialPosts' && 'Social Posts'}
                            {key === 'storyTemplate' && 'Story Template'}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
