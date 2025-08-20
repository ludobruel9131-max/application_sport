import React, { useState, useEffect } from "react";
// import { useRef } from "react";
import { BrowserRouter, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, AreaChart, Area } from "recharts";
import { CalendarIcon, TimerIcon, Flame, Trophy, Settings, BarChart2, Dumbbell, Home, BookOpenText, ChevronRight, Star, Search, Filter, Play, Pause, RotateCcw, Crown, Bell, Heart, Gift, Shield, ArrowRight, CheckCircle2, Users, Circle, PlusCircle, Pen, Trash2 } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Switch } from "./components/ui/switch";
import { Slider } from "./components/ui/slider";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./components/ui/select";
import { Info } from "./components/Info";
import { cn } from "./lib/utils";
import { EXERCISES, equipmentOptions, defaultProfile, levels, goals, uid, bmi, formatDate, caloriesForExercise, generateAutoWorkout } from "./data";
import Dashboard from "./components/Dashboard";
import Workouts from "./components/Workouts";
import Library from "./components/Library";
import CustomWorkout from "./components/CustomWorkout";
import CreateCustomWorkout from "./components/CreateCustomWorkout";
import MyCustomWorkouts from "./components/MyCustomWorkouts";
import SettingsPage from "./components/SettingsPage";
import Shell from "./components/Shell";
import ActiveSession from "./components/ActiveSession";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem("app_state");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem("app_state", JSON.stringify(state));
  }, [state]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/library" element={<Library />} />
          <Route path="/custom/:id" element={<CustomWorkout />} />
          <Route path="/create-custom" element={<CreateCustomWorkout />} />
          <Route path="/my-custom-workouts" element={<MyCustomWorkouts />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/active-session" element={<ActiveSession />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </BrowserRouter>
  );
}

export default App;
