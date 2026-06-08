import { Link, useLocation } from "react-router-dom";
import { Zap, MapPin, List } from "lucide-react";
import benches from "../data/benches.json";

const Header = () => {
  const location = useLocation();
  const activeBenches = benches.filter((b) => b.status === "active").length;
  const avgBattery = Math.round(
    benches.reduce((sum, b) => sum + b.batteryLevel, 0) / benches.length,
  );

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-brand">
          <div className="header-logo">
            <Zap size={22} />
          </div>
          <div>
            <div className="header-title">SunDock</div>
            <div className="header-subtitle">İÜC Avcılar Kampüsü</div>
          </div>
        </Link>

        <div className="header-stats">
          <div className="header-stat">
            <span
              className="header-stat-value"
              style={{ color: "var(--green-400)" }}
            >
              {activeBenches}
            </span>
            <span className="header-stat-label">Aktif Bank</span>
          </div>
          <div className="header-stat">
            <span
              className="header-stat-value"
              style={{ color: "var(--blue-400)" }}
            >
              %{avgBattery}
            </span>
            <span className="header-stat-label">Ort. Şarj</span>
          </div>
          <div className="header-stat">
            <span
              className="header-stat-value"
              style={{ color: "var(--purple-400)" }}
            >
              {benches.length}
            </span>
            <span className="header-stat-label">Toplam Bank</span>
          </div>
        </div>

        <nav className="header-nav">
          <Link
            to="/"
            className={`header-nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            <MapPin size={16} />
            Harita
          </Link>
          <a href="#bench-list" className="header-nav-link">
            <List size={16} />
            Liste
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
