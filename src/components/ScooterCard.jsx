import { useState } from 'react';
import { BRANDS } from '../data/brands';
import { tierClass } from '../utils/repair';
import RepairStars from './RepairStars';

function BrandBadge({ brandKey }) {
  const brand = BRANDS[brandKey];
  if (!brand) return null;

  if (!brand.logo) {
    return (
      <div className="photo-brand">
        <span>{brand.name}</span>
      </div>
    );
  }

  return (
    <div className="photo-brand">
      <img
        src={brand.logo}
        alt={brand.name}
        onError={(e) => {
          e.currentTarget.parentElement.innerHTML = `<span>${brand.name}</span>`;
        }}
      />
    </div>
  );
}

export default function ScooterCard({ scooter, selected, onToggleCompare, compareFull }) {
  const [zoomed, setZoomed] = useState(false);
  const placeholder = `https://placehold.co/300x150/1b202e/5b8cff?text=${encodeURIComponent(scooter.name)}`;

  return (
    <div className={`card ${selected ? 'selected' : ''} ${zoomed ? 'zoomed' : ''}`}>
      <div
        className="card-photo"
        style={{ cursor: 'pointer' }}
        onClick={() => setZoomed((z) => !z)}
      >
        <img
          src={scooter.photo || placeholder}
          alt={scooter.name}
          onError={(e) => {
            e.currentTarget.src = placeholder;
          }}
        />
        <BrandBadge brandKey={scooter.brand} />
        <span className={`photo-tier ${tierClass(scooter.tier)}`}>
          {scooter.tierLabel}
        </span>
      </div>

      <div className="card-hd">
        <div className="card-series">{scooter.series}</div>
        <div className="card-name">{scooter.name}</div>
      </div>

      <div className="key-specs">
        <div className="ks">
          <div className="ks-lbl">Мощность</div>
          <div className="ks-val">
            {scooter.power}
            <span className="ks-u"> ном</span>
          </div>
        </div>
        <div className="ks">
          <div className="ks-lbl">Скорость</div>
          <div className="ks-val">
            {scooter.speed}
            <span className="ks-u"> км/ч</span>
          </div>
        </div>
        <div className="ks">
          <div className="ks-lbl">Пробег</div>
          <div className="ks-val">
            {scooter.range}
            <span className="ks-u"> км</span>
          </div>
        </div>
        <div className="ks">
          <div className="ks-lbl">Вес</div>
          <div className="ks-val">
            {scooter.weight}
            <span className="ks-u"> кг</span>
          </div>
        </div>
      </div>

      <div className="extra">
        <div className="er">
          <span className="er-l">Колёса</span>
          <span className="er-v">{scooter.wheels}</span>
        </div>
        <div className="er">
          <span className="er-l">Батарея</span>
          <span className="er-v">{scooter.battery}</span>
        </div>
        <div className="er">
          <span className="er-l">Напряжение</span>
          <span className="er-v">{scooter.batteryV}</span>
        </div>
        <div className="er">
          <span className="er-l">Элементы</span>
          <span className="er-v">{scooter.cells}</span>
        </div>
        <div className="er">
          <span className="er-l">Подвеска</span>
          <span className="er-v" style={{ fontSize: 10 }}>
            {scooter.suspension}
          </span>
        </div>
        <div className="er">
          <span className="er-l">Защита</span>
          <span className="er-v">{scooter.waterproof}</span>
        </div>
        <div className="er">
          <span className="er-l">Нагрузка</span>
          <span className="er-v">{scooter.load}</span>
        </div>
        <div className="er">
          <span className="er-l">Зарядка</span>
          <span className="er-v">{scooter.charge}</span>
        </div>
      </div>

      <div className="repair">
        <span className="repair-lbl">Ремонтопригодность</span>
        <RepairStars value={scooter.repair} text={scooter.repairTxt} />
      </div>

      <div className="price-row">
        <span className="price-lbl">Цена</span>
        <span className="price-val">{scooter.price}</span>
      </div>

      <div className="cons">
        <div className="cons-hd">Минусы из отзывов</div>
        <ul className="cons-list">
          {scooter.cons.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <button
        className={`add-btn ${selected ? 'added' : ''}`}
        onClick={() => onToggleCompare(scooter.id)}
        disabled={!selected && compareFull}
      >
        {selected ? '✓ В сравнении' : '+ Добавить в сравнение'}
      </button>
    </div>
  );
}
