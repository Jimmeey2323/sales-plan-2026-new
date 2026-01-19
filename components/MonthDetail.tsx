import React, { useState, useEffect } from 'react';
import { MonthData } from '../types';
import { OfferCard } from './OfferCard';
import { OfferForm } from './OfferForm';
import { ExecutionPlan } from './ExecutionPlan';
import { NotesSection } from './NotesSection';
import { useSalesData } from '../context/SalesContext';
import { useAdmin } from '../context/AdminContext';
import { motion } from 'framer-motion';
import { CalendarDays, Plus, Target, Sparkles, TrendingUp, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MonthDetailProps {
  data: MonthData;
  hideCancelled?: boolean;
}

// April Hero Section Component
const AprilHeroSection: React.FC<{ data: MonthData }> = ({ data }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-200/50 shadow-xl mb-8"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-amber-300/20 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-rose-300/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-radial from-orange-200/10 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 flex-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white shadow-lg shadow-amber-500/25">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-bold uppercase tracking-wider">Anniversary Month</span>
              </div>
              <div className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-amber-700 text-sm font-semibold border border-amber-200">
                🎉 Special Edition
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold"
            >
              <span className="text-gray-900">{data.name}</span>
              <br />
              <span className="bg-gradient-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                {data.theme}
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 max-w-2xl leading-relaxed"
            >
              {data.summary}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur-xl opacity-40 animate-pulse" />
              <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 text-white shadow-2xl">
                <Trophy className="w-12 h-12 mb-3 mx-auto" />
                <div className="text-center">
                  <p className="text-sm font-medium opacity-90">Celebrating</p>
                  <p className="text-3xl font-bold">Year 8</p>
                  <p className="text-sm font-medium opacity-90">in India</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-amber-700">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold">Biggest Offers of the Year</span>
            </div>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-6 border-t border-amber-200/50"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Offers', value: data.offers.filter(o => !o.cancelled).length.toString(), icon: '🎁' },
              { label: 'Revenue Target', value: data.revenueTargetTotal || 'TBD', icon: '💰' },
              { label: 'Special Events', value: '3+', icon: '🎊' },
              { label: 'Max Discount', value: '40%', icon: '⚡' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-amber-100">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export const MonthDetail: React.FC<MonthDetailProps> = ({ data, hideCancelled = false }) => {
  const { addOffer, addNote, deleteNote } = useSalesData();
  const { isAdmin } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [hasShownConfetti, setHasShownConfetti] = useState<string | null>(null);
  
  // Filter offers based on hideCancelled
  const displayOffers = hideCancelled 
    ? data.offers.filter(offer => !offer.cancelled)
    : data.offers;

  const isApril = data.id === 'apr' || data.name.toLowerCase() === 'april';

  // Fire confetti when navigating to April
  useEffect(() => {
    if (isApril && hasShownConfetti !== data.id) {
      setHasShownConfetti(data.id);
      
      // Left cannon
      const fireLeft = () => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.6 },
          colors: ['#f59e0b', '#ea580c', '#dc2626', '#f97316', '#fbbf24'],
        });
      };

      // Right cannon
      const fireRight = () => {
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.6 },
          colors: ['#f59e0b', '#ea580c', '#dc2626', '#f97316', '#fbbf24'],
        });
      };

      // Fire sequence
      fireLeft();
      fireRight();
      
      setTimeout(() => {
        fireLeft();
        fireRight();
      }, 250);
      
      setTimeout(() => {
        fireLeft();
        fireRight();
      }, 500);
    }
  }, [isApril, data.id, hasShownConfetti]);

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
      {/* April Special Hero Section */}
      {isApril ? (
        <AprilHeroSection data={data} />
      ) : (
        /* Standard Header Section */
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
      )}

      {/* Strategic Offers Grid */}
      <motion.section variants={item}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif font-bold text-gray-900">Strategic Offers</h2>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isApril 
                ? 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 border border-amber-200' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {displayOffers.length} {hideCancelled ? 'Active' : 'Total'}
            </span>
          </div>
          {isAdmin && (
            <button 
              onClick={() => setIsAdding(true)}
              className={`flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors shadow-sm text-sm font-medium ${
                isApril 
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600' 
                  : 'bg-brand-600 hover:bg-brand-700'
              }`}
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
              className={`group flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed rounded-xl transition-all duration-300 gap-4 ${
                isApril 
                  ? 'border-amber-200 hover:border-amber-400 hover:bg-amber-50/30' 
                  : 'border-gray-200 hover:border-brand-300 hover:bg-brand-50/30'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
                isApril 
                  ? 'bg-amber-50 group-hover:bg-white border-amber-100 group-hover:border-amber-300' 
                  : 'bg-gray-50 group-hover:bg-white border-gray-100 group-hover:border-brand-200'
              }`}>
                <Plus className={`w-6 h-6 ${isApril ? 'text-amber-400 group-hover:text-amber-600' : 'text-gray-400 group-hover:text-brand-500'}`} />
              </div>
              <span className={`font-medium ${isApril ? 'text-amber-600 group-hover:text-amber-700' : 'text-gray-500 group-hover:text-brand-600'}`}>Create New Offer</span>
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
          monthName={data.name}
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
