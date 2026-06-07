import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppState';

const dateLabel = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric',
});

const STATIC_CONFIG = {
  '/':         { title: 'Home',     eyebrow: dateLabel },
  '/recipes':  { title: 'Recipes',  eyebrow: 'Your recipe collection' },
  '/planner':  { title: 'Planner',  eyebrow: 'Meal & workout planner' },
  '/shopping': { title: 'Shopping', eyebrow: 'This week · aisle-sorted' },
  '/workouts': { title: 'Workouts', eyebrow: 'Scheduled sessions' },
};

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { pantry, recipes } = useAppState();

  let title, eyebrow;
  if (pathname === '/pantry') {
    title   = 'Pantry';
    eyebrow = pantry.length ? `${pantry.length} item${pantry.length !== 1 ? 's' : ''} tracked` : 'Your ingredient stock';
  } else if (pathname === '/recipes') {
    title   = 'Recipes';
    eyebrow = recipes.length ? `${recipes.length} saved` : 'Your recipe collection';
  } else {
    const cfg = STATIC_CONFIG[pathname] ?? { title: "Hestia's Hearth", eyebrow: '' };
    title   = cfg.title;
    eyebrow = cfg.eyebrow;
  }

  return (
    <header className="topbar">
      <div className="topbar-titles">
        {eyebrow && <span className="topbar-eyebrow">{eyebrow}</span>}
        <span className="topbar-title">{title}</span>
      </div>

      <div className="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search recipes, ingredients…" aria-label="Search" />
      </div>

      <button className="icon-btn" aria-label="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span className="dot" aria-hidden="true" />
      </button>

      <button className="btn-primary" onClick={() => navigate('/recipes')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add recipe
      </button>
    </header>
  );
}
