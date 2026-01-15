import React, { useState } from 'react';
import { MonthData } from '../types';
import { OfferCard } from './OfferCard';
import { OfferForm } from './OfferForm';
import { ExecutionPlan } from './ExecutionPlan';
import { NotesSection } from './NotesSection';
import { useSalesData } from '../context/SalesContext';
import { useAdmin } from '../context/AdminContext';
import { motion } from 'framer-motion';
import { CalendarDays, Plus, Target } from 'lucide-react';

interface MonthDetailProps {
  data: MonthData;
  hideCancelled?: boolean;
}

export const MonthDetail: React.FC<MonthDetailProps> = ({ data, hideCancelled = false }) => {
  const { addOffer, addNote, deleteNote } = useSalesData();
  const { isAdmin } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  
  // Filter offers based on hideCancelled
  const displayOffers = hideCancelled 
    ? data.offers.filter(offer => !offer.cancelled)
    : data.offers;

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

  const handleAddOffer = (newOffer: any) => {
    addOffer(data.id, newOffer);
  };

  return (
    <motion.div 
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12"
      variants={container}
      initial="hidden"
      animate="show"
      key={data.id}
    >
      {/* Header Section */}
      <motion.div variants={item} className="space-y-4">
        <div className="flex items-center gap-3 text-brand-600">
          <CalendarDays className="w-6 h-6" />
          <span className="text-sm font-bold uppercase tracking-widest">2026 Sales Masterplan</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900">
          {data.name}: <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-purple-600">{data.theme}</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl leading-relaxed">
          {data.summary}
        </p>
      </motion.div>

      {/* Strategic Offers Grid */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Strategic Offers</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
              {displayOffers.length} {hideCancelled ? 'Active' : 'Total'}
            </span>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors shadow-sm text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Offer
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayOffers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} monthId={data.id} />
          ))}
          
          {/* Add Button Card Placeholder - Admin Only */}
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className="group flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl hover:border-brand-300 hover:bg-brand-50/30 transition-all duration-300 gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-white flex items-center justify-center border border-gray-100 group-hover:border-brand-200 transition-colors">
                <Plus className="w-6 h-6 text-gray-400 group-hover:text-brand-500" />
              </div>
              <span className="text-gray-500 font-medium group-hover:text-brand-600">Create New Offer</span>
            </button>
          )}
        </div>
      </motion.section>

      {/* Sales Execution Plan */}
      <motion.section variants={item}>
        <ExecutionPlan month={data} />
      </motion.section>

      {/* Notes Section */}
      <motion.section variants={item}>
        <NotesSection
          monthId={data.id}
          notes={data.notes || []}
          onAddNote={addNote}
          onDeleteNote={deleteNote}
        />
      </motion.section>

      <OfferForm 
        isOpen={isAdding} 
        onClose={() => setIsAdding(false)} 
        onSave={handleAddOffer}
        title={`Add Offer to ${data.name}`}
      />
    </motion.div>
  );
};
