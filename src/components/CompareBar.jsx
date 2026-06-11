export default function CompareBar({ count, onClear, onCompare }) {
  return (
    <div className={`compare-bar ${count > 0 ? 'show' : ''}`}>
      <span className="compare-bar-label">
        Выбрано: <b>{count}</b>
      </span>
      <button className="btn-ghost-cb" onClick={onClear}>
        Очистить
      </button>
      <button className="btn-cb" disabled={count < 2} onClick={onCompare}>
        Сравнить →
      </button>
    </div>
  );
}
