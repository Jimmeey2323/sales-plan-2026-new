import React, { useState } from 'react';
import { X, Shuffle, Plus, Save, Wand2 } from 'lucide-react';

interface OfferGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (offer: GeneratedOffer) => void;
}

interface GeneratedOffer {
  id: string;
  membershipType: string;
  offerType: string;
  offerDetails: string;
  value: string;
  description: string;
  validUntil: string;
  location: string;
  originalPrice: number;
  finalPrice: number;
  savings: number;
}

const OfferGeneratorModal: React.FC<OfferGeneratorModalProps> = ({ isOpen, onClose, onSave }) => {
  const [location, setLocation] = useState('Mumbai');
  const [membershipType, setMembershipType] = useState('');
  const [offerType, setOfferType] = useState('');
  const [customOfferDetails, setCustomOfferDetails] = useState('');
  const [customValue, setCustomValue] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [generatedOffer, setGeneratedOffer] = useState<GeneratedOffer | null>(null);

  // Real membership types with actual pricing from the business
  const membershipPricing = {
    'Studio 1 Month Unlimited': { mumbai: 18638, bengaluru: 14595 },
    'Studio 3 Month Unlimited': { mumbai: 53288, bengaluru: 42210 },
    'Studio Annual Unlimited': { mumbai: 202125, bengaluru: 156240 },
    '10-Class Pack': { mumbai: 15750, bengaluru: 12600 },
    '12-Class Pack': { mumbai: 15803, bengaluru: 13125 },
    '20-Class Pack': { mumbai: 31500, bengaluru: 25200 },
    '30-Class Pack': { mumbai: 47250, bengaluru: 37800 },
    'Studio Single Class': { mumbai: 1838, bengaluru: 1418 },
    '6-Week Bootcamp': { mumbai: 31500, bengaluru: 23100 },
    'Private Session': { mumbai: 5250, bengaluru: 4121 }
  };

  const membershipTypes = Object.keys(membershipPricing);

  const offerTypes = [
    { type: 'Discount', examples: ['25% off first month', '20% off annual', '15% off class pack', '₹3,000 off 3-month'], discountRange: [15, 40] },
    { type: 'Extension', examples: ['Buy 3 get 1 month free', '+2 weeks validity', 'Double freeze credits', '50% extra classes'], discountRange: [20, 30] },
    { type: 'Freeze', examples: ['4 freeze credits included', '6-month pause anytime', '2 medical freezes', 'Travel hold option'], discountRange: [0, 15] },
    { type: 'Comp Addition', examples: ['+ 2 private sessions', '+ nutrition consult', '+ guest passes', '+ retail voucher'], discountRange: [10, 25] },
    { type: 'Bundle Deal', examples: ['Membership + ₹3k voucher', 'Classes + equipment', '+ personal training', 'Unlimited + workshops'], discountRange: [15, 35] }
  ];

  const generateRandomOffer = () => {
    const randomMembership = membershipTypes[Math.floor(Math.random() * membershipTypes.length)];
    const randomOfferType = offerTypes[Math.floor(Math.random() * offerTypes.length)];
    const randomExample = randomOfferType.examples[Math.floor(Math.random() * randomOfferType.examples.length)];
    
    // Get real pricing for selected location
    const originalPrice = location === 'Mumbai' 
      ? membershipPricing[randomMembership].mumbai 
      : membershipPricing[randomMembership].bengaluru;
    
    // Calculate realistic discount based on offer type
    const discountPercent = randomOfferType.discountRange[0] + 
      Math.floor(Math.random() * (randomOfferType.discountRange[1] - randomOfferType.discountRange[0] + 1));
    
    const finalPrice = Math.round(originalPrice * (1 - discountPercent / 100));
    const savings = originalPrice - finalPrice;
    
    const descriptions = [
      'Limited time offer for new members only',
      'Perfect for getting started on your fitness journey', 
      'Best value for committed fitness enthusiasts',
      'Exclusive deal for this month only',
      'Special promotion - while supplies last',
      'Great for trying out our premium services',
      'Early bird special - don\'t miss out',
      'Flash sale - grab this deal now'
    ];
    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];

    const dates = ['February 28, 2026', 'March 31, 2026', 'April 15, 2026', 'May 31, 2026', 'June 30, 2026'];
    const randomDate = dates[Math.floor(Math.random() * dates.length)];

    const offer: GeneratedOffer = {
      id: Math.random().toString(36).substr(2, 9),
      membershipType: randomMembership,
      offerType: randomOfferType.type,
      offerDetails: randomExample,
      value: `₹${finalPrice.toLocaleString('en-IN')} (${discountPercent}% off)`,
      description: randomDescription,
      validUntil: randomDate,
      location: location,
      originalPrice: originalPrice,
      finalPrice: finalPrice,
      savings: savings
    };

    setGeneratedOffer(offer);
    setMembershipType(randomMembership);
    setOfferType(randomOfferType.type);
    setCustomOfferDetails(randomExample);
    setCustomValue(`₹${finalPrice.toLocaleString('en-IN')} (${discountPercent}% off)`);
    setCustomDescription(randomDescription);
    setValidUntil(randomDate);
  };

  const createCustomOffer = () => {
    if (!membershipType || !offerType) return;

    // Get real pricing for selected membership and location
    const originalPrice = location === 'Mumbai' 
      ? membershipPricing[membershipType].mumbai 
      : membershipPricing[membershipType].bengaluru;
    
    // Extract discount from custom value or use default
    let finalPrice = originalPrice;
    let savings = 0;
    let displayValue = customValue;
    
    if (customValue.includes('%')) {
      const discount = parseInt(customValue.replace('%', '').replace('off', '').trim());
      if (!isNaN(discount)) {
        finalPrice = Math.round(originalPrice * (1 - discount / 100));
        savings = originalPrice - finalPrice;
        displayValue = `₹${finalPrice.toLocaleString('en-IN')} (${discount}% off)`;
      }
    } else if (customValue.includes('₹')) {
      const price = parseInt(customValue.replace(/[₹,]/g, ''));
      if (!isNaN(price)) {
        finalPrice = price;
        savings = Math.max(0, originalPrice - price);
        const discountPercent = Math.round((savings / originalPrice) * 100);
        displayValue = `₹${finalPrice.toLocaleString('en-IN')} (${discountPercent}% off)`;
      }
    }

    const offer: GeneratedOffer = {
      id: Math.random().toString(36).substr(2, 9),
      membershipType,
      offerType,
      offerDetails: customOfferDetails,
      value: displayValue,
      description: customDescription,
      validUntil,
      location: location,
      originalPrice: originalPrice,
      finalPrice: finalPrice,
      savings: savings
    };

    setGeneratedOffer(offer);
  };

  const saveOffer = () => {
    if (generatedOffer) {
      onSave(generatedOffer);
      resetForm();
      onClose();
    }
  };

  const resetForm = () => {
    setLocation('Mumbai');
    setMembershipType('');
    setOfferType('');
    setCustomOfferDetails('');
    setCustomValue('');
    setCustomDescription('');
    setValidUntil('');
    setGeneratedOffer(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            Offer Generator
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Configure Your Offer</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <select
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setGeneratedOffer(null); // Reset offer when location changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
                  >
                    <option value="Mumbai">Mumbai (Supreme HQ)</option>
                    <option value="Bengaluru">Bengaluru (Kenkere House)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Membership Type</label>
                  <select
                    value={membershipType}
                    onChange={(e) => {
                      setMembershipType(e.target.value);
                      setGeneratedOffer(null); // Reset offer when membership changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
                  >
                    <option value="">Select membership type...</option>
                    {membershipTypes.map((type) => {
                      const price = location === 'Mumbai' ? membershipPricing[type].mumbai : membershipPricing[type].bengaluru;
                      return (
                        <option key={type} value={type}>
                          {type} - ₹{price.toLocaleString('en-IN')}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type</label>
                  <select
                    value={offerType}
                    onChange={(e) => setOfferType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
                  >
                    <option value="">Select offer type...</option>
                    {offerTypes.map((type) => (
                      <option key={type.type} value={type.type}>{type.type}</option>
                    ))}
                  </select>
                </div>

                {offerType && (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Examples for {offerType}:</p>
                    <div className="flex flex-wrap gap-2">
                      {offerTypes.find(t => t.type === offerType)?.examples.map((example, index) => (
                        <button
                          key={index}
                          onClick={() => setCustomOfferDetails(example)}
                          className="px-2 py-1 bg-gray-100 hover:bg-purple-100 text-xs rounded border border-gray-300 hover:border-purple-300 transition-colors"
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Offer Details</label>
                  <input
                    type="text"
                    value={customOfferDetails}
                    onChange={(e) => setCustomOfferDetails(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
                    placeholder="e.g., 50% off first month"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
                    <input
                      type="text"
                      value={customValue}
                      onChange={(e) => setCustomValue(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
                      placeholder="₹15,000 or 25% off"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid Until</label>
                    <input
                      type="text"
                      value={validUntil}
                      onChange={(e) => setValidUntil(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none"
                      placeholder="February 28, 2026"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none resize-none"
                    rows={3}
                    placeholder="Brief description of the offer..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={createCustomOffer}
                    disabled={!membershipType || !offerType}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold ${
                      membershipType && offerType
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    Create Offer
                  </button>
                  <button
                    onClick={generateRandomOffer}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-colors font-semibold"
                  >
                    <Shuffle className="w-4 h-4" />
                    Random Offer
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            {generatedOffer && (
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-6 rounded-2xl text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Wand2 className="w-5 h-5" />
                  Generated Offer - {generatedOffer.location}
                </h3>
                
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100 text-sm font-medium">Membership</span>
                    <span className="font-semibold">{generatedOffer.membershipType}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-purple-100 text-sm font-medium">Offer Type</span>
                    <span className="font-semibold">{generatedOffer.offerType}</span>
                  </div>
                  
                  <div className="border-t border-white border-opacity-20 pt-3">
                    <div className="text-2xl font-bold mb-2">{generatedOffer.offerDetails}</div>
                    <div className="text-lg font-semibold text-purple-100 mb-2">{generatedOffer.value}</div>
                    {generatedOffer.savings > 0 && (
                      <div className="text-sm text-purple-100">
                        <span className="line-through">₹{generatedOffer.originalPrice.toLocaleString('en-IN')}</span>
                        {' → '}
                        <span className="font-bold">₹{generatedOffer.finalPrice.toLocaleString('en-IN')}</span>
                        <br />
                        <span className="text-yellow-300">Save ₹{generatedOffer.savings.toLocaleString('en-IN')}!</span>
                      </div>
                    )}
                  </div>
                  
                  {generatedOffer.description && (
                    <div className="border-t border-white border-opacity-20 pt-3">
                      <p className="text-sm text-purple-100">{generatedOffer.description}</p>
                    </div>
                  )}
                  
                  {generatedOffer.validUntil && (
                    <div className="border-t border-white border-opacity-20 pt-3">
                      <p className="text-xs text-purple-100">Valid until: {generatedOffer.validUntil}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={saveOffer}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold"
                  >
                    <Save className="w-4 h-4" />
                    Save Offer
                  </button>
                  <button
                    onClick={generateRandomOffer}
                    className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors"
                  >
                    <Shuffle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            
            {!generatedOffer && (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Offer Generated</h3>
                <p className="text-gray-500">Create a custom offer or generate a random one to see the preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferGeneratorModal;