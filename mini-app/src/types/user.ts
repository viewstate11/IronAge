export type WorkoutHistoryItem = {
  id: string;
  name: string;
  duration: number;
  xp: number;
  date: string;
};

export type User = {
  name: string;

  age: number;
  gender: string;

  weight: number;
  height: number;

  goal: string;

  level: number;
  xp: number;

  workouts: number;
  streak: number;

  history: WorkoutHistoryItem[];
};