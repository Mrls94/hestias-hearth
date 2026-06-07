import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppState';

function getWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function countPlannedMeals(mealPlanner) {
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
  return getWeekDates().reduce((sum, date) => {
    const day = mealPlanner[date] || {};
    return sum + mealTypes.filter(t => day[t]).length;
  }, 0);
}

const IcoHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IcoCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);
const IcoCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
);
const IcoBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);
const IcoDumbbell = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 6.5h11M6.5 17.5h11"/>
    <rect x="3" y="9" width="2" height="6" rx="1"/><rect x="19" y="9" width="2" height="6" rx="1"/>
    <rect x="5" y="7" width="2" height="10" rx="1"/><rect x="17" y="7" width="2" height="10" rx="1"/>
  </svg>
);

function NavItem({ to, icon, label, count, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
    >
      {icon}
      <span>{label}</span>
      {count != null && <span className="nav-count">{count}</span>}
    </NavLink>
  );
}

export default function Sidebar() {
  const { mealPlanner, recipes, shoppingList } = useAppState();
  const navigate = useNavigate();
  const planned = countPlannedMeals(mealPlanner);
  const shoppingCount = shoppingList.filter(i => !i.checked).length;

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo-flame" aria-hidden="true" />
        <div className="brand-text">
          Hestia's
          <span>Hearth</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavItem to="/"         icon={<IcoHome />}     label="Home"     end />
        <NavItem to="/planner"  icon={<IcoCalendar />} label="Planner" />
        <NavItem to="/recipes"  icon={<IcoBook />}     label="Recipes"  count={recipes.length || null} />
        <NavItem to="/shopping" icon={<IcoCart />}     label="Shopping" count={shoppingCount || null} />
        <NavItem to="/pantry"   icon={<IcoBox />}      label="Pantry" />
      </nav>

      <div className="nav-group-label">Fitness</div>
      <NavItem to="/workouts" icon={<IcoDumbbell />} label="Workouts" />

      <div className="sidebar-spacer" />

      <div className="sidebar-card">
        <div className="sidebar-card-label">This week</div>
        <div className="sidebar-card-title">{planned} of 21 meals planned</div>
        <button className="sidebar-card-btn" onClick={() => navigate('/planner')}>
          Finish planning →
        </button>
      </div>

      <div className="profile">
        <div className="avatar" aria-hidden="true">MR</div>
        <div>
          <div className="profile-name">Maya Rivera</div>
          <div className="profile-sub">Household of 2</div>
        </div>
        <button className="profile-menu" aria-label="Profile options">⋯</button>
      </div>
    </aside>
  );
}
