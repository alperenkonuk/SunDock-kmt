import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import BenchPage from "./pages/BenchPage.jsx";

function App() {
  const [benches, setBenches] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBenches = async () => {
    try {
      const res = await fetch("/api/benches");
      if (!res.ok) throw new Error("Veri yüklenemedi");
      const data = await res.json();
      setBenches(data);
    } catch (err) {
      console.error("Hata:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBenches();

    // Auto-poll simulated backend updates every 5 seconds
    const interval = setInterval(fetchBenches, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter basename="/sundock">
      <Header benches={benches} />
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              benches={benches}
              loading={loading}
              onRefresh={fetchBenches}
            />
          }
        />
        <Route
          path="/bank/:id"
          element={<BenchPage onRefresh={fetchBenches} />}
        />
      </Routes>
      <footer className="footer">
        <p>
          © 2026 SunDock Akıllı Bank Sistemi —{" "}
          <a
            href="https://www.iuc.edu.tr"
            target="_blank"
            rel="noopener noreferrer"
          >
            İstanbul Üniversitesi-Cerrahpaşa
          </a>
        </p>
        <p style={{ marginTop: "4px" }}>
          Avcılar Kampüsü • Akıllı Kampüs Projesi
        </p>
      </footer>
    </BrowserRouter>
  );
}

export default App;
