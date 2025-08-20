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

export function bmi(weight, height) {
  // BMI = poids (kg) / taille (m)²
  const heightInMeters = height / 100;
  const bmiValue = weight / (heightInMeters * heightInMeters);
  return bmiValue;
}
