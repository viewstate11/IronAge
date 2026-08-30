export type ProgressExercise = {
  exerciseId?: string;
  exerciseName: string;

  sets: number;
  reps: number;

  weight?: number;
  duration?: number;

  volume?: number;
};

export type ProgressWorkout = {
  id: string;

  date: string;

  workoutId?: string;
  workoutName: string;

  durationMinutes: number;

  exercises: ProgressExercise[];

  totalVolume: number;

  caloriesBurned?: number;

  completed: boolean;

  xp: number;
};

export type ProgressDay = {
  date: string;

  workouts: ProgressWorkout[];

  totalWorkouts: number;

  totalVolume: number;

  xp: number;
};

export type ProgressHistory = ProgressDay[];

export type WeeklyProgress = {
  date: string;

  workouts: number;

  volume: number;

  xp: number;
};

export type PersonalBest = {
  exerciseName: string;

  weight: number;

  reps: number;

  volume: number;

  date: string;
};

export type ProgressStats = {
  totalWorkouts: number;

  totalVolume: number;

  totalXp: number;

  currentStreak: number;

  longestStreak: number;

  level: number;

  currentLevelXp: number;

  nextLevelXp: number;

  weeklyWorkouts: number;

  weeklyVolume: number;

  averageWorkoutDuration: number;

  personalBests: PersonalBest[];
};

export type ProgressEngine = {
  stats: ProgressStats;

  weekly: WeeklyProgress[];

  history: ProgressDay[];
};