import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FoodItem, ActiveTab } from '../types';

interface FoodLibraryViewProps {
  foods: FoodItem[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectFood: (food: FoodItem) => void;
  onQuickAddFood: (food: FoodItem, targetMeal: 'breakfast' | 'lunch' | 'snack' | 'dinner') => void;
}

export const FoodLibraryView: React.FC<FoodLibraryViewProps> = ({
  foods,
  setActiveTab,
  onSelectFood,
  onQuickAddFood
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [quickAddOpenId, setQuickAddOpenId] = useState<string | null>(null);

  const categories = [
    'All',
    'Proteins',
    'Grains & Staples',
    'Dairy',
    'Fruits',
    'Vegetables',
    'Legumes',
    'Nuts & Seeds'
  ];

  const filteredFoods = foods.filter((food) => {
    const matchesCategory = selectedCategory === 'All' || food.category === selectedCategory;
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.subtitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-12"
    >
      {/* Header */}
      <motion.section 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="border-b border-[#444748]/20 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <span className="font-label-caps text-xs text-[#bacbbc] uppercase tracking-widest block mb-2">
            Nutritional Database
          </span>
          <h2 className="font-display-lg text-3xl md:text-5xl text-[#e5e2e1] mb-2 font-light">
            FOOD LIBRARY
          </h2>
          <p className="font-body-lg text-[#c4c7c7] max-w-2xl font-light">
            Explore whole foods, understand their complete nutritional composition, and integrate them into your daily plan.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('meals')}
          className="bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] font-label-caps text-xs uppercase tracking-widest px-6 py-3 rounded-full transition-colors flex items-center gap-2 shrink-0 shadow-sm font-semibold"
        >
          <span className="material-symbols-outlined text-[18px]">palette</span>
          <span>Open Meal Builder</span>
        </button>
      </motion.section>

      {/* Search & Filter Section */}
      <motion.section 
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-2 max-w-3xl">
          <label className="font-label-caps text-[11px] text-[#bacbbc] uppercase tracking-wider">
            SEARCH FOODS
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e9191] pointer-events-none text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ingredient, or nutrient..."
              className="w-full bg-[#1c1b1b] border border-[#444748]/40 rounded-lg text-[#e5e2e1] text-[15px] py-3 pl-11 pr-10 focus:outline-none focus:border-[#bacbbc] transition-colors placeholder:text-[#8e9191]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8e9191] hover:text-[#e5e2e1] p-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>
        </div>

        {/* Lightweight Category Filters */}
        <div className="flex flex-wrap gap-2 pt-1 border-b border-[#444748]/20 pb-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[13px] font-medium px-3.5 py-1.5 rounded-full transition-colors ${
                  isSelected
                    ? 'bg-[#252424] text-[#e5e2e1] border border-[#bacbbc]/40'
                    : 'text-[#c4c7c7] hover:text-[#e5e2e1] hover:bg-[#1a1919]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </motion.section>

      {/* Food Archive Table */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-col"
      >
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 py-3 border-b border-[#444748]/30 text-[#8e9191] font-label-caps text-[11px] tracking-wider uppercase">
          <div className="col-span-6 md:col-span-4">Food Item</div>
          <div className="col-span-3 md:col-span-2 text-right">Standard Serving</div>
          <div className="col-span-3 md:col-span-2 text-right">Energy / 100g</div>
          <div className="hidden md:block md:col-span-4 text-right">Macros (Protein / Carbs / Fat)</div>
        </div>

        {/* Rows */}
        {filteredFoods.length === 0 ? (
          <div className="py-16 text-center text-[#c4c7c7]">
            <p className="font-headline-sm text-xl italic mb-2">No matching foods found</p>
            <p className="text-sm font-light">Try searching for generic names like salmon, egg, or quinoa.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#444748]/15">
            {filteredFoods.map((food) => (
              <motion.div
                layoutId={`food-card-${food.id}`}
                key={food.id}
                className="grid grid-cols-12 gap-4 py-4 hover:bg-[#1a1919] transition-colors group cursor-pointer items-center px-2 relative z-0"
              >
                {/* Name & Subtitle */}
                <div
                  onClick={() => {
                    onSelectFood(food);
                    setActiveTab('food-detail');
                  }}
                  className="col-span-6 md:col-span-4 flex items-center gap-3.5"
                >
                  <div className="w-9 h-9 rounded bg-[#201f1f] border border-[#444748]/20 flex items-center justify-center text-[#bacbbc] shrink-0">
                    <span className="material-symbols-outlined text-[18px]">{food.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <motion.span layoutId={`food-name-${food.id}`} className="text-[15px] text-[#e5e2e1] group-hover:text-[#bacbbc] transition-colors font-medium">
                      {food.name}
                    </motion.span>
                    <span className="text-[12px] text-[#8e9191]">
                      {food.subtitle}
                    </span>
                  </div>
                </div>

                {/* Serving */}
                <div
                  onClick={() => {
                    onSelectFood(food);
                    setActiveTab('food-detail');
                  }}
                  className="col-span-3 md:col-span-2 flex items-center justify-end text-right"
                >
                  <span className="text-[14px] text-[#c4c7c7]">
                    {food.servingDefaultGrams}g
                  </span>
                </div>

                {/* Calories */}
                <div
                  onClick={() => {
                    onSelectFood(food);
                    setActiveTab('food-detail');
                  }}
                  className="col-span-3 md:col-span-2 flex items-center justify-end text-right"
                >
                  <span className="font-data-highlight text-lg text-[#e5e2e1]">
                    {food.kcalPer100g}{' '}
                    <span className="text-[12px] text-[#c4c7c7] not-italic">kcal</span>
                  </span>
                </div>

                {/* Macros & Actions */}
                <div className="hidden md:flex md:col-span-4 items-center justify-end space-x-6 text-[#c4c7c7]">
                  <div className="flex flex-col items-end">
                    <span className="font-label-caps text-[10px] text-[#8e9191]">
                      PROTEIN
                    </span>
                    <span className="text-[14px] font-medium text-[#e5e2e1]">
                      {food.proteinPer100g}g
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-label-caps text-[10px] text-[#8e9191]">
                      CARBS
                    </span>
                    <span className="text-[14px] font-medium text-[#e5e2e1]">
                      {food.carbsPer100g}g
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-label-caps text-[10px] text-[#8e9191]">
                      FAT
                    </span>
                    <span className="text-[14px] font-medium text-[#e5e2e1]">
                      {food.fatPer100g}g
                    </span>
                  </div>

                  {/* Quick Add popup button */}
                  <div className="relative ml-2 z-10">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setQuickAddOpenId(quickAddOpenId === food.id ? null : food.id);
                      }}
                      className="p-1.5 text-[#bacbbc] hover:text-[#e5e2e1] hover:bg-[#201f1f] rounded-full transition-colors"
                      title="Quick log food"
                    >
                      <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    </button>

                    {/* Destination dropdown */}
                    {quickAddOpenId === food.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-0 top-8 z-50 bg-[#1c1b1b] border border-[#444748]/40 rounded-lg py-2 px-1 w-44 shadow-xl"
                      >
                        <span className="font-label-caps text-[10px] text-[#8e9191] px-3 py-1 block uppercase tracking-wider">
                          Log to Meal
                        </span>
                        {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((slot) => (
                          <button
                            key={slot}
                            onClick={() => {
                              onQuickAddFood(food, slot);
                              setQuickAddOpenId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[13px] text-[#e5e2e1] hover:bg-[#252424] hover:text-[#bacbbc] rounded capitalize transition-colors"
                          >
                            + {slot} ({food.servingDefaultGrams}g)
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
};
