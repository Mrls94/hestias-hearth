import React, { useEffect, useState } from "react";
import MealPlannerGrid from "../components/MealPlannerGrid";

export default function Planner() {
  // ✅ Initialize directly from localStorage
  const [planner, setPlanner] = useState(() => {
    const stored = localStorage.getItem("mealPlanner");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return {};
      }
    }
    return {};
  });

  const [recipes, setRecipes] = useState(() => {
    const stored = localStorage.getItem("recipes");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // ✅ Save planner whenever it changes (but only if not empty)
  useEffect(() => {
    if (Object.keys(planner).length > 0) {
      localStorage.setItem("mealPlanner", JSON.stringify(planner));
    }
  }, [planner]);

  const handleAssign = (day, recipe) => {
    setPlanner((prev) => ({ ...prev, [day]: recipe }));
  };

  const clearPlanner = () => {
    setPlanner({});
    localStorage.removeItem("mealPlanner");
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <h1 className="text-2xl font-bold text-amber-700 mb-6">
        📅 Hestia’s Calendar of Offerings
      </h1>

      <MealPlannerGrid
        planner={planner}
        onAssign={handleAssign}
        recipes={recipes}
      />

      {Object.keys(planner).length > 0 && (
        <button
          onClick={clearPlanner}
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          🔥 Clear Calendar
        </button>
      )}
    </div>
  );
}