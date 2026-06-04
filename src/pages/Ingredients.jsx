import React from "react";
import IngredientsManager from "../components/IngredientsManager";

export default function Ingredients() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold" style={{color:'var(--terracotta-dark)'}}>🥕 Ingredient Registry</h1>
            <p className="text-gray-600">Create and manage ingredients here. They will be available when adding recipes.</p>
          </div>
        </div>
        <IngredientsManager />
      </div>
    </div>
  );
}
