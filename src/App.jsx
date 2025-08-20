import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Calendar, List, Dumbbell, User, PlusCircle, Settings, LayoutDashboard, History, HeartHandshake } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Les données de l'application
const fixedWorkoutData = [
  {
    week: 1,
    workouts: [
      {
        name: "Entraînement 1",
        exercises: [
          { name: "Squat", sets: 3, reps: 10, weight: "60kg" },
          { name: "Développé couché", sets: 3, reps: 8, weight: "40kg" },
          { name: "Tirage vertical", sets: 3, reps: 12, weight: "30kg" },
        ],
      },
      {
        name: "Entraînement 2",
        exercises: [
          { name: "Soulevé de terre", sets: 3, reps: 5, weight: "80kg" },
          { name: "Presse à épaules", sets: 3, reps: 10, weight: "20kg" },
          { name: "Rowing barre", sets: 3, reps: 10, weight: "40kg" },
        ],
      },
      {
        name: "Entraînement 3",
        exercises: [
          { name: "Fentes", sets: 3, reps: 12, weight: "20kg" },
          { name: "Dips", sets: 3, reps: 8, weight: "Poids de corps" },
          { name: "Tirage horizontal", sets: 3, reps: 12, weight: "35kg" },
        ],
      },
    ],
  },
];

const defaultProfile = {
  name: "Utilisateur",
  level: "Débutant",
  goals: "Force et endurance",
  lastWorkout: "Aucun",
  customWorkouts: [],
};

/**
 * Fonction pure pour générer le nouveau programme d'entraînement en fonction des jours de repos.
 * @param {array} dataToUse - Les données de programme à utiliser.
 * @param {array} restDays - Les indices des jours de repos.
 * @returns {array} Le programme d'entraînement mis à jour.
 */
const getNewWorkoutLayout = (dataToUse, restDays) => {
  if (!dataToUse) return null;

  const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
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

// Définition des composants directement dans ce fichier
const Shell = () => {
    const location = useLocation();
    const isDashboard = location.pathname === '/';
    const isWorkouts = location.pathname === '/workouts';
    const isLibrary = location.pathname === '/library';
    const isSettings = location.pathname === '/settings';

    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
            <header className="p-4 bg-gray-800 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-teal-400">Application Sport</h1>
                </div>
            </header>
            <main className="flex-grow p-4">
                <div className="container mx-auto">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/workouts" element={<Workouts />} />
                        <Route path="/library" element={<Library />} />
                        <Route path="/custom/:id" element={<CustomWorkout />} />
                        <Route path="/create-custom" element={<CreateCustomWorkout />} />
                        <Route path="/my-custom-workouts" element={<MyCustomWorkouts />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/active-session" element={<ActiveSession />} />
                    </Routes>
                </div>
            </main>
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 shadow-lg border-t border-gray-700">
                <ul className="flex justify-around items-center p-2">
                    <li>
                        <Link to="/" className={`flex flex-col items-center p-2 ${isDashboard ? 'text-teal-400' : 'text-gray-400'}`}>
                            <LayoutDashboard size={24} />
                            <span className="text-xs">Tableau de bord</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/workouts" className={`flex flex-col items-center p-2 ${isWorkouts ? 'text-teal-400' : 'text-gray-400'}`}>
                            <Dumbbell size={24} />
                            <span className="text-xs">Entraînements</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/library" className={`flex flex-col items-center p-2 ${isLibrary ? 'text-teal-400' : 'text-gray-400'}`}>
                            <HeartHandshake size={24} />
                            <span className="text-xs">Partenaires</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" className={`flex flex-col items-center p-2 ${isSettings ? 'text-teal-400' : 'text-gray-400'}`}>
                            <Settings size={24} />
                            <span className="text-xs">Réglages</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 min-h-screen">
      <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 border-gray-700 rounded-2xl shadow-lg">
        <CardHeader>
          <CardTitle>Tableau de bord</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Ceci est votre tableau de bord. Il sera construit dans une prochaine étape.</p>
        </CardContent>
      </Card>
    </div>
  );
};

const Workouts = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 min-h-screen">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 border-gray-700 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Entraînements</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Ceci est la page des entraînements. Elle sera construite dans une prochaine étape.</p>
                </CardContent>
            </Card>
        </div>
    );
};

const Library = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 min-h-screen">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 border-gray-700 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Partenaires</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Ceci est la page des partenaires. Elle sera construite dans une prochaine étape.</p>
                </CardContent>
            </Card>
        </div>
    );
};

const CustomWorkout = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 min-h-screen">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 border-gray-700 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Entraînement personnalisé</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Ceci est la page de l'entraînement personnalisé. Elle sera construite dans une prochaine étape.</p>
                </CardContent>
            </Card>
        </div>
    );
};

const CreateCustomWorkout = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 min-h-screen">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 border-gray-700 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Créer un entraînement personnalisé</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Ceci est la page pour créer un entraînement personnalisé. Elle sera construite dans une prochaine étape.</p>
                </CardContent>
            </Card>
        </div>
    );
};

const MyCustomWorkouts = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 min-h-screen">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 border-gray-700 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Mes entraînements personnalisés</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Ceci est la page de mes entraînements personnalisés. Elle sera construite dans une prochaine étape.</p>
                </CardContent>
            </Card>
        </div>
    );
};

const SettingsPage = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 min-h-screen">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 border-gray-700 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Paramètres</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Ceci est la page des paramètres. Elle sera construite dans une prochaine étape.</p>
                </CardContent>
            </Card>
        </div>
    );
};

const ActiveSession = () => {
    return (
        <div className="flex flex-col items-center justify-center p-6 bg-gray-900 text-gray-100 min-h-screen">
            <Card className="w-full max-w-2xl bg-gray-800 text-gray-100 border-gray-700 rounded-2xl shadow-lg">
                <CardHeader>
                    <CardTitle>Session active</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Ceci est la page de session active. Elle sera construite dans une prochaine étape.</p>
                </CardContent>
            </Card>
        </div>
    );
};


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
O       if (user) {
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
