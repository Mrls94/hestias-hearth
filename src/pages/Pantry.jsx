import React, { useState } from 'react';
import { useAppState, expiryStatus, expiryLabel } from '../context/AppState';
import { useTranslation } from 'react-i18next';

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['Produce', 'Protein', 'Dairy', 'Grains', 'Oils & Condiments', 'Tins & Jars', 'Other'];

const CAT_META = {
  'Produce':          { emoji: '🥦' },
  'Protein':          { emoji: '🥩' },
  'Dairy':            { emoji: '🧀' },
  'Grains':           { emoji: '🌾' },
  'Oils & Condiments':{ emoji: '🍶' },
  'Tins & Jars':      { emoji: '🥫' },
  'Other':            { emoji: '📦' },
};

const SAMPLES = [
  { name: 'Olive oil',    qty: '500 ml',      category: 'Oils & Condiments', expiry: null },
  { name: 'Pasta',        qty: '500 g',        category: 'Grains',            expiry: null },
  { name: 'Tomato sauce', qty: '2 cans',       category: 'Tins & Jars',       expiry: '2026-08-15' },
  { name: 'Garlic',       qty: '1 bulb',       category: 'Produce',           expiry: '2026-06-20' },
  { name: 'Feta cheese',  qty: '200 g',        category: 'Dairy',             expiry: '2026-06-10' },
  { name: 'Chickpeas',    qty: '1 can',        category: 'Tins & Jars',       expiry: '2027-01-01' },
  { name: 'Rosemary',     qty: 'small bunch',  category: 'Produce',           expiry: '2026-06-08' },
  { name: 'Rice',         qty: '1 kg',         category: 'Grains',            expiry: null },
  { name: 'Chicken breast', qty: '400 g',      category: 'Protein',           expiry: '2026-06-07' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const EXPIRING_KEY = 'Expiring soon';

function groupByCategory(items) {
  const expiring = items.filter(i => {
    const s = expiryStatus(i.expiry);
    return s === 'soon' || s === 'exp';
  });

  const byCategory = {};
  for (const cat of CATEGORIES) byCategory[cat] = [];
  for (const item of items) {
    const key = CATEGORIES.includes(item.category) ? item.category : 'Other';
    byCategory[key].push(item);
  }

  const groups = [];
  if (expiring.length) groups.push({ key: EXPIRING_KEY, emoji: '⚠️', items: expiring });
  for (const cat of CATEGORIES) {
    if (byCategory[cat].length) groups.push({ key: cat, emoji: CAT_META[cat]?.emoji || '📦', items: byCategory[cat] });
  }
  return groups;
}

function countExpiring(items) {
  return items.filter(i => { const s = expiryStatus(i.expiry); return s === 'soon' || s === 'exp'; }).length;
}

function countOnList(pantry, shoppingList) {
  const listNames = new Set(shoppingList.map(i => i.name.toLowerCase()));
  return pantry.filter(i => listNames.has(i.name.toLowerCase())).length;
}

function countMealsCoverable(pantry, recipes) {
  const pantryNames = new Set(pantry.map(i => i.name.toLowerCase()));
  return recipes.filter(r =>
    (r.ingredients || []).length > 0 &&
    (r.ingredients || []).every(ing => {
      const name = (typeof ing === 'string' ? ing : ing.name).toLowerCase();
      return pantryNames.has(name);
    })
  ).length;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Pantry() {
  const { pantry, addPantryItem, deletePantryItem, shoppingList, recipes } = useAppState();
  const { t } = useTranslation();

  const [form, setForm] = useState({ name: '', qty: '', category: 'Other', expiry: '' });
  const [msg,  setMsg]  = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleAdd = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    addPantryItem({
      name,
      qty:      form.qty.trim(),
      category: form.category,
      expiry:   form.expiry || null,
    });
    setForm({ name: '', qty: '', category: 'Other', expiry: '' });
    setMsg(t('pantry.added', { name }));
    setTimeout(() => setMsg(''), 2500);
  };

  const importSamples = () => {
    SAMPLES.forEach(s => addPantryItem(s));
  };

  const groups       = groupByCategory(pantry);
  const expiringCt   = countExpiring(pantry);
  const onListCt     = countOnList(pantry, shoppingList);
  const coverableCt  = countMealsCoverable(pantry, recipes);

  return (
    <>
      {/* ── Stat strip ── */}
      <div className="pantry-stats">
        <div className="pantry-stat-card">
          <div className="pantry-stat-icon">📦</div>
          <div className="pantry-stat-num">{pantry.length}</div>
          <div className="pantry-stat-label">{t('pantry.stat_items')}</div>
        </div>
        <div className="pantry-stat-card">
          <div className="pantry-stat-icon">⚠️</div>
          <div className={`pantry-stat-num${expiringCt ? ' accent' : ''}`}>{expiringCt}</div>
          <div className="pantry-stat-label">{t('pantry.stat_expiring')}</div>
        </div>
        <div className="pantry-stat-card">
          <div className="pantry-stat-icon">🛒</div>
          <div className={`pantry-stat-num${onListCt ? ' sage' : ''}`}>{onListCt}</div>
          <div className="pantry-stat-label">{t('pantry.stat_on_list')}</div>
        </div>
        <div className="pantry-stat-card">
          <div className="pantry-stat-icon">🍽️</div>
          <div className="pantry-stat-num">{coverableCt}</div>
          <div className="pantry-stat-label">{t('pantry.stat_coverable')}</div>
        </div>
      </div>

      {/* ── Section head ── */}
      <div className="section-head">
        <span className="section-title">{t('pantry.your_pantry')}</span>
        {pantry.length === 0 && (
          <button className="btn-ghost" style={{ fontSize: 13 }} onClick={importSamples}>
            {t('pantry.add_samples')}
          </button>
        )}
      </div>

      {/* ── Add item form ── */}
      <form className="pantry-add-form" onSubmit={handleAdd}>
        <input
          className="pantry-add-input"
          placeholder={t('pantry.name_placeholder')}
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          required
          style={{ flex: '2 1 180px' }}
        />
        <input
          className="pantry-add-input"
          placeholder={t('pantry.qty_placeholder')}
          value={form.qty}
          onChange={e => setForm(f => ({ ...f, qty: e.target.value }))}
          style={{ flex: '1 1 100px' }}
        />
        <select
          className="pantry-add-select"
          value={form.category}
          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
        >
          {CATEGORIES.map(c => <option key={c} value={c}>{t(`pantry.cat_${c}`, c)}</option>)}
        </select>
        <input
          type="date"
          className="pantry-add-input"
          title="Expiry date"
          value={form.expiry}
          onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}
          style={{ flex: '0 1 140px', cursor: 'pointer' }}
        />
        <button type="submit" className="btn-primary" style={{ flexShrink: 0 }}>
          {t('pantry.add_item')}
        </button>
      </form>

      {msg && (
        <p style={{ color: 'var(--sage-dark)', fontSize: 13, marginBottom: 16, marginTop: -8 }}>{msg}</p>
      )}

      {/* ── Groups ── */}
      {pantry.length === 0 ? (
        <div className="card" style={{ padding: '32px 28px', color: 'var(--stone)', textAlign: 'center' }}>
          <p style={{ marginBottom: 16 }}>{t('pantry.empty_message')}</p>
          <button className="btn-primary" onClick={importSamples}>{t('pantry.import_samples')}</button>
        </div>
      ) : (
        <div className="pantry-groups">
          {groups.map(group => (
            <div key={group.key} className="pantry-group-card">
              <div className="pantry-group-header">
                <span className="pantry-group-emoji">{group.emoji}</span>
                <span className="pantry-group-title">{t(`pantry.cat_${group.key}`, group.key)}</span>
              </div>
              {group.items.map(item => {
                const status = expiryStatus(item.expiry);
                const label  = expiryLabel(item.expiry);
                const catEmoji = CAT_META[item.category]?.emoji || '📦';
                if (confirmDelete === item.name) {
                  return (
                    <div key={item.name} className="pantry-item-row" style={{ background: 'var(--terracotta-light)', gap: 10 }}>
                      <span style={{ flex: 1, fontSize: 13.5, color: 'var(--terracotta-dark)', fontWeight: 500 }}>
                        {t('pantry.remove_confirm', { name: item.name })}
                      </span>
                      <button
                        style={{ fontSize: 13, fontWeight: 600, color: 'var(--terracotta-dark)', background: '#fff', border: '1px solid var(--terracotta-light)', cursor: 'pointer', padding: '5px 12px', borderRadius: 8 }}
                        onClick={() => { deletePantryItem(item.name); setConfirmDelete(null); }}
                      >{t('pantry.remove')}</button>
                      <button
                        style={{ fontSize: 13, color: 'var(--stone)', background: 'none', border: 'none', cursor: 'pointer', padding: '5px 8px' }}
                        onClick={() => setConfirmDelete(null)}
                      >{t('pantry.cancel')}</button>
                    </div>
                  );
                }
                return (
                  <div key={item.name} className="pantry-item-row">
                    <div className="pantry-item-icon">{catEmoji}</div>
                    <span className="pantry-item-name">{item.name}</span>
                    {item.qty && <span className="pantry-item-qty">{item.qty}</span>}
                    {status && (
                      <span className={`expiry-badge ${status}`}>{label}</span>
                    )}
                    <button
                      className="pantry-item-del"
                      aria-label={t('pantry.remove_confirm', { name: item.name })}
                      onClick={() => setConfirmDelete(item.name)}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
