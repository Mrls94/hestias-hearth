import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Shopping from './pages/Shopping';
import Planner from './pages/Planner';
import Pantry from './pages/Pantry';
import './App.css';

export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main" id="main">
        <Topbar />
        <div className="content">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/recipes"  element={<Recipes />} />
            <Route path="/shopping" element={<Shopping />} />
            <Route path="/planner"  element={<Planner />} />
            <Route path="/pantry"   element={<Pantry />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
