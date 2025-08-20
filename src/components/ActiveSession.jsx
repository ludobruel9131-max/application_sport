import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Pause, Play, RotateCcw } from "lucide-react";

import { useApp } from "../App";

function ActiveSession() {
  const { state, setState } = useApp();
  const navigate = useNavigate();
  const [session, setSession] = useState(state.activeSession);
  const timerRef = useRef(null);

  useEffect(() => {
    if (session.isRunning) {
      timerRef.current = setInterval(() => {
        setSession((s) => ({ ...s, timer: s.timer + 1 }));
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => clearInterval(timerRef.current);
  }, [session.isRunning]);

  const handleToggle = () => {
    setSession((s) => ({ ...s, isRunning: !s.isRunning }));
    setState((s) => ({ ...s, activeSession: { ...s.activeSession, isRunning: !s.activeSession.isRunning } }));
  };

  const handleReset = () => {
    setSession((s) => ({ ...s, timer: 0 }));
    setState((s) => ({ ...s, activeSession: { ...s.activeSession, timer: 0 } }));
  };

  const handleNext = () => {
    if (session.currentExerciseIndex < session.workout.exercises.length - 1) {
      setSession((s) => ({ ...s, currentExerciseIndex: s.currentExerciseIndex + 1, currentSetIndex: 0 }));
    } else {
      setSession((s) => ({ ...s, finished: true }));
      setState((s) => ({ ...s, activeSession: { ...s.activeSession, finished: true } }));
      navigate("/");
    }
  };

  if (!session || !session.workout) {
    return <div>Aucune séance active</div>;
  }

  const ex = session.workout.exercises[session.currentExerciseIndex];
  const block = ex.blocks[session.currentSetIndex];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Séance en cours : {session.workout.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div>Exercice : {ex.name}</div>
          <div>Série {session.currentSetIndex + 1} / {ex.blocks.length}</div>
          <div>Répétitions : {block.reps}</div>
          <div>Poids : {block.weight}</div>
          <div>Temps écoulé : {session.timer}s</div>
          <Button onClick={handleToggle}>{session.isRunning ? <Pause /> : <Play />}</Button>
          <Button onClick={handleReset}><RotateCcw /></Button>
          <Button onClick={handleNext}>Suivant</Button>
          <Input placeholder="Poids réel" />
        </CardContent>
      </Card>
    </div>
  );
}

export default ActiveSession;
