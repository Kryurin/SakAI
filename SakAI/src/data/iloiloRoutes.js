/**
 * Iloilo City Jeepney Routes Data
 * Each route contains coordinates for stops in depart and return paths
 */

export const iloiloRoutes = [
  {
    code: "01",
    name: "Mandurriao to City Proper",
    depart: [
      { name: "Mandurriao Plaza", lat: 10.7173, lng: 122.5370 },
      { name: "Mandurriao Terminal", lat: 10.7150, lng: 122.5380 },
      { name: "West Avenue", lat: 10.7090, lng: 122.5420 },
      { name: "JM Square", lat: 10.7020, lng: 122.5500 },
      { name: "Robinson's Mall", lat: 10.6950, lng: 122.5550 },
      { name: "Iloilo Business Park", lat: 10.6850, lng: 122.5630 },
      { name: "City Proper Terminal", lat: 10.6800, lng: 122.5700 },
    ],
    return: [
      { name: "City Proper Terminal", lat: 10.6800, lng: 122.5700 },
      { name: "Iloilo Business Park", lat: 10.6850, lng: 122.5630 },
      { name: "Robinson's Mall", lat: 10.6950, lng: 122.5550 },
      { name: "JM Square", lat: 10.7020, lng: 122.5500 },
      { name: "West Avenue", lat: 10.7090, lng: 122.5420 },
      { name: "Mandurriao Terminal", lat: 10.7150, lng: 122.5380 },
      { name: "Mandurriao Plaza", lat: 10.7173, lng: 122.5370 },
    ],
  },
  {
    code: "02",
    name: "Molo to Pavia",
    depart: [
      { name: "Molo Church", lat: 10.7100, lng: 122.5220 },
      { name: "Molo Market", lat: 10.7080, lng: 122.5260 },
      { name: "Molo Terminal", lat: 10.7050, lng: 122.5300 },
      { name: "Gen. Luna Street", lat: 10.6950, lng: 122.5400 },
      { name: "Plaza Libertad", lat: 10.6850, lng: 122.5450 },
      { name: "Pavia Terminal", lat: 10.6700, lng: 122.5550 },
    ],
    return: [
      { name: "Pavia Terminal", lat: 10.6700, lng: 122.5550 },
      { name: "Plaza Libertad", lat: 10.6850, lng: 122.5450 },
      { name: "Gen. Luna Street", lat: 10.6950, lng: 122.5400 },
      { name: "Molo Terminal", lat: 10.7050, lng: 122.5300 },
      { name: "Molo Market", lat: 10.7080, lng: 122.5260 },
      { name: "Molo Church", lat: 10.7100, lng: 122.5220 },
    ],
  },
  {
    code: "03",
    name: "Jaro to Sarao",
    depart: [
      { name: "Jaro Cathedral", lat: 10.7250, lng: 122.5150 },
      { name: "Jaro Terminal", lat: 10.7200, lng: 122.5200 },
      { name: "Delgado Street", lat: 10.7100, lng: 122.5300 },
      { name: "Capitol", lat: 10.6950, lng: 122.5450 },
      { name: "Sarao Bridge", lat: 10.6800, lng: 122.5550 },
      { name: "Sarao Terminal", lat: 10.6700, lng: 122.5600 },
    ],
    return: [
      { name: "Sarao Terminal", lat: 10.6700, lng: 122.5600 },
      { name: "Sarao Bridge", lat: 10.6800, lng: 122.5550 },
      { name: "Capitol", lat: 10.6950, lng: 122.5450 },
      { name: "Delgado Street", lat: 10.7100, lng: 122.5300 },
      { name: "Jaro Terminal", lat: 10.7200, lng: 122.5200 },
      { name: "Jaro Cathedral", lat: 10.7250, lng: 122.5150 },
    ],
  },
  {
    code: "04",
    name: "Lapaz to Santa Barbara",
    depart: [
      { name: "Lapaz Market", lat: 10.7350, lng: 122.5050 },
      { name: "Lapaz Terminal", lat: 10.7300, lng: 122.5100 },
      { name: "Bonifacio Drive", lat: 10.7150, lng: 122.5250 },
      { name: "Quezon Avenue", lat: 10.7000, lng: 122.5350 },
      { name: "Santa Barbara", lat: 10.6800, lng: 122.5450 },
    ],
    return: [
      { name: "Santa Barbara", lat: 10.6800, lng: 122.5450 },
      { name: "Quezon Avenue", lat: 10.7000, lng: 122.5350 },
      { name: "Bonifacio Drive", lat: 10.7150, lng: 122.5250 },
      { name: "Lapaz Terminal", lat: 10.7300, lng: 122.5100 },
      { name: "Lapaz Market", lat: 10.7350, lng: 122.5050 },
    ],
  },
  {
    code: "05",
    name: "Arevalo to Oton",
    depart: [
      { name: "Arevalo Terminal", lat: 10.7450, lng: 122.4900 },
      { name: "Arevalo Church", lat: 10.7400, lng: 122.4950 },
      { name: "Arevalo Market", lat: 10.7300, lng: 122.5050 },
      { name: "Tiolas Bridge", lat: 10.7100, lng: 122.5200 },
      { name: "Oton Terminal", lat: 10.6900, lng: 122.5350 },
    ],
    return: [
      { name: "Oton Terminal", lat: 10.6900, lng: 122.5350 },
      { name: "Tiolas Bridge", lat: 10.7100, lng: 122.5200 },
      { name: "Arevalo Market", lat: 10.7300, lng: 122.5050 },
      { name: "Arevalo Church", lat: 10.7400, lng: 122.4950 },
      { name: "Arevalo Terminal", lat: 10.7450, lng: 122.4900 },
    ],
  },
];

/**
 * Get all stops from all routes
 * @returns {array} All stops with route info
 */
export function getAllStops() {
  const allStops = [];
  iloiloRoutes.forEach((route) => {
    const departStops = route.depart.map((stop) => ({
      ...stop,
      routeCode: route.code,
      routeName: route.name,
      direction: "depart",
    }));
    const returnStops = route.return.map((stop) => ({
      ...stop,
      routeCode: route.code,
      routeName: route.name,
      direction: "return",
    }));
    allStops.push(...departStops, ...returnStops);
  });
  return allStops;
}

/**
 * Get route by code
 * @param {string} code - Route code
 * @returns {object|null} Route object or null
 */
export function getRouteByCode(code) {
  return iloiloRoutes.find((route) => route.code === code) || null;
}

/**
 * Get routes that contain specific stop
 * @param {string} stopName - Stop name to search
 * @returns {array} Routes containing this stop
 */
export function getRoutesByStop(stopName) {
  return iloiloRoutes.filter((route) => {
    const hasStop =
      route.depart.some((stop) =>
        stop.name.toLowerCase().includes(stopName.toLowerCase())
      ) ||
      route.return.some((stop) =>
        stop.name.toLowerCase().includes(stopName.toLowerCase())
      );
    return hasStop;
  });
}
