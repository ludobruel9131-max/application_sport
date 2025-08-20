import React, { useState, useContext } from "react";
import { Input } from "./ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { PlusCircle } from "lucide-react";
import { uid } from "../data";
import { AppContext } from "../App";

function CreateCustomWorkout() {
  const { state, setState } = useContext(AppContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    const newWorkout = {
      id: uid(),
      name,
      description,
      exercises: [],
    };
    setState((s) => ({
      ...s,
      customWorkouts: [...s.customWorkouts, newWorkout],
    }));
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Créer un programme</CardTitle>
        </CardHeader>
        <CardContent>
          <Input placeholder="Nom du programme" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <button onClick={handleCreate}>Créer</button>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreateCustomWorkout;
