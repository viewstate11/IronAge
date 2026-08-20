import type { User } from "../types/user";

const USER_KEY = "ironage_user";

export function loadUser(): Partial<User> | null {
  const saved = localStorage.getItem(USER_KEY);

  if (!saved) {
    return null;
  }

  try {
    return JSON.parse(saved) as Partial<User>;
  } catch {
    return null;
  }
}

export function saveUser(user: User): void {
  localStorage.setItem(
    USER_KEY,
    JSON.stringify(user)
  );
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}