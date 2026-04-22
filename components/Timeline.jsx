'use client';

import { useRef, useEffect } from 'react';

export default function Timeline({ year, setYear, data, onEventClick, playing, setPlaying, playSpeed }) {
  const trackRef = useRef(null);
  const [min, max] = data.range;
  const pct = (year - min) / (max - min);

  const yearFromX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect();
    const p = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return Math.round(min + p * (max - min));
  };

  const onMouseDown = (e) => {
    setPlaying(false);
    setYear(yearFromX(e.clientX));
    const onMove = (ev) => setYear(yearFromX(ev.clientX));
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setYear((y) => {
        const step = Math.max(1, Math.round((max - min) / 400));
        const next = y + step;
        if (next >= max) { setPlaying(false); return max; }
        return next;
      });
    }, 1000 / playSpeed);
    return () => clearInterval(id);
  }, [playing, playSpeed, min, max, setYear, setPlaying]);

  const formatYear = (y) => y < 0 ? `BCE ${-y}` : `${y}`;

  const ticks = [];
  const tickStep = 500;
  const firstTick = Math.ceil(min / tickStep) * tickStep;
  for (let y = firstTick; y <= max; y += tickStep) ticks.push(y);

  return (
    <div style={{
      background: '#fafaf7',
      borderTop: '1px solid #eae5d8',
      padding: '16px 24px 20px',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
        <button
          onClick={() => setPlaying(!playing)}
          style={{
            width: 36, height: 36, borderRadius: 18,
            border: '1px solid #d9d4c6',
            background: playing ? '#2a251f' : '#fff',
            color: playing ? '#fff' : '#2a251f',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
        >
          {playing ? (
            <svg width="10" height="12" viewBox="0 0 10 12"><rect x="0" y="0" width="3" height="12" fill="currentColor"/><rect x="7" y="0" width="3" height="12" fill="currentColor"/></svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 1 L11 6 L2 11 Z" fill="currentColor"/></svg>
          )}
        </button>
        <div style={{ fontSize: 28, fontWeight: 600, color: '#2a251f', letterSpacing: -0.5, minWidth: 110, fontVariantNumeric: 'tabular-nums' }}>
          {formatYear(year)}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ fontSize: 13, color: '#6b6a63' }}>
          {(() => {
            const era = data.eras.find(e => year >= e.start && year < e.end);
            return era ? era.label : '—';
          })()}
        </div>
      </div>

      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        style={{ position: 'relative', height: 72, cursor: 'pointer', userSelect: 'none' }}
      >
        <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 26, borderRadius: 4, overflow: 'hidden', display: 'flex' }}>
          {data.eras.map((era) => {
            const left = ((era.start - min) / (max - min)) * 100;
            const width = ((era.end - era.start) / (max - min)) * 100;
            return (
              <div key={era.id} style={{
                position: 'absolute', left: `${left}%`, width: `${width}%`, height: '100%',
                background: era.color, borderRight: '1px solid rgba(0,0,0,0.06)',
                fontSize: 10, color: '#3a352d',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', whiteSpace: 'nowrap', letterSpacing: 0.3, fontWeight: 500,
              }}>
                {width > 3 ? era.label : ''}
              </div>
            );
          })}
        </div>

        {ticks.map((t) => {
          const left = ((t - min) / (max - min)) * 100;
          return (
            <div key={t} style={{ position: 'absolute', left: `${left}%`, top: 48, transform: 'translateX(-50%)' }}>
              <div style={{ width: 1, height: 5, background: '#b8b2a0', marginLeft: '50%' }} />
              <div style={{ fontSize: 10, color: '#8a8578', marginTop: 2 }}>{formatYear(t)}</div>
            </div>
          );
        })}

        {data.events.map((ev) => {
          const left = ((ev.year - min) / (max - min)) * 100;
          const isActive = Math.abs(ev.year - year) < 8;
          return (
            <div
              key={ev.id}
              onClick={(e) => { e.stopPropagation(); onEventClick && onEventClick(ev); }}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ position: 'absolute', left: `${left}%`, top: 8, transform: 'translateX(-50%)', cursor: 'pointer', zIndex: isActive ? 3 : 2 }}
              title={`${formatYear(ev.year)} · ${ev.label}`}
            >
              <div style={{
                width: isActive ? 12 : 8, height: isActive ? 12 : 8,
                borderRadius: '50%', background: isActive ? '#c25b3f' : '#2a251f',
                border: '2px solid #fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'all 0.15s',
              }} />
            </div>
          );
        })}

        <div style={{ position: 'absolute', left: `${pct * 100}%`, top: 0, transform: 'translateX(-50%)', height: '100%', pointerEvents: 'none' }}>
          <div style={{ width: 2, height: '100%', background: '#c25b3f' }} />
          <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 14, height: 14, borderRadius: '50%', background: '#c25b3f', border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }} />
        </div>
      </div>
    </div>
  );
}
