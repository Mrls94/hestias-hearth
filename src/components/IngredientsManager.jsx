import React, { useState, useEffect } from "react";

export default function IngredientsManager() {
  const [ingredients, setIngredients] = useState(() => {
    const stored = localStorage.getItem("ingredients");
    if (stored) {
      try { return JSON.parse(stored); } catch { return []; }
    }
    return [];
  });
  const [newIng, setNewIng] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    localStorage.setItem("ingredients", JSON.stringify(ingredients));
  }, [ingredients]);

  const addIngredient = (raw) => {
    const entries = raw.split(",").map((s) => s.trim()).filter(Boolean);
    if (entries.length === 0) return;
    const added = [];
    setIngredients((s) => {
      const next = [...s];
      for (const name of entries) {
        if (!next.includes(name)) {
          next.push(name);
          added.push(name);
        }
      }
      return next;
    });
    setNewIng("");
    if (added.length) {
      setMsg(`Added: ${added.join(", ")}`);
      setTimeout(() => setMsg(""), 3000);
    } else {
      setMsg("No new ingredients to add");
      setTimeout(() => setMsg(""), 2000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addIngredient(newIng);
  };

  const deleteIngredient = (name) => {
    if (!confirm(`Delete ingredient "${name}"? This will not remove it from existing recipes.`)) return;
    setIngredients((s) => s.filter((i) => i !== name));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4" aria-label="Add ingredient form">
        <label htmlFor="new-ingredient" className="sr-only">Ingredient name</label>
        <input
          id="new-ingredient"
          placeholder="Add ingredient (e.g., sugar) — comma separated allowed"
          value={newIng}
          onChange={(e) => setNewIng(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="btn-terra-sm">Add</button>
      </form>

      {msg && <div className="mb-3 text-sm text-green-700">{msg}</div>}

      {ingredients.length === 0 ? (
        <p className="text-gray-500">No ingredients. Add some above.</p>
      ) : (
        <ul className="space-y-2">
          {ingredients.map((ing) => (
            <li key={ing} className="flex justify-between items-center p-2 border rounded">
              <span className="capitalize">{ing}</span>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard?.writeText(ing)} className="text-sm text-gray-600 underline">Copy</button>
                <button onClick={() => deleteIngredient(ing)} className="text-sm text-red-600">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
