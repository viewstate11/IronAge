export type MealType =
  | "BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "SNACK";

export type FoodEntry = {
  id: number;

  nutritionDayId?: number;

  name: string;
  meal: MealType;

  calories: number;
  protein: number;
  fat: number;
  carbs: number;

  amount?: number;
  unit?: string;

  date: string;
  createdAt?: string;
};

export type NutritionDay = {
  date: string;

  water: number;

  meals: FoodEntry[];
};