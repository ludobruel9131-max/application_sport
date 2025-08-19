import { v4 as uuidv4 } from 'uuid';

export const EXERCISES = [
  { id: 'ex1', name: 'Développé couché', group: 'Poitrine', subgroup: 'Développé', equipment: 'Barre', difficulty: 'Intermédiaire', durationMin: 1.5, caloriesPerMin: 10, media: "https://images.unsplash.com/photo-1579758654817-f58c42a275f9?q=80&w=2670&auto=format&fit=crop", tips: ['Garder le dos plat', 'Contrôler la descente', 'Ne pas verrouiller les coudes'] },
  { id: 'ex2', name: 'Pompes', group: 'Poitrine', subgroup: 'Poids du corps', equipment: 'Aucun', difficulty: 'Facile', durationMin: 1, caloriesPerMin: 8, media: "https://images.unsplash.com/photo-1549488357-194165d496e5?q=80&w=2670&auto=format&fit=crop", tips: ['Garder le corps droit', 'Descendre le buste près du sol', 'Inspirer à la descente'] },
  { id: 'ex3', name: 'Traction', group: 'Dos', subgroup: 'Poids du corps', equipment: 'Barre de traction', difficulty: 'Difficile', durationMin: 1.5, caloriesPerMin: 12, media: "https://images.unsplash.com/photo-1582234032549-ee4c5c7d853e?q=80&w=2670&auto=format&fit=crop", tips: ['Tirer avec le dos', 'Ne pas se balancer', 'Terminer l\'extension complète'] },
  { id: 'ex4', name: 'Soulevé de terre', group: 'Jambes', subgroup: 'Composé', equipment: 'Barre', difficulty: 'Très difficile', durationMin: 2, caloriesPerMin: 15, media: "https://images.unsplash.com/photo-1614949247345-0d0563f683e9?q=80&w=2670&auto=format&fit=crop", tips: ['Garder le dos droit', 'Pousser avec les jambes', 'Utiliser les hanches'] },
  { id: 'ex5', name: 'Squats', group: 'Jambes', subgroup: 'Poids du corps', equipment: 'Aucun', difficulty: 'Moyen', durationMin: 1.5, caloriesPerMin: 9, media: "https://images.unsplash.com/photo-1582234407074-9efc8f74220b?q=80&w=2670&auto=format&fit=crop", tips: ['Descendre jusqu\'à ce que les cuisses soient parallèles au sol', 'Garder les genoux en ligne avec les pieds', 'Ne pas se pencher en avant'] },
  { id: 'ex6', name: 'Fentes', group: 'Jambes', subgroup: 'Poids du corps', equipment: 'Aucun', difficulty: 'Moyen', durationMin: 1.5, caloriesPerMin: 8, media: "https://images.unsplash.com/photo-1601007957796-03f191b40285?q=80&w=2670&auto=format&fit=crop", tips: ['Faire un grand pas en avant', 'Garder le tronc droit', 'Ne pas laisser le genou dépasser la pointe du pied'] },
  { id: 'ex7', name: 'Développé militaire', group: 'Épaules', subgroup: 'Développé', equipment: 'Haltères', difficulty: 'Intermédiaire', durationMin: 1, caloriesPerMin: 9, media: "https://images.unsplash.com/photo-1585250462708-3015a5f1e813?q=80&w=2670&auto=format&fit=crop", tips: ['Contrôler la charge', 'Garder le dos droit', 'Ne pas archer le dos'] },
  { id: 'ex8', name: 'Crunch', group: 'Abdominaux', subgroup: 'Poids du corps', equipment: 'Aucun', difficulty: 'Facile', durationMin: 1, caloriesPerMin: 7, media: "https://images.unsplash.com/photo-1611091565551-b844f2434440?q=80&w=2670&auto=format&fit=crop", tips: ['Concentrer sur la contraction', 'Ne pas tirer sur la nuque', 'Expirer à la montée'] },
  { id: 'ex9', name: 'Course à pied', group: 'Cardio', subgroup: 'Cardio', equipment: 'Aucun', difficulty: 'Facile', durationMin: 30, caloriesPerMin: 10, media: "https://images.unsplash.com/photo-1574680096145-af9074092476?q=80&w=2670&auto=format&fit=crop", tips: ['Avoir une bonne paire de chaussures', 'S\'hydrater', 'Écouter son corps'] },
  { id: 'ex10', name: 'Burpees', group: 'Full Body', subgroup: 'Cardio', equipment: 'Aucun', difficulty: 'Très difficile', durationMin: 3, caloriesPerMin: 18, media: "https://images.unsplash.com/photo-1598426618485-61266b8d234a?q=80&w=2670&auto=format&fit=crop", tips: ['Se concentrer sur la fluidité', 'Garder l\'explosivité', 'Respirer profondément'] },
  { id: 'ex11', name: 'Soulevé de terre roumain', group: 'Jambes', subgroup: 'Ischios', equipment: 'Haltères', difficulty: 'Intermédiaire', durationMin: 1.5, caloriesPerMin: 9, media: "https://images.unsplash.com/photo-1593079929281-220a271701ed?q=80&w=2670&auto=format&fit=crop", tips: ['Garder les jambes tendues', 'Se pencher en avant avec le dos droit', 'Ressentir la tension dans les ischio-jambiers'] },
  { id: 'ex12', name: 'Développé militaire à la machine', group: 'Épaules', subgroup: 'Développé', equipment: 'Machine', difficulty: 'Facile', durationMin: 1.5, caloriesPerMin: 8, media: "https://images.unsplash.com/photo-1601338804934-2e90e72f9d6a?q=80&w=2670&auto=format&fit=crop", tips: ['Ajuster la machine à ta taille', 'Pousser vers le haut', 'Ne pas donner d\'à-coups'] },
  { id: 'ex13', name: 'Rameur', group: 'Dos', subgroup: 'Tirage', equipment: 'Machine', difficulty: 'Intermédiaire', durationMin: 10, caloriesPerMin: 12, media: "https://images.unsplash.com/photo-1579758654817-f58c42a275f9?q=80&w=2670&auto=format&fit=crop", tips: ['Utiliser les jambes', 'Tirer avec le dos', 'Garder un rythme régulier'] },
  { id: 'ex14', name: 'Extensions triceps', group: 'Bras', subgroup: 'Triceps', equipment: 'Câble', difficulty: 'Facile', durationMin: 1, caloriesPerMin: 7, media: "https://images.unsplash.com/photo-1548690311-66723b7b120c?q=80&w=2670&auto=format&fit=crop", tips: ['Garder les coudes immobiles', 'Concentrer sur le triceps', 'Ne pas bouger le buste'] },
  { id: 'ex15', name: 'Flexion biceps', group: 'Bras', subgroup: 'Biceps', equipment: 'Haltères', difficulty: 'Facile', durationMin: 1, caloriesPerMin: 7, media: "https://images.unsplash.com/photo-1577741893902-8a9d16b3b55a?q=80&w=2670&auto=format&fit=crop", tips: ['Contrôler la descente', 'Garder les coudes près du corps', 'Ne pas utiliser le dos'] },
  { id: 'ex16', name: 'Fente bulgare', group: 'Jambes', subgroup: 'Ischios', equipment: 'Haltères', difficulty: 'Difficile', durationMin: 1.5, caloriesPerMin: 10, media: "https://images.unsplash.com/photo-1616216447814-a95727196a66?q=80&w=2670&auto=format&fit=crop", tips: ['Garder le tronc droit', 'Descendre avec la jambe avant', 'Ne pas mettre de poids sur la jambe arrière'] },
];


export const defaultProfile = {
  name: "Utilisateur",
  age: 30,
  weightKg: 75,
  heightCm: 180,
  goal: "Perte de poids",
  level: "Débutant"
};

export const levels = ["Débutant", "Intermédiaire", "Avancé", "Expert"];
export const goals = ["Perte de poids", "Prise de masse", "Force", "Endurance"];
export const equipmentOptions = [...new Set(EXERCISES.map(e => e.equipment))].sort();

export const defaultState = {
  profile: defaultProfile,
  favorites: [],
  customWorkouts: [],
  sessions: [],
  stats: {
    caloriesByDay: {}
  },
  settings: {},
  calendar: {}
};

export const storage = {
  get: (key, fallback) => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return fallback;
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(e);
    }
  }
};

export const uid = () => Math.random().toString(36).slice(2, 9);

export const bmi = (kg, cm) => (kg / Math.pow(cm / 100, 2)).toFixed(1);

export const formatDate = (date) => date.toISOString().slice(0, 10);

export const caloriesForExercise = (exercise, minutes) => {
  return Math.round((exercise.caloriesPerMin || 10) * minutes);
};

export const generateAutoWorkout = (profile, options = {}) => {
  const { goal, level } = profile;
  const { equipment = [] } = options;

  const relevantExercises = EXERCISES.filter(ex => {
    const hasEquipment = equipment.length === 0 || equipment.includes(ex.equipment);
    return hasEquipment;
  });

  const blocks = [];
  let totalDuration = 0;
  const targetDuration = 45;

  while (totalDuration < targetDuration) {
    const randomEx = relevantExercises[Math.floor(Math.random() * relevantExercises.length)];
    if (!randomEx) break;
    
    const workMin = Math.max(1, Math.round(Math.random() * 3));
    const restSec = Math.round(Math.random() * 60) + 30;
    const rounds = Math.max(1, Math.round(Math.random() * 3));
    
    blocks.push({
      id: uid(),
      exerciseId: randomEx.id,
      workMin,
      restSec,
      rounds
    });

    totalDuration += (workMin * rounds) + (restSec * (rounds - 1)) / 60;
  }
  
  return {
    name: "Séance rapide",
    blocks,
  };
};
