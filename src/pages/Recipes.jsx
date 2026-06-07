import React, { useState } from 'react';
import RecipeForm from '../components/RecipeForm';
import { useAppState } from '../context/AppState';

const CHIPS = [
  { label: 'All',               value: null },
  { label: 'Breakfast',         value: 'Breakfast' },
  { label: 'Lunch',             value: 'Lunch' },
  { label: 'Dinner',            value: 'Dinner' },
  { label: 'Vegetarian',        value: 'Vegetarian' },
  { label: 'Quick · under 30',  value: 'Quick' },
];

const SAMPLES = [
  { id: Date.now() + 1, title: 'Tomato Pasta',         emoji: '🍝', ingredients: ['pasta', 'tomato sauce', 'olive oil', 'garlic'], steps: '- Boil pasta\n- Heat sauce\n- Mix and serve', difficulty: 'Mortal', time: 20, kcal: 420, category: 'Dinner' },
  { id: Date.now() + 2, title: 'Herb Roasted Potatoes', emoji: '🥔', ingredients: ['potatoes', 'olive oil', 'rosemary', 'salt'],     steps: '- Chop\n- Toss with oil\n- Roast 200°C 35 min',    difficulty: 'Mortal', time: 40, kcal: 310, category: 'Dinner' },
  { id: Date.now() + 3, title: 'Greek Salad',           emoji: '🥗', ingredients: ['cucumber', 'tomato', 'feta', 'olives'],          steps: '- Chop veg\n- Add feta\n- Drizzle olive oil',         difficulty: 'Mortal', time: 10, kcal: 280, category: 'Vegetarian' },
  { id: Date.now() + 4, title: 'Avocado Toast',         emoji: '🥑', ingredients: ['bread', 'avocado', 'lemon', 'salt', 'pepper'],  steps: '- Toast bread\n- Mash avocado\n- Season and serve',   difficulty: 'Mortal', time: 8,  kcal: 320, category: 'Breakfast' },
];

export default function Recipes() {
  const { recipes, addRecipe, deleteRecipe, updateRecipe } = useAppState();
  const [activeChip, setActiveChip] = useState(null);

  const filtered = activeChip === 'Quick'
    ? recipes.filter(r => (r.time || 999) < 30)
    : activeChip
      ? recipes.filter(r => r.category === activeChip || r.difficulty === activeChip)
      : recipes;

  const importSamples = () => {
    const base = Date.now();
    SAMPLES.forEach((s, i) => addRecipe({ ...s, id: base + i }));
  };

  const scrollToForm = () => document.getElementById('new-recipe-form')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="recipes-toolbar">
        <div className="chips">
          {CHIPS.map(c => (
            <button
              key={c.label}
              className={`chip${activeChip === c.value ? ' active' : ''}`}
              onClick={() => setActiveChip(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={scrollToForm}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add recipe
        </button>
        {recipes.length === 0 && (
          <button className="btn-ghost" onClick={importSamples}>Add samples</button>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ color: 'var(--stone)', padding: '48px 0', textAlign: 'center' }}>
          {activeChip
            ? `No ${activeChip} recipes yet. Try a different filter or add one below.`
            : 'No recipes yet — add one below or import samples.'}
        </div>
      ) : (
        <div className="recipe-grid">
          {filtered.map(r => (
            <div key={r.id} className="rg-card">
              <div className="rg-img">
                {r.category && <span className="rg-tag">{r.category}</span>}
                <span style={{ fontSize: 52 }}>{r.emoji || '🍽️'}</span>
                <button
                  className="rg-fav"
                  aria-label={r.favorite ? 'Remove favourite' : 'Add to favourites'}
                  onClick={e => { e.stopPropagation(); updateRecipe(r.id, { favorite: !r.favorite }); }}
                >
                  {r.favorite ? '♥' : '♡'}
                </button>
              </div>
              <div className="rg-body">
                <div className="rg-name">{r.title}</div>
                <div className="rg-meta">
                  {r.time  && <span>⏱ {r.time} min</span>}
                  {r.kcal  && <span>🔥 {r.kcal} kcal</span>}
                  {!r.time && !r.kcal && r.difficulty && <span>{r.difficulty}</span>}
                </div>
                <button
                  style={{ marginTop: 10, fontSize: 12, color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onClick={() => deleteRecipe(r.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add form ── */}
      <div style={{ marginTop: 52 }}>
        <div className="section-head">
          <span className="section-title">Add a new recipe</span>
        </div>
        <RecipeForm onAdd={addRecipe} />
      </div>
    </>
  );
}
