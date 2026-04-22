// MainPrototype.jsx — 메인 레이아웃: 지구본 + 하단 타임라인
// 확장 가능한 구조: dataset 을 props 로 받아서 여러 역사 카테고리 지원

const MainPrototype = ({ dataset, compact = false }) => {
  const [year, setYear] = React.useState(dataset.range[0] + Math.floor((dataset.range[1] - dataset.range[0]) * 0.6));
  const [playing, setPlaying] = React.useState(false);
  const [playSpeed, setPlaySpeed] = React.useState(window.__TWEAKS?.playSpeed || 8);
  const [rotation, setRotation] = React.useState({ lng: dataset.focus.lng, lat: dataset.focus.lat });
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [layers, setLayers] = React.useState({ territory: true, capital: false, religion: false });

  // Tweaks 동기화
  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__tweak_update' && e.data.key === 'playSpeed') {
        setPlaySpeed(e.data.value);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  React.useEffect(() => {
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
      {/* 헤더 */}
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
            color: '#fff', fontWeight: 700, fontSize: 13,
            letterSpacing: -0.5,
          }}>U</div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>U-Origins</div>
            <div style={{ fontSize: 10, color: '#8a8578', letterSpacing: 0.4 }}>
              {dataset.label.toUpperCase()} · 열린 역사 아카이브
            </div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* 카테고리 선택 (확장 가능) */}
        <div style={{ display: 'flex', gap: 4, background: '#f4f1e8', padding: 3, borderRadius: 6 }}>
          {['한국사', '동아시아', '세계사'].map((label, i) => (
            <button key={label} disabled={i !== 0}
              style={{
                padding: '5px 11px', borderRadius: 4,
                border: 'none',
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

        {/* 레이어 토글 */}
        <div style={{ display: 'flex', gap: 4, background: '#f4f1e8', padding: 3, borderRadius: 6 }}>
          {[
            { id: 'territory', label: '영토' },
            { id: 'religion', label: '종교' },
            { id: 'capital', label: '수도' },
          ].map(l => (
            <button key={l.id}
              onClick={() => setLayers({ ...layers, [l.id]: !layers[l.id] })}
              style={{
                padding: '5px 11px', borderRadius: 4,
                border: 'none',
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

      {/* 본문: 지도 */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <GlobeMap
          year={year}
          data={dataset}
          rotation={rotation}
          onRotate={setRotation}
          onEventPin={(ev) => setSelectedEvent(ev)}
        />
      </div>

      {/* 하단 타임라인 */}
      <Timeline
        year={year} setYear={setYear}
        data={dataset}
        onEventClick={(ev) => setSelectedEvent(ev)}
        playing={playing} setPlaying={setPlaying}
        playSpeed={playSpeed}
      />

      {/* 사건 상세 모달 */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          data={dataset}
          onClose={() => setSelectedEvent(null)}
          onSelectEvent={(ev) => setSelectedEvent(ev)}
        />
      )}
    </div>
  );
};

// === 변형 B: 좌측 연표 사이드바 + 우측 지도 ===
const VariantSidebar = ({ dataset }) => {
  const [year, setYear] = React.useState(676);
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [rotation, setRotation] = React.useState({ lng: dataset.focus.lng, lat: dataset.focus.lat });

  const sortedEvents = [...dataset.events].sort((a, b) => a.year - b.year);
  const formatYear = (y) => y < 0 ? `BCE ${-y}` : `${y}`;

  return (
    <div style={{
      width: '100%', height: '100%',
      display: 'grid', gridTemplateColumns: '300px 1fr',
      background: '#fdfcf8',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      overflow: 'hidden',
    }}>
      {/* 좌측 연표 */}
      <aside style={{
        borderRight: '1px solid #eae5d8',
        background: '#fafaf7',
        overflow: 'auto',
        padding: '20px 0',
      }}>
        <div style={{ padding: '0 20px 16px', borderBottom: '1px solid #eae5d8' }}>
          <div style={{ fontSize: 11, color: '#8a8578', letterSpacing: 0.5, fontWeight: 600, textTransform: 'uppercase' }}>
            {dataset.label}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, letterSpacing: -0.3 }}>
            {formatYear(year)}
          </div>
        </div>
        {dataset.eras.map(era => {
          const eraEvents = sortedEvents.filter(e => e.year >= era.start && e.year < era.end);
          if (eraEvents.length === 0) return null;
          return (
            <div key={era.id} style={{ padding: '12px 0' }}>
              <div style={{
                padding: '4px 20px', background: era.color,
                fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
                color: '#3a352d',
              }}>
                {era.label}
              </div>
              {eraEvents.map(ev => {
                const active = Math.abs(ev.year - year) < 10;
                return (
                  <button key={ev.id}
                    onClick={() => { setYear(ev.year); setSelectedEvent(ev); }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '8px 20px', border: 'none',
                      background: active ? '#fff' : 'transparent',
                      borderLeft: active ? '3px solid #c25b3f' : '3px solid transparent',
                      cursor: 'pointer', fontFamily: 'inherit',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 11, color: '#8a8578', fontVariantNumeric: 'tabular-nums' }}>
                      {formatYear(ev.year)}
                    </div>
                    <div style={{ fontSize: 13, color: '#2a251f', fontWeight: active ? 600 : 500, marginTop: 1 }}>
                      {ev.label}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </aside>

      {/* 우측 지도 */}
      <div style={{ position: 'relative', overflow: 'hidden', minHeight: 0 }}>
        <GlobeMap
          year={year}
          data={dataset}
          rotation={rotation}
          onRotate={setRotation}
          onEventPin={(ev) => setSelectedEvent(ev)}
        />
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#fff', borderRadius: 24, padding: '8px 18px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          fontSize: 12, color: '#6b6a63',
        }}>
          왼쪽 연표에서 사건 선택
        </div>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} data={dataset}
          onClose={() => setSelectedEvent(null)}
          onSelectEvent={(ev) => { setYear(ev.year); setSelectedEvent(ev); }}
        />
      )}
    </div>
  );
};

// === 변형 C: 풀스크린 지도 + 플로팅 미니 타임라인 ===
const VariantFullscreen = ({ dataset }) => {
  const [year, setYear] = React.useState(1446);
  const [rotation, setRotation] = React.useState({ lng: dataset.focus.lng, lat: dataset.focus.lat });
  const [selectedEvent, setSelectedEvent] = React.useState(null);
  const [playing, setPlaying] = React.useState(false);
  const formatYear = (y) => y < 0 ? `BCE ${-y}` : `${y}`;
  const [min, max] = dataset.range;
  const era = dataset.eras.find(e => year >= e.start && year < e.end);

  return (
    <div style={{
      width: '100%', height: '100%',
      position: 'relative',
      background: 'radial-gradient(ellipse at center, #fdfcf8 0%, #f2efe8 100%)',
      fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
      overflow: 'hidden',
    }}>
      {/* 풀스크린 지구본 */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <GlobeMap
          year={year}
          data={dataset}
          rotation={rotation}
          onRotate={setRotation}
          onEventPin={(ev) => setSelectedEvent(ev)}
        />
      </div>

      {/* 상단 로고 */}
      <div style={{
        position: 'absolute', top: 20, left: 24,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: 'linear-gradient(135deg, #c25b3f, #8b3a24)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13,
        }}>U</div>
        <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: -0.3 }}>U-Origins</div>
      </div>

      {/* 중앙 연도 큰 디스플레이 */}
      <div style={{
        position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: -1.5, color: '#1a1815', fontVariantNumeric: 'tabular-nums' }}>
          {formatYear(year)}
        </div>
        <div style={{ fontSize: 12, color: '#8a8578', letterSpacing: 0.6, textTransform: 'uppercase', marginTop: -4 }}>
          {era ? era.label : ''}
        </div>
      </div>

      {/* 플로팅 미니 타임라인 */}
      <div style={{
        position: 'absolute', bottom: 20, left: 20, right: 20,
        background: 'rgba(255,255,255,0.94)',
        backdropFilter: 'blur(12px)',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        padding: '14px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <button
            onClick={() => setPlaying(!playing)}
            style={{
              width: 30, height: 30, borderRadius: 15, border: 'none',
              background: playing ? '#c25b3f' : '#2a251f',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {playing ? '❚❚' : '▶'}
          </button>
          <div style={{ fontSize: 12, color: '#6b6a63' }}>
            사건 {dataset.events.length}개 · 연도 드래그로 시간 이동
          </div>
        </div>
        <div style={{ position: 'relative', height: 28 }}>
          <input type="range" min={min} max={max}
            value={year} onChange={(e) => setYear(Number(e.target.value))}
            style={{ width: '100%', cursor: 'pointer' }}
          />
          {dataset.events.map(ev => {
            const left = ((ev.year - min) / (max - min)) * 100;
            return (
              <div key={ev.id}
                onClick={() => setSelectedEvent(ev)}
                style={{
                  position: 'absolute', left: `${left}%`, top: -4,
                  transform: 'translateX(-50%)',
                  width: 6, height: 6, borderRadius: 3,
                  background: '#c25b3f', cursor: 'pointer',
                  border: '1px solid #fff',
                }}
                title={ev.label}
              />
            );
          })}
        </div>
      </div>

      {selectedEvent && (
        <EventModal event={selectedEvent} data={dataset}
          onClose={() => setSelectedEvent(null)}
          onSelectEvent={(ev) => { setYear(ev.year); setSelectedEvent(ev); }}
        />
      )}
    </div>
  );
};

Object.assign(window, { MainPrototype, VariantSidebar, VariantFullscreen });
