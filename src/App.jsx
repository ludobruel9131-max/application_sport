import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Loader2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Composant principal de l'application.
 * Gère l'état de l'application, le formulaire de saisie et la génération du programme d'entraînement.
 */
function App() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('recomposition musculaire (perte de graisse et gain musculaire esthétique)');
  const [workoutData, setWorkoutData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true);

  /**
   * Appelle l'API Gemini pour générer un programme d'entraînement basé sur les informations de l'utilisateur.
   */
  const generateWorkoutPlan = async () => {
    setLoading(true);
    setIsFormVisible(false);
    
    // Configuration de l'API et du modèle
    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    // Prompt pour l'API
    const userPrompt = `Générer un plan d'entraînement de 4 semaines en JSON pour une personne de ${age} ans, ${height}cm, et ${weight}kg. L'objectif est la ${goal}. Le programme doit être inspiré par la science et les meilleures pratiques de musculation (par ex. hypertrophie, force, volume, etc.). Chaque semaine doit avoir un programme différent pour éviter la stagnation. Le plan doit travailler tous les principaux groupes musculaires. Chaque exercice doit avoir un nom, un nombre de séries, et un nombre de répétitions. Inclure une courte description pour chaque semaine, avec un accent sur la progression. Par exemple, la semaine 1 peut se concentrer sur l'établissement d'une base, et la semaine 2 sur l'augmentation du volume. Le format JSON attendu est un tableau d'objets, où chaque objet représente une semaine.`;

    // Schéma JSON pour la réponse structurée
    const responseSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          week: { "type": "NUMBER" },
          description: { "type": "STRING" },
          workouts: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                day: { "type": "STRING" },
                exercises: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      name: { "type": "STRING" },
                      sets: { "type": "NUMBER" },
                      reps: { "type": "STRING" }
                    }
                  }
                }
              }
            }
          }
        },
        "propertyOrdering": ["week", "description", "workouts"]
      }
    };
    
    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: userPrompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema
      }
    };
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const result = await response.json();
      const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (rawJson) {
        const parsedJson = JSON.parse(rawJson);
        setWorkoutData(parsedJson);
      } else {
        toast.error("Erreur de génération. Veuillez réessayer.");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API Gemini:", error);
      toast.error("Échec de la connexion à l'API. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gère la soumission du formulaire pour valider les données et lancer la génération.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!age || !height || !weight) {
      toast.error("Veuillez remplir tous les champs.");
      return;
    }
    generateWorkoutPlan();
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-amber-100 p-8">
      {isFormVisible && (
        <div className="max-w-xl mx-auto w-full">
          <Card className="bg-zinc-900 border-zinc-800 text-amber-100 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Créez votre programme sur mesure</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="age">Votre âge (ans)</Label>
                    <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-amber-100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Taille (cm)</Label>
                    <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-amber-100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Poids (kg)</Label>
                    <Input id="weight" type="number" value={weight} onChange={(e) => setWeight(e.target.value)} required className="bg-zinc-800 border-zinc-700 text-amber-100" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Votre objectif</Label>
                  <Input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} className="bg-zinc-800 border-zinc-700 text-amber-100" />
                </div>
                <div className="flex justify-center">
                  <Button type="submit" className="w-full md:w-auto bg-amber-600 text-zinc-950 hover:bg-amber-700 font-bold py-2 px-4 rounded-lg shadow-lg">
                    Générer mon programme
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
          <p className="text-xl text-amber-100">Génération de votre programme...</p>
        </div>
      )}

      {workoutData && !loading && (
        <div className="space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-amber-500">Votre programme personnalisé</h1>
            <p className="mt-2 text-amber-200">Généré pour votre profil : {age} ans, {height}cm, {weight}kg</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {workoutData.map((week, index) => (
              <Card key={index} className="bg-zinc-900 border-zinc-800 text-amber-100 flex flex-col h-full">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-amber-100">Semaine {week.week}</CardTitle>
                  <p className="text-sm text-zinc-400">{week.description}</p>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                  {week.workouts.map((day, dayIndex) => (
                    <div key={dayIndex} className="mb-4 last:mb-0">
                      <h3 className="text-lg font-semibold text-amber-100">{day.day}</h3>
                      <ul className="list-disc list-inside space-y-1 mt-1">
                        {day.exercises.map((exercise, exerciseIndex) => (
                          <li key={exerciseIndex} className="text-sm text-amber-200">
                            <span className="font-medium">{exercise.name}</span>: {exercise.sets} séries de {exercise.reps} répétitions
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button onClick={() => setIsFormVisible(true)} className="bg-amber-600 text-zinc-950 hover:bg-amber-700 font-bold py-2 px-4 rounded-lg shadow-lg">
              Générer un nouveau programme
            </Button>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;
