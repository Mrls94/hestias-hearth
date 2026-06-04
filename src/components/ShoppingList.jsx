import React, { useEffect, useState } from "react";
import IngredientItem from "./IngredientItem";
import { mergeIngredients } from "../utils";

export default function ShoppingList({onChange}) {
  const [ingredients, setIngredients] = useState([]);

  // Load shopping list from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("shoppingList");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // ensure checked flag is present
        const merged = mergeIngredients(parsed).map((it) => ({...it, checked: it.checked || false}));
        setIngredients(merged);
      } catch (err) {
        console.error("Failed to parse shopping list:", err);
        setIngredients([]);
      }
    }
  }, []);

  // Keep localStorage in sync whenever list changes
  useEffect(() => {
    if (ingredients.length > 0) {
      localStorage.setItem("shoppingList", JSON.stringify(ingredients));
    } else {
      localStorage.removeItem("shoppingList");
    }
    if (typeof onChange === 'function') onChange(ingredients);
  }, [ingredients, onChange]);

  const clearList = () => {
    localStorage.removeItem("shoppingList");
    setIngredients([]);
  };

  const toggleItem = (item) => {
    setIngredients((prev) => prev.map((it) => it.name === item.name ? {...it, checked: !it.checked} : it));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4 title-terra">
        🛒 Offerings to the Hearth
      </h2>

      {ingredients.length === 0 ? (
        <p className="text-gray-500">
          No offerings yet. Generate a list from a recipe!
        </p>
      ) : (
        <div className="grid gap-2">
          {ingredients.map((item, idx) => (
            <IngredientItem
              key={idx}
              item={item}
              onToggle={toggleItem}
            />
          ))}
        </div>
      )}

      {ingredients.length > 0 && (
        <button
          onClick={clearList}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          🔥 Purge Offerings
        </button>
      )}
    </div>
  );
}

// Helper to capitalize ingredient names
function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}