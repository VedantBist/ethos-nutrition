import React, { useRef } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';
import { Meal, UserProfile, DayLog, ActiveTab, LoggedFoodItem } from '../types';

interface OverviewViewProps {
  meals: Meal[];
  userProfile: UserProfile;
  todayLog: DayLog;
  setActiveTab: (tab: ActiveTab) => void;
  onSelectMeal: (meal: Meal) => void;
  onOpenQuickLog: () => void;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' }
  }
};

const NumberTicker = ({ value }: { value: number }) => {
  const springValue = useSpring(0, { stiffness: 60, damping: 20 });
  
  React.useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const display = useTransform(springValue, (current) => Math.round(current).toLocaleString('en-US'));
  
  return <motion.span>{display}</motion.span>;
};

export const OverviewView: React.FC<OverviewViewProps> = ({
  meals,
  userProfile,
  todayLog,
  setActiveTab,
  onSelectMeal,
  onOpenQuickLog
}) => {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const trackImgRef = useRef<HTMLImageElement | null>(null);

  // Calculate consumed totals from todayLog
  const allLoggedItems: LoggedFoodItem[] = [
    ...todayLog.meals.breakfast,
    ...todayLog.meals.lunch,
    ...todayLog.meals.snack,
    ...todayLog.meals.dinner
  ];

  const consumedKcal = allLoggedItems.reduce((sum, item) => sum + item.kcal, 0);
  const consumedProtein = allLoggedItems.reduce((sum, item) => sum + item.protein, 0);
  const consumedCarbs = allLoggedItems.reduce((sum, item) => sum + item.carbs, 0);
  const consumedFat = allLoggedItems.reduce((sum, item) => sum + item.fat, 0);

  // Parallax mouse track
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current || !trackImgRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const moveX = x * 15;
    const moveY = y * 15;
    trackImgRef.current.style.transform = `scale(1.03) translate(${moveX}px, ${moveY}px)`;
  };

  const handleMouseLeave = () => {
    if (!trackImgRef.current) return;
    trackImgRef.current.style.transform = `scale(1) translate(0, 0)`;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
      }}
      className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-16"
    >
      {/* Top Banner and Quick Context */}
      <motion.div variants={sectionVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#444748]/20 pb-4">
        <div>
          <span className="font-label-caps text-[#bacbbc] uppercase tracking-widest text-xs">
            August 24, 2026
          </span>
          <p className="font-body-md text-sm text-[#c4c7c7] mt-0.5">
            Welcome back, {userProfile.name}. Your daily nutrition targets are on track.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('meals')}
            className="font-label-caps text-[11px] uppercase tracking-widest text-[#e5e2e1] border border-[#444748]/40 px-5 py-2.5 rounded-full hover:border-[#bacbbc] hover:text-[#bacbbc] transition-all duration-300"
          >
            Meal Builder
          </button>
          <button
            onClick={onOpenQuickLog}
            className="font-label-caps text-[11px] uppercase tracking-widest text-[#141313] bg-[#9E8E77] hover:bg-[#b0a08b] px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm font-semibold active:scale-95"
          >
            + Log Food
          </button>
        </div>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        variants={sectionVariants}
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative flex flex-col md:flex-row gap-8 items-end border-b border-[#444748]/20 pb-16 overflow-hidden"
      >
        <div className="w-full md:w-2/3 h-[380px] md:h-[480px] relative overflow-hidden rounded-xl border border-white/5 bg-[#1a1a1a]">
          <img
            ref={trackImgRef}
            alt="Mindful Nutrition Rhythm"
            className="w-full h-full object-cover grayscale opacity-80 transition-transform duration-200 will-change-transform"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4VGh1FS9vWtiBiTXqhZRvkslHdmek3QWNs2lx6wqWxeCAm18piHqPT8d2-BT6SFEPl5BlU_HGHqMDK-VpLKtBqWv3BZAq56d-RnPAgggtmQCRn4tu_Jce3pCc6DnOcZ-dZRcXlSkSAAWaPXyE9cEPgTlYy_fTbtYilYEupJkMppaeFvreZuK9O4CsMtE6zWk0AfIdiKyPBm5qgEAE-9sCNXJx5QZvFUDMV6AmrSr_3h0eQQnVrTol"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141313] via-[#141313]/30 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141313] via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bacbbc] animate-pulse" />
            <span className="font-label-caps text-xs text-[#e5e2e1] uppercase tracking-wider">
              Daily Nutrition Tracking Active
            </span>
          </div>
        </div>

        <div className="w-full md:w-1/3 flex flex-col gap-6 md:-ml-28 relative z-10 pb-4">
          <p className="font-label-caps text-xs text-[#bacbbc] tracking-widest uppercase">
            Your Daily Rhythm
          </p>
          <h2 className="font-display-lg text-3xl md:text-4xl text-[#e5e2e1] leading-tight font-light">
            Nourish with <br />
            <span className="italic text-[#bacbbc]">mindful clarity.</span>
          </h2>
          <p className="font-body-md text-[#c4c7c7] font-light leading-relaxed">
            Plan your meals, track what you eat, and understand your macro composition throughout the day.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <button
              onClick={() => setActiveTab('planner')}
              className="text-xs font-label-caps text-[#e5e2e1] hover:text-[#bacbbc] uppercase tracking-widest border-b border-[#444748]/50 hover:border-[#bacbbc] pb-1 transition-colors flex items-center gap-1.5"
            >
              <span>Weekly Planner</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className="text-xs font-label-caps text-[#c4c7c7] hover:text-[#e5e2e1] uppercase tracking-widest pb-1 transition-colors"
            >
              Nutrition History
            </button>
          </div>
        </div>
      </motion.section>

      {/* Central Measurement System - Daily Nutrition Summary */}
      <motion.section
        variants={sectionVariants}
        className="border-t border-b border-[#444748]/20 py-10 flex flex-col gap-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="font-label-caps text-[10px] text-[#bacbbc] uppercase tracking-wider block mb-1">
              Today's Intake
            </span>
            <h3 className="font-headline-sm text-2xl text-[#e5e2e1]">
              DAILY NUTRITION
            </h3>
          </div>
          <span className="text-[13px] text-[#c4c7c7]">
            Target: <span className="text-[#e5e2e1] font-medium">{userProfile.targetKcal} kcal</span> daily
          </span>
        </div>

        {/* Editorial Horizontal Structure with Dividers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-[#444748]/20 pt-2">
          {/* Calories */}
          <div className="flex flex-col gap-1 md:pr-8">
            <span className="text-[12px] text-[#c4c7c7] uppercase font-medium">
              Energy
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-data-highlight text-3xl md:text-4xl text-[#e5e2e1]">
                <NumberTicker value={consumedKcal} />
              </span>
              <span className="text-[13px] text-[#c4c7c7]">
                kcal
              </span>
            </div>
            <span className="text-[12px] text-[#8e9191] mt-0.5">
              of {userProfile.targetKcal} kcal target
            </span>
            <div className="w-full bg-[#201f1f] h-1 rounded-sm overflow-hidden mt-3 relative">
              <motion.div
                className="bg-[#9E8E77] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (consumedKcal / userProfile.targetKcal) * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Protein */}
          <div className="flex flex-col gap-1 md:px-8">
            <span className="text-[12px] text-[#c4c7c7] uppercase font-medium">
              Protein
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-data-highlight text-3xl md:text-4xl text-[#e5e2e1]">
                <NumberTicker value={consumedProtein} />
              </span>
              <span className="text-[13px] text-[#c4c7c7]">g</span>
            </div>
            <span className="text-[12px] text-[#8e9191] mt-0.5">
              of {userProfile.targetProtein}g target
            </span>
            <div className="w-full bg-[#201f1f] h-1 rounded-sm overflow-hidden mt-3 relative">
              <motion.div
                className="bg-[#bacbbc] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (consumedProtein / userProfile.targetProtein) * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Carbohydrates */}
          <div className="flex flex-col gap-1 md:px-8">
            <span className="text-[12px] text-[#c4c7c7] uppercase font-medium">
              Carbohydrates
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-data-highlight text-3xl md:text-4xl text-[#e5e2e1]">
                <NumberTicker value={consumedCarbs} />
              </span>
              <span className="text-[13px] text-[#c4c7c7]">g</span>
            </div>
            <span className="text-[12px] text-[#8e9191] mt-0.5">
              of {userProfile.targetCarbs}g target
            </span>
            <div className="w-full bg-[#201f1f] h-1 rounded-sm overflow-hidden mt-3 relative">
              <motion.div
                className="bg-[#9E8E77] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (consumedCarbs / userProfile.targetCarbs) * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="flex flex-col gap-1 md:pl-8">
            <span className="text-[12px] text-[#c4c7c7] uppercase font-medium">
              Fat
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="font-data-highlight text-3xl md:text-4xl text-[#e5e2e1]">
                <NumberTicker value={consumedFat} />
              </span>
              <span className="text-[13px] text-[#c4c7c7]">g</span>
            </div>
            <span className="text-[12px] text-[#8e9191] mt-0.5">
              of {userProfile.targetFat}g target
            </span>
            <div className="w-full bg-[#201f1f] h-1 rounded-sm overflow-hidden mt-3 relative">
              <motion.div
                className="bg-[#8e9192] h-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (consumedFat / userProfile.targetFat) * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Today's Meals Timeline */}
      <motion.section variants={sectionVariants} className="flex flex-col gap-6">
        <div className="flex justify-between items-end pb-2">
          <div>
            <span className="font-label-caps text-[10px] text-[#bacbbc] uppercase tracking-wider block mb-1">
              Scheduled Rhythm
            </span>
            <h3 className="font-headline-sm text-2xl text-[#e5e2e1]">
              TODAY'S MEALS
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('planner')}
            className="text-[13px] font-medium text-[#bacbbc] hover:text-[#e5e2e1] transition-colors flex items-center gap-1.5"
          >
            <span>View Full Plan</span>
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        {/* Structured Timeline with Thin Dividers */}
        <div className="flex flex-col border-t border-[#444748]/20 divide-y divide-[#444748]/15">
          {meals.map((meal) => {
            return (
              <motion.div
                layoutId={`meal-card-${meal.id}`}
                key={meal.id}
                onClick={() => {
                  onSelectMeal(meal);
                  setActiveTab('meal-detail');
                }}
                className="group flex flex-col md:flex-row md:items-center py-5 px-3 hover:bg-[#1a1919] transition-colors cursor-pointer"
              >
                {/* Time & Meal Type */}
                <div className="w-full md:w-48 flex items-center gap-3 mb-1 md:mb-0 shrink-0">
                  <span className="text-[13px] font-semibold text-[#bacbbc] tabular-nums">
                    {meal.time || '12:00'}
                  </span>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-[#c4c7c7] px-2 py-0.5 rounded bg-[#201f1f]">
                    {meal.type}
                  </span>
                </div>

                {/* Meal Name - Strongest Element */}
                <motion.div layoutId={`meal-name-${meal.id}`} className="flex-1 mb-2 md:mb-0">
                  <h4 className="font-headline-sm text-lg text-[#e5e2e1] group-hover:text-[#bacbbc] transition-colors font-medium">
                    {meal.title}
                  </h4>
                  <p className="text-[13px] text-[#8e9191] line-clamp-1 mt-0.5">
                    {meal.ingredients?.map(i => i.name).filter(Boolean).join(' · ')}
                  </p>
                </motion.div>

                {/* Calories & Macros */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0">
                  <div className="flex flex-col md:items-end">
                    <span className="font-data-highlight text-xl text-[#e5e2e1]">
                      {meal.kcal} kcal
                    </span>
                    <span className="text-[12px] text-[#c4c7c7]">
                      {meal.protein}g P · {meal.carbs}g C · {meal.fat}g F
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#444748] group-hover:text-[#bacbbc] transition-colors text-[18px]">
                    arrow_forward
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* Relevant Daily Context */}
      <motion.section variants={sectionVariants} className="border-t border-[#444748]/20 pt-8 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#1e1d1d] border border-[#444748]/30 flex items-center justify-center text-[#bacbbc]">
            <span className="material-symbols-outlined text-[20px]">water_drop</span>
          </div>
          <div>
            <h4 className="text-[14px] font-medium text-[#e5e2e1]">Hydration & Daily Notes</h4>
            <p className="text-[13px] text-[#c4c7c7]">
              Remember to maintain optimal electrolyte balance alongside your scheduled protein targets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('meals')}
            className="text-[13px] font-medium text-[#e5e2e1] hover:text-[#bacbbc] border border-[#444748]/40 hover:border-[#bacbbc] px-4 py-2 rounded-full transition-colors"
          >
            Create New Meal
          </button>
          <button
            onClick={() => setActiveTab('library')}
            className="text-[13px] font-medium text-[#141313] bg-[#9E8E77] hover:bg-[#b0a08b] px-4 py-2 rounded-full transition-colors"
          >
            Browse Foods
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
};
