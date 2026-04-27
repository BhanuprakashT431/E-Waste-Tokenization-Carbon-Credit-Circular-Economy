import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

// ID generators per role
const genId = {
  user:      () => 'USR-' + Math.random().toString(36).substring(2,8).toUpperCase(),
  collector: () => 'COL-' + Math.random().toString(36).substring(2,8).toUpperCase(),
  recycler:  () => 'REC-' + Math.random().toString(36).substring(2,8).toUpperCase(),
  esg:       () => 'ESG-' + Math.random().toString(36).substring(2,8).toUpperCase(),
};

const DB_KEY  = 'ewaste_users_db';
const SES_KEY = 'ewaste_session';

function loadDB()   { try { return JSON.parse(localStorage.getItem(DB_KEY))  || []; } catch { return []; } }
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function loadSession() { try { return JSON.parse(localStorage.getItem(SES_KEY)); } catch { return null; } }

export function AuthProvider({ children }) {
  const [users,       setUsersState] = useState(loadDB);
  const [currentUser, setCurrentUser] = useState(loadSession);

  const persistUsers = (db) => { setUsersState(db); saveDB(db); };

  // ── Register ─────────────────────────────────────────────────────────────
  const register = (role, data) => {
    const db = loadDB();
    // Prevent duplicate emails
    if (db.find(u => u.email === data.email && u.role === role)) {
      return { ok: false, error: 'An account with this email already exists for this role.' };
    }
    const id = genId[role]?.() || ('ID-' + Date.now());
    const newUser = { ...data, id, role, registeredAt: new Date().toISOString() };
    const updated = [...db, newUser];
    persistUsers(updated);
    return { ok: true, id };
  };

  // ── Login ─────────────────────────────────────────────────────────────────
  // Users login with email+password; others login with ID+password
  const login = (role, identifier, password) => {
    const db = loadDB();
    let user;
    if (role === 'user') {
      user = db.find(u => u.role === 'user' && u.email === identifier && u.password === password);
    } else {
      user = db.find(u => u.role === role && u.id === identifier && u.password === password);
    }
    if (!user) return { ok: false, error: 'Invalid credentials. Please check your ID / email and password.' };
    const session = { userId: user.id, role: user.role, name: user.name || user.companyName };
    setCurrentUser(session);
    localStorage.setItem(SES_KEY, JSON.stringify(session));
    return { ok: true, session };
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(SES_KEY);
  };

  const getProfile = () => {
    if (!currentUser) return null;
    return loadDB().find(u => u.id === currentUser.userId);
  };

  return (
    <AuthContext.Provider value={{ currentUser, users, register, login, logout, getProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
