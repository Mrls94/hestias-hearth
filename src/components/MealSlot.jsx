import React from "react";

export default function MealSlot({ day, recipe, onAssign, recipes }) {
  return (
    <div className="border rounded p-3 bg-white shadow-sm flex flex-col items-center">
      <h3 className="font-semibold text-amber-700">{day}</h3>

      {recipe ? (
        <p className="mt-2 text-gray-700">{recipe}</p>
      ) : (
        <p className="mt-2 text-gray-400 italic">No offering yet</p>
      )}

      <select
        onChange={(e) => {
          if (e.target.value) onAssign(day, e.target.value);
        }}
        value={recipe || ""}
        className="mt-3 border rounded p-2"
      >
        <option value="">-- Assign Offering --</option>
        {recipes.map((r) => (
          <option key={r.id} value={r.title}>
            {r.title}
          </option>
        ))}
      </select>
    </div>
  );
}