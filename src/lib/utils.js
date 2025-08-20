import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Une fonction utilitaire qui combine des classes de manière conditionnelle et fusionne les classes Tailwind.
 * C'est une pratique courante dans les projets qui utilisent des composants UI.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
