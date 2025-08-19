import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Dumbbell, Play, Trash2 } from "lucide-react";
import { useApp } from "../App";
import { useNavigate } from "react-router-dom";

function MyCustomWorkouts() {
  const { state, setState } = useApp();
  const navigate = useNavigate();

  const startSession = (workout) => {
    setState(s => ({
      ...s,
      sessions: [...s.sessions, {
        id: uid(),
        name: workout.name,
        date: new Date().toISOString(),
        blocks: workout.blocks,
        totalMinutes: 0,
        totalCalories: 0
      }]
    }));
  };

  const deleteWorkout = (id) => {
    setState(s => ({ ...s, customWorkouts: s.customWorkouts.filter(w => w.id !== id) }));
  };
  
  const uid = () => Math.random().toString(36).slice(2, 9);
  
  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Dumbbell className="w-5 h-5 text-yellow-500" /> Mes séances personnalisées</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {state.customWorkouts.length === 0 && (
          <p className="text-zinc-400">Aucune séance personnalisée. Créez-en une !</p>
        )}
        {state.customWorkouts.map(workout => (
          <div key={workout.id} className="p-3 rounded-xl bg-zinc-800/60 flex items-center justify-between">
            <div>
              <div className="font-medium">{workout.name}</div>
              <div className="text-xs text-zinc-400">{workout.blocks.length} exercices</div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => startSession(workout)} className="bg-yellow-500 text-black hover:bg-yellow-400"><Play className="w-4 h-4" /></Button>
              <Button size="sm" variant="ghost" onClick={() => deleteWorkout(workout.id)} className="text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default MyCustomWorkouts;
