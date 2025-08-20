import React, { useState } from 'react';
import { Settings, User, Trophy, BarChart, BookOpen, Heart } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CustomWorkout from './components/CustomWorkout';
import WorkoutPrograms from './components/WorkoutPrograms';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Composants de substitution pour les onglets manquants
const Placeholder = ({ title }) => (
  <div className="flex items-center justify-center h-full">
    <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
  </div>
);

const UserProfile = () => <Placeholder title="Profil d'utilisateur" />;
const WorkoutLibrary = () => <Placeholder title="Bibliothèque d'exercices" />;
const Statistics = () => <Placeholder title="Statistiques" />;
const SettingsPage = () => <Placeholder title="Réglages" />;

// Composant principal de l'application
function App() {
  const [activeTab, setActiveTab] = useState('accueil');

  const renderContent = () => {
    switch (activeTab) {
      case 'accueil':
        return <Dashboard />;
      case 'programmes':
        return <WorkoutPrograms />;
      case 'bibliotheque':
        return <WorkoutLibrary />;
      case 'statistiques':
        return <Statistics />;
      case 'reglages':
        return <SettingsPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Barre de navigation latérale */}
      <aside className="w-64 bg-white p-4 shadow-lg flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-8">FitApp</h1>
        <nav className="flex flex-col space-y-2 w-full">
          <Button
            variant={activeTab === 'accueil' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('accueil')}
            className="w-full justify-start gap-2"
          >
            <Heart className="h-4 w-4" />
            Accueil
          </Button>
          <Button
            variant={activeTab === 'programmes' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('programmes')}
            className="w-full justify-start gap-2"
          >
            <Trophy className="h-4 w-4" />
            Programmes
          </Button>
          <Button
            variant={activeTab === 'bibliotheque' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('bibliotheque')}
            className="w-full justify-start gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Bibliothèque
          </Button>
          <Button
            variant={activeTab === 'statistiques' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('statistiques')}
            className="w-full justify-start gap-2"
          >
            <BarChart className="h-4 w-4" />
            Statistiques
          </Button>
        </nav>
        <div className="mt-auto flex flex-col w-full space-y-2">
           <CustomWorkout />
          <Button
            variant={activeTab === 'reglages' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('reglages')}
            className="w-full justify-start gap-2"
          >
            <Settings className="h-4 w-4" />
            Réglages
          </Button>
          <Button
            variant={activeTab === 'profil' ? 'secondary' : 'ghost'}
            onClick={() => setActiveTab('profil')}
            className="w-full justify-start gap-2"
          >
            <User className="h-4 w-4" />
            Profil
          </Button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        {renderContent()}
      </main>
       <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
