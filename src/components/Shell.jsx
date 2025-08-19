import React from "react";
import { NavLink } from "react-router-dom";
import { Calendar as CalendarIcon, Timer as TimerIcon,
  Flame, Trophy, Settings, BarChart2, Dumbbell, Home, BookOpenText, ChevronRight,
  Star, Search, Filter, Play, Pause, RotateCcw, Crown, Bell, Heart, Gift, Shield,
  ArrowRight, CheckCircle2, Users, Circle, PlusCircle, Pen, Trash2
} from "lucide-react";

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-zinc-100">
      <header className="sticky top-0 z-40 backdrop-blur bg-black/60 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
            <span className="text-2xl">🦁</span>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">LionFit</h1>
            <p className="text-xs text-zinc-400 -mt-1">Deviens la meilleure version de toi-même</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <NavLink to="/" className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm ${isActive ? "bg-yellow-500 text-black" : "hover:bg-zinc-800"}`}><Home className="inline w-4 h-4 mr-1" />Accueil</NavLink>
            <NavLink to="/workouts" className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm ${isActive ? "bg-yellow-500 text-black" : "hover:bg-zinc-800"}`}><Dumbbell className="inline w-4 h-4 mr-1" />Séances</NavLink>
            <NavLink to="/library" className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm ${isActive ? "bg-yellow-500 text-black" : "hover:bg-zinc-800"}`}><BookOpenText className="inline w-4 h-4 mr-1" />Exercices</NavLink>
            <NavLink to="/stats" className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm ${isActive ? "bg-yellow-500 text-black" : "hover:bg-zinc-800"}`}><BarChart2 className="inline w-4 h-4 mr-1" />Progression</NavLink>
            <NavLink to="/calendar" className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm ${isActive ? "bg-yellow-500 text-black" : "hover:bg-zinc-800"}`}><CalendarIcon className="inline w-4 h-4 mr-1" />Calendrier</NavLink>
            <NavLink to="/challenges" className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm ${isActive ? "bg-yellow-500 text-black" : "hover:bg-zinc-800"}`}><Trophy className="inline w-4 h-4 mr-1" />Challenges</NavLink>
            <NavLink to="/nutrition" className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm ${isActive ? "bg-yellow-500 text-black" : "hover:bg-zinc-800"}`}><Heart className="inline w-4 h-4 mr-1" />Nutrition</NavLink>
            <NavLink to="/profile" className={({ isActive }) => `px-3 py-1.5 rounded-full text-sm ${isActive ? "bg-yellow-500 text-black" : "hover:bg-zinc-800"}`}><Settings className="inline w-4 h-4 mr-1" />Profil</NavLink>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}

export default Shell;
