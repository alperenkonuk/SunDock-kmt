import { ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';
import BatteryIndicator from './BatteryIndicator.jsx';

const BenchCard = ({ bench }) => {
  return (
    <a
      href={`https://www.google.com/maps/dir/?api=1&destination=${bench.lat},${bench.lng}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`bench-card status-${bench.status}`}
      style={{ 
        textDecoration: 'none', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px',
        padding: '16px' 
      }}
    >
      <div className="bench-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div className="bench-card-name" style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-primary)' }}>
          {bench.name}
        </div>
        <StatusBadge status={bench.status} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
          Batarya: <strong style={{ color: 'var(--blue-400)' }}>%{bench.batteryLevel}</strong>
        </span>
        <span className="bench-detail-btn" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          Yol Tarifi <ChevronRight size={14} />
        </span>
      </div>

      <BatteryIndicator level={bench.batteryLevel} showLabel={false} />
    </a>
  );
};

export default BenchCard;
