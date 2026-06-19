import React, { useState } from 'react';
import { useAppState } from '../context/AppState';

const AISLES = [
  { key: 'proteins', emoji: '🥩', label: 'Proteins',     keywords: ['meat','chicken','fish','beef','pork','turkey','salmon','tuna','shrimp','tofu','egg','lentil','bean','lamb','prawn'] },
  { key: 'produce',  emoji: '🥦', label: 'Produce',      keywords: ['onion','garlic','tomato','lettuce','spinach','carrot','potato','broccoli','pepper','celery','cucumber','mushroom','lemon','lime','apple','banana','herb','basil','parsley','cilantro','avocado','zucchini','squash','kale','leek'] },
  { key: 'dairy',    emoji: '🧀', label: 'Dairy',        keywords: ['milk','cheese','butter','cream','yogurt','mozzarella','parmesan','cheddar','feta'] },
  { key: 'pantry',   emoji: '🧂', label: 'Dry & Pantry', keywords: [] },
];

function aisleFor(name) {
  const lower = name.toLowerCase();
  for (const a of AISLES.slice(0, -1)) {
    if (a.keywords.some(k => lower.includes(k))) return a.key;
  }
  return 'pantry';
}

function groupByAisle(items) {
  const map = Object.fromEntries(AISLES.map(a => [a.key, []]));
  items.forEach(item => map[aisleFor(item.name)].push(item));
  return AISLES.map(a => ({ ...a, items: map[a.key] })).filter(a => a.items.length > 0);
}

export default function Shopping() {
  const { shoppingList, toggleShoppingChecked, generateShoppingFromPlanner, setShopping } = useAppState();
  const [pantrySync, setPantrySync] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);

  const total   = shoppingList.length;
  const checked = shoppingList.filter(i => i.checked).length;
  const pct     = total ? Math.round((checked / total) * 100) : 0;
  const groups  = groupByAisle(shoppingList);

  return (
    <div className="shop-layout">

      {/* ── List ── */}
      <div>
        {total === 0 ? (
          <div className="card" style={{ padding: '32px 28px', color: 'var(--stone)' }}>
            <p style={{ marginBottom: 16 }}>No items yet. Generate a shopping list from your meal plan, or add items manually.</p>
            <button className="btn-primary" onClick={generateShoppingFromPlanner}>
              Generate from planner
            </button>
          </div>
        ) : (
          groups.map(aisle => {
            const unchecked = aisle.items.filter(i => !i.checked).length;
            return (
              <div key={aisle.key} className="aisle">
                <div className="aisle-head">
                  <div className="aisle-title">{aisle.emoji} {aisle.label}</div>
                  <div className="aisle-line" />
                  <div className="aisle-count">{unchecked} to buy</div>
                </div>
                {aisle.items.map(item => {
                  const idx = shoppingList.findIndex(i => i.name === item.name);
                  return (
                    <div key={item.name} className="shop-item" onClick={() => toggleShoppingChecked(idx)}>
                      <div className={`check${item.checked ? ' checked' : ''}`}>
                        {item.checked && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                      </div>
                      <span
                        className="shop-item-name"
                        style={{
                          textDecoration: item.checked ? 'line-through' : 'none',
                          color: item.checked ? 'var(--stone)' : 'var(--charcoal)',
                        }}
                      >
                        {item.name}
                      </span>
                      {item.quantity > 1 && (
                        <span style={{ fontSize: 13, color: 'var(--stone)', marginLeft: 'auto' }}>
                          ×{item.quantity}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>

      {/* ── Side panel ── */}
      <div className="shop-panel">
        {/* Summary card */}
        <div className="shop-summary">
          <div className="shop-summary-label">This week's list</div>
          <div className="shop-summary-count">
            {total} item{total !== 1 ? 's' : ''} · {checked} checked off
          </div>
          <div className="shop-progress-track">
            <div className="shop-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="shop-summary-pct">{pct}% complete</div>
        </div>

        {/* Pantry sync toggle */}
        <div className="shop-toggle-card">
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Hide pantry items</div>
            <div style={{ fontSize: 12.5, color: 'var(--stone)', marginTop: 2 }}>
              Pantry sync is {pantrySync ? 'on' : 'off'}
            </div>
          </div>
          <button
            className={`toggle-switch${pantrySync ? ' on' : ''}`}
            onClick={() => setPantrySync(p => !p)}
            role="switch"
            aria-checked={pantrySync}
            aria-label="Toggle pantry sync"
          />
        </div>

        {/* Actions */}
        <button
          className="btn-ghost"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={generateShoppingFromPlanner}
        >
          Regenerate from planner
        </button>
        {total > 0 && (
          confirmClear ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', padding: '4px 0' }}>
              <span style={{ fontSize: 13, color: 'var(--charcoal)' }}>Clear {total} item{total !== 1 ? 's' : ''}?</span>
              <button
                style={{ fontSize: 13, fontWeight: 600, color: 'var(--terracotta-dark)', background: 'var(--terracotta-light)', border: 'none', cursor: 'pointer', padding: '5px 12px', borderRadius: 8 }}
                onClick={() => { setShopping([]); setConfirmClear(false); }}
              >Clear all</button>
              <button
                style={{ fontSize: 13, color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setConfirmClear(false)}
              >Cancel</button>
            </div>
          ) : (
            <button
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--stone)', marginTop: 4 }}
              onClick={() => setConfirmClear(true)}
            >
              Clear list
            </button>
          )
        )}
      </div>

    </div>
  );
}
