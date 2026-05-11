import React from 'react';
import '../style.css';

export default function LoadingSpinner({ visible, message = 'Loading...' }) {
  if (!visible) return null;

  return (
    <div className="loading-spinner-overlay">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>{message}</p>
      </div>
    </div>
  );
}
