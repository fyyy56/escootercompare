import { useState, useMemo } from 'react';
import { SCOOTERS } from '../data/scooters';

export default function RangeCalculator() {
  const [selectedScooterId, setSelectedScooterId] = useState(SCOOTERS[0].id);
  const [riderWeight, setRiderWeight] = useState(75);
  const [speed, setSpeed] = useState(25);
  const [temperature, setTemperature] = useState(20);

  const selectedScooter = useMemo(
    () => SCOOTERS.find((s) => s.id === selectedScooterId),
    [selectedScooterId]
  );

  // Инженерная математика честного пробега
  const honestRange = useMemo(() => {
    if (!selectedScooter || !selectedScooter.capVal) return 0;

    const capacityWh = selectedScooter.capVal;
    let consumptionWhPerKm = 12;

    const weightDiff = riderWeight - 75;
    consumptionWhPerKm *= (1 + (weightDiff / 10) * 0.08);

    const speedDiff = speed - 20;
    consumptionWhPerKm *= (1 + (speedDiff / 5) * 0.15);

    let tempEfficiency = 1; 
    if (temperature < 20) {
      tempEfficiency = 1 - ((20 - temperature) * 0.015);
    }

    const calculatedRange = (capacityWh * tempEfficiency) / consumptionWhPerKm;
    return Math.max(0, calculatedRange).toFixed(1);
  }, [selectedScooter, riderWeight, speed, temperature]);

  return (
    <div className="layout" style={{ marginTop: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* Левая колонка: Настройки */}
      <div style={{ flex: 1, padding: '25px', backgroundColor: '#1b202e', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '20px' }}>Параметры поездки</h2>
        
        {/* Выпадающий список */}
        <div style={{ marginBottom: '20px' }}>
          <select 
            value={selectedScooterId} 
            onChange={(e) => setSelectedScooterId(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#2a3143', color: '#fff', border: '1px solid #3b4255', cursor: 'pointer', outline: 'none' }}
          >
            {SCOOTERS.map(s => (
              <option key={s.id} value={s.id}>{s.brand.toUpperCase()} {s.name}</option>
            ))}
          </select>
        </div>

        {/* МИНИ-КАРТОЧКА САМОКАТА */}
        {selectedScooter && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            backgroundColor: '#2a3143',
            padding: '15px',
            borderRadius: '12px',
            marginBottom: '30px',
            border: '1px solid #3b4255'
          }}>
            <img
              src={selectedScooter.photo || `https://placehold.co/100x100/1b202e/5b8cff?text=${selectedScooter.name}`}
              alt={selectedScooter.name}
              style={{ width: '90px', height: '90px', objectFit: 'contain', backgroundColor: '#1b202e', borderRadius: '8px', padding: '5px' }}
              onError={(e) => { e.currentTarget.src = `https://placehold.co/100x100/1b202e/5b8cff?text=${selectedScooter.name}`; }}
            />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>{selectedScooter.name}</div>
              <div style={{ fontSize: '14px', opacity: 0.9, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔋 <span>Батарея: <strong>{selectedScooter.battery}</strong></span></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>⚡ <span>Макс. скорость: <strong>{selectedScooter.speed} км/ч</strong></span></span>
              </div>
            </div>
          </div>
        )}

        {/* Ползунки */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Твой вес:</span> <strong>{riderWeight} кг</strong>
          </label>
          <input type="range" min="40" max="150" value={riderWeight} onChange={(e) => setRiderWeight(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Средняя скорость:</span> <strong>{speed} км/ч</strong>
          </label>
          <input type="range" min="15" max="80" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Температура воздуха:</span> <strong>{temperature} °C</strong>
          </label>
          <input type="range" min="-10" max="40" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
        </div>
      </div>

      {/* Правая колонка: Результат и Аналитика */}
      <div style={{ flex: 1, padding: '40px 30px', backgroundColor: '#5b8cff', borderRadius: '12px', textAlign: 'center', color: '#fff', position: 'sticky', top: '20px' }}>
        <h3 style={{ margin: 0, opacity: 0.9 }}>Честный запас хода</h3>
        <div style={{ fontSize: '64px', fontWeight: 'bold', margin: '15px 0' }}>
          ~ {honestRange} <span style={{ fontSize: '28px' }}>км</span>
        </div>
        
        <div style={{ backgroundColor: 'rgba(0,0,0,0.15)', padding: '15px', borderRadius: '10px', display: 'inline-block', textAlign: 'left', width: '100%', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '15px', marginBottom: '5px', textAlign: 'center' }}>
            Заявлено производителем: <strong>{selectedScooter?.range} км</strong>
          </div>
          <div style={{ fontSize: '12px', opacity: 0.7, textAlign: 'center' }}>
            (Идеальные условия: вес 75 кг, скорость 15 км/ч, 25°C)
          </div>
        </div>

        {/* НОВЫЙ БЛОК: Детализация потерь */}
        <div style={{ marginTop: '30px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '12px', textAlign: 'left' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
            📊 Аналитика расхода энергии:
          </h4>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' }}>
            <span style={{ opacity: 0.9 }}>Влияние веса:</span>
            <span style={{ fontWeight: 'bold', color: riderWeight > 75 ? '#ffb3b3' : '#a8ffb2' }}>
              {riderWeight > 75 ? '-' : '+'}{Math.abs(Math.round(((riderWeight - 75) / 10) * 8))}%
            </span>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '15px' }}>
            <span style={{ opacity: 0.9 }}>Аэродинамика (скорость):</span>
            <span style={{ fontWeight: 'bold', color: speed > 20 ? '#ffb3b3' : '#a8ffb2' }}>
              {speed > 20 ? '-' : '+'}{Math.abs(Math.round(((speed - 20) / 5) * 15))}%
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
            <span style={{ opacity: 0.9 }}>Потеря емкости на холоде:</span>
            <span style={{ fontWeight: 'bold', color: temperature < 20 ? '#ffb3b3' : '#a8ffb2' }}>
              {temperature < 20 ? `-${Math.round((20 - temperature) * 1.5)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}