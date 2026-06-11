import ScooterCard from './ScooterCard';

export default function Catalog({ scooters, selectedIds, onToggleCompare }) {
  const compareFull = selectedIds.length >= 4;

  if (!scooters.length) {
    return (
      <div className="catalog">
        <div className="no-results">
          😕 Нет самокатов по заданным параметрам. Попробуй ослабить фильтры.
        </div>
      </div>
    );
  }

  return (
    <div className="catalog">
      {scooters.map((scooter) => (
        <ScooterCard
          key={scooter.id}
          scooter={scooter}
          selected={selectedIds.includes(scooter.id)}
          onToggleCompare={onToggleCompare}
          compareFull={compareFull}
        />
      ))}
    </div>
  );
}
