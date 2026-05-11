import React, { useState } from 'react';
import { formatFare } from '../utils/helpers.js';
import '../style.css';

export default function RouteResult({
  route,
  fare,
  geminiResponse,
  onSave,
  saving,
  userLoggedIn,
}) {
  const [showDetails, setShowDetails] = useState(false);

  if (!route) return null;

  const instructions = geminiResponse?.data || geminiResponse?.fallback;

  return (
    <div className="route-result">
      <div className="result-header">
        <h2>
          {route.type === 'direct' ? '✓ Direct Route' : '↺ Transfer Required'}
        </h2>
        {userLoggedIn && (
          <button
            className="btn-save"
            onClick={onSave}
            disabled={saving}
            title="Save this route for later"
          >
            {saving ? '💾 Saving...' : '❤ Save'}
          </button>
        )}
      </div>

      {/* Route Summary */}
      <div className="result-section summary-section">
        <h3>Route Summary</h3>
        {route.type === 'direct' ? (
          <div className="route-card">
            <div className="route-row">
              <span className="label">Jeepney:</span>
              <span className="value">{route.route.routeName}</span>
            </div>
            <div className="route-row">
              <span className="label">Board at:</span>
              <span className="value">{route.route.boardAt}</span>
            </div>
            <div className="route-row">
              <span className="label">Alight at:</span>
              <span className="value">{route.route.alightAt}</span>
            </div>
            <div className="route-row">
              <span className="label">Distance:</span>
              <span className="value">{route.route.distance.toFixed(2)} km</span>
            </div>
          </div>
        ) : (
          <div className="route-card">
            {route.route.legs.map((leg, index) => (
              <div key={index} className="leg">
                <h4>Leg {index + 1}</h4>
                <div className="route-row">
                  <span className="label">Jeepney:</span>
                  <span className="value">{leg.routeName}</span>
                </div>
                <div className="route-row">
                  <span className="label">Board at:</span>
                  <span className="value">{leg.boardAt}</span>
                </div>
                <div className="route-row">
                  <span className="label">Alight at:</span>
                  <span className="value">{leg.alightAt}</span>
                </div>
                <div className="route-row">
                  <span className="label">Distance:</span>
                  <span className="value">{leg.distance.toFixed(2)} km</span>
                </div>
                {index < route.route.legs.length - 1 && (
                  <div className="transfer-note">Transfer here</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fare Information */}
      <div className="result-section fare-section">
        <h3>Fare Information</h3>
        <div className="fare-card">
          <div className="fare-row">
            <span className="label">Regular Fare:</span>
            <span className="value">{formatFare(fare.regularFare)}</span>
          </div>
          {fare.discountApplied && (
            <>
              <div className="fare-row discount">
                <span className="label">Discount (20%):</span>
                <span className="value">-{formatFare(fare.discountAmount)}</span>
              </div>
            </>
          )}
          <div className="fare-row total">
            <span className="label">Total Fare:</span>
            <span className="value">{formatFare(fare.totalFare)}</span>
          </div>
          {fare.discountApplied && (
            <div className="discount-badge">✓ Discount Applied</div>
          )}
        </div>
      </div>

      {/* AI Instructions */}
      {instructions && (
        <div className="result-section instructions-section">
          <h3>Commute Instructions</h3>
          <div className="instructions-card">
            <div className="instruction-row">
              <span className="label">Summary:</span>
              <span className="value">{instructions.summary}</span>
            </div>
            <div className="instruction-row">
              <span className="label">Estimated Time:</span>
              <span className="value">{instructions.estimatedTime}</span>
            </div>
            {instructions.trafficWarning && (
              <div className="instruction-row warning">
                <span className="label">⚠ Note:</span>
                <span className="value">{instructions.trafficWarning}</span>
              </div>
            )}
          </div>

          {/* Steps */}
          {instructions.steps && instructions.steps.length > 0 && (
            <div className="steps-section">
              <button
                className="btn-toggle"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? '▼ Hide' : '▶ Show'} Step-by-Step Instructions
              </button>

              {showDetails && (
                <div className="steps-list">
                  {instructions.steps.map((step) => (
                    <div key={step.stepNumber} className="step">
                      <div className="step-header">
                        <span className="step-number">Step {step.stepNumber}</span>
                        <span className="step-type">{step.type.toUpperCase()}</span>
                      </div>
                      <div className="step-instruction">{step.instruction}</div>
                      {step.boardAt && (
                        <div className="step-detail">
                          Board at: <strong>{step.boardAt}</strong>
                        </div>
                      )}
                      {step.alightAt && (
                        <div className="step-detail">
                          Alight at: <strong>{step.alightAt}</strong>
                        </div>
                      )}
                      {step.route && (
                        <div className="step-detail">Route: {step.route}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {geminiResponse?.error && (
        <div className="error-message">
          Note: Instructions could not be generated. Using fallback format.
        </div>
      )}
    </div>
  );
}
