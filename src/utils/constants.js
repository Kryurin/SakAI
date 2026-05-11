// Walking radius for finding nearby jeepney stops
export const WALK_RADIUS_METERS = 400;

// Fare constants
export const FARE_BASE = 13; // Base fare for first 4km
export const FARE_DISTANCE_BASE = 4; // km
export const FARE_PER_KM = 1.80; // Per km after base distance

// Discounts
export const DISCOUNT_PERCENTAGE = 0.20; // 20% discount for eligible passengers

// Eligible discount passenger types
export const DISCOUNT_ELIGIBLE_TYPES = ['student', 'senior_citizen', 'pwd'];

// Passenger types
export const PASSENGER_TYPES = {
  REGULAR: 'regular',
  STUDENT: 'student',
  SENIOR_CITIZEN: 'senior_citizen',
  PWD: 'pwd',
};

// Default map center (Iloilo City)
export const DEFAULT_MAP_CENTER = {
  lat: 10.6952,
  lng: 122.5547,
};

// Default map zoom
export const DEFAULT_MAP_ZOOM = 13;

// Geolocation timeout
export const GEOLOCATION_TIMEOUT = 5000; // 5 seconds

// API timeout
export const API_TIMEOUT = 10000; // 10 seconds
