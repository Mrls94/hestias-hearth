import React from "react";

export default function MealSlot({ day, mealType, recipe, onAssign, recipes }) {
  const isFilled = Boolean(recipe);

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <label className="font-semibold text-sm text-gray-600">{mealType}</label>
        <span
          className={`transition-colors ${
            isFilled ? "text-amber-500 animate-pulse" : "text-gray-300"
          }`}
        >
          🔥
        </span>
      </div>

      <select
        onChange={(e) => {
          if (e.target.value) onAssign(day, mealType, e.target.value);
        }}
        value={recipe || ""}
        className="mt-1 border rounded p-2"
      >
        <option value="">-- Assign Offering --</option>
        {(recipes || []).map((r) => (
          <option key={r.id} value={r.title}>
            {r.title}
          </option>
        ))}
      </select>
    </div>
  );
}