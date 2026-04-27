import React, { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet's default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function parseCoords(locationStr) {
  if (!locationStr) return null;
  const match = locationStr.match(/([\d.]+)°\s*N,?\s*([\d.]+)°\s*E/);
  if (match) {
    return [parseFloat(match[1]), parseFloat(match[2])];
  }
  return null;
}

export default function CollectorMapView({ userLocation, collectorCoords }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const userCoords = parseCoords(userLocation);

  useEffect(() => {
    if (!mapRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const center = userCoords || [12.9716, 77.5946];
    const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: false }).setView(center, 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // User pickup marker (red)
    if (userCoords) {
      const userIcon = L.divIcon({
        html: `<div style="width:36px;height:36px;background:#EF4444;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
                <div style="transform:rotate(45deg);display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:white;font-size:16px">📦</div>
               </div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
      });
      L.marker(userCoords, { icon: userIcon })
        .addTo(map)
        .bindPopup(`<b>📦 Pickup Location</b><br/>${userLocation}`)
        .openPopup();
    }

    // Collector current location marker (blue)
    if (collectorCoords) {
      const collectorIcon = L.divIcon({
        html: `<div style="width:40px;height:40px;background:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(59,130,246,0.5);display:flex;align-items:center;justify-content:center;font-size:18px">🚴</div>`,
        className: '',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      L.marker(collectorCoords, { icon: collectorIcon })
        .addTo(map)
        .bindPopup('<b>📍 Your Location</b>');

      // Draw dashed route line
      if (userCoords) {
        const routeLine = L.polyline([collectorCoords, userCoords], {
          color: '#3B82F6',
          weight: 3,
          dashArray: '8, 6',
          opacity: 0.8
        }).addTo(map);
        map.fitBounds(routeLine.getBounds(), { padding: [30, 30] });

        // Animate a pulsing dot along the route
        const pulseIcon = L.divIcon({
          html: `<div style="width:14px;height:14px;background:#3B82F6;border-radius:50%;border:2px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3);animation:pulse 1.5s infinite"></div>`,
          className: '',
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        });
        const midLat = (collectorCoords[0] + userCoords[0]) / 2;
        const midLng = (collectorCoords[1] + userCoords[1]) / 2;
        L.marker([midLat, midLng], { icon: pulseIcon }).addTo(map);
      }
    }

    mapInstanceRef.current = map;
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, collectorCoords]);

  if (!userCoords) {
    return (
      <div style={{
        background: '#F3F4F6', borderRadius: 12, height: 180,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#9CA3AF', fontSize: 14, flexDirection: 'column', gap: 8
      }}>
        <span style={{ fontSize: 24 }}>🗺️</span>
        <span>No location data available</span>
      </div>
    );
  }

  return (
    <div ref={mapRef} style={{
      height: 220, borderRadius: 12, overflow: 'hidden',
      border: '1px solid #E5E7EB', boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    }} />
  );
}
