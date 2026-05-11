import React, { useState } from 'react';
import { signInWithGoogle } from '../services/firebaseService.js';
import '../style.css';

export default function Login({ onUserChange, onClose }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);

    const result = await signInWithGoogle();

    if (result.success) {
      onUserChange(result.user);
      onClose?.();
    } else {
      setError(result.error);
    }

    setLoading(false);
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Welcome to SakAI</h1>
        <p>Sign in to save your favorite routes and access them anytime.</p>

        {error && <div className="message error">{error}</div>}

        <button
          className="btn-google"
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? 'Signing In...' : '🔐 Sign In with Google'}
        </button>

        <div className="login-benefits">
          <h3>Benefits of signing in:</h3>
          <ul>
            <li>✓ Save your favorite routes</li>
            <li>✓ Quick access to frequently used commutes</li>
            <li>✓ Personalized recommendations</li>
            <li>✓ Sync across devices</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
