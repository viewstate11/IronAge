import type { User } from "../types/user";

export type NutritionPlan = {
  bmr: number;
  tdee: number;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
};

function normalizeGoal(
  goal: unknown
): string {
  return String(
    goal ?? "FITNESS"
  ).toLowerCase();
}

export function calculateNutrition(
  user: User
): NutritionPlan {
  const weight = Math.max(
    30,
    Number(user.weight) || 70
  );

  const height = Math.max(
    120,
    Number(user.height) || 170
  );

  const age = Math.max(
    13,
    Number(user.age) || 30
  );

  /*
   * Mifflin-St Jeor BMR
   */
  let bmr =
    10 * weight +
    6.25 * height -
    5 * age;

  if (
    user.gender === "FEMALE"
  ) {
    bmr -= 161;
  } else {
    bmr += 5;
  }

  bmr = Math.round(
    bmr
  );

  /*
   * Current activity multiplier.
   *
   * 1.45 = moderate/default
   * We keep this stable until
   * activity level is added to User.
   */
  const activityMultiplier =
    1.45;

  const tdee = Math.round(
    bmr *
      activityMultiplier
  );

  let calories =
    tdee;

  const goal =
    normalizeGoal(
      user.goal
    );

  /*
   * Weight loss
   */
  if (
    goal.includes("схуд") ||
    goal.includes("снижен") ||
    goal.includes("weight loss") ||
    goal.includes("lose") ||
    goal.includes("cut")
  ) {
    calories -= 400;
  }

  /*
   * Muscle gain
   */
  if (
    goal.includes("мас") ||
    goal.includes("muscle") ||
    goal.includes("gain") ||
    goal.includes("bulk") ||
    goal.includes("силь")
  ) {
    calories += 250;
  }

  calories = Math.max(
    1400,
    Math.round(calories)
  );

  /*
   * Protein:
   * 2g / kg
   */
  const protein =
    Math.round(
      weight * 2
    );

  /*
   * Fat:
   * 0.8g / kg
   */
  const fat =
    Math.round(
      weight * 0.8
    );

  /*
   * Remaining calories
   * go to carbohydrates.
   */
  const remainingCalories =
    calories -
    protein * 4 -
    fat * 9;

  const carbs =
    Math.max(
      0,
      Math.round(
        remainingCalories / 4
      )
    );

  return {
    bmr,
    tdee,
    calories,
    protein,
    fat,
    carbs,
  };
}

/*
 * Nutrition adherence.
 *
 * 100% = calories are close
 * to target.
 *
 * We don't allow more than 100%.
 */
export function calculateNutritionAdherence(
  currentCalories: number,
  targetCalories: number
): number {
  if (
    targetCalories <= 0
  ) {
    return 0;
  }

  if (
    currentCalories <= 0
  ) {
    return 0;
  }

  const ratio =
    currentCalories /
    targetCalories;

  /*
   * Ideal range:
   * 90-110% = 100% adherence.
   *
   * Below / above that,
   * score decreases.
   */
  const deviation =
    Math.abs(
      ratio - 1
    );

  const score =
    100 -
    deviation * 100;

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(score)
    )
  );
}