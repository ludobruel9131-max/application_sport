import { v4 as uuidv4 } from 'uuid';
import { addDays, format } from 'date-fns';

export const formatDate = (date) => format(date, 'yyyy-MM-dd');

export const defaultProfile = {
  name: "Utilisateur",
  level: "intermédiaire",
  goal: "perte-de-poids",
  weight: 70,
  height: 175,
  gender: "homme",
  age: 30,
  activityLevel: "modéré",
  calories: 2000,
  macros: {
    protein: 150,
    carbs: 200,
    fat: 60,
  },
  customWorkouts: [],
  favoriteExercises: [],
};

export const levels = [
  "débutant",
  "intermédiaire",
  "avancé"
];

export const goals = [
  "perte-de-poids",
  "gain-musculaire",
  "endurance"
];

export const equipmentOptions = [
  "haltères",
  "barre",
  "kettlebell",
  "poids-de-corps"
];

export const uid = () => uuidv4();

export const caloriesForExercise = (exercise) => {
  const calories = exercise.caloriesPerHour;
  return calories * 0.5;
};

export const generateAutoWorkout = (profile) => {
  const workoutName = `Programme ${profile.goal}`;
  const exercises = EXERCISES.filter(ex => ex.equipment.includes(profile.level)).slice(0, 5);

  const workout = {
    id: uid(),
    name: workoutName,
    exercises: exercises.map(ex => ({
      ...ex,
      blocks: [
        { reps: 10, weight: 20 },
        { reps: 8, weight: 25 },
        { reps: 6, weight: 30 },
      ],
    })),
  };
  return workout;
};

export const EXERCISES = [
  { id: uid(), name: "Squats", equipment: ["poids-de-corps", "haltères"], caloriesPerHour: 400 },
  { id: uid(), name: "Pompes", equipment: ["poids-de-corps"], caloriesPerHour: 350 },
  { id: uid(), name: "Soulevé de terre", equipment: ["barre"], caloriesPerHour: 600 },
  { id: uid(), name: "Fentes", equipment: ["poids-de-corps", "haltères"], caloriesPerHour: 450 },
  { id: uid(), name: "Développé couché", equipment: ["barre"], caloriesPerHour: 500 },
];
