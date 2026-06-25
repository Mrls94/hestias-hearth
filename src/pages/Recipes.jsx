import React, { useState, useEffect } from 'react';
import RecipeCreator from '../components/RecipeCreator';
import RecipeDetail from '../components/RecipeDetail';
import { useAppState } from '../context/AppState';
import { useTranslation } from 'react-i18next';

const CHIP_DEFS = [
  { key: 'filter_all',          value: null },
  { key: 'filter_breakfast',    value: 'Breakfast' },
  { key: 'filter_lunch',        value: 'Lunch' },
  { key: 'filter_dinner',       value: 'Dinner' },
  { key: 'filter_vegetarian',   value: 'Vegetarian' },
  { key: 'filter_quick',        value: 'Quick' },
  { key: 'filter_high_protein', value: 'HighProtein' },
];

const SAMPLES = [
  { id: Date.now() + 1, title: 'Tomato Pasta',         emoji: '🍝', ingredients: ['pasta', 'tomato sauce', 'olive oil', 'garlic'], steps: '- Boil pasta\n- Heat sauce\n- Mix and serve', difficulty: 'Mortal', time: 20, kcal: 420, category: 'Dinner' },
  { id: Date.now() + 2, title: 'Herb Roasted Potatoes', emoji: '🥔', ingredients: ['potatoes', 'olive oil', 'rosemary', 'salt'],     steps: '- Chop\n- Toss with oil\n- Roast 200°C 35 min',    difficulty: 'Mortal', time: 40, kcal: 310, category: 'Dinner' },
  { id: Date.now() + 3, title: 'Greek Salad',           emoji: '🥗', ingredients: ['cucumber', 'tomato', 'feta', 'olives'],          steps: '- Chop veg\n- Add feta\n- Drizzle olive oil',         difficulty: 'Mortal', time: 10, kcal: 280, category: 'Vegetarian' },
  { id: Date.now() + 4, title: 'Avocado Toast',         emoji: '🥑', ingredients: ['bread', 'avocado', 'lemon', 'salt', 'pepper'],  steps: '- Toast bread\n- Mash avocado\n- Season and serve',   difficulty: 'Mortal', time: 8,  kcal: 320, category: 'Breakfast' },
];

export default function Recipes() {
  const { recipes, addRecipe, deleteRecipe, updateRecipe } = useAppState();
  const { t } = useTranslation();
  const [activeChip, setActiveChip] = useState(null);
  const [showCreator, setShowCreator] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
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

  if (editingRecipe) {
    return <RecipeCreator recipe={editingRecipe} onClose={() => setEditingRecipe(null)} />;
  }

  if (selectedRecipe) {
    const live = recipes.find(r => r.id === selectedRecipe.id) ?? selectedRecipe;
    return (
      <RecipeDetail
        recipe={live}
        onBack={() => setSelectedRecipe(null)}
        onDelete={(id) => { deleteRecipe(id); setSelectedRecipe(null); }}
        onEdit={(r) => setEditingRecipe(r)}
      />
    );
  }

  return (
    <>
      {/* ── Toolbar ── */}
      <div className="recipes-toolbar">
        <div className="chips">
          {CHIP_DEFS.map(c => (
            <button
              key={c.key}
              className={`chip${activeChip === c.value ? ' active' : ''}`}
              onClick={() => setActiveChip(c.value)}
            >
              {t(`recipes.${c.key}`)}
            </button>
          ))}
        </div>
        <button className="btn-primary" onClick={() => setShowCreator(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {t('recipes.add_recipe')}
        </button>
        {recipes.length === 0 && (
          <button className="btn-ghost" onClick={importSamples}>{t('recipes.add_samples')}</button>
        )}
      </div>

      {/* ── Grid ── */}
      {filtered.length === 0 ? (
        <div style={{ color: 'var(--stone)', padding: '48px 0', textAlign: 'center' }}>
          {activeChip
            ? t('recipes.empty_filtered', { chip: activeChip })
            : t('recipes.empty_all')}
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
                  aria-label={r.favorite ? t('recipes.fav_remove') : t('recipes.fav_add')}
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
                    <span style={{ fontSize: 12, color: 'var(--charcoal)', fontWeight: 500 }}>{t('recipes.delete_confirm')}</span>
                    <button
                      style={{ fontSize: 12, fontWeight: 600, color: 'var(--terracotta-dark)', background: 'var(--terracotta-light)', border: 'none', cursor: 'pointer', padding: '3px 10px', borderRadius: 7 }}
                      onClick={() => { deleteRecipe(r.id); setPendingDelete(null); }}
                    >{t('recipes.delete')}</button>
                    <button
                      style={{ fontSize: 12, color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onClick={() => setPendingDelete(null)}
                    >{t('recipes.cancel')}</button>
                  </div>
                ) : (
                  <button
                    style={{ marginTop: 10, fontSize: 12, color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    onClick={e => { e.stopPropagation(); setPendingDelete(r.id); }}
                  >
                    {t('recipes.delete')}
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
