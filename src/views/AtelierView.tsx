import React, { useState } from "react";
import { Meal, MealIngredient, FoodItem, ActiveTab } from "../types";

interface AtelierViewProps {
  onSaveMeal: (meal: Meal) => void;
  availableFoods: FoodItem[];
  setActiveTab: (tab: ActiveTab) => void;
  initialMealToEdit?: Meal | null;
}

export const AtelierView: React.FC<AtelierViewProps> = ({
  onSaveMeal,
  availableFoods,
  setActiveTab,
  initialMealToEdit,
}) => {
  const [mealTitle, setMealTitle] = useState(
    initialMealToEdit?.title || "Wild Salmon & Quinoa",
  );
  const [mealType, setMealType] = useState<Meal["type"]>(
    initialMealToEdit?.type || "Lunch",
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  // Ingredients state
  const [ingredients, setIngredients] = useState<MealIngredient[]>(
    initialMealToEdit?.ingredients || [
      {
        foodId: "food-wild-salmon",
        name: "Wild Atlantic Salmon",
        subtitle: "Raw, 100g = 208 kcal",
        amountGrams: 150,
        kcalPer100g: 208,
        proteinPer100g: 22,
        carbsPer100g: 0,
        fatPer100g: 13,
        icon: "set_meal",
      },
      {
        foodId: "food-quinoa",
        name: "Organic White Quinoa",
        subtitle: "Cooked, 100g = 120 kcal",
        amountGrams: 100,
        kcalPer100g: 120,
        proteinPer100g: 4.4,
        carbsPer100g: 21.3,
        fatPer100g: 1.9,
        icon: "grain",
      },
      {
        foodId: "food-mixed-greens",
        name: "Mixed Spring Greens",
        subtitle: "Fresh, 100g = 23 kcal",
        amountGrams: 50,
        kcalPer100g: 23,
        proteinPer100g: 2.2,
        carbsPer100g: 3.6,
        fatPer100g: 0.4,
        icon: "eco",
      },
    ],
  );

  // Live calculated macros
  const totalCals = Math.round(
    ingredients.reduce(
      (sum, ing) => sum + (ing.amountGrams * ing.kcalPer100g) / 100,
      0,
    ),
  );
  const totalProtein = Math.round(
    ingredients.reduce(
      (sum, ing) => sum + (ing.amountGrams * ing.proteinPer100g) / 100,
      0,
    ),
  );
  const totalCarbs = Math.round(
    ingredients.reduce(
      (sum, ing) => sum + (ing.amountGrams * ing.carbsPer100g) / 100,
      0,
    ),
  );
  const totalFat = Math.round(
    ingredients.reduce(
      (sum, ing) => sum + (ing.amountGrams * ing.fatPer100g) / 100,
      0,
    ),
  );

  const handleAmountChange = (index: number, newGrams: number) => {
    const safeGrams = Math.max(0, isNaN(newGrams) ? 0 : newGrams);
    setIngredients((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], amountGrams: safeGrams };
      return copy;
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFood = (food: FoodItem) => {
    const newIngredient: MealIngredient = {
      foodId: food.id,
      name: food.name,
      subtitle: `${food.category}, 100g = ${food.kcalPer100g} kcal`,
      amountGrams: food.servingDefaultGrams,
      kcalPer100g: food.kcalPer100g,
      proteinPer100g: food.proteinPer100g,
      carbsPer100g: food.carbsPer100g,
      fatPer100g: food.fatPer100g,
      icon: food.icon,
    };
    setIngredients((prev) => [...prev, newIngredient]);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      const newMeal: Meal = {
        id: initialMealToEdit?.id || `meal-${Date.now()}`,
        title: mealTitle || "Custom Meal",
        type: mealType,
        time: initialMealToEdit?.time || "12:30",
        kcal: totalCals,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat,
        description: `Bespoke ${mealType.toLowerCase()} composition consisting of ${ingredients.map((i) => i.name).join(", ")}.`,
        ingredients: ingredients,
      };

      onSaveMeal(newMeal);
      setIsSaving(false);
      setSaveConfirmed(true);

      setTimeout(() => {
        setSaveConfirmed(false);
        setActiveTab("overview");
      }, 1500);
    }, 600);
  };

  const filteredFoods = availableFoods.filter(
    (food) =>
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-12 lg:gap-16 relative z-10 animate-fade-in">
      {/* Left/Main Column: Identity & Workspace */}
      <div className="flex-1 flex flex-col gap-12">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveTab("overview")}
            className="flex items-center gap-2 text-[#c4c7c7] hover:text-[#e5e2e1] font-label-caps text-xs uppercase tracking-widest transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            <span>Back to Overview</span>
          </button>
          <span className="font-label-caps text-[10px] text-[#bacbbc] uppercase tracking-widest">
            Meal Builder
          </span>
        </div>

        {/* Zone 1: Meal Identity */}
        <section className="space-y-6">
          <div className="flex flex-col gap-2 relative">
            <label className="font-label-caps text-xs text-[#c4c7c7] tracking-widest uppercase">
              Meal Name
            </label>
            <input
              type="text"
              value={mealTitle}
              onChange={(e) => setMealTitle(e.target.value)}
              placeholder="Name this meal..."
              className="w-full bg-transparent border-0 border-b border-[#444748]/40 font-display-lg text-3xl md:text-5xl text-[#e5e2e1] focus:ring-0 focus:border-[#bacbbc] px-0 py-2 placeholder-[#444748] transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-3 items-center pt-2">
            <span className="font-label-caps text-xs text-[#c4c7c7] mr-2">
              Meal Type:
            </span>
            {(
              ["Breakfast", "Lunch", "Snack", "Dinner", "Post-Workout"] as const
            ).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setMealType(type)}
                className={`px-4 py-1.5 rounded-full font-label-caps text-xs uppercase tracking-wider transition-all duration-200 ${
                  mealType === type
                    ? "bg-[#bacbbc] text-[#141313] font-semibold shadow-sm"
                    : "border border-[#444748]/40 text-[#c4c7c7] hover:bg-[#201f1f] hover:text-[#e5e2e1]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* Zone 2: Central Workspace (Ingredients) */}
        <section className="space-y-4 flex-1">
          <div className="flex justify-between items-end border-b border-[#444748]/20 pb-4 mb-4">
            <div>
              <h2 className="font-headline-sm text-2xl text-[#e5e2e1]">
                Ingredients
              </h2>
              <p className="text-[13px] text-[#c4c7c7] mt-0.5">
                Adjust grams directly to calculate macro distribution in real
                time.
              </p>
            </div>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-[#e5e2e1] hover:text-[#bacbbc] transition-colors bg-[#201f1f] hover:bg-[#252424] px-4 py-2 rounded-full border border-[#444748]/40 text-[13px] font-medium"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Add Food</span>
            </button>
          </div>

          {ingredients.length === 0 ? (
            <div className="py-16 text-center border border-dashed border-[#444748]/30 rounded-xl">
              <p className="font-headline-sm text-lg text-[#c4c7c7] italic mb-3">
                No ingredients added to this meal yet
              </p>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] text-[13px] font-medium px-6 py-2.5 rounded-full transition-colors"
              >
                Browse Food Library
              </button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#444748]/20 border-t border-b border-[#444748]/20">
              {ingredients.map((item, index) => {
                const itemCals = Math.round(
                  (item.amountGrams * item.kcalPer100g) / 100,
                );
                const itemPro = Math.round(
                  (item.amountGrams * item.proteinPer100g) / 100,
                );
                const itemCarbs = Math.round(
                  (item.amountGrams * item.carbsPer100g) / 100,
                );
                const itemFat = Math.round(
                  (item.amountGrams * item.fatPer100g) / 100,
                );

                return (
                  <div
                    key={`${item.foodId}-${index}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between py-4 px-2 hover:bg-[#1a1919] transition-colors gap-3"
                  >
                    <div className="flex items-center gap-3.5 flex-1">
                      <div className="w-9 h-9 rounded bg-[#201f1f] border border-[#444748]/30 flex items-center justify-center text-[#bacbbc] shrink-0">
                        <span className="material-symbols-outlined text-[18px]">
                          {item.icon}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[15px] text-[#e5e2e1] font-medium">
                          {item.name}
                        </span>
                        <span className="text-[12px] text-[#8e9191] mt-0.5">
                          {itemCals} kcal · {itemPro}g P · {itemCarbs}g C ·{" "}
                          {itemFat}g F
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-end sm:self-center">
                      <div className="flex items-center gap-1.5 border-b border-[#444748]/40 focus-within:border-[#bacbbc] pb-0.5">
                        <input
                          type="number"
                          min="0"
                          step="5"
                          value={item.amountGrams}
                          onChange={(e) =>
                            handleAmountChange(
                              index,
                              parseFloat(e.target.value),
                            )
                          }
                          className="w-16 bg-transparent border-none p-0 text-right font-data-highlight text-lg focus:ring-0 text-[#e5e2e1]"
                        />
                        <span className="text-[12px] text-[#c4c7c7]">g</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveIngredient(index)}
                        className="text-[#8e9191] hover:text-[#e5e2e1] p-1 transition-colors"
                        title="Remove ingredient"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          close
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Right Column: Nutrition Summary Aside */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 lg:sticky lg:top-24 self-start">
        <div className="border border-[#444748]/30 p-6 rounded-xl bg-[#191818] relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#444748]/20 pb-3 mb-5">
            <h3 className="font-label-caps text-xs text-[#c4c7c7] tracking-wider uppercase">
              MEAL NUTRITION
            </h3>
            <span className="text-[12px] text-[#bacbbc]">
              {ingredients.length} items
            </span>
          </div>

          <div className="space-y-5">
            {/* Energy */}
            <div className="flex flex-col gap-1 border-b border-[#444748]/20 pb-4">
              <span className="text-[12px] text-[#c4c7c7]">Total Calories</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display-md text-3xl md:text-4xl text-[#e5e2e1]">
                  {totalCals}
                </span>
                <span className="text-[13px] text-[#c4c7c7]">kcal</span>
              </div>
            </div>

            {/* Macros Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="flex flex-col gap-1 bg-[#141313] p-2.5 rounded border border-[#444748]/20">
                <span className="text-[11px] text-[#c4c7c7] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#bacbbc]" />{" "}
                  Protein
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-data-highlight text-lg text-[#e5e2e1]">
                    {totalProtein}
                  </span>
                  <span className="text-[11px] text-[#c4c7c7]">g</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 bg-[#141313] p-2.5 rounded border border-[#444748]/20">
                <span className="text-[11px] text-[#c4c7c7] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E8E77]" />{" "}
                  Carbs
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-data-highlight text-lg text-[#e5e2e1]">
                    {totalCarbs}
                  </span>
                  <span className="text-[11px] text-[#c4c7c7]">g</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 bg-[#141313] p-2.5 rounded border border-[#444748]/20">
                <span className="text-[11px] text-[#c4c7c7] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#444748]" /> Fat
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-data-highlight text-lg text-[#e5e2e1]">
                    {totalFat}
                  </span>
                  <span className="text-[11px] text-[#c4c7c7]">g</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 relative">
            <button
              onClick={handleSave}
              disabled={isSaving || ingredients.length === 0}
              className={`w-full py-3 rounded-full text-[13px] font-medium uppercase tracking-wider transition-colors flex justify-center items-center gap-2 ${
                saveConfirmed
                  ? "bg-[#bacbbc] text-[#141313]"
                  : "bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] disabled:opacity-50"
              }`}
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>Saving...</span>
                </>
              ) : saveConfirmed ? (
                <>
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                  <span>Saved to Meals</span>
                </>
              ) : (
                <>
                  <span>Save Meal</span>
                  <span className="material-symbols-outlined text-[16px]">
                    arrow_forward
                  </span>
                </>
              )}
            </button>

            {saveConfirmed && (
              <p className="text-center text-[12px] text-[#bacbbc] mt-2">
                Meal saved to your collection.
              </p>
            )}
          </div>
        </div>
      </aside>

      {/* Slide-in Overlay: Add Food Search */}
      {isSearchOpen && (
        <>
          <div
            onClick={() => setIsSearchOpen(false)}
            className="fixed inset-0 bg-[#141313]/70 backdrop-blur-sm z-[90] animate-fade-in"
          />
          <div className="fixed top-0 right-0 h-full w-full max-w-md z-[100] bg-[#141313]/95 backdrop-blur-2xl border-l border-[#444748]/30 flex flex-col p-8 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center border-b border-[#444748]/30 pb-4 mb-6">
              <div className="flex items-center gap-2 flex-1 mr-4">
                <span className="material-symbols-outlined text-[#c4c7c7] text-[20px]">
                  search
                </span>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search food library..."
                  className="bg-transparent border-none text-xl font-headline-sm text-[#e5e2e1] focus:ring-0 w-full placeholder-[#444748] p-0"
                />
              </div>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-[#c4c7c7] hover:text-[#e5e2e1] p-2 rounded-full hover:bg-[#201f1f]"
              >
                <span className="material-symbols-outlined text-[24px]">
                  close
                </span>
              </button>
            </div>

            <p className="font-label-caps text-[11px] text-[#c4c7c7] uppercase tracking-widest mb-4">
              Select Food to Add ({filteredFoods.length} available)
            </p>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1 pb-12">
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  onClick={() => handleAddFood(food)}
                  className="flex justify-between items-center p-4 rounded-lg border border-[#444748]/20 bg-[#1a1a1a]/60 hover:bg-[#201f1f] hover:border-[#bacbbc]/50 cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#201f1f] flex items-center justify-center text-[#bacbbc] group-hover:scale-105 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">
                        {food.icon}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-md text-sm text-[#e5e2e1] group-hover:text-[#bacbbc]">
                        {food.name}
                      </span>
                      <span className="font-label-caps text-[10px] text-[#c4c7c7]">
                        {food.kcalPer100g} kcal / 100g • {food.proteinPer100g}P
                        • {food.carbsPer100g}C • {food.fatPer100g}F
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#444748] group-hover:text-[#bacbbc] group-hover:scale-110 transition-transform">
                    add
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const MealBuilderView = AtelierView;
