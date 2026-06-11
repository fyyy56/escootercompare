import { BRANDS } from '../data/brands';
import { SCOOTERS } from '../data/scooters';
import { modelCountLabel } from '../utils/repair';

function BrandLogo({ brand }) {
  const info = BRANDS[brand.key];

  if (!info?.logo) {
    return (
      <div className="brand-logo-box text">
        {info?.name.slice(0, 2).toUpperCase() ?? brand.key.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return (
    <div className="brand-logo-box">
      <img
        src={info.logo}
        alt={info.name}
        onError={(e) => {
          const parent = e.currentTarget.parentElement;
          parent.className = 'brand-logo-box text';
          parent.innerHTML = info.name.slice(0, 2).toUpperCase();
        }}
      />
    </div>
  );
}

export default function BrandBar({ activeBrand, onBrandChange }) {
  const counts = SCOOTERS.reduce((acc, s) => {
    acc[s.brand] = (acc[s.brand] || 0) + 1;
    return acc;
  }, {});

  const brands = [
    { key: 'all', name: 'Все бренды', count: SCOOTERS.length },
    ...Object.keys(BRANDS).map((key) => ({
      key,
      name: BRANDS[key].name,
      count: counts[key] || 0,
    })),
  ];

  return (
    <div className="brand-bar">
      <div className="brand-bar-title">Бренд</div>
      <div className="brand-chips">
        {brands.map((brand) => (
          <div
            key={brand.key}
            className={`brand-chip ${activeBrand === brand.key ? 'active' : ''}`}
            onClick={() => onBrandChange(brand.key)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onBrandChange(brand.key)}
          >
            {brand.key === 'all' ? (
              <div className="brand-logo-box text">ALL</div>
            ) : (
              <BrandLogo brand={brand} />
            )}
            <div className="brand-meta">
              <span className="brand-name">{brand.name}</span>
              <span className="brand-count">{modelCountLabel(brand.count)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
