import { useEffect, useRef, useState } from 'react';
import { SCOOTERS } from '../data/scooters';

function RangeFilter({ label, minKey, maxKey, filters, onChange }) {
  return (
    <div className="vfilter-group">
      <span className="filter-lbl">{label}</span>
      <div className="range-wrap">
        <input
          className="range-input"
          type="number"
          placeholder="от"
          value={filters[minKey]}
          onChange={(e) => onChange(minKey, e.target.value)}
        />
        <span className="range-sep">—</span>
        <input
          className="range-input"
          type="number"
          placeholder="до"
          value={filters[maxKey]}
          onChange={(e) => onChange(maxKey, e.target.value)}
        />
      </div>
    </div>
  );
}

function AdvancedFilter({ id, title, children, openId, onToggle }) {
  const isOpen = openId === id;

  return (
    <div className="vfilter-group">
      <div
        className={`adv-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => onToggle(isOpen ? null : id)}
      >
        {title} <span className="arrow">▾</span>
      </div>
      <div className={`adv-popup ${isOpen ? 'open' : ''}`}>{children}</div>
    </div>
  );
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  onReset,
  resultCount,
}) {
  const [openAdv, setOpenAdv] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('.vfilter-group')) {
        setOpenAdv(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const setField = (key, value) => onFilterChange({ ...filters, [key]: value });

  return (
    <aside className="sidebar" ref={sidebarRef}>
      <div className="sidebar-card">
        <div className="sidebar-title">Фильтры</div>
        <div className="sidebar-sub">Подбери самокаты по параметрам</div>

        <RangeFilter
          label="Мощность (W)"
          minKey="powerMin"
          maxKey="powerMax"
          filters={filters}
          onChange={setField}
        />
        <RangeFilter
          label="Скорость (км/ч)"
          minKey="speedMin"
          maxKey="speedMax"
          filters={filters}
          onChange={setField}
        />
        <RangeFilter
          label="Вес (кг)"
          minKey="weightMin"
          maxKey="weightMax"
          filters={filters}
          onChange={setField}
        />
        <RangeFilter
          label="Пробег (км)"
          minKey="rangeMin"
          maxKey="rangeMax"
          filters={filters}
          onChange={setField}
        />

        <AdvancedFilter
          id="volt"
          title="Напряжение АКБ"
          openId={openAdv}
          onToggle={setOpenAdv}
        >
          <div className="adv-row">
            <span className="filter-lbl">от</span>
            <input
              className="range-input"
              type="number"
              placeholder="36"
              value={filters.voltMin}
              onChange={(e) => setField('voltMin', e.target.value)}
            />
          </div>
          <div className="adv-row">
            <span className="filter-lbl">до</span>
            <input
              className="range-input"
              type="number"
              placeholder="72"
              value={filters.voltMax}
              onChange={(e) => setField('voltMax', e.target.value)}
            />
          </div>
        </AdvancedFilter>

        <AdvancedFilter
          id="cap"
          title="Ёмкость, Wh"
          openId={openAdv}
          onToggle={setOpenAdv}
        >
          <div className="adv-row">
            <span className="filter-lbl">от</span>
            <input
              className="range-input"
              type="number"
              placeholder="200"
              value={filters.capMin}
              onChange={(e) => setField('capMin', e.target.value)}
            />
          </div>
          <div className="adv-row">
            <span className="filter-lbl">до</span>
            <input
              className="range-input"
              type="number"
              placeholder="2200"
              value={filters.capMax}
              onChange={(e) => setField('capMax', e.target.value)}
            />
          </div>
        </AdvancedFilter>

        <AdvancedFilter
          id="repair"
          title="Ремонтопригодность"
          openId={openAdv}
          onToggle={setOpenAdv}
        >
          <div className="adv-row">
            <span className="filter-lbl">мин. уровень</span>
            <input
              className="range-input"
              type="number"
              placeholder="1–5"
              min={1}
              max={5}
              value={filters.repairMin}
              onChange={(e) => setField('repairMin', e.target.value)}
            />
          </div>
        </AdvancedFilter>

        <button
          className="btn-reset-filter"
          style={{ width: '100%', marginTop: 6 }}
          onClick={onReset}
        >
          ✕ Сбросить фильтры
        </button>
        <div
          className="filter-results"
          style={{ marginTop: 10, textAlign: 'center' }}
        >
          Найдено: {resultCount} из {SCOOTERS.length}
        </div>
      </div>
    </aside>
  );
}