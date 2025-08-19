import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { CheckCircle2, Play, ArrowRight, Calendar as CalendarIcon } from "lucide-react";
import { useApp } from "../App";
import { EXERCISES } from "../data";
import { caloriesForExercise, formatDate } from "../utils";
import { useNavigate } from "react-router-dom";

function ActiveSession() {
  const { state, setState } = useApp();
  const navigate = useNavigate();
  const session = [...state.sessions].reverse().find(s => !s.completedAt);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("work"); // work | rest | done
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef(null);

  const block = session?.blocks[idx];
  const ex = block ? EXERCISES.find(e => e.id === block.exerciseId) : null;

  useEffect(() => {
    if (!session || !block) return;
    const workSec = Math.round(block.workMin * 60);
    const restSec = block.restSec;
    const totalRounds = block.rounds;

    let round = 1;
    let phaseLocal = "work";
    setPhase("work");
    setRemaining(workSec);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev > 1) return prev - 1;

        if (phaseLocal === "work") {
          setState(s => {
            const copy = [...s.sessions];
            const i = copy.findIndex(x => x.id === session.id);
            if (i >= 0) {
              copy[i].totalMinutes += block.workMin;
              copy[i].totalCalories += caloriesForExercise(ex, block.workMin);
            }
            return { ...s, sessions: copy };
          });
        }

        if (phaseLocal === "work") {
          phaseLocal = "rest";
          setPhase("rest");
          return restSec || 1;
        } else {
          if (round < totalRounds) {
            round += 1;
            phaseLocal = "work";
            setPhase("work");
            return workSec;
          } else {
            if (idx < session.blocks.length - 1) {
              setIdx(x => x + 1);
              phaseLocal = "work";
              setPhase("work");
              return workSec;
            } else {
              clearInterval(timerRef.current);
              setPhase("done");
              setState(s => {
                const copy = [...s.sessions];
                const i = copy.findIndex(x => x.id === session.id);
                if (i >= 0) {
                  copy[i].completedAt = new Date().toISOString();
                  const key = formatDate(new Date());
                  const plus = copy[i].totalCalories || 0;
                  const stats = { ...s.stats };
                  stats.caloriesByDay = { ...(stats.caloriesByDay || {}) };
                  stats.caloriesByDay[key] = (stats.caloriesByDay[key] || 0) + plus;
                  return { ...s, sessions: copy, stats };
                }
                return s;
              });
              return 0;
            }
          }
        }
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [session?.id, idx]);

  if (!session) return null;

  if (phase === "done") return (
    <Card className="bg-emerald-900/20 border-emerald-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-5 h-5" /> Séance terminée</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-semibold">{session.name}</div>
            <div className="text-zinc-400">{session.blocks.length} exercices</div>
          </div>
          <div className="text-right">
            <div>{Math.round(session.totalMinutes)} min</div>
            <div className="text-yellow-400 font-semibold">{session.totalCalories} kcal</div>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button onClick={() => navigate('/calendar')} className="bg-yellow-500 text-black hover:bg-yellow-400"><CalendarIcon className="w-4 h-4 mr-1" /> Planifier la prochaine</Button>
          <Button variant="outline" className="border-zinc-700" onClick={() => navigate('/')}>Retour à l'accueil</Button>
        </div>
      </CardContent>
    </Card>
  );

  if (!ex) return null;

  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Play className="w-5 h-5 text-yellow-500" /> Séance en cours</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video rounded-xl overflow-hidden bg-zinc-800">
          <img src={ex.media} alt={ex.name} className="w-full h-full object-cover" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold">{ex.name}</h3>
          <p className="text-zinc-400">{block.rounds} rounds • {block.workMin} min de travail • {block.restSec}s de repos</p>
        </div>
        <div className="text-center text-4xl font-mono font-bold text-yellow-500">
          {Math.floor(remaining / 60).toString().padStart(2, '0')}:{(remaining % 60).toString().padStart(2, '0')}
        </div>
        <div className="flex justify-between items-center text-sm">
          <div className="text-zinc-400">Bloc {idx + 1} / {session.blocks.length}</div>
          <div className="text-yellow-400">{phase === "work" ? "Travail" : "Repos"}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ActiveSession;
