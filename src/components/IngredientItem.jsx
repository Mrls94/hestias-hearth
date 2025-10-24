import React, { useState } from "react";

export default function IngredientItem({ name }) {
  const [checked, setChecked] = useState(false);

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded ${
        checked ? "bg-amber-100 animate-pulse" : "bg-white"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => setChecked(!checked)}
        className="accent-amber-600"
      />
      <span className={checked ? "line-through text-gray-500" : ""}>
        {name}
      </span>
      {checked && (
        <span className="text-amber-600 text-sm italic">
          ✨ Accepted by Hestia
        </span>
      )}
    </div>
  );
}