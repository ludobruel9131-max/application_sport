import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Dashboard from './components/Dashboard';
import CustomWorkout from './components/CustomWorkout';
import { Home, Dumbbell, Book, BarChart3, Settings } from 'lucide-react';

function Programmes() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Programmes d'entraînement</h2>
      <p>Cette page affichera vos programmes personnalisés.</p>
    </div>
  );
}

function Bibliotheque() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Bibliothèque d'exercices</h2>
      <p>Cette page contiendra une liste d'exercices.</p>
    </div>
  );
}

function Statistiques() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Statistiques</h2>
      <p>Cette page affichera vos progrès et vos performances.</p>
    </div>
  );
}

function Reglages() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold">Réglages</h2>
      <p>Cette page vous permettra de modifier les paramètres de l'application.</p>
    </div>
  );
}

const Sidebar = () => (
  <nav className="w-64 bg-zinc-800 text-white flex flex-col p-4">
    <div className="text-2xl font-bold mb-8">FitApp</div>
    <ul className="space-y-2">
      <li>
        <Link to="/" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200">
          <Home className="h-5 w-5" />
          <span>Accueil</span>
        </Link>
      </li>
      <li>
        <Link to="/programmes" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200">
          <Dumbbell className="h-5 w-5" />
          <span>Programmes</span>
        </Link>
      </li>
      <li>
        <Link to="/bibliotheque" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200">
          <Book className="h-5 w-5" />
          <span>Bibliothèque</span>
        </Link>
      </li>
      <li>
        <Link to="/statistiques" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200">
          <BarChart3 className="h-5 w-5" />
          <span>Statistiques</span>
        </Link>
      </li>
      <li>
        <Link to="/reglages" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-zinc-700 transition-colors duration-200">
          <Settings className="h-5 w-5" />
          <span>Réglages</span>
        </Link>
      </li>
    </ul>
  </nav>
);

const AppContent = () => (
  <div className="flex w-full min-h-screen bg-zinc-900 text-zinc-50">
    <Sidebar />
    <div className="flex-1 p-8 overflow-auto">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/programmes" element={<Programmes />} />
        <Route path="/bibliotheque" element={<Bibliotheque />} />
        <Route path="/statistiques" element={<Statistiques />} />
        <Route path="/reglages" element={<Reglages />} />
      </Routes>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
