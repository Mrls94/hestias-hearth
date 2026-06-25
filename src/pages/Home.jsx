import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState, expiryStatus, expiryLabel } from '../context/AppState';
import { useAuth } from '../context/AuthContext';
import MeanderDivider from '../components/MeanderDivider';
import { useTranslation } from 'react-i18next';

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner'];
const MEAL_PILL = { Breakfast: 'meal-pill-breakfast', Lunch: 'meal-pill-lunch', Dinner: 'meal-pill-dinner' };

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
    n += MEAL_TYPES.filter(m => day[m]).length;
  }
  return n;
}

export default function Home() {
  const { recipes, mealPlanner, pantry } = useAppState();
  const { userName } = useAuth();
  const { t, i18n } = useTranslation();
  const expiring = pantry.filter(i => ['soon', 'exp'].includes(expiryStatus(i.expiry))).slice(0, 3);
  const navigate = useNavigate();
  const key = todayKey();
  const todayMeals = mealPlanner[key] || {};
  const planned = weekPlanned(mealPlanner);

  const getRecipe = (id) => id ? recipes.find(r => r.id === id || r.id === Number(id)) : null;

  const todayKcal = MEAL_TYPES
    .map(m => getRecipe(todayMeals[m])?.kcal || 0)
    .reduce((a, b) => a + b, 0);

  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
  const dateLabel = new Date()
    .toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })
    .toUpperCase();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return t('home.good_morning');
    if (h < 18) return t('home.good_afternoon');
    return t('home.good_evening');
  })();

  const QA = [
    { icon: '📖', label: t('home.qa_add_recipe'),  desc: t('home.qa_add_recipe_desc'),  color: 'terra', to: '/recipes'  },
    { icon: '📅', label: t('home.qa_plan_meals'),   desc: t('home.qa_plan_meals_desc'),  color: 'sage',  to: '/planner'  },
    { icon: '🛒', label: t('home.qa_shopping'),     desc: t('home.qa_shopping_desc'),    color: 'ochre', to: '/shopping' },
    { icon: '📦', label: t('home.qa_pantry'),       desc: t('home.qa_pantry_desc'),      color: 'stone', to: '/pantry'   },
  ];

  const hasLibrary = recipes.length > 0 || expiring.length > 0;

  return (
    <>
      {/* ── Zone 1: Hero ── */}
      <div className="home-hero">
        <div className="hero-left">
          <div className="hero-greeting">{dateLabel} · {greeting}</div>
          <h1 className="hero-title">{t('home.welcome_prefix')} <em>{userName || t('home.friend')}</em>!</h1>
          <p className="hero-sub">{t('home.hero_sub')}</p>
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">{recipes.length}</div>
            <div className="hero-stat-label">{t('home.stat_recipes')}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{planned}</div>
            <div className="hero-stat-label">{t('home.stat_planned')}</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{todayKcal > 0 ? todayKcal.toLocaleString() : '—'}</div>
            <div className="hero-stat-label">{t('home.stat_kcal')}</div>
          </div>
        </div>
      </div>

      <MeanderDivider />

      {/* ── Zone 2: Today ── */}
      <div className="home-grid">
        <div>
          <div className="section-head">
            <span className="section-title">{t('home.todays_meals')}</span>
            <button className="section-link" onClick={() => navigate('/planner')}>{t('home.view_planner')}</button>
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
                  <span className={`meal-pill ${MEAL_PILL[type]}`}>{t(`planner.meal_${type}`)}</span>
                  <div className="meal-info">
                    <div className="meal-name">
                      {recipe
                        ? recipe.title
                        : <span style={{ color: 'var(--stone)', fontWeight: 400 }}>{t('home.not_planned')}</span>}
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
            <span className="section-title">{t('home.quick_actions')}</span>
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
                  <span className="section-title">{t('home.saved_recipes')}</span>
                  <button className="section-link" onClick={() => navigate('/recipes')}>{t('home.view_all')}</button>
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
                  <span className="section-title">{t('home.use_it_soon')}</span>
                  <button className="section-link" onClick={() => navigate('/pantry')}>{t('home.pantry_link')}</button>
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
