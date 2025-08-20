// src/lib/utils.js

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Fonction utilitaire pour combiner des classes CSS de manière conditionnelle
 * et fusionner les classes Tailwind pour éviter les conflits.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
