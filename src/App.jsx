import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Calendar, List } from 'lucide-react';

/**
 * Programme d'entraînement fixe pour l'exemple.
 * Ce programme est utilisé lorsque l'API n'est pas disponible.
 */
const fixedWorkoutData = [
  {
    "week": 1,
    "description": "Cette semaine est axée sur l'établissement d'une base solide et la familiarisation avec les mouvements. Concentrez-vous sur la forme et la connexion esprit-muscle.",
    "workouts": [
      {
        "day": "Lundi",
        "exercises": [
          { "name": "Squats", "sets": 3, "reps": "8-12" },
          { "name": "Développé couché", "sets": 3, "reps": "8-12" },
          { "name": "Tractions (assistées si nécessaire)", "sets": 3, "reps": "6-10" },
          { "name": "Rowing barre", "sets": 3, "reps": "8-12" },
          { "name": "Planche", "sets": 3, "reps": "45s" }
        ]
      },
      { "day": "Mardi", "exercises": [] },
      {
        "day": "Mercredi",
        "exercises": [
          { "name": "Soulevé de terre roumain", "sets": 3, "reps": "10-15" },
          { "name": "Fentes", "sets": 3, "reps": "10-15 (par jambe)" },
          { "name": "Développé épaules", "sets": 3, "reps": "8-12" },
          { "name": "Élévations latérales", "sets": 3, "reps": "12-15" },
          { "name": "Gainage latéral", "sets": 3, "reps": "30s (par côté)" }
        ]
      },
      { "day": "Jeudi", "exercises": [] },
      {
        "day": "Vendredi",
        "exercises": [
          { "name": "Curls biceps", "sets": 3, "reps": "10-15" },
          { "name": "Extensions triceps", "sets": 3, "reps": "10-15" },
          { "name": "Presse à cuisses", "sets": 3, "reps": "12-15" },
          { "name": "Mollets assis", "sets": 3, "reps": "15-20" },
          { "name": "Crunchs", "sets": 3, "reps": "20" }
        ]
      },
      { "day": "Samedi", "exercises": [] },
      { "day": "Dimanche", "exercises": [] }
    ]
  },
  {
    "week": 2,
    "description": "Augmentation du volume d'entraînement pour stimuler la croissance musculaire. Visez à augmenter les charges ou le nombre de répétitions par rapport à la semaine précédente.",
    "workouts": [
      {
        "day": "Lundi",
        "exercises": [
          { "name": "Squats", "sets": 4, "reps": "8-10" },
          { "name": "Développé couché", "sets": 4, "reps": "8-10" },
          { "name": "Tractions (assistées)", "sets": 4, "reps": "8-10" },
          { "name": "Rowing barre", "sets": 4, "reps": "8-10" },
          { "name": "Planche", "sets": 4, "reps": "45s" }
        ]
      },
      { "day": "Mardi", "exercises": [] },
      {
        "day": "Mercredi",
        "exercises": [
          { "name": "Soulevé de terre roumain", "sets": 4, "reps": "10-12" },
          { "name": "Fentes", "sets": 4, "reps": "10-12 (par jambe)" },
          { "name": "Développé épaules", "sets": 4, "reps": "8-10" },
          { "name": "Élévations latérales", "sets": 4, "reps": "10-12" },
          { "name": "Gainage latéral", "sets": 4, "reps": "30s (par côté)" }
        ]
      },
      { "day": "Jeudi", "exercises": [] },
      {
        "day": "Vendredi",
        "exercises": [
          { "name": "Curls biceps", "sets": 4, "reps": "10-12" },
          { "name": "Extensions triceps", "sets": 4, "reps": "10-12" },
          { "name": "Presse à cuisses", "sets": 4, "reps": "10-12" },
          { "name": "Mollets assis", "sets": 4, "reps": "12-15" },
          { "name": "Crunchs", "sets": 4, "reps": "15-20" }
        ]
      },
      { "day": "Samedi", "exercises": [] },
      { "day": "Dimanche", "exercises": [] }
    ]
  },
  {
    "week": 3,
    "description": "Cette semaine est plus intense pour choquer les muscles et favoriser la croissance. Visez à augmenter les charges tout en maintenant une bonne forme.",
    "workouts": [
      {
        "day": "Lundi",
        "exercises": [
          { "name": "Squats", "sets": 4, "reps": "6-8" },
          { "name": "Développé couché", "sets": 4, "reps": "6-8" },
          { "name": "Tractions (assistées)", "sets": 4, "reps": "6-8" },
          { "name": "Rowing barre", "sets": 4, "reps": "6-8" },
          { "name": "Planche", "sets": 4, "reps": "60s" }
        ]
      },
      { "day": "Mardi", "exercises": [] },
      {
        "day": "Mercredi",
        "exercises": [
          { "name": "Soulevé de terre roumain", "sets": 4, "reps": "8-10" },
          { "name": "Fentes", "sets": 4, "reps": "8-10 (par jambe)" },
          { "name": "Développé épaules", "sets": 4, "reps": "6-8" },
          { "name": "Élévations latérales", "sets": 4, "reps": "8-10" },
          { "name": "Gainage latéral", "sets": 4, "reps": "45s (par côté)" }
        ]
      },
      { "day": "Jeudi", "exercises": [] },
      {
        "day": "Vendredi",
        "exercises": [
          { "name": "Curls biceps", "sets": 4, "reps": "8-10" },
          { "name": "Extensions triceps", "sets": 4, "reps": "8-10" },
          { "name": "Presse à cuisses", "sets": 4, "reps": "8-10" },
          { "name": "Mollets assis", "sets": 4, "reps": "10-12" },
          { "name": "Crunchs", "sets": 4, "reps": "15" }
        ]
      },
      { "day": "Samedi", "exercises": [] },
      { "day": "Dimanche", "exercises": [] }
    ]
  },
  {
    "week": 4,
    "description": "Une semaine de 'deload' ou de récupération active pour permettre à votre corps de se reconstruire et de se préparer au prochain cycle. Baissez les charges et le volume tout en maintenant la forme.",
    "workouts": [
      {
        "day": "Lundi",
        "exercises": [
          { "name": "Squats", "sets": 2, "reps": "8-12" },
          { "name": "Développé couché", "sets": 2, "reps": "8-12" },
          { "name": "Tractions (assistées)", "sets": 2, "reps": "8-12" },
          { "name": "Rowing barre", "sets": 2, "reps": "8-12" },
          { "name": "Planche", "sets": 2, "reps": "45s" }
        ]
      },
      { "day": "Mardi", "exercises": [] },
      {
        "day": "Mercredi",
        "exercises": [
          { "name": "Soulevé de terre roumain", "sets": 2, "reps": "10-15" },
          { "name": "Fentes", "sets": 2, "reps": "10-15 (par jambe)" },
          { "name": "Développé épaules", "sets": 2, "reps": "8-12" },
          { "name": "Élévations latérales", "sets": 2, "reps": "12-15" },
          { "name": "Gainage latéral", "sets": 2, "reps": "30s (par côté)" }
        ]
      },
      { "day": "Jeudi", "exercises": [] },
      {
        "day": "Vendredi",
        "exercises": [
          { "name": "Curls biceps", "sets": 2, "reps": "10-15" },
          { "name": "Extensions triceps", "sets": 2, "reps": "10-15" },
          { "name": "Presse à cuisses", "sets": 2, "reps": "12-15" },
          { "name": "Mollets assis", "sets": 2, "reps": "15-20" },
          { "name": "Crunchs", "sets": 2, "reps": "20" }
        ]
      },
      { "day": "Samedi", "exercises": [] },
      { "day": "Dimanche", "exercises": [] }
    ]
  }
];

/**
 * Fonction pure pour générer le nouveau programme d'entraînement en fonction des jours de repos.
 * @param {array} dataToUse - Les données de programme à utiliser (le programme fixe dans ce cas).
 * @param {array} restDays - Les indices des jours de repos.
 * @returns {array} Le programme d'entraînement mis à jour.
 */
const getNewWorkoutLayout = (dataToUse, restDays) => {
  if (!dataToUse) return null;

  const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const trainingDaysCount = 3;
  const availableTrainingDays = daysOfWeek.filter((_, index) => !restDays.includes(index));

  if (availableTrainingDays.length !== trainingDaysCount) {
      console.warn("Le nombre de jours de repos ne permet pas un programme de 3 entraînements par semaine. Le programme par défaut sera affiché.");
      // Retourne une copie des données originales pour ne pas les modifier
      return JSON.parse(JSON.stringify(dataToUse));
  }

  const newWorkoutData = dataToUse.map(week => {
    const newWorkouts = [];
    let workoutIndex = 0;
    
    for (let i = 0; i < 7; i++) {
      if (restDays.includes(i)) {
        newWorkouts.push({ day: daysOfWeek[i], exercises: [] }); // Jour de repos
      } else {
        // Associe les entraînements du programme fixe aux jours d'entraînement disponibles.
        if (workoutIndex < week.workouts.length) {
           newWorkouts.push({ ...week.workouts[workoutIndex], day: daysOfWeek[i] });
           workoutIndex++;
        }
      }
    }
    return { ...week, workouts: newWorkouts };
  });
  return newWorkoutData;
};

/**
 * Composant principal de l'application.
 * Gère l'état de l'application, le formulaire de saisie et l'affichage du programme d'entraînement.
 */
function App() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('recomposition musculaire (perte de graisse et gain musculaire esthétique)');
  const [workoutData, setWorkoutData] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [view, setView] = useState('list'); // 'list' ou 'calendar'
  const [restDays, setRestDays] = useState([0, 6]); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi

  // Met à jour le programme lorsque les jours de repos changent.
  useEffect(() => {
    if (workoutData) {
      // Re-génère le layout du programme pour refléter les nouveaux jours de repos.
      setWorkoutData(getNewWorkoutLayout(fixedWorkoutData, restDays));
    }
  }, [restDays]);

  /**
   * Gère la soumission du formulaire et affiche le programme d'entraînement fixe.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // Charge directement le programme d'entraînement fixe.
    const initialWorkoutLayout = getNewWorkoutLayout(fixedWorkoutData, restDays);
    setWorkoutData(initialWorkoutLayout);
    setIsFormVisible(false);
  };

  /**
   * Gère le basculement d'un jour de repos.
   * @param {number} dayIndex - L'index du jour de la semaine (0-6).
   */
  const handleToggleRestDay = (dayIndex) => {
    setRestDays(prevRestDays => {
      if (prevRestDays.includes(dayIndex)) {
        return prevRestDays.filter(day => day !== dayIndex);
      } else {
        // Le programme fixe a 3 jours d'entraînement, on ne peut pas avoir plus de 4 jours de repos.
        if (prevRestDays.length >= 4) {
          console.warn("Vous ne pouvez pas sélectionner plus de 4 jours de repos avec ce programme.");
          return prevRestDays;
        }
        return [...prevRestDays, dayIndex].sort((a, b) => a - b);
      }
    });
  };

  const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-amber-100 p-8">
      {isFormVisible && (
        <div className="max-w-xl mx-auto w-full">
          <Card className="bg-zinc-900 border-zinc-800 text-amber-100 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Créez votre programme sur mesure</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Votre âge (ans)</Label>
                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-amber-100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Taille (cm)</Label>
                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-amber-100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-amber-100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Votre objectif</Label>
                  <Input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="bg-zinc-800 border-zinc-700 text-amber-100" />
                </div>
                <div className="flex justify-center">
                  <Button type="submit" className="w-full md:w-auto bg-amber-600 text-zinc-950 hover:bg-amber-700 font-bold py-2 px-4 rounded-lg shadow-lg">
                    Générer mon programme
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {workoutData && !isFormVisible && (
        <div className="space-y-8">
          <div className="flex justify-center mb-6">
            <Button onClick={() => setView('list')} className={`mr-2 ${view === 'list' ? 'bg-amber-600' : 'bg-zinc-700'} text-zinc-950 hover:bg-amber-700 font-bold`}>
              <List className="mr-2" /> Vue en liste
            </Button>
            <Button onClick={() => setView('calendar')} className={`${view === 'calendar' ? 'bg-amber-600' : 'bg-zinc-700'} text-zinc-950 hover:bg-amber-700 font-bold`}>
              <Calendar className="mr-2" /> Vue calendrier
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <h3 className="text-xl font-bold w-full text-center mb-2">Jours de repos</h3>
            {daysOfWeek.map((day, index) => (
              <Button
                key={index}
                onClick={() => handleToggleRestDay(index)}
                className={`w-28 ${restDays.includes(index) ? 'bg-zinc-800 border-2 border-red-500 text-red-500' : 'bg-zinc-700 text-amber-100'} hover:bg-zinc-600`}
              >
                {day}
              </Button>
            ))}
          </div>

          {view === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {workoutData.map((week, index) => (
                <Card key={index} className="bg-zinc-900 border-zinc-800 text-amber-100 flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-amber-100">Semaine {week.week}</CardTitle>
                    <p className="text-sm text-zinc-400">{week.description}</p>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-between">
                    {week.workouts.map((day, dayIndex) => (
                      <div key={dayIndex} className="mb-4 last:mb-0">
                        <h3 className="text-lg font-semibold text-amber-100">{day.day}</h3>
                        <ul className="list-disc list-inside space-y-1 mt-1">
                          {day.exercises.length > 0 ? (
                            day.exercises.map((exercise, exerciseIndex) => (
                              <li key={exerciseIndex} className="text-sm text-amber-200">
                                <span className="font-medium">{exercise.name}</span>: {exercise.sets} séries de {exercise.reps} répétitions
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-zinc-400">Jour de repos</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {view === 'calendar' && (
            <div className="space-y-6">
              {workoutData.map((week, weekIndex) => (
                <div key={weekIndex}>
                  <h2 className="text-2xl font-bold mb-4 text-center">Semaine {week.week}</h2>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day, dayIndex) => (
                      <Card key={dayIndex} className="bg-zinc-900 border-zinc-800 p-4 flex flex-col h-48 overflow-hidden">
                        <h3 className="font-semibold text-center mb-2">{day}</h3>
                        <div className="flex-1 overflow-auto">
                          {week.workouts[dayIndex]?.exercises.length > 0 ? (
                            <ul className="list-none space-y-1">
                              {week.workouts[dayIndex].exercises.map((exercise, exIndex) => (
                                <li key={exIndex} className="text-sm">
                                  <span className="font-medium text-amber-200">{exercise.name}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center text-zinc-500 text-sm italic">Repos</div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button onClick={() => setIsFormVisible(true)} className="bg-amber-600 text-zinc-950 hover:bg-amber-700 font-bold py-2 px-4 rounded-lg shadow-lg">
              Générer un nouveau programme
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
