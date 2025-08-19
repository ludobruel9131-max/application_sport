import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useApp } from "../App";
import { EXERCISES } from "../data";

const uid = () => Math.random().toString(36).slice(2, 9);

function CreateCustomWorkout() {
  const { state, setState } = useApp();
  const [name, setName] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const addBlock = (exerciseId) => {
    setBlocks(prev => [...prev, {
      id: uid(),
      exerciseId,
      workMin: 2,
      restSec: 60,
      rounds: 3,
    }]);
  };

  const removeBlock = (id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  };

  const updateBlock = (id, key, value) => {
    setBlocks(prev => prev.map(b => b.id === id ? { ...b, [key]: value } : b));
  };

  const saveWorkout = () => {
    if (!name || blocks.length === 0) {
      alert("Veuillez donner un nom et ajouter au moins un exercice.");
      return;
    }
    const newWorkout = { id: uid(), name, blocks };
    setState(s => ({ ...s, customWorkouts: [...s.customWorkouts, newWorkout] }));
    setName("");
    setBlocks([]);
    setShowForm(false);
  };

  return (
    <Card className="bg-zinc-900/60 border-zinc-800">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Créer une séance personnalisée</span>
          <Button onClick={() => setShowForm(prev => !prev)} variant="outline" className="border-zinc-700">
            {showForm ? "Annuler" : "Commencer"}
          </Button>
        </CardTitle>
      </CardHeader>
      {showForm && (
        <CardContent className="space-y-4">
          <Input placeholder="Nom de la séance" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-800/60 border-zinc-700" />
          <div className="space-y-2">
            {blocks.map((block, i) => {
              const ex = EXERCISES.find(e => e.id === block.exerciseId);
              if (!ex) return null;
              return (
                <div key={block.id} className="p-3 rounded-xl bg-zinc-800/60 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{i + 1}. {ex.name}</span>
                    <Button variant="ghost" size="icon" onClick={() => removeBlock(block.id)} className="text-zinc-400 hover:text-red-400"><Trash2 className="w-4 h-4" /></Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-zinc-400">
                    <div>
                      <span className="block font-medium text-zinc-200">Travail (min)</span>
                      <Input type="number" min="1" value={block.workMin} onChange={e => updateBlock(block.id, "workMin", parseInt(e.target.value))} className="mt-1 bg-zinc-800/60 border-zinc-700" />
                    </div>
                    <div>
                      <span className="block font-medium text-zinc-200">Repos (sec)</span>
                      <Input type="number" min="0" value={block.restSec} onChange={e => updateBlock(block.id, "restSec", parseInt(e.target.value))} className="mt-1 bg-zinc-800/60 border-zinc-700" />
                    </div>
                    <div>
                      <span className="block font-medium text-zinc-200">Rounds</span>
                      <Input type="number" min="1" value={block.rounds} onChange={e => updateBlock(block.id, "rounds", parseInt(e.target.value))} className="mt-1 bg-zinc-800/60 border-zinc-700" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Select onValueChange={addBlock}>
            <SelectTrigger className="bg-yellow-500 text-black hover:bg-yellow-400"><SelectValue placeholder="Ajouter un exercice" /></SelectTrigger>
            <SelectContent>
              {EXERCISES.map(ex => (<SelectItem key={ex.id} value={ex.id}>{ex.name}</SelectItem>))}
            </SelectContent>
          </Select>
          <Button onClick={saveWorkout} className="w-full bg-yellow-500 text-black hover:bg-yellow-400">Sauvegarder la séance</Button>
        </CardContent>
      )}
    </Card>
  );
}

export default CreateCustomWorkout;
