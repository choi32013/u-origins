// GlobeMap3D.jsx — globe.gl 기반 3D 지구본
// 실제 지구 텍스처 + 영토 폴리곤 오버레이 + 사건 핀
// CDN: https://unpkg.com/globe.gl

const GlobeMap3D = ({ year, data, highlightEventId, onEventPin }) => {
  const containerRef = React.useRef(null);
  const globeRef = React.useRef(null);
  const [ready, setReady] = React.useState(false);

  // 현재 연도 영토
  const currentTerritories = React.useMemo(() => {
    const snapshots = data.territoriesByYear;
    let best = snapshots[0];
    for (const s of snapshots) {
      if (s.year <= year) best = s;
    }
    return best;
  }, [year, data.territoriesByYear]);

  // 현재 시대 사건들 (연도 근처 + 과거)
  const visibleEvents = React.useMemo(() => {
    return data.events.filter(e => e.year <= year + 20);
  }, [year, data.events]);

  // 초기화
  React.useEffect(() => {
    if (!containerRef.current || !window.Globe) return;
    const g = window.Globe()(containerRef.current)
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-day.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('rgba(0,0,0,0)')
      .showAtmosphere(true)
      .atmosphereColor('#c8c0ad')
      .atmosphereAltitude(0.18)
      .width(containerRef.current.clientWidth)
      .height(containerRef.current.clientHeight);

    // 초기 위치: 한반도 중심
    g.pointOfView({ lat: data.focus.lat, lng: data.focus.lng, altitude: 2.2 }, 0);

    // 컨트롤 튜닝
    const controls = g.controls();
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.minDistance = 180;
    controls.maxDistance = 500;

    globeRef.current = g;
    setReady(true);

    // 리사이즈 대응
    const ro = new ResizeObserver(() => {
      if (containerRef.current && globeRef.current) {
        globeRef.current.width(containerRef.current.clientWidth);
        globeRef.current.height(containerRef.current.clientHeight);
      }
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // 영토 폴리곤 업데이트
  React.useEffect(() => {
    if (!ready || !globeRef.current || !currentTerritories) return;
    const g = globeRef.current;

    // GeoJSON 형태로 변환 (coords: [[lng,lat],...])
    const polygons = currentTerritories.polities.map(p => ({
      ...p,
      geojson: {
        type: 'Feature',
        properties: { id: p.id, name: p.name, color: p.color },
        geometry: {
          type: 'Polygon',
          coordinates: [[...p.coords, p.coords[0]]], // 첫 점으로 폐합
        },
      },
    }));

    g.polygonsData(polygons.map(p => p.geojson))
      .polygonAltitude(0.012)
      .polygonCapColor(feat => feat.properties.color + 'bb') // 반투명
      .polygonSideColor(feat => feat.properties.color + '66')
      .polygonStrokeColor(feat => feat.properties.color)
      .polygonLabel(feat => `
        <div style="background:rgba(255,255,255,0.96);padding:6px 10px;border-radius:6px;color:#2a251f;font-family:'Noto Sans KR',system-ui,sans-serif;font-size:12px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.15)">
          ${feat.properties.name}
        </div>
      `)
      .polygonsTransitionDuration(600);
  }, [ready, currentTerritories]);

  // 사건 핀 업데이트
  React.useEffect(() => {
    if (!ready || !globeRef.current) return;
    const g = globeRef.current;

    const points = visibleEvents.map(ev => ({
      ...ev,
      size: Math.abs(ev.year - year) < 10 ? 0.9 : 0.4,
      color: Math.abs(ev.year - year) < 10 ? '#c25b3f' : '#2a251f',
    }));

    g.pointsData(points)
      .pointLat('lat')
      .pointLng('lng')
      .pointAltitude(0.02)
      .pointRadius('size')
      .pointColor('color')
      .pointResolution(8)
      .pointLabel(ev => `
        <div style="background:rgba(255,255,255,0.96);padding:8px 12px;border-radius:6px;color:#2a251f;font-family:'Noto Sans KR',system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.2);max-width:240px">
          <div style="font-size:10px;color:#8a8578;letter-spacing:0.3px;font-weight:600">
            ${ev.year < 0 ? 'BCE ' + (-ev.year) : ev.year}
          </div>
          <div style="font-size:13px;font-weight:700;margin-top:2px">${ev.label}</div>
          <div style="font-size:11px;color:#6b6a63;margin-top:4px;line-height:1.4">클릭하여 상세보기</div>
        </div>
      `)
      .onPointClick(ev => onEventPin && onEventPin(ev));
  }, [ready, visibleEvents, year, onEventPin]);

  return (
    <div style={{
      position: 'relative',
      width: '100%', height: '100%',
      background: 'radial-gradient(ellipse at center, #f5f2ea 0%, #e8e3d4 100%)',
      overflow: 'hidden',
    }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* 범례 */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        background: 'rgba(255,255,255,0.94)',
        borderRadius: 8, padding: '10px 12px',
        fontSize: 12, color: '#3a352d',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(8px)',
        fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        pointerEvents: 'none',
        zIndex: 2,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 11, letterSpacing: 0.5, color: '#6b6a63' }}>
          {year < 0 ? `BCE ${-year}` : `${year}`} · 영토 {currentTerritories ? currentTerritories.polities.length : 0}개
        </div>
        {currentTerritories && currentTerritories.polities.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1.6 }}>
            <span style={{ width: 10, height: 10, background: p.color, borderRadius: 2, opacity: 0.85 }} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>

      {/* 조작 안내 */}
      <div style={{
        position: 'absolute', top: 12, right: 16,
        fontSize: 11, color: '#6b6a63', letterSpacing: 0.3,
        background: 'rgba(255,255,255,0.8)',
        padding: '4px 10px', borderRadius: 12,
        fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        pointerEvents: 'none',
        zIndex: 2,
      }}>
        드래그 회전 · 스크롤 줌
      </div>

      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#8a8578', fontSize: 13,
          fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        }}>
          지구본 불러오는 중…
        </div>
      )}
    </div>
  );
};

window.GlobeMap3D = GlobeMap3D;
// 기존 GlobeMap 도 GlobeMap3D 로 별칭 (MainPrototype.jsx 가 GlobeMap 을 참조)
window.GlobeMap = GlobeMap3D;
