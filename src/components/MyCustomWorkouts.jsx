import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronRight, Trash2 } from "lucide-react";
import { useApp } from "../App";

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

function MyCustomWorkouts() {
  const { state, setState } = useApp();

  const handleDelete = (id) => {
    setState((s) => ({
      ...s,
      customWorkouts: s.customWorkouts.filter((w) => w.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Mes programmes personnalisés</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.customWorkouts.map((workout) => (
          <div key={workout.id} className="relative">
            <WorkoutCard workout={workout} />
            <Button onClick={() => handleDelete(workout.id)} className="absolute top-2 right-2 p-2">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyCustomWorkouts;
