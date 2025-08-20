import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Loader2, XCircle, Calendar, List } from 'lucide-react';

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
  const [error, setError] = useState(null);
  const [view, setView] = useState('list'); // 'list' ou 'calendar'
  const [restDays, setRestDays] = useState([0, 6]); // 0 = Dimanche, 1 = Lundi, ..., 6 = Samedi

  // Mettez à jour le programme lorsque les jours de repos changent
  useEffect(() => {
    if (workoutData) {
      regenerateWorkoutLayout();
    }
  }, [restDays]);

  /**
   * Appelle l'API Gemini pour générer un programme d'entraînement basé sur les informations de l'utilisateur.
   */
  const generateWorkoutPlan = async () => {
    setLoading(true);
    setIsFormVisible(false);
    setError(null);
    setWorkoutData(null);
    
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
        setError("Erreur de génération. Veuillez réessayer.");
      }
    } catch (err) {
      console.error("Erreur lors de l'appel à l'API Gemini:", err);
      setError("Échec de la connexion à l'API. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Re-distribue les entraînements en fonction des jours de repos sélectionnés
   */
  const regenerateWorkoutLayout = () => {
    if (!workoutData) return;

    const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const workoutsPerWeek = workoutData[0]?.workouts.length;
    const trainingDaysCount = 7 - restDays.length;
    
    // Si le nombre d'entraînements générés ne correspond pas au nombre de jours d'entraînement disponibles,
    // on ne peut pas redistribuer. On laisse le programme tel quel pour l'instant.
    if (workoutsPerWeek !== trainingDaysCount) {
      console.warn("Le nombre de jours d'entraînement générés ne correspond pas au nombre de jours disponibles.");
      return;
    }

    const newWorkoutData = workoutData.map(week => {
      const newWorkouts = [];
      let workoutIndex = 0;
      
      for (let i = 0; i < 7; i++) {
        if (restDays.includes(i)) {
          newWorkouts.push({ day: daysOfWeek[i], exercises: [] }); // Jour de repos
        } else {
          // Si le programme généré a plus de jours que le nombre de jours d'entraînement disponibles,
          // on peut potentiellement en ignorer certains.
          if (workoutIndex < week.workouts.length) {
             newWorkouts.push({ ...week.workouts[workoutIndex], day: daysOfWeek[i] });
             workoutIndex++;
          }
        }
      }
      return { ...week, workouts: newWorkouts };
    });
    setWorkoutData(newWorkoutData);
  };

  /**
   * Gère la soumission du formulaire pour valider les données et lancer la génération.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!age || !height || !weight) {
      setError("Veuillez remplir tous les champs.");
      return;
    }
    generateWorkoutPlan();
  };

  /**
   * Gère le basculement d'un jour de repos.
   * @param {number} dayIndex - L'index du jour de la semaine (0-6).
   */
  const handleToggleRestDay = (dayIndex) => {
    setRestDays(prevRestDays => {
      if (prevRestDays.includes(dayIndex)) {
        return prevRestDays.filter(day => day !== dayIndex);
      } else {
        return [...prevRestDays, dayIndex].sort((a, b) => a - b);
      }
    });
  };

  const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

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

      {error && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <XCircle className="h-12 w-12 text-red-500" />
          <p className="text-xl text-red-500">{error}</p>
          <Button onClick={() => { setIsFormVisible(true); setError(null); }} className="bg-amber-600 text-zinc-950 hover:bg-amber-700 font-bold py-2 px-4 rounded-lg shadow-lg">
            Réessayer
          </Button>
        </div>
      )}

      {workoutData && !loading && !error && (
        <div className="space-y-8">
          <div className="flex justify-center mb-6">
            <Button onClick={() => setView('list')} className={`mr-2 ${view === 'list' ? 'bg-amber-600' : 'bg-zinc-700'} text-zinc-950 hover:bg-amber-700 font-bold`}>
              <List className="mr-2" /> Vue en liste
            </Button>
            <Button onClick={() => setView('calendar')} className={`${view === 'calendar' ? 'bg-amber-600' : 'bg-zinc-700'} text-zinc-950 hover:bg-amber-700 font-bold`}>
              <Calendar className="mr-2" /> Vue calendrier
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <h3 className="text-xl font-bold w-full text-center mb-2">Jours de repos</h3>
            {daysOfWeek.map((day, index) => (
              <Button
                key={index}
                onClick={() => handleToggleRestDay(index)}
                className={`w-28 ${restDays.includes(index) ? 'bg-zinc-800 border-2 border-red-500 text-red-500' : 'bg-zinc-700 text-amber-100'} hover:bg-zinc-600`}
              >
                {day}
              </Button>
            ))}
          </div>

          {view === 'list' && (
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
                          {day.exercises.length > 0 ? (
                            day.exercises.map((exercise, exerciseIndex) => (
                              <li key={exerciseIndex} className="text-sm text-amber-200">
                                <span className="font-medium">{exercise.name}</span>: {exercise.sets} séries de {exercise.reps} répétitions
                              </li>
                            ))
                          ) : (
                            <li className="text-sm text-zinc-400">Jour de repos</li>
                          )}
                        </ul>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {view === 'calendar' && (
            <div className="space-y-6">
              {workoutData.map((week, weekIndex) => (
                <div key={weekIndex}>
                  <h2 className="text-2xl font-bold mb-4 text-center">Semaine {week.week}</h2>
                  <div className="grid grid-cols-7 gap-2">
                    {daysOfWeek.map((day, dayIndex) => (
                      <Card key={dayIndex} className="bg-zinc-900 border-zinc-800 p-4 flex flex-col h-48 overflow-hidden">
                        <h3 className="font-semibold text-center mb-2">{day}</h3>
                        <div className="flex-1 overflow-auto">
                          {week.workouts[dayIndex]?.exercises.length > 0 ? (
                            <ul className="list-none space-y-1">
                              {week.workouts[dayIndex].exercises.map((exercise, exIndex) => (
                                <li key={exIndex} className="text-sm">
                                  <span className="font-medium text-amber-200">{exercise.name}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-center text-zinc-500 text-sm italic">Repos</div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Button onClick={() => setIsFormVisible(true)} className="bg-amber-600 text-zinc-950 hover:bg-amber-700 font-bold py-2 px-4 rounded-lg shadow-lg">
              Générer un nouveau programme
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
