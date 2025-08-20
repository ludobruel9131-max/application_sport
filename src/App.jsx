import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, query, where, addDoc } from 'firebase/firestore';

// Icônes en SVG
const HomeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
);
const DumbbellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-dumbbell"><path d="M14.4 14.4L9.6 9.6"></path><path d="M18 7.2L16.8 6"></path><path d="M7.2 18L6 16.8"></path><path d="M21.6 4.8L19.2 2.4"></path><path d="M4.8 21.6L2.4 19.2"></path><path d="M22 14.8V19a2 2 0 0 1-2 2h-4.2"></path><path d="M14.8 2H19a2 2 0 0 1 2 2v4.2"></path><path d="M2 9.2V5a2 2 0 0 1 2-2h4.2"></path><path d="M9.2 22H5a2 2 0 0 1-2-2v-4.2"></path></svg>
);
const LibraryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
);
const ProgressIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-activity"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
);
const ProfileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);

const EXERCISES_DATA = [
  { name: 'Tractions (prises larges)', type: 'Dos', subType: 'Grand Dorsal', difficulty: 'Avancé' },
  { name: 'Développé couché haltères', type: 'Pectoraux', subType: 'Faisceau médian', difficulty: 'Intermédiaire' },
  { name: 'Squats', type: 'Jambes', subType: 'Quadriceps', difficulty: 'Débutant' },
  { name: 'Développé militaire', type: 'Épaules', subType: 'Deltoïde antérieur', difficulty: 'Intermédiaire' },
  { name: 'Curl (assis)', type: 'Bras', subType: 'Biceps', difficulty: 'Débutant' },
  { name: 'Burpees', type: 'Cardio & HIIT', subType: 'HIIT', difficulty: 'Avancé' },
  { name: 'Soulevé de terre', type: 'Dos', subType: 'Trapèzes et Rhomboïdes', difficulty: 'Avancé' },
  { name: 'Pompes (normales)', type: 'Pectoraux', subType: 'Faisceau médian', difficulty: 'Débutant' },
];

const Dashboard = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-yellow-400 mb-4">Vue d'ensemble</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-200">Progression</h3>
        <p className="mt-2 text-neutral-400">Graphique de progression hebdomadaire et mensuelle (à venir).</p>
      </div>
      <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-200">Séances</h3>
        <p className="mt-2 text-neutral-400">Résumé des séances du jour et de la semaine (à venir).</p>
      </div>
      <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-200">Calories</h3>
        <p className="mt-2 text-neutral-400">Compteur de calories brûlées (à venir).</p>
      </div>
    </div>
  </div>
);

const Workouts = ({ db, userId }) => {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    if (!db || !userId) return;

    const workoutCollectionRef = collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/users/${userId}/workouts`);
    const q = query(workoutCollectionRef);

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedWorkouts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setWorkouts(fetchedWorkouts);
    });

    return () => unsubscribe();
  }, [db, userId]);

  const addWorkout = async () => {
    if (!db || !userId) {
      console.error("Firebase non initialisé ou userId manquant.");
      return;
    }

    try {
      await addDoc(collection(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/users/${userId}/workouts`), {
        date: new Date(),
        exercise: "Nouvel exercice",
        sets: 3,
        reps: 10,
        weight: 50
      });
      console.log("Entraînement ajouté avec succès !");
    } catch (e) {
      console.error("Erreur lors de l'ajout de l'entraînement : ", e);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Mes Séances</h2>
      <button
        onClick={addWorkout}
        className="bg-amber-500 text-neutral-900 font-bold py-2 px-4 rounded-xl shadow-lg transition-transform transform hover:scale-105 mb-6"
      >
        Ajouter un entraînement
      </button>
      <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-200 mb-4">Historique</h3>
        {workouts.length > 0 ? (
          <ul className="space-y-4">
            {workouts.map(workout => (
              <li key={workout.id} className="bg-neutral-900 p-4 rounded-xl flex flex-col shadow-sm">
                <span className="text-lg font-medium text-neutral-200">{workout.exercise}</span>
                <div className="text-sm text-neutral-500 mt-1">
                  <p>Date: {workout.date.toDate().toLocaleDateString()}</p>
                  <p>Séries: {workout.sets}, Répétitions: {workout.reps}, Poids: {workout.weight}kg</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-neutral-400">Pas d'entraînements enregistrés. Ajoutez-en un !</p>
        )}
      </div>
    </div>
  );
};

const Library = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-yellow-400 mb-4">Catalogue d'Exercices</h2>
    <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl">
      <h3 className="text-xl font-semibold text-neutral-200 mb-4">Rechercher un exercice</h3>
      <input 
        type="text" 
        placeholder="Nom de l'exercice, groupe musculaire..."
        className="w-full p-3 mb-4 bg-neutral-900 text-neutral-200 rounded-xl border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
      />
      <ul className="space-y-4">
        {EXERCISES_DATA.map((ex, index) => (
          <li key={index} className="bg-neutral-900 p-4 rounded-xl flex flex-col shadow-sm">
            <span className="text-lg font-medium text-neutral-200">{ex.name}</span>
            <div className="flex justify-between items-center text-sm text-neutral-500 mt-1">
              <span>{ex.type} - {ex.subType}</span>
              <span>Difficulté: {ex.difficulty}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Progress = () => (
  <div className="p-6">
    <h2 className="text-2xl font-bold text-yellow-400 mb-4">Statistiques et Progression</h2>
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-200">Courbes de progression</h3>
        <p className="mt-2 text-neutral-400">Graphique de suivi du poids, des répétitions, etc. (à venir).</p>
      </div>
      <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-200">Historique</h3>
        <p className="mt-2 text-neutral-400">Historique complet des séances (à venir).</p>
      </div>
    </div>
  </div>
);

const Profile = ({ db, userId }) => {
  const [profile, setProfile] = useState({ name: '', age: '', goals: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!db || !userId) return;

    const userDocRef = doc(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/users/${userId}/profile/user_data`);

    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data());
      } else {
        setProfile({ name: 'Nouveau Guerrier', age: '', goals: 'Définissez vos objectifs' });
      }
    }, (error) => {
      console.error("Erreur lors de la récupération du profil :", error);
    });

    return () => unsubscribe();
  }, [db, userId]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!db || !userId) {
      setMessage("Erreur: Firebase non initialisé ou userId manquant.");
      return;
    }

    try {
      await setDoc(doc(db, `artifacts/${typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'}/users/${userId}/profile/user_data`), profile);
      setMessage("Profil mis à jour avec succès !");
    } catch (e) {
      console.error("Erreur lors de la sauvegarde du profil : ", e);
      setMessage("Erreur lors de la sauvegarde du profil.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Mon Profil</h2>
      <div className="bg-neutral-800 p-6 rounded-2xl shadow-xl">
        <h3 className="text-xl font-semibold text-neutral-200 mb-4">Informations personnelles</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-neutral-400">Nom</label>
            <input 
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-900 text-neutral-200 rounded-xl border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="age" className="block text-neutral-400">Âge</label>
            <input 
              type="number"
              id="age"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className="w-full p-3 bg-neutral-900 text-neutral-200 rounded-xl border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label htmlFor="goals" className="block text-neutral-400">Objectifs</label>
            <textarea
              id="goals"
              name="goals"
              value={profile.goals}
              onChange={handleChange}
              rows="4"
              className="w-full p-3 bg-neutral-900 text-neutral-200 rounded-xl border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-500 text-neutral-900 font-bold py-3 px-6 rounded-xl shadow-lg transition-transform transform hover:scale-105"
          >
            Sauvegarder
          </button>
        </form>
        {message && (
          <div className="mt-4 p-3 bg-green-500 text-white rounded-xl text-center">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    async function initFirebase() {
      try {
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const authToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        const app = initializeApp(firebaseConfig);
        const firebaseAuth = getAuth(app);
        const firestoreDb = getFirestore(app);

        setDb(firestoreDb);
        setAuth(firebaseAuth);

        const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            setLoading(false);
          } else {
            if (authToken) {
              await signInWithCustomToken(firebaseAuth, authToken);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          }
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Erreur lors de l'initialisation de Firebase :", error);
        setLoading(false);
      }
    }

    initFirebase();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-900">
        <div className="text-xl font-semibold text-neutral-400">Chargement...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard': return <Dashboard />;
      case 'workouts': return <Workouts db={db} userId={user?.uid} />;
      case 'library': return <Library />;
      case 'progress': return <Progress />;
      case 'profile': return <Profile db={db} userId={user?.uid} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 flex flex-col font-sans">
      
      {/* Barre de navigation supérieure pour le titre */}
      <header className="bg-neutral-800 p-6 shadow-lg">
        <h1 className="text-4xl font-extrabold text-center text-amber-500">
          LionFit
        </h1>
      </header>

      {/* Contenu principal de l'application */}
      <main className="flex-grow p-4 overflow-auto">
        {renderPage()}
      </main>

      {/* Barre de navigation inférieure */}
      <nav className="bg-neutral-800 p-4 shadow-2xl flex justify-around">
        <button onClick={() => setCurrentPage('dashboard')} className="flex flex-col items-center text-center p-2 rounded-xl transition-colors duration-300 hover:text-amber-500">
          <HomeIcon className="text-2xl mb-1" />
          <span className="text-xs">Accueil</span>
        </button>
        <button onClick={() => setCurrentPage('workouts')} className="flex flex-col items-center text-center p-2 rounded-xl transition-colors duration-300 hover:text-amber-500">
          <DumbbellIcon className="text-2xl mb-1" />
          <span className="text-xs">Séances</span>
        </button>
        <button onClick={() => setCurrentPage('library')} className="flex flex-col items-center text-center p-2 rounded-xl transition-colors duration-300 hover:text-amber-500">
          <LibraryIcon className="text-2xl mb-1" />
          <span className="text-xs">Exercices</span>
        </button>
        <button onClick={() => setCurrentPage('progress')} className="flex flex-col items-center text-center p-2 rounded-xl transition-colors duration-300 hover:text-amber-500">
          <ProgressIcon className="text-2xl mb-1" />
          <span className="text-xs">Progression</span>
        </button>
        <button onClick={() => setCurrentPage('profile')} className="flex flex-col items-center text-center p-2 rounded-xl transition-colors duration-300 hover:text-amber-500">
          <ProfileIcon className="text-2xl mb-1" />
          <span className="text-xs">Profil</span>
        </button>
      </nav>
      
      {/* Afficher l'ID de l'utilisateur à des fins de débogage */}
      <div className="fixed bottom-0 left-0 m-2 text-neutral-500 text-xs">
        ID Utilisateur : {user?.uid || 'N/A'}
      </div>
    </div>
  );
}
