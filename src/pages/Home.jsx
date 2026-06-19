import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState, expiryStatus, expiryLabel } from '../context/AppState';
import { useAuth } from '../context/AuthContext';
import MeanderDivider from '../components/MeanderDivider';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const MEAL_PILL = { Breakfast: 'meal-pill-breakfast', Lunch: 'meal-pill-lunch', Dinner: 'meal-pill-dinner' };

const QA = [
  { icon: '📖', label: 'Add recipe',    desc: 'Save a new dish',    color: 'terra', to: '/recipes'  },
  { icon: '📅', label: 'Plan meals',    desc: "Set the week's menu", color: 'sage',  to: '/planner'  },
  { icon: '🛒', label: 'Shopping list', desc: 'Items to pick up',   color: 'ochre', to: '/shopping' },
  { icon: '📦', label: 'Pantry',        desc: 'What you have',      color: 'stone', to: '/pantry'   },
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function weekPlanned(mealPlanner) {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  let n = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const day = mealPlanner[key] || {};
    n += MEAL_TYPES.filter(t => day[t]).length;
  }
  return n;
}

export default function Home() {
  const { recipes, mealPlanner, pantry } = useAppState();
  const { userName } = useAuth();
  const expiring = pantry.filter(i => ['soon', 'exp'].includes(expiryStatus(i.expiry))).slice(0, 3);
  const navigate = useNavigate();
  const key = todayKey();
  const todayMeals = mealPlanner[key] || {};
  const planned = weekPlanned(mealPlanner);

  const getRecipe = (id) => id ? recipes.find(r => r.id === id || r.id === Number(id)) : null;

  const todayKcal = MEAL_TYPES
    .map(t => getRecipe(todayMeals[t])?.kcal || 0)
    .reduce((a, b) => a + b, 0);

  const dateLabel = new Date()
    .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase();

  const hasLibrary = recipes.length > 0 || expiring.length > 0;

  return (
    <>
      {/* ── Zone 1: Hero ── */}
      <div className="home-hero">
        <div className="hero-left">
          <div className="hero-greeting">{dateLabel} · {getGreeting()}</div>
          <h1 className="hero-title">Welcome back, <em>{userName || 'friend'}</em>!</h1>
          <p className="hero-sub">Simple recipe manager — add recipes, generate shopping lists, and plan meals.</p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">{recipes.length}</div>
            <div className="hero-stat-label">Recipes</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{planned}</div>
            <div className="hero-stat-label">Planned</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{todayKcal > 0 ? todayKcal.toLocaleString() : '—'}</div>
            <div className="hero-stat-label">kcal today</div>
          </div>
        </div>
      </div>

      <MeanderDivider />

      {/* ── Zone 2: Today ── */}
      <div className="home-grid">
        <div>
          <div className="section-head">
            <span className="section-title">Today's meals</span>
            <button className="section-link" onClick={() => navigate('/planner')}>View planner →</button>
          </div>
          <div className="card">
            {MEAL_TYPES.map((type, i) => {
              const recipe = getRecipe(todayMeals[type]);
              return (
                <div
                  key={type}
                  className="meal-row"
                  onClick={() => navigate('/planner')}
                  style={i === MEAL_TYPES.length - 1 ? { borderBottom: 'none' } : {}}
                >
                  <div className="meal-thumb">{recipe?.emoji || '🍽️'}</div>
                  <span className={`meal-pill ${MEAL_PILL[type]}`}>{type}</span>
                  <div className="meal-info">
                    <div className="meal-name">
                      {recipe
                        ? recipe.title
                        : <span style={{ color: 'var(--stone)', fontWeight: 400 }}>Not planned</span>}
                    </div>
                    {recipe && (
                      <div className="meal-sub">
                        {recipe.time ? `${recipe.time} min` : '—'} · {recipe.kcal ? `${recipe.kcal} kcal` : '—'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <div className="section-head">
            <span className="section-title">Quick actions</span>
          </div>
          <div className="qa-grid">
            {QA.map(({ icon, label, desc, color, to }) => (
              <button key={label} className="qa-card" onClick={() => navigate(to)}>
                <div className={`qa-icon qa-icon-${color}`}>{icon}</div>
                <div className="qa-text">
                  <div className="qa-label">{label}</div>
                  <div className="qa-desc">{desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Zone 3: Library ── */}
      {hasLibrary && (
        <>
          <MeanderDivider />
          <div className="home-library">
            {recipes.length > 0 && (
              <>
                <div className="section-head">
                  <span className="section-title">Saved recipes</span>
                  <button className="section-link" onClick={() => navigate('/recipes')}>View all →</button>
                </div>
                <div className="recipe-rail">
                  {recipes.slice(0, 8).map(r => (
                    <div key={r.id} className="recipe-rail-card" onClick={() => navigate('/recipes')}>
                      <div className="rrc-img">
                        <span>{r.emoji || '🍽️'}</span>
                      </div>
                      <div className="rrc-body">
                        <div className="rrc-name">{r.title}</div>
                        <div className="rrc-meta">
                          {r.time ? `⏱ ${r.time} min` : ''}
                          {r.kcal ? ` · 🔥 ${r.kcal} kcal` : ''}
                          {!r.time && !r.kcal ? (r.ingredients || []).slice(0, 2).join(', ') : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {expiring.length > 0 && (
              <>
                <div className="section-head">
                  <span className="section-title">Use it soon</span>
                  <button className="section-link" onClick={() => navigate('/pantry')}>Pantry →</button>
                </div>
                <div className="card">
                  {expiring.map((item, i) => (
                    <div
                      key={item.name}
                      className="alert-row"
                      style={i === expiring.length - 1 ? { borderBottom: 'none' } : {}}
                    >
                      <div className="alert-icon">{item.emoji || '📦'}</div>
                      <span className="alert-name">{item.name}</span>
                      <span className={`expiry-badge ${expiryStatus(item.expiry)}`}>{expiryLabel(item.expiry)}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}
