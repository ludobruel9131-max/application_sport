import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'react-toastify';

/**
 * Ce composant permet à l'utilisateur de créer un entraînement personnalisé.
 * Il inclut un formulaire modal pour définir le nom de l'entraînement et ajouter des exercices.
 */
const CustomWorkout = () => {
  const [open, setOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([]);
  const [currentExercise, setCurrentExercise] = useState({ name: '', sets: '', reps: '' });

  const handleAddExercise = () => {
    if (currentExercise.name && currentExercise.sets && currentExercise.reps) {
      setExercises([...exercises, currentExercise]);
      setCurrentExercise({ name: '', sets: '', reps: '' });
      toast.success("Exercice ajouté !");
    } else {
      toast.error("Veuillez remplir tous les champs de l'exercice.");
    }
  };

  const handleSaveWorkout = () => {
    if (workoutName && exercises.length > 0) {
      console.log('Entraînement sauvegardé :', { workoutName, exercises });
      toast.success("Entraînement sauvegardé !");
      setOpen(false);
    } else {
      toast.error("Veuillez donner un nom et ajouter au moins un exercice.");
    }
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      setWorkoutName('');
      setExercises([]);
      setCurrentExercise({ name: '', sets: '', reps: '' });
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Créer un entraînement</Button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un entraînement personnalisé</DialogTitle>
            <DialogDescription>
              Définissez le nom de votre entraînement et ajoutez vos exercices.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="workoutName" className="text-right">
                Nom
              </Label>
              <Input
                id="workoutName"
                value={workoutName}
                onChange={(e) => setWorkoutName(e.target.value)}
                className="col-span-3"
              />
            </div>

            <h3 className="text-lg font-medium mt-4">Exercices</h3>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="exerciseName" className="text-right">Nom</Label>
              <Input
                id="exerciseName"
                value={currentExercise.name}
                onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sets" className="text-right">Séries</Label>
              <Input
                id="sets"
                type="number"
                value={currentExercise.sets}
                onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reps" className="text-right">Répétitions</Label>
              <Input
                id="reps"
                type="number"
                value={currentExercise.reps}
                onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                className="col-span-3"
              />
            </div>
            <Button onClick={handleAddExercise}>Ajouter l'exercice</Button>

            {exercises.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Exercices ajoutés :</h4>
                <ul className="list-disc list-inside">
                  {exercises.map((ex, index) => (
                    <li key={index}>{`${ex.name}: ${ex.sets} séries de ${ex.reps} répétitions`}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSaveWorkout}>Sauvegarder l'entraînement</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CustomWorkout;
