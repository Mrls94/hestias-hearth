import React, { useEffect } from 'react';
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

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

function scrollToEl(selector) {
  const el = selector.startsWith('#')
    ? document.getElementById(selector.slice(1))
    : document.querySelector(selector);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { pantry, recipes } = useAppState();

  // Scroll hairline: add/remove .scrolled on the topbar as #main scrolls
  useEffect(() => {
    const mainEl = document.getElementById('main');
    if (!mainEl) return;
    const header = document.querySelector('.topbar');
    const handler = () => {
      header?.classList.toggle('scrolled', mainEl.scrollTop > 6);
    };
    mainEl.addEventListener('scroll', handler, { passive: true });
    return () => mainEl.removeEventListener('scroll', handler);
  }, []);

  let title, eyebrow;
  if (pathname === '/pantry') {
    title   = 'Pantry';
    eyebrow = pantry.length
      ? `${pantry.length} item${pantry.length !== 1 ? 's' : ''} tracked`
      : 'Your ingredient stock';
  } else if (pathname === '/recipes') {
    title   = 'Recipes';
    eyebrow = recipes.length ? `${recipes.length} saved` : 'Your recipe collection';
  } else {
    const cfg = STATIC_CONFIG[pathname] ?? { title: "Hestia's Hearth", eyebrow: '' };
    title   = cfg.title;
    eyebrow = cfg.eyebrow;
  }

  // Route-specific mobile trailing buttons
  let mobileTrailing;
  if (pathname === '/') {
    mobileTrailing = (
      <>
        <button className="round-btn" aria-label="Notifications">
          <BellIcon />
          <span className="dot" aria-hidden="true" />
        </button>
        <button className="avatar-btn">MR</button>
      </>
    );
  } else if (pathname === '/shopping') {
    mobileTrailing = (
      <button className="round-btn" aria-label="Notifications">
        <BellIcon />
        <span className="dot" aria-hidden="true" />
      </button>
    );
  } else if (pathname === '/recipes') {
    mobileTrailing = (
      <button className="round-btn" aria-label="Add recipe"
        onClick={() => scrollToEl('#new-recipe-form')}>
        <PlusIcon />
      </button>
    );
  } else if (pathname === '/pantry') {
    mobileTrailing = (
      <button className="round-btn" aria-label="Add item"
        onClick={() => scrollToEl('.pantry-add-form')}>
        <PlusIcon />
      </button>
    );
  } else {
    mobileTrailing = (
      <button className="round-btn" aria-label="Add">
        <PlusIcon />
      </button>
    );
  }

  return (
    <header className="topbar">
      <div className="topbar-titles">
        {eyebrow && <span className="topbar-eyebrow">{eyebrow}</span>}
        <span className="topbar-title">{title}</span>
      </div>

      <div className="search topbar-desktop">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder="Search recipes, ingredients…" aria-label="Search" />
      </div>

      <button className="icon-btn topbar-desktop" aria-label="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span className="dot" aria-hidden="true" />
      </button>

      <button className="btn-primary topbar-desktop" onClick={() => navigate('/recipes')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        Add recipe
      </button>

      <div className="mobile-trailing">
        {mobileTrailing}
      </div>
    </header>
  );
}
