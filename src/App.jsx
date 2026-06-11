import { useMemo, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { SCOOTERS } from './data/scooters';
import { filterScooters, EMPTY_FILTERS } from './utils/filters';
import Header from './components/Header';
import BrandBar from './components/BrandBar';
import Catalog from './components/Catalog';
import FilterSidebar from './components/FilterSidebar';
import CompareBar from './components/CompareBar';
import CompareModal from './components/CompareModal';
import Footer from './components/Footer';
import RangeCalculator from './components/RangeCalculator';
import BatteryBuilder from './components/BatteryBuilder';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBrand, setActiveBrand] = useState('all');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const filteredScooters = useMemo(
    () =>
      filterScooters(SCOOTERS, {
        activeBrand,
        searchQuery,
        filters,
      }),
    [activeBrand, searchQuery, filters],
  );

  const compareItems = useMemo(
    () => selectedIds.map((id) => SCOOTERS.find((s) => s.id === id)).filter(Boolean),
    [selectedIds],
  );

  function toggleCompare(id) {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setActiveBrand('all');
    setSearchQuery('');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* СТИЛИ ДЛЯ АНИМАЦИИ МЕНЮ */}
      <style>{`
        .nav-container {
          display: flex;
          gap: 20px;
          padding: 25px 40px;
          background-color: #1b202e;
          border-bottom: 1px solid #2a3143;
        }
        .nav-card {
          flex: 1;
          background-color: #2a3143;
          border: 1px solid #3b4255;
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          text-decoration: none;
          color: #fff;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        .nav-card:hover {
          transform: translateY(-6px);
          background-color: #323a4f;
          border-color: #5b8cff;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        .nav-icon {
          font-size: 36px;
          margin-bottom: 5px;
        }
        .nav-title {
          font-size: 18px;
          font-weight: bold;
          color: #fff;
        }
        .nav-desc {
          font-size: 13px;
          color: #8b95a5;
        }
      `}</style>

      {/* НОВАЯ КРАСИВАЯ НАВИГАЦИЯ */}
      <nav className="nav-container">
        <Link to="/" className="nav-card">
          <span className="nav-icon">🛴</span>
          <span className="nav-title">Каталог моделей</span>
          <span className="nav-desc">Сравнение 50+ электросамокатов</span>
        </Link>

        <Link to="/calculator" className="nav-card">
          <span className="nav-icon">🧮</span>
          <span className="nav-title">Калькулятор пробега</span>
          <span className="nav-desc">Инженерный расчет запаса хода</span>
        </Link>

        <Link to="/battery-builder" className="nav-card">
          <span className="nav-icon">🔋</span>
          <span className="nav-title">3D-Конфигуратор</span>
          <span className="nav-desc">Сборка кастомных аккумуляторов</span>
        </Link>
      </nav>

      {/* ОБЕРТКА ДЛЯ КОНТЕНТА */}
      <div style={{ flex: 1 }}>
        <Routes>
          {/* ГЛАВНАЯ СТРАНИЦА */}
          <Route path="/" element={
            <>
              <BrandBar activeBrand={activeBrand} onBrandChange={setActiveBrand} />
              <main>
                <div className="layout">
                  <Catalog
                    scooters={filteredScooters}
                    selectedIds={selectedIds}
                    onToggleCompare={toggleCompare}
                  />
                  <FilterSidebar
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={resetFilters}
                    resultCount={filteredScooters.length}
                  />
                </div>
              </main>
            </>
          } />

          {/* СТРАНИЦА КАЛЬКУЛЯТОРА */}
          <Route path="/calculator" element={<RangeCalculator />} />

          {/* СТРАНИЦА КОНФИГУРАТОРА */}
          <Route path="/battery-builder" element={<BatteryBuilder />} /> 
        </Routes>
      </div>

      <CompareBar
        count={selectedIds.length}
        onClear={() => setSelectedIds([])}
        onCompare={() => setModalOpen(true)}
      />

      <CompareModal
        open={modalOpen}
        items={compareItems}
        onClose={() => setModalOpen(false)}
      />

      <Footer />
    </div>
  );
}