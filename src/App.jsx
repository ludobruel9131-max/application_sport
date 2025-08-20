import React, { useState, useEffect, createContext, useContext } from "react";
import { BrowserRouter, Routes, Route, Outlet, NavLink, useParams, useNavigate, useLocation } from "react-router-dom";
import { Dumbbell, User, PlusCircle, Settings, LayoutDashboard, ChevronRight, Trash2, Pause, Play, RotateCcw, Star, Search, Filter, Trophy, BookOpenText, BarChart2, Home, BarChart, Calendar, List, X, PlayCircle, Clock, ChevronDown, Check } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { v4 as uuidv4 } from 'uuid';

// Imports Firebase
import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot, collection, query, where, getDocs, updateDoc, deleteDoc } from "firebase/firestore";

// Imports Radix UI et d'autres utilitaires
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as SliderPrimitive from "@radix-ui/react-slider";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";


// Les composants UI sont maintenant inclus directement dans le fichier App.jsx pour éviter les erreurs d'importation.

// Utility function for Tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Composants Shadcn UI
const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <div
      ref={ref}
      role={decorative ? "none" : undefined}
      className={cn(
        "shrink-0 bg-zinc-800",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

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
  
  // Utilisation de la variable d'environnement Netlify en fallback
  const appId = typeof __app_id !== 'undefined' ? __app_id : process.env.VITE_APP_ID || 'default-app-id';

  useEffect(() => {
    const initialize = async () => {
      // Utilisation des variables d'environnement pour une meilleure compatibilité avec les différents environnements de build (Netlify)
      const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : JSON.parse(process.env.VITE_FIREBASE_CONFIG || '{}');
      const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : process.env.VITE_INITIAL_AUTH_TOKEN || null;

      if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
        try {
          const app = initializeApp(firebaseConfig);
          const auth = getAuth(app);
          const db = getFirestore(app);
          setDb(db);
          setAuth(auth);
          if (initialAuthToken) {
            const userAuth = await signInWithCustomToken(auth, initialAuthToken);
            setUserId(userAuth.user.uid);
          } else {
            await signInAnonymously(auth);
            setUserId(auth.currentUser.uid);
          }
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
                <Select
                  value={filterEquipment}
                  onValueChange={setFilterEquipment}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Filtrer par équipement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="">Tout</SelectItem>
                      {equipmentList.map(eq => (
                        <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="max-h-48 overflow-y-auto rounded-md border border-zinc-700 p-2">
                {filteredExercises.length > 0 ? (
                  filteredExercises.map(ex => (
                    <div key={ex.id} className="flex items-center justify-between py-1 text-sm text-zinc-300 hover:bg-zinc-800 rounded-md px-2 transition-colors">
                      <span>{ex.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setNewWorkout(prev => ({
                          ...prev,
                          exercises: [...prev.exercises, ex]
                        }))}
                      >
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-zinc-400">Aucun exercice trouvé.</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Annuler</Button>
              </DialogClose>
              <Button onClick={handleAddWorkout}>Créer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold">Vos programmes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {state.customWorkouts.length > 0 ? (
            state.customWorkouts.map(workout => (
              <Card key={workout.id} className="bg-zinc-900/60 border-zinc-800 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-lg">{workout.name}</h4>
                  <div className="flex items-center space-x-2">
                    <Button variant="destructive" size="icon" onClick={() => handleDeleteWorkout(workout.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={() => handleStartWorkout(workout)}>
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ul className="text-sm text-zinc-400 space-y-1">
                  {workout.exercises.map((ex, index) => (
                    <li key={index} className="flex items-center">
                      <ChevronRight className="h-4 w-4 mr-2" /> {ex.name}
                    </li>
                  ))}
                </ul>
              </Card>
            ))
          ) : (
            <p className="text-zinc-400">Aucun programme personnalisé. Créez-en un nouveau !</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Session = () => {
  const { state, setState, db, userId, appId } = useContext(AppContext);
  const navigate = useNavigate();
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    if (!state.activeSession || state.activeSession.isPaused) return;

    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - state.activeSession.startTime) / 1000) - state.activeSession.pausedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [state.activeSession]);

  const handleNextExercise = () => {
    setState(s => {
      const newSession = { ...s.activeSession };
      newSession.currentExerciseIndex += 1;
      if (newSession.currentExerciseIndex >= newSession.exercises.length) {
        // Fin de l'entraînement
        saveSession();
        return { ...s, activeSession: null, currentWorkout: null };
      }
      return { ...s, activeSession: newSession };
    });
  };

  const handlePause = () => {
    setState(s => {
      const newSession = { ...s.activeSession, isPaused: true };
      return { ...s, activeSession: newSession };
    });
  };

  const handleResume = () => {
    setState(s => {
      const newSession = { ...s.activeSession, isPaused: false };
      return { ...s, activeSession: newSession };
    });
  };

  const saveSession = async () => {
    const workoutToSave = {
      workout: state.currentWorkout,
      date: Date.now(),
      duration: sessionTime,
      exercises: state.activeSession.exercises,
      caloriesBurned: calorieBurn(state.profile, state.currentWorkout),
    };

    if (db && userId) {
      try {
        await setDoc(doc(db, `/artifacts/${appId}/users/${userId}/history`, uuidv4()), workoutToSave);
        toast.success("Session d'entraînement sauvegardée !");
      } catch (e) {
        toast.error("Erreur lors de la sauvegarde de la session.");
        console.error("Error adding document: ", e);
      }
    } else {
      setState(s => ({
        ...s,
        history: [...s.history, workoutToSave],
      }));
      toast.success("Session d'entraînement sauvegardée (localement) !");
    }
    navigate('/dashboard');
  };

  if (!state.activeSession) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h2 className="text-2xl font-bold">Aucune session active</h2>
        <Button onClick={() => navigate('/workouts')}>
          <List className="mr-2 h-4 w-4" /> Voir les programmes
        </Button>
      </div>
    );
  }

  const currentExercise = state.activeSession.exercises[state.activeSession.currentExerciseIndex];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 p-6">
      <h2 className="text-4xl font-bold">{state.currentWorkout.name}</h2>
      <div className="text-6xl font-extrabold text-yellow-400">{formatTime(sessionTime)}</div>
      <Card className="bg-zinc-900/60 border-zinc-800 w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">{currentExercise.name}</CardTitle>
          <CardDescription>
            <span className="font-semibold text-white">{currentExercise.setsCompleted} / {currentExercise.sets.length} séries terminées</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-center text-zinc-300">
            {currentExercise.sets.map((set, index) => (
              <li key={index}>{set.reps} répétitions à {set.weight} kg</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="justify-center gap-4">
          <Button onClick={() => handleNextExercise()}>
            <Check className="mr-2 h-4 w-4" /> Marquer comme terminé
          </Button>
        </CardFooter>
      </Card>
      <div className="flex space-x-4">
        {state.activeSession.isPaused ? (
          <Button variant="secondary" onClick={handleResume}>
            <PlayCircle className="mr-2 h-4 w-4" /> Reprendre
          </Button>
        ) : (
          <Button variant="secondary" onClick={handlePause}>
            <Pause className="mr-2 h-4 w-4" /> Pause
          </Button>
        )}
        <Button variant="destructive" onClick={saveSession}>
          <X className="mr-2 h-4 w-4" /> Arrêter et sauvegarder
        </Button>
      </div>
    </div>
  );
};

const History = () => {
  const { state } = useContext(AppContext);
  const { history } = state;

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Historique d'entraînement</h2>
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map(session => (
            <Card key={session.id} className="bg-zinc-900/60 border-zinc-800 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">{session.workout.name}</h4>
                <span className="text-sm text-zinc-400">
                  {new Date(session.date).toLocaleDateString()} - {Math.floor(session.duration / 60)} min
                </span>
              </div>
              <ul className="text-sm text-zinc-400 space-y-1">
                {session.exercises.map((ex, index) => (
                  <li key={index} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mr-2" /> {ex.name} ({ex.setsCompleted} séries)
                  </li>
                ))}
              </ul>
              <div className="mt-2 text-right text-xs text-zinc-500">
                Calories brûlées estimées : {session.caloriesBurned} kcal
              </div>
            </Card>
          ))
        ) : (
          <p className="text-zinc-400 text-center">Aucune session enregistrée pour le moment.</p>
        )}
      </div>
    </div>
  );
};

const Profile = () => {
  const { state, setState, db, userId, appId } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState(state.profile);

  const handleUpdateProfile = async () => {
    if (db && userId) {
      try {
        await setDoc(doc(db, `/artifacts/${appId}/users/${userId}/profile`, 'userProfile'), profileForm);
        toast.success("Profil mis à jour !");
        setIsEditing(false);
      } catch (e) {
        toast.error("Échec de la mise à jour du profil.");
        console.error("Error updating profile: ", e);
      }
    } else {
      setState(s => ({ ...s, profile: profileForm }));
      toast.success("Profil mis à jour (localement) !");
      setIsEditing(false);
    }
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setProfileForm(prev => ({ ...prev, [id]: value }));
  };

  const handleGoalChange = (value) => {
    setProfileForm(prev => ({ ...prev, goal: value }));
  };

  const handleLevelChange = (value) => {
    setProfileForm(prev => ({ ...prev, level: value }));
  };

  const handleGenderChange = (value) => {
    setProfileForm(prev => ({ ...prev, gender: value }));
  };

  const handleActivityChange = (value) => {
    setProfileForm(prev => ({ ...prev, activityLevel: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Mon Profil</h2>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? 'destructive' : 'default'}>
          {isEditing ? 'Annuler' : 'Modifier le profil'}
        </Button>
      </div>

      <Card className="bg-zinc-900/60 border-zinc-800 p-6 space-y-4">
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={profileForm.name} onChange={handleFormChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal">Objectif</Label>
                <Select value={profileForm.goal} onValueChange={handleGoalChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {goals.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <Select value={profileForm.level} onValueChange={handleLevelChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {levels.map(l => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Sexe</Label>
                <Select value={profileForm.gender} onValueChange={handleGenderChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {genders.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input id="weight" type="number" value={profileForm.weight} onChange={handleFormChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Taille (cm)</Label>
                <Input id="height" type="number" value={profileForm.height} onChange={handleFormChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="activityLevel">Niveau d'activité</Label>
                <Select value={profileForm.activityLevel} onValueChange={handleActivityChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {activityLevels.map(al => <SelectItem key={al.value} value={al.value}>{al.label}</SelectItem>)}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleUpdateProfile} className="w-full">Sauvegarder les modifications</Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-zinc-300">
              <div><span className="font-semibold text-white">Nom :</span> {state.profile.name}</div>
              <div><span className="font-semibold text-white">Niveau :</span> {state.profile.level}</div>
              <div><span className="font-semibold text-white">Objectif :</span> {state.profile.goal}</div>
              <div><span className="font-semibold text-white">Sexe :</span> {state.profile.gender}</div>
              <div><span className="font-semibold text-white">Poids :</span> {state.profile.weight} kg</div>
              <div><span className="font-semibold text-white">Taille :</span> {state.profile.height} cm</div>
              <div><span className="font-semibold text-white">Niveau d'activité :</span> {state.profile.activityLevel}</div>
            </div>
          </div>
        )}
      </Card>
      <div className="bg-zinc-900/60 border-zinc-800 p-6 rounded-xl space-y-4">
        <h3 className="text-xl font-bold">Informations Nutritionnelles</h3>
        <p className="text-zinc-300">Basées sur votre profil :</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-950 border-zinc-800 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{state.profile.calories}</div>
            <p className="text-sm text-zinc-400">Calories</p>
          </Card>
          <Card className="bg-zinc-950 border-zinc-800 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{state.profile.macros.protein}g</div>
            <p className="text-sm text-zinc-400">Protéines</p>
          </Card>
          <Card className="bg-zinc-950 border-zinc-800 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{state.profile.macros.carbs}g</div>
            <p className="text-sm text-zinc-400">Glucides</p>
          </Card>
          <Card className="bg-zinc-950 border-zinc-800 p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{state.profile.macros.fat}g</div>
            <p className="text-sm text-zinc-400">Lipides</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const { state, userId } = useContext(AppContext);
  const location = useLocation();

  const getTitle = () => {
    switch(location.pathname) {
      case '/dashboard':
        return 'Tableau de bord';
      case '/workouts':
        return 'Programmes';
      case '/session':
        return state.currentWorkout?.name || 'Session';
      case '/history':
        return 'Historique';
      case '/profile':
        return 'Profil';
      default:
        return 'Sport App';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-zinc-950/80 border-b border-zinc-800">
      <div className="container h-16 flex items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Dumbbell className="h-6 w-6 text-yellow-400" />
          <h1 className="font-bold text-xl">{getTitle()}</h1>
        </div>
        <div className="text-sm text-zinc-500">
          ID utilisateur : {userId ? userId.substring(0, 8) + '...' : 'Non connecté'}
        </div>
      </div>
    </header>
  );
};

const Sidebar = () => {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-zinc-800 bg-zinc-950 px-4 py-8 md:flex">
      <div className="mb-6 flex items-center justify-center">
        <Dumbbell className="h-10 w-10 text-yellow-400" />
      </div>
      <nav className="flex-1 space-y-2">
        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-yellow-400 text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800'}`}>
          <LayoutDashboard className="h-5 w-5 mr-3" />
          Tableau de bord
        </NavLink>
        <NavLink to="/workouts" className={({ isActive }) => `flex items-center px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-yellow-400 text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800'}`}>
          <List className="h-5 w-5 mr-3" />
          Programmes
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `flex items-center px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-yellow-400 text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800'}`}>
          <BarChart className="h-5 w-5 mr-3" />
          Historique
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `flex items-center px-4 py-2 rounded-md transition-colors ${isActive ? 'bg-yellow-400 text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800'}`}>
          <User className="h-5 w-5 mr-3" />
          Profil
        </NavLink>
      </nav>
    </aside>
  );
};

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col md:pl-64">
      <Header />
      <Sidebar />
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="session" element={<Session />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="dark" />
    </AppProvider>
  );
}

export default App;
