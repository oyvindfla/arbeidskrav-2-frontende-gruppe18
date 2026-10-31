import { useState } from "react";
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const update = (next: T | ((previous: T) => T)) =>
    setValue((previous) => {
      const result =
        typeof next === "function"
          ? (next as (previous: T) => T)(previous)
          : next;
      localStorage.setItem(key, JSON.stringify(result));
      return result;
    });
  return [value, update] as const;
}
export interface Profile {
  name: string;
  email: string;
  role: string;
}
export interface Booking {
  trip: number;
  date: string;
  status: "interest" | "joined";
}
export interface Post {
  id: string;
  trip: number;
  name: string;
  text: string;
  stars?: number;
}
export interface Ad {
  id: string;
  title: string;
  body: string;
  url: string;
  image: string;
  category: string;
  from: string;
  until: string;
  status: "pending" | "approved" | "rejected";
  views: number;
  clicks: number;
}
export interface SavedRoute {
  id: string;
  name: string;
  points: [number, number][];
}
