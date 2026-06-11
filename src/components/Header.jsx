import React from 'react';

export default function Header({ searchQuery, onSearchChange }) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      backgroundColor: '#1b202e',
      borderBottom: '1px solid #2a3143'
    }}>
      
      {/* ЛОГОТИП С ИКОНКОЙ САМОКАТА */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        {/* Стильная подложка под иконку */}
        <div style={{
          backgroundColor: '#5b8cff',
          padding: '10px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(91, 140, 255, 0.3)'
        }}>
          {/* Кастомный минималистичный силуэт электросамоката через SVG */}
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="5" cy="18" r="2.5" />
            <circle cx="19" cy="18" r="2.5" />
            <path d="M19 15V5.5H14" />
            <path d="M5 15.5h14" />
            <path d="M14 5.5h4" />
          </svg>
        </div>

        {/* Текстовая часть названия */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            fontSize: '22px',
            fontWeight: '900',
            letterSpacing: '1.5px',
            color: '#fff',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Scooter<span style={{ color: '#5b8cff' }}>Compare</span>
          </span>
          <span style={{ 
            fontSize: '11px', 
            color: '#8b95a5', 
            fontWeight: '600', 
            textTransform: 'uppercase', 
            letterSpacing: '0.5px',
            marginTop: '2px' 
          }}>
            Инженерный портал
          </span>
        </div>
      </div>

      {/* ПОИСКОВАЯ СТРОКА */}
      <div style={{ position: 'relative', width: '320px' }}>
        <input
          type="text"
          placeholder="Поиск самоката..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px 12px 42px',
            borderRadius: '10px',
            backgroundColor: '#2a3143',
            border: '1px solid #3b4255',
            color: '#fff',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease',
            boxSizing: 'border-box'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#5b8cff';
            e.target.style.boxShadow = '0 0 12px rgba(91, 140, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#3b4255';
            e.target.style.boxShadow = 'none';
          }}
        />
        <span style={{ 
          position: 'absolute', 
          left: '15px', 
          top: '50%', 
          transform: 'translateY(-50%)', 
          opacity: 0.6, 
          fontSize: '15px' 
        }}>
          🔍
        </span>
      </div>

    </header>
  );
}