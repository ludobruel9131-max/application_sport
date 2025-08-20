import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, onSnapshot, collection, addDoc } from 'firebase/firestore';

// Déclaration de variables globales pour satisfaire le linter
// Le Canvas fournira les valeurs réelles au moment de l'exécution
const __app_id = '';
const __firebase_config = '{}';
const __initial_auth_token = '';

// Composant principal de l'application
export default function App() {
  const [appId, setAppId] = useState(null);
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [sports, setSports] = useState([]);
  const [newSportName, setNewSportName] = useState('');
  const [loading, setLoading] = useState(true);

  // Hook useEffect pour gérer l'initialisation et l'authentification de Firebase.
  useEffect(() => {
    async function initFirebase() {
      try {
        // Récupérer les variables globales fournies par l'environnement Canvas.
        const providedAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
        const authToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;
        
        // Initialiser l'application et les services Firebase.
        const app = initializeApp(firebaseConfig);
        const firestoreDb = getFirestore(app);
        const firebaseAuth = getAuth(app);
        
        // Mettre à jour l'état avec les services initialisés et l'ID de l'application.
        setAppId(providedAppId);
        setDb(firestoreDb);

        // Écouter les changements d'état d'authentification. C'est la méthode recommandée.
        const unsubscribe = onAuthStateChanged(firebaseAuth, async (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
            setLoading(false); // L'utilisateur est authentifié, on peut arrêter le chargement
          } else {
            // Si l'utilisateur n'est pas connecté, le connecter avec le jeton personnalisé ou de manière anonyme.
            if (authToken) {
              await signInWithCustomToken(firebaseAuth, authToken);
            } else {
              await signInAnonymously(firebaseAuth);
            }
          }
        });

        // Nettoyer l'écouteur lorsque le composant est démonté.
        return () => unsubscribe();

      } catch (error) {
        console.error("Erreur lors de l'initialisation de Firebase :", error);
        setLoading(false); // Arrêter le chargement même en cas d'erreur.
      }
    }

    initFirebase();
  }, [auth]); // Le tableau de dépendances vide signifie que cet effet ne s'exécute qu'une seule fois au montage.

  // Utiliser un autre useEffect pour récupérer et s'abonner aux changements de données une fois l'utilisateur authentifié.
  useEffect(() => {
    // Nous n'attachons l'écouteur Firestore que si `db` et `user` sont disponibles.
    if (db && user) {
      // Définir le chemin de la collection pour les données privées.
      const sportsCollectionPath = `artifacts/${appId}/users/${user.uid}/sports`;
      const sportsRef = collection(db, sportsCollectionPath);
      
      // Mettre en place un écouteur en temps réel avec onSnapshot.
      const unsubscribe = onSnapshot(sportsRef, (snapshot) => {
        const sportsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        // Trier les sports par ordre alphabétique.
        sportsData.sort((a, b) => a.name.localeCompare(b.name));
        setSports(sportsData);
      }, (error) => {
        console.error("Erreur lors de la récupération des données de sports :", error);
      });

      // Nettoyer l'écouteur lorsque le composant est démonté ou que les dépendances changent.
      return () => unsubscribe();
    }
  }, [db, user, appId]); // Réexécuter cet effet si db, user, ou appId changent.

  // Fonction pour ajouter un nouveau sport à Firestore.
  const handleAddSport = async () => {
    if (!newSportName.trim()) {
      // Utilisez une boîte de dialogue personnalisée au lieu de `alert()`
      // pour une meilleure expérience utilisateur.
      console.log("Veuillez entrer un nom de sport.");
      return;
    }
    
    if (!db || !user) {
      console.error("Firestore ou l'utilisateur n'est pas prêt.");
      return;
    }

    try {
      const sportsCollectionPath = `artifacts/${appId}/users/${user.uid}/sports`;
      await addDoc(collection(db, sportsCollectionPath), {
        name: newSportName,
        createdAt: new Date().toISOString(),
      });
      setNewSportName(''); // Vider le champ de saisie après l'ajout.
    } catch (error) {
      console.error("Erreur lors de l'ajout du document : ", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-xl font-semibold text-slate-700">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-extrabold text-center text-slate-800 mb-8">Ma liste d'activités sportives</h1>
        
        {/* Section d'entrée et de bouton d'ajout */}
        <div className="flex space-x-4 mb-8">
          <input
            type="text"
            className="flex-grow p-4 border border-slate-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-300 shadow-sm"
            placeholder="Ajouter un nouveau sport..."
            value={newSportName}
            onChange={(e) => setNewSportName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddSport();
              }
            }}
          />
          <button
            onClick={handleAddSport}
            className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
          >
            Ajouter
          </button>
        </div>
        
        {/* Section de la liste de sports */}
        {sports.length > 0 ? (
          <ul className="space-y-4">
            {sports.map((sport) => (
              <li
                key={sport.id}
                className="bg-slate-100 p-5 rounded-xl shadow-md flex items-center justify-between transition-transform transform hover:scale-105 duration-300"
              >
                <span className="text-slate-800 text-lg font-medium">{sport.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 p-8 rounded-xl bg-slate-100">Aucun sport ajouté pour l'instant. Commencez par en ajouter un ci-dessus !</p>
        )}

      </div>
      {/* Afficher l'ID de l'utilisateur à des fins de débogage et de collaboration */}
      <div className="mt-6 text-slate-600 text-sm">
        ID Utilisateur : <span className="font-mono bg-slate-200 rounded px-2 py-1">{user?.uid || 'N/A'}</span>
      </div>
    </div>
  );
}
