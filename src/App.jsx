import React from "react";
import Recipes from "./pages/Recipes";
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="relative bg-amber-700 text-white p-4 text-center text-2xl font-bold overflow-hidden">
        🔥 Hestia’s Hearth
        <div className="ember"></div>
        <div className="ember"></div>
        <div className="ember"></div>
        <div className="ember"></div>
        <div className="ember"></div>
      </header>

      <Recipes />
    </div>
  );
}

export default App;