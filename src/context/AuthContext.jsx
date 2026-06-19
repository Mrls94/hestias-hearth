import React, { createContext, useContext, useEffect, useState } from 'react';
import { CognitoUser, AuthenticationDetails, CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { pool } from '../lib/cognito';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState('loading'); // loading | authenticated | unauthenticated | confirming
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingName, setPendingName] = useState('');

  useEffect(() => {
    const user = pool.getCurrentUser();
    if (!user) { setAuthState('unauthenticated'); return; }
    user.getSession((err, session) => {
      if (!err && session?.isValid()) {
        setUserEmail(user.getUsername());
        setUserName(session.getIdToken().decodePayload().name || '');
        setAuthState('authenticated');
      } else {
        setAuthState('unauthenticated');
      }
    });
  }, []);

  const signIn = (email, password) => new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.authenticateUser(
      new AuthenticationDetails({ Username: email, Password: password }),
      {
        onSuccess: (session) => {
          setUserEmail(email);
          setUserName(session.getIdToken().decodePayload().name || '');
          setAuthState('authenticated');
          resolve();
        },
        onFailure: reject,
      }
    );
  });

  const signUp = (email, password, name) => new Promise((resolve, reject) => {
    const attrs = [
      new CognitoUserAttribute({ Name: 'email', Value: email }),
      new CognitoUserAttribute({ Name: 'name', Value: name }),
    ];
    pool.signUp(email, password, attrs, null, (err, result) => {
      if (err) return reject(err);
      setPendingEmail(email);
      setPendingName(name);
      setAuthState('confirming');
      resolve(result);
    });
  });

  const confirmSignUp = (code) => new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: pendingEmail, Pool: pool });
    user.confirmRegistration(code, true, (err) => {
      if (err) return reject(err);
      setUserName(pendingName);
      setAuthState('unauthenticated'); // confirmed — now sign in
      resolve();
    });
  });

  const forgotPassword = (email) => new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.forgotPassword({
      onSuccess: resolve,
      onFailure: reject,
      inputVerificationCode: resolve,
    });
  });

  const confirmForgotPassword = (email, code, newPassword) => new Promise((resolve, reject) => {
    const user = new CognitoUser({ Username: email, Pool: pool });
    user.confirmPassword(code, newPassword, {
      onSuccess: resolve,
      onFailure: reject,
    });
  });

  const signOut = () => {
    pool.getCurrentUser()?.signOut();
    setUserEmail('');
    setUserName('');
    setAuthState('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ authState, userEmail, userName, pendingEmail, signIn, signUp, confirmSignUp, forgotPassword, confirmForgotPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
