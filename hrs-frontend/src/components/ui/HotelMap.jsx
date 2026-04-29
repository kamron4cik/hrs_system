import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../../utils/googleMapsLoader';

const HotelMap = ({ hotel }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadGoogleMaps() // Insert API Key if available
      .then(() => setMapLoaded(true))
      .catch((err) => {
        console.error("Google Maps failed to load", err);
        setError("Map could not be loaded");
      });
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !hotel) return;

    const lat = parseFloat(hotel.latitude);
    const lng = parseFloat(hotel.longitude);
    const position = { lat: !isNaN(lat) ? lat : 41.2995, lng: !isNaN(lng) ? lng : 69.2401 };

    const map = new window.google.maps.Map(mapRef.current, {
      center: position,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { "featureType": "administrative", "elementType": "geometry", "stylers": [{ "visibility": "off" }] },
        { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
        { "featureType": "road", "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
        { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
      ]
    });

    const marker = new window.google.maps.Marker({
      position,
      map,
      title: hotel.name,
      animation: window.google.maps.Animation.DROP
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; color: #1e293b;">
          <div style="font-weight: bold; font-size: 14px;">${hotel.name}</div>
          <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${hotel.address}</div>
        </div>
      `
    });

    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

  }, [mapLoaded, hotel]);

  return (
    <div className="rounded-xl overflow-hidden border border-neutral dark:border-gray-800 shadow-md relative" style={{ height: '320px' }}>
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-red-500 text-sm">
          {error}
        </div>
      )}
      {!mapLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 animate-pulse">
          <span className="text-gray-400 text-sm">Loading Google Maps...</span>
        </div>
      )}
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default HotelMap;
