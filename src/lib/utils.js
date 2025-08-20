// src/lib/utils.js

/**
 * Une fonction utilitaire qui combine des classes de manière conditionnelle.
 * Cette version ne nécessite aucune dépendance externe et résout le problème de l'écran noir.
 */
export function cn(...inputs) {
  let classes = [];
  for (const input of inputs) {
    if (typeof input === 'string' && input.trim() !== '') {
      classes.push(input.trim());
    } else if (Array.isArray(input)) {
      classes.push(cn(...input));
    } else if (typeof input === 'object' && input !== null) {
      for (const key in input) {
        if (input[key]) {
          classes.push(key.trim());
        }
      }
    }
  }
  return classes.join(' ');
}
