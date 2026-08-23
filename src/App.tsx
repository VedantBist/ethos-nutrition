import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ActiveTab,
  Meal,
  FoodItem,
  DayLog,
  DayPlan,
  UserProfile,
  LoggedFoodItem,
} from "./types";
import {
  INITIAL_FOOD_ITEMS,
  INITIAL_MEALS,
  INITIAL_DAY_LOG,
  INITIAL_WEEK_PLAN,
  INITIAL_USER_PROFILE,
} from "./data/initialData";
import { ShaderBackground } from "./components/ShaderBackground";
import { Navigation } from "./components/Navigation";
import { OverviewView } from "./views/OverviewView";
import { AtelierView } from "./views/AtelierView";
import { FoodLibraryView } from "./views/FoodLibraryView";
import { FoodDetailView } from "./views/FoodDetailView";
import { MealDetailView } from "./views/MealDetailView";
import { WeeklyPlannerView } from "./views/WeeklyPlannerView";
import { TrackerView } from "./views/TrackerView";
import { VitalsHistoryView } from "./views/VitalsHistoryView";
import { ProfileGoalsView } from "./views/ProfileGoalsView";
import { LegalViews } from "./views/LegalViews";
import { AuthViews } from "./views/AuthViews";
import { NotFoundView } from "./views/NotFoundView";
import { QuickLogModal } from "./components/QuickLogModal";
import { foodService } from "./services/api";

export const App: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");

  // App Data with localStorage persistence
  const [foods, setFoods] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem("ethos_foods");
    return saved ? JSON.parse(saved) : INITIAL_FOOD_ITEMS;
  });

  const [meals, setMeals] = useState<Meal[]>(() => {
    const saved = localStorage.getItem("ethos_meals");
    return saved ? JSON.parse(saved) : INITIAL_MEALS;
  });

  const [todayLog, setTodayLog] = useState<DayLog>(() => {
    const saved = localStorage.getItem("ethos_day_log");
    return saved ? JSON.parse(saved) : INITIAL_DAY_LOG;
  });

  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(() => {
    const saved = localStorage.getItem("ethos_week_plan");
    return saved ? JSON.parse(saved) : INITIAL_WEEK_PLAN;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("ethos_user_profile");
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // Selected Detail objects
  const [selectedMeal, setSelectedMeal] = useState<Meal>(meals[0]);
  const [selectedFood, setSelectedFood] = useState<FoodItem>(foods[0]);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  // Quick Log Modal State
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [quickLogTargetSlot, setQuickLogTargetSlot] = useState<
    "breakfast" | "lunch" | "snack" | "dinner"
  >("lunch");

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem("ethos_foods", JSON.stringify(foods));
  }, [foods]);

  // The library is server-authoritative when the API is available. Local data remains a
  // deliberate offline fallback so the existing UI continues to work during development.
  useEffect(() => {
    let cancelled = false;

    const syncFoods = async () => {
      try {
        const apiFoods = await foodService.list();
        if (!cancelled && apiFoods.length) {
          setFoods(apiFoods);
        }
      } catch (error) {
        if (!cancelled) {
          // Keep fallback data, but retry shortly in case backend started later.
          window.setTimeout(syncFoods, 4000);
        }
      }
    };

    syncFoods();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("ethos_meals", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("ethos_day_log", JSON.stringify(todayLog));
  }, [todayLog]);

  useEffect(() => {
    localStorage.setItem("ethos_week_plan", JSON.stringify(weekPlan));
  }, [weekPlan]);

  useEffect(() => {
    localStorage.setItem("ethos_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  // Handlers
  const handleSaveMealInAtelier = (newMeal: Meal) => {
    setMeals((prev) => {
      const existsIndex = prev.findIndex((m) => m.id === newMeal.id);
      if (existsIndex >= 0) {
        const copy = [...prev];
        copy[existsIndex] = newMeal;
        return copy;
      }
      return [newMeal, ...prev];
    });
    setSelectedMeal(newMeal);
    triggerToast(`Meal "${newMeal.title}" saved.`);
  };

  const handleEditMealRequest = (mealToEdit: Meal) => {
    setEditingMeal(mealToEdit);
    setActiveTab("meals");
  };

  const handleLogMealDirectly = (mealToLog: Meal) => {
    const slotKey: "breakfast" | "lunch" | "snack" | "dinner" =
      mealToLog.type.toLowerCase() === "breakfast"
        ? "breakfast"
        : mealToLog.type.toLowerCase() === "dinner"
          ? "dinner"
          : mealToLog.type.toLowerCase() === "snack"
            ? "snack"
            : "lunch";

    const newLogItem: LoggedFoodItem = {
      id: `log-meal-${Date.now()}`,
      name: mealToLog.title,
      amountText: "1 recipe serving",
      amountGrams: mealToLog.ingredients.reduce((s, i) => s + i.amountGrams, 0),
      kcal: mealToLog.kcal,
      protein: mealToLog.protein,
      carbs: mealToLog.carbs,
      fat: mealToLog.fat,
    };

    setTodayLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [slotKey]: [newLogItem, ...prev.meals[slotKey]],
      },
    }));

    triggerToast(`Logged "${mealToLog.title}" to ${slotKey}.`);
  };

  const handleAddFoodToLog = (
    food: FoodItem,
    grams: number,
    slot: "breakfast" | "lunch" | "snack" | "dinner",
  ) => {
    const ratio = grams / 100;
    const newLogItem: LoggedFoodItem = {
      id: `log-food-${Date.now()}`,
      foodId: food.id,
      name: food.name,
      amountText: `${grams}g`,
      amountGrams: grams,
      kcal: Math.round(food.kcalPer100g * ratio),
      protein: Math.round(food.proteinPer100g * ratio),
      carbs: Math.round(food.carbsPer100g * ratio),
      fat: Math.round(food.fatPer100g * ratio),
    };

    setTodayLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [slot]: [newLogItem, ...prev.meals[slot]],
      },
    }));

    triggerToast(`Added ${food.name} (${grams}g) to ${slot}.`);
  };

  const handleOpenQuickLog = (
    targetSlot: "breakfast" | "lunch" | "snack" | "dinner" = "lunch",
  ) => {
    setQuickLogTargetSlot(targetSlot);
    setIsQuickLogOpen(true);
  };

  const handleAddQuickLogItem = (
    mealSlot: "breakfast" | "lunch" | "snack" | "dinner",
    item: LoggedFoodItem,
  ) => {
    setTodayLog((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [mealSlot]: [item, ...prev.meals[mealSlot]],
      },
    }));
    triggerToast(`Logged ${item.name} (${item.kcal} kcal) to ${mealSlot}.`);
  };

  return (
    <div className="min-h-screen bg-[#141313] text-[#e5e2e1] flex flex-col relative selection:bg-[#bacbbc] selection:text-[#141313]">
      {/* Smoky graphite WebGL canvas shader background */}
      <ShaderBackground />

      {/* Navigation Bars */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (
            (tab === "meals" || tab === "atelier") &&
            activeTab !== "meals" &&
            activeTab !== "atelier"
          ) {
            setEditingMeal(null);
          }
          setActiveTab(tab);
        }}
        userProfile={userProfile}
        onOpenQuickLog={() => handleOpenQuickLog("lunch")}
      />

      {/* Main Content Area */}
      <main className="flex-1 md:pl-24 pt-20 pb-20 md:pb-12 min-h-screen w-full relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full h-full"
          >
            {activeTab === "overview" && (
              <OverviewView
                meals={meals}
                userProfile={userProfile}
                todayLog={todayLog}
                setActiveTab={setActiveTab}
                onSelectMeal={(m) => setSelectedMeal(m)}
                onOpenQuickLog={() => handleOpenQuickLog("lunch")}
              />
            )}

            {(activeTab === "meals" || activeTab === "atelier") && (
              <AtelierView
                onSaveMeal={handleSaveMealInAtelier}
                availableFoods={foods}
                setActiveTab={setActiveTab}
                initialMealToEdit={editingMeal}
              />
            )}

            {activeTab === "library" && (
              <FoodLibraryView
                foods={foods}
                setActiveTab={setActiveTab}
                onSelectFood={(f) => setSelectedFood(f)}
                onQuickAddFood={(f, slot) =>
                  handleAddFoodToLog(f, f.servingDefaultGrams || 100, slot)
                }
              />
            )}

            {activeTab === "food-detail" && (
              <FoodDetailView
                food={selectedFood}
                setActiveTab={setActiveTab}
                onAddFoodToLog={handleAddFoodToLog}
              />
            )}

            {activeTab === "meal-detail" && (
              <MealDetailView
                meal={selectedMeal}
                setActiveTab={setActiveTab}
                onEditMeal={handleEditMealRequest}
                onLogMeal={handleLogMealDirectly}
              />
            )}

            {activeTab === "planner" && (
              <WeeklyPlannerView
                weekPlan={weekPlan}
                setWeekPlan={setWeekPlan}
                availableMeals={meals}
                setActiveTab={setActiveTab}
                onSelectMeal={(m) => setSelectedMeal(m)}
              />
            )}

            {(activeTab === "nutrition" || activeTab === "tracker") && (
              <TrackerView
                dayLog={todayLog}
                setDayLog={setTodayLog}
                userProfile={userProfile}
                availableFoods={foods}
                setActiveTab={setActiveTab}
                onOpenQuickLog={handleOpenQuickLog}
              />
            )}

            {(activeTab === "history" || activeTab === "vitals") && (
              <VitalsHistoryView
                userProfile={userProfile}
                setActiveTab={setActiveTab}
              />
            )}

            {(activeTab === "profile" || activeTab === "settings") && (
              <ProfileGoalsView
                userProfile={userProfile}
                onUpdateProfile={(updated) => {
                  setUserProfile(updated);
                  triggerToast("Profile & nutritional targets saved.");
                }}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === "privacy" && (
              <LegalViews type="privacy" setActiveTab={setActiveTab} />
            )}

            {activeTab === "terms" && (
              <LegalViews type="terms" setActiveTab={setActiveTab} />
            )}

            {activeTab === "login" && (
              <AuthViews
                mode="login"
                setActiveTab={setActiveTab}
                onAuthenticate={(name, email) => {
                  setUserProfile((prev) => ({ ...prev, name, email }));
                  triggerToast(`Welcome back, ${name}.`);
                }}
              />
            )}

            {activeTab === "register" && (
              <AuthViews
                mode="register"
                setActiveTab={setActiveTab}
                onAuthenticate={(name, email) => {
                  setUserProfile((prev) => ({ ...prev, name, email }));
                  triggerToast(`Account created for ${name}.`);
                }}
              />
            )}

            {activeTab === "404" && (
              <NotFoundView setActiveTab={setActiveTab} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Quick Log Modal */}
      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        availableFoods={foods}
        defaultMealSlot={quickLogTargetSlot}
        onAddLogItem={handleAddQuickLogItem}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#1a1a1a] border border-[#bacbbc]/50 text-[#e5e2e1] px-6 py-3 rounded-full shadow-2xl flex items-center gap-2.5 font-label-caps text-xs tracking-wider animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-[#bacbbc] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default App;
