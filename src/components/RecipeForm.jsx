import React, { useState } from "react";

export default function RecipeForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [difficulty, setDifficulty] = useState("Mortal");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !ingredients || !steps) return;

    const newRecipe = {
      id: Date.now(),
      title,
      ingredients: ingredients.split(",").map((i) => i.trim()),
      steps,
      difficulty,
    };

    onAdd(newRecipe);
    setTitle("");
    setIngredients("");
    setSteps("");
    setDifficulty("Mortal");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mb-6 border-l-4 border-amber-400"
    >
      <h2 className="text-lg font-bold text-amber-700 mb-4">
        🔥 Add a New Offering!
      </h2>

      <input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <textarea
        placeholder="Ingredients (comma-separated)"
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <textarea
        placeholder="Steps"
        value={steps}
        onChange={(e) => setSteps(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="Mortal">Mortal</option>
        <option value="Heroic">Heroic</option>
        <option value="Divine">Divine</option>
      </select>

      <button
        type="submit"
        className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600"
      >
        ✨ Submit to the Hearth
      </button>
    </form>
  );
}