import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./components/Dashboard";
import Workouts from "./components/Workouts";
import Library from "./components/Library";
import CustomWorkout from "./components/CustomWorkout";
import CreateCustomWorkout from "./components/CreateCustomWorkout";
import MyCustomWorkouts from "./components/MyCustomWorkouts";
import SettingsPage from "./components/SettingsPage";
import Shell from "./components/Shell";
import ActiveSession from "./components/ActiveSession";
import { defaultProfile } from "./data";

export const AppContext = createContext();

function App() {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem("app_state");
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem("app_state", JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, setState }}>
      <BrowserRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/library" element={<Library />} />
            <Route path="/custom/:id" element={<CustomWorkout />} />
            <Route path="/create-custom" element={<CreateCustomWorkout />} />
            <Route path="/my-custom-workouts" element={<MyCustomWorkouts />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/active-session" element={<ActiveSession />} />
          </Route>
        </Routes>
        <ToastContainer position="bottom-right" theme="dark" />
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
