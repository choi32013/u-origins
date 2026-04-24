'use client';

import { useState, useEffect, useMemo } from 'react';
import GlobeMap from './GlobeMap';
import Timeline from './Timeline';
import EventModal from './EventModal';

export default function MainPrototype({ dataset, datasets = [], activeId, setActiveId, compact = false }) {
  const [year, setYear] = useState(dataset.range[0] + Math.floor((dataset.range[1] - dataset.range[0]) * 0.6));
  const [playing, setPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(8);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [layers, setLayers] = useState({ territory: true, capital: false, religion: false });
  const [geoReady, setGeoReady] = useState(false);
  const [activeEras, setActiveEras] = useState(() => new Set(dataset.eras.map(e => e.id)));
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    setGeoReady(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setYear(dataset.range[0] + Math.floor((dataset.range[1] - dataset.range[0]) * 0.6));
    setPlaying(false);
    setSelectedEvent(null);
    setActiveEras(new Set(dataset.eras.map(e => e.id)));
  }, [dataset.id]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelectedEvent(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isMobile = windowWidth < 640;

  const filteredData = useMemo(() => ({
    ...dataset,
    events: dataset.events.filter(ev => activeEras.has(ev.era)),
  }), [dataset, activeEras]);

  const toggleEra = (eraId) => {
    setActiveEras(prev => {
      const next = new Set(prev);
      if (next.has(eraId)) { next.delete(eraId); } else { next.add(eraId); }
      return next;
    });
  };

  const hPad = isMobile ? '10px 14px' : compact ? '12px 20px' : '18px 28px';

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
        padding: hPad,
        borderBottom: '1px solid #eae5d8',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center',
        gap: isMobile ? 8 : 20,
        background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6,
            background: 'linear-gradient(135deg, #c25b3f, #8b3a24)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 12, letterSpacing: -0.5,
            flexShrink: 0,
          }}>U</div>
          {!isMobile && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>U-Origins</div>
              <div style={{ fontSize: 10, color: '#8a8578', letterSpacing: 0.4 }}>
                {dataset.label.toUpperCase()} · 열린 역사 아카이브
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {datasets.length > 1 && (
          <div style={{ display: 'flex', gap: 3, background: '#f4f1e8', padding: 3, borderRadius: 6 }}>
            {datasets.map((ds) => (
              <button key={ds.id} onClick={() => setActiveId && setActiveId(ds.id)}
                style={{
                  padding: isMobile ? '4px 8px' : '5px 11px', borderRadius: 4, border: 'none',
                  background: ds.id === activeId ? '#fff' : 'transparent',
                  color: ds.id === activeId ? '#2a251f' : '#6b6a63',
                  fontSize: isMobile ? 11 : 12, fontWeight: ds.id === activeId ? 600 : 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: ds.id === activeId ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {ds.label}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 3, background: '#f4f1e8', padding: 3, borderRadius: 6 }}>
          {[{ id: 'territory', label: '영토' }, { id: 'religion', label: '종교' }, { id: 'capital', label: '수도' }].map(l => (
            <button key={l.id}
              onClick={() => setLayers({ ...layers, [l.id]: !layers[l.id] })}
              style={{
                padding: isMobile ? '4px 7px' : '5px 11px', borderRadius: 4, border: 'none',
                background: layers[l.id] ? '#fff' : 'transparent',
                color: layers[l.id] ? '#2a251f' : '#b8b2a0',
                fontSize: isMobile ? 11 : 12, fontWeight: layers[l.id] ? 600 : 500,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: layers[l.id] ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </header>

      {/* Era 필터 바 */}
      <div style={{
        display: 'flex', gap: 4, padding: isMobile ? '6px 14px' : '8px 28px',
        background: '#fff', borderBottom: '1px solid #eae5d8',
        overflowX: 'auto', flexShrink: 0,
      }}>
        <span style={{ fontSize: 10, color: '#b8b2a0', fontWeight: 600, letterSpacing: 0.5, alignSelf: 'center', flexShrink: 0, marginRight: 2 }}>
          ERA
        </span>
        {dataset.eras.map(era => {
          const active = activeEras.has(era.id);
          return (
            <button key={era.id} onClick={() => toggleEra(era.id)} style={{
              padding: '3px 10px', borderRadius: 10, border: 'none',
              cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
              background: active ? era.color : '#f0ede4',
              color: active ? '#2a251f' : '#b8b2a0',
              fontSize: 11, fontWeight: active ? 600 : 400,
              opacity: active ? 1 : 0.7,
              transition: 'all 0.15s',
            }}>
              {era.label}
            </button>
          );
        })}
        <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <button onClick={() => setActiveEras(new Set(dataset.eras.map(e => e.id)))} style={{
            padding: '3px 8px', borderRadius: 6, border: '1px solid #e6e1d3',
            background: 'transparent', color: '#8a8578', cursor: 'pointer',
            fontSize: 10, fontFamily: 'inherit',
          }}>전체</button>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <GlobeMap
          year={year}
          data={filteredData}
          geoReady={geoReady}
          layers={layers}
          onEventPin={(ev) => setSelectedEvent(ev)}
        />
      </div>

      <Timeline
        year={year} setYear={setYear}
        data={filteredData}
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
