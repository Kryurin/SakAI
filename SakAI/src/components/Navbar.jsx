import React, { useState } from 'react';
import { signInWithGoogle, signOutUser } from '../services/firebaseService.js';
import '../style.css';

export default function Navbar({ user, onUserChange }) {
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    setLoading(true);
    const result = await signInWithGoogle();

    if (result.success) {
      onUserChange(result.user);
    } else {
      console.error('Sign in error:', result.error);
    }

    setLoading(false);
  }

  async function handleSignOut() {
    setLoading(true);
    const success = await signOutUser();

    if (success) {
      onUserChange(null);
    } else {
      console.error('Sign out failed');
    }

    setLoading(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>🚌 SakAI</h1>
        <p className="subtitle">Iloilo Commuting Guide</p>
      </div>

      <div className="navbar-links">
        <a href="/" className="nav-link">
          Home
        </a>
        {user && (
          <a href="/profile" className="nav-link">
            Saved Routes
          </a>
        )}
      </div>

      <div className="navbar-auth">
        {user ? (
          <div className="user-section">
            {user.photoURL && (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="user-avatar"
              />
            )}
            <span className="user-name">{user.displayName || user.email}</span>
            <button
              className="btn-logout"
              onClick={handleSignOut}
              disabled={loading}
            >
              {loading ? 'Signing Out...' : 'Sign Out'}
            </button>
          </div>
        ) : (
          <button
            className="btn-login"
            onClick={handleSignIn}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In with Google'}
          </button>
        )}
      </div>
    </nav>
  );
}
