import React, { useEffect, useState } from 'react';
import { getSavedRoutes, deleteSavedRoute } from '../services/firebaseService.js';
import { formatFare } from '../utils/helpers.js';
import '../style.css';

export default function SavedRoutes({ user, onLoadRoute }) {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadSavedRoutes();
  }, [user]);

  async function loadSavedRoutes() {
    if (!user) {
      setRoutes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const result = await getSavedRoutes(user.uid);

    if (result.success) {
      setRoutes(result.routes);
    } else {
      console.error('Failed to load saved routes:', result.error);
      setRoutes([]);
    }

    setLoading(false);
  }

  async function handleDelete(routeId) {
    if (!user) return;

    setDeleting(routeId);
    const result = await deleteSavedRoute(user.uid, routeId);

    if (result.success) {
      setRoutes(routes.filter((r) => r.id !== routeId));
    } else {
      console.error('Failed to delete route:', result.error);
    }

    setDeleting(null);
  }

  if (!user) {
    return (
      <div className="saved-routes">
        <p className="message">Sign in to view saved routes</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="saved-routes">
        <p className="message">Loading saved routes...</p>
      </div>
    );
  }

  if (routes.length === 0) {
    return (
      <div className="saved-routes">
        <p className="message">No saved routes yet</p>
      </div>
    );
  }

  return (
    <div className="saved-routes">
      <h2>Saved Routes</h2>
      <div className="routes-list">
        {routes.map((route) => (
          <div key={route.id} className="saved-route-card">
            <div className="route-info">
              <h3>{route.origin}</h3>
              <div className="arrow">→</div>
              <h3>{route.destination}</h3>
            </div>
            <div className="route-meta">
              <span className="badge">{route.passengerType}</span>
              <span className="date">
                {new Date(route.createdAt?.toDate?.() || route.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="route-actions">
              <button
                className="btn-secondary"
                onClick={() => onLoadRoute(route)}
              >
                Load
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(route.id)}
                disabled={deleting === route.id}
              >
                {deleting === route.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
