import React, { useState, useEffect } from 'react';
import { Offer } from '../types';
import { X } from 'lucide-react';

interface OfferFormProps {
  initialData?: Offer;
  isOpen: boolean;
  onClose: () => void;
  onSave: (offer: Omit<Offer, 'id'>) => void;
  title: string;
}

const OFFER_TYPES = ['New', 'Hero', 'Retention', 'Flash', 'Event', 'Student', 'Corporate', 'Lapsed'];

export const OfferForm: React.FC<OfferFormProps> = ({ initialData, isOpen, onClose, onSave, title }) => {
  const [formData, setFormData] = useState<Partial<Offer>>({
    title: '',
    type: 'New',
    description: '',
    pricing: '',
    priceMumbai: undefined,
    priceBengaluru: undefined,
    finalPriceMumbai: undefined,
    finalPriceBengaluru: undefined,
    savings: '',
    whyItWorks: '',
    targetUnits: '',
    targetUnitsMumbai: '',
    targetUnitsBengaluru: '',
    marketingCollateral: '',
    operationalSupport: '',
    promoteOnAds: false,
    collateralChannels: {
      email: true,
      whatsapp: true,
      inStudio: true,
      website: false,
      socialMedia: false,
      metaAds: false
    },
    collateralTypes: {
      imageCreative: true,
      tentCards: true,
      videoCreative: false,
      easelStandee: true,
      emailTemplate: true,
      landingPage: false,
      socialPosts: false,
      storyTemplate: false
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        title: '',
        type: 'New',
        description: '',
        pricing: '',
        priceMumbai: undefined,
        priceBengaluru: undefined,
        finalPriceMumbai: undefined,
        finalPriceBengaluru: undefined,
        savings: '',
        whyItWorks: '',
        targetUnits: '',
        targetUnitsMumbai: '',
        targetUnitsBengaluru: '',
        marketingCollateral: '',
        operationalSupport: '',
        promoteOnAds: false,
        collateralChannels: {
          email: true,
          whatsapp: true,
          inStudio: true,
          website: false,
          socialMedia: false,
          metaAds: false
        },
        collateralTypes: {
          imageCreative: true,
          tentCards: true,
          videoCreative: false,
          easelStandee: true,
          emailTemplate: true,
          landingPage: false,
          socialPosts: false,
          storyTemplate: false
        }
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Offer, 'id'>);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-serif font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offer Title</label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="e.g. Fresh Start, No Guilt"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value as any})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
              >
                {OFFER_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Units</label>
              <input
                type="text"
                value={formData.targetUnits}
                onChange={e => setFormData({...formData, targetUnits: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. 50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="What is the offer?"
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Mumbai Pricing & Target</h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard Price</label>
                <input
                  type="number"
                  value={formData.priceMumbai || ''}
                  onChange={e => setFormData({...formData, priceMumbai: e.target.value ? parseFloat(e.target.value) : undefined})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g. 18638"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
                <input
                  type="number"
                  value={formData.finalPriceMumbai || ''}
                  onChange={e => setFormData({...formData, finalPriceMumbai: e.target.value ? parseFloat(e.target.value) : undefined})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g. 11999"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Units (Mumbai)</label>
              <input
                type="text"
                value={formData.targetUnitsMumbai || ''}
                onChange={e => setFormData({...formData, targetUnitsMumbai: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. 30"
              />
            </div>
          </div>

          {/* Bengaluru Pricing */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Bengaluru Pricing & Target</h4>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Standard Price</label>
                <input
                  type="number"
                  value={formData.priceBengaluru || ''}
                  onChange={e => setFormData({...formData, priceBengaluru: e.target.value ? parseFloat(e.target.value) : undefined})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g. 14595"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
                <input
                  type="number"
                  value={formData.finalPriceBengaluru || ''}
                  onChange={e => setFormData({...formData, finalPriceBengaluru: e.target.value ? parseFloat(e.target.value) : undefined})}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g. 11999"
                />
              </div>
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Units (Bengaluru)</label>
              <input
                type="text"
                value={formData.targetUnitsBengaluru || ''}
                onChange={e => setFormData({...formData, targetUnitsBengaluru: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. 20"
              />
            </div>          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pricing Display</label>
              <input
                type="text"
                value={formData.pricing}
                onChange={e => setFormData({...formData, pricing: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="e.g. Starting at ₹11,999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Savings Text</label>
              <input
                type="text"
                value={formData.savings}
                onChange={e => setFormData({...formData, savings: e.target.value})}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="Optional"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Marketing Collateral</label>
            <textarea
              rows={2}
              value={formData.marketingCollateral}
              onChange={e => setFormData({...formData, marketingCollateral: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. Email campaign, WhatsApp blasts, Instagram stories"
            />
          </div>

          {/* Collateral Selection Checkboxes */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-3">Marketing Collateral Selection</h4>
            
            <div className="space-y-4">
              {/* Channels */}
              <div>
                <div className="text-xs font-medium text-blue-800 mb-2">Channels</div>
                <div className="grid grid-cols-3 gap-3">
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
                        checked={formData.collateralChannels?.[channel.key as keyof typeof formData.collateralChannels] || false}
                        onChange={(e) => {
                          const updatedChannels = {
                            ...formData.collateralChannels,
                            [channel.key]: e.target.checked
                          };
                          setFormData({...formData, collateralChannels: updatedChannels});
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
                <div className="grid grid-cols-3 gap-3">
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
                        checked={formData.collateralTypes?.[type.key as keyof typeof formData.collateralTypes] || false}
                        onChange={(e) => {
                          const updatedTypes = {
                            ...formData.collateralTypes,
                            [type.key]: e.target.checked
                          };
                          setFormData({...formData, collateralTypes: updatedTypes});
                        }}
                        className="w-3 h-3 text-blue-600"
                      />
                      <span className="text-blue-700">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Operational Support</label>
            <textarea
              rows={2}
              value={formData.operationalSupport}
              onChange={e => setFormData({...formData, operationalSupport: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="e.g. Welcome kit with branded water bottle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Why It Works (Strategic Logic)</label>
            <textarea
              required
              rows={2}
              value={formData.whyItWorks}
              onChange={e => setFormData({...formData, whyItWorks: e.target.value})}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-brand-500 outline-none"
              placeholder="Explain the strategy..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 text-white bg-brand-600 rounded-lg hover:bg-brand-700 font-medium transition-colors shadow-sm"
            >
              Save Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
