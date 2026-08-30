export type Gender =
  | "MALE"
  | "FEMALE"
  | "OTHER";

export type Goal =
  | "MUSCLE"
  | "LOSE_WEIGHT"
  | "MAINTAIN"
  | "ENDURANCE"
  | "STRENGTH"
  | "FITNESS";

export type WorkoutSetData = {
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  repetitions?: number | null;
  weight?: number | null;
  duration?: number | null;
  completed?: boolean;
};

export type WorkoutHistoryItem = {
  id: string | number;

  workoutId?: string | number;

  name: string;

  date: string;

  type: string;

  duration: number;

  calories: number;

  xp: number;

  completed: boolean;
};

export type User = {
  id: number;

  telegramId: string;

  username: string | null;

  firstName: string;

  lastName: string | null;

  name: string;

  languageCode: string;

  age: number | null;

  gender: Gender | null;

  weight: number | null;

  height: number | null;

  goal: Goal | null;

  onboardingCompleted: boolean;

  level: number;

  xp: number;

  streak: number;

  history: WorkoutHistoryItem[];

  workouts: number;

  createdAt: string;

  updatedAt: string;
};

export type ProfileData = {
  name: string;

  age: number;

  gender: Gender;

  height: number;

  weight: number;

  goal: string;
};

export type CompleteWorkoutData = {
  id?: string | number;

  workoutId?: string | number;

  name?: string;

  date?: string;

  type?: string;

  duration?: number;

  calories?: number;

  xp?: number;

  startedAt?: string | null;

  completedAt?: string | null;

  sets?: WorkoutSetData[];
};