import React, { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("recipes");
    if (stored) {
      try {
        setRecipes(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse recipes from localStorage:", err);
        setRecipes([]);
      }
    }
  }, []);


  // Save to localStorage whenever recipes change
  useEffect(() => {
    if (recipes.length > 0) {
      localStorage.setItem("recipes", JSON.stringify(recipes));
    }
  }, [recipes]);


  const addRecipe = (recipe) => {
    const updated = [recipe, ...recipes];
    setRecipes(updated);
    localStorage.setItem("recipes", JSON.stringify(updated));
  };

  const deleteRecipe = (id) => {
    setRecipes(recipes.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <RecipeForm onAdd={addRecipe} />
      <div className="grid gap-4">
        {recipes.length === 0 ? (
          <p className="text-gray-500">No recipes yet. Add one above!</p>
        ) : (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onDelete={deleteRecipe} />
          ))
        )}
      </div>
    </div>
  );
}