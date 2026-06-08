import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom marker icons based on status
const createIcon = (color) => {
  const colors = {
    active: '#22c55e',
    maintenance: '#eab308',
    offline: '#ef4444',
  };

  const fillColor = colors[color] || colors.active;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 26px;
        height: 26px;
        border-radius: 50% 50% 50% 0;
        background: ${fillColor};
        transform: rotate(-45deg);
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        border: 2px solid #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        will-change: transform;
      ">
        <div style="
          transform: rotate(45deg);
          font-size: 10px;
          font-weight: 800;
          color: white;
        ">⚡</div>
      </div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
    popupAnchor: [0, -26],
  });
};

// Blue pulsing dot for user location
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 16px;
      height: 16px;
      background: #4285F4;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(66, 133, 244, 0.6), 0 2px 6px rgba(0,0,0,0.3);
    "></div>
    <div style="
      width: 40px;
      height: 40px;
      background: rgba(66, 133, 244, 0.15);
      border: 1px solid rgba(66, 133, 244, 0.3);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: user-pulse 2s ease-in-out infinite;
    "></div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Component to show user's live location
const UserLocation = () => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.log('Konum alınamadı:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [map]);

  if (!position) return null;

  return (
    <Marker position={position} icon={userLocationIcon}>
      <Popup>
        <div className="popup-content">
          <span className="popup-name" style={{ color: '#4285F4' }}>📍 Konumunuz</span>
        </div>
      </Popup>
    </Marker>
  );
};

const getBatteryFillColor = (level) => {
  if (level >= 60) return '#22c55e';
  if (level >= 25) return '#eab308';
  return '#ef4444';
};

const CampusMap = ({ benches, center = [40.9870, 28.7275], zoom = 16, height }) => {
  return (
    <div className="map-wrapper">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={height ? { height } : undefined}
      >
        <TileLayer
          attribution='&copy; Google Maps'
          url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          maxZoom={21}
        />
        <UserLocation />
        {benches.map((bench) => (
          <Marker
            key={bench.id}
            position={[bench.lat, bench.lng]}
            icon={createIcon(bench.status)}
          >
            <Popup>
              <div className="popup-content">
                <div className="popup-header">
                  <span className="popup-name">{bench.name}</span>
                </div>
                <div className="popup-battery">
                  <div className="popup-battery-bar">
                    <div
                      className="popup-battery-fill"
                      style={{
                        width: `${bench.batteryLevel}%`,
                        background: getBatteryFillColor(bench.batteryLevel),
                      }}
                    />
                  </div>
                  <span
                    className="popup-battery-text"
                    style={{ color: getBatteryFillColor(bench.batteryLevel) }}
                  >
                    %{bench.batteryLevel}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${bench.lat},${bench.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="popup-link"
                >
                  Yol Tarifi Al →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CampusMap;

