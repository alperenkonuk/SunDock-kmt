import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  BatteryCharging,
  Zap,
  Info,
} from 'lucide-react';
import benches from '../data/benches.json';
import StatusBadge from '../components/StatusBadge.jsx';
import CampusMap from '../components/CampusMap.jsx';
import { getBatteryTextColor } from '../components/BatteryIndicator.jsx';

const BenchPage = () => {
  const { id } = useParams();
  const bench = benches.find((b) => b.id === parseInt(id));
  const [circleOffset, setCircleOffset] = useState(440);

  useEffect(() => {
    if (bench) {
      // Animate circle on mount
      const timer = setTimeout(() => {
        const circumference = 2 * Math.PI * 70;
        const offset = circumference - (bench.batteryLevel / 100) * circumference;
        setCircleOffset(offset);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [bench]);

  if (!bench) {
    return (
      <div className="not-found">
        <h2>Bank Bulunamadı 😔</h2>
        <p>Aradığınız bank mevcut değil veya kaldırılmış olabilir.</p>
        <Link to="/">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  const circumference = 2 * Math.PI * 70;
  const batteryColor = getBatteryTextColor(bench.batteryLevel);

  return (
    <main className="bench-detail">
      <Link to="/" className="back-btn">
        <ArrowLeft size={16} />
        Tüm Banklara Dön
      </Link>

      <div className="detail-header">
        <div>
          <h1 className="detail-title">{bench.name}</h1>
        </div>
        <StatusBadge status={bench.status} />
      </div>

      <div className="detail-grid">
        {/* Battery Circle */}
        <div className="detail-card">
          <div className="detail-card-title">
            <BatteryCharging size={16} />
            Batarya Durumu
          </div>
          <div className="battery-circle-wrapper">
            <div className="battery-circle">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle
                  className="battery-circle-bg"
                  cx="80"
                  cy="80"
                  r="70"
                />
                <circle
                  className="battery-circle-fill"
                  cx="80"
                  cy="80"
                  r="70"
                  stroke={batteryColor}
                  strokeDasharray={circumference}
                  strokeDashoffset={circleOffset}
                />
              </svg>
              <div className="battery-circle-text">
                <div className="battery-circle-value" style={{ color: batteryColor }}>
                  %{bench.batteryLevel}
                </div>
                <div className="battery-circle-label">Şarj Seviyesi</div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="detail-card">
          <div className="detail-card-title">
            <Info size={16} />
            Bank Bilgileri
          </div>
          <div className="detail-features">
            <div className="detail-feature-row">
              <span className="detail-feature-label">
                <Zap size={18} />
                Durum
              </span>
              <StatusBadge status={bench.status} />
            </div>
            <div className="detail-feature-row">
              <span className="detail-feature-label">
                <MapPin size={18} />
                Koordinatlar
              </span>
              <span className="detail-feature-value" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {bench.lat.toFixed(4)}, {bench.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Map */}
      <div className="detail-map">
        <div className="detail-card">
          <div className="detail-card-title">
            <MapPin size={16} />
            Konum
          </div>
          <CampusMap
            benches={[bench]}
            center={[bench.lat, bench.lng]}
            zoom={17}
            height="300px"
          />
        </div>
      </div>
    </main>
  );
};

export default BenchPage;
