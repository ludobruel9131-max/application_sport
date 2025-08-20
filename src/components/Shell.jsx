import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Dumbbell, Home, BookOpenText, Settings, BarChart2 } from "lucide-react";
import { Button } from "./ui/button";

const navItems = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Programmes", href: "/workouts", icon: Dumbbell },
  { name: "Bibliothèque", href: "/library", icon: BookOpenText },
  { name: "Statistiques", href: "/stats", icon: BarChart2 },
  { name: "Réglages", href: "/settings", icon: Settings },
];

function Shell() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 p-4 space-y-2 bg-zinc-950 border-r border-zinc-800">
        <h1 className="text-2xl font-bold">Gym App</h1>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `flex items-center p-2 rounded-md ${
                  isActive ? "bg-zinc-800 text-yellow-400" : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`
              }
            >
              <item.icon className="w-4 h-4 mr-2" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Shell;
