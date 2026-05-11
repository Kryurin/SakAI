import { iloiloRoutes } from '../data/iloiloRoutes.js';
import { haversine, findNearbyStops } from '../utils/haversine.js';
import { WALK_RADIUS_METERS } from '../utils/constants.js';

/**
 * Find routes matching origin and destination
 * @param {object} origin - {lat, lng}
 * @param {object} destination - {lat, lng}
 * @returns {object} Route match result
 */
export function findRoute(origin, destination) {
  const allStops = getAllStopsWithCoordinates();
  
  // Find nearby stops to origin
  const originStops = findNearbyStops(origin, allStops, WALK_RADIUS_METERS);
  
  // Find nearby stops to destination
  const destinationStops = findNearbyStops(destination, allStops, WALK_RADIUS_METERS);
  
  if (originStops.length === 0 || destinationStops.length === 0) {
    return {
      success: false,
      error: 'No jeepney stops found near origin or destination',
      originStopsFound: originStops.length > 0,
      destinationStopsFound: destinationStops.length > 0,
    };
  }
  
  // Check for direct route
  const directRoute = findDirectRoute(originStops, destinationStops);
  
  if (directRoute) {
    return {
      success: true,
      type: 'direct',
      route: directRoute,
      origin,
      destination,
    };
  }
  
  // Check for transfer route
  const transferRoute = findTransferRoute(originStops, destinationStops);
  
  if (transferRoute) {
    return {
      success: true,
      type: 'transfer',
      route: transferRoute,
      origin,
      destination,
    };
  }
  
  return {
    success: false,
    error: 'No route found between origin and destination',
  };
}

/**
 * Get all stops as array of coordinates
 * @returns {array} All stops with metadata
 */
function getAllStopsWithCoordinates() {
  const allStops = [];
  
  iloiloRoutes.forEach((route) => {
    route.depart.forEach((stop) => {
      allStops.push({
        ...stop,
        routeCode: route.code,
        routeName: route.name,
        direction: 'depart',
      });
    });
    route.return.forEach((stop) => {
      allStops.push({
        ...stop,
        routeCode: route.code,
        routeName: route.name,
        direction: 'return',
      });
    });
  });
  
  return allStops;
}

/**
 * Find if a single route covers both origin and destination
 * @param {array} originStops - Stops near origin
 * @param {array} destinationStops - Stops near destination
 * @returns {object|null} Direct route or null
 */
function findDirectRoute(originStops, destinationStops) {
  for (const originStop of originStops) {
    for (const destStop of destinationStops) {
      // Same route, same direction, origin comes before destination in sequence
      if (
        originStop.routeCode === destStop.routeCode &&
        originStop.direction === destStop.direction
      ) {
        const route = iloiloRoutes.find((r) => r.code === originStop.routeCode);
        const stops =
          originStop.direction === 'depart' ? route.depart : route.return;
        
        const originIndex = stops.findIndex((s) => s.name === originStop.name);
        const destIndex = stops.findIndex((s) => s.name === destStop.name);
        
        if (originIndex < destIndex) {
          return {
            routeCode: originStop.routeCode,
            routeName: originStop.routeName,
            boardAt: originStop.name,
            boardLat: originStop.lat,
            boardLng: originStop.lng,
            alightAt: destStop.name,
            alightLat: destStop.lat,
            alightLng: destStop.lng,
            distance: calculateRouteDistance(stops, originIndex, destIndex),
            stops: stops.slice(originIndex, destIndex + 1),
          };
        }
      }
    }
  }
  
  return null;
}

/**
 * Find transfer route between two routes
 * @param {array} originStops - Stops near origin
 * @param {array} destinationStops - Stops near destination
 * @returns {object|null} Transfer route or null
 */
function findTransferRoute(originStops, destinationStops) {
  const transfers = [];
  
  for (const originStop of originStops) {
    const firstRoute = iloiloRoutes.find((r) => r.code === originStop.routeCode);
    if (!firstRoute) continue;
    
    const firstStops =
      originStop.direction === 'depart' ? firstRoute.depart : firstRoute.return;
    const originIndex = firstStops.findIndex((s) => s.name === originStop.name);
    
    // Find common transfer points (any stop that could connect to second route)
    for (const destStop of destinationStops) {
      const secondRoute = iloiloRoutes.find((r) => r.code === destStop.routeCode);
      if (!secondRoute) continue;
      
      const secondStops =
        destStop.direction === 'depart' ? secondRoute.depart : secondRoute.return;
      const destIndex = secondStops.findIndex((s) => s.name === destStop.name);
      
      if (originStop.routeCode !== destStop.routeCode) {
        // Different routes - check for reasonable transfer point
        const firstLeg = {
          routeCode: originStop.routeCode,
          routeName: firstRoute.name,
          boardAt: originStop.name,
          boardLat: originStop.lat,
          boardLng: originStop.lng,
          alightAt: firstStops[firstStops.length - 1].name,
          alightLat: firstStops[firstStops.length - 1].lat,
          alightLng: firstStops[firstStops.length - 1].lng,
          distance: calculateRouteDistance(firstStops, originIndex, firstStops.length - 1),
          stops: firstStops.slice(originIndex),
        };
        
        const secondLeg = {
          routeCode: destStop.routeCode,
          routeName: secondRoute.name,
          boardAt: secondStops[0].name,
          boardLat: secondStops[0].lat,
          boardLng: secondStops[0].lng,
          alightAt: destStop.name,
          alightLat: destStop.lat,
          alightLng: destStop.lng,
          distance: calculateRouteDistance(secondStops, 0, destIndex),
          stops: secondStops.slice(0, destIndex + 1),
        };
        
        transfers.push({
          legs: [firstLeg, secondLeg],
          totalDistance: firstLeg.distance + secondLeg.distance,
        });
      }
    }
  }
  
  // Return the transfer with shortest distance
  if (transfers.length > 0) {
    return transfers.reduce((min, current) =>
      current.totalDistance < min.totalDistance ? current : min
    );
  }
  
  return null;
}

/**
 * Calculate distance between stops on a route
 * @param {array} stops - Array of stops
 * @param {number} startIndex - Start index
 * @param {number} endIndex - End index
 * @returns {number} Distance in kilometers
 */
function calculateRouteDistance(stops, startIndex, endIndex) {
  let totalDistance = 0;
  
  for (let i = startIndex; i < endIndex; i++) {
    const distance = haversine(
      stops[i].lat,
      stops[i].lng,
      stops[i + 1].lat,
      stops[i + 1].lng
    );
    totalDistance += distance;
  }
  
  return totalDistance / 1000; // Convert to km
}
