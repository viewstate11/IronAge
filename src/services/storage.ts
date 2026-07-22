import { user } from "../data/user";

const STORAGE_KEY = "ironage-user";

export function getUser() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    return JSON.parse(saved);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
}

export function saveUser(data: any) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}