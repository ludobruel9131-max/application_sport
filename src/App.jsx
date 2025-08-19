import React, { useEffect, useMemo, useRef, useState, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, AreaChart, Area } from "recharts";
import { Calendar as CalendarIcon, Timer as TimerIcon, Flame, Trophy, Settings, BarChart2, Dumbbell, Home, BookOpenText, ChevronRight, Star, Search, Filter, Play, Pause, RotateCcw, Crown, Bell, Heart, Gift, Shield, ArrowRight, CheckCircle2, Users, Circle, PlusCircle, Pen, Trash2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "./components/ui/input";
import { Switch } from "./components/ui/switch";
import { Slider } from "./components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Importe les composants et les utilitaires
import Shell from "./components/Shell";
import Dashboard from "./components/Dashboard";
import Library from "./components/Library";
import Workouts from "./components/Workouts";
import Profile from "./components/Profile";
import { defaultProfile, levels, goals, equipmentOptions, EXERCISES, defaultState, storage, uid, bmi, formatDate, caloriesForExercise, generateAutoWorkout } from "./data";

// Création du contexte pour gérer l'état global
export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// Provider pour l'état de l'application
function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);

  useEffect(() => { storage.set("lf_profile", state.profile); }, [state.profile]);
  useEffect(() => { storage.set("lf_favorites", state.favorites); }, [state.favorites]);
  useEffect(() => { storage.set("lf_customWorkouts", state.customWorkouts); }, [state.customWorkouts]);
  useEffect(() => { storage.set("lf_sessions", state.sessions); }, [state.sessions]);
  useEffect(() => { storage.set("lf_calendar", state.calendar); }, [state.calendar]);
  useEffect(() => { storage.set("lf_stats", state.stats); }, [state.stats]);
  useEffect(() => { storage.set("lf_settings", state.settings); }, [state.settings]);

  const value = useMemo(() => ({ state, setState }), [state]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Composants de pages manquants pour l'exemple
const PlaceholderPage = ({ title }) => (
    <div className="flex items-center justify-center min-h-[50vh]">
        <h2 className="text-4xl font-bold tracking-tight text-yellow-500">{title}</h2>
    </div>
);
const Challenges = () => <PlaceholderPage title="Challenges" />;
const Nutrition = () => <PlaceholderPage title="Nutrition" />;
const Stats = () => <PlaceholderPage title="Progression" />;
const Calendar = () => <PlaceholderPage title="Calendrier" />;

// Composant principal de l'application
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Shell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/library" element={<Library />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Shell>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
