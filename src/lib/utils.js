import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Assurez-vous que les variables exerciseMET, weight et duration sont définies
// d'où cette fonction est appelée.
export function caloriesForExercise(duration, weight, exerciseMET) {
  // Cette formule est une estimation basée sur les MET (Metabolic Equivalent of Task).
  const calories = 0.0175 * exerciseMET * weight * duration;
  return calories;
}
