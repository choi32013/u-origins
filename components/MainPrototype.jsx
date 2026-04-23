'use client';

import { useState, useEffect } from 'react';
import GlobeMap from './GlobeMap';
import Timeline from './Timeline';
import EventModal from './EventModal';

export default function MainPrototype({ dataset, compact = false }) {
  const [year, setYear] = useState(dataset.range[0] + Math.floor((dataset.range[1] - dataset.range[0]) * 0.6));
  const [playing, setPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(8);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [layers, setLayers] = useState({ territory: true, capital: false, religion: false });
  // geoReady: true once coastline geo-data is available in the browser
  const [geoReady, setGeoReady] = useState(false);

  useEffect(() => {
    // Signal ready immediately; coastline data loaded from static imports in Next.js
    setGeoReady(true);
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedEvent(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      background: '#fdfcf8',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      color: '#1a1815',
      overflow: 'hidden',
    }}>
      <header style={{
        padding: compact ? '12px 20px' : '18px 28px',
        borderBottom: '1px solid #eae5d8',
        display: 'flex', alignItems: 'center', gap: 20,
        background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: 'linear-gradient(135deg, #c25b3f, #8b3a24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 13, letterSpacing: -0.5,
          }}>U</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>U-Origins</div>
            <div style={{ fontSize: 10, color: '#8a8578', letterSpacing: 0.4 }}>
              {dataset.label.toUpperCase()} · 열린 역사 아카이브
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', gap: 4, background: '#f4f1e8', padding: 3, borderRadius: 6 }}>
          {['한국사', '동아시아', '세계사'].map((label, i) => (
            <button key={label} disabled={i !== 0}
              style={{
                padding: '5px 11px', borderRadius: 4, border: 'none',
                background: i === 0 ? '#fff' : 'transparent',
                color: i === 0 ? '#2a251f' : '#b8b2a0',
                fontSize: 12, fontWeight: i === 0 ? 600 : 500,
                cursor: i === 0 ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit',
                boxShadow: i === 0 ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {label}{i !== 0 && ' 곧'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 4, background: '#f4f1e8', padding: 3, borderRadius: 6 }}>
          {[{ id: 'territory', label: '영토' }, { id: 'religion', label: '종교' }, { id: 'capital', label: '수도' }].map(l => (
            <button key={l.id}
              onClick={() => setLayers({ ...layers, [l.id]: !layers[l.id] })}
              style={{
                padding: '5px 11px', borderRadius: 4, border: 'none',
                background: layers[l.id] ? '#fff' : 'transparent',
                color: layers[l.id] ? '#2a251f' : '#b8b2a0',
                fontSize: 12, fontWeight: layers[l.id] ? 600 : 500,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: layers[l.id] ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <GlobeMap
          year={year}
          data={dataset}
          geoReady={geoReady}
          layers={layers}
          onEventPin={(ev) => setSelectedEvent(ev)}
        />
      </div>

      <Timeline
        year={year} setYear={setYear}
        data={dataset}
        geoReady={geoReady}
        onEventClick={(ev) => setSelectedEvent(ev)}
        playing={playing} setPlaying={setPlaying}
        playSpeed={playSpeed}
      />

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          data={dataset}
          geoReady={geoReady}
          onClose={() => setSelectedEvent(null)}
          onSelectEvent={(ev) => setSelectedEvent(ev)}
        />
      )}
    </div>
  );
}
