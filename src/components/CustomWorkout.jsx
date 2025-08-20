import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { PlusCircle, Pen, Trash2 } from "lucide-react";
import { uid } from "../data";
import { useApp } from "../App";
import { toast } from "react-toastify";

function CustomWorkout() {
  const { state, setState } = useApp();
  const { id } = useParams();
  const navigate = useNavigate();

  const workout = state.customWorkouts.find((w) => w.id === id);

  if (!workout) {
    return <div>Programme non trouvé</div>;
  }

  const [editMode, setEditMode] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseReps, setExerciseReps] = useState("");
  const [exerciseWeight, setExerciseWeight] = useState("");

  const handleAddExercise = () => {
    if (exerciseName && exerciseReps && exerciseWeight) {
      const newExercise = {
        id: uid(),
        name: exerciseName,
        blocks: [{ reps: exerciseReps, weight: exerciseWeight }],
      };
      const updatedWorkout = {
        ...workout,
        exercises: [...workout.exercises, newExercise],
      };
      setState((s) => ({
        ...s,
        customWorkouts: s.customWorkouts.map((w) => (w.id === id ? updatedWorkout : w)),
      }));
      setExerciseName("");
      setExerciseReps("");
      setExerciseWeight("");
      toast.success("Exercice ajouté !");
    }
  };

  const handleRemoveExercise = (exId) => {
    const updatedWorkout = {
      ...workout,
      exercises: workout.exercises.filter((ex) => ex.id !== exId),
    };
    setState((s) => ({
      ...s,
      customWorkouts: s.customWorkouts.map((w) => (w.id === id ? updatedWorkout : w)),
    }));
    toast.info("Exercice retiré.");
  };

  const handleStartWorkout = () => {
    setState((s) => ({
      ...s,
      currentWorkout: workout,
      activeSession: {
        workout: workout,
        currentExerciseIndex: 0,
        currentSetIndex: 0,
        timer: 0,
        isRunning: false,
        finished: false,
      },
    }));
    navigate("/active-session");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">{workout.name}</h2>
      <p className="text-zinc-400">{workout.description}</p>

      <Button onClick={handleStartWorkout}>Commencer ce programme</Button>

      <div className="flex items-center gap-2">
        <Button onClick={() => setEditMode(!editMode)}>{editMode ? "Terminer" : "Modifier"}</Button>
      </div>

      <div className="space-y-4">
        {workout.exercises.length === 0 ? (
          <p className="text-zinc-400">Aucun exercice dans ce programme.</p>
        ) : (
          workout.exercises.map((exercise) => (
            <Card key={exercise.id} className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-medium">{exercise.name}</CardTitle>
                {editMode && (
                  <Button onClick={() => handleRemoveExercise(exercise.id)} variant="ghost" className="p-2">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {exercise.blocks.map((block, index) => (
                  <div key={index} className="flex gap-2">
                    <p>Série {index + 1}:</p>
                    <p>{block.reps} reps</p>
                    <p>{block.weight} kg</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {editMode && (
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle>Ajouter un exercice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input placeholder="Nom de l'exercice" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
            <Input placeholder="Nombre de répétitions" value={exerciseReps} onChange={(e) => setExerciseReps(e.target.value)} type="number" />
            <Input placeholder="Poids (kg)" value={exerciseWeight} onChange={(e) => setExerciseWeight(e.target.value)} type="number" />
            <Button onClick={handleAddExercise} className="w-full">
              Ajouter
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default CustomWorkout;
