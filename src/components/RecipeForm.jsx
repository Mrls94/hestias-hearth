import React, { useState, useMemo, useEffect } from "react";
import SimpleMDE from "react-simplemde-editor";
import "simplemde/dist/simplemde.min.css";
import ReactMarkdown from "react-markdown";

export default function RecipeForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState("");
  const [difficulty, setDifficulty] = useState("Mortal");

  // master ingredients list
  const [masterIngredients, setMasterIngredients] = useState(() => {
    const stored = localStorage.getItem("ingredients");
    if (stored) {
      try { return JSON.parse(stored); } catch { return []; }
    }
    return [];
  });

  // selected ingredients for this recipe
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const simpleMdeOptions = useMemo(() => ({
    spellChecker: false,
    placeholder: 'Write steps here... Use Markdown. e.g., `- Preheat oven`',
    autosave: { enabled: false },
    toolbar: [
      "bold",
      "italic",
      "heading",
      "|",
      "quote",
      "unordered-list",
      "ordered-list",
      "link",
      "image",
      "|",
      "preview",
      "guide",
    ],
  }), []);

  // keep master list persisted
  useEffect(() => {
    localStorage.setItem("ingredients", JSON.stringify(masterIngredients));
  }, [masterIngredients]);


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
      id="new-recipe-form"
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-lg shadow-md mb-6 border-l-4 accent-left"
    >
      <h2 className="text-lg font-bold mb-4 accent-heading">
        🔥 Add a New Offering!
      </h2>

      <input
        type="text"
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
      />

      {/* Ingredients selector (dropdown multi-select) */}
      <div className="mb-3">
        <label className="block font-semibold mb-2 label-accent">🥕 Ingredients</label>
        {masterIngredients.length === 0 && (
          <p className="text-gray-500 mb-2">No ingredients defined. Add some in the Ingredients tab.</p>
        )}

        <select
          aria-label="Select ingredients"
          multiple
          value={selectedIngredients}
          onChange={(e) => {
            const opts = Array.from(e.target.options)
              .filter((o) => o.selected)
              .map((o) => o.value);
            setSelectedIngredients(opts);
          }}
          className="w-full p-2 border rounded mb-2 h-36"
        >
          {masterIngredients.map((ing) => (
            <option key={ing} value={ing} className="capitalize">{ing}</option>
          ))}
        </select>
        <p className="text-sm text-gray-500">Hold Ctrl/Cmd (or use shift) to select multiple ingredients.</p>
      </div>

      <div className="bg-[var(--cream)] border-l-4 rounded-md p-4 shadow-sm panel-accent-left">
        <label className="block font-semibold mb-2" style={{color:'var(--terracotta-dark)'}}>
          📜 Steps (Markdown supported)
        </label>
        <SimpleMDE
          value={steps}
          onChange={setSteps}
          options={simpleMdeOptions}
        />
      </div>

      <div className="prose prose-sm text-gray-800 mt-4">
        <ReactMarkdown>{steps}</ReactMarkdown>
      </div>




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
        className="px-4 py-2 rounded text-white"
        style={{background:'var(--terracotta)'}}
      >
        ✨ Submit to the Hearth
      </button>
    </form>
  );
}