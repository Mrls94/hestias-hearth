import React, { useState } from 'react';
import { useAppState } from '../context/AppState';
import { useTranslation } from 'react-i18next';

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
  const { shoppingList, toggleShoppingChecked, generateShoppingFromPlanner, setShopping, moveCheckedToPantry, pantry } = useAppState();
  const { t } = useTranslation();
  const [pantrySync, setPantrySync] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const [movedMsg, setMovedMsg] = useState('');

  const total   = shoppingList.length;
  const checked = shoppingList.filter(i => i.checked).length;
  const pct     = total ? Math.round((checked / total) * 100) : 0;

  const pantryNames = new Set((pantry || []).map(i => i.name.toLowerCase()));
  const visibleList = pantrySync
    ? shoppingList.filter(i => !pantryNames.has(i.name.toLowerCase()))
    : shoppingList;
  const groups  = groupByAisle(visibleList);

  const handleMoveToPanel = () => {
    const n = moveCheckedToPantry();
    if (n) {
      setMovedMsg(t('shopping.moved', { count: n }));
      setTimeout(() => setMovedMsg(''), 3000);
    }
  };

  return (
    <div className="shop-layout">

      {/* ── List ── */}
      <div>
        {total === 0 ? (
          <div className="card" style={{ padding: '32px 28px', color: 'var(--stone)' }}>
            <p style={{ marginBottom: 16 }}>{t('shopping.empty_message')}</p>
            <button className="btn-primary" onClick={generateShoppingFromPlanner}>
              {t('shopping.generate')}
            </button>
          </div>
        ) : (
          groups.map(aisle => {
            const unchecked = aisle.items.filter(i => !i.checked).length;
            return (
              <div key={aisle.key} className="aisle">
                <div className="aisle-head">
                  <div className="aisle-title">{aisle.emoji} {t(`shopping.aisle_${aisle.key}`)}</div>
                  <div className="aisle-line" />
                  <div className="aisle-count">{t('shopping.to_buy', { count: unchecked })}</div>
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
          <div className="shop-summary-label">{t('shopping.this_weeks_list')}</div>
          <div className="shop-summary-count">
            {t('shopping.summary_count', { count: total, checked })}
          </div>
          <div className="shop-progress-track">
            <div className="shop-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="shop-summary-pct">{t('shopping.complete', { pct })}</div>
        </div>

        {/* Move to pantry */}
        {checked > 0 && (
          <button
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleMoveToPanel}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="17" height="17">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            {t('shopping.move_to_pantry', { count: checked })}
          </button>
        )}
        {movedMsg && (
          <div style={{ fontSize: 13, color: 'var(--sage-dark)', fontWeight: 500, textAlign: 'center', padding: '4px 0' }}>
            ✓ {movedMsg}
          </div>
        )}

        {/* Pantry sync toggle */}
        <div className="shop-toggle-card">
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{t('shopping.hide_pantry')}</div>
            <div style={{ fontSize: 12.5, color: 'var(--stone)', marginTop: 2 }}>
              {pantrySync
                ? t('shopping.hiding', { count: shoppingList.length - visibleList.length })
                : t('shopping.showing_all')}
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
          {t('shopping.regenerate')}
        </button>
        {total > 0 && (
          confirmClear ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', padding: '4px 0' }}>
              <span style={{ fontSize: 13, color: 'var(--charcoal)' }}>{t('shopping.clear_confirm', { count: total })}</span>
              <button
                style={{ fontSize: 13, fontWeight: 600, color: 'var(--terracotta-dark)', background: 'var(--terracotta-light)', border: 'none', cursor: 'pointer', padding: '5px 12px', borderRadius: 8 }}
                onClick={() => { setShopping([]); setConfirmClear(false); }}
              >{t('shopping.clear_all')}</button>
              <button
                style={{ fontSize: 13, color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer' }}
                onClick={() => setConfirmClear(false)}
              >{t('shopping.cancel')}</button>
            </div>
          ) : (
            <button
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--stone)', marginTop: 4 }}
              onClick={() => setConfirmClear(true)}
            >
              {t('shopping.clear')}
            </button>
          )
        )}
      </div>

    </div>
  );
}
