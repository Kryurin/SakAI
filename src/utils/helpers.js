/**
 * Format fare value to peso string
 * @param {number} fare - Fare amount
 * @returns {string} Formatted peso amount
 */
export function formatFare(fare) {
  return `₱${fare.toFixed(2)}`;
}

/**
 * Format duration in minutes/hours
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export function formatDuration(minutes) {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

/**
 * Format distance in km
 * @param {number} km - Distance in kilometers
 * @returns {string} Formatted distance
 */
export function formatDistance(km) {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(2)}km`;
}

/**
 * Parse JSON safely from Gemini response
 * @param {string} jsonString - JSON string to parse
 * @returns {object|null} Parsed JSON or null if invalid
 */
export function parseJSON(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

/**
 * Get current timestamp
 * @returns {object} Firestore Timestamp-like object
 */
export function getCurrentTimestamp() {
  return new Date();
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
