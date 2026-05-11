import React, { useState } from 'react';
import SavedRoutes from '../components/SavedRoutes.jsx';
import '../style.css';

export default function Profile({ user, onLoadRoute }) {
  return (
    <div className="profile-page">
      {user ? (
        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-info">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="profile-avatar"
                />
              )}
              <div>
                <h1>{user.displayName || 'User'}</h1>
                <p>{user.email}</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <SavedRoutes user={user} onLoadRoute={onLoadRoute} />
          </div>
        </div>
      ) : (
        <div className="profile-content">
          <div className="message">
            <h2>Sign in to view your profile and saved routes</h2>
            <p>Use the Sign In button in the navigation bar.</p>
          </div>
        </div>
      )}
    </div>
  );
}
