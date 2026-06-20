import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppState';
import { useAuth } from '../context/AuthContext';
import FlameIcon from './FlameIcon';

function getWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

function countPlannedMeals(mealPlanner) {
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];
  return getWeekDates().reduce((sum, date) => {
    const day = mealPlanner[date] || {};
    return sum + mealTypes.filter(t => day[t]).length;
  }, 0);
}

const IcoHome = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IcoCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IcoBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);
const IcoCart = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
);
const IcoBox = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

function NavItem({ to, icon, label, count, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
    >
      {icon}
      <span>{label}</span>
      {count != null && <span className="nav-count">{count}</span>}
    </NavLink>
  );
}

export default function Sidebar() {
  const { mealPlanner, recipes, shoppingList, householdInfo, switchHousehold, renameHousehold } = useAppState();
  const { userName, userEmail, signOut } = useAuth();
  const navigate = useNavigate();
  const planned = countPlannedMeals(mealPlanner);
  const shoppingCount = shoppingList.filter(i => !i.checked).length;
  const [copied, setCopied]         = React.useState(false);
  const [editingName, setEditingName] = React.useState(false);
  const [nameInput, setNameInput]   = React.useState('');
  const [nameBusy, setNameBusy]     = React.useState(false);
  const [joining, setJoining]       = React.useState(false);
  const [joinCode, setJoinCode]   = React.useState('');
  const [joinErr, setJoinErr]     = React.useState('');
  const [joinBusy, setJoinBusy]   = React.useState(false);

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
    } catch (err) {
      setJoinErr(err.status === 404 ? 'Code not found.' : 'Could not join.');
    } finally {
      setJoinBusy(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <FlameIcon width={26} height={37} />
        <div className="brand-text">
          Hestia's
          <span>Hearth</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <NavItem to="/"         icon={<IcoHome />}     label="Hearth"    end />
        <NavItem to="/planner"  icon={<IcoCalendar />} label="Planner" />
        <NavItem to="/recipes"  icon={<IcoBook />}     label="Recipes"   count={recipes.length || null} />
        <NavItem to="/shopping" icon={<IcoCart />}     label="Shopping"  count={shoppingCount || null} />
        <NavItem to="/pantry"   icon={<IcoBox />}      label="Pantry" />
      </nav>

      <div className="sidebar-spacer" />

      <div className="sidebar-card">
        <div className="sidebar-card-label">This week</div>
        <div className="sidebar-card-title">{planned} of 21 meals planned</div>
        <button className="sidebar-card-btn" onClick={() => navigate('/planner')}>
          Finish planning →
        </button>
      </div>

      {/* Household bar */}
      {householdInfo && (
        <div style={{ marginBottom: 4 }}>
          <div style={{ padding: '8px 10px', background: 'var(--cream)', borderRadius: joining ? '10px 10px 0 0' : 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--stone)', fontWeight: 500, marginBottom: 1 }}>Household</div>
              {editingName ? (
                <form onSubmit={handleRename} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    maxLength={60}
                    style={{ flex: 1, padding: '3px 6px', border: '1.5px solid var(--terracotta)', borderRadius: 6, fontSize: 12.5, fontFamily: 'DM Sans, sans-serif', outline: 'none', background: 'var(--warm-white)', color: 'var(--charcoal)', minWidth: 0 }}
                  />
                  <button type="submit" disabled={nameBusy || !nameInput.trim()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sage-dark)', fontSize: 14, padding: '0 2px', opacity: (!nameInput.trim() || nameBusy) ? 0.4 : 1 }}>✓</button>
                  <button type="button" onClick={() => setEditingName(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)', fontSize: 14, padding: '0 2px' }}>✕</button>
                </form>
              ) : (
                <button
                  onClick={() => { setNameInput(householdInfo.name); setEditingName(true); }}
                  title="Rename household"
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '100%', textAlign: 'left', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {householdInfo.name}
                </button>
              )}
            </div>
            {!editingName && (
              <button
                onClick={copyInviteCode}
                title={copied ? 'Copied!' : `Invite code: ${householdInfo.inviteCode}`}
                style={{ background: copied ? 'var(--sage-light)' : 'var(--warm-white)', border: '1px solid var(--stone-light)', borderRadius: 7, padding: '5px 8px', cursor: 'pointer', fontSize: 11, fontWeight: 600, color: copied ? 'var(--sage-dark)' : 'var(--stone)', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s' }}
              >
                {copied ? '✓ Copied' : 'Invite'}
              </button>
            )}
          </div>

          {joining ? (
            <form
              onSubmit={handleJoinSubmit}
              style={{ background: 'var(--cream)', borderRadius: '0 0 10px 10px', padding: '6px 10px 10px', display: 'flex', flexDirection: 'column', gap: 5 }}
            >
              <input
                autoFocus
                value={joinCode}
                onChange={e => { setJoinCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')); setJoinErr(''); }}
                placeholder="Invite code"
                maxLength={8}
                style={{ padding: '6px 9px', border: '1.5px solid var(--stone-light)', borderRadius: 7, fontSize: 12.5, fontFamily: 'DM Sans, sans-serif', letterSpacing: '0.08em', outline: 'none', background: 'var(--warm-white)', color: 'var(--charcoal)', textTransform: 'uppercase' }}
              />
              {joinErr && <div style={{ fontSize: 11.5, color: '#c0392b' }}>{joinErr}</div>}
              <div style={{ display: 'flex', gap: 5 }}>
                <button
                  type="submit"
                  disabled={joinBusy || joinCode.length < 4}
                  style={{ flex: 1, padding: '5px 0', background: 'var(--terracotta)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: (joinBusy || joinCode.length < 4) ? 0.55 : 1 }}
                >
                  {joinBusy ? '…' : 'Join'}
                </button>
                <button
                  type="button"
                  onClick={() => { setJoining(false); setJoinCode(''); setJoinErr(''); }}
                  style={{ padding: '5px 8px', background: 'none', border: '1px solid var(--stone-light)', borderRadius: 7, fontSize: 12, color: 'var(--stone)', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setJoining(true)}
              style={{ width: '100%', background: 'none', border: 'none', fontSize: 11.5, color: 'var(--stone)', cursor: 'pointer', textAlign: 'left', padding: '3px 10px 0', fontFamily: 'DM Sans, sans-serif' }}
            >
              Join a different household →
            </button>
          )}
        </div>
      )}

      <div className="profile">
        <div className="avatar" aria-hidden="true">{(userName || userEmail || '?')[0].toUpperCase()}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="profile-name">{userName || userEmail}</div>
          <div className="profile-sub">
            {householdInfo?.memberCount > 1 ? `${householdInfo.memberCount} members` : 'Just you'}
          </div>
        </div>
        <button
          onClick={signOut}
          title="Sign out"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--stone)', padding: '4px', display: 'flex', alignItems: 'center' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}
