import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppState';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
const MEAL_ICONS = { Breakfast: '🌅', Lunch: '☀️', Dinner: '🌙', Snacks: '🍎' };
const DAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function getWeekDates(offset = 0) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toKey(d) {
  return d.toISOString().slice(0, 10);
}

function isToday(d) {
  return toKey(d) === toKey(new Date());
}

function weekLabel(dates) {
  const s = dates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const e = dates[6].toLocaleDateString('en-US', { day: 'numeric' });
  return `Week of ${s} – ${e}, ${dates[6].getFullYear()}`;
}

export default function Planner() {
  const { mealPlanner, assignMeal, clearMeal, recipes, generateShoppingFromPlanner } = useAppState();
  const navigate = useNavigate();
  const [offset, setOffset]       = useState(0);
  const [assigning, setAssigning] = useState(null); // { key, meal }
  const [activeDay, setActiveDay] = useState(() => (new Date().getDay() + 6) % 7);

  const dates = getWeekDates(offset);
  const getRecipe = id => id ? recipes.find(r => r.id === id || r.id === Number(id)) : null;

  const handleSelect = (key, meal, val) => {
    if (val) assignMeal(key, meal, Number(val));
    setAssigning(null);
  };

  const dailyKcal = key => {
    const day = mealPlanner[key] || {};
    const total = MEAL_TYPES.reduce((s, t) => {
      const r = getRecipe(day[t]);
      return s + (r?.kcal || 0);
    }, 0);
    return total || null;
  };

  // Mobile selected day
  const activeDateKey = toKey(dates[activeDay]);
  const activeDayPlan = mealPlanner[activeDateKey] || {};
  const activeDayKcal = MEAL_TYPES
    .map(t => getRecipe(activeDayPlan[t])?.kcal || 0)
    .reduce((a, b) => a + b, 0);

  return (
    <>
      {/* ── Week bar (shared desktop + mobile) ── */}
      <div className="week-bar">
        <div className="week-range">
          <div className="week-nav">
            <button className="week-btn" onClick={() => setOffset(o => o - 1)}>‹</button>
            <button className="week-btn" onClick={() => setOffset(o => o + 1)}>›</button>
          </div>
          <span className="week-range-title">{weekLabel(dates)}</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {offset !== 0 && (
            <button className="btn-ghost" onClick={() => setOffset(0)}>This week</button>
          )}
          <button
            className="btn-primary"
            onClick={() => { generateShoppingFromPlanner(); navigate('/shopping'); }}
          >
            Generate list
          </button>
        </div>
      </div>

      {/* ── Desktop: 7-column grid + footer ── */}
      <div className="planner-grid-wrap">
        <div className="planner-grid">
          <div className="pg-corner" />

          {dates.map((d, i) => (
            <div key={i} className={`pg-dayhead${isToday(d) ? ' today' : ''}`}>
              <div className="pg-day-letter">{DAY_INITIALS[i]}</div>
              <div className="pg-day-num">{d.getDate()}</div>
            </div>
          ))}

          {MEAL_TYPES.map(meal => (
            <React.Fragment key={meal}>
              <div className="pg-rowlabel">
                <span className="ic">{MEAL_ICONS[meal]}</span>
                <span className="tx">{meal}</span>
              </div>
              {dates.map((d, i) => {
                const key      = toKey(d);
                const recipeId = (mealPlanner[key] || {})[meal];
                const recipe   = getRecipe(recipeId);
                const editing  = assigning?.key === key && assigning?.meal === meal;
                return (
                  <div key={i} className={`pg-cell${isToday(d) ? ' today-col' : ''}`}>
                    {recipe ? (
                      <div className="pg-meal" title={recipe.title}>
                        <span className="pg-meal-emoji">{recipe.emoji || '🍽️'}</span>
                        <span className="pg-meal-name">{recipe.title}</span>
                        {recipe.kcal && <span className="pg-meal-kcal">{recipe.kcal} kcal</span>}
                        <button
                          className="pg-meal-clear"
                          onClick={() => clearMeal(key, meal)}
                          aria-label="Remove meal"
                        >×</button>
                      </div>
                    ) : editing ? (
                      <select
                        autoFocus
                        className="pg-select"
                        defaultValue=""
                        onChange={e => handleSelect(key, meal, e.target.value)}
                        onBlur={() => setAssigning(null)}
                      >
                        <option value="">— pick a recipe —</option>
                        {recipes.map(r => (
                          <option key={r.id} value={r.id}>{r.title}</option>
                        ))}
                      </select>
                    ) : (
                      <button
                        className="pg-add"
                        onClick={() => {
                          if (recipes.length === 0) { navigate('/recipes'); return; }
                          setAssigning({ key, meal });
                        }}
                        aria-label={`Add ${meal} on ${d.toLocaleDateString()}`}
                      >+</button>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>

        <div className="planner-foot">
          <div className="pf-label">Daily kcal</div>
          {dates.map((d, i) => {
            const key  = toKey(d);
            const kcal = dailyKcal(key);
            return (
              <div key={i} className={`pf-cell${isToday(d) ? ' today-col' : ''}${kcal ? ' under' : ''}`}>
                <span className="pf-num" style={kcal ? {} : { color: 'var(--stone-light)' }}>
                  {kcal ? kcal.toLocaleString() : '—'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Mobile: day-strip view ── */}
      <div className="planner-mobile">
        {/* Day strip */}
        <div className="daystrip">
          {dates.map((d, i) => (
            <button
              key={i}
              className={`daychip${i === activeDay ? ' active' : ''}`}
              onClick={() => setActiveDay(i)}
            >
              <div className="dc-letter">{DAY_INITIALS[i]}</div>
              <div className="dc-num">{d.getDate()}</div>
            </button>
          ))}
        </div>

        {/* Daily total banner */}
        <div className="day-total-banner">
          <span className="dt-label">Daily total</span>
          <span className="dt-num">{activeDayKcal > 0 ? `${activeDayKcal.toLocaleString()} kcal` : '—'}</span>
        </div>

        {/* Meal blocks */}
        {MEAL_TYPES.map(mealType => {
          const recipe  = getRecipe(activeDayPlan[mealType]);
          const editing = assigning?.key === activeDateKey && assigning?.meal === mealType;
          return (
            <div key={mealType} className="plan-block">
              <div className="plan-block-head">
                <span className="pb-icon">{MEAL_ICONS[mealType]}</span>
                <span className="pb-label">{mealType}</span>
              </div>
              {recipe ? (
                <div className="plan-meal-card">
                  <div className="pm-emoji">{recipe.emoji || '🍽️'}</div>
                  <div className="pm-info">
                    <div className="pm-name">{recipe.title}</div>
                    {recipe.kcal && <div className="pm-kcal">{recipe.kcal} kcal</div>}
                  </div>
                  <button className="pm-clear" onClick={() => clearMeal(activeDateKey, mealType)}>×</button>
                </div>
              ) : editing ? (
                <select
                  autoFocus
                  className="pg-select"
                  defaultValue=""
                  onChange={e => handleSelect(activeDateKey, mealType, e.target.value)}
                  onBlur={() => setAssigning(null)}
                >
                  <option value="">— pick a recipe —</option>
                  {recipes.map(r => <option key={r.id} value={r.id}>{r.emoji} {r.title}</option>)}
                </select>
              ) : (
                <button
                  className="plan-add-btn"
                  onClick={() => {
                    if (recipes.length === 0) { navigate('/recipes'); return; }
                    setAssigning({ key: activeDateKey, meal: mealType });
                  }}
                >
                  + Add {mealType.toLowerCase()}
                </button>
              )}
            </div>
          );
        })}

      </div>
    </>
  );
}
