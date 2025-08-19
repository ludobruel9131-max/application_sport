import React from "react";
import { Flame, BarChart2, Crown, Timer as TimerIcon, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from "recharts";
import { useApp } from "../App";
import { bmi, formatDate } from "../../lib/utils";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { state } = useApp();
  const { profile, sessions, stats } = state;

  const imc = bmi(profile.weightKg, profile.heightCm);

  const today = new Date();
  const getWeekStart = (d) => { const x = new Date(d); const day = x.getDay(); const diff = (day === 0 ? 6 : day - 1); x.setDate(x.getDate() - diff); return x; };
  const weekStart = getWeekStart(today);
  const last7 = [...Array(7)].map((_, i) => { const d = new Date(weekStart); d.setDate(d.getDate() + i); const k = d.toISOString().slice(0, 10); return { day: d.toLocaleDateString(undefined, { weekday: 'short' }), calories: stats.caloriesByDay?.[k] || 0 }; });

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const monthData = [...Array(daysInMonth)].map((_, i) => { const d = new Date(monthStart); d.setDate(i + 1); const k = d.toISOString().slice(0, 10); return { d: i + 1, calories: stats.caloriesByDay?.[k] || 0 }; });

  const thisWeekSessions = sessions.filter(s => {
    const d = new Date(s.date);
    return d >= weekStart && d <= today;
  });

  const todayKey = formatDate(today);
  const todaySessions = sessions.filter(s => s.date.slice(0, 10) === todayKey);
  const todayCalories = todaySessions.reduce((a, b) => a + (b.totalCalories || 0), 0);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5 text-yellow-500" /> Progression hebdomadaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={last7}>
                <defs>
                  <linearGradient id="cal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="day" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', color: '#fff' }} />
                <Area type="monotone" dataKey="calories" stroke="#eab308" fill="url(#cal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Crown className="w-5 h-5 text-yellow-500" /> Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Nom</span><span className="font-medium">{profile.name}</span></div>
            <div className="flex items-center justify-between"><span>Âge</span><span className="font-medium">{profile.age} ans</span></div>
            <div className="flex items-center justify-between"><span>Poids</span><span className="font-medium">{profile.weightKg} kg</span></div>
            <div className="flex items-center justify-between"><span>Taille</span><span className="font-medium">{profile.heightCm} cm</span></div>
            <div className="flex items-center justify-between"><span>IMC</span><span className="font-medium">{imc}</span></div>
            <div className="flex items-center justify-between"><span>Objectif</span><span className="font-medium">{profile.goal}</span></div>
            <div className="flex items-center justify-between"><span>Niveau</span><span className="font-medium">{profile.level}</span></div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BarChart2 className="w-5 h-5 text-yellow-500" /> Progression mensuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="d" stroke="#a1a1aa" />
                <YAxis stroke="#a1a1aa" />
                <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', color: '#fff' }} />
                <Bar dataKey="calories" fill="#eab308" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900/50 border-zinc-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><TimerIcon className="w-5 h-5 text-yellow-500" /> Aujourd'hui</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <div className="flex items-center justify-between"><span>Calories brûlées</span><span className="font-semibold text-yellow-400">{todayCalories} kcal</span></div>
            <div className="space-y-2">
              {todaySessions.length === 0 && (<p className="text-zinc-400">Aucune séance aujourd'hui.</p>)}
              {todaySessions.map(s => (
                <div key={s.id} className="p-3 rounded-xl bg-zinc-800/60">
                  <div className="flex items-center justify-between text-sm"><span className="font-medium">{s.name}</span><span>{Math.round(s.totalMinutes)} min</span></div>
                  <div className="text-xs text-zinc-400">{s.blocks.length} exos • {s.totalCalories} kcal</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
