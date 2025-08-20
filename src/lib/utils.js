import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function caloriesForExercise(duration, weight, exerciseMET) {
  const calories = 0.0175 * exerciseMET * weight * duration;
  return calories;
}

export function formatDate(date) {
  return format(new Date(date), "PPP");
}
