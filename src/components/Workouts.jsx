import React, { useState, useEffect } from "react";
import { Dumbbell, RotateCcw, Play } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";
import { Slider } from "./components/ui/slider";
import { Button } from "./components/ui/button";
import { useApp } from "../App";
import { generateAutoWorkout, EXERCISES, equipmentOptions } from "../data";
import ActiveSession from "./ActiveSession";
import CreateCustomWorkout from "./CreateCustomWorkout";
import MyCustomWorkouts from "./MyCustomWorkouts";
import { caloriesForExercise } from "../lib/utils";

function Workouts() {
    const { state, setState } = useApp();
    const [equipment, setEquipment] = useState([]);
    const [auto, setAuto] = useState(null);
    const [durationTarget, setDurationTarget] = useState(40);

    useEffect(() => {
        setAuto(generateAutoWorkout(state.profile, { equipment }));
    }, [state.profile.goal, state.profile.level, JSON.stringify(equipment)]);

    const startSession = (workout) => {
        setState(s => ({
            ...s,
            sessions: [...s.sessions, {
                id: uid(), name: workout.name, date: new Date().toISOString(), blocks: workout.blocks, totalMinutes: 0, totalCalories: 0
            }]
        }));
    };

    const uid = () => Math.random().toString(36).slice(2, 9);
    
    return (
        <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
                <Card className="bg-zinc-900/60 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Dumbbell className="w-5 h-5 text-yellow-500" /> Séance auto — {state.profile.goal} ({state.profile.level})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <Select value="" onValueChange={(v) => setEquipment(arr => [...new Set([...arr, v])])}>
                                <SelectTrigger className="w-56 bg-zinc-900 border-zinc-800"><SelectValue placeholder="Ajouter matériel" /></SelectTrigger>
                                <SelectContent>
                                    {equipmentOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <div className="flex items-center gap-2 text-xs">
                                {equipment.map(m => (
                                    <span key={m} className="px-2 py-1 rounded-full bg-zinc-800 border border-zinc-700 flex items-center gap-1">{m}
                                        <button onClick={() => setEquipment(eq => eq.filter(x => x !== m))} className="hover:text-red-400">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div className="text-sm mb-1">Durée cible: {durationTarget} min</div>
                            <Slider value={[durationTarget]} onValueChange={v => setDurationTarget(v[0])} min={10} max={90} step={5} />
                        </div>
                        {auto && (
                            <div className="space-y-2">
                                {auto.blocks.map((b, i) => {
                                    const ex = EXERCISES.find(e => e.id === b.exerciseId);
                                    return (
                                        <div key={b.id} className="p-3 rounded-xl bg-zinc-800/60 flex items-center gap-3">
                                            <img src={ex.media} alt={ex.name} className="w-20 h-12 rounded-lg object-cover" />
                                            <div className="flex-1">
                                                <div className="font-medium">{i + 1}. {ex.name}</div>
                                                <div className="text-xs text-zinc-400">{b.rounds} rounds • {b.workMin} min travail • {b.restSec}s repos</div>
                                            </div>
                                            <div className="text-sm font-semibold">~{caloriesForExercise(ex, b.workMin * b.rounds)} kcal</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex gap-2">
                            {auto && <Button className="bg-yellow-500 text-black hover:bg-yellow-400" onClick={() => startSession(auto)}><Play className="w-4 h-4 mr-1" /> Démarrer</Button>}
                            <Button variant="outline" className="border-zinc-700" onClick={() => setAuto(generateAutoWorkout(state.profile, { equipment }))}><RotateCcw className="w-4 h-4 mr-1" /> Régénérer</Button>
                        </div>
                    </CardContent>
                </Card>
                <ActiveSession />
            </div>
            <div className="space-y-4">
                <CreateCustomWorkout />
                <MyCustomWorkouts />
            </div>
        </div>
    );
}

export default Workouts;
