import React, { createContext, useContext, useEffect, useState } from 'react';

const AppStateContext = createContext(null);

// ── Pantry migration helpers ─────────────────────────────────────────────────
function loadPantry() {
  try {
    const next = localStorage.getItem('pantry');
    if (next) return JSON.parse(next) || [];

    // Migrate from old string[] "ingredients" key
    const old = localStorage.getItem('ingredients');
    if (old) {
      const parsed = JSON.parse(old);
      if (Array.isArray(parsed)) {
        return parsed.map(item =>
          typeof item === 'string'
            ? { name: item, qty: '', category: 'Other', expiry: null }
            : item
        );
      }
    }
  } catch { /* fall through */ }
  return [];
}

// ── Expiry helpers ────────────────────────────────────────────────────────────
export function expiryStatus(expiry) {
  if (!expiry) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.floor((new Date(expiry) - today) / 86400000);
  if (diff < 0)  return 'exp';
  if (diff <= 7) return 'soon';
  return 'good';
}

export function expiryLabel(expiry) {
  if (!expiry) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diff = Math.floor((new Date(expiry) - today) / 86400000);
  if (diff < 0)  return 'Expired';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff <= 7)  return `${diff}d left`;
  return new Date(expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────────────────

export function AppStateProvider({ children }) {
  const [recipes, setRecipes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('recipes')) || []; } catch { return []; }
  });

  // pantry: [{ name, qty, category, expiry }] — migrated from old string[] on first load
  const [pantry, setPantry] = useState(loadPantry);

  const [mealPlanner, setMealPlanner] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mealPlanner')) || {}; } catch { return {}; }
  });

  const [shoppingList, setShoppingList] = useState(() => {
    try { return JSON.parse(localStorage.getItem('shoppingList')) || []; } catch { return []; }
  });

  // ── Persistence ──────────────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem('recipes',     JSON.stringify(recipes));     }, [recipes]);
  useEffect(() => { localStorage.setItem('pantry',      JSON.stringify(pantry));
                    localStorage.removeItem('ingredients'); /* clean up old key */     }, [pantry]);
  useEffect(() => { localStorage.setItem('mealPlanner', JSON.stringify(mealPlanner)); }, [mealPlanner]);
  useEffect(() => { localStorage.setItem('shoppingList',JSON.stringify(shoppingList));}, [shoppingList]);

  // ── Recipe helpers ───────────────────────────────────────────────────────
  const addRecipe    = (r)       => setRecipes(p => [r, ...p]);
  const updateRecipe = (id, patch) => setRecipes(p => p.map(r => r.id === id ? { ...r, ...patch } : r));
  const deleteRecipe = (id)      => setRecipes(p => p.filter(r => r.id !== id));

  // ── Pantry helpers ───────────────────────────────────────────────────────
  const addPantryItem = (item) =>
    setPantry(p => p.some(i => i.name.toLowerCase() === item.name.toLowerCase()) ? p : [...p, item]);

  const updatePantryItem = (name, patch) =>
    setPantry(p => p.map(i => i.name === name ? { ...i, ...patch } : i));

  const deletePantryItem = (name) =>
    setPantry(p => p.filter(i => i.name !== name));

  // ── Planner helpers ──────────────────────────────────────────────────────
  // planner shape: { 'YYYY-MM-DD': { Breakfast?: recipeId, Lunch?: recipeId, Dinner?: recipeId } }
  const assignMeal = (dateKey, mealType, recipeId) =>
    setMealPlanner(prev => ({
      ...prev,
      [dateKey]: { ...(prev[dateKey] || {}), [mealType]: recipeId },
    }));

  const clearMeal = (dateKey, mealType) =>
    setMealPlanner(prev => {
      if (!prev[dateKey]) return prev;
      const day = { ...prev[dateKey] };
      delete day[mealType];
      return { ...prev, [dateKey]: day };
    });

  // ── Shopping helpers ─────────────────────────────────────────────────────
  const setShopping          = (items) => setShoppingList(items);
  const addShoppingItem      = (item)  => setShoppingList(p => [...p, item]);
  const toggleShoppingChecked = (index) =>
    setShoppingList(p => p.map((it, i) => i === index ? { ...it, checked: !it.checked } : it));

  const generateShoppingFromPlanner = () => {
    const usedIds = Object.values(mealPlanner)
      .flatMap(d => Object.values(d || {}))
      .filter(Boolean);
    const usedRecipes = recipes.filter(r => usedIds.includes(r.id) || usedIds.includes(String(r.id)));
    const counts = {};
    usedRecipes.forEach(r =>
      (r.ingredients || []).forEach(ing => {
        const key = (typeof ing === 'string' ? ing : ing.name).toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
      })
    );
    const items = Object.keys(counts).map(k => ({ name: k, quantity: counts[k], checked: false }));
    setShoppingList(items);
    return items;
  };

  return (
    <AppStateContext.Provider value={{
      recipes, addRecipe, updateRecipe, deleteRecipe,
      pantry,  addPantryItem, updatePantryItem, deletePantryItem,
      mealPlanner, assignMeal, clearMeal,
      shoppingList, setShopping, addShoppingItem, toggleShoppingChecked, generateShoppingFromPlanner,
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
