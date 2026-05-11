import React, { useState } from 'react';
import SearchBar from '../components/SearchBar.jsx';
import MapView from '../components/MapView.jsx';
import RouteResult from '../components/RouteResult.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { findRoute } from '../services/router.js';
import { calculateFare, calculateTransferFare } from '../services/fareService.js';
import { generateCommuteInstructions } from '../services/geminiService.js';
import { geocodeAddress } from '../services/mapsService.js';
import { saveRoute } from '../services/firebaseService.js';
import '../style.css';

export default function Home({ user }) {
  const [route, setRoute] = useState(null);
  const [fare, setFare] = useState(null);
  const [geminiResponse, setGeminiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState(null);
  const [saving, setSaving] = useState(false);

  async function handleSearch(params) {
    setLoading(true);
    setError(null);
    setRoute(null);
    setFare(null);
    setGeminiResponse(null);

    try {
      // Geocode origin and destination
      const originCoords = await geocodeAddress(params.origin);
      const destCoords = await geocodeAddress(params.destination);

      if (!originCoords || !destCoords) {
        throw new Error('Could not find origin or destination address');
      }

      // Find route
      const routeResult = findRoute(originCoords, destCoords);

      if (!routeResult.success) {
        throw new Error(routeResult.error);
      }

      // Calculate fare
      let fareData;
      if (routeResult.type === 'direct') {
        fareData = calculateFare(
          routeResult.route.distance,
          params.passengerType
        );
      } else {
        fareData = calculateTransferFare(
          routeResult.route.legs,
          params.passengerType
        );
      }

      // Generate AI instructions
      const aiResponse = await generateCommuteInstructions(
        routeResult,
        params.passengerType
      );

      setSearchParams(params);
      setRoute(routeResult);
      setFare(fareData);
      setGeminiResponse(aiResponse);
    } catch (err) {
      console.error('Search error:', err);
      setError(err.message || 'An error occurred while searching for routes');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveRoute() {
    if (!user || !route || !searchParams) {
      setError('Please sign in to save routes');
      return;
    }

    setSaving(true);

    try {
      const routeData = {
        origin: searchParams.origin,
        destination: searchParams.destination,
        passengerType: searchParams.passengerType,
        routeType: route.type,
        routeDetails: route.route,
      };

      const result = await saveRoute(user.uid, routeData);

      if (result.success) {
        setError('Route saved successfully!');
        setTimeout(() => setError(null), 3000);
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Failed to save route: ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="home-page">
      <div className="search-section">
        <SearchBar onSearch={handleSearch} loading={loading} />
      </div>

      {error && (
        <div className={`message ${error.includes('success') ? 'success' : 'error'}`}>
          {error}
        </div>
      )}

      {searchParams && (
        <MapView
          origin={route?.origin}
          destination={route?.destination}
          route={route}
        />
      )}

      {route && (
        <RouteResult
          route={route}
          fare={fare}
          geminiResponse={geminiResponse}
          onSave={handleSaveRoute}
          saving={saving}
          userLoggedIn={!!user}
        />
      )}

      <LoadingSpinner
        visible={loading}
        message="Finding jeepney routes... This may take a moment."
      />
    </div>
  );
}
