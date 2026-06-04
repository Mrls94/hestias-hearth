import React, { useEffect, useState } from "react";
import MealPlannerGrid from "../components/MealPlannerGrid";
import { mergeIngredients } from "../utils";

function Planner() {
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
    <div className="max-w-5xl mx-auto p-6">
      <div className="week-strip mb-6">
        <div className="week-label flex items-center justify-between mb-3">
          <span>Week of June 1–7, 2026</span>
          <div className="week-nav flex gap-2">
            <button className="week-btn">‹</button>
            <button className="week-btn">›</button>
          </div>
        </div>
        <div className="days-row flex gap-2">
          {days.map((d, idx) => (
            <div key={d} className={`day-pill ${idx===2 ? 'active' : ''}`}>
              <span className="day-letter">{d.charAt(0)}</span>
              <span className="day-num">{idx+1}</span>
              <div className="day-dot"></div>
            </div>
          ))}
        </div>
      </div>

      <div className="planner-day grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-2">
          <MealPlannerGrid planner={planner} onAssign={handleAssign} recipes={recipes} />
        </div>

        <div>
          <div className="workout-slot bg-white rounded-lg shadow p-4 mb-4">
            <div className="workout-slot-label">🏋️ Workout</div>
            <div className="workout-slot-name">Upper body strength</div>
            <div className="workout-slot-meta">⏱ 45 min · Intermediate · 6:00 PM</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="daily-total-label">Daily total</div>
            <div className="daily-total-value">1,640 <span className="daily-total-unit">kcal</span></div>
            <div className="daily-total-right">
              <div className="daily-total-target">Target</div>
              <div className="daily-total-target-value">2,000 kcal</div>
              <div className="daily-total-remaining">360 remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Planner;