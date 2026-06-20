import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FlameIcon from '../components/FlameIcon';

export default function Login() {
  const { authState, signIn, signUp, confirmSignUp, forgotPassword, confirmForgotPassword } = useAuth();
  const [mode, setMode] = useState('signin'); // signin | signup | forgot | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [signedUpMsg, setSignedUpMsg] = useState(false);

  async function handle(fn) {
    setError('');
    setBusy(true);
    try { await fn(); }
    catch (e) { setError(e.message || 'Something went wrong'); }
    finally { setBusy(false); }
  }

  function switchMode(next) {
    setMode(next);
    setError('');
  }

  // ── Confirm email after sign-up ──────────────────────────────────────────────
  if (authState === 'confirming') {
    return (
      <div className="login-root">
        <div className="login-card">
          <div className="login-flame"><FlameIcon width={38} height={54} /></div>
          <h1 className="login-title">Check your email</h1>
          <p className="login-sub">We sent a verification code to your inbox.</p>
          <p className="login-sub" style={{ fontSize: 12, color: 'var(--stone)' }}>Can't find it? Check your spam folder.</p>
          <input
            className="login-input"
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle(() => confirmSignUp(code))}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn-primary" onClick={() => handle(() => confirmSignUp(code))} disabled={busy}>
            {busy ? 'Confirming…' : 'Confirm email'}
          </button>
        </div>
      </div>
    );
  }

  // ── Enter code + new password ────────────────────────────────────────────────
  if (mode === 'reset') {
    return (
      <div className="login-root">
        <div className="login-card">
          <div className="login-flame"><FlameIcon width={38} height={54} /></div>
          <h1 className="login-title">Reset password</h1>
          <p className="login-sub">Enter the code we sent to {email} and choose a new password.</p>
          <p className="login-sub" style={{ fontSize: 12, color: 'var(--stone)' }}>Can't find it? Check your spam folder.</p>
          <input
            className="login-input"
            type="text"
            placeholder="Reset code"
            value={code}
            onChange={e => setCode(e.target.value)}
            autoFocus
          />
          <input
            className="login-input"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle(async () => {
              await confirmForgotPassword(email, code, newPassword);
              setMode('signin');
              setCode('');
              setNewPassword('');
            })}
          />
          {error && <p className="login-error">{error}</p>}
          <button
            className="login-btn-primary"
            disabled={busy}
            onClick={() => handle(async () => {
              await confirmForgotPassword(email, code, newPassword);
              setMode('signin');
              setCode('');
              setNewPassword('');
            })}
          >
            {busy ? 'Saving…' : 'Set new password'}
          </button>
          <button className="login-btn-ghost" onClick={() => switchMode('signin')}>
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  // ── Request reset code ───────────────────────────────────────────────────────
  if (mode === 'forgot') {
    return (
      <div className="login-root">
        <div className="login-card">
          <div className="login-flame"><FlameIcon width={38} height={54} /></div>
          <h1 className="login-title">Forgot password?</h1>
          <p className="login-sub">Enter your email and we'll send a reset code.</p>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle(async () => {
              await forgotPassword(email);
              switchMode('reset');
            })}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button
            className="login-btn-primary"
            disabled={busy}
            onClick={() => handle(async () => {
              await forgotPassword(email);
              switchMode('reset');
            })}
          >
            {busy ? 'Sending…' : 'Send reset code'}
          </button>
          <button className="login-btn-ghost" onClick={() => switchMode('signin')}>
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  // ── Sign in / Sign up ────────────────────────────────────────────────────────
  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-flame">🔥</div>
        <h1 className="login-title">Hestia's Hearth</h1>
        <p className="login-sub">{mode === 'signin' ? 'Welcome back.' : 'Create your account.'}</p>

        {signedUpMsg && <p className="login-success">Account created — sign in below.</p>}

        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => {
            if (e.key !== 'Enter') return;
            if (mode === 'signin') handle(() => signIn(email, password));
            else handle(() => signUp(email, password, name));
          }}
        />
        {mode === 'signup' && (
          <input
            className="login-input"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle(() => signUp(email, password, name))}
          />
        )}

        {error && <p className="login-error">{error}</p>}

        <button
          className="login-btn-primary"
          disabled={busy}
          onClick={() => {
            if (mode === 'signin') handle(() => signIn(email, password));
            else handle(() => signUp(email, password, name));
          }}
        >
          {busy
            ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
            : (mode === 'signin' ? 'Sign in' : 'Create account')}
        </button>

        {mode === 'signin' && (
          <button className="login-btn-ghost" onClick={() => switchMode('forgot')}>
            Forgot password?
          </button>
        )}

        <button
          className="login-btn-ghost"
          onClick={() => { switchMode(mode === 'signin' ? 'signup' : 'signin'); setSignedUpMsg(false); }}
        >
          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}
