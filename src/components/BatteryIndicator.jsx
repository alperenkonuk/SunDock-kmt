import { useEffect, useState } from 'react';
import { BatteryCharging } from 'lucide-react';

const getBatteryColor = (level) => {
  if (level >= 60) return 'high';
  if (level >= 25) return 'medium';
  return 'low';
};

const getBatteryTextColor = (level) => {
  if (level >= 60) return 'var(--green-400)';
  if (level >= 25) return 'var(--yellow-400)';
  return 'var(--red-400)';
};

const BatteryIndicator = ({ level, showLabel = true }) => {
  const [animatedWidth, setAnimatedWidth] = useState(0);
  const colorClass = getBatteryColor(level);

  useEffect(() => {
    // Animate on mount
    const timer = setTimeout(() => setAnimatedWidth(level), 100);
    return () => clearTimeout(timer);
  }, [level]);

  return (
    <div className="battery-section">
      {showLabel && (
        <div className="battery-header">
          <span className="battery-label">
            <BatteryCharging size={14} />
            Batarya Seviyesi
          </span>
          <span
            className="battery-percentage"
            style={{ color: getBatteryTextColor(level) }}
          >
            %{level}
          </span>
        </div>
      )}
      <div className="battery-bar">
        <div
          className={`battery-fill ${colorClass}`}
          style={{ width: `${animatedWidth}%` }}
        />
      </div>
    </div>
  );
};

export { getBatteryColor, getBatteryTextColor };
export default BatteryIndicator;
