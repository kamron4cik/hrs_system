import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../../utils/googleMapsLoader';

const HotelListingMap = ({ hotels }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    loadGoogleMaps()
      .then(() => setMapLoaded(true))
      .catch((err) => console.error("Google Maps failed to load", err));
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !hotels?.length) return;

    // Uzbekistan center as fallback
    const defaultCenter = { lat: 41.311081, lng: 69.240562 };
    
    // Calculate center of all hotels
    const validHotels = hotels.filter(h => !isNaN(h.latitude) && !isNaN(h.longitude));
    if (validHotels.length === 0) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
      styles: [
        { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
        { "featureType": "transit", "stylers": [{ "visibility": "off" }] }
      ]
    });

    const bounds = new window.google.maps.LatLngBounds();
    const infoWindow = new window.google.maps.InfoWindow();

    validHotels.forEach(hotel => {
      const position = { lat: parseFloat(hotel.latitude), lng: parseFloat(hotel.longitude) };
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: hotel.name,
      });

      marker.addListener('click', () => {
        infoWindow.setContent(`
          <div style="padding: 10px; max-width: 200px;">
            <img src="${hotel.thumbnail}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" />
            <div style="font-weight: bold; font-size: 14px; color: #1e293b;">${hotel.name}</div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${hotel.city}</div>
            <a href="/hotels/${hotel.id}" style="display: block; text-align: center; background: #2563eb; color: white; padding: 6px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: bold;">View Details</a>
          </div>
        `);
        infoWindow.open(map, marker);
      });

      bounds.extend(position);
    });

    map.fitBounds(bounds);
    if (validHotels.length === 1) {
      map.setZoom(15);
    }

  }, [mapLoaded, hotels]);

  return (
    <div className="rounded-xl overflow-hidden border border-neutral dark:border-gray-800 shadow-lg" style={{ height: '400px' }}>
      {!mapLoaded && (
        <div className="h-full w-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
          <span className="text-gray-400">Loading map...</span>
        </div>
      )}
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default HotelListingMap;
