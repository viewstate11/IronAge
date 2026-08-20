export type Exercise = {
  name: string;
  emoji: string;
  sets: number;
  reps: number;
};

export type WorkoutProgram = {
  id: string;
  name: string;
  duration: number;
  exercises: Exercise[];
};