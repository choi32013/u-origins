'use client';

import { useRef, useState, useEffect, useMemo } from 'react';

// CDN 스크립트 및 스타일시트를 순차 로드 (Next.js webpack 충돌 방지)
const CDN_SCRIPTS = [
  'https://unpkg.com/three@0.160.0/build/three.min.js',
  'https://unpkg.com/globe.gl@2.33.0/dist/globe.gl.min.js',
];
const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS  = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

function loadCss(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;
  const el = document.createElement('link');
  el.rel = 'stylesheet'; el.href = href;
  document.head.appendChild(el);
}

function loadScriptsSequentially(urls) {
  return urls.reduce(
    (chain, url) =>
      chain.then(
        () =>
          new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) { resolve(); return; }
            const el = document.createElement('script');
            el.src = url; el.onload = resolve; el.onerror = reject;
            document.head.appendChild(el);
          })
      ),
    Promise.resolve()
  );
}

function GlobeMap3D({ year, data, onEventPin, mapMode, setMapMode, geoReady }) {
  const containerRef = useRef(null);
  const globeRef     = useRef(null);
  const leafletRef   = useRef(null);
  const leafletLayersRef = useRef({ polygons: [], markers: [] });
  const [ready, setReady] = useState(false);

  const currentTerritories = useMemo(() => {
    const snapshots = data.territoriesByYear;
    if (!snapshots || snapshots.length === 0) return null;
    let best = snapshots[0];
    for (const s of snapshots) if (s.year <= year) best = s;
    return best;
  }, [year, data.territoriesByYear, geoReady]);

  const visibleEvents = useMemo(
    () => data.events.filter(e => e.year <= year + 20),
    [year, data.events]
  );

  // === 3D 지구본 초기화 ===
  useEffect(() => {
    if (mapMode !== '3d') return;
    let cancelled = false;

    if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null; }

    loadScriptsSequentially(CDN_SCRIPTS).then(() => {
      if (cancelled || !containerRef.current || !window.Globe) return;
      containerRef.current.innerHTML = '';

      const g = window.Globe()(containerRef.current)
        .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-day.jpg')
        .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#c8c0ad')
        .atmosphereAltitude(0.18)
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight);

      g.pointOfView({ lat: data.focus.lat, lng: data.focus.lng, altitude: 2.2 }, 0);

      const controls = g.controls();
      controls.autoRotate = false;
      controls.enableZoom = true;
      controls.minDistance = 150;
      controls.maxDistance = 600;

      globeRef.current = g;
      setReady(true);

      const ro = new ResizeObserver(() => {
        if (containerRef.current && globeRef.current) {
          globeRef.current.width(containerRef.current.clientWidth);
          globeRef.current.height(containerRef.current.clientHeight);
        }
      });
      ro.observe(containerRef.current);
    });

    return () => {
      cancelled = true;
      globeRef.current = null;
      setReady(false);
    };
  }, [mapMode]);

  // === 3D: 영토 업데이트 ===
  useEffect(() => {
    if (mapMode !== '3d' || !ready || !globeRef.current || !currentTerritories) return;
    const g = globeRef.current;
    const polygons = currentTerritories.polities.map(p => ({
      type: 'Feature',
      properties: { id: p.id, name: p.name, color: p.color },
      geometry: { type: 'Polygon', coordinates: [[...p.coords, p.coords[0]]] },
    }));
    g.polygonsData(polygons)
      .polygonAltitude(0.012)
      .polygonCapColor(f => f.properties.color + 'bb')
      .polygonSideColor(f => f.properties.color + '66')
      .polygonStrokeColor(f => f.properties.color)
      .polygonLabel(f => `<div style="background:rgba(255,255,255,0.96);padding:6px 10px;border-radius:6px;color:#2a251f;font-family:'Noto Sans KR',system-ui,sans-serif;font-size:12px;font-weight:600;box-shadow:0 2px 8px rgba(0,0,0,0.15)">${f.properties.name}</div>`)
      .polygonsTransitionDuration(600);
  }, [mapMode, ready, currentTerritories]);

  // === 3D: 사건 핀 업데이트 ===
  useEffect(() => {
    if (mapMode !== '3d' || !ready || !globeRef.current) return;
    const g = globeRef.current;
    const points = visibleEvents.map(ev => ({
      ...ev,
      size:  Math.abs(ev.year - year) < 10 ? 0.9 : 0.4,
      color: Math.abs(ev.year - year) < 10 ? '#c25b3f' : '#2a251f',
    }));
    g.pointsData(points)
      .pointLat('lat').pointLng('lng')
      .pointAltitude(0.02).pointRadius('size').pointColor('color').pointResolution(8)
      .pointLabel(ev => `<div style="background:rgba(255,255,255,0.96);padding:8px 12px;border-radius:6px;color:#2a251f;font-family:'Noto Sans KR',system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,0.2);max-width:240px"><div style="font-size:10px;color:#8a8578;font-weight:600">${ev.year < 0 ? 'BCE ' + (-ev.year) : ev.year}</div><div style="font-size:13px;font-weight:700;margin-top:2px">${ev.label}</div></div>`)
      .onPointClick(ev => onEventPin && onEventPin(ev));
  }, [mapMode, ready, visibleEvents, year, onEventPin]);

  // === 2D Leaflet 초기화 ===
  useEffect(() => {
    if (mapMode !== '2d') return;
    let cancelled = false;

    globeRef.current = null;
    loadCss(LEAFLET_CSS);
    loadScriptsSequentially([LEAFLET_JS]).then(() => {
      if (cancelled || !containerRef.current || !window.L) return;
      containerRef.current.innerHTML = '';

      const L = window.L;
      const map = L.map(containerRef.current, { zoomControl: false, attributionControl: false })
        .setView([data.focus.lat, data.focus.lng], 5);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18, subdomains: 'abcd',
      }).addTo(map);

      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('© OpenStreetMap, CartoDB').addTo(map);

      leafletRef.current = map;
      setReady(true);
    });

    return () => {
      cancelled = true;
      if (leafletRef.current) { leafletRef.current.remove(); leafletRef.current = null; }
      setReady(false);
    };
  }, [mapMode]);

  // === 2D: 영토 & 핀 업데이트 ===
  useEffect(() => {
    if (mapMode !== '2d' || !leafletRef.current || !window.L) return;
    const L = window.L;
    const map = leafletRef.current;

    leafletLayersRef.current.polygons.forEach(p => map.removeLayer(p));
    leafletLayersRef.current.markers.forEach(m => map.removeLayer(m));
    leafletLayersRef.current = { polygons: [], markers: [] };

    if (currentTerritories) {
      currentTerritories.polities.forEach(p => {
        const latlngs = p.coords.map(([lng, lat]) => [lat, lng]);
        const poly = L.polygon(latlngs, {
          color: p.color, fillColor: p.color, fillOpacity: 0.35, weight: 2,
        }).addTo(map);
        poly.bindTooltip(p.name, { direction: 'center', className: 'leaflet-poly-label' });
        leafletLayersRef.current.polygons.push(poly);
      });
    }

    visibleEvents.forEach(ev => {
      const isCurrent = Math.abs(ev.year - year) < 10;
      const marker = L.circleMarker([ev.lat, ev.lng], {
        radius: isCurrent ? 8 : 5,
        fillColor: isCurrent ? '#c25b3f' : '#2a251f',
        color: '#fff', weight: 2, fillOpacity: 1,
      }).addTo(map);
      marker.bindTooltip(
        `<div style="font-family:'Noto Sans KR',system-ui,sans-serif"><div style="font-size:10px;color:#8a8578;font-weight:600">${ev.year < 0 ? 'BCE ' + (-ev.year) : ev.year}</div><div style="font-size:12px;font-weight:700">${ev.label}</div></div>`,
        { direction: 'top' }
      );
      marker.on('click', () => onEventPin && onEventPin(ev));
      leafletLayersRef.current.markers.push(marker);
    });
  }, [mapMode, currentTerritories, visibleEvents, year, onEventPin]);

  // === 줌 컨트롤 ===
  const zoom = (dir) => {
    if (mapMode === '3d' && globeRef.current) {
      const pov = globeRef.current.pointOfView();
      const nextAlt = Math.max(0.6, Math.min(4, pov.altitude * (dir > 0 ? 0.75 : 1.35)));
      globeRef.current.pointOfView({ ...pov, altitude: nextAlt }, 400);
    } else if (mapMode === '2d' && leafletRef.current) {
      leafletRef.current.setZoom(leafletRef.current.getZoom() + dir);
    }
  };
  const resetView = () => {
    if (mapMode === '3d' && globeRef.current) {
      globeRef.current.pointOfView({ lat: data.focus.lat, lng: data.focus.lng, altitude: 2.2 }, 600);
    } else if (mapMode === '2d' && leafletRef.current) {
      leafletRef.current.setView([data.focus.lat, data.focus.lng], 5, { animate: true });
    }
  };

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100%',
      background: mapMode === '3d'
        ? 'radial-gradient(ellipse at center, #f5f2ea 0%, #e8e3d4 100%)'
        : '#fafaf7',
      overflow: 'hidden',
    }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* 좌상단: 지도 모드 토글 */}
      <div style={{
        position: 'absolute', top: 12, left: 12,
        display: 'flex', gap: 3,
        background: 'rgba(255,255,255,0.95)', borderRadius: 8, padding: 3,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        zIndex: 1100,
      }}>
        {[{ id: '3d', label: '지형', icon: '🌍' }, { id: '2d', label: '평면', icon: '🗺' }].map(m => (
          <button key={m.id} onClick={() => setMapMode(m.id)} style={{
            padding: '6px 12px', borderRadius: 5, border: 'none',
            background: mapMode === m.id ? '#2a251f' : 'transparent',
            color: mapMode === m.id ? '#fff' : '#3a352d',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
            fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 13 }}>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      {/* 우상단: 줌 컨트롤 */}
      <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', flexDirection: 'column', gap: 3, zIndex: 1100 }}>
        {[{ label: '+', dir: 1, title: '줌 인' }, { label: '−', dir: -1, title: '줌 아웃' }].map((btn, i) => (
          <button key={i} onClick={() => zoom(btn.dir)} title={btn.title} style={{
            width: 32, height: 32, borderRadius: 6, border: 'none',
            background: 'rgba(255,255,255,0.95)', color: '#2a251f', cursor: 'pointer',
            fontSize: 18, fontWeight: 600, boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{btn.label}</button>
        ))}
        <button onClick={resetView} title="초기 위치" style={{
          width: 32, height: 32, borderRadius: 6, border: 'none',
          background: 'rgba(255,255,255,0.95)', color: '#2a251f', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="7" cy="7" r="2"/><circle cx="7" cy="7" r="5.5"/>
          </svg>
        </button>
      </div>

      {/* 범례 */}
      <div style={{
        position: 'absolute', bottom: 16, left: 16,
        background: 'rgba(255,255,255,0.94)', borderRadius: 8, padding: '10px 12px',
        fontSize: 12, color: '#3a352d', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        backdropFilter: 'blur(8px)',
        fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        pointerEvents: 'none', zIndex: 1050,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 6, fontSize: 11, letterSpacing: 0.5, color: '#6b6a63' }}>
          {year < 0 ? `BCE ${-year}` : `${year}`} · 영토 {currentTerritories ? currentTerritories.polities.length : 0}개
        </div>
        {currentTerritories && currentTerritories.polities.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 6, lineHeight: 1.6 }}>
            <span style={{ width: 10, height: 10, background: p.color, borderRadius: 2, opacity: 0.85, display: 'inline-block' }} />
            <span>{p.name}</span>
          </div>
        ))}
      </div>

      {/* 조작 안내 */}
      <div style={{
        position: 'absolute', bottom: 16, right: 16,
        fontSize: 11, color: '#6b6a63', letterSpacing: 0.3,
        background: 'rgba(255,255,255,0.85)', padding: '4px 10px', borderRadius: 12,
        fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        pointerEvents: 'none', zIndex: 1050,
      }}>
        {mapMode === '3d' ? '드래그 회전 · 스크롤 줌' : '드래그 이동 · 스크롤 줌'}
      </div>

      {!ready && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#8a8578', fontSize: 13,
          fontFamily: "'Noto Sans KR', system-ui, sans-serif",
        }}>
          {mapMode === '3d' ? '지구본 불러오는 중…' : '지도 불러오는 중…'}
        </div>
      )}
    </div>
  );
}

export default function GlobeMap(props) {
  const [mapMode, setMapMode] = useState('3d');
  return <GlobeMap3D {...props} mapMode={mapMode} setMapMode={setMapMode} />;
}
