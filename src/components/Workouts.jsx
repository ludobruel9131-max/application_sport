import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronRight } from "lucide-react";
import { useApp } from "../App";
import { EXERCISES, generateAutoWorkout } from "../data";

const WorkoutCard = ({ workout }) => (
  <Card className="bg-zinc-900/60 border-zinc-800">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{workout.name}</CardTitle>
      <Link to={`/custom/${workout.id}`} className="text-zinc-400 hover:text-zinc-200">
        <ChevronRight className="w-4 h-4" />
      </Link>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{workout.exercises.length} exercices</div>
    </CardContent>
  </Card>
);

function Workouts() {
  const { state, setState } = useApp();
  const [auto, setAuto] = useState(null);

  useEffect(() => {
    setAuto(generateAutoWorkout(state.profile));
  }, [state.profile]); // Ajout de la dépendance state.profile

  const handleStartAuto = () => {
    if (auto) {
      setState((s) => ({
        ...s,
        currentWorkout: auto,
        activeSession: {
          workout: auto,
          currentExerciseIndex: 0,
          currentSetIndex: 0,
          timer: 0,
          isRunning: false,
          finished: false,
        },
      }));
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Programme d'entraînement</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {auto && (
          <Card className="bg-gradient-to-br from-yellow-500/20 to-zinc-900/60 border-yellow-500/40">
            <CardHeader>
              <CardTitle className="text-yellow-400">Programme généré</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold mb-2">{auto.name}</div>
              <p className="text-zinc-400 text-sm mb-4">{auto.exercises.length} exercices</p>
              <Button onClick={handleStartAuto} className="w-full">
                Commencer
              </Button>
            </CardContent>
          </Card>
        )}
        {state.customWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
    </div>
  );
}

export default Workouts;
