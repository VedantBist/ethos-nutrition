import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FoodItem, ActiveTab } from '../types';

interface FoodDetailViewProps {
  food: FoodItem;
  setActiveTab: (tab: ActiveTab) => void;
  onAddFoodToLog: (
    food: FoodItem,
    grams: number,
    mealType: 'breakfast' | 'lunch' | 'snack' | 'dinner'
  ) => void;
}

export const FoodDetailView: React.FC<FoodDetailViewProps> = ({
  food,
  setActiveTab,
  onAddFoodToLog
}) => {
  const [quantityGrams, setQuantityGrams] = useState<number>(food.servingDefaultGrams || 150);
  const [mealDestination, setMealDestination] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('lunch');
  const [isAdded, setIsAdded] = useState(false);

  const ratio = (quantityGrams || 0) / 100;
  const scaledKcal = (food.kcalPer100g * ratio).toFixed(1);
  const scaledProtein = (food.proteinPer100g * ratio).toFixed(1);
  const scaledCarbs = (food.carbsPer100g * ratio).toFixed(1);
  const scaledFat = (food.fatPer100g * ratio).toFixed(1);
  const scaledFiber = (food.fiberPer100g * ratio).toFixed(1);

  const handleAdd = () => {
    onAddFoodToLog(food, quantityGrams, mealDestination);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setActiveTab('tracker');
    }, 1200);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-10"
    >
      {/* Back Navigation */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between"
      >
        <button
          onClick={() => setActiveTab('library')}
          className="text-[#c4c7c7] hover:text-[#e5e2e1] transition-colors flex items-center space-x-2 font-label-caps text-xs uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Library</span>
        </button>
        <span className="font-label-caps text-[10px] text-[#bacbbc] uppercase tracking-widest">
          Food Specification
        </span>
      </motion.div>

      {/* Spatial 2-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column: Editorial Photo */}
        <motion.div layoutId={`food-card-${food.id}`} className="md:col-span-5 h-[340px] md:h-[480px] bg-[#1a1a1a] rounded-xl overflow-hidden relative border border-[#444748]/30">
          <img
            src={food.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWqSDIwN3Mnk66wS1XarULwej95du8UKsDstCHZlCMJx1dTEta7li-Rnz3J-dYhe8cP8ylFQNwxlZJLc_EMoUSwUM_AsyuB4lkiYzAux3Zlshd4ZMfPSW9QBnkqM8zAZn0IQebE0V7jdi4bBviGXBMDgqPnm9FAoOESSmL36iESebE5IaQd2kAvI7hBMX4knhYAagCp0Kt_Kt11SlTDFxm7o5OKT8d9bBuC_qOTSOaSe-22c04dXU9'}
            alt={food.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute bottom-4 left-4">
            <span className="font-label-caps text-[11px] text-[#bacbbc] bg-[#141313]/90 px-3 py-1 rounded-full uppercase border border-[#444748]/30">
              {food.category}
            </span>
          </div>
        </motion.div>

        {/* Right Column: Details & Live Scaler */}
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-7 flex flex-col justify-center space-y-6"
        >
          <div>
            <span className="font-label-caps text-[11px] text-[#bacbbc] tracking-wider uppercase">
              {food.subtitle}
            </span>
            <motion.h1 layoutId={`food-name-${food.id}`} className="font-display-lg text-3xl md:text-4xl text-[#e5e2e1] mt-1 mb-2 font-medium">
              {food.name}
            </motion.h1>
            <p className="text-[14px] text-[#c4c7c7] leading-relaxed">
              {food.description || 'Nutrient-dense ingredient evaluated per 100g standard baseline with precise macro tracking.'}
            </p>
          </div>

          {/* Scaled Energy & Macro Summary */}
          <div className="p-6 border border-[#444748]/30 rounded-xl bg-[#191818]">
            <div className="border-b border-[#444748]/20 pb-4 mb-4 flex justify-between items-baseline">
              <span className="text-[13px] text-[#c4c7c7] uppercase font-medium">
                Scaled Energy ({quantityGrams}g)
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="font-data-highlight text-3xl text-[#e5e2e1]">
                  {scaledKcal}
                </span>
                <span className="text-[13px] text-[#c4c7c7]">kcal</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] text-[#8e9191] uppercase">Protein</span>
                <div className="flex items-baseline space-x-0.5 mt-0.5">
                  <span className="font-data-highlight text-lg text-[#e5e2e1]">
                    {scaledProtein}
                  </span>
                  <span className="text-[11px] text-[#c4c7c7]">g</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] text-[#8e9191] uppercase">Carbs</span>
                <div className="flex items-baseline space-x-0.5 mt-0.5">
                  <span className="font-data-highlight text-lg text-[#e5e2e1]">
                    {scaledCarbs}
                  </span>
                  <span className="text-[11px] text-[#c4c7c7]">g</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] text-[#8e9191] uppercase">Fat</span>
                <div className="flex items-baseline space-x-0.5 mt-0.5">
                  <span className="font-data-highlight text-lg text-[#e5e2e1]">
                    {scaledFat}
                  </span>
                  <span className="text-[11px] text-[#c4c7c7]">g</span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="font-label-caps text-[10px] text-[#8e9191] uppercase">Fiber</span>
                <div className="flex items-baseline space-x-0.5 mt-0.5">
                  <span className="font-data-highlight text-lg text-[#e5e2e1]">
                    {scaledFiber}
                  </span>
                  <span className="text-[11px] text-[#c4c7c7]">g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Input Controls */}
          <div className="space-y-4 bg-[#191818] p-5 rounded-xl border border-[#444748]/30">
            {/* Quantity */}
            <div className="flex items-center justify-between border-b border-[#444748]/20 pb-3">
              <label htmlFor="qty" className="text-[13px] text-[#c4c7c7] font-medium">
                Quantity (grams)
              </label>
              <div className="flex items-center gap-1.5 border-b border-[#444748]/40 pb-0.5">
                <input
                  id="qty"
                  type="number"
                  min="5"
                  step="5"
                  value={quantityGrams}
                  onChange={(e) => setQuantityGrams(parseFloat(e.target.value) || 0)}
                  className="bg-transparent border-none text-right font-data-highlight text-xl text-[#e5e2e1] focus:ring-0 w-20 p-0"
                />
                <span className="text-[12px] text-[#c4c7c7]">g</span>
              </div>
            </div>

            {/* Destination Selector */}
            <div className="flex items-center justify-between border-b border-[#444748]/20 pb-3">
              <label htmlFor="dest" className="text-[13px] text-[#c4c7c7] font-medium">
                Target Meal
              </label>
              <select
                id="dest"
                value={mealDestination}
                onChange={(e) => setMealDestination(e.target.value as any)}
                className="bg-[#141313] border border-[#444748]/40 rounded px-3 py-1.5 text-right text-[13px] text-[#e5e2e1] cursor-pointer"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="snack">Snack</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>

            {/* Visual Feedback text */}
            <div className="flex justify-between items-center text-[12px] text-[#8e9191] pt-1">
              <span>Macro Output ({quantityGrams}g):</span>
              <span className="text-[#bacbbc]">
                {scaledKcal} kcal · {scaledProtein}g P · {scaledCarbs}g C · {scaledFat}g F
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={handleAdd}
            className={`w-full py-3 rounded-full text-[13px] font-medium uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${
              isAdded
                ? 'bg-[#bacbbc] text-[#141313]'
                : 'bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313]'
            }`}
          >
            {isAdded ? (
              <>
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>Added to {mealDestination}</span>
              </>
            ) : (
              <>
                <span>Log to {mealDestination}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};
