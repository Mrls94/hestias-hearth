import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Recipes from "./pages/Recipes";
import Shopping from "./pages/Shopping";
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-700 text-white p-4 text-center text-2xl font-bold relative overflow-hidden">
        🔥 Hestia’s Hearth
        <nav className="mt-2 flex justify-center gap-6 text-lg">
          <Link to="/" className="hover:underline">📖 Recipes</Link>
          <Link to="/shopping" className="hover:underline">🛒 Pantry</Link>
        </nav>
        <div className="ember"></div>
        <div className="ember"></div>
        <div className="ember"></div>
        <div className="ember"></div>
        <div className="ember"></div>
      </header>

      <main className="p-6">
        <Routes>
          <Route path="/" element={<Recipes />} />
          <Route path="/shopping" element={<Shopping />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
