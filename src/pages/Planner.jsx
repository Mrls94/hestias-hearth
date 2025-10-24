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

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const mealTypes = ["Breakfast","Lunch","Dinner"];

  // ✅ Count complete days
  const completeDays = days.filter((day) => {
    const meals = planner[day];
    return meals && mealTypes.every((m) => meals[m]);
  }).length;

  // ✅ Count filled meals
  let filledMeals = 0;
  days.forEach((day) => {
    const meals = planner[day] || {};
    mealTypes.forEach((m) => {
      if (meals[m]) filledMeals++;
    });
  });
  const totalMeals = days.length * mealTypes.length;

  // ✅ Percentages
  const dayProgress = Math.round((completeDays / days.length) * 100);
  const mealProgress = Math.round((filledMeals / totalMeals) * 100);


  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <h1 className="text-2xl font-bold text-amber-700 mb-6">
        📅 Hestia’s Calendar of Offerings
      </h1>
      <div className="mb-6 space-y-4">
        {/* Day-level progress */}
        <div>
          <p className="font-semibold text-amber-700">
            🔥 Days Complete: {completeDays}/{days.length}
          </p>
          <div className="w-full bg-gray-200 rounded h-4 mt-2">
            <div
              className="bg-amber-500 h-4 rounded transition-all"
              style={{ width: `${dayProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Meal-level progress */}
        <div>
          <p className="font-semibold text-amber-700">
            🍽️ Meals Planned: {filledMeals}/{totalMeals}
          </p>
          <div className="w-full bg-gray-200 rounded h-4 mt-2">
            <div
              className="bg-green-500 h-4 rounded transition-all"
              style={{ width: `${mealProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Optional mythological flair */}
        {dayProgress === 100 && mealProgress === 100 && (
          <p className="mt-2 text-center text-lg font-bold text-amber-600 animate-pulse">
            🌟 The Hearth is fully fed — Hestia smiles upon your offerings!
          </p>
        )}
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-amber-700 mb-3">📜 Week Summary</h2>
        <ul className="space-y-2">
          {days.map((day) => {
            const meals = planner[day] || {};
            return (
              <li key={day} className="border-b pb-2 last:border-b-0">
                <p className="font-semibold text-gray-800">{day}</p>
                <ul className="ml-4 text-sm text-gray-700">
                  {mealTypes.map((meal) => (
                    <li key={`${day}-${meal}`}>
                      <span className="font-medium">{meal}:</span>{" "}
                      {meals[meal] || <span className="italic text-gray-400">—</span>}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>


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