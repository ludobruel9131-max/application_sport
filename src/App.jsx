import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Outlet, NavLink, useParams, useNavigate, useLocation } from "react-router-dom";
import { Dumbbell, User, PlusCircle, Settings, LayoutDashboard, ChevronRight, Trash2, Pause, Play, RotateCcw, Star, Search, Filter, Trophy, BookOpenText, BarChart2, Home, BarChart, Calendar, List, X, PlayCircle, Clock, ChevronDown, Check } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Separator } from './components/ui/separator';
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot, collection, query, where, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

import { v4 as uuidv4 } from 'uuid';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SwitchPrimitives from "@radix-ui/react-switch";

// Composants Shadcn UI
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-yellow-400 text-zinc-950 hover:bg-yellow-500/90",
        destructive: "bg-red-500 text-white hover:bg-red-600",
        outline: "border border-zinc-700 bg-zinc-900/60 text-white hover:bg-zinc-800 hover:text-white",
        secondary: "bg-zinc-700 text-white hover:bg-zinc-600",
        ghost: "hover:bg-zinc-800 hover:text-white",
        link: "text-yellow-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} ref={ref} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-zinc-950 p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = "Label";

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-zinc-700 bg-zinc-900 text-zinc-50 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
        "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-zinc-800 focus:text-zinc-50 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-zinc-700", className)}
    {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

const Slider = React.forwardRef(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-zinc-800">
      <SliderPrimitive.Range className="absolute h-full bg-yellow-400" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-zinc-700 bg-yellow-400 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-yellow-400 disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-yellow-400 data-[state=unchecked]:bg-zinc-700 dark:focus-visible:ring-zinc-300 dark:focus-visible:ring-offset-zinc-950",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

// Firebase & Context Setup
const defaultProfile = {
  name: "Utilisateur",
  level: "intermédiaire",
  goal: "perte-de-poids",
  weight: 70,
  height: 175,
  gender: "homme",
  activityLevel: "modéré",
  calories: 2000,
  macros: {
    protein: 150,
    carbs: 200,
    fat: 60,
  },
  customWorkouts: [],
  favoriteExercises: [],
};

const defaultAppState = {
  profile: defaultProfile,
  customWorkouts: [],
  history: [],
  currentWorkout: null,
  activeSession: null,
  isAuthReady: false,
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, setState] = useState(defaultAppState);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

  useEffect(() => {
    const initialize = async () => {
      if (typeof __firebase_config !== 'undefined' && typeof __initial_auth_token !== 'undefined') {
        try {
          const firebaseConfig = JSON.parse(__firebase_config);
          const app = initializeApp(firebaseConfig);
          const auth = getAuth(app);
          const db = getFirestore(app);
          setDb(db);
          setAuth(auth);
          const userAuth = await signInWithCustomToken(auth, __initial_auth_token);
          setUserId(userAuth.user.uid);
          setState((s) => ({ ...s, isAuthReady: true }));
        } catch (e) {
          console.error("Firebase init failed: ", e);
          toast.error("Échec de l'initialisation de Firebase. Les données ne seront pas sauvegardées.");
          setState((s) => ({ ...s, isAuthReady: true }));
        }
      } else {
        console.warn("Firebase config or auth token is not available. Running in local mode.");
        setState((s) => ({ ...s, isAuthReady: true }));
      }
    };
    initialize();
  }, []);

  useEffect(() => {
    if (!state.isAuthReady || !db || !userId) return;

    // Écoute des changements de profil en temps réel
    const userDocRef = doc(db, `/artifacts/${appId}/users/${userId}/profile`, 'userProfile');
    const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setState(s => ({ ...s, profile: data }));
      } else {
        setDoc(userDocRef, defaultProfile);
      }
    });

    // Écoute des changements des entraînements personnalisés en temps réel
    const workoutsCollectionRef = collection(db, `/artifacts/${appId}/users/${userId}/customWorkouts`);
    const unsubscribeWorkouts = onSnapshot(workoutsCollectionRef, (querySnapshot) => {
      const workouts = [];
      querySnapshot.forEach((doc) => {
        workouts.push({ id: doc.id, ...doc.data() });
      });
      setState(s => ({ ...s, customWorkouts: workouts }));
    });
    
    // Écoute des changements de l'historique en temps réel
    const historyCollectionRef = collection(db, `/artifacts/${appId}/users/${userId}/history`);
    const unsubscribeHistory = onSnapshot(historyCollectionRef, (querySnapshot) => {
      const history = [];
      querySnapshot.forEach((doc) => {
        history.push({ id: doc.id, ...doc.data() });
      });
      setState(s => ({ ...s, history: history.sort((a, b) => b.date - a.date) }));
    });

    return () => {
      unsubscribeProfile();
      unsubscribeWorkouts();
      unsubscribeHistory();
    };
  }, [state.isAuthReady, db, userId, appId]);

  const value = { state, setState, db, userId, appId };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Data & Utils
const levels = [
  "débutant",
  "intermédiaire",
  "avancé"
];

const goals = [
  "perte-de-poids",
  "prise-de-masse",
  "force",
  "endurance",
];

const genders = [
  "homme",
  "femme",
  "autre"
];

const equipmentList = [
  "haltères",
  "barre",
  "machine",
  "corps",
  "élastique"
];

const activityLevels = [
  { value: "sédentaire", label: "Sédentaire (peu ou pas d'exercice)" },
  { value: "léger", label: "Léger (exercice 1-3 jours/semaine)" },
  { value: "modéré", label: "Modéré (exercice 3-5 jours/semaine)" },
  { value: "intense", label: "Intense (exercice 6-7 jours/semaine)" },
  { value: "très-intense", label: "Très intense (exercice 2x/jour)" },
];

const exercises = [
  { id: uuidv4(), name: "Développé couché", muscleGroup: "pectoraux", equipment: ["haltères", "barre", "machine"] },
  { id: uuidv4(), name: "Squat", muscleGroup: "jambes", equipment: ["corps", "haltères", "barre"] },
  { id: uuidv4(), name: "Soulevé de terre", muscleGroup: "dos", equipment: ["barre"] },
  { id: uuidv4(), name: "Tractions", muscleGroup: "dos", equipment: ["corps"] },
  { id: uuidv4(), name: "Fentes", muscleGroup: "jambes", equipment: ["corps", "haltères"] },
  { id: uuidv4(), name: "Pompes", muscleGroup: "pectoraux", equipment: ["corps"] },
  { id: uuidv4(), name: "Rowing", muscleGroup: "dos", equipment: ["haltères", "barre", "machine"] },
  { id: uuidv4(), name: "Presse à cuisses", muscleGroup: "jambes", equipment: ["machine"] },
  { id: uuidv4(), name: "Curl biceps", muscleGroup: "bras", equipment: ["haltères", "barre"] },
  { id: uuidv4(), name: "Élévations latérales", muscleGroup: "épaules", equipment: ["haltères"] },
  { id: uuidv4(), name: "Gainage", muscleGroup: "abdominaux", equipment: ["corps"] },
  { id: uuidv4(), name: "Course", muscleGroup: "cardio", equipment: ["corps"] },
];

const generateAutoWorkout = (profile) => {
  const muscleGroups = {
    "pectoraux": ["Développé couché", "Pompes"],
    "jambes": ["Squat", "Fentes", "Presse à cuisses"],
    "dos": ["Soulevé de terre", "Tractions", "Rowing"],
    "bras": ["Curl biceps"],
    "épaules": ["Élévations latérales"],
    "abdominaux": ["Gainage"],
    "cardio": ["Course"],
  };

  const selectedExercises = [];
  const numberOfExercises = 5;

  const groupsToUse = Object.keys(muscleGroups).sort(() => 0.5 - Math.random()).slice(0, 3);

  groupsToUse.forEach(group => {
    const availableExercises = muscleGroups[group];
    const exercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    if (exercise) {
      selectedExercises.push(exercise);
    }
  });

  while (selectedExercises.length < numberOfExercises) {
    const randomGroup = Object.keys(muscleGroups)[Math.floor(Math.random() * Object.keys(muscleGroups).length)];
    const availableExercises = muscleGroups[randomGroup];
    const exercise = availableExercises[Math.floor(Math.random() * availableExercises.length)];
    if (exercise && !selectedExercises.includes(exercise)) {
      selectedExercises.push(exercise);
    }
  }

  const workoutExercises = selectedExercises.map(exName => {
    const ex = exercises.find(e => e.name === exName);
    return {
      ...ex,
      sets: [
        { reps: 10, weight: 20 },
        { reps: 10, weight: 20 },
        { reps: 8, weight: 25 },
      ],
      rest: 60
    };
  });

  return {
    id: uuidv4(),
    name: "Programme Généré",
    exercises: workoutExercises,
    description: `Un programme personnalisé pour votre niveau ${profile.level} et votre objectif ${profile.goal}.`
  };
};

const calculateMetrics = (profile, history) => {
  const workoutCount = history.length;
  const totalDuration = history.reduce((sum, entry) => sum + (entry.duration || 0), 0);
  const totalExercises = history.reduce((sum, entry) => sum + (entry.exercises?.length || 0), 0);

  const muscleGroupData = {};
  history.forEach(entry => {
    entry.exercises.forEach(exercise => {
      const group = exercise.muscleGroup;
      muscleGroupData[group] = (muscleGroupData[group] || 0) + 1;
    });
  });

  const muscleChartData = Object.keys(muscleGroupData).map(group => ({
    name: group.charAt(0).toUpperCase() + group.slice(1),
    value: muscleGroupData[group]
  }));
  
  return { workoutCount, totalDuration, totalExercises, muscleChartData };
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const calorieBurn = (profile, workout) => {
  const baseBurn = 5 * workout.exercises.length;
  const modifiers = {
    "débutant": 1, "intermédiaire": 1.2, "avancé": 1.5,
  };
  return Math.round(baseBurn * (modifiers[profile.level] || 1));
};

const Dashboard = () => {
  const { state, db, userId, appId } = useContext(AppContext);
  const { workoutCount, totalDuration, totalExercises, muscleChartData } = calculateMetrics(state.profile, state.history);

  const mostUsedMuscleGroup = muscleChartData.length > 0 ? muscleChartData.reduce((prev, current) => (prev.value > current.value) ? prev : current) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tableau de bord</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entraînements terminés</CardTitle>
            <Trophy className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workoutCount}</div>
            <p className="text-xs text-zinc-400">Total</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Durée totale</CardTitle>
            <Clock className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(totalDuration / 60)} min</div>
            <p className="text-xs text-zinc-400">Temps cumulé</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exercices réalisés</CardTitle>
            <Dumbbell className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalExercises}</div>
            <p className="text-xs text-zinc-400">Total d'exercices</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle>Répartition des muscles</CardTitle>
            <CardDescription>Groupes musculaires les plus sollicités.</CardDescription>
          </CardHeader>
          <CardContent>
            {muscleChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={muscleChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {
                      muscleChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#FFC72C', '#10B981', '#F43F5E', '#3B82F6', '#6366F1'][index % 5]} />
                      ))
                    }
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-zinc-400">Aucune donnée d'entraînement pour le moment.</p>
            )}
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle>Dernier entraînement</CardTitle>
            <CardDescription>Un aperçu de votre dernière session.</CardDescription>
          </CardHeader>
          <CardContent>
            {state.history.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{state.history[0].workout.name}</span>
                  <span className="text-sm text-zinc-400">{new Date(state.history[0].date).toLocaleDateString()}</span>
                </div>
                <div className="space-y-2">
                  {state.history[0].exercises.map((ex, index) => (
                    <div key={index} className="flex items-center justify-between text-sm text-zinc-300">
                      <span>{ex.name}</span>
                      <span>{ex.setsCompleted} séries</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-zinc-400">Aucune donnée d'entraînement pour le moment.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Workouts = () => {
  const { state, setState, db, userId, appId } = useContext(AppContext);
  const [isNewWorkoutDialogOpen, setIsNewWorkoutDialogOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState({ name: "", exercises: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEquipment, setFilterEquipment] = useState("");
  const navigate = useNavigate();

  const handleAddWorkout = async () => {
    if (newWorkout.name.trim() === "" || newWorkout.exercises.length === 0) {
      toast.error("Veuillez donner un nom et ajouter au moins un exercice.");
      return;
    }
    const newWorkoutDoc = { ...newWorkout, id: uuidv4() };
    if (db && userId) {
      try {
        await setDoc(doc(db, `/artifacts/${appId}/users/${userId}/customWorkouts`, newWorkoutDoc.id), newWorkoutDoc);
        toast.success("Programme d'entraînement ajouté !");
        setNewWorkout({ name: "", exercises: [] });
        setIsNewWorkoutDialogOpen(false);
      } catch (e) {
        toast.error("Erreur lors de la sauvegarde du programme.");
        console.error("Error adding document: ", e);
      }
    } else {
      setState(s => ({
        ...s,
        customWorkouts: [...s.customWorkouts, newWorkoutDoc]
      }));
      toast.success("Programme d'entraînement ajouté (localement) !");
      setNewWorkout({ name: "", exercises: [] });
      setIsNewWorkoutDialogOpen(false);
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (db && userId) {
      try {
        await deleteDoc(doc(db, `/artifacts/${appId}/users/${userId}/customWorkouts`, id));
        toast.success("Programme d'entraînement supprimé !");
      } catch (e) {
        toast.error("Erreur lors de la suppression du programme.");
        console.error("Error deleting document: ", e);
      }
    } else {
      setState(s => ({
        ...s,
        customWorkouts: s.customWorkouts.filter(w => w.id !== id)
      }));
      toast.success("Programme d'entraînement supprimé (localement) !");
    }
  };

  const handleStartWorkout = (workout) => {
    setState(s => ({ ...s, currentWorkout: workout, activeSession: {
      exercises: workout.exercises.map(ex => ({ ...ex, setsCompleted: 0 })),
      currentExerciseIndex: 0,
      startTime: Date.now(),
      pausedTime: 0,
      isPaused: false,
    }}));
    navigate('/session');
  };

  const filteredExercises = exercises.filter(ex =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterEquipment === "" || ex.equipment.includes(filterEquipment))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Programmes d'entraînement</h2>
        <Dialog open={isNewWorkoutDialogOpen} onOpenChange={setIsNewWorkoutDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Nouveau Programme
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-zinc-950 text-white border-zinc-800">
            <DialogHeader>
              <DialogTitle>Créer un nouveau programme</DialogTitle>
              <DialogDescription>
                Créez un programme d'entraînement personnalisé.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nom
                </Label>
                <Input
                  id="name"
                  value={newWorkout.name}
                  onChange={(e) => setNewWorkout(prev => ({ ...prev, name: e.target.value }))}
                  className="col-span-3"
                />
              </div>
              <div className="space-y-2">
                <Label>Exercices</Label>
                <div className="max-h-32 overflow-y-auto rounded-md border border-zinc-700 p-2">
                  {newWorkout.exercises.map((ex, index) => (
                    <div key={index} className="flex items-center justify-between py-1 text-sm">
                      <span>{ex.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setNewWorkout(prev => ({
                          ...prev,
                          exercises: prev.exercises.filter((_, i) => i !== index)
                        }))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="search" className="text-right">Rechercher</Label>
                <Input
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="filter" className="text-right">Équipement</Label>
                <Select value={filterEquipment} onValueChange={setFilterEquipment}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Filtrer par équipement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Tous</SelectItem>
                      {equipmentList.map(eq => (
                        <SelectItem key={eq} value={eq}>{eq.charAt(0).toUpperCase() + eq.slice(1)}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto rounded-md border border-zinc-700">
              <ul className="divide-y divide-zinc-700">
                {filteredExercises.map(ex => (
                  <li key={ex.id} className="p-3 hover:bg-zinc-800 transition-colors cursor-pointer" onClick={() => setNewWorkout(prev => ({ ...prev, exercises: [...prev.exercises, ex] }))}>
                    <div className="font-semibold">{ex.name}</div>
                    <div className="text-xs text-zinc-400">Groupe musculaire: {ex.muscleGroup} | Équipement: {ex.equipment.join(", ")}</div>
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <Button onClick={handleAddWorkout}>Créer le programme</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="bg-zinc-800" />

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Programmes personnalisés</h3>
        {state.customWorkouts.length > 0 ? (
          <ul className="space-y-4">
            {state.customWorkouts.map(workout => (
              <li key={workout.id} className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-bold">{workout.name}</h4>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleStartWorkout(workout)}><PlayCircle className="h-5 w-5 text-green-400" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteWorkout(workout.id)}><Trash2 className="h-5 w-5 text-red-400" /></Button>
                  </div>
                </div>
                <p className="text-sm text-zinc-400 mb-2">{workout.exercises.length} exercices</p>
                <ul className="space-y-1">
                  {workout.exercises.map(ex => (
                    <li key={ex.id} className="text-sm text-zinc-300">
                      - {ex.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-zinc-400">Aucun programme personnalisé pour le moment. Créez-en un pour commencer !</p>
        )}
      </div>

      <Separator className="bg-zinc-800" />

      <div className="space-y-4">
        <h3 className="text-2xl font-semibold">Programmes générés automatiquement</h3>
        <Card className="bg-zinc-900/60 border-zinc-800">
          <CardHeader>
            <CardTitle>Générer un programme personnalisé</CardTitle>
            <CardDescription>
              Créez un programme d'entraînement adapté à votre profil actuel en un clic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Button onClick={() => handleStartWorkout(generateAutoWorkout(state.profile))}>
                <Dumbbell className="mr-2 h-4 w-4" /> Générer & Démarrer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Session = () => {
  const { state, setState, db, userId, appId } = useContext(AppContext);
  const navigate = useNavigate();
  const [session, setSession] = useState(state.activeSession);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let timer;
    if (session && !session.isPaused) {
      const startTime = Date.now() - session.pausedTime;
      timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [session]);

  const handleNextExercise = () => {
    setSession(s => ({
      ...s,
      currentExerciseIndex: s.currentExerciseIndex + 1,
    }));
  };

  const handleCompleteSet = () => {
    const updatedSession = { ...session };
    updatedSession.exercises[session.currentExerciseIndex].setsCompleted =
      (updatedSession.exercises[session.currentExerciseIndex].setsCompleted || 0) + 1;
    setSession(updatedSession);
    toast.success("Série terminée !");
  };

  const handleTogglePause = () => {
    if (session.isPaused) {
      setSession(s => ({ ...s, isPaused: false }));
    } else {
      setSession(s => ({ ...s, isPaused: true }));
    }
  };

  const handleFinishSession = async () => {
    const sessionDuration = elapsedTime;
    const caloriesBurned = calorieBurn(state.profile, state.currentWorkout);
    const newHistoryEntry = {
      date: Date.now(),
      workout: state.currentWorkout,
      duration: sessionDuration,
      caloriesBurned: caloriesBurned,
      exercises: session.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        setsCompleted: ex.setsCompleted || 0,
      })),
    };

    if (db && userId) {
      try {
        await setDoc(doc(collection(db, `/artifacts/${appId}/users/${userId}/history`)), newHistoryEntry);
        toast.success("Session enregistrée !");
      } catch (e) {
        toast.error("Erreur lors de la sauvegarde de la session.");
        console.error("Error adding document: ", e);
      }
    } else {
      setState(s => ({
        ...s,
        history: [...s.history, newHistoryEntry]
      }));
      toast.success("Session enregistrée (localement) !");
    }

    setState(s => ({ ...s, currentWorkout: null, activeSession: null }));
    navigate('/');
  };

  if (!session) {
    return <div className="text-center text-zinc-400">Aucune session en cours.</div>;
  }

  const currentExercise = session.exercises[session.currentExerciseIndex];
  const isLastExercise = session.currentExerciseIndex === session.exercises.length - 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{state.currentWorkout.name}</h2>
      </div>

      <Card className="bg-zinc-900/60 border-zinc-800">
        <CardHeader>
          <CardTitle>Session en cours</CardTitle>
          <CardDescription>Temps écoulé : {formatTime(elapsedTime)}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentExercise ? (
              <div>
                <h3 className="text-xl font-bold">{currentExercise.name}</h3>
                <p className="text-sm text-zinc-400">Série {currentExercise.setsCompleted + 1} sur {currentExercise.sets.length}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentExercise.sets.map((set, index) => (
                    <div key={index} className={`rounded-full px-3 py-1 text-xs font-semibold ${index < currentExercise.setsCompleted ? 'bg-green-500 text-white' : 'bg-zinc-700 text-zinc-300'}`}>
                      {set.reps} reps @ {set.weight}kg
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-center space-x-4">
                  <Button onClick={handleCompleteSet} variant="default" className="text-white bg-green-500 hover:bg-green-600">
                    Série Complète
                  </Button>
                  {isLastExercise ? (
                    <Button onClick={handleFinishSession} variant="secondary" className="bg-yellow-400 text-zinc-950 hover:bg-yellow-500">
                      Terminer
                    </Button>
                  ) : (
                    <Button onClick={handleNextExercise} variant="secondary" className="bg-yellow-400 text-zinc-950 hover:bg-yellow-500">
                      Exercice suivant <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-zinc-400">Session terminée. Appuyez sur Terminer pour enregistrer.</p>
            )}
            <div className="flex items-center justify-center mt-4">
              <Button onClick={handleTogglePause} variant="outline" className="mr-2">
                {session.isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button onClick={handleFinishSession} variant="destructive">
                <X className="h-4 w-4 mr-2" /> Annuler
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const History = () => {
  const { state } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Historique d'entraînement</h2>
      </div>
      <div className="space-y-4">
        {state.history.length > 0 ? (
          state.history.map(entry => (
            <Card key={entry.id} className="bg-zinc-900/60 border-zinc-800">
              <CardHeader className="flex-row justify-between items-center">
                <CardTitle>{entry.workout.name}</CardTitle>
                <CardDescription className="text-right">
                  <p>{new Date(entry.date).toLocaleDateString()}</p>
                  <p>{Math.floor(entry.duration / 60)} min</p>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-400">Calories brûlées : {entry.caloriesBurned}</p>
                <ul className="mt-2 space-y-1">
                  {entry.exercises.map((ex, index) => (
                    <li key={index} className="text-sm">
                      {ex.name}: {ex.setsCompleted} séries
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-zinc-400">Aucun historique d'entraînement pour le moment.</p>
        )}
      </div>
    </div>
  );
};

const SettingsComponent = () => { // Le nom du composant a été modifié pour éviter le conflit de déclaration.
  const { state, setState, db, userId, appId } = useContext(AppContext);
  const [profile, setProfile] = useState(state.profile);

  const handleSave = async () => {
    if (db && userId) {
      try {
        await setDoc(doc(db, `/artifacts/${appId}/users/${userId}/profile`, 'userProfile'), profile);
        toast.success("Profil mis à jour !");
      } catch (e) {
        toast.error("Erreur lors de la sauvegarde du profil.");
        console.error("Error saving profile: ", e);
      }
    } else {
      setState(s => ({ ...s, profile }));
      toast.success("Profil mis à jour (localement) !");
    }
  };

  const handleCalculateMacros = () => {
    const BMR_male = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * 30); // 30 ans
    const BMR_female = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * 30); // 30 ans
    const BMR = profile.gender === 'homme' ? BMR_male : BMR_female;

    const activityMultiplier = {
      "sédentaire": 1.2,
      "léger": 1.375,
      "modéré": 1.55,
      "intense": 1.725,
      "très-intense": 1.9,
    };
    const TDEE = BMR * (activityMultiplier[profile.activityLevel] || 1.55);
    let targetCalories = TDEE;
    if (profile.goal === 'perte-de-poids') {
      targetCalories -= 500;
    } else if (profile.goal === 'prise-de-masse') {
      targetCalories += 300;
    }

    const protein = profile.weight * (profile.goal === 'perte-de-poids' ? 2 : 1.5);
    const fat = targetCalories * 0.25 / 9;
    const carbs = (targetCalories - (protein * 4) - (fat * 9)) / 4;

    setProfile(p => ({
      ...p,
      calories: Math.round(targetCalories),
      macros: {
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat)
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Paramètres du profil</h2>
        <Button onClick={handleSave}>Enregistrer</Button>
      </div>
      <Separator className="bg-zinc-800" />
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Informations générales</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nom</Label>
            <Input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Genre</Label>
            <Select value={profile.gender} onValueChange={value => setProfile(p => ({ ...p, gender: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {genders.map(g => <SelectItem key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Poids ({profile.weight} kg)</Label>
            <Slider
              value={[profile.weight]}
              onValueChange={value => setProfile(p => ({ ...p, weight: value[0] }))}
              min={30}
              max={200}
              step={1}
            />
          </div>
          <div className="space-y-2">
            <Label>Taille ({profile.height} cm)</Label>
            <Slider
              value={[profile.height]}
              onValueChange={value => setProfile(p => ({ ...p, height: value[0] }))}
              min={100}
              max={250}
              step={1}
            />
          </div>
        </div>
      </div>
      <Separator className="bg-zinc-800" />
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Objectifs et activité</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Niveau</Label>
            <Select value={profile.level} onValueChange={value => setProfile(p => ({ ...p, level: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {levels.map(level => <SelectItem key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Objectif</Label>
            <Select value={profile.goal} onValueChange={value => setProfile(p => ({ ...p, goal: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre objectif" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {goals.map(goal => <SelectItem key={goal} value={goal}>{goal.charAt(0).toUpperCase() + goal.slice(1)}</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Niveau d'activité</Label>
          <Select value={profile.activityLevel} onValueChange={value => setProfile(p => ({ ...p, activityLevel: value }))}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez votre niveau d'activité" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {activityLevels.map(al => <SelectItem key={al.value} value={al.value}>{al.label}</SelectItem>)}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleCalculateMacros}>Calculer les calories & macros</Button>
        </div>
        <div className="space-y-2">
          <Label>Calories ({profile.calories} kcal)</Label>
          <Slider
            value={[profile.calories]}
            onValueChange={value => setProfile(p => ({ ...p, calories: value[0] }))}
            min={1000}
            max={5000}
            step={10}
          />
        </div>
      </div>
      <Separator className="bg-zinc-800" />
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Macro-nutriments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Protéines ({profile.macros.protein}g)</Label>
            <Input type="number" value={profile.macros.protein} onChange={e => setProfile(p => ({ ...p, macros: { ...p.macros, protein: parseInt(e.target.value) || 0 } }))} />
          </div>
          <div className="space-y-2">
            <Label>Glucides ({profile.macros.carbs}g)</Label>
            <Input type="number" value={profile.macros.carbs} onChange={e => setProfile(p => ({ ...p, macros: { ...p.macros, carbs: parseInt(e.target.value) || 0 } }))} />
          </div>
          <div className="space-y-2">
            <Label>Lipides ({profile.macros.fat}g)</Label>
            <Input type="number" value={profile.macros.fat} onChange={e => setProfile(p => ({ ...p, macros: { ...p.macros, fat: parseInt(e.target.value) || 0 } }))} />
          </div>
        </div>
      </div>
    </div>
  );
};

const RootLayout = () => (
  <div className="flex min-h-screen bg-zinc-950 text-white">
    <Sidebar />
    <main className="flex-1 p-8 overflow-y-auto">
      <Outlet />
    </main>
    <ToastContainer position="bottom-right" theme="dark" />
  </div>
);

const Sidebar = () => {
  const location = useLocation();

  const getNavLinkClass = (path) =>
    `flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors hover:bg-zinc-800 ${
      location.pathname === path ? 'bg-zinc-800 text-yellow-400' : 'text-zinc-400'
    }`;

  return (
    <aside className="w-64 bg-zinc-900/60 p-4 border-r border-zinc-800 flex flex-col items-center">
      <div className="mb-8 flex items-center space-x-2">
        <Dumbbell className="h-8 w-8 text-yellow-400" />
        <span className="text-xl font-bold">Fitness App</span>
      </div>
      <nav className="flex-1 w-full space-y-2">
        <NavLink to="/" className={getNavLinkClass('/')}>
          <LayoutDashboard className="h-5 w-5" />
          <span>Tableau de bord</span>
        </NavLink>
        <NavLink to="/workouts" className={getNavLinkClass('/workouts')}>
          <List className="h-5 w-5" />
          <span>Programmes</span>
        </NavLink>
        <NavLink to="/history" className={getNavLinkClass('/history')}>
          <Calendar className="h-5 w-5" />
          <span>Historique</span>
        </NavLink>
        <NavLink to="/settings" className={getNavLinkClass('/settings')}>
          <Settings className="h-5 w-5" />
          <span>Paramètres</span>
        </NavLink>
      </nav>
      <div className="text-center text-zinc-400 text-sm mt-4">
        ID d'utilisateur : <span className="text-zinc-500 break-all">{useContext(AppContext).userId || 'En cours...'}</span>
      </div>
    </aside>
  );
};

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="session" element={<Session />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<SettingsComponent />} /> {/* Le nom du composant a été mis à jour ici */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
