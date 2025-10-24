import React from "react";

export default function RecipeCard({ recipe, onDelete }) {
  const { id, title, ingredients, steps, difficulty } = recipe;

  const handleGenerateList = () => {
    const stored = localStorage.getItem("shoppingList");
    const existing = stored ? JSON.parse(stored) : [];

    const merged = mergeIngredients([...existing, ...ingredients]);
    localStorage.setItem("shoppingList", JSON.stringify(merged));

    alert("🛒 Ingredients sent to Hestia’s Pantry!");
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-amber-500">
      <h3 className="text-xl font-bold text-amber-700 mb-2">{title}</h3>

      <p className="text-sm text-gray-600 mb-1">
        <span className="font-semibold">Difficulty:</span> {difficulty}
      </p>

      <p className="text-sm text-gray-700 mb-2">
        <span className="font-semibold">Steps:</span> {steps}
      </p>

      <div className="mb-2">
        <span className="font-semibold text-sm text-gray-600">Ingredients:</span>
        <ul className="list-disc list-inside text-sm text-gray-700">
          {ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="flex gap-3 mt-4">
        <button
          onClick={handleGenerateList}
          className="bg-amber-500 text-white px-3 py-1 rounded hover:bg-amber-600"
        >
          🛒 Generate Shopping List
        </button>

        <button
          onClick={() => onDelete(id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}