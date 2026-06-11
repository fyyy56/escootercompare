import { useEffect } from 'react';
import { BRANDS } from '../data/brands';

const COMPARE_ROWS = [
  { label: 'Бренд', type: 'text', fn: (s) => BRANDS[s.brand]?.name || s.brand },
  { label: 'Серия', type: 'text', fn: (s) => s.series },
  { label: 'Цена', type: 'text', fn: (s) => s.price },
  { label: 'Мощность ном.', type: 'num', fn: (s) => s.powerVal, unit: 'W', higherIsBetter: true },
  {
    label: 'Мощность пик',
    type: 'num',
    fn: (s) => parseInt(s.powerPeak, 10) || s.powerVal * 2,
    unit: 'W',
    higherIsBetter: true,
  },
  { label: 'Макс. скорость', type: 'num', fn: (s) => s.speedVal, unit: ' км/ч', higherIsBetter: true },
  { label: 'Пробег', type: 'num', fn: (s) => s.rangeVal, unit: ' км', higherIsBetter: true },
  { label: 'Вес', type: 'num', fn: (s) => s.weightVal, unit: ' кг', higherIsBetter: false },
  { label: 'Колёса', type: 'text', fn: (s) => s.wheels },
  { label: 'Подвеска', type: 'text', fn: (s) => s.suspension },
  { label: 'Батарея', type: 'text', fn: (s) => s.battery },
  { label: 'Напряжение АКБ', type: 'text', fn: (s) => s.batteryV },
  { label: 'Тип элементов', type: 'text', fn: (s) => s.cells },
  { label: 'Защита', type: 'text', fn: (s) => s.waterproof },
  { label: 'Нагрузка', type: 'text', fn: (s) => s.load },
  { label: 'Зарядка', type: 'text', fn: (s) => s.charge },
  { label: 'Ремонтопригодность', type: 'text', fn: (s) => s.repairTxt },
];

function cellClass(val, best, worst, count, higherIsBetter) {
  if (val === best) return 'best';
  if (count > 2 && val === worst) return 'worst';
  return '';
}

export default function CompareModal({ open, items, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="overlay open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-hd">
          <h3>⚖ Сравнение характеристик</h3>
          <button className="btn-close" onClick={onClose}>
            ✕ Закрыть
          </button>
        </div>
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>Параметр</th>
                {items.map((s) => (
                  <th key={s.id}>{s.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => {
                if (row.type === 'text') {
                  return (
                    <tr key={row.label}>
                      <td>{row.label}</td>
                      {items.map((s) => (
                        <td key={s.id}>{row.fn(s)}</td>
                      ))}
                    </tr>
                  );
                }

                const vals = items.map((s) => row.fn(s));
                const best = row.higherIsBetter ? Math.max(...vals) : Math.min(...vals);
                const worst = row.higherIsBetter ? Math.min(...vals) : Math.max(...vals);

                return (
                  <tr key={row.label}>
                    <td>{row.label}</td>
                    {items.map((s, i) => (
                      <td
                        key={s.id}
                        className={cellClass(vals[i], best, worst, items.length, row.higherIsBetter)}
                      >
                        {vals[i]}
                        {row.unit || ''}
                      </td>
                    ))}
                  </tr>
                );
              })}
              <tr>
                <td>Минусы</td>
                {items.map((s) => (
                  <td
                    key={s.id}
                    className="cons-cell"
                    dangerouslySetInnerHTML={{
                      __html: s.cons.map((c) => `· ${c}`).join('<br>'),
                    }}
                  />
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
