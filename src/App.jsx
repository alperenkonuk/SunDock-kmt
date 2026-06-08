import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import HomePage from "./pages/HomePage.jsx";
import BenchPage from "./pages/BenchPage.jsx";

function App() {
  return (
    <BrowserRouter basename="/sundock">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/bank/:id" element={<BenchPage />} />
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
