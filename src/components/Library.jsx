import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";
import { Star, Search, BookOpenText } from "lucide-react";
import { useApp } from "../App";
import { EXERCISES, equipmentOptions } from "../data";

const Info = ({ label, value }) => (
    <div className="bg-zinc-800/60 rounded-lg p-2"><span className="text-zinc-400">{label}</span><div className="font-medium">{value}</div></div>
);

function Library() {
    const { state, setState } = useApp();
    const [q, setQ] = useState("");
    const [group, setGroup] = useState("Tous");
    const [equipment, setEquipment] = useState("Tous");
    const groups = ["Tous", ...Array.from(new Set(EXERCISES.map(e => e.group)))];

    const filtered = EXERCISES.filter(e =>
        (group === "Tous" || e.group === group) &&
        (equipment === "Tous" || e.equipment === equipment) &&
        (q === "" || e.name.toLowerCase().includes(q.toLowerCase()))
    );

    const toggleFav = (id) => {
        setState(s => ({ ...s, favorites: s.favorites.includes(id) ? s.favorites.filter(x => x !== id) : [...s.favorites, id] }));
    };

    return (
        <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight mb-4 flex items-center gap-2 text-yellow-500"><BookOpenText /> Bibliothèque d'exercices</h2>
            <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-2 top-2.5 text-zinc-400" />
                    <Input className="pl-8 bg-zinc-900 border-zinc-800" placeholder="Rechercher un exercice" value={q} onChange={e => setQ(e.target.value)} />
                </div>
                <Select value={group} onValueChange={setGroup}>
                    <SelectTrigger className="w-56 bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="Groupe" />
                    </SelectTrigger>
                    <SelectContent>
                        {groups.map(g => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
                    </SelectContent>
                </Select>
                <Select value={equipment} onValueChange={setEquipment}>
                    <SelectTrigger className="w-56 bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="Matériel" />
                    </SelectTrigger>
                    <SelectContent>
                        {(["Tous", ...equipmentOptions]).map(m => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(ex => (
                    <Card key={ex.id} className="bg-zinc-900/60 border-zinc-800 overflow-hidden">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                <span>{ex.name}</span>
                                <button onClick={() => toggleFav(ex.id)} className={`p-1 rounded-full ${state.favorites.includes(ex.id) ? "text-yellow-400" : "text-zinc-400 hover:text-zinc-200"}`} title="Ajouter aux favoris">
