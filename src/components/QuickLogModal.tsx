import React, { useState } from "react";
import { FoodItem, LoggedFoodItem } from "../types";

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableFoods: FoodItem[];
  defaultMealSlot?: "breakfast" | "lunch" | "snack" | "dinner";
  onAddLogItem: (
    mealSlot: "breakfast" | "lunch" | "snack" | "dinner",
    item: LoggedFoodItem,
  ) => void;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  availableFoods,
  defaultMealSlot = "lunch",
  onAddLogItem,
}) => {
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(
    availableFoods[0] || null,
  );
  const [customName, setCustomName] = useState("");
  const [amountGrams, setAmountGrams] = useState(100);
  const [mealSlot, setMealSlot] = useState<
    "breakfast" | "lunch" | "snack" | "dinner"
  >(defaultMealSlot);
  const [searchFilter, setSearchFilter] = useState("");

  if (!isOpen) return null;

  const currentFood = selectedFood;
  const ratio = (amountGrams || 0) / 100;
  const computedKcal = currentFood
    ? Math.round(currentFood.kcalPer100g * ratio)
    : 0;
  const computedPro = currentFood
    ? Math.round(currentFood.proteinPer100g * ratio)
    : 0;
  const computedCarbs = currentFood
    ? Math.round(currentFood.carbsPer100g * ratio)
    : 0;
  const computedFat = currentFood
    ? Math.round(currentFood.fatPer100g * ratio)
    : 0;

  const filteredFoods = availableFoods.filter((f) =>
    f.name.toLowerCase().includes(searchFilter.toLowerCase()),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFood && !customName) return;

    const newItem: LoggedFoodItem = {
      id: `log-${Date.now()}`,
      foodId: currentFood?.id,
      name: customName || currentFood?.name || "Custom Food",
      amountText: `${amountGrams}g`,
      amountGrams: amountGrams,
      kcal: computedKcal,
      protein: computedPro,
      carbs: computedCarbs,
      fat: computedFat,
    };

    onAddLogItem(mealSlot, newItem);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#141313]/80 backdrop-blur-md z-[90] animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[100] bg-[#1a1a1a] border border-[#444748]/40 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center border-b border-[#444748]/30 pb-4 mb-6">
          <div>
            <h3 className="font-headline-sm text-2xl text-[#e5e2e1]">
              Log Food
            </h3>
            <p className="font-label-caps text-xs text-[#bacbbc] uppercase tracking-wider mt-0.5">
              Record Food Entry
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#c4c7c7] hover:text-[#e5e2e1] p-1.5 rounded-full hover:bg-[#201f1f]"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Destination Slot */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-xs text-[#c4c7c7] uppercase tracking-wider">
              Meal Destination
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["breakfast", "lunch", "snack", "dinner"] as const).map(
                (slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setMealSlot(slot)}
                    className={`py-2 rounded-lg font-label-caps text-xs capitalize transition-all ${
                      mealSlot === slot
                        ? "bg-[#bacbbc] text-[#141313] font-semibold shadow-sm"
                        : "border border-[#444748]/30 text-[#c4c7c7] hover:bg-[#201f1f]"
                    }`}
                  >
                    {slot}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* Search & Select Food */}
          <div className="flex flex-col gap-2">
            <label className="font-label-caps text-xs text-[#c4c7c7] uppercase tracking-wider">
              Select Food
            </label>
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter food library..."
              className="input-ethos text-sm text-[#e5e2e1]"
            />
            <div className="max-h-36 overflow-y-auto space-y-1.5 pt-2 pr-1">
              {filteredFoods.slice(0, 8).map((food) => (
                <div
                  key={food.id}
                  onClick={() => {
                    setSelectedFood(food);
                    setAmountGrams(food.servingDefaultGrams || 100);
                  }}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                    selectedFood?.id === food.id
                      ? "border-[#bacbbc] bg-[#201f1f] text-[#e5e2e1]"
                      : "border-[#444748]/20 bg-[#141313]/60 text-[#c4c7c7] hover:bg-[#201f1f]/50"
                  }`}
                >
                  <span className="font-body-md text-sm">{food.name}</span>
                  <span className="font-label-caps text-[10px] text-[#bacbbc]">
                    {food.kcalPer100g} kcal/100g
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Amount In Grams */}
          <div className="flex items-center justify-between border-t border-b border-[#444748]/20 py-3">
            <span className="font-body-md text-sm text-[#c4c7c7]">
              Portion (grams)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                step="5"
                value={amountGrams}
                onChange={(e) =>
                  setAmountGrams(parseFloat(e.target.value) || 0)
                }
                className="w-20 bg-transparent text-right font-headline-sm text-xl text-[#e5e2e1] border-b border-[#444748]/50 focus:outline-none focus:border-[#bacbbc] p-0"
              />
              <span className="font-label-caps text-xs text-[#c4c7c7]">g</span>
            </div>
          </div>

          {/* Live Nutrition Computed Banner */}
          <div className="bg-[#141313] p-4 rounded-xl border border-[#444748]/30 flex justify-between items-center text-xs">
            <div className="flex flex-col">
              <span className="font-label-caps text-[10px] text-[#c4c7c7] uppercase">
                Computed
              </span>
              <span className="font-data-highlight text-xl text-[#e5e2e1]">
                {computedKcal} kcal
              </span>
            </div>
            <div className="flex gap-3 text-[#c4c7c7] font-label-caps text-[11px]">
              <span>{computedPro}g Protein</span>
              <span>•</span>
              <span>{computedCarbs}g Carbs</span>
              <span>•</span>
              <span>{computedFat}g Fat</span>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#444748]/30 text-[#c4c7c7] hover:text-[#e5e2e1] rounded-full font-label-caps text-xs uppercase tracking-widest transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] rounded-full font-label-caps text-xs uppercase tracking-widest transition-colors font-semibold shadow-md"
            >
              Log Food
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
