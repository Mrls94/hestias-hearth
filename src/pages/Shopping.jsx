import React, { useEffect, useState } from "react";
import ShoppingList from "../components/ShoppingList";

export default function Shopping() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("shoppingList");
    if (stored) {
      try { setItems(JSON.parse(stored)); } catch { setItems([]); }
    } else setItems([]);
  }, []);

  const handleListChange = (list) => {
    setItems(list || []);
  };

  const [checkedCount, setCheckedCount] = useState(0);

  useEffect(() => {
    setCheckedCount(items.filter((it) => it.checked).length || 0);
  }, [items]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="shopping-header-card bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="shopping-header-title font-semibold">This week's list</div>
            <div className="shopping-header-meta text-sm text-gray-500">Auto-generated from planner</div>
          </div>
          <div className="text-sm text-gray-600">{items.length} items · {checkedCount} checked</div>
        </div>
        <div className="shopping-progress mt-3 bg-gray-200 rounded h-2 overflow-hidden"><div className="shopping-progress-fill h-2 progress-fill-terra" style={{width: `${Math.min(100, items.length * 4)}%`}}></div></div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="pantry-toggle-row flex items-center justify-between mb-4">
          <div>Hide pantry items <span className="pantry-badge-accent">pantry sync on</span></div>
          <div className="toggle-switch bg-gray-200 rounded-full w-12 h-6 flex items-center p-1"><div className="bg-white w-4 h-4 rounded-full shadow"/></div>
        </div>

        <ShoppingList onChange={handleListChange} />
      </div>
    </div>
  );
}