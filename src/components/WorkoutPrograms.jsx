import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';

/**
 * Ce composant affiche une vue hebdomadaire des programmes d'entraînement.
 * Pour l'instant, les données sont en dur pour simuler le contenu.
 * Vous pouvez ajouter un bouton pour créer un nouveau programme.
 */
const WorkoutPrograms = () => {
  // Données en dur pour simuler les programmes de la semaine
  const weeklyWorkouts = [
    {
      day: 'Lundi',
      name: 'Haut du corps',
      exercises: [
        { name: 'Développé couché', sets: 4, reps: 8 },
        { name: 'Tractions', sets: 4, reps: 10 },
        { name: 'Développé militaire', sets: 3, reps: 12 },
        { name: 'Biceps curls', sets: 3, reps: 15 },
      ],
    },
    {
      day: 'Mardi',
      name: 'Bas du corps',
      exercises: [
        { name: 'Squat', sets: 4, reps: 8 },
        { name: 'Soulevé de terre', sets: 4, reps: 6 },
        { name: 'Fentes', sets: 3, reps: 10 },
        { name: 'Leg press', sets: 3, reps: 12 },
      ],
    },
    {
      day: 'Mercredi',
      name: 'Repos',
      exercises: [],
    },
    {
      day: 'Jeudi',
      name: 'Haut du corps (léger)',
      exercises: [
        { name: 'Pompes', sets: 3, reps: 'jusqu\'à l\'échec' },
        { name: 'Rameur inversé', sets: 3, reps: 12 },
        { name: 'Élévations latérales', sets: 3, reps: 15 },
      ],
    },
    {
      day: 'Vendredi',
      name: 'Bas du corps (léger)',
      exercises: [
        { name: 'Goblet squat', sets: 3, reps: 12 },
        { name: 'Leg extension', sets: 3, reps: 15 },
        { name: 'Leg curl', sets: 3, reps: 15 },
      ],
    },
    {
      day: 'Samedi',
      name: 'Cardio & Abs',
      exercises: [
        { name: 'Course', sets: 1, reps: '30 min' },
        { name: 'Gainage', sets: 3, reps: '45s' },
        { name: 'Crunches', sets: 3, reps: 20 },
      ],
    },
    {
      day: 'Dimanche',
      name: 'Repos',
      exercises: [],
    },
  ];

  const handleAddProgram = () => {
    toast.info("La fonctionnalité pour ajouter un programme sera bientôt disponible !");
  };

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Programmes de la semaine</h2>
        <Button onClick={handleAddProgram} className="flex gap-2 items-center">
          <Plus className="h-4 w-4" />
          Ajouter un programme
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weeklyWorkouts.map((workout, index) => (
          <Card key={index} className="flex flex-col h-full">
            <CardHeader>
              <CardTitle className="text-xl">{workout.day}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">{workout.name}</h3>
                {workout.exercises.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {workout.exercises.map((exercise, idx) => (
                      <li key={idx} className="text-sm">
                        <span className="font-medium">{exercise.name}</span>: {exercise.sets} séries de {exercise.reps} répétitions
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-zinc-500">Jour de repos bien mérité !</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutPrograms;
