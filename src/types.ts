export interface FoodItem {
  id: string;
  name: string;
  subtitle: string;
  category: 'Proteins' | 'Grains & Staples' | 'Dairy' | 'Fruits' | 'Vegetables' | 'Legumes' | 'Nuts & Seeds';
  servingDefaultGrams: number;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  icon: string;
  image?: string;
  description?: string;
}

export interface MealIngredient {
  foodId: string;
  name: string;
  subtitle?: string;
  amountGrams: number;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  icon: string;
}

export interface Meal {
  id: string;
  title: string;
  type: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner' | 'Post-Workout';
  time?: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  description?: string;
  image?: string;
  ingredients: MealIngredient[];
}

export interface LoggedFoodItem {
  id: string;
  foodId?: string;
  name: string;
  amountText: string;
  amountGrams: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayLog {
  date: string; // e.g. '2026-08-24'
  meals: {
    breakfast: LoggedFoodItem[];
    lunch: LoggedFoodItem[];
    snack: LoggedFoodItem[];
    dinner: LoggedFoodItem[];
  };
}

export interface WeeklyPlanSlot {
  id: string;
  title: string;
  type: 'Breakfast' | 'Lunch' | 'Snack' | 'Dinner';
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayPlan {
  dayName: string; // 'Monday', 'Tuesday'
  dateLabel: string; // '24 Aug'
  slots: {
    breakfast?: WeeklyPlanSlot;
    lunch?: WeeklyPlanSlot;
    snack?: WeeklyPlanSlot;
    dinner?: WeeklyPlanSlot;
  };
}

export interface UserProfile {
  name: string;
  email: string;
  age: number;
  gender: string;
  height: string;
  weight: string;
  activityLevel: string;
  targetKcal: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  units: 'Metric' | 'Imperial';
  notifications: boolean;
  avatarUrl: string;
}

export type ActiveTab =
  | 'overview'
  | 'meals'
  | 'atelier'
  | 'library'
  | 'planner'
  | 'nutrition'
  | 'tracker'
  | 'history'
  | 'vitals'
  | 'meal-detail'
  | 'food-detail'
  | 'profile'
  | 'privacy'
  | 'terms'
  | 'login'
  | 'register'
  | '404';

