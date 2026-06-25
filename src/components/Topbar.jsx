import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppState';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const LaurelSprig = ({ className = '' }) => (
  <svg className={`laurel-sprig ${className}`} viewBox="0 0 22 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M1,13 C6,10 13,7 21,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
    <ellipse cx="7" cy="10" rx="4" ry="2" fill="currentColor" opacity="0.8" transform="rotate(-25 7 10)"/>
    <ellipse cx="13" cy="6" rx="3.5" ry="1.8" fill="currentColor" opacity="0.8" transform="rotate(-40 13 6)"/>
    <ellipse cx="20" cy="2" rx="3" ry="1.5" fill="currentColor" opacity="0.8" transform="rotate(-55 20 2)"/>
  </svg>
);

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

function scrollToEl(selector) {
  const el = selector.startsWith('#')
    ? document.getElementById(selector.slice(1))
    : document.querySelector(selector);
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function Topbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { pantry, recipes, householdInfo, renameHousehold, switchHousehold } = useAppState();
  const { userEmail, signOut } = useAuth();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'es' ? 'es-ES' : 'en-US';
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'es' ? 'en' : 'es');
  const [showMenu, setShowMenu] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [nameBusy, setNameBusy] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinErr, setJoinErr] = useState('');
  const [joinBusy, setJoinBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const userInitial = userEmail ? userEmail[0].toUpperCase() : '?';

  const copyInviteCode = () => {
    if (!householdInfo?.inviteCode) return;
    navigator.clipboard.writeText(householdInfo.inviteCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    setNameBusy(true);
    try {
      await renameHousehold(nameInput.trim());
      setEditingName(false);
    } catch (err) {
      console.error(err);
    } finally {
      setNameBusy(false);
    }
  };

  const handleJoinSubmit = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setJoinBusy(true);
    setJoinErr('');
    try {
      await switchHousehold(joinCode.trim());
      setJoining(false);
      setJoinCode('');
      setShowMenu(false);
    } catch (err) {
      setJoinErr(err.status === 404 ? t('topbar.code_not_found') : t('topbar.could_not_join'));
    } finally {
      setJoinBusy(false);
    }
  };

  // Scroll hairline: add/remove .scrolled on the topbar as #main scrolls
  useEffect(() => {
    const mainEl = document.getElementById('main');
    if (!mainEl) return;
    const header = document.querySelector('.topbar');
    const handler = () => {
      header?.classList.toggle('scrolled', mainEl.scrollTop > 6);
    };
    mainEl.addEventListener('scroll', handler, { passive: true });
    return () => mainEl.removeEventListener('scroll', handler);
  }, []);

  const dateLabel = new Date().toLocaleDateString(locale, {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  let title, eyebrow;
  if (pathname === '/pantry') {
    title   = t('topbar.title_larder');
    eyebrow = pantry.length
      ? t('topbar.eyebrow_pantry_count', { count: pantry.length })
      : t('topbar.eyebrow_pantry_empty');
  } else if (pathname === '/recipes') {
    title   = t('topbar.title_scrolls');
    eyebrow = recipes.length
      ? t('topbar.eyebrow_recipes_count', { count: recipes.length })
      : t('topbar.eyebrow_recipes');
  } else if (pathname === '/planner') {
    title   = t('topbar.title_oracle');
    eyebrow = t('topbar.eyebrow_planner');
  } else if (pathname === '/shopping') {
    title   = t('topbar.title_agora');
    eyebrow = t('topbar.eyebrow_shopping');
  } else if (pathname === '/') {
    title   = t('topbar.title_hearth');
    eyebrow = dateLabel;
  } else {
    title   = t('topbar.title_default');
    eyebrow = '';
  }

  const avatarBtn = (
    <div style={{ position: 'relative' }}>
      <button className="avatar-btn" onClick={() => { setShowMenu(v => !v); setEditingName(false); setJoining(false); }}>{userInitial}</button>
      {showMenu && (
        <div style={{ position: 'absolute', right: 0, top: '110%', background: 'var(--surface)', border: '1px solid var(--stone-light)', borderRadius: 12, padding: '8px 0', zIndex: 100, minWidth: 220, boxShadow: '0 4px 20px rgba(0,0,0,.12)' }}>

          {/* Household section */}
          {householdInfo && (
            <>
              <div style={{ padding: '4px 14px 8px' }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--stone)', fontWeight: 600, marginBottom: 4 }}>{t('topbar.household_section')}</div>
                {editingName ? (
                  <form onSubmit={handleRename} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      maxLength={60}
                      style={{ flex: 1, padding: '5px 8px', border: '1.5px solid var(--terracotta)', borderRadius: 7, fontSize: 13, fontFamily: 'DM Sans, sans-serif', outline: 'none', background: 'var(--warm-white)', color: 'var(--charcoal)', minWidth: 0 }}
                    />
                    <button type="submit" disabled={nameBusy || !nameInput.trim()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sage-dark)', fontSize: 15, padding: '0 3px', opacity: (!nameInput.trim() || nameBusy) ? 0.4 : 1 }}>✓</button>
                    <button type="button" onClick={() => setEditingName(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)', fontSize: 15, padding: '0 3px' }}>✕</button>
                  </form>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <button
                      onClick={() => { setNameInput(householdInfo.name); setEditingName(true); }}
                      title={t('topbar.rename_household')}
                      style={{ flex: 1, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13.5, fontWeight: 600, color: 'var(--charcoal)', textAlign: 'left', fontFamily: 'DM Sans, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    >
                      {householdInfo.name}
                    </button>
                    <button
                      onClick={copyInviteCode}
                      title={copied ? '✓' : `${t('topbar.invite')}: ${householdInfo.inviteCode}`}
                      style={{ background: copied ? 'var(--sage-light)' : 'var(--cream)', border: '1px solid var(--stone-light)', borderRadius: 6, padding: '3px 7px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: copied ? 'var(--sage-dark)' : 'var(--stone)', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s' }}
                    >
                      {copied ? t('topbar.copied') : t('topbar.invite')}
                    </button>
                  </div>
                )}
              </div>

              {joining ? (
                <form onSubmit={handleJoinSubmit} style={{ padding: '0 14px 8px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <input
                    autoFocus
                    value={joinCode}
                    onChange={e => { setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setJoinErr(''); }}
                    placeholder={t('topbar.invite_code_placeholder')}
                    maxLength={8}
                    style={{ padding: '7px 10px', border: '1.5px solid var(--stone-light)', borderRadius: 8, fontSize: 13, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.08em', outline: 'none', background: 'var(--warm-white)', color: 'var(--charcoal)', textTransform: 'uppercase' }}
                  />
                  {joinErr && <div style={{ fontSize: 11.5, color: '#c0392b' }}>{joinErr}</div>}
                  <div style={{ display: 'flex', gap: 5 }}>
                    <button type="submit" disabled={joinBusy || joinCode.length < 4} style={{ flex: 1, padding: '6px 0', background: 'var(--terracotta)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12.5, fontWeight: 600, cursor: 'pointer', opacity: (joinBusy || joinCode.length < 4) ? 0.55 : 1 }}>
                      {joinBusy ? t('topbar.joining') : t('topbar.join')}
                    </button>
                    <button type="button" onClick={() => { setJoining(false); setJoinCode(''); setJoinErr(''); }} style={{ padding: '6px 10px', background: 'none', border: '1px solid var(--stone-light)', borderRadius: 7, fontSize: 12.5, color: 'var(--stone)', cursor: 'pointer' }}>
                      {t('topbar.cancel')}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setJoining(true)}
                  style={{ width: '100%', background: 'none', border: 'none', fontSize: 12, color: 'var(--stone)', cursor: 'pointer', textAlign: 'left', padding: '2px 14px 10px', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {t('topbar.switch_household')}
                </button>
              )}

              <div style={{ height: 1, background: 'var(--stone-light)', margin: '0 0 4px' }} />
            </>
          )}

          <button
            onClick={toggleLang}
            style={{ width: '100%', padding: '8px 14px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, color: 'var(--stone)', fontFamily: 'DM Sans, sans-serif' }}
          >
            {t('lang.switch') === 'ES' ? '🌐 Español' : '🌐 English'}
          </button>
          <button onClick={() => { setShowMenu(false); signOut(); }}
            style={{ width: '100%', padding: '8px 14px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13.5, color: 'var(--charcoal)', fontFamily: 'DM Sans, sans-serif' }}>
            {t('topbar.sign_out')}
          </button>
        </div>
      )}
    </div>
  );

  // Route-specific mobile trailing buttons
  let mobileTrailing;
  if (pathname === '/') {
    mobileTrailing = (
      <>
        <button className="round-btn" aria-label={t('topbar.notifications')}>
          <BellIcon />
          <span className="dot" aria-hidden="true" />
        </button>
        {avatarBtn}
      </>
    );
  } else if (pathname === '/shopping') {
    mobileTrailing = (
      <>
        <button className="round-btn" aria-label={t('topbar.notifications')}>
          <BellIcon />
          <span className="dot" aria-hidden="true" />
        </button>
        {avatarBtn}
      </>
    );
  } else if (pathname === '/recipes') {
    mobileTrailing = (
      <>
        <button className="round-btn" aria-label={t('topbar.add_recipe_btn')}
          onClick={() => scrollToEl('#new-recipe-form')}>
          <PlusIcon />
        </button>
        {avatarBtn}
      </>
    );
  } else if (pathname === '/pantry') {
    mobileTrailing = (
      <>
        <button className="round-btn" aria-label={t('topbar.add_item_btn')}
          onClick={() => scrollToEl('.pantry-add-form')}>
          <PlusIcon />
        </button>
        {avatarBtn}
      </>
    );
  } else {
    mobileTrailing = avatarBtn;
  }

  return (
    <header className="topbar">
      <div className="topbar-titles">
        {eyebrow && <span className="topbar-eyebrow">{eyebrow}</span>}
        <span className="topbar-title">
          <LaurelSprig />
          {title}
          <LaurelSprig className="laurel-sprig-r" />
        </span>
      </div>

      <div className="search topbar-desktop">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input placeholder={t('topbar.search_placeholder')} aria-label={t('topbar.search_placeholder')} />
      </div>

      <button className="icon-btn topbar-desktop" aria-label={t('topbar.notifications')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="19" height="19">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span className="dot" aria-hidden="true" />
      </button>

      <div className="mobile-trailing">
        {mobileTrailing}
      </div>
    </header>
  );
}
