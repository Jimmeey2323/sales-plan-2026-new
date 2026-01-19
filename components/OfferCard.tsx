import React, { useState } from 'react';
import { Offer } from '../types';
import { Tag, TrendingUp, Users, Zap, Award, Briefcase, GraduationCap, History, MoreVertical, Edit2, Trash2, Ban, Megaphone } from 'lucide-react';
import { useSalesData } from '../context/SalesContext';
import { useAdmin } from '../context/AdminContext';
import { OfferForm } from './OfferForm';
import { OfferDetailModal } from './OfferDetailModal';

interface OfferCardProps {
  offer: Offer;
  monthId: string;
}

export const OfferCard: React.FC<OfferCardProps> = ({ offer, monthId }) => {
  const { updateOffer, deleteOffer, toggleCancelled } = useSalesData();
  const { isAdmin } = useAdmin();
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeLocationTab, setActiveLocationTab] = useState<'mumbai' | 'bengaluru'>('mumbai');
  const [showCollateralSection, setShowCollateralSection] = useState(false);

  const getIcon = () => {
    switch (offer.type) {
      case 'Hero': return <Award className="w-5 h-5 text-purple-600" />;
      case 'New': return <Users className="w-5 h-5 text-blue-600" />;
      case 'Flash': return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'Retention': return <History className="w-5 h-5 text-green-600" />;
      case 'Corporate': return <Briefcase className="w-5 h-5 text-slate-600" />;
      case 'Student': return <GraduationCap className="w-5 h-5 text-pink-600" />;
      default: return <Tag className="w-5 h-5 text-gray-600" />;
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

  const handleUpdate = (updatedData: Omit<Offer, 'id'>) => {
    if (offer.id) {
      updateOffer(monthId, offer.id, updatedData);
    }
  };

  const handleAdToggle = () => {
    if (offer.id) {
      updateOffer(monthId, offer.id, { promoteOnAds: !offer.promoteOnAds });
    }
  };

  return (
    <>
      <div 
        onClick={() => setShowDetailModal(true)}
        className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-300 flex flex-col h-full relative group cursor-pointer
        ${offer.cancelled ? 'border-gray-200 bg-gray-50' : 'border-gray-100 hover:shadow-md'}`}
      >
        {/* Actions Menu - Admin Only */}
        {isAdmin && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          >
             <div className="flex bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden">
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   setIsEditing(true);
                 }}
                 className="p-2 hover:bg-gray-50 text-gray-600 border-r border-gray-100" 
                 title="Edit"
               >
                 <Edit2 className="w-4 h-4" />
               </button>
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   offer.id && toggleCancelled(monthId, offer.id);
                 }}
                 className={`p-2 hover:bg-gray-50 border-r border-gray-100 ${offer.cancelled ? 'text-green-600' : 'text-orange-600'}`}
                 title={offer.cancelled ? "Activate" : "Cancel"}
               >
                 <Ban className="w-4 h-4" />
               </button>
               <button 
                 onClick={(e) => {
                   e.stopPropagation();
                   offer.id && deleteOffer(monthId, offer.id);
                 }}
                 className="p-2 hover:bg-red-50 text-red-600" 
                 title="Delete"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
             </div>
          </div>
        )}

        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border flex items-center gap-2 ${getTypeStyles()}`}>
            {!offer.cancelled && getIcon()}
            {offer.cancelled ? 'Cancelled' : `${offer.type} Offer`}
          </span>
          {(offer.targetUnitsMumbai || offer.targetUnitsBengaluru || offer.targetUnits) && (
            <span className={`text-xs font-medium ${offer.cancelled ? 'text-gray-300' : 'text-gray-400'}`}>
              Goal: {offer.targetUnitsMumbai || offer.targetUnitsBengaluru || offer.targetUnits} units
            </span>
          )}
        </div>

        {/* Collateral Selection Section - Admin Only */}
        {!offer.cancelled && isAdmin && (
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-blue-50 rounded-lg p-4 mb-4"
          >
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowCollateralSection(!showCollateralSection)}
            >
              <h4 className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                <Megaphone className="w-4 h-4" />
                Marketing Collateral Required
              </h4>
              <div className="text-blue-600">
                {showCollateralSection ? '−' : '+'}
              </div>
            </div>
            
            {showCollateralSection && (
              <div className="space-y-3 mt-3">
                {/* Channels */}
                <div>
                  <div className="text-xs font-medium text-blue-800 mb-2">Channels</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'whatsapp', label: 'WhatsApp' },
                      { key: 'email', label: 'Email' },
                      { key: 'inStudio', label: 'In-Studio' },
                      { key: 'website', label: 'Website' },
                      { key: 'socialMedia', label: 'Social Media' },
                      { key: 'metaAds', label: 'Meta Ads' }
                    ].map(channel => (
                      <label key={channel.key} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={offer.collateralChannels?.[channel.key as keyof typeof offer.collateralChannels] || false}
                          onChange={(e) => {
                            const updatedChannels = {
                              ...offer.collateralChannels,
                              [channel.key]: e.target.checked
                            };
                            updateOffer(monthId, offer.id!, { 
                              collateralChannels: updatedChannels 
                            });
                          }}
                          className="w-3 h-3 text-blue-600"
                        />
                        <span className="text-blue-700">{channel.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Types */}
                <div>
                  <div className="text-xs font-medium text-blue-800 mb-2">Collateral Types</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'tentCards', label: 'Tent Cards' },
                      { key: 'imageCreative', label: 'Image Creative' },
                      { key: 'videoCreative', label: 'Video Creative' },
                      { key: 'easelStandee', label: 'Easel Standee' },
                      { key: 'emailTemplate', label: 'Email Template' },
                      { key: 'landingPage', label: 'Landing Page' },
                      { key: 'socialPosts', label: 'Social Posts' },
                      { key: 'storyTemplate', label: 'Story Template' }
                    ].map(type => (
                      <label key={type.key} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={offer.collateralTypes?.[type.key as keyof typeof offer.collateralTypes] || false}
                          onChange={(e) => {
                            const updatedTypes = {
                              ...offer.collateralTypes,
                              [type.key]: e.target.checked
                            };
                            updateOffer(monthId, offer.id!, { 
                              collateralTypes: updatedTypes 
                            });
                          }}
                          className="w-3 h-3 text-blue-600"
                        />
                        <span className="text-blue-700">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        <h3 className={`text-xl font-serif font-semibold mb-2 leading-tight ${offer.cancelled ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {offer.title}
        </h3>
        
        <p className={`text-sm mb-4 flex-grow ${offer.cancelled ? 'text-gray-400' : 'text-gray-600'}`}>
          {offer.description}
        </p>

        <div className={`mt-auto space-y-3 ${offer.cancelled ? 'opacity-50' : ''}`}>
          {/* Location Tabs */}
          {(offer.priceMumbai || offer.priceBengaluru) ? (
            <div className="space-y-3">
              {/* Tab Navigation */}
              <div className="flex rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setActiveLocationTab('mumbai')}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                    activeLocationTab === 'mumbai'
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Mumbai
                </button>
                <button
                  onClick={() => setActiveLocationTab('bengaluru')}
                  className={`flex-1 py-2 px-3 rounded-md text-xs font-semibold transition-all ${
                    activeLocationTab === 'bengaluru'
                      ? 'bg-white text-brand-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Bengaluru
                </button>
              </div>

              {/* Tab Content */}
              <div className="pt-3 border-t border-gray-50">
                {activeLocationTab === 'mumbai' && offer.priceMumbai && (
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="text-xs text-gray-600 font-medium">Standard Price</div>
                      <span className="text-sm text-gray-400 line-through">₹{offer.priceMumbai.toLocaleString()}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="text-xs text-gray-600 font-medium">Offer Price</div>
                      <div className="flex items-center gap-2">
                        {offer.finalPriceMumbai && offer.finalPriceMumbai < offer.priceMumbai && (
                          <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                            {Math.round(((offer.priceMumbai - offer.finalPriceMumbai) / offer.priceMumbai) * 100)}% off
                          </span>
                        )}
                        <span className={`font-bold text-lg ${offer.cancelled ? 'text-gray-400' : 'text-gray-900'}`}>
                          ₹{(offer.finalPriceMumbai || offer.priceMumbai).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {offer.finalPriceMumbai && offer.finalPriceMumbai < offer.priceMumbai && (
                      <div className="flex items-baseline justify-between">
                        <div className="text-xs text-gray-600 font-medium">Total Savings</div>
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{(offer.priceMumbai - offer.finalPriceMumbai).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {(offer.targetUnitsMumbai || offer.targetUnits) && (
                      <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-600 font-medium">Target Units</div>
                        <span className="text-sm font-bold text-gray-900">{offer.targetUnitsMumbai || offer.targetUnits}</span>
                      </div>
                    )}
                    {(offer.targetUnitsMumbai || offer.targetUnits) && (offer.finalPriceMumbai || offer.priceMumbai) && (
                      <div className="flex items-baseline justify-between">
                        <div className="text-xs text-gray-600 font-medium">Projected Revenue</div>
                        <span className="text-sm font-bold text-gray-900">
                          ₹{((offer.finalPriceMumbai || offer.priceMumbai) * (typeof (offer.targetUnitsMumbai || offer.targetUnits) === 'number' ? (offer.targetUnitsMumbai || offer.targetUnits) : parseInt((offer.targetUnitsMumbai || offer.targetUnits) as string) || 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                
                {activeLocationTab === 'bengaluru' && offer.priceBengaluru && (
                  <div className="space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="text-xs text-gray-600 font-medium">Standard Price</div>
                      <span className="text-sm text-gray-400 line-through">₹{offer.priceBengaluru.toLocaleString()}</span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="text-xs text-gray-600 font-medium">Offer Price</div>
                      <div className="flex items-center gap-2">
                        {offer.finalPriceBengaluru && offer.finalPriceBengaluru < offer.priceBengaluru && (
                          <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded">
                            {Math.round(((offer.priceBengaluru - offer.finalPriceBengaluru) / offer.priceBengaluru) * 100)}% off
                          </span>
                        )}
                        <span className={`font-bold text-lg ${offer.cancelled ? 'text-gray-400' : 'text-gray-900'}`}>
                          ₹{(offer.finalPriceBengaluru || offer.priceBengaluru).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {offer.finalPriceBengaluru && offer.finalPriceBengaluru < offer.priceBengaluru && (
                      <div className="flex items-baseline justify-between">
                        <div className="text-xs text-gray-600 font-medium">Total Savings</div>
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{(offer.priceBengaluru - offer.finalPriceBengaluru).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {(offer.targetUnitsBengaluru || offer.targetUnits) && (
                      <div className="flex items-baseline justify-between pt-2 border-t border-gray-100">
                        <div className="text-xs text-gray-600 font-medium">Target Units</div>
                        <span className="text-sm font-bold text-gray-900">{offer.targetUnitsBengaluru || offer.targetUnits}</span>
                      </div>
                    )}
                    {(offer.targetUnitsBengaluru || offer.targetUnits) && (offer.finalPriceBengaluru || offer.priceBengaluru) && (
                      <div className="flex items-baseline justify-between">
                        <div className="text-xs text-gray-600 font-medium">Projected Revenue</div>
                        <span className="text-sm font-bold text-gray-900">
                          ₹{((offer.finalPriceBengaluru || offer.priceBengaluru) * (typeof (offer.targetUnitsBengaluru || offer.targetUnits) === 'number' ? (offer.targetUnitsBengaluru || offer.targetUnits) : parseInt((offer.targetUnitsBengaluru || offer.targetUnits) as string) || 0)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Fallback for missing pricing */}
                {((activeLocationTab === 'mumbai' && !offer.priceMumbai) || 
                  (activeLocationTab === 'bengaluru' && !offer.priceBengaluru)) && (
                  <div className="text-center py-4 text-gray-400">
                    <p className="text-xs">No pricing available for this location</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-baseline justify-between pt-4 border-t border-gray-50">
              <div className="text-sm text-gray-500">Price</div>
              <div className={`font-semibold ${offer.cancelled ? 'text-gray-500' : 'text-gray-900'}`}>{offer.pricing}</div>
            </div>
          )}

        {/* Ad Promotion Toggle */}
          {!offer.cancelled && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-between pt-3 border-t border-gray-100"
            >
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-medium text-gray-600">Promote on Ads</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdToggle();
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                  offer.promoteOnAds ? 'bg-brand-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    offer.promoteOnAds ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-3 mt-3">
            <div className="flex items-start gap-2">
              <TrendingUp className={`w-4 h-4 mt-0.5 ${offer.cancelled ? 'text-gray-300' : 'text-gray-400'}`} />
              <p className={`text-xs italic leading-relaxed ${offer.cancelled ? 'text-gray-400' : 'text-gray-500'}`}>
                "{offer.whyItWorks}"
              </p>
            </div>
          </div>
        </div>
      </div>

      <OfferForm 
        isOpen={isEditing} 
        onClose={() => setIsEditing(false)} 
        onSave={handleUpdate}
        title="Edit Offer"
        initialData={offer}
      />

      <OfferDetailModal
        offer={offer}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
};
