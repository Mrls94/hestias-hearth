import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FlameIcon from '../components/FlameIcon';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { authState, signIn, signUp, confirmSignUp, forgotPassword, confirmForgotPassword } = useAuth();
  const { t } = useTranslation();
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
    catch (e) { setError(e.message || t('login.something_wrong')); }
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
          <h1 className="login-title">{t('login.check_email_title')}</h1>
          <p className="login-sub">{t('login.check_email_sub')}</p>
          <p className="login-sub" style={{ fontSize: 12, color: 'var(--stone)' }}>{t('login.check_spam')}</p>
          <input
            className="login-input"
            type="text"
            placeholder={t('login.verification_code')}
            value={code}
            onChange={e => setCode(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle(() => confirmSignUp(code))}
            autoFocus
          />
          {error && <p className="login-error">{error}</p>}
          <button className="login-btn-primary" onClick={() => handle(() => confirmSignUp(code))} disabled={busy}>
            {busy ? t('login.confirming') : t('login.confirm_email')}
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
          <h1 className="login-title">{t('login.reset_title')}</h1>
          <p className="login-sub">{t('login.reset_sub', { email })}</p>
          <p className="login-sub" style={{ fontSize: 12, color: 'var(--stone)' }}>{t('login.check_spam')}</p>
          <input
            className="login-input"
            type="text"
            placeholder={t('login.reset_code')}
            value={code}
            onChange={e => setCode(e.target.value)}
            autoFocus
          />
          <input
            className="login-input"
            type="password"
            placeholder={t('login.new_password')}
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
            {busy ? t('login.saving') : t('login.set_new_password')}
          </button>
          <button className="login-btn-ghost" onClick={() => switchMode('signin')}>
            {t('login.back_to_sign_in')}
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
          <h1 className="login-title">{t('login.forgot_title')}</h1>
          <p className="login-sub">{t('login.forgot_sub')}</p>
          <input
            className="login-input"
            type="email"
            placeholder={t('login.email')}
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
            {busy ? t('login.sending') : t('login.send_reset_code')}
          </button>
          <button className="login-btn-ghost" onClick={() => switchMode('signin')}>
            {t('login.back_to_sign_in')}
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
        <h1 className="login-title">{t('login.title')}</h1>
        <p className="login-sub">{mode === 'signin' ? t('login.welcome_back') : t('login.create_account_sub')}</p>

        {signedUpMsg && <p className="login-success">{t('login.account_created')}</p>}

        <input
          className="login-input"
          type="email"
          placeholder={t('login.email')}
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
        />
        <input
          className="login-input"
          type="password"
          placeholder={t('login.password')}
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
            placeholder={t('login.your_name')}
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
            ? (mode === 'signin' ? t('login.signing_in') : t('login.creating_account'))
            : (mode === 'signin' ? t('login.sign_in') : t('login.create_account'))}
        </button>

        {mode === 'signin' && (
          <button className="login-btn-ghost" onClick={() => switchMode('forgot')}>
            {t('login.forgot_password')}
          </button>
        )}

        <button
          className="login-btn-ghost"
          onClick={() => { switchMode(mode === 'signin' ? 'signup' : 'signin'); setSignedUpMsg(false); }}
        >
          {mode === 'signin' ? t('login.no_account') : t('login.have_account')}
        </button>
      </div>
    </div>
  );
}
