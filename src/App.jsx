import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Recipes from "./pages/Recipes";
import Shopping from "./pages/Shopping";
import Planner from "./pages/Planner";
import Ingredients from "./pages/Ingredients";
import './App.css'

function App() {
  return (
    <div className="min-h-screen app-root">
      <nav className="top-nav bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="nav-logo flex items-center gap-3">
            <div className="logo-flame" aria-hidden></div>
            <div>
              <div className="text-lg font-semibold">Hestia's <span className="font-serif">Hearth</span></div>
              <div className="text-xs text-gray-500">Recipes · Pantry · Planner</div>
            </div>
          </div>

          <div className="main-links hidden md:flex gap-4">
            <NavLink to="/" className={({isActive})=>`nav-link ${isActive? 'active' : ''}`}>📖 Recipes</NavLink>
            <NavLink to="/ingredients" className={({isActive})=>`nav-link ${isActive? 'active' : ''}`}>🥕 Ingredients</NavLink>
            <NavLink to="/shopping" className={({isActive})=>`nav-link ${isActive? 'active' : ''}`}>🛒 Pantry</NavLink>
            <NavLink to="/planner" className={({isActive})=>`nav-link ${isActive? 'active' : ''}`}>📅 Planner</NavLink>
          </div>

          <div className="nav-actions flex items-center gap-3">
            <button className="icon-btn" title="Notifications">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
            <div className="avatar avatar-terra rounded-full w-8 h-8 flex items-center justify-center">MR</div>
          </div>
        </div>
      </nav>

      <main id="main" className="p-6 pb-24">
        <Routes>
          <Route path="/" element={<Recipes />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/planner" element={<Planner />} />
        </Routes>
      </main>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between">
          <NavLink to="/" className={({isActive})=>`flex flex-col items-center text-xs nav-item ${isActive? 'active' : ''}`}>
            <div>🏠</div>
            <div>Home</div>
          </NavLink>
          <NavLink to="/planner" className={({isActive})=>`flex flex-col items-center text-xs nav-item ${isActive? 'active' : ''}`}>
            <div>📅</div>
            <div>Plan</div>
          </NavLink>
          <NavLink to="/" className={({isActive})=>`flex flex-col items-center text-xs nav-item ${isActive? 'active' : ''}`}>
            <div>📖</div>
            <div>Recipes</div>
          </NavLink>
          <NavLink to="/shopping" className={({isActive})=>`flex flex-col items-center text-xs nav-item ${isActive? 'active' : ''}`}>
            <div>🛒</div>
            <div>Shop</div>
          </NavLink>
          <NavLink to="/ingredients" className={({isActive})=>`flex flex-col items-center text-xs nav-item ${isActive? 'active' : ''}`}>
            <div>🧺</div>
            <div>Pantry</div>
          </NavLink>
        </div>
      </nav>
    </div>
  );
}

export default App;
