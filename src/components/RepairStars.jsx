import { repairColor } from '../utils/repair';

export default function RepairStars({ value, text }) {
  const color = repairColor(value);

  return (
    <div className="stars">
      {Array.from({ length: 5 }, (_, i) => (
        <div
          key={i}
          className="star"
          style={{ background: i < value ? color : 'var(--border)' }}
        />
      ))}
      <span className="repair-txt" style={{ color }}>{text}</span>
    </div>
  );
}
