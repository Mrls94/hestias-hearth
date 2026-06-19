import React, { useState } from 'react';
import { createHousehold, joinHousehold } from '../api';

export default function HouseholdSetup({ onComplete }) {
  const [tab, setTab]       = useState('create'); // 'create' | 'join'
  const [name, setName]     = useState('');
  const [code, setCode]     = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError('');
    try {
      const info = await createHousehold(name.trim());
      onComplete(info);
    } catch (err) {
      setError('Could not create household. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError('');
    try {
      const info = await joinHousehold(code.trim());
      onComplete(info);
    } catch (err) {
      setError(err.status === 404 ? 'Invite code not found. Check it and try again.' : 'Could not join. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-flame">🏠</div>
        <h1 className="login-title">Your household</h1>
        <p className="login-sub">Share recipes, pantry, and shopping with the people you cook for.</p>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'var(--cream)', borderRadius: 10, padding: 3, gap: 3 }}>
          {['create', 'join'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError(''); }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontSize: 13.5,
                fontWeight: 600,
                fontFamily: 'DM Sans, sans-serif',
                background: tab === t ? 'var(--warm-white)' : 'transparent',
                color: tab === t ? 'var(--terracotta-dark)' : 'var(--stone)',
                boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
                transition: 'all .15s',
              }}
            >
              {t === 'create' ? 'Create new' : 'Join existing'}
            </button>
          ))}
        </div>

        {tab === 'create' ? (
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              className="login-input"
              type="text"
              placeholder="e.g. Sebastian & Lau's Kitchen"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={60}
              autoFocus
            />
            <button className="login-btn-primary" type="submit" disabled={loading || !name.trim()}>
              {loading ? 'Creating…' : 'Create household'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleJoin} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              className="login-input"
              type="text"
              placeholder="8-character invite code"
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              maxLength={8}
              autoFocus
              style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}
            />
            <button className="login-btn-primary" type="submit" disabled={loading || code.length < 4}>
              {loading ? 'Joining…' : 'Join household'}
            </button>
          </form>
        )}

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
