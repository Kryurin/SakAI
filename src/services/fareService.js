import {
  FARE_BASE,
  FARE_DISTANCE_BASE,
  FARE_PER_KM,
  DISCOUNT_PERCENTAGE,
  DISCOUNT_ELIGIBLE_TYPES,
} from '../utils/constants.js';

/**
 * Calculate regular fare
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Fare amount
 */
export function calculateRegularFare(distanceKm) {
  if (distanceKm <= FARE_DISTANCE_BASE) {
    return FARE_BASE;
  }
  
  const additionalKm = distanceKm - FARE_DISTANCE_BASE;
  return FARE_BASE + additionalKm * FARE_PER_KM;
}

/**
 * Calculate discounted fare
 * @param {number} regularFare - Regular fare amount
 * @returns {number} Discounted fare amount
 */
export function applyDiscount(regularFare) {
  return regularFare * (1 - DISCOUNT_PERCENTAGE);
}

/**
 * Calculate total fare based on distance and passenger type
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} passengerType - Type of passenger (regular, student, senior_citizen, pwd)
 * @returns {object} Fare breakdown
 */
export function calculateFare(distanceKm, passengerType = 'regular') {
  const regularFare = calculateRegularFare(distanceKm);
  const isEligible = DISCOUNT_ELIGIBLE_TYPES.includes(passengerType.toLowerCase());
  
  const fareBreakdown = {
    distance: distanceKm,
    passengerType: passengerType,
    regularFare: Math.round(regularFare * 100) / 100, // Round to 2 decimals
    discountApplied: isEligible,
    discountAmount: isEligible
      ? Math.round((regularFare * DISCOUNT_PERCENTAGE) * 100) / 100
      : 0,
    totalFare: isEligible
      ? Math.round(applyDiscount(regularFare) * 100) / 100
      : Math.round(regularFare * 100) / 100,
  };
  
  return fareBreakdown;
}

/**
 * Calculate total fare for transfer routes
 * @param {array} legs - Array of route legs with distance
 * @param {string} passengerType - Type of passenger
 * @returns {object} Total fare breakdown
 */
export function calculateTransferFare(legs, passengerType = 'regular') {
  const totalDistance = legs.reduce((sum, leg) => sum + leg.distance, 0);
  
  const regularFare = calculateRegularFare(totalDistance);
  const isEligible = DISCOUNT_ELIGIBLE_TYPES.includes(passengerType.toLowerCase());
  
  const farePerLeg = legs.map((leg) => {
    const legRegularFare = calculateRegularFare(leg.distance);
    return {
      routeCode: leg.routeCode,
      distance: leg.distance,
      regularFare: Math.round(legRegularFare * 100) / 100,
      fare: isEligible
        ? Math.round(applyDiscount(legRegularFare) * 100) / 100
        : Math.round(legRegularFare * 100) / 100,
    };
  });
  
  const fareBreakdown = {
    totalDistance: totalDistance,
    passengerType: passengerType,
    regularFare: Math.round(regularFare * 100) / 100,
    discountApplied: isEligible,
    discountAmount: isEligible
      ? Math.round((regularFare * DISCOUNT_PERCENTAGE) * 100) / 100
      : 0,
    totalFare: isEligible
      ? Math.round(applyDiscount(regularFare) * 100) / 100
      : Math.round(regularFare * 100) / 100,
    legBreakdown: farePerLeg,
  };
  
  return fareBreakdown;
}

/**
 * Get discount information
 * @param {string} passengerType - Type of passenger
 * @returns {object} Discount info
 */
export function getDiscountInfo(passengerType) {
  const isEligible = DISCOUNT_ELIGIBLE_TYPES.includes(passengerType.toLowerCase());
  
  return {
    passengerType: passengerType,
    isEligible: isEligible,
    discountPercentage: isEligible ? DISCOUNT_PERCENTAGE * 100 : 0,
    discountReason: isEligible
      ? 'Valid discount passenger type'
      : 'No discount applicable',
  };
}
