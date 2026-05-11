import { Loader } from '@googlemaps/js-api-loader';

let mapsLoaded = false;
let geocoder = null;
let places = null;

/**
 * Initialize Google Maps
 * @returns {Promise<boolean>} Success status
 */
export async function initializeMaps() {
  if (mapsLoaded) return true;
  
  try {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'geometry'],
    });
    
    await loader.load();
    mapsLoaded = true;
    geocoder = new google.maps.Geocoder();
    places = new google.maps.places.PlacesService(document.createElement('div'));
    
    return true;
  } catch (error) {
    console.error('Failed to initialize Google Maps:', error);
    return false;
  }
}

/**
 * Create Google Map instance
 * @param {string|HTMLElement} container - Map container element
 * @param {object} options - Map options
 * @returns {google.maps.Map} Map instance
 */
export function createMap(container, options) {
  if (!mapsLoaded) {
    console.error('Google Maps not initialized');
    return null;
  }
  
  const defaultOptions = {
    zoom: 13,
    center: { lat: 10.6952, lng: 122.5547 }, // Iloilo City
    mapTypeId: 'roadmap',
  };
  
  return new google.maps.Map(container, { ...defaultOptions, ...options });
}

/**
 * Add marker to map
 * @param {google.maps.Map} map - Map instance
 * @param {object} position - {lat, lng}
 * @param {object} options - Marker options
 * @returns {google.maps.Marker} Marker instance
 */
export function addMarker(map, position, options = {}) {
  const defaultOptions = {
    position,
    map,
    title: options.title || '',
  };
  
  const marker = new google.maps.Marker({ ...defaultOptions, ...options });
  
  if (options.infoContent) {
    const infoWindow = new google.maps.InfoWindow({
      content: options.infoContent,
    });
    
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });
  }
  
  return marker;
}

/**
 * Draw polyline on map
 * @param {google.maps.Map} map - Map instance
 * @param {array} path - Array of {lat, lng} points
 * @param {object} options - Polyline options
 * @returns {google.maps.Polyline} Polyline instance
 */
export function drawPolyline(map, path, options = {}) {
  const defaultOptions = {
    path,
    map,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 0.7,
    strokeWeight: 2,
  };
  
  return new google.maps.Polyline({ ...defaultOptions, ...options });
}

/**
 * Geocode address to coordinates
 * @param {string} address - Address to geocode
 * @returns {Promise<object>} {lat, lng} or null if failed
 */
export async function geocodeAddress(address) {
  if (!geocoder) {
    console.error('Geocoder not initialized');
    return null;
  }
  
  try {
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode({ address }, (results, status) => {
        if (status === 'OK') {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
          });
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });
    
    return result;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Reverse geocode coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Address or empty string if failed
 */
export async function reverseGeocode(lat, lng) {
  if (!geocoder) {
    console.error('Geocoder not initialized');
    return '';
  }
  
  try {
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      });
    });
    
    return result;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return '';
  }
}

/**
 * Get distance between two points using Google Maps API
 * @param {object} origin - {lat, lng}
 * @param {object} destination - {lat, lng}
 * @returns {Promise<number>} Distance in meters
 */
export async function getDistance(origin, destination) {
  const service = new google.maps.DistanceMatrixService();
  
  try {
    const result = await new Promise((resolve, reject) => {
      service.getDistanceMatrix(
        {
          origins: [{ lat: origin.lat, lng: origin.lng }],
          destinations: [{ lat: destination.lat, lng: destination.lng }],
          travelMode: 'DRIVING',
        },
        (response, status) => {
          if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
            resolve(response.rows[0].elements[0].distance.value);
          } else {
            reject(new Error(`Distance calculation failed: ${status}`));
          }
        }
      );
    });
    
    return result;
  } catch (error) {
    console.error('Distance calculation error:', error);
    return 0;
  }
}

/**
 * Calculate approximate travel time based on distance
 * @param {number} distanceKm - Distance in kilometers
 * @returns {number} Estimated time in minutes (using 2-3 km/min average)
 */
export function estimateTravelTime(distanceKm) {
  // Assuming average jeepney speed of 20-30 km/h in Iloilo
  const avgSpeedKmPerMin = 25 / 60; // 25 km/h average
  return Math.ceil(distanceKm / avgSpeedKmPerMin);
}

/**
 * Fit map to bounds
 * @param {google.maps.Map} map - Map instance
 * @param {array} points - Array of {lat, lng} points
 */
export function fitMapToBounds(map, points) {
  if (points.length === 0) return;
  
  const bounds = new google.maps.LatLngBounds();
  points.forEach((point) => {
    bounds.extend(new google.maps.LatLng(point.lat, point.lng));
  });
  
  map.fitBounds(bounds);
}

/**
 * Center map on coordinates
 * @param {google.maps.Map} map - Map instance
 * @param {object} center - {lat, lng}
 */
export function centerMap(map, center) {
  map.setCenter(new google.maps.LatLng(center.lat, center.lng));
}

/**
 * Clear all markers from map
 * @param {array} markers - Array of marker instances to remove
 */
export function clearMarkers(markers) {
  markers.forEach((marker) => {
    marker.setMap(null);
  });
}

/**
 * Clear all polylines from map
 * @param {array} polylines - Array of polyline instances to remove
 */
export function clearPolylines(polylines) {
  polylines.forEach((polyline) => {
    polyline.setMap(null);
  });
}
