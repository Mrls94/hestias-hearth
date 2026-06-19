import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import * as api from '../api';

const AppStateContext = createContext(null);

const PANTRY_CAT_KEYWORDS = {
  Produce:            ['onion','garlic','tomato','lettuce','spinach','carrot','potato','broccoli','pepper','celery','cucumber','mushroom','lemon','lime','apple','banana','herb','basil','parsley','cilantro','avocado','zucchini','kale','leek','ginger','shallot','chili','scallion','spring onion'],
  Protein:            ['meat','chicken','fish','beef','pork','turkey','salmon','tuna','shrimp','tofu','egg','lentil','bean','lamb','prawn','mince','bacon','sausage','steak'],
  Dairy:              ['milk','cheese','butter','cream','yogurt','mozzarella','parmesan','cheddar','feta','ricotta','brie','gouda'],
  Grains:             ['pasta','rice','flour','bread','oat','noodle','couscous','quinoa','barley','wheat','tortilla','pita'],
  'Oils & Condiments':['oil','vinegar','sauce','ketchup','mustard','mayo','soy','worcestershire','dressing','marinade','seasoning','spice','salt','pepper','cumin','paprika','oregano','cinnamon'],
  'Tins & Jars':      ['tin','canned','jar','tomato paste','crushed tomato','coconut milk','stock','broth','chickpea','kidney'],
};

function guessCategory(name) {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(PANTRY_CAT_KEYWORDS)) {
    if (keywords.some(k => lower.includes(k))) return cat;
  }
  return 'Other';
}

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

  const [loading, setLoading]           = useState(true);
  const [needsHousehold, setNeedsHousehold] = useState(false);
  const [householdInfo, setHouseholdInfo]   = useState(null);
  const [recipes, setRecipes]           = useState([]);
  const [pantry, setPantry]             = useState([]);
  const [mealPlanner, setMealPlanner]   = useState({});
  const [shoppingList, setShoppingList] = useState([]);

  const fetchData = async () => {
    const [r, p, pl, s] = await Promise.all([
      api.getRecipes(),
      api.getPantry(),
      api.getPlanner(),
      api.getShopping(),
    ]);
    setRecipes(r ?? []);
    setPantry(p ?? []);
    setMealPlanner(pl ?? {});
    setShoppingList(s ?? []);
  };

  // ── Fetch all data once authenticated ───────────────────────────────────────
  useEffect(() => {
    if (authState !== 'authenticated') return;
    setLoading(true);
    api.getHousehold()
      .then(info => {
        setHouseholdInfo(info);
        setNeedsHousehold(false);
        return fetchData();
      })
      .catch(err => {
        if (err.status === 403) {
          setNeedsHousehold(true);
        } else {
          console.error(err);
        }
      })
      .finally(() => setLoading(false));
  }, [authState]);

  const completeHouseholdSetup = async (info) => {
    setHouseholdInfo(info);
    setNeedsHousehold(false);
    setLoading(true);
    try { await fetchData(); } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const leaveCurrentHousehold = async () => {
    await api.leaveHousehold();
    setHouseholdInfo(null);
    setNeedsHousehold(true);
    setRecipes([]);
    setPantry([]);
    setMealPlanner({});
    setShoppingList([]);
  };

  const switchHousehold = async (code) => {
    const info = await api.joinHousehold(code);
    setHouseholdInfo(info);
    setLoading(true);
    try { await fetchData(); } catch (err) { console.error(err); }
    finally { setLoading(false); }
    return info;
  };

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

  const moveCheckedToPantry = () => {
    const checkedItems = shoppingList.filter(i => i.checked);
    if (!checkedItems.length) return 0;
    syncPantry(prev => {
      const existing = new Set(prev.map(i => i.name.toLowerCase()));
      const toAdd = checkedItems
        .filter(i => !existing.has(i.name.toLowerCase()))
        .map(i => ({
          name: i.name,
          qty: i.quantity > 1 ? `×${i.quantity}` : '',
          category: guessCategory(i.name),
          expiry: null,
        }));
      return [...prev, ...toAdd];
    });
    syncShopping(p => p.filter(i => !i.checked));
    return checkedItems.length;
  };

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
      householdInfo, needsHousehold, completeHouseholdSetup, leaveCurrentHousehold, switchHousehold,
      recipes,      addRecipe,      updateRecipe,    deleteRecipe,
      pantry,       addPantryItem,  updatePantryItem, deletePantryItem,
      mealPlanner,  assignMeal,     clearMeal,
      shoppingList, setShopping,    addShoppingItem,  toggleShoppingChecked, generateShoppingFromPlanner, moveCheckedToPantry,
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
