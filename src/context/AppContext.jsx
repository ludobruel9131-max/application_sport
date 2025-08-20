import React, { createContext, useReducer } from 'react';

const initialState = {
  profile: {
    goals: {
      caloriesGoal: 2000,
      proteinGoal: 150,
      fatGoal: 70
    },
    // Ajoutez d'autres propriétés de profil ici si nécessaire
  },
  meals: [],
  workouts: [],
};

const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GOALS':
      return {
        ...state,
        profile: {
          ...state.profile,
          goals: action.payload,
        },
      };
    case 'ADD_MEAL':
      return {
        ...state,
        meals: [...state.meals, action.payload],
      };
    case 'ADD_WORKOUT':
      return {
        ...state,
        workouts: [...state.workouts, action.payload],
      };
    default:
      return state;
  }
};

export const AppContext = createContext(initialState);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
