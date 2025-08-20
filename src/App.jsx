import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Calendar, List } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Importez tous les composants et les données nécessaires
import Dashboard from "./components/Dashboard";
import Workouts from "./components/Workouts";
import Library from "./components/Library";
import CustomWorkout from "./components/CustomWorkout";
import CreateCustomWorkout from "./components/CreateCustomWorkout";
import MyCustomWorkouts from "./components/MyCustomWorkouts";
import SettingsPage from "./components/SettingsPage";
import Shell from "./components/Shell";
import ActiveSession from "./components/ActiveSession";
import { fixedWorkoutData, defaultProfile } from "./data";

/**
 * Fonction pure pour générer le nouveau programme d'entraînement en fonction des jours de repos.
 * @param {array} dataToUse - Les données de programme à utiliser (le programme fixe dans ce cas).
 * @param {array} restDays - Les indices des jours de repos.
 * @returns {array} Le programme d'entraînement mis à jour.
 */
const getNewWorkoutLayout = (dataToUse, restDays) => {
  if (!dataToUse) return null;

  const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
  const trainingDaysCount = 3;
  const newWorkoutData = JSON.parse(JSON.stringify(dataToUse));
  
  newWorkoutData.forEach(week => {
    const workoutsToAssign = week.workouts.filter(w => w.exercises.length > 0);
    const newWorkouts = [];
    let workoutIndex = 0;
    
    for (let i = 0; i < 7; i++) {
      if (restDays.includes(i)) {
        newWorkouts.push({ day: daysOfWeek[i], exercises: [] }); // Jour de repos
      } else {
        if (workoutIndex < workoutsToAssign.length) {
          newWorkouts.push({ ...workoutsToAssign[workoutIndex], day: daysOfWeek[i] });
          workoutIndex++;
        } else {
          newWorkouts.push({ day: daysOfWeek[i], exercises: [] });
        }
      }
    }
    week.workouts = newWorkouts;
  });

  return newWorkoutData;
};

// Crée le contexte et l'exporte pour qu'il soit utilisé par les composants enfants
export const AppContext = createContext();

function App() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem("app_state");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);

  const [workoutData, setWorkoutData] = useState(null);
  const [view, setView] = useState('list'); // 'list' ou 'calendar'
  const [restDays, setRestDays] = useState([0, 6]); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi

  // Initialise le programme au chargement de la page
  useEffect(() => {
    const initialWorkoutLayout = getNewWorkoutLayout(fixedWorkoutData, restDays);
    setWorkoutData(initialWorkoutLayout);
  }, []);

  // Met à jour le programme lorsque les jours de repos changent.
  useEffect(() => {
    if (workoutData) {
      setWorkoutData(getNewWorkoutLayout(fixedWorkoutData, restDays));
    }
  }, [restDays]);

  // Initialize Firebase and set up authentication
  useEffect(() => {
    try {
      const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
      if (!firebaseConfig) {
        console.error("Firebase config is not defined.");
        return;
      }

      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const firebaseAuth = getAuth(app);

      setDb(firestoreDb);
      setAuth(firebaseAuth);

      const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthReady(true);
        } else {
          if (typeof __initial_auth_token !== 'undefined') {
            await signInWithCustomToken(firebaseAuth, __initial_auth_token);
          } else {
            await signInAnonymously(firebaseAuth);
          }
        }
      });
      return () => unsubscribe();
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("app_state", JSON.stringify(state));
  }, [state]);

  /**
   * Gère le basculement d'un jour de repos.
   * La logique a été corrigée pour maintenir 3 jours d'entraînement.
   * @param {number} dayIndex - L'index du jour de la semaine (0-6).
   */
  const handleToggleRestDay = (dayIndex) => {
    setRestDays(prevRestDays => {
      const isRestDay = prevRestDays.includes(dayIndex);
      const currentRestDayCount = prevRestDays.length;

      if (isRestDay) {
        if (currentRestDayCount > 4) {
          console.warn("Le programme est conçu pour 3 jours d'entraînement. Veuillez en sélectionner un pour le remplacer.");
          return prevRestDays;
        }
        return prevRestDays.filter(day => day !== dayIndex);
      } else {
        if (currentRestDayCount < 4) {
            return [...prevRestDays, dayIndex].sort((a, b) => a - b);
        } else {
            console.warn("Vous ne pouvez pas ajouter plus de jours de repos. Le programme a 3 jours d'entraînement.");
            return prevRestDays;
        }
      }
    });
  };

  const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  return (
    <AppContext.Provider value={{ state, setState, db, auth, userId, isAuthReady, workoutData }}>
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
    </AppContext.Provider>
  );
}

export default App;
