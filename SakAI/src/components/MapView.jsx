import React, { useEffect, useRef } from 'react';
import {
  createMap,
  addMarker,
  fitMapToBounds,
  centerMap,
  initializeMaps,
} from '../services/mapsService.js';
import '../style.css';

export default function MapView({ origin, destination, route, markers = [] }) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    const setupMap = async () => {
      const initialized = await initializeMaps();
      if (!initialized || !mapContainer.current) return;

      if (!mapInstance.current) {
        mapInstance.current = createMap(mapContainer.current);
      }

      const points = [];

      // Add origin marker
      if (origin) {
        addMarker(mapInstance.current, origin, {
          title: 'Origin',
          infoContent: '<div><strong>Origin</strong></div>',
        });
        points.push(origin);
      }

      // Add destination marker
      if (destination) {
        addMarker(mapInstance.current, destination, {
          title: 'Destination',
          infoContent: '<div><strong>Destination</strong></div>',
        });
        points.push(destination);
      }

      // Add route stops
      if (route) {
        if (route.type === 'direct') {
          // Add board and alight points for direct route
          if (route.route.boardAt) {
            addMarker(mapInstance.current, {
              lat: route.route.boardLat,
              lng: route.route.boardLng,
            });
          }
          if (route.route.alightAt) {
            addMarker(mapInstance.current, {
              lat: route.route.alightLat,
              lng: route.route.alightLng,
            });
          }
        }
      }

      // Add custom markers
      markers.forEach((marker) => {
        addMarker(mapInstance.current, marker.position, {
          title: marker.title,
        });
        points.push(marker.position);
      });

      // Fit map to all points
      if (points.length > 0) {
        fitMapToBounds(mapInstance.current, points);
      } else {
        // Default to Iloilo City center
        centerMap(mapInstance.current, { lat: 10.6952, lng: 122.5547 });
      }
    };

    setupMap();
  }, [origin, destination, route, markers]);

  return (
    <div className="map-container">
      <div ref={mapContainer} className="map" style={{ height: '400px' }} />
    </div>
  );
}
