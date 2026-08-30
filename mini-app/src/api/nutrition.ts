import {
  api,
  telegramAuthOptions,
} from "./client.js";

/* =========================================================
   TYPES
========================================================= */

export type MealType =
  | "BREAKFAST"
  | "LUNCH"
  | "DINNER"
  | "SNACK";

export type NutritionMeal = {
  id: number;
  nutritionDayId: number;
  name: string;
  meal: MealType;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  amount: number | null;
  unit: string | null;
  createdAt: string;
};

export type NutritionDay = {
  id: number | null;
  userId: number;
  date: string;
  water: number;
  meals: NutritionMeal[];
};

export type AddMealInput = {
  date?: string;
  name: string;
  meal: MealType;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
  amount?: number | null;
  unit?: string | null;
};

export type UpdateWaterInput = {
  date?: string;
  water: number;
};

/* =========================================================
   GET TODAY
   GET /api/nutrition/today
========================================================= */

export async function getTodayNutrition(): Promise<NutritionDay> {
  const response =
    await api.get<{
      success: boolean;
      nutrition: NutritionDay;
    }>(
      "/nutrition/today",
      telegramAuthOptions()
    );

  if (
    !response ||
    !response.nutrition
  ) {
    throw new Error(
      "Invalid nutrition response from API"
    );
  }

  return response.nutrition;
}

/* =========================================================
   GET BY DATE
   GET /api/nutrition?date=YYYY-MM-DD
========================================================= */

export async function getNutrition(
  date?: string
): Promise<NutritionDay> {
  const query =
    date
      ? `?date=${encodeURIComponent(date)}`
      : "";

  const response =
    await api.get<{
      success: boolean;
      nutrition: NutritionDay;
    }>(
      `/nutrition${query}`,
      telegramAuthOptions()
    );

  if (
    !response ||
    !response.nutrition
  ) {
    throw new Error(
      "Invalid nutrition response from API"
    );
  }

  return response.nutrition;
}

/* =========================================================
   ADD MEAL
   POST /api/nutrition/meal
========================================================= */

export async function addNutritionMeal(
  data: AddMealInput
): Promise<NutritionMeal> {
  const response =
    await api.post<{
      success: boolean;
      meal: NutritionMeal;
    }>(
      "/nutrition/meal",
      data,
      telegramAuthOptions()
    );

  if (
    !response ||
    !response.meal
  ) {
    throw new Error(
      "Invalid meal creation response from API"
    );
  }

  return response.meal;
}

/* =========================================================
   DELETE MEAL
   DELETE /api/nutrition/meal/:id
========================================================= */

export async function deleteNutritionMeal(
  mealId: number
): Promise<void> {
  if (
    !Number.isInteger(mealId) ||
    mealId <= 0
  ) {
    throw new Error(
      "Invalid meal id"
    );
  }

  const response =
    await api.delete<{
      success: boolean;
      message: string;
    }>(
      `/nutrition/meal/${mealId}`,
      telegramAuthOptions()
    );

  if (
    !response ||
    response.success !== true
  ) {
    throw new Error(
      "Failed to delete meal"
    );
  }
}

/* =========================================================
   UPDATE WATER
   PATCH /api/nutrition/water
========================================================= */

export async function updateNutritionWater(
  data: UpdateWaterInput
): Promise<NutritionDay> {
  const response =
    await api.patch<{
      success: boolean;
      nutrition: NutritionDay;
    }>(
      "/nutrition/water",
      data,
      telegramAuthOptions()
    );

  if (
    !response ||
    !response.nutrition
  ) {
    throw new Error(
      "Invalid water update response from API"
    );
  }

  return response.nutrition;
}