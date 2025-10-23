import React from "react";

export default function RecipeCard({ recipe, onDelete }) {
  return (
    <div className="border rounded-lg p-4 shadow-md bg-white">
      <h2 className="text-xl font-bold text-amber-800">{recipe.title}</h2>
      <p className="text-sm text-gray-600 mb-2">
        {recipe.ingredients.join(", ")}
      </p>
      <p className="text-gray-700">{recipe.steps}</p>
      <button
        onClick={() => onDelete(recipe.id)}
        className="mt-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Delete
      </button>
    </div>
  );
}