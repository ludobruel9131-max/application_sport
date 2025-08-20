import React, { useContext } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { AppContext } from '../App';
import { levels, goals, equipmentOptions } from '../data';

function SettingsPage() {
  const { state, setState } = useContext(AppContext);

  const handleProfileChange = (key, value) => {
    setState(s => ({
      ...s,
      profile: {
        ...s.profile,
        [key]: value,
      },
    }));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Réglages du profil</h2>
      <Card>
        <CardHeader>
          <CardTitle>Profil de l'utilisateur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input 
            placeholder="Nom"
            value={state.profile.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
          />
          <Input 
            placeholder="Âge"
            type="number"
            value={state.profile.age}
            onChange={(e) => handleProfileChange('age', e.target.value)}
          />
          <Input 
            placeholder="Poids (kg)"
            type="number"
            value={state.profile.weight}
            onChange={(e) => handleProfileChange('weight', e.target.value)}
          />
          <Input 
            placeholder="Taille (cm)"
            type="number"
            value={state.profile.height}
            onChange={(e) => handleProfileChange('height', e.target.value)}
          />
          <Select value={state.profile.gender} onValueChange={(value) => handleProfileChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sexe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="homme">Homme</SelectItem>
              <SelectItem value="femme">Femme</SelectItem>
              <SelectItem value="autre">Autre</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Objectifs et niveau</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={state.profile.level} onValueChange={(value) => handleProfileChange('level', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Niveau" />
            </SelectTrigger>
            <SelectContent>
              {levels.map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={state.profile.goal} onValueChange={(value) => handleProfileChange('goal', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Objectif" />
            </SelectTrigger>
            <SelectContent>
              {goals.map(goal => (
                <SelectItem key={goal} value={goal}>{goal}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={state.profile.equipment} onValueChange={(value) => handleProfileChange('equipment', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Équipement préféré" />
            </SelectTrigger>
            <SelectContent>
              {equipmentOptions.map(equipment => (
                <SelectItem key={equipment} value={equipment}>{equipment}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsPage;
