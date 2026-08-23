import React, { useState } from 'react';
import { motion } from 'motion/react';
import { DayPlan, Meal, ActiveTab } from '../types';

interface WeeklyPlannerViewProps {
  weekPlan: DayPlan[];
  setWeekPlan: React.Dispatch<React.SetStateAction<DayPlan[]>>;
  availableMeals: Meal[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectMeal: (meal: Meal) => void;
}

export const WeeklyPlannerView: React.FC<WeeklyPlannerViewProps> = ({
  weekPlan,
  setWeekPlan,
  availableMeals,
  setActiveTab,
  onSelectMeal
}) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [activeSlotModal, setActiveSlotModal] = useState<{
    dayIndex: number;
    slotKey: 'breakfast' | 'lunch' | 'snack' | 'dinner';
  } | null>(null);

  const getDaySlots = (day: DayPlan) => {
    const list = [day.slots.breakfast, day.slots.lunch, day.slots.snack, day.slots.dinner];
    return list.filter((s): s is NonNullable<typeof s> => s !== undefined);
  };

  // Compute overall weekly averages
  const totalDaysWithMeals = weekPlan.filter((d) => getDaySlots(d).length > 0).length || 1;

  const sumKcal = weekPlan.reduce((acc, day) => {
    const dayKcal = getDaySlots(day).reduce((s, slot) => s + slot.kcal, 0);
    return acc + dayKcal;
  }, 0);

  const sumProtein = weekPlan.reduce((acc, day) => {
    const dayPro = getDaySlots(day).reduce((s, slot) => s + slot.protein, 0);
    return acc + dayPro;
  }, 0);

  const sumCarbs = weekPlan.reduce((acc, day) => {
    const dayCarbs = getDaySlots(day).reduce((s, slot) => s + slot.carbs, 0);
    return acc + dayCarbs;
  }, 0);

  const sumFat = weekPlan.reduce((acc, day) => {
    const dayFat = getDaySlots(day).reduce((s, slot) => s + slot.fat, 0);
    return acc + dayFat;
  }, 0);

  const avgKcal = Math.round(sumKcal / totalDaysWithMeals);
  const avgProtein = Math.round(sumProtein / totalDaysWithMeals);
  const avgCarbs = Math.round(sumCarbs / totalDaysWithMeals);
  const avgFat = Math.round(sumFat / totalDaysWithMeals);

  const handleAssignMeal = (meal: Meal) => {
    if (!activeSlotModal) return;
    const { dayIndex, slotKey } = activeSlotModal;

    setWeekPlan((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        slots: {
          ...copy[dayIndex].slots,
          [slotKey]: {
            id: `wp-${Date.now()}`,
            title: meal.title,
            type: meal.type as any,
            kcal: meal.kcal,
            protein: meal.protein,
            carbs: meal.carbs,
            fat: meal.fat
          }
        }
      };
      return copy;
    });

    setActiveSlotModal(null);
  };

  const handleRemoveSlot = (
    dayIndex: number,
    slotKey: 'breakfast' | 'lunch' | 'snack' | 'dinner'
  ) => {
    setWeekPlan((prev) => {
      const copy = [...prev];
      const newSlots = { ...copy[dayIndex].slots };
      delete newSlots[slotKey];
      copy[dayIndex] = {
        ...copy[dayIndex],
        slots: newSlots
      };
      return copy;
    });
  };

  const handleAutofillDay = (dayIndex: number) => {
    const randomMeal = (type: string) =>
      availableMeals.find((m) => m.type.toLowerCase() === type.toLowerCase()) ||
      availableMeals[0];

    const b = randomMeal('breakfast');
    const l = randomMeal('lunch');
    const s = randomMeal('snack');
    const d = randomMeal('dinner');

    setWeekPlan((prev) => {
      const copy = [...prev];
      copy[dayIndex] = {
        ...copy[dayIndex],
        slots: {
          breakfast: { id: `af-b-${Date.now()}`, title: b.title, type: 'Breakfast', kcal: b.kcal, protein: b.protein, carbs: b.carbs, fat: b.fat },
          lunch: { id: `af-l-${Date.now()}`, title: l.title, type: 'Lunch', kcal: l.kcal, protein: l.protein, carbs: l.carbs, fat: l.fat },
          snack: { id: `af-s-${Date.now()}`, title: s.title, type: 'Snack', kcal: s.kcal, protein: s.protein, carbs: s.carbs, fat: s.fat },
          dinner: { id: `af-d-${Date.now()}`, title: d.title, type: 'Dinner', kcal: d.kcal, protein: d.protein, carbs: d.carbs, fat: d.fat }
        }
      };
      return copy;
    });
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8 flex flex-col min-h-screen animate-fade-in">
      {/* Header Section */}
      <header className="mb-10">
        <span className="font-label-caps text-xs text-[#bacbbc] uppercase tracking-widest block mb-2">
          Weekly Schedule
        </span>
        <h2 className="font-display-lg text-3xl md:text-5xl text-[#e5e2e1] mb-2 font-light">
          WEEKLY PLANNER
        </h2>
        <p className="text-[#c4c7c7] font-body-lg text-base md:text-lg font-light">
          Plan your meals in advance. Balance daily caloric intake and macros across the week.
        </p>

        {/* Week Navigation */}
        <div className="flex items-center justify-between border-t border-b border-[#444748]/20 py-4 mt-8">
          <button
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="flex items-center space-x-2 text-[#c4c7c7] hover:text-[#e5e2e1] transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span className="font-label-caps text-xs uppercase tracking-widest">Prev Week</span>
          </button>

          <div className="flex items-center space-x-6">
            <span className="font-body-md text-sm md:text-base text-[#e5e2e1] tracking-wide font-medium">
              {weekOffset === 0
                ? 'August 24 – 30, 2026'
                : weekOffset > 0
                ? `Week +${weekOffset} (Future Cycle)`
                : `Week ${weekOffset} (Past Cycle)`}
            </span>
            <button
              onClick={() => setWeekOffset(0)}
              className="text-[#bacbbc] text-xs hover:opacity-70 transition-opacity italic-data border-b border-[#bacbbc]/40 pb-0.5"
            >
              Today
            </button>
          </div>

          <button
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="flex items-center space-x-2 text-[#c4c7c7] hover:text-[#e5e2e1] transition-colors"
          >
            <span className="font-label-caps text-xs uppercase tracking-widest">Next Week</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </header>

      {/* Horizontal Planning Surface */}
      <div className="overflow-x-auto no-scrollbar pb-8 -mx-4 md:mx-0 px-4 md:px-0">
        <div className="flex gap-4 min-w-max">
          {weekPlan.map((day, dayIndex) => {
            const slotsList = getDaySlots(day);
            const dayKcal = slotsList.reduce((s, slot) => s + slot.kcal, 0);
            const dayPro = slotsList.reduce((s, slot) => s + slot.protein, 0);
            const dayCarbs = slotsList.reduce((s, slot) => s + slot.carbs, 0);
            const dayFat = slotsList.reduce((s, slot) => s + slot.fat, 0);
            const isEmpty = !day.slots.breakfast && !day.slots.lunch && !day.slots.snack && !day.slots.dinner;

            return (
              <div
                key={day.dayName}
                className="w-[280px] flex-shrink-0 flex flex-col h-full bg-[#191818] border border-[#444748]/30 rounded-xl p-4 relative"
              >
                {/* Day Header */}
                <div className="mb-4 flex justify-between items-start border-b border-[#444748]/20 pb-3">
                  <div>
                    <h3 className="text-base text-[#e5e2e1] font-medium">
                      {day.dayName}
                    </h3>
                    <p className="text-[#8e9191] text-[11px] uppercase font-label-caps mt-0.5">{day.dateLabel}</p>
                  </div>
                  {isEmpty ? (
                    <button
                      onClick={() => handleAutofillDay(dayIndex)}
                      className="text-[11px] font-label-caps uppercase text-[#bacbbc] hover:underline"
                    >
                      Autofill
                    </button>
                  ) : (
                    <span className="font-data-highlight text-sm text-[#e5e2e1]">{dayKcal} kcal</span>
                  )}
                </div>

                {/* Slots: Breakfast, Lunch, Snack, Dinner */}
                <div className="space-y-3 flex-grow">
                  {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((slotKey) => {
                    const slotData = day.slots[slotKey];
                    const slotLabel = slotKey.charAt(0).toUpperCase() + slotKey.slice(1);

                    return (
                      <div key={slotKey} className="border-b border-[#444748]/15 pb-2.5 last:border-0">
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-label-caps text-[10px] text-[#8e9191] uppercase tracking-wider">
                            {slotLabel}
                          </h4>
                          {slotData && (
                            <button
                              onClick={() => handleRemoveSlot(dayIndex, slotKey)}
                              className="text-[#8e9191] hover:text-[#ffb4ab] text-[11px]"
                              title="Clear slot"
                            >
                              ✕
                            </button>
                          )}
                        </div>

                        {slotData ? (
                          <motion.div
                            layoutId={availableMeals.find((m) => m.title === slotData.title)?.id ? `meal-card-${availableMeals.find((m) => m.title === slotData.title)?.id}` : undefined}
                            onClick={() => {
                              const found = availableMeals.find((m) => m.title === slotData.title);
                              if (found) {
                                onSelectMeal(found);
                                setActiveTab('meal-detail');
                              }
                            }}
                            className="p-2.5 border border-[#444748]/30 bg-[#201f1f] hover:border-[#bacbbc]/60 transition-colors rounded cursor-pointer group"
                          >
                            <div className="flex justify-between items-start mb-0.5">
                              <motion.span layoutId={availableMeals.find((m) => m.title === slotData.title)?.id ? `meal-name-${availableMeals.find((m) => m.title === slotData.title)?.id}` : undefined} className="text-[13px] text-[#e5e2e1] group-hover:text-[#bacbbc] transition-colors line-clamp-1 font-medium">
                                {slotData.title}
                              </motion.span>
                              <span className="font-data-highlight text-[12px] text-[#e5e2e1] shrink-0 ml-2">
                                {slotData.kcal}
                              </span>
                            </div>
                            <div className="flex space-x-1.5 text-[11px] text-[#8e9191]">
                              <span>{slotData.protein}g P</span>
                              <span>·</span>
                              <span>{slotData.carbs}g C</span>
                              <span>·</span>
                              <span>{slotData.fat}g F</span>
                            </div>
                          </motion.div>
                        ) : (
                          <div
                            onClick={() => setActiveSlotModal({ dayIndex, slotKey })}
                            className="py-2.5 text-center text-[#8e9191] border border-dashed border-[#444748]/30 hover:border-[#bacbbc]/50 hover:text-[#e5e2e1] transition-colors cursor-pointer rounded flex items-center justify-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>
                            <span className="text-[11px] uppercase tracking-wider font-medium">
                              Plan {slotLabel}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Daily Totals Footer */}
                <div className="mt-4 pt-3 border-t border-[#444748]/20">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-[#8e9191] uppercase font-label-caps">Day Total</span>
                    <span className="font-data-highlight text-[#e5e2e1] text-sm">
                      {dayKcal.toLocaleString('en-US')} kcal
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-[11px] text-[#8e9191]">
                    <span>{dayPro}g P</span>
                    <span>·</span>
                    <span>{dayCarbs}g C</span>
                    <span>·</span>
                    <span>{dayFat}g F</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Overview Footer */}
      <div className="mt-8 border border-[#444748]/30 p-6 rounded-xl bg-[#191818] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h3 className="font-label-caps text-[11px] text-[#8e9191] uppercase tracking-wider mb-1">
            Weekly Average Target
          </h3>
          <p className="flex items-baseline gap-2">
            <span className="font-data-highlight text-[#e5e2e1] text-3xl">{avgKcal.toLocaleString('en-US')}</span>{' '}
            <span className="text-[13px] text-[#c4c7c7]">kcal / day</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-8">
          <div>
            <span className="block text-[10px] font-label-caps text-[#8e9191] uppercase tracking-wider mb-0.5">
              Avg Protein
            </span>
            <span className="font-data-highlight text-lg text-[#e5e2e1]">{avgProtein}g</span>
          </div>
          <div>
            <span className="block text-[10px] font-label-caps text-[#8e9191] uppercase tracking-wider mb-0.5">
              Avg Carbs
            </span>
            <span className="font-data-highlight text-lg text-[#e5e2e1]">{avgCarbs}g</span>
          </div>
          <div>
            <span className="block text-[10px] font-label-caps text-[#8e9191] uppercase tracking-wider mb-0.5">
              Avg Fats
            </span>
            <span className="font-data-highlight text-lg text-[#e5e2e1]">{avgFat}g</span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('meals')}
          className="bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] text-[12px] font-medium uppercase tracking-wider px-5 py-2.5 rounded-full transition-colors"
        >
          Create Meal
        </button>
      </div>

      {/* Slot Assignment Modal */}
      {activeSlotModal && (
        <>
          <div
            onClick={() => setActiveSlotModal(null)}
            className="fixed inset-0 bg-[#141313]/80 backdrop-blur-sm z-[90] animate-fade-in"
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[100] bg-[#1a1a1a] border border-[#444748]/40 rounded-xl p-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#444748]/30 pb-3 mb-4">
              <div>
                <h3 className="font-headline-sm text-xl text-[#e5e2e1]">
                  Assign {activeSlotModal.slotKey.toUpperCase()} Meal
                </h3>
                <p className="font-label-caps text-[10px] text-[#c4c7c7]">
                  {weekPlan[activeSlotModal.dayIndex].dayName}
                </p>
              </div>
              <button
                onClick={() => setActiveSlotModal(null)}
                className="text-[#c4c7c7] hover:text-[#e5e2e1]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="font-label-caps text-[11px] text-[#c4c7c7] uppercase tracking-wider mb-3">
              Choose from your saved meals:
            </p>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {availableMeals.map((meal) => (
                <div
                  key={meal.id}
                  onClick={() => handleAssignMeal(meal)}
                  className="p-3 border border-[#444748]/25 rounded-lg bg-[#201f1f]/60 hover:bg-[#201f1f] hover:border-[#bacbbc]/60 cursor-pointer transition-all flex justify-between items-center group"
                >
                  <div>
                    <h4 className="font-body-md text-sm text-[#e5e2e1] group-hover:text-[#bacbbc]">
                      {meal.title}
                    </h4>
                    <span className="font-label-caps text-[10px] text-[#c4c7c7]">
                      {meal.type} • {meal.protein}P • {meal.carbs}C • {meal.fat}F
                    </span>
                  </div>
                  <span className="italic-data text-sm text-[#bacbbc]">{meal.kcal} kcal</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
