import React, { useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { DayLog, UserProfile, LoggedFoodItem, FoodItem, ActiveTab } from '../types';

interface TrackerViewProps {
  dayLog: DayLog;
  setDayLog: React.Dispatch<React.SetStateAction<DayLog>>;
  userProfile: UserProfile;
  availableFoods: FoodItem[];
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickLog: (targetMeal?: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
}

const NumberTicker = ({ value }: { value: number }) => {
  const springValue = useSpring(0, { stiffness: 60, damping: 20 });
  
  React.useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const display = useTransform(springValue, (current) => Math.round(current).toLocaleString('en-US'));
  
  return <motion.span>{display}</motion.span>;
};

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

export const TrackerView: React.FC<TrackerViewProps> = ({
  dayLog,
  setDayLog,
  userProfile,
  setActiveTab,
  onOpenQuickLog
}) => {
  const [activeDateOffset, setActiveDateOffset] = useState(0);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    breakfast: true,
    lunch: true,
    snack: false,
    dinner: false
  });

  const toggleAccordion = (mealKey: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [mealKey]: !prev[mealKey]
    }));
  };

  // Compute live consumption totals
  const allItems: LoggedFoodItem[] = [
    ...dayLog.meals.breakfast,
    ...dayLog.meals.lunch,
    ...dayLog.meals.snack,
    ...dayLog.meals.dinner
  ];

  const totalKcal = allItems.reduce((sum, item) => sum + item.kcal, 0);
  const totalProtein = Math.round(allItems.reduce((sum, item) => sum + item.protein, 0));
  const totalCarbs = Math.round(allItems.reduce((sum, item) => sum + item.carbs, 0));
  const totalFat = Math.round(allItems.reduce((sum, item) => sum + item.fat, 0));

  const handleDeleteItem = (
    mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner',
    itemId: string
  ) => {
    setDayLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealType]: prev.meals[mealType].filter((i) => i.id !== itemId)
      }
    }));
  };

  const calsPercent = Math.min(100, (totalKcal / userProfile.targetKcal) * 100);
  const proPercent = Math.min(100, (totalProtein / userProfile.targetProtein) * 100);
  const carbsPercent = Math.min(100, (totalCarbs / userProfile.targetCarbs) * 100);
  const fatPercent = Math.min(100, (totalFat / userProfile.targetFat) * 100);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-12 animate-fade-in relative pb-28">
      {/* Header & Date Navigation */}
      <div className="border-b border-[#444748]/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="font-label-caps text-xs text-[#bacbbc] uppercase tracking-widest block mb-2">
            Daily Intake
          </span>
          <h1 className="font-display-lg text-3xl md:text-5xl text-[#e5e2e1] mb-2 font-light">
            DAILY NUTRITION
          </h1>
          <p className="font-body-lg text-[#c4c7c7] max-w-2xl font-light">
            Review logged food and real-time macronutrient attainment for today.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-4 bg-[#1a1a1a] border border-[#444748]/30 rounded-xl px-4 py-2">
          <button
            onClick={() => setActiveDateOffset((p) => p - 1)}
            className="text-[#c4c7c7] hover:text-[#e5e2e1] p-1"
            title="Previous Day"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="font-headline-sm text-base text-[#e5e2e1] min-w-[150px] text-center font-normal">
            {activeDateOffset === 0
              ? 'August 24, 2026'
              : activeDateOffset === -1
              ? 'August 23, 2026 (Yesterday)'
              : activeDateOffset === 1
              ? 'August 25, 2026 (Tomorrow)'
              : `Day ${activeDateOffset > 0 ? '+' : ''}${activeDateOffset}`}
          </span>
          <button
            onClick={() => setActiveDateOffset((p) => p + 1)}
            className="text-[#c4c7c7] hover:text-[#e5e2e1] p-1"
            title="Next Day"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
          {activeDateOffset !== 0 && (
            <button
              onClick={() => setActiveDateOffset(0)}
              className="font-label-caps text-[10px] text-[#bacbbc] hover:underline uppercase pl-2 border-l border-[#444748]/40"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Daily Nutrition Overview */}
      <motion.section 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
      >
        {/* Calories */}
        <motion.div variants={sectionVariants} className="border border-[#444748]/30 bg-[#191818] p-5 rounded-xl flex flex-col justify-between h-36">
          <div>
            <div className="font-label-caps text-[11px] tracking-wider text-[#c4c7c7] uppercase mb-1">
              Energy
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-data-highlight text-3xl text-[#e5e2e1]"><NumberTicker value={totalKcal} /></span>
              <span className="text-[13px] text-[#c4c7c7]">
                / {userProfile.targetKcal} kcal
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[12px] text-[#8e9191] mb-1.5">
              <span>{Math.round(calsPercent)}% target</span>
              <span>{Math.max(0, userProfile.targetKcal - totalKcal)} left</span>
            </div>
            <div className="w-full bg-[#201f1f] h-1 rounded-sm overflow-hidden relative">
              <motion.div
                className="bg-[#9E8E77] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${calsPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Protein */}
        <motion.div variants={sectionVariants} className="border border-[#444748]/30 bg-[#191818] p-5 rounded-xl flex flex-col justify-between h-36">
          <div>
            <div className="font-label-caps text-[11px] tracking-wider text-[#c4c7c7] uppercase mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#bacbbc]" /> Protein
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-data-highlight text-3xl text-[#e5e2e1]"><NumberTicker value={totalProtein} />g</span>
              <span className="text-[13px] text-[#c4c7c7]">
                / {userProfile.targetProtein}g
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[12px] text-[#8e9191] mb-1.5">
              <span>{Math.round(proPercent)}% target</span>
              <span>{Math.max(0, userProfile.targetProtein - totalProtein)}g left</span>
            </div>
            <div className="w-full bg-[#201f1f] h-1 rounded-sm overflow-hidden relative">
              <motion.div
                className="bg-[#bacbbc] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${proPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Carbs */}
        <motion.div variants={sectionVariants} className="border border-[#444748]/30 bg-[#191818] p-5 rounded-xl flex flex-col justify-between h-36">
          <div>
            <div className="font-label-caps text-[11px] tracking-wider text-[#c4c7c7] uppercase mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#9E8E77]" /> Carbs
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-data-highlight text-3xl text-[#e5e2e1]"><NumberTicker value={totalCarbs} />g</span>
              <span className="text-[13px] text-[#c4c7c7]">
                / {userProfile.targetCarbs}g
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[12px] text-[#8e9191] mb-1.5">
              <span>{Math.round(carbsPercent)}% target</span>
              <span>{Math.max(0, userProfile.targetCarbs - totalCarbs)}g left</span>
            </div>
            <div className="w-full bg-[#201f1f] h-1 rounded-sm overflow-hidden relative">
              <motion.div
                className="bg-[#9E8E77] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${carbsPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        {/* Fat */}
        <motion.div variants={sectionVariants} className="border border-[#444748]/30 bg-[#191818] p-5 rounded-xl flex flex-col justify-between h-36">
          <div>
            <div className="font-label-caps text-[11px] tracking-wider text-[#c4c7c7] uppercase mb-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8e9192]" /> Fat
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-data-highlight text-3xl text-[#e5e2e1]"><NumberTicker value={totalFat} />g</span>
              <span className="text-[13px] text-[#c4c7c7]">
                / {userProfile.targetFat}g
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[12px] text-[#8e9191] mb-1.5">
              <span>{Math.round(fatPercent)}% target</span>
              <span>{Math.max(0, userProfile.targetFat - totalFat)}g left</span>
            </div>
            <div className="w-full bg-[#201f1f] h-1 rounded-sm overflow-hidden relative">
              <motion.div
                className="bg-[#8e9192] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${fatPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Logged Meal Accordions */}
      <section className="flex flex-col gap-4">
        {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((mealType) => {
          const items = dayLog.meals[mealType] || [];
          const isExpanded = !!expandedSections[mealType];
          const mealKcal = items.reduce((sum, it) => sum + it.kcal, 0);
          const mealLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1);

          return (
            <div
              key={mealType}
              className="border border-[#444748]/20 bg-[#1a1a1a]/60 rounded-xl overflow-hidden transition-all duration-300"
            >
              {/* Accordion Trigger Header */}
              <button
                type="button"
                onClick={() => toggleAccordion(mealType)}
                className="w-full flex justify-between items-center px-6 py-5 hover:bg-[#201f1f]/50 transition-colors text-left"
              >
                <div className="flex items-center space-x-4">
                  <span className="font-headline-sm text-xl text-[#e5e2e1] group-hover:text-[#bacbbc]">
                    {mealLabel}
                  </span>
                  <span className="font-data-highlight text-sm text-[#bacbbc]">
                    {mealKcal} kcal
                  </span>
                  <span className="font-label-caps text-[10px] text-[#c4c7c7]">
                    ({items.length} items)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[#c4c7c7] transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </div>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-[#444748]/15 animate-fade-in space-y-3">
                  {items.length === 0 ? (
                    <div className="py-6 text-center text-[#c4c7c7] italic text-sm">
                      Nothing logged in {mealLabel.toLowerCase()} yet.
                    </div>
                  ) : (
                    items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center py-2.5 px-3 rounded-lg hover:bg-[#201f1f]/60 transition-colors group"
                      >
                        <div className="flex flex-col">
                          <span className="font-body-md text-sm text-[#e5e2e1] font-medium">
                            {item.name}
                          </span>
                          <span className="font-label-caps text-[10px] text-[#c4c7c7]">
                            {item.amountText} • {item.protein}g P | {item.carbs}g C | {item.fat}g F
                          </span>
                        </div>

                        <div className="flex items-center space-x-4">
                          <span className="font-data-highlight text-base text-[#e5e2e1]">
                            {item.kcal} kcal
                          </span>
                          <button
                            onClick={() => handleDeleteItem(mealType, item.id)}
                            className="opacity-0 group-hover:opacity-100 text-[#c4c7c7] hover:text-[#ffb4ab] p-1 transition-all"
                            title="Remove entry"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  {/* Quick Add row */}
                  <div className="pt-3 border-t border-[#444748]/20 flex justify-between items-center">
                    <button
                      onClick={() => onOpenQuickLog(mealType)}
                      className="text-[#bacbbc] font-label-caps text-xs tracking-widest hover:text-[#e5e2e1] transition-colors flex items-center space-x-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      <span>Quick Add to {mealLabel}</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('library')}
                      className="text-[#c4c7c7] font-label-caps text-[11px] tracking-wider hover:text-[#e5e2e1] transition-colors"
                    >
                      Browse Food Library →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 md:bottom-8 right-6 md:right-10 z-40">
        <button
          onClick={() => onOpenQuickLog()}
          className="bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] font-label-caps text-xs tracking-widest py-4 px-7 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex items-center space-x-2 border border-white/10"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>LOG FOOD</span>
        </button>
      </div>
    </div>
  );
};
