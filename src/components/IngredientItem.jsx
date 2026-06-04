import React, { useState } from "react";

export default function IngredientItem({ item, onToggle }) {
  // item: { name, quantity, checked }
  const checked = Boolean(item.checked);

  return (
    <div
      className={`flex items-center gap-2 p-2 rounded ${
        checked ? "bg-[var(--terracotta-light)] animate-pulse" : "bg-white"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onToggle && onToggle(item)}
        className="accent-[var(--terracotta-dark)]"
        aria-label={`Mark ${item.name} as obtained`}
      />
      <span className={checked ? "line-through text-gray-500" : ""}>
        {item.name ? item.name : "Unknown"}
        {item.quantity ? ` ×${item.quantity}` : ""}
      </span>
      {checked && (
        <span className="text-[var(--terracotta-dark)] text-sm italic">
          ✨ Accepted by Hestia
        </span>
      )}
    </div>
  );
}