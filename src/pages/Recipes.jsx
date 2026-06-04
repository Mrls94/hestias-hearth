import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import RecipeForm from "../components/RecipeForm";
import { useAppState } from "../context/AppState";

export default function Recipes() {
  const { recipes, addRecipe, deleteRecipe, mealPlanner } = useAppState();
  const [search, setSearch] = useState("");

  const importSampleRecipes = () => {
    const samples = [
      {
        id: Date.now() + 1,
        title: "Simple Tomato Pasta",
        ingredients: ["pasta", "tomato sauce", "olive oil", "garlic", "salt"],
        steps: "- Boil pasta\n- Heat sauce\n- Mix and serve",
        difficulty: "Mortal",
      },
      {
        id: Date.now() + 2,
        title: "Herb Roasted Potatoes",
        ingredients: ["potatoes", "olive oil", "rosemary", "salt", "pepper"],
        steps: "- Chop potatoes\n- Toss with oil and herbs\n- Roast at 200°C for 30-40 min",
        difficulty: "Mortal",
      },
    ];
    // add via context
    samples.forEach((s) => addRecipe(s));
  };

  const filtered = recipes.filter((r) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      r.title.toLowerCase().includes(q) ||
      (r.ingredients || []).join(" ").toLowerCase().includes(q) ||
      (r.steps && r.steps.toLowerCase().includes(q))
    );
  });

  const plannedMealsCount = useMemo(() => {
    if (!mealPlanner) return 0;
    try {
      return Object.values(mealPlanner).flatMap((d) => Object.values(d || {})).filter(Boolean).length;
    } catch {
      return 0;
    }
  }, [mealPlanner]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Hero band similar to design (polished) */}
      <div className="hero-band relative rounded-2xl p-8 mb-6 overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full hero-circle"></div>
        <div className="flex items-start justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-sm hero-subtext">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mt-2 leading-tight">Good evening, <em className="not-italic">friend</em>!</h1>
            <p className="mt-3 hero-subtext">Simple recipe manager for wedding cooking — add recipes, generate shopping lists, and plan meals.</p>
            <div className="mt-5 flex gap-3">
              <a href="#new-recipe-form" className="inline-flex items-center gap-2 text-white px-4 py-2 rounded-full shadow btn-terra">➕ Add recipe</a>
              <Link to="/planner" className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 rounded-md btn-secondary">📅 Planner</Link>
              <Link to="/shopping" className="inline-flex items-center gap-2 px-3 py-2 bg-white/90 rounded-md btn-secondary">🛒 Shopping</Link>
            </div>
          </div>

          <div className="hero-stats flex gap-4 text-center">
            <div className="bg-white/90 rounded-md px-4 py-2">
              <div className="text-2xl font-bold">{recipes.length}</div>
              <div className="text-sm opacity-90">Recipes</div>
            </div>
            <div className="bg-white/90 rounded-md px-4 py-2">
              <div className="text-2xl font-bold">{plannedMealsCount}</div>
              <div className="text-sm opacity-90">Planned meals</div>
            </div>
            <div className="bg-white/90 rounded-md px-4 py-2">
              <div className="text-2xl font-bold">—</div>
              <div className="text-sm opacity-90">kcal today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & quick actions */}
      <div className="flex items-center gap-3 mb-4">
        <input
          aria-label="Search recipes"
          placeholder="Search recipes or ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-3 border rounded"
        />
        <button onClick={importSampleRecipes} className="text-white px-3 py-2 rounded btn-terra-sm">Add samples</button>
      </div>

      {/* Quick actions (polished) */}
      <div className="quick-actions grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <button onClick={() => document.getElementById('new-recipe-form')?.scrollIntoView({behavior:'smooth'})} className="qa-card p-4 flex items-center gap-3 rounded-xl bg-white shadow hover:translate-y-[-4px] transition">
          <div className="qa-icon qa-icon-terra rounded-lg p-3 text-xl">➕</div>
          <div className="qa-label">Add recipe</div>
        </button>
        <button onClick={() => window.location.href = '/planner'} className="qa-card p-4 flex items-center gap-3 rounded-xl bg-white shadow hover:translate-y-[-4px] transition">
          <div className="qa-icon bg-green-100 rounded-lg p-3 text-xl">📅</div>
          <div className="qa-label">Plan meals</div>
        </button>
        <button onClick={() => window.location.href = '/shopping'} className="qa-card p-4 flex items-center gap-3 rounded-xl bg-white shadow hover:translate-y-[-4px] transition">
          <div className="qa-icon bg-yellow-100 rounded-lg p-3 text-xl">🛒</div>
          <div className="qa-label">Shopping list</div>
        </button>
        <button onClick={() => window.location.href = '/ingredients'} className="qa-card p-4 flex items-center gap-3 rounded-xl bg-white shadow hover:translate-y-[-4px] transition">
          <div className="qa-icon bg-gray-100 rounded-lg p-3 text-xl">🧺</div>
          <div className="qa-label">Pantry</div>
        </button>
      </div>

      {/* Today's meals */}
      <div className="section-header mb-4 flex items-center justify-between">
        <h2 className="section-title text-xl font-semibold">Today's meals</h2>
        <Link to="/planner" className="link-terra">View planner →</Link>
      </div>

      <div className="today-card bg-white rounded-lg shadow mb-6">
        {(recipes.slice(0,3)).map((r, idx) => (
          <div key={r.id || idx} className={`today-meal p-4 flex items-center gap-4 ${idx < recipes.length-1 ? 'border-b' : ''}`}>
            <div className="meal-thumb w-12 h-12 rounded-md flex items-center justify-center text-2xl meal-thumb-cream">{r.emoji || '🍽️'}</div>
            <div className="flex-1">
              <div className="meal-meta text-xs text-gray-500 mb-1"> <span className="meal-pill meal-pill-ochre">BREAKFAST</span></div>
              <div className="meal-name font-semibold">{r.title}</div>
            </div>
            <div className="meal-cal text-sm text-gray-600">{r.kcal || '—'} kcal</div>
          </div>
        ))}
      </div>

      {/* Recipe rail (scrollable) */}
      <div className="recipes-scroll mb-6">
        {recipes.slice(0, 8).map((r) => (
          <div key={r.id} className="recipe-card">
            <div className="recipe-img">{r.emoji || '🍽️'}</div>
            <div className="recipe-info">
              <div className="recipe-name">{r.title}</div>
              <div className="recipe-meta">{(r.ingredients||[]).slice(0,2).join(', ')}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe grid */}
      <div className="recipe-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="p-6 bg-white rounded shadow">No recipes yet. Add one from the form below.</div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="recipe-grid-card bg-white rounded-lg shadow p-4 border">
              <div className="flex items-start gap-3">
                <div className="text-4xl">{ (r.emoji) ? r.emoji : '🍽️' }</div>
                <div>
                  <div className="font-semibold text-lg">{r.title}</div>
                  <div className="text-sm text-gray-500">{ (r.ingredients||[]).slice(0,3).join(', ') }</div>
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm font-medium difficulty-terra">{r.difficulty || ''}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navigator.clipboard?.writeText(JSON.stringify(r))} className="text-sm text-gray-600 underline mr-2">Export</button>
                  <button onClick={() => deleteRecipe(r.id)} className="text-sm text-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Inline form for adding new recipes (keeps previous behavior) */}
      <div className="mt-8">
        <RecipeForm onAdd={addRecipe} />
      </div>
    </div>
  );
}