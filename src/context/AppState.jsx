import React, { createContext, useContext, useEffect, useState } from 'react';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [recipes, setRecipes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('recipes')) || [];
    } catch {
      return [];
    }
  });

  const [ingredients, setIngredients] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ingredients')) || [];
    } catch {
      return [];
    }
  });

  const [mealPlanner, setMealPlanner] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mealPlanner')) || {};
    } catch {
      return {};
    }
  });

  const [shoppingList, setShoppingList] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shoppingList')) || [];
    } catch {
      return [];
    }
  });

  // persist changes
  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner));
  }, [mealPlanner]);

  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // recipe helpers
  const addRecipe = (recipe) => setRecipes((p) => [recipe, ...p]);
  const updateRecipe = (id, patch) => setRecipes((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  const deleteRecipe = (id) => setRecipes((p) => p.filter((r) => r.id !== id));

  // ingredients helpers
  const addIngredient = (name) => setIngredients((p) => (p.includes(name) ? p : [...p, name]));
  const deleteIngredient = (name) => setIngredients((p) => p.filter((i) => i !== name));

  // planner helpers: planner shape is { '2026-06-04': { Breakfast: recipeId, Lunch: ..., Dinner: ... }, ... }
  const assignMeal = (dateKey, mealType, recipeId) => {
    setMealPlanner((prev) => {
      const next = { ...prev };
      next[dateKey] = { ...(next[dateKey] || {}), [mealType]: recipeId };
      return next;
    });
  };

  const clearMeal = (dateKey, mealType) => {
    setMealPlanner((prev) => {
      const next = { ...prev };
      if (!next[dateKey]) return prev;
      next[dateKey] = { ...next[dateKey] };
      delete next[dateKey][mealType];
      return next;
    });
  };

  // shopping helpers
  const setShopping = (items) => setShoppingList(items);
  const addShoppingItem = (item) => setShoppingList((p) => [...p, item]);
  const toggleShoppingChecked = (index) =>
    setShoppingList((p) => p.map((it, i) => (i === index ? { ...it, checked: !it.checked } : it)));

  // generate shopping list from planner (simple merge of ingredients from recipes assigned)
  const generateShoppingFromPlanner = () => {
    const planner = mealPlanner || {};
    const usedRecipeIds = Object.values(planner).flatMap((d) => Object.values(d || {})).filter(Boolean);
    const usedRecipes = recipes.filter((r) => usedRecipeIds.includes(r.id));
    const counts = {};
    usedRecipes.forEach((r) => {
      (r.ingredients || []).forEach((ing) => {
        const key = ing.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      });
    });
    const items = Object.keys(counts).map((k) => ({ name: k, quantity: counts[k], checked: false }));
    setShoppingList(items);
    return items;
  };

  return (
    <AppStateContext.Provider
      value={{
        recipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        ingredients,
        addIngredient,
        deleteIngredient,
        mealPlanner,
        assignMeal,
        clearMeal,
        shoppingList,
        setShopping,
        addShoppingItem,
        toggleShoppingChecked,
        generateShoppingFromPlanner,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
