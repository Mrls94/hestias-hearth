import React, { useState, useRef, useEffect } from 'react';
import { useAppState } from '../context/AppState';
import { useTranslation } from 'react-i18next';

const GLYPHS = [
  // Stews, soups & bowls
  '🍲','🥘','🍛','🍜','🫕','🍱',
  // Pasta & rice
  '🍝','🍚','🍙',
  // Eggs & breakfast
  '🍳','🧇','🥞','🥚',
  // Meat & poultry
  '🥩','🍖','🍗','🥓',
  // Seafood
  '🐟','🍤','🦞','🦀','🦑','🦐',
  // Pizza, wraps & sandwiches
  '🍕','🌮','🫔','🥙','🌯','🥪','🫓','🍔','🌭','🍟',
  // Sushi, dumplings & world dishes
  '🍣','🥟','🧆','🍢','🍡',
  // Breads & baked savory
  '🥐','🍞','🥖','🥨',
  // Salads & veg
  '🥗','🥦','🌽','🍄',
  // Desserts & sweets
  '🍰','🥧','🎂','🧁','🍩','🍪','🍮','🍨','🍦','🍫','🍯',
];

const QUICK_CHIPS = [
  { label: '🫒 Olive oil',       qty: '2 tbsp',   name: 'Olive oil' },
  { label: '🍅 Canned tomatoes', qty: '1 can',    name: 'Canned tomatoes' },
  { label: '🧄 Garlic',          qty: '3 cloves', name: 'Garlic' },
  { label: '🧅 Onion',           qty: '1',        name: 'Onion' },
  { label: '🥚 Eggs',            qty: '2',        name: 'Eggs' },
  { label: '🧀 Feta',            qty: '100 g',    name: 'Feta' },
  { label: '🌿 Basil',           qty: 'handful',  name: 'Basil' },
  { label: '🍋 Lemon',           qty: '1',        name: 'Lemon' },
  { label: '🫘 Chickpeas',       qty: '1 can',    name: 'Chickpeas' },
  { label: '🌾 Quinoa',          qty: '200 g',    name: 'Quinoa' },
  { label: '🧂 Salt',            qty: 'to taste', name: 'Salt' },
  { label: '🍯 Honey',           qty: '1 tbsp',   name: 'Honey' },
];

const DIFFICULTIES = [
  { value: 'Mortal', emoji: '🥄', descKey: 'diff_mortal_desc' },
  { value: 'Heroic', emoji: '⚔️',  descKey: 'diff_heroic_desc' },
  { value: 'Divine', emoji: '⚡',  descKey: 'diff_divine_desc' },
];

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const DIFF_CLASS = { Mortal: 'rc-diff-mortal', Heroic: 'rc-diff-heroic', Divine: 'rc-diff-divine' };

function initForm(recipe = null) {
  if (recipe) {
    const steps = Array.isArray(recipe.steps)
      ? recipe.steps
      : (recipe.steps || '').split('\n').map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
    return {
      name: recipe.title || '',
      glyph: recipe.emoji || '🍲',
      ingredients: [...(recipe.ingredients || []), { qty: '', name: '' }],
      steps: [...steps, ''],
      time: recipe.time ? String(recipe.time) : '',
      calories: recipe.kcal ? String(recipe.kcal) : '',
      category: recipe.category || 'Breakfast',
      difficulty: recipe.difficulty || 'Mortal',
      toast: null,
    };
  }
  return {
    name: '',
    glyph: '🍲',
    ingredients: [
      { qty: '2 tbsp', name: 'Olive oil' },
      { qty: '', name: '' },
    ],
    steps: ['Preheat the hearth and gather your mortal companions.', ''],
    time: '',
    calories: '',
    category: 'Breakfast',
    difficulty: 'Mortal',
    toast: null,
  };
}

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const SaveIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);

export default function RecipeCreator({ onClose, recipe = null }) {
  const { addRecipe, updateRecipe } = useAppState();
  const { t } = useTranslation();
  const [form, setForm] = useState(() => initForm(recipe));
  const nameRef = useRef(null);
  const toastTimer = useRef(null);

  const { name, glyph, ingredients, steps, time, calories, category, difficulty, toast } = form;

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const patch = (obj) => setForm(f => ({ ...f, ...obj }));

  function showToast(emoji, text) {
    clearTimeout(toastTimer.current);
    patch({ toast: { emoji, text } });
    toastTimer.current = setTimeout(() => patch({ toast: null }), 3200);
  }

  // ── Ingredient helpers ──────────────────────────
  const setIngField = (i, field, val) => {
    const next = [...ingredients];
    next[i] = { ...next[i], [field]: val };
    patch({ ingredients: next });
  };
  const addIngRow = () => patch({ ingredients: [...ingredients, { qty: '', name: '' }] });
  const removeIng = (i) => patch({ ingredients: ingredients.filter((_, idx) => idx !== i) });

  const isChipUsed = (chip) =>
    ingredients.some(ing => ing.name.toLowerCase() === chip.name.toLowerCase());

  function addChip(chip) {
    if (isChipUsed(chip)) return;
    const next = [...ingredients];
    const emptyIdx = next.findIndex(ing => !ing.name.trim());
    if (emptyIdx !== -1) {
      next[emptyIdx] = { qty: chip.qty, name: chip.name };
    } else {
      next.push({ qty: chip.qty, name: chip.name });
    }
    patch({ ingredients: next });
  }

  // ── Step helpers ────────────────────────────────
  const setStep = (i, val) => {
    const next = [...steps];
    next[i] = val;
    patch({ steps: next });
  };
  const addStep = () => patch({ steps: [...steps, ''] });
  const removeStep = (i) => patch({ steps: steps.filter((_, idx) => idx !== i) });
  const moveStep = (i, dir) => {
    const next = [...steps];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    patch({ steps: next });
  };

  // ── Save ────────────────────────────────────────
  function handleSave() {
    if (!name.trim()) {
      showToast('📜', t('creator.toast_error'));
      nameRef.current?.focus();
      return;
    }
    const data = {
      title: name.trim(),
      emoji: glyph,
      ingredients: ingredients.filter(i => i.name.trim()),
      steps: steps.filter(s => s.trim()),
      time: parseInt(time) || 30,
      kcal: parseInt(calories) || 450,
      category,
      difficulty,
    };
    if (recipe) {
      updateRecipe(recipe.id, data);
    } else {
      addRecipe({ id: Date.now(), ...data });
    }
    showToast('🔥', t(`creator.toast_${difficulty.toLowerCase()}`));
    setTimeout(onClose, 1600);
  }

  const previewIngs = ingredients.filter(i => i.name.trim());

  return (
    <div className="rc-overlay">

      {/* ── Mobile header (hidden desktop) ── */}
      <div className="rc-overlay-head">
        <button className="btn-ghost" onClick={onClose} style={{ padding: '8px 13px', fontSize: 13 }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          {t('creator.back')}
        </button>
        <span style={{ fontFamily: 'Lora,serif', fontWeight: 600, fontSize: 16, color: 'var(--charcoal)' }}>{recipe ? t('creator.edit_recipe') : t('creator.new_recipe')}</span>
      </div>

      <div className="rc-overlay-scroll">

        {/* ── Hero ── */}
        <div className="rc-hero">
          <div className="rc-hero-left">
            <div className="rc-hero-eyebrow">{t('creator.eyebrow')}</div>
            <div className="rc-hero-title">{recipe ? <>{t('creator.refine_title')} <em>{t('creator.refine_title_em')}</em></> : <>{t('creator.craft_title')} <em>{t('creator.craft_title_em')}</em></>}</div>
            <div className="rc-hero-sub">{recipe ? t('creator.refine_sub') : t('creator.craft_sub')}</div>
          </div>
          <div className="rc-hero-glyph">{glyph}</div>
        </div>

        <div className="rc-layout">

          {/* ── LEFT: cards 1–4 ── */}
          <div className="rc-main">

            {/* Card 1: Name + glyph */}
            <div className="rc-card">
              <div className="rc-card-head">
                <div className="rc-card-num">1</div>
                <div className="rc-card-title">{t('creator.card1_title')}</div>
              </div>
              <label className="rc-label" htmlFor="rc-name">{t('creator.recipe_title_label')}</label>
              <input
                id="rc-name"
                ref={nameRef}
                className="rc-input rc-input-lg"
                placeholder={t('creator.recipe_title_ph')}
                value={name}
                onChange={e => patch({ name: e.target.value })}
              />
              <div style={{ marginTop: 18 }}>
                <label className="rc-label">{t('creator.choose_glyph')}</label>
                <div className="rc-glyph-row">
                  {GLYPHS.map(g => (
                    <button
                      key={g}
                      type="button"
                      className={`rc-glyph-btn${glyph === g ? ' active' : ''}`}
                      onClick={() => patch({ glyph: g })}
                      aria-label={`Select ${g}`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Ingredients */}
            <div className="rc-card">
              <div className="rc-card-head">
                <div className="rc-card-num">2</div>
                <div className="rc-card-title">{t('creator.card2_title')}</div>
                <span className="rc-card-hint">{t('creator.card2_hint')}</span>
              </div>

              <p className="rc-pantry-label">{t('creator.quick_add')}</p>
              <div className="rc-quick-chips" style={{ marginBottom: 20 }}>
                {QUICK_CHIPS.map(chip => (
                  <button
                    key={chip.name}
                    type="button"
                    className={`rc-quick-chip${isChipUsed(chip) ? ' used' : ''}`}
                    onClick={() => addChip(chip)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              <div className="rc-ing-head">
                <span className="rc-label" style={{ margin: 0 }}>{t('creator.qty')}</span>
                <span className="rc-label" style={{ margin: 0 }}>{t('creator.ingredient')}</span>
                <span />
              </div>

              {ingredients.map((ing, i) => (
                <div key={i} className="rc-ing-row">
                  <input
                    className="rc-input"
                    placeholder={t('creator.qty_ph')}
                    value={ing.qty}
                    onChange={e => setIngField(i, 'qty', e.target.value)}
                  />
                  <input
                    className="rc-input"
                    placeholder={t('creator.ingredient_ph')}
                    value={ing.name}
                    onChange={e => setIngField(i, 'name', e.target.value)}
                  />
                  <button
                    type="button"
                    className="rc-remove"
                    aria-label={t('creator.remove_ingredient')}
                    onClick={() => removeIng(i)}
                  >
                    <XIcon />
                  </button>
                </div>
              ))}

              <button type="button" className="rc-add-btn" onClick={addIngRow}>
                <PlusIcon />
                {t('creator.add_ingredient')}
              </button>
            </div>

            {/* Card 3: Steps */}
            <div className="rc-card">
              <div className="rc-card-head">
                <div className="rc-card-num">3</div>
                <div className="rc-card-title">{t('creator.card3_title')}</div>
                <span className="rc-card-hint">{t('creator.card3_hint')}</span>
              </div>

              {steps.map((step, i) => (
                <div key={i} className="rc-step">
                  <div className="rc-step-num">{i + 1}</div>
                  <textarea
                    className="rc-textarea"
                    placeholder={i === 0 ? t('creator.step_ph_first') : t('creator.step_ph_next')}
                    value={step}
                    rows={2}
                    onChange={e => setStep(i, e.target.value)}
                  />
                  <div className="rc-step-actions">
                    <button type="button" className="rc-arrow" aria-label={t('creator.move_up')} disabled={i === 0} onClick={() => moveStep(i, -1)}>
                      <ChevronUpIcon />
                    </button>
                    <button type="button" className="rc-arrow" aria-label={t('creator.move_down')} disabled={i === steps.length - 1} onClick={() => moveStep(i, 1)}>
                      <ChevronDownIcon />
                    </button>
                    <button type="button" className="rc-remove" aria-label={t('creator.remove_step')} onClick={() => removeStep(i)}>
                      <XIcon />
                    </button>
                  </div>
                </div>
              ))}

              <button type="button" className="rc-add-btn" onClick={addStep}>
                <PlusIcon />
                {t('creator.add_step')}
              </button>
            </div>

            {/* Card 4: Fine print */}
            <div className="rc-card">
              <div className="rc-card-head">
                <div className="rc-card-num">4</div>
                <div className="rc-card-title">{t('creator.card4_title')}</div>
                <span className="rc-card-hint">{t('creator.card4_hint')}</span>
              </div>

              <div className="rc-num-grid">
                <div>
                  <label className="rc-label" htmlFor="rc-time">{t('creator.time_label')}</label>
                  <div className="rc-num-wrap">
                    <input
                      id="rc-time"
                      className="rc-input"
                      type="number"
                      min="1"
                      placeholder="30"
                      value={time}
                      onChange={e => patch({ time: e.target.value })}
                    />
                    <span className="rc-num-unit">min</span>
                  </div>
                </div>
                <div>
                  <label className="rc-label" htmlFor="rc-kcal">{t('creator.calories_label')}</label>
                  <div className="rc-num-wrap">
                    <input
                      id="rc-kcal"
                      className="rc-input"
                      type="number"
                      min="1"
                      placeholder="450"
                      value={calories}
                      onChange={e => patch({ calories: e.target.value })}
                    />
                    <span className="rc-num-unit">kcal</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16 }}>
                <label className="rc-label" htmlFor="rc-category">{t('creator.category_label')}</label>
                <select
                  id="rc-category"
                  className="rc-input"
                  value={category}
                  onChange={e => patch({ category: e.target.value })}
                  style={{ cursor: 'pointer' }}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{t(`creator.cat_${c}`, c)}</option>)}
                </select>
              </div>
            </div>

          </div>{/* /rc-main */}

          {/* ── RIGHT: aside ── */}
          <div className="rc-aside">
            <div className="rc-aside-sticky">

              {/* Card 5: Difficulty */}
              <div className="rc-card" style={{ marginBottom: 16 }}>
                <div className="rc-card-head">
                  <div className="rc-card-num">5</div>
                  <div className="rc-card-title">{t('creator.card5_title')}</div>
                </div>
                <div className="rc-diff-grid">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d.value}
                      type="button"
                      className={`rc-diff${difficulty === d.value ? ' active' : ''}`}
                      onClick={() => patch({ difficulty: d.value })}
                    >
                      <span className="rc-diff-emoji">{d.emoji}</span>
                      <span>
                        <span className="rc-diff-name">{d.value}</span>
                        <span className="rc-diff-desc">{t(`creator.${d.descKey}`)}</span>
                      </span>
                      <span className="rc-diff-check">
                        {difficulty === d.value && (
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 10, height: 10 }}>
                            <polyline points="2,6 5,9 10,3"/>
                          </svg>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Live preview */}
              <div className="rc-preview-card">
                <div className="rc-preview-img">
                  {category && <span className="rc-preview-tag">{category}</span>}
                  <span style={{ fontSize: 56 }}>{glyph}</span>
                  <span className={`rc-preview-diff ${DIFF_CLASS[difficulty]}`}>{difficulty}</span>
                </div>
                <div className="rc-preview-body">
                  <div className="rc-preview-eyebrow">{t('creator.live_preview')}</div>
                  <div className="rc-preview-name">{name || t('creator.preview_empty_name')}</div>
                  <div className="rc-preview-meta">
                    {time     ? <span>⏱ {time} min</span>   : null}
                    {calories ? <span>🔥 {calories} kcal</span> : null}
                    {!time && !calories && <span>{t('creator.preview_add_details')}</span>}
                  </div>
                  {previewIngs.length > 0 && (
                    <div className="rc-preview-ings">
                      {previewIngs.map((ing, idx) => (
                        <span key={idx}>
                          {ing.qty ? `${ing.qty} ${ing.name}` : ing.name}
                          {idx < previewIngs.length - 1 ? ' · ' : ''}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Save card (desktop only — hidden via CSS on mobile) */}
              <div className="rc-save-card">
                <button type="button" className="btn-primary" onClick={handleSave}>
                  <SaveIcon />
                  {recipe ? t('creator.save_changes') : t('creator.save_recipe')}
                </button>
                <button
                  type="button"
                  className="btn-ghost"
                  style={{ width: '100%', justifyContent: 'center', marginTop: 2 }}
                  onClick={onClose}
                >
                  {t('creator.cancel')}
                </button>
                <p className="rc-blessing">
                  {t('creator.blessing')}
                </p>
              </div>

            </div>
          </div>{/* /rc-aside */}

        </div>{/* /rc-layout */}

      </div>{/* /rc-overlay-scroll */}

      {/* ── Mobile save bar (hidden desktop) ── */}
      <div className="rc-overlay-savebar">
        <button type="button" className="btn-primary" onClick={handleSave}>
          <SaveIcon />
          {recipe ? t('creator.save_changes') : t('creator.save_recipe')}
        </button>
      </div>

      {/* ── Toast ── */}
      <div className={`rc-toast${toast ? ' show' : ''}`} aria-live="polite">
        <span className="rc-toast-emoji">{toast?.emoji}</span>
        <span>{toast?.text}</span>
      </div>

    </div>
  );
}
