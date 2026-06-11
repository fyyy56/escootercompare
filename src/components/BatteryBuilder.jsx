import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Cylinder } from '@react-three/drei';

// Базовые характеристики популярных ячеек (размеры в см)
const CELL_SPECS = {
  '18650': { radius: 0.9, height: 6.5, capacityAh: 3.2, weightKg: 0.048, color: '#ff4d4d' },
  '21700': { radius: 1.05, height: 7.0, capacityAh: 5.0, weightKg: 0.070, color: '#5b8cff' }
};

export default function BatteryBuilder() {
  const [cellType, setCellType] = useState('21700');
  const [series, setSeries] = useState(13); // S - вольтаж
  const [parallel, setParallel] = useState(4); // P - емкость
  const [layoutMode, setLayoutMode] = useState('honeycomb-x'); // 'grid', 'honeycomb-x', 'honeycomb-z'
  const [spacerType, setSpacerType] = useState('holder'); // 'holder', 'mini', 'none'

  const specs = CELL_SPECS[cellType];
  
  // Определяем физический зазор между банками на основе реальных данных (в см)
  const gap = useMemo(() => {
    if (spacerType === 'holder') return 0.2; // 2мм (стандартные сотовые пластиковые холдеры)
    if (spacerType === 'mini') return 0.05;  // 0.5мм (электрокартон, скотч, тонкий текстолит)
    return 0;                                // 0мм (клейка вплотную, только термоусадка)
  }, [spacerType]);

  // Генерируем массив координат и высчитываем физические габариты
  const { cells, dimensions } = useMemo(() => {
    const arr = [];
    const D = specs.radius * 2 + gap; // Физическое расстояние между центрами
    const H = D * 0.866025; // Сжатие рядов для сот ( D * sqrt(3)/2 )

    let minX = Infinity, maxX = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    for (let s = 0; s < series; s++) {
      for (let p = 0; p < parallel; p++) {
        let x = 0;
        let z = 0;

        if (layoutMode === 'grid') {
          // Квадратная сетка
          x = p * D;
          z = s * D;
        } else if (layoutMode === 'honeycomb-x') {
          // Соты в длину (сдвиг четных рядов)
          x = p * D + (s % 2 !== 0 ? D / 2 : 0);
          z = s * H;
        } else if (layoutMode === 'honeycomb-z') {
          // Соты в ширину (сдвиг четных столбцов)
          x = p * H;
          z = s * D + (p % 2 !== 0 ? D / 2 : 0);
        }

        arr.push({ id: `${s}-${p}`, position: [x, 0, z] });

        // Ищем крайние точки для вычисления размеров
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (z < minZ) minZ = z;
        if (z > maxZ) maxZ = z;
      }
    }

    // Центрируем сборку в 3D сцене
    const xOffset = (minX + maxX) / 2;
    const zOffset = (minZ + maxZ) / 2;
    const centeredArr = arr.map(c => ({
      ...c,
      position: [c.position[0] - xOffset, 0, c.position[2] - zOffset]
    }));

    // Считаем габариты от краев крайних цилиндров (переводим см в мм)
    const lengthX = (maxX - minX + specs.radius * 2) * 10;
    const widthZ = (maxZ - minZ + specs.radius * 2) * 10;
    const heightY = specs.height * 10;

    return {
      cells: centeredArr,
      dimensions: {
        l: Math.round(lengthX),
        w: Math.round(widthZ),
        h: Math.round(heightY)
      }
    };
  }, [series, parallel, specs, layoutMode, gap]);

  // Инженерные расчеты
  const voltage = (series * 3.7).toFixed(1);
  const capacity = (parallel * specs.capacityAh).toFixed(1);
  const wattHours = (voltage * capacity).toFixed(0);
  const totalWeight = (series * parallel * specs.weightKg).toFixed(1);
  const totalCells = series * parallel;

  return (
    <div className="layout" style={{ marginTop: '2rem', display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* Левая колонка: Настройки сборки */}
      <div style={{ flex: 1, padding: '25px', backgroundColor: '#1b202e', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '20px' }}>Конфигуратор АКБ</h2>
        
        {/* Выбор типа ячеек */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#8b95a5', fontSize: '14px' }}>ТИП ЯЧЕЕК:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => setCellType('18650')}
              style={{ flex: 1, padding: '10px', backgroundColor: cellType === '18650' ? '#ff4d4d' : '#2a3143', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
            >
              18650
            </button>
            <button 
              onClick={() => setCellType('21700')}
              style={{ flex: 1, padding: '10px', backgroundColor: cellType === '21700' ? '#5b8cff' : '#2a3143', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}
            >
              21700
            </button>
          </div>
        </div>

        {/* Выбор типа укладки */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', color: '#8b95a5', fontSize: '14px' }}>ПАТТЕРН УКЛАДКИ:</label>
          <select 
            value={layoutMode} 
            onChange={(e) => setLayoutMode(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', backgroundColor: '#2a3143', color: '#fff', border: '1px solid #3b4255', cursor: 'pointer', outline: 'none' }}
          >
            <option value="grid">Квадратная сетка (Grid)</option>
            <option value="honeycomb-x">Соты в длину (Смещение рядов)</option>
            <option value="honeycomb-z">Соты в ширину (Смещение столбцов)</option>
          </select>
        </div>

        {/* НОВЫЙ БЛОК: Выбор холдеров / зазора */}
        <div style={{ marginBottom: '25px', backgroundColor: '#2a3143', padding: '15px', borderRadius: '10px' }}>
          <label style={{ display: 'block', marginBottom: '12px', color: '#8b95a5', fontSize: '14px', fontWeight: 'bold' }}>СПОСОБ ФИКСАЦИИ:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="radio" name="spacer" value="holder" checked={spacerType === 'holder'} onChange={(e) => setSpacerType(e.target.value)} style={{ cursor: 'pointer' }} />
              <span>Пластиковые холдеры (~2 мм)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="radio" name="spacer" value="mini" checked={spacerType === 'mini'} onChange={(e) => setSpacerType(e.target.value)} style={{ cursor: 'pointer' }} />
              <span>Текстолит / картон (~0.5 мм)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="radio" name="spacer" value="none" checked={spacerType === 'none'} onChange={(e) => setSpacerType(e.target.value)} style={{ cursor: 'pointer' }} />
              <span>Вплотную (Без перегородок)</span>
            </label>
          </div>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Последовательно (S):</span> <strong>{series}S</strong>
          </label>
          <input type="range" min="10" max="20" value={series} onChange={(e) => setSeries(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Параллельно (P):</span> <strong>{parallel}P</strong>
          </label>
          <input type="range" min="2" max="15" value={parallel} onChange={(e) => setParallel(Number(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
        </div>

        {/* Сводка характеристик и габаритов */}
        <div style={{ marginTop: '30px', backgroundColor: '#2a3143', padding: '15px', borderRadius: '10px' }}>
          <h4 style={{ margin: '0 0 15px 0', borderBottom: '1px solid #3b4255', paddingBottom: '10px' }}>⚡ Характеристики</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Схема:</span> <strong>{series}S {parallel}P</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Напряжение:</span> <strong>{voltage} V</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Емкость:</span> <strong>{capacity} Ah</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Энергоемкость:</span> <strong style={{ color: '#a8ffb2' }}>{wattHours} Wh</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Вес (чистый):</span> <strong>~{totalWeight} кг</strong></div>
          
          <h4 style={{ margin: '15px 0', borderBottom: '1px solid #3b4255', paddingBottom: '10px' }}>📏 Габариты блока</h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Длина (X):</span> <strong>{dimensions.l} мм</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}><span>Ширина (Z):</span> <strong>{dimensions.w} мм</strong></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Высота (Y):</span> <strong>{dimensions.h} мм</strong></div>
        </div>
      </div>

      {/* Правая колонка: 3D Сцена */}
      <div style={{ flex: 1.5, height: '860px', backgroundColor: '#11141c', borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '15px', left: '15px', zIndex: 10, color: '#fff', opacity: 0.7, fontSize: '14px', pointerEvents: 'none' }}>
          Крути мышкой • Колесиком масштаб
        </div>
        <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={1.5} />
          <directionalLight position={[-10, -20, -10]} intensity={0.3} />
          
          <OrbitControls makeDefault />
          
          <group position={[0, -specs.height / 2, 0]}>
            {cells.map((cell) => (
              <Cylinder 
                key={cell.id} 
                args={[specs.radius, specs.radius, specs.height, 16]} 
                position={cell.position}
              >
                <meshStandardMaterial color={specs.color} metalness={0.6} roughness={0.3} />
              </Cylinder>
            ))}
          </group>
        </Canvas>
      </div>

    </div>
  );
}