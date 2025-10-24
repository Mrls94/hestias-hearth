import React, { useEffect, useState } from "react";
import MealPlannerGrid from "../components/MealPlannerGrid";
import { mergeIngredients } from "../utils";

export default function Planner() {
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

  // Save planner whenever it changes
  useEffect(() => {
    if (Object.keys(planner).length > 0) {
      localStorage.setItem("mealPlanner", JSON.stringify(planner));
    }
  }, [planner]);

  const handleAssign = (day, mealType, recipe) => {
    setPlanner((prev) => ({
      ...prev,
      [day]: { ...prev[day], [mealType]: recipe },
    }));
  };

  const clearPlanner = () => {
    setPlanner({});
    localStorage.removeItem("mealPlanner");
  };

  const generateWeeklyList = () => {
    const assignedTitles = Object.values(planner)
      .flatMap((meals) => Object.values(meals || {}))
      .filter(Boolean);

    const assignedRecipes = recipes.filter((r) =>
      assignedTitles.includes(r.title)
    );

    const allIngredients = assignedRecipes.flatMap((r) => r.ingredients);

    const normalized = allIngredients.map((item) =>
      typeof item === "string"
        ? { name: item.trim(), quantity: 1 }
        : { name: item.name.trim(), quantity: item.quantity || 1 }
    );

    const merged = mergeIngredients(normalized);

    localStorage.setItem("shoppingList", JSON.stringify(merged));
    alert("🛒 Weekly offerings sent to Hestia’s Pantry!");
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

      <div className="flex gap-4 mt-6">
        {Object.keys(planner).length > 0 && (
          <>
            <button
              onClick={generateWeeklyList}
              className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
            >
              🛒 Generate Weekly Shopping List
            </button>

            <button
              onClick={clearPlanner}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              🔥 Clear Calendar
            </button>
          </>
        )}
      </div>
    </div>
  );
}