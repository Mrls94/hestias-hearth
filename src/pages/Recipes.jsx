import React, { useState, useEffect } from 'react';
import RecipeCreator from '../components/RecipeCreator';
import { useAppState } from '../context/AppState';

function parseSteps(steps) {
  if (!steps) return [];
  if (Array.isArray(steps)) return steps.filter(Boolean);
  return steps.split('\n').map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
}

const DIFF_BADGE = {
  Mortal: { bg: '#e8f2e9', color: 'var(--sage)',          border: 'var(--sage-light)' },
  Heroic: { bg: 'var(--ochre-light)', color: 'var(--ochre)', border: '#dbb87a' },
  Divine: { bg: 'var(--terracotta-light)', color: 'var(--terracotta-dark)', border: '#d4917a' },
};

function RecipeDetail({ recipe: r, onBack, onDelete }) {
  const [checked, setChecked] = React.useState({});
  const [doneStes, setDoneSteps] = React.useState({});

  const steps = parseSteps(r.steps);
  const ingredients = r.ingredients || [];

  const toggleIng = (i) => setChecked(p => ({ ...p, [i]: !p[i] }));
  const toggleStep = (i) => setDoneSteps(p => ({ ...p, [i]: !p[i] }));

  const diff = DIFF_BADGE[r.difficulty];

  return (
    <div className="rd-wrap">
      {/* Back */}
      <button className="rd-back" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        All recipes
      </button>

      {/* Header */}
      <div className="rd-header">
        <div className="rd-emoji-box">{r.emoji || '🍽️'}</div>
        <div className="rd-header-text">
          <h1 className="rd-title">{r.title}</h1>
          <div className="rd-badges">
            {r.category && (
              <span className="rd-badge rd-badge-cat">{r.category}</span>
            )}
            {diff && (
              <span className="rd-badge" style={{ background: diff.bg, color: diff.color, borderColor: diff.border }}>
                {r.difficulty}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {(r.time || r.kcal || r.difficulty) && (
        <div className="rd-stats">
          {r.time && (
            <div className="rd-stat">
              <span className="rd-stat-icon">⏱</span>
              <div>
                <div className="rd-stat-val">{r.time} min</div>
                <div className="rd-stat-lbl">Cook time</div>
              </div>
            </div>
          )}
          {r.kcal && (
            <div className="rd-stat">
              <span className="rd-stat-icon">🔥</span>
              <div>
                <div className="rd-stat-val">{r.kcal}</div>
                <div className="rd-stat-lbl">kcal per serving</div>
              </div>
            </div>
          )}
          {r.difficulty && (
            <div className="rd-stat">
              <span className="rd-stat-icon">📊</span>
              <div>
                <div className="rd-stat-val" style={{ color: diff?.color }}>{r.difficulty}</div>
                <div className="rd-stat-lbl">Difficulty</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Two-column body */}
      <div className="rd-body">

        {/* Ingredients panel */}
        {ingredients.length > 0 && (
          <div className="rd-ing-panel">
            <div className="rd-panel-head">
              <span className="rd-panel-title">Ingredients</span>
              <span className="rd-panel-count">{ingredients.length} items</span>
            </div>
            <div className="rd-ing-list">
              {ingredients.map((ing, i) => {
                const isObj = ing && typeof ing === 'object';
                const name = isObj ? ing.name : ing;
                const qty  = isObj ? ing.qty  : null;
                const done = checked[i];
                return (
                  <div key={i} className="rd-ing-row" onClick={() => toggleIng(i)}>
                    <div className={`rd-ing-check${done ? ' checked' : ''}`} />
                    <div>
                      <div className="rd-ing-name" style={done ? { textDecoration: 'line-through', color: 'var(--stone)' } : {}}>
                        {name}
                      </div>
                      {qty && <span className="rd-ing-qty">{qty}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <div className="rd-steps-col">
            <h2 className="rd-steps-title">How to make it</h2>
            <div className="rd-steps">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className={`rd-step${doneStes[i] ? ' done' : ''}`}
                  onClick={() => toggleStep(i)}
                >
                  <div className="rd-step-num">{i + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="rd-footer">
              <button className="rd-delete" onClick={() => onDelete(r.id)}>Delete recipe</button>
            </div>
          </div>
        )}

        {/* If no steps, show delete below ingredients */}
        {steps.length === 0 && (
          <div className="rd-footer" style={{ gridColumn: '1 / -1' }}>
            <button className="rd-delete" onClick={() => onDelete(r.id)}>Delete recipe</button>
          </div>
        )}

      </div>
    </div>
  );
}

const CHIPS = [
  { label: 'All',               value: null },
  { label: 'Breakfast',         value: 'Breakfast' },
  { label: 'Lunch',             value: 'Lunch' },
  { label: 'Dinner',            value: 'Dinner' },
  { label: 'Vegetarian',        value: 'Vegetarian' },
  { label: 'Quick · under 30',  value: 'Quick' },
  { label: 'High protein',      value: 'HighProtein' },
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
  const [showCreator, setShowCreator] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const handler = () => setShowCreator(true);
    window.addEventListener('open-recipe-creator', handler);
    return () => window.removeEventListener('open-recipe-creator', handler);
  }, []);

  const filtered = activeChip === 'Quick'
    ? recipes.filter(r => (r.time || 999) < 30)
    : activeChip === 'HighProtein'
      ? recipes.filter(r => (r.kcal || 0) > 500)
      : activeChip
        ? recipes.filter(r => r.category === activeChip || r.difficulty === activeChip)
        : recipes;

  const importSamples = () => {
    const base = Date.now();
    SAMPLES.forEach((s, i) => addRecipe({ ...s, id: base + i }));
  };

  if (showCreator) {
    return <RecipeCreator onClose={() => setShowCreator(false)} />;
  }

  if (selectedRecipe) {
    const live = recipes.find(r => r.id === selectedRecipe.id) ?? selectedRecipe;
    return (
      <RecipeDetail
        recipe={live}
        onBack={() => setSelectedRecipe(null)}
        onDelete={(id) => { deleteRecipe(id); setSelectedRecipe(null); }}
      />
    );
  }

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
        <button className="btn-primary" onClick={() => setShowCreator(true)}>
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
            : 'No recipes yet — add one or import samples.'}
        </div>
      ) : (
        <div className="recipe-grid">
          {filtered.map(r => (
            <div key={r.id} className="rg-card" onClick={() => setSelectedRecipe(r)}>
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
                {pendingDelete === r.id ? (
                  <div style={{ marginTop: 10, display: 'flex', gap: 6, alignItems: 'center' }} onClick={e => e.stopPropagation()}>
                    <span style={{ fontSize: 12, color: 'var(--charcoal)', fontWeight: 500 }}>Delete recipe?</span>
                    <button
                      style={{ fontSize: 12, fontWeight: 600, color: 'var(--terracotta-dark)', background: 'var(--terracotta-light)', border: 'none', cursor: 'pointer', padding: '3px 10px', borderRadius: 7 }}
                      onClick={() => { deleteRecipe(r.id); setPendingDelete(null); }}
                    >Delete</button>
                    <button
                      style={{ fontSize: 12, color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => setPendingDelete(null)}
                    >Cancel</button>
                  </div>
                ) : (
                  <button
                    style={{ marginTop: 10, fontSize: 12, color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={e => { e.stopPropagation(); setPendingDelete(r.id); }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
