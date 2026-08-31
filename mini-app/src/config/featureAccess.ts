export type FeatureKey =
  | "dashboard"
  | "workout"
  | "advancedWorkouts"
  | "nutrition"
  | "premiumNutrition"
  | "progress"
  | "advancedProgress"
  | "profile"
  | "aiTrainer"
  | "coachSystem"
  | "myProgram"
  | "workoutSession"
  | "workoutComplete";

export type FeatureAccessRule =
  | "FREE"
  | "PREMIUM"
  | "COACH"
  | "CLIENT";

export const FEATURE_ACCESS: Readonly<
  Record<FeatureKey, FeatureAccessRule>
> = {
  dashboard: "FREE",
  workout: "FREE",
  advancedWorkouts: "PREMIUM",

  nutrition: "FREE",
  premiumNutrition: "PREMIUM",

  progress: "FREE",
  advancedProgress: "PREMIUM",

  profile: "FREE",
  aiTrainer: "PREMIUM",

  coachSystem: "COACH",
  myProgram: "CLIENT",

  workoutSession: "FREE",
  workoutComplete: "FREE",
};

export type FeatureAccessState = {
  isPremium: boolean;
  isCoach: boolean;
  isClient: boolean;
};

export function canAccessFeature(
  feature: FeatureKey,
  state: FeatureAccessState
): boolean {
  const rule = FEATURE_ACCESS[feature];

  switch (rule) {
    case "FREE":
      return true;

    case "PREMIUM":
      return state.isPremium;

    case "COACH":
      return state.isCoach;

    case "CLIENT":
      return state.isClient;

    default: {
      const exhaustiveCheck: never = rule;
      return exhaustiveCheck;
    }
  }
}

export function getFeatureAccessRule(
  feature: FeatureKey
): FeatureAccessRule {
  return FEATURE_ACCESS[feature];
}
