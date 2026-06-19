import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../api';

const AppStateContext = createContext(null);

// ── Expiry helpers (unchanged) ────────────────────────────────────────────────
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
  if (diff < 0)   return 'Expired';
  if (diff === 0)  return 'Today';
  if (diff === 1)  return 'Tomorrow';
  if (diff <= 7)   return `${diff}d left`;
  return new Date(expiry).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─────────────────────────────────────────────────────────────────────────────

export function AppStateProvider({ children }) {
  const { authState } = useAuth();

  const [loading, setLoading] = useState(true);
  const [recipes, setRecipes]           = useState([]);
  const [pantry, setPantry]             = useState([]);
  const [mealPlanner, setMealPlanner]   = useState({});
  const [shoppingList, setShoppingList] = useState([]);

  // ── Fetch all data once authenticated ───────────────────────────────────────
  useEffect(() => {
    if (authState !== 'authenticated') return;
    setLoading(true);
    Promise.all([
      api.getRecipes(),
      api.getPantry(),
      api.getPlanner(),
      api.getShopping(),
    ]).then(([r, p, pl, s]) => {
      setRecipes(r ?? []);
      setPantry(p ?? []);
      setMealPlanner(pl ?? {});
      setShoppingList(s ?? []);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [authState]);

  // ── Recipe helpers ───────────────────────────────────────────────────────────
  const addRecipe = (r) => {
    setRecipes(prev => [r, ...prev]);
    api.saveRecipe(r).catch(console.error);
  };

  const updateRecipe = (id, patch) => {
    setRecipes(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...patch } : r);
      const updated = next.find(r => r.id === id);
      if (updated) api.saveRecipe(updated).catch(console.error);
      return next;
    });
  };

  const deleteRecipe = (id) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    api.removeRecipe(id).catch(console.error);
  };

  // ── Pantry helpers ───────────────────────────────────────────────────────────
  const syncPantry = (updater) => {
    setPantry(prev => {
      const next = updater(prev);
      api.putPantry(next).catch(console.error);
      return next;
    });
  };

  const addPantryItem = (item) =>
    syncPantry(p => p.some(i => i.name.toLowerCase() === item.name.toLowerCase()) ? p : [...p, item]);

  const updatePantryItem = (name, patch) =>
    syncPantry(p => p.map(i => i.name === name ? { ...i, ...patch } : i));

  const deletePantryItem = (name) =>
    syncPantry(p => p.filter(i => i.name !== name));

  // ── Planner helpers ──────────────────────────────────────────────────────────
  const assignMeal = (dateKey, mealType, recipeId) => {
    setMealPlanner(prev => {
      const updatedDay = { ...(prev[dateKey] || {}), [mealType]: recipeId };
      api.putPlannerDay(dateKey, updatedDay).catch(console.error);
      return { ...prev, [dateKey]: updatedDay };
    });
  };

  const clearMeal = (dateKey, mealType) => {
    setMealPlanner(prev => {
      if (!prev[dateKey]) return prev;
      const day = { ...prev[dateKey] };
      delete day[mealType];
      api.putPlannerDay(dateKey, day).catch(console.error);
      return { ...prev, [dateKey]: day };
    });
  };

  // ── Shopping helpers ─────────────────────────────────────────────────────────
  const syncShopping = (updater) => {
    setShoppingList(prev => {
      const next = updater(prev);
      api.putShopping(next).catch(console.error);
      return next;
    });
  };

  const setShopping          = (items) => syncShopping(() => items);
  const addShoppingItem      = (item)  => syncShopping(p => [...p, item]);
  const toggleShoppingChecked = (index) =>
    syncShopping(p => p.map((it, i) => i === index ? { ...it, checked: !it.checked } : it));

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
    syncShopping(() => items);
    return items;
  };

  return (
    <AppStateContext.Provider value={{
      loading,
      recipes,      addRecipe,      updateRecipe,    deleteRecipe,
      pantry,       addPantryItem,  updatePantryItem, deletePantryItem,
      mealPlanner,  assignMeal,     clearMeal,
      shoppingList, setShopping,    addShoppingItem,  toggleShoppingChecked, generateShoppingFromPlanner,
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
