import React, { useState } from "react";

export default function RecipeForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [difficulty, setDifficulty] = useState("Mortal");
  const [blessing, setBlessing] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newRecipe = {
      id: Date.now(),
      title,
      ingredients: ingredients.split(",").map((i) => i.trim()),
      steps,
      difficulty,
    };

    onAdd(newRecipe);

    // Reset form
    setTitle("");
    setIngredients("");
    setSteps("");
    setDifficulty("Mortal");

    // Trigger blessing
    setBlessing("🔥 Hestia smiles upon your offering!");
    setTimeout(() => setBlessing(""), 3000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mb-6"
    >
      <h3 className="text-lg font-semibold mb-2 text-amber-700">
        Add a New Recipe
      </h3>
      <input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />
      <input
        type="text"
        placeholder="Ingredients (comma separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />
      <textarea
        placeholder="Steps"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />
      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      >
        <option value="Mortal">Mortal</option>
        <option value="Heroic">Heroic</option>
        <option value="Divine">Divine</option>
      </select>
      <button
        type="submit"
        className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
      >
        Offer Recipe
      </button>

      {blessing && (
        <p className="mt-3 text-green-700 font-semibold animate-pulse">
          {blessing}
        </p>
      )}
    </form>
  );
}