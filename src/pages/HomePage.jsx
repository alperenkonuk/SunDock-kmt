import { useState, useEffect } from 'react';
import {
  Zap,
  MapPin,
  Activity,
  BatteryCharging,
  CheckCircle,
  AlertTriangle,
  XCircle,
  List,
} from 'lucide-react';
import benches from '../data/benches.json';
import CampusMap from '../components/CampusMap.jsx';
import BenchCard from '../components/BenchCard.jsx';

const HomePage = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.log('Konum izni alınamadı:', err.message),
      { enableHighAccuracy: true }
    );
  }, []);

  const activeBenches = benches.filter((b) => b.status === 'active');
  const maintenanceBenches = benches.filter((b) => b.status === 'maintenance');
  const offlineBenches = benches.filter((b) => b.status === 'offline');
  const avgBattery = Math.round(
    benches.reduce((sum, b) => sum + b.batteryLevel, 0) / benches.length
  );

  const filteredBenches =
    filter === 'all' ? benches : benches.filter((b) => b.status === filter);

  const sortedFilteredBenches = [...filteredBenches].sort((a, b) => {
    if (sortBy === 'battery-desc') {
      return b.batteryLevel - a.batteryLevel;
    }
    if (sortBy === 'battery-asc') {
      return a.batteryLevel - b.batteryLevel;
    }
    if (sortBy === 'proximity' && userCoords) {
      const distA = Math.hypot(a.lat - userCoords.lat, a.lng - userCoords.lng);
      const distB = Math.hypot(b.lat - userCoords.lat, b.lng - userCoords.lng);
      return distA - distB;
    }
    // Default: benches.json original sorted order (by location name)
    return 0; 
  });

  return (
    <main>
      {/* Hero */}
      <section className="hero">
        <h1>
          Sürdürülebilir Kampüsler için <br />
          <span>Güneş Enerjili Akıllı Bank Sistemi</span>
        </h1>
        <p>
          İstanbul Üniversitesi-Cerrahpaşa Avcılar Kampüsü'ndeki akıllı
          bankların anlık durumunu ve konumlarını görüntüleyin.
        </p>
      </section>

      {/* Stats Bar */}
      <section className="stats-bar">
        <div className="stat-card">
          <div className="stat-icon green">
            <CheckCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: 'var(--green-400)' }}>
              {activeBenches.length}
            </span>
            <span className="stat-label">Aktif Bank</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">
            <AlertTriangle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: 'var(--yellow-400)' }}>
              {maintenanceBenches.length}
            </span>
            <span className="stat-label">Bakımda</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <XCircle size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: 'var(--red-400)' }}>
              {offlineBenches.length}
            </span>
            <span className="stat-label">Arızalı</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <BatteryCharging size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{ color: 'var(--blue-400)' }}>
              %{avgBattery}
            </span>
            <span className="stat-label">Ort. Şarj</span>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="map-section">
        <div className="map-container">
          <div className="section-header">
            <h2 className="section-title">
              <MapPin size={20} />
              Kampüs Haritası
            </h2>
          </div>
          <CampusMap benches={benches} />
        </div>
      </section>

      {/* Bench List */}
      <section className="bench-section" id="bench-list">
        <div className="map-container">
          <div className="section-header" style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              <List size={20} />
              Tüm Banklar
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
              <div className="filter-bar" style={{ margin: 0 }}>
                <button
                  className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  Tümü ({benches.length})
                </button>
                <button
                  className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  Aktif ({activeBenches.length})
                </button>
                <button
                  className={`filter-btn ${filter === 'maintenance' ? 'active' : ''}`}
                  onClick={() => setFilter('maintenance')}
                >
                  Bakımda ({maintenanceBenches.length})
                </button>
                <button
                  className={`filter-btn ${filter === 'offline' ? 'active' : ''}`}
                  onClick={() => setFilter('offline')}
                >
                  Arızalı ({offlineBenches.length})
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-primary)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '8px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                <option value="default">Sıralama: Varsayılan (Konum)</option>
                <option value="battery-desc">Sıralama: En Yüksek Şarj</option>
                <option value="battery-asc">Sıralama: En Düşük Şarj</option>
                <option value="proximity" disabled={!userCoords}>
                  Sıralama: En Yakın {userCoords ? '✓' : '(Konum İzni Gerekli)'}
                </option>
              </select>
            </div>
          </div>
          <div className="bench-grid">
            {sortedFilteredBenches.map((bench) => (
              <BenchCard key={bench.id} bench={bench} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
