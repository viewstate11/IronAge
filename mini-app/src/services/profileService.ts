import type { User } from "../types/user";

export type Profile = {
  name: string;
  xp: number;
  level: number;
  workouts: number;
  streak: number;
};

export function getProfile(user: User): Profile {
  return {
    name: user.name,
    xp: user.xp,
    level: user.level,
    workouts: user.workouts,
    streak: user.streak,
  };
}