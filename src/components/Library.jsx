import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Star, Search, Filter } from "lucide-react";
import { EXERCISES } from "../data";

const ExerciseCard = ({ exercise }) => (
  <Card className="bg-zinc-900/60 border-zinc-800">
    <CardHeader>
      <CardTitle className="text-sm font-medium">{exercise.name}</CardTitle>
    </CardHeader>
  </Card>
);

function Library() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filteredExercises = EXERCISES.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || ex.equipment.includes(filter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Bibliothèque d'exercices</h2>

      <div className="flex items-center gap-2">
        <Input placeholder="Rechercher" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Filter className="text-zinc-400" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}

export default Library;
