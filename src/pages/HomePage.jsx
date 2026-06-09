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
import CampusMap from '../components/CampusMap.jsx';
import BenchCard from '../components/BenchCard.jsx';

const HomePage = ({ benches = [], loading, onRefresh }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [userCoords, setUserCoords] = useState(null);

  // Simulator state
  const [selectedBenchId, setSelectedBenchId] = useState('');
  const [simBattery, setSimBattery] = useState(70);
  const [simStatus, setSimStatus] = useState('active');
  const [isSending, setIsSending] = useState(false);

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

  // Set initial simulator selection when benches load
  useEffect(() => {
    if (benches.length > 0 && !selectedBenchId) {
      setSelectedBenchId(benches[0].id.toString());
      setSimBattery(benches[0].batteryLevel);
      setSimStatus(benches[0].status);
    }
  }, [benches, selectedBenchId]);

  const handleSelectSimBench = (idStr) => {
    setSelectedBenchId(idStr);
    const selected = benches.find(b => b.id === parseInt(idStr));
    if (selected) {
      setSimBattery(selected.batteryLevel);
      setSimStatus(selected.status);
    }
  };

  const handleSendTelemetry = async (e) => {
    e.preventDefault();
    if (!selectedBenchId) return;
    
    setIsSending(true);
    try {
      const response = await fetch('/api/telemetry/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': 'sundock-secret-key',
        },
        body: JSON.stringify({
          id: parseInt(selectedBenchId),
          batteryLevel: simBattery,
          status: simStatus,
        }),
      });

      if (response.ok) {
        onRefresh();
      } else {
        console.error('Telemetri gönderilemedi');
      }
    } catch (err) {
      console.error('İletişim hatası:', err);
    } finally {
      setIsSending(false);
    }
  };

  if (loading) {
    return (
      <main className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '16px' }}>
        <div className="spinner" style={{ width: '50px', height: '50px', border: '5px solid var(--border-glass)', borderTopColor: 'var(--blue-400)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Veriler yükleniyor...</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    );
  }

  const activeBenches = benches.filter((b) => b.status === 'active');
  const maintenanceBenches = benches.filter((b) => b.status === 'maintenance');
  const offlineBenches = benches.filter((b) => b.status === 'offline');
  const avgBattery = benches.length
    ? Math.round(benches.reduce((sum, b) => sum + b.batteryLevel, 0) / benches.length)
    : 0;

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

      {/* Telemetry Simulator */}
      <section className="map-section" style={{ paddingBottom: 'var(--spacing-xl)' }}>
        <div className="map-container">
          <div className="section-header">
            <h2 className="section-title" style={{ color: 'var(--blue-400)' }}>
              <Zap size={20} />
              Telemetri Simülatörü (Cihaz Güncelleme)
            </h2>
          </div>
          <div style={{
            background: 'var(--bg-card)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <form onSubmit={handleSendTelemetry} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Bank / Cihaz Seçin</label>
                <select 
                  value={selectedBenchId} 
                  onChange={(e) => handleSelectSimBench(e.target.value)}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-primary)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '10px 14px',
                    fontSize: '14px',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  {benches.map(b => (
                    <option key={b.id} value={b.id}>{b.name} (ID: {b.id})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Şarj Seviyesi</span>
                  <strong style={{ color: 'var(--blue-400)' }}>%{simBattery}</strong>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={simBattery}
                  onChange={(e) => setSimBattery(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    accentColor: 'var(--blue-400)'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>Durum</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['active', 'maintenance', 'offline'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSimStatus(st)}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        border: '1px solid var(--border-glass)',
                        background: simStatus === st 
                          ? (st === 'active' ? 'var(--green-glow)' : st === 'maintenance' ? 'rgba(234, 179, 8, 0.15)' : 'rgba(239, 68, 68, 0.15)')
                          : 'var(--bg-secondary)',
                        color: simStatus === st
                          ? (st === 'active' ? 'var(--green-400)' : st === 'maintenance' ? 'var(--yellow-400)' : 'var(--red-400)')
                          : 'var(--text-muted)',
                        borderColor: simStatus === st
                          ? (st === 'active' ? 'var(--green-500)' : st === 'maintenance' ? 'var(--yellow-400)' : 'var(--red-400)')
                          : 'transparent',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {st === 'active' ? 'Aktif' : st === 'maintenance' ? 'Bakımda' : 'Arızalı'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSending}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, var(--green-600), var(--green-500))',
                    color: 'white',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '600',
                    fontSize: '14px',
                    boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                    transition: 'all var(--transition-fast)',
                    opacity: isSending ? 0.7 : 1
                  }}
                >
                  {isSending ? 'Gönderiliyor...' : 'Telemetri Raporu Gönder'}
                </button>
              </div>
            </form>
          </div>
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
