import React from "react";
import Recipes from "./pages/Recipes";

function App() {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-amber-700 text-white p-4 text-center text-2xl font-bold">
        🔥 Hestia’s Hearth
      </header>
      <Recipes />
    </div>
  );
}

export default App;