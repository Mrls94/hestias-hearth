import React from 'react';
import { useTranslation } from 'react-i18next';

export function parseSteps(steps) {
  if (!steps) return [];
  if (Array.isArray(steps)) return steps.filter(Boolean);
  return steps.split('\n').map(s => s.replace(/^[-*]\s*/, '').trim()).filter(Boolean);
}

export const DIFF_BADGE = {
  Mortal: { bg: '#e8f2e9', color: 'var(--sage)',             border: 'var(--sage-light)' },
  Heroic: { bg: 'var(--ochre-light)', color: 'var(--ochre)', border: '#dbb87a' },
  Divine: { bg: 'var(--terracotta-light)', color: 'var(--terracotta-dark)', border: '#d4917a' },
};

export default function RecipeDetail({ recipe: r, onBack, backLabel, onDelete, onEdit }) {
  const { t } = useTranslation();
  const resolvedBackLabel = backLabel ?? t('detail.all_recipes');
  const [checked,   setChecked]   = React.useState({});
  const [doneSteps, setDoneSteps] = React.useState({});

  const steps       = parseSteps(r.steps);
  const ingredients = r.ingredients || [];
  const diff        = DIFF_BADGE[r.difficulty];

  const toggleIng  = (i) => setChecked(p => ({ ...p, [i]: !p[i] }));
  const toggleStep = (i) => setDoneSteps(p => ({ ...p, [i]: !p[i] }));

  const footer = (onDelete || onEdit) && (
    <div className="rd-footer">
      {onEdit   && <button className="rd-edit"   onClick={() => onEdit(r)}>{t('detail.edit_recipe')}</button>}
      {onDelete && <button className="rd-delete" onClick={() => onDelete(r.id)}>{t('detail.delete_recipe')}</button>}
    </div>
  );

  return (
    <div className="rd-wrap">
      <button className="rd-back" onClick={onBack}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        {resolvedBackLabel}
      </button>

      <div className="rd-header">
        <div className="rd-emoji-box">{r.emoji || '🍽️'}</div>
        <div className="rd-header-text">
          <h1 className="rd-title">{r.title}</h1>
          <div className="rd-badges">
            {r.category && <span className="rd-badge rd-badge-cat">{r.category}</span>}
            {diff && (
              <span className="rd-badge" style={{ background: diff.bg, color: diff.color, borderColor: diff.border }}>
                {r.difficulty}
              </span>
            )}
          </div>
        </div>
      </div>

      {(r.time || r.kcal || r.difficulty) && (
        <div className="rd-stats">
          {r.time && (
            <div className="rd-stat">
              <span className="rd-stat-icon">⏱</span>
              <div>
                <div className="rd-stat-val">{r.time} min</div>
                <div className="rd-stat-lbl">{t('detail.cook_time')}</div>
              </div>
            </div>
          )}
          {r.kcal && (
            <div className="rd-stat">
              <span className="rd-stat-icon">🔥</span>
              <div>
                <div className="rd-stat-val">{r.kcal}</div>
                <div className="rd-stat-lbl">{t('detail.kcal_per_serving')}</div>
              </div>
            </div>
          )}
          {r.difficulty && (
            <div className="rd-stat">
              <span className="rd-stat-icon">📊</span>
              <div>
                <div className="rd-stat-val" style={{ color: diff?.color }}>{r.difficulty}</div>
                <div className="rd-stat-lbl">{t('detail.difficulty')}</div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="rd-body">
        {ingredients.length > 0 && (
          <div className="rd-ing-panel">
            <div className="rd-panel-head">
              <span className="rd-panel-title">{t('detail.ingredients')}</span>
              <span className="rd-panel-count">{t('detail.items', { count: ingredients.length })}</span>
            </div>
            <div className="rd-ing-list">
              {ingredients.map((ing, i) => {
                const isObj = ing && typeof ing === 'object';
                const name  = isObj ? ing.name : ing;
                const qty   = isObj ? ing.qty  : null;
                const done  = checked[i];
                return (
                  <div key={i} className="rd-ing-row" onClick={() => toggleIng(i)}>
                    <div className={`rd-ing-check${done ? ' checked' : ''}`} />
                    <div>
                      <div className="rd-ing-name" style={done ? { textDecoration: 'line-through', color: 'var(--stone)' } : {}}>
                        {name}
                      </div>
                      {qty && <span className="rd-ing-qty">{qty}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {steps.length > 0 && (
          <div className="rd-steps-col">
            <h2 className="rd-steps-title">{t('detail.how_to_make')}</h2>
            <div className="rd-steps">
              {steps.map((step, i) => (
                <div key={i} className={`rd-step${doneSteps[i] ? ' done' : ''}`} onClick={() => toggleStep(i)}>
                  <div className="rd-step-num">{i + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            {footer}
          </div>
        )}

        {steps.length === 0 && footer && (
          <div style={{ gridColumn: '1 / -1' }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
