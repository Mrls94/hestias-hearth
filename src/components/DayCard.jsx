import React from "react";
import MealSlot from "./MealSlot";

export default function DayCard({ day, meals, onAssign, recipes }) {
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];

  // Check if all three meals are filled
  const isComplete =
    mealTypes.every((meal) => meals?.[meal]) && mealTypes.length > 0;

  return (
    <div
      className={`border rounded-lg p-4 shadow-md flex flex-col transition-all ${
        isComplete
          ? "border-[var(--terracotta)] ring-2 ring-[rgba(196,96,58,0.16)] bg-[var(--terracotta-light)]"
          : "border-gray-200 bg-white"
      }`}
    >
      <h2
        className={`text-lg font-bold mb-3 ${
          isComplete ? "text-[var(--terracotta-dark)]" : "text-gray-700"
        }`}
      >
        {day} {isComplete && "✨"}
      </h2>

      <div className="flex flex-col gap-3">
        {mealTypes.map((meal) => (
          <MealSlot
            key={`${day}-${meal}`}
            day={day}
            mealType={meal}
            recipe={meals?.[meal] || ""}
            onAssign={onAssign}
            recipes={recipes}
          />
        ))}
      </div>
    </div>
  );
}