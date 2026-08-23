import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { Meal, ActiveTab } from '../types';

interface MealDetailViewProps {
  meal: Meal;
  setActiveTab: (tab: ActiveTab) => void;
  onEditMeal: (meal: Meal) => void;
  onLogMeal: (meal: Meal) => void;
}

const NumberTicker = ({ value }: { value: number }) => {
  const springValue = useSpring(0, { stiffness: 60, damping: 20 });
  
  React.useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const display = useTransform(springValue, (current) => Math.round(current));
  
  return <motion.span>{display}</motion.span>;
};

export const MealDetailView: React.FC<MealDetailViewProps> = ({
  meal,
  setActiveTab,
  onEditMeal,
  onLogMeal
}) => {
  const [logged, setLogged] = useState(false);

  const handleLog = () => {
    onLogMeal(meal);
    setLogged(true);
    setTimeout(() => {
      setLogged(false);
      setActiveTab('tracker');
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { staggerChildren: 0.1 } }}
      className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col"
    >
      {/* Header & Back Action */}
      <motion.header 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-[#444748]/20 pb-6 w-full"
      >
        <button
          onClick={() => setActiveTab('overview')}
          className="flex items-center gap-2 text-[#c4c7c7] hover:text-[#e5e2e1] transition-colors duration-300 font-label-caps text-xs uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Overview</span>
        </button>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => onEditMeal(meal)}
            className="font-label-caps text-xs uppercase tracking-widest text-[#e5e2e1] border border-[#444748]/40 px-6 py-3 rounded-full hover:border-[#bacbbc] hover:text-[#bacbbc] transition-colors duration-300"
          >
            Edit Meal
          </button>
          <button
            onClick={handleLog}
            className={`font-label-caps text-xs uppercase tracking-widest px-7 py-3 rounded-full transition-all duration-300 shadow-md ${
              logged
                ? 'bg-[#bacbbc] text-[#141313]'
                : 'text-[#141313] bg-[#9E8E77] hover:bg-[#b0a08b]'
            }`}
          >
            {logged ? 'Logged to Food Tracker' : 'Log This Meal'}
          </button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.div 
        layoutId={`meal-card-${meal.id}`}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 items-center bg-transparent rounded-xl"
      >
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div>
            <span className="font-label-caps text-[11px] text-[#bacbbc] mb-2 tracking-wider uppercase block">
              {meal.type} · {meal.time || '13:00'}
            </span>
            <motion.h1 layoutId={`meal-name-${meal.id}`} className="font-display-lg text-3xl md:text-5xl text-[#e5e2e1] mb-3 font-medium">
              {meal.title}
            </motion.h1>
            <p className="text-[15px] text-[#c4c7c7] max-w-lg leading-relaxed">
              {meal.description ||
                'A restorative blend of nutrient-dense ingredients formulated for metabolic balance and sustained vitality.'}
            </p>
          </div>

          <div className="flex items-baseline gap-3 bg-[#191818] px-5 py-3.5 rounded-lg border border-[#444748]/30 w-fit">
            <span className="font-data-highlight text-3xl md:text-4xl text-[#e5e2e1]">
              <NumberTicker value={meal.kcal} />
            </span>
            <span className="text-[13px] text-[#c4c7c7] uppercase font-medium">
              Total Energy (kcal)
            </span>
          </div>
        </div>

        {/* Hero Editorial Image */}
        <div className="lg:col-span-6 w-full h-[320px] md:h-[420px] relative overflow-hidden rounded-xl border border-[#444748]/30 bg-[#1c1b1b]">
          <img
            className="w-full h-full object-cover opacity-90"
            alt={meal.title}
            src={
              meal.image ||
              'https://lh3.googleusercontent.com/aida-public/AB6AXuBgI1PsaIPbFZwgcmIbAG5xH9e2ipxP9MsiNJC08Fs5CE7krupsQH1q-uSFUe1OQgrM_cdccLb7Mo6Q8lzLzffTolbnNe_cuEDsIZCOxXMWa1_HZm7pOHOOTZd_LvGCvHsY3aIRyTP8z1wNF1_1i_31_JkFpJbKPAn19mjike-QcZdlkSvfWl4z8MHeruBaZk64PpMhaa4FX0qMKoKVRcLy-HbrC082R2T53z-i_cE4BeKYXfdYAVgd'
            }
          />
        </div>
      </motion.div>

      {/* Divider */}
      <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }} className="w-full h-px bg-[#444748]/20 mb-12 origin-left" />

      {/* Macros & Ingredients Split */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
      >
        {/* Macro Breakdown */}
        <div className="lg:col-span-4 flex flex-col gap-6 pr-0 lg:pr-8 lg:border-r border-[#444748]/20">
          <div>
            <h2 className="font-label-caps text-xs text-[#c4c7c7] uppercase tracking-wider border-b border-[#444748]/20 pb-3 mb-5">
              MACRO COMPOSITION
            </h2>
            <div className="flex flex-col divide-y divide-[#444748]/15">
              <div className="flex justify-between items-baseline py-3">
                <span className="text-[13px] text-[#e5e2e1] flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#bacbbc]" /> Protein
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-data-highlight text-[#e5e2e1]">
                    <NumberTicker value={meal.protein} />
                  </span>
                  <span className="text-[12px] text-[#c4c7c7]">g</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline py-3">
                <span className="text-[13px] text-[#e5e2e1] flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#9E8E77]" /> Carbohydrates
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-data-highlight text-[#e5e2e1]">
                    <NumberTicker value={meal.carbs} />
                  </span>
                  <span className="text-[12px] text-[#c4c7c7]">g</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline py-3">
                <span className="text-[13px] text-[#e5e2e1] flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#444748]" /> Fat
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-data-highlight text-[#e5e2e1]">
                    <NumberTicker value={meal.fat} />
                  </span>
                  <span className="text-[12px] text-[#c4c7c7]">g</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ingredients List */}
        <div className="lg:col-span-8 flex flex-col gap-4 lg:pl-4">
          <h2 className="font-label-caps text-xs text-[#c4c7c7] uppercase tracking-wider border-b border-[#444748]/20 pb-3 mb-1">
            INGREDIENTS ({meal.ingredients.length} items)
          </h2>

          <div className="flex flex-col divide-y divide-[#444748]/15">
            {meal.ingredients.map((ing, i) => {
              const ingCals = Math.round((ing.amountGrams * ing.kcalPer100g) / 100);
              const ingPro = Math.round((ing.amountGrams * ing.proteinPer100g) / 100);
              const ingCarbs = Math.round((ing.amountGrams * ing.carbsPer100g) / 100);
              const ingFat = Math.round((ing.amountGrams * ing.fatPer100g) / 100);

              return (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  key={i}
                  className="grid grid-cols-12 py-4 hover:bg-[#1a1919] transition-colors px-2 rounded items-center"
                >
                  <div className="col-span-6 flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#bacbbc]" />
                    <span className="text-[15px] text-[#e5e2e1] font-medium line-clamp-1">
                      {ing.name}
                    </span>
                    <span className="text-[12px] text-[#8e9191] ml-1 shrink-0">
                      ({ing.amountGrams}g)
                    </span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end">
                    <span className="font-data-highlight text-base text-[#e5e2e1]">
                      {ingCals}
                    </span>
                    <span className="text-[12px] text-[#c4c7c7] ml-1">kcal</span>
                  </div>

                  <div className="col-span-3 flex items-center justify-end gap-2 text-[12px] text-[#c4c7c7]">
                    <span className="hidden sm:inline">{ingPro}g P</span>
                    <span className="opacity-30 hidden sm:inline">·</span>
                    <span className="hidden sm:inline">{ingCarbs}g C</span>
                    <span className="opacity-30 hidden sm:inline">·</span>
                    <span>{ingFat}g F</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
