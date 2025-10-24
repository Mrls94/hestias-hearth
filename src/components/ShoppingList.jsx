import React, { useEffect, useState } from "react";
import IngredientItem from "./IngredientItem";

export default function ShoppingList() {
  const [ingredients, setIngredients] = useState([]);

  // Load shopping list from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("shoppingList");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIngredients(mergeIngredients(parsed));
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
    }
  }, [ingredients]);

  const clearList = () => {
    localStorage.removeItem("shoppingList");
    setIngredients([]);
  };

  // Merge duplicates into { name, quantity }
  const mergeIngredients = (list) => {
    const counts = {};

    list.forEach((item) => {
      let key = "";

      if (typeof item === "string") {
        key = item.toLowerCase().trim();
      } else if (item && typeof item === "object" && item.name) {
        key = item.name.toLowerCase().trim();
      }

      if (key) {
        counts[key] = (counts[key] || 0) + (item.quantity || 1);
      }
    });

    return Object.entries(counts).map(([name, qty]) => ({
      name,
      quantity: qty,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-amber-700 mb-4">
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
              name={`${capitalize(item.name)} ×${item.quantity}`}
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