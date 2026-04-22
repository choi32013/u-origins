// 한반도 실제 해안선 기반 시대별 영토
// Natural Earth 10m 데이터에서 추출한 SK+NK 폴리곤을 stitching해 peninsula ring 생성
// 시대별로는 북쪽 위도 기준 clipping + 북쪽 경계선으로 마감

window.HISTORY_DATA = window.HISTORY_DATA || {};

// 한반도 ring 로드 (async)
window.KOREA_PENINSULA_READY = fetch('data/korea-peninsula.json')
  .then(r => r.json())
  .then(ring => {
    window.KOREA_PENINSULA = ring;
    return ring;
  });

// 시대별 북쪽 경계선 (왼쪽=서쪽 압록강 하구 → 오른쪽=동쪽 두만강 하구)
// 좌표는 [lng, lat] — Peninsula ring 의 북쪽 끝점들과 연결됨
const NORTH_BOUNDARIES = {
  // 고조선 전성기: 요동반도 일대 (peninsula 북쪽을 훨씬 넘어섬)
  gojoseon_peak: [
    [124.3, 40.0], [122.5, 40.5], [121.5, 40.0], [121.0, 39.0],
    [122.0, 38.8], [123.5, 38.6], [125.0, 38.7],
  ],
  // 고구려 초기 (100년): 압록강 중류 주변
  goguryeo_early: [
    [124.3, 40.0], [125.5, 40.8], [127.0, 41.2], [128.5, 41.0],
    [129.5, 40.5], [130.0, 40.0],
  ],
  // 고구려 전성기 (427년 ~): 만주 동부까지
  goguryeo_peak: [
    [124.0, 39.8], [122.5, 41.0], [122.0, 42.5], [124.0, 43.5],
    [126.5, 43.8], [129.0, 43.5], [131.0, 43.2], [132.5, 42.5],
    [132.0, 41.0], [130.5, 40.0],
  ],
  // 발해: 만주 동부 (한반도 북부는 포함 안함)
  balhae: [
    // 발해는 독립 폴리곤으로 그림 (peninsula 와 별개)
  ],
  // 통일신라: 대동강-원산만 이북 제외
  unified_silla: [
    // 대동강 하구 ~ 원산만 (남한계)
    [125.2, 38.9], [126.5, 38.8], [127.5, 39.0], [128.5, 39.0], [129.3, 39.4],
  ],
  // 고려 천리장성 (1044년): 압록강 중하류 ~ 도련포
  goryeo: [
    [124.3, 40.0], [125.5, 40.0], [127.0, 40.1], [128.5, 40.3], [129.6, 40.5],
  ],
  // 조선: 현대 국경과 거의 동일 (peninsula ring 전체 사용)
  joseon: null,
};

// peninsula ring 을 북쪽 경계선으로 마감해 정상적인 폐합 폴리곤 생성
// - 링이 clipLat 를 정확히 2번 교차한다는 가정 (동해안 1번, 서해안 1번)
// - 교차 지점 2개를 정확히 계산해서 링 arc 를 자름
// - side: 'south' = 남쪽 반도만, 'north' = 북쪽 반도만 (해당시 northBoundary 로 북쪽 폐합)
function clipPeninsulaByLat(peninsula, clipLat, side, northBoundary) {
  const n = peninsula.length;
  // 링의 lat=clipLat 교차점 찾기
  const crossings = []; // { idx, lng, lat, dir: +1(북행) or -1(남행) }
  for (let i = 0; i < n - 1; i++) {
    const a = peninsula[i], b = peninsula[i+1];
    const da = a[1] - clipLat, db = b[1] - clipLat;
    if (da === 0 && db === 0) continue;
    if ((da <= 0 && db > 0) || (da >= 0 && db < 0) || (da < 0 && db >= 0) || (da > 0 && db <= 0)) {
      // 교차
      const t = da / (da - db);
      const lng = a[0] + t * (b[0] - a[0]);
      crossings.push({ idx: i, t, lng, lat: clipLat, dir: Math.sign(db - da) });
    }
  }
  if (crossings.length < 2) {
    // 교차점이 없으면 그냥 전체 ring 반환
    return [...peninsula];
  }
  // 첫 두 개만 사용 (일반적으로 동해안, 서해안에서 각각 1번씩 교차)
  const c1 = crossings[0], c2 = crossings[1];
  // arc 추출: side 에 따라 c1→c2 또는 c2→c1 방향
  // side='south' 인 경우 clipLat 아래 점들이 포함되어야 함
  // 링의 c1.idx+1 부터 c2.idx 까지의 점들은 같은 sign
  // peninsula[c1.idx+1] 의 lat 부호로 판단
  const midPoint = peninsula[c1.idx + 1];
  const midAboveClip = midPoint[1] > clipLat;
  let arc;
  if ((side === 'south' && !midAboveClip) || (side === 'north' && midAboveClip)) {
    // c1 → c2 (앞쪽 arc 가 원하는 쪽)
    arc = [[c1.lng, c1.lat]];
    for (let i = c1.idx + 1; i <= c2.idx; i++) arc.push(peninsula[i]);
    arc.push([c2.lng, c2.lat]);
  } else {
    // c2 → c1 (뒤쪽 arc, 링 wrap)
    arc = [[c2.lng, c2.lat]];
    for (let i = c2.idx + 1; i < n; i++) arc.push(peninsula[i]);
    for (let i = 0; i <= c1.idx; i++) arc.push(peninsula[i]);
    arc.push([c1.lng, c1.lat]);
  }

  if (side === 'south') {
    // 남쪽 영역: arc 자체로 폐합 (clipLat 선분으로 자동 마감)
    return [...arc, arc[0]];
  } else {
    // 북쪽 영역: arc + northBoundary 로 폐합
    if (!northBoundary || northBoundary.length === 0) {
      return [...arc, arc[0]];
    }
    // arc 의 끝점에서 northBoundary 시작점까지, arc 시작점까지 closed
    // northBoundary 는 서→동 방향 정의; arc 의 방향을 보고 뒤집을지 결정
    const arcStart = arc[0], arcEnd = arc[arc.length - 1];
    const nb0 = northBoundary[0], nbEnd = northBoundary[northBoundary.length - 1];
    const d = (a, b) => Math.hypot(a[0]-b[0], a[1]-b[1]);
    // arcEnd 에 nb0/nbEnd 중 가까운 쪽이 붙음
    let nb = northBoundary;
    if (d(arcEnd, nbEnd) < d(arcEnd, nb0)) nb = [...northBoundary].reverse();
    return [...arc, ...nb, arc[0]];
  }
}

// 선분 교차 유틸
function _segSegIntersect(p1, p2, p3, p4) {
  // p1-p2 vs p3-p4 교차점. 없으면 null.
  const x1=p1[0], y1=p1[1], x2=p2[0], y2=p2[1];
  const x3=p3[0], y3=p3[1], x4=p4[0], y4=p4[1];
  const denom = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
  if (Math.abs(denom) < 1e-12) return null;
  const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / denom;
  const u = -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3)) / denom;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return { x: x1 + t*(x2-x1), y: y1 + t*(y2-y1), t, ringIdx: null, boundarySeg: null };
}

// 내부 경계선 (polyline) 으로 peninsula 링을 동/서로 정확히 분할
// 1단계: 먼저 peninsula 를 northLat 이남으로 clip (SK 영역만 추출)
// 2단계: 그 subring 을 internalBoundary 와 교차시켜 동/서 아크 추출
function splitPeninsulaByInternalBoundary(peninsula, internalBoundary, northLat, side) {
  if (!peninsula || peninsula.length < 4) return [];
  // 1) SK 영역 추출 — peninsula 를 northLat 이남으로 clip
  const sk = clipPeninsulaByLat(peninsula, northLat, 'south', null);
  if (!sk || sk.length < 4) return [];
  const n = sk.length;

  // 2) sk 링의 모든 세그먼트 vs 경계선 교차점
  const crossings = [];
  for (let i = 0; i < n - 1; i++) {
    const a = sk[i], b = sk[i+1];
    for (let j = 0; j < internalBoundary.length - 1; j++) {
      const c = internalBoundary[j], d = internalBoundary[j+1];
      const x = _segSegIntersect(a, b, c, d);
      if (x) crossings.push({ ringIdx: i, t: x.t, pt: [x.x, x.y] });
    }
  }
  if (crossings.length < 2) return [];
  // 경계선의 양 끝점에 가장 가까운 교차점을 각각 entry/exit 로 선택
  // (다수의 교차점이 있을 때 첫 두 개가 아닌 극값 2개를 사용)
  const ibNorth = internalBoundary[0];
  const ibSouth = internalBoundary[internalBoundary.length - 1];
  const _d2 = (a, b) => (a[0]-b[0])**2 + (a[1]-b[1])**2;
  let cNorth = crossings[0], cSouth = crossings[0];
  for (const c of crossings) {
    if (_d2(c.pt, ibNorth) < _d2(cNorth.pt, ibNorth)) cNorth = c;
    if (_d2(c.pt, ibSouth) < _d2(cSouth.pt, ibSouth)) cSouth = c;
  }
  if (cNorth === cSouth) return [];
  const [c1, c2] = cNorth.ringIdx <= cSouth.ringIdx
    ? [cNorth, cSouth]
    : [cSouth, cNorth];

  // 3) 두 아크 중 원하는 쪽 선택
  const arcA = [c1.pt];
  for (let i = c1.ringIdx + 1; i <= c2.ringIdx; i++) arcA.push(sk[i]);
  arcA.push(c2.pt);

  function lngAtLat(ib, lat) {
    for (let i = 0; i < ib.length - 1; i++) {
      const a = ib[i], b = ib[i+1];
      if ((a[1]-lat)*(b[1]-lat) <= 0 && a[1] !== b[1]) {
        const t = (lat - a[1]) / (b[1] - a[1]);
        return a[0] + t*(b[0]-a[0]);
      }
    }
    return lat > ib[0][1] ? ib[0][0] : ib[ib.length-1][0];
  }
  const mid = arcA[Math.floor(arcA.length / 2)];
  const midBoundaryLng = lngAtLat(internalBoundary, mid[1]);
  const arcAIsEast = mid[0] > midBoundaryLng;

  let chosenArc;
  if ((side === 'east' && arcAIsEast) || (side === 'west' && !arcAIsEast)) {
    chosenArc = arcA;
  } else {
    chosenArc = [c2.pt];
    for (let i = c2.ringIdx + 1; i < n; i++) chosenArc.push(sk[i]);
    for (let i = 0; i <= c1.ringIdx; i++) chosenArc.push(sk[i]);
    chosenArc.push(c1.pt);
  }

  // 4) 경계선으로 닫기
  const arcEnd = chosenArc[chosenArc.length - 1];
  const d = (a, b) => Math.hypot(a[0]-b[0], a[1]-b[1]);
  const ibStart = internalBoundary[0], ibEnd = internalBoundary[internalBoundary.length - 1];
  const ibSeg = d(arcEnd, ibStart) < d(arcEnd, ibEnd)
    ? [...internalBoundary]
    : [...internalBoundary].reverse();
  return [...chosenArc, ...ibSeg, chosenArc[0]];
}

// 삼국시대 내부 경계선 (북→남, lat 내림차순)
// 중요: 반도 링을 정확히 2번 교차해야 하므로 양 끝을 해안 바깥으로 충분히 연장함
const INTERNAL_BOUNDARIES = {
  // 백제/신라 경계 (100년, 소백산맥).
  // 북단 38.3 (SK clip 아래) → 남단 34.0 (남해안 아래)까지 연장→ SK 링을 확실히 2번 교차
  baekje_silla_early: [
    [126.3, 38.3], [127.0, 37.4], [127.3, 37.0], [127.6, 36.5],
    [127.8, 35.9], [127.7, 35.3], [127.5, 34.8], [127.5, 34.0],
  ],
  baekje_silla_peak: [
    [125.8, 37.3], [127.0, 37.0], [127.4, 36.6], [127.7, 36.0],
    [127.6, 35.3], [127.4, 34.8], [127.2, 34.0],
  ],
};
window.HISTORY_DATA.korea = {
  id: "korea",
  label: "한국사",
  range: [-2333, 1910],
  focus: { lat: 37.5, lng: 127.5, zoom: 5 },

  eras: [
    { id: "gojoseon", label: "고조선", start: -2333, end: -108, color: "#E8E2D5" },
    { id: "samhan", label: "원삼국", start: -108, end: 57, color: "#E0DAC8" },
    { id: "threekingdoms", label: "삼국시대", start: 57, end: 676, color: "#D6CFB8" },
    { id: "unifiedsilla", label: "통일신라/발해", start: 676, end: 935, color: "#CEC5A6" },
    { id: "goryeo", label: "고려", start: 918, end: 1392, color: "#C4B995" },
    { id: "joseon", label: "조선", start: 1392, end: 1897, color: "#B9AC83" },
    { id: "daehan", label: "대한제국", start: 1897, end: 1910, color: "#AD9E72" },
  ],

  events: [
    { id: "e_gojoseon_founding", year: -2333, label: "고조선 건국", lat: 39.0, lng: 125.7, era: "gojoseon",
      summary: "단군왕검이 아사달에 도읍을 정하고 고조선을 건국했다고 전해진다. 한국사 최초의 국가.",
      tags: ["건국","신화"], causes: [], effects: ["e_wiman"] },
    { id: "e_wiman", year: -194, label: "위만조선 성립", lat: 39.0, lng: 125.7, era: "gojoseon",
      summary: "연나라에서 망명한 위만이 준왕을 몰아내고 왕이 됨. 철기 문화가 본격 보급.",
      tags: ["정변","철기"], causes: ["e_gojoseon_founding"], effects: ["e_han_invasion"] },
    { id: "e_han_invasion", year: -108, label: "한사군 설치", lat: 39.0, lng: 125.7, era: "gojoseon",
      summary: "한 무제의 침공으로 고조선 멸망. 낙랑·현도·임둔·진번 4군 설치.",
      tags: ["전쟁","멸망"], causes: ["e_wiman"], effects: ["e_goguryeo_founding"] },
    { id: "e_goguryeo_founding", year: -37, label: "고구려 건국", lat: 41.1, lng: 126.4, era: "samhan",
      summary: "주몽(동명성왕)이 졸본에 고구려를 건국. 이후 동북아 최강국으로 성장.",
      tags: ["건국"], causes: ["e_han_invasion"], effects: ["e_gwanggaeto"] },
    { id: "e_baekje_founding", year: -18, label: "백제 건국", lat: 37.5, lng: 127.0, era: "samhan",
      summary: "온조가 위례성(한강 유역)에 백제를 건국.",
      tags: ["건국"], causes: [], effects: ["e_baekje_buddhism"] },
    { id: "e_silla_founding", year: -57, label: "신라 건국", lat: 35.85, lng: 129.22, era: "samhan",
      summary: "박혁거세가 서라벌(경주)에 사로국 건국. 후에 신라로 발전.",
      tags: ["건국"], causes: [], effects: ["e_silla_unification"] },
    { id: "e_goguryeo_buddhism", year: 372, label: "고구려 불교 공인", lat: 41.1, lng: 126.4, era: "threekingdoms",
      summary: "소수림왕이 전진으로부터 불교 수용. 한반도 불교 전래의 시작.",
      tags: ["종교","문화"], causes: [], effects: ["e_baekje_buddhism","e_silla_buddhism"] },
    { id: "e_baekje_buddhism", year: 384, label: "백제 불교 공인", lat: 37.5, lng: 127.0, era: "threekingdoms",
      summary: "침류왕 때 동진의 마라난타가 불교 전래.",
      tags: ["종교"], causes: ["e_goguryeo_buddhism"], effects: [] },
    { id: "e_gwanggaeto", year: 391, label: "광개토대왕 즉위", lat: 41.1, lng: 126.4, era: "threekingdoms",
      summary: "만주와 한반도 중부까지 영토를 크게 확장. 고구려 최전성기 돌입.",
      tags: ["정복","전성기"], causes: ["e_goguryeo_founding"], effects: ["e_jangsu_south"] },
    { id: "e_jangsu_south", year: 427, label: "장수왕 평양 천도", lat: 39.02, lng: 125.75, era: "threekingdoms",
      summary: "장수왕이 수도를 국내성에서 평양으로 옮기며 남진정책 추진.",
      tags: ["천도","정책"], causes: ["e_gwanggaeto"], effects: ["e_silla_unification"] },
    { id: "e_silla_buddhism", year: 527, label: "신라 불교 공인", lat: 35.85, lng: 129.22, era: "threekingdoms",
      summary: "이차돈의 순교를 계기로 법흥왕이 불교 공인. 왕권 강화의 이념적 기반.",
      tags: ["종교"], causes: ["e_goguryeo_buddhism"], effects: [] },
    { id: "e_silla_unification", year: 676, label: "신라의 삼국통일", lat: 35.85, lng: 129.22, era: "unifiedsilla",
      summary: "나당전쟁에서 당을 축출하고 대동강~원산만 이남을 통일.",
      tags: ["통일","전쟁"], causes: ["e_jangsu_south"], effects: ["e_balhae_founding"] },
    { id: "e_balhae_founding", year: 698, label: "발해 건국", lat: 43.85, lng: 129.5, era: "unifiedsilla",
      summary: "대조영이 동모산에서 발해 건국. 남북국 시대 시작.",
      tags: ["건국"], causes: ["e_silla_unification"], effects: [] },
    { id: "e_goryeo_founding", year: 918, label: "고려 건국", lat: 37.97, lng: 126.55, era: "goryeo",
      summary: "왕건이 송악에 고려 건국. 936년 후삼국 통일.",
      tags: ["건국"], causes: [], effects: ["e_goryeo_mongol"] },
    { id: "e_goryeo_mongol", year: 1231, label: "몽골 침입 시작", lat: 37.97, lng: 126.55, era: "goryeo",
      summary: "몽골의 1차 침입. 이후 약 30년간 6차례 침입, 강화 천도.",
      tags: ["전쟁","침입"], causes: ["e_goryeo_founding"], effects: ["e_joseon_founding"] },
    { id: "e_joseon_founding", year: 1392, label: "조선 건국", lat: 37.57, lng: 126.98, era: "joseon",
      summary: "이성계가 고려를 무너뜨리고 조선 건국. 한양 천도.",
      tags: ["건국","역성혁명"], causes: ["e_goryeo_mongol"], effects: ["e_hangul"] },
    { id: "e_hangul", year: 1446, label: "훈민정음 반포", lat: 37.57, lng: 126.98, era: "joseon",
      summary: "세종대왕이 훈민정음 창제·반포. 독자적 문자 체계 확립.",
      tags: ["문화","과학"], causes: ["e_joseon_founding"], effects: [] },
    { id: "e_imjin", year: 1592, label: "임진왜란", lat: 35.1, lng: 129.0, era: "joseon",
      summary: "도요토미 히데요시의 조선 침공. 이순신의 해전 활약, 7년 전쟁.",
      tags: ["전쟁","침입"], causes: [], effects: ["e_byeongja"] },
    { id: "e_byeongja", year: 1636, label: "병자호란", lat: 37.48, lng: 127.35, era: "joseon",
      summary: "청의 침입. 인조의 삼전도 굴욕과 군신관계 체결.",
      tags: ["전쟁","침입"], causes: ["e_imjin"], effects: [] },
    { id: "e_ganghwa", year: 1876, label: "강화도 조약", lat: 37.7, lng: 126.5, era: "joseon",
      summary: "일본과의 불평등 조약. 조선의 개항과 근대화의 시작점이자 외세 간섭의 문.",
      tags: ["외교","개항"], causes: [], effects: ["e_daehan"] },
    { id: "e_daehan", year: 1897, label: "대한제국 선포", lat: 37.57, lng: 126.98, era: "daehan",
      summary: "고종이 황제 즉위, 대한제국 선포. 자주 독립국 지위 천명.",
      tags: ["선포"], causes: ["e_ganghwa"], effects: ["e_annexation"] },
    { id: "e_annexation", year: 1910, label: "경술국치", lat: 37.57, lng: 126.98, era: "daehan",
      summary: "한일병합조약 강제 체결. 대한제국 멸망.",
      tags: ["멸망"], causes: ["e_daehan"], effects: [] },
  ],

  // peninsula 가 로드된 이후 동적으로 계산
  get territoriesByYear() {
    const p = window.KOREA_PENINSULA;
    if (!p) return [];

    return [
      { year: -500, polities: [
        { id: "gojoseon", name: "고조선", color: "#8B6F47",
          coords: clipPeninsulaByLat(p, 39.0, 'north', NORTH_BOUNDARIES.gojoseon_peak) },
      ]},
      { year: 100, polities: [
        { id: "goguryeo", name: "고구려", color: "#C25B3F",
          coords: clipPeninsulaByLat(p, 38.8, 'north', NORTH_BOUNDARIES.goguryeo_early) },
        { id: "baekje", name: "백제", color: "#4A7A8C",
          coords: splitPeninsulaByInternalBoundary(p, INTERNAL_BOUNDARIES.baekje_silla_early, 38.5, 'west') },
        { id: "silla", name: "신라", color: "#C9A83E",
          coords: splitPeninsulaByInternalBoundary(p, INTERNAL_BOUNDARIES.baekje_silla_early, 38.5, 'east') },
      ]},
      { year: 450, polities: [
        { id: "goguryeo", name: "고구려", color: "#C25B3F",
          coords: clipPeninsulaByLat(p, 37.3, 'north', NORTH_BOUNDARIES.goguryeo_peak) },
        { id: "baekje", name: "백제", color: "#4A7A8C",
          coords: splitPeninsulaByInternalBoundary(p, INTERNAL_BOUNDARIES.baekje_silla_peak, 37.3, 'west') },
        { id: "silla", name: "신라", color: "#C9A83E",
          coords: splitPeninsulaByInternalBoundary(p, INTERNAL_BOUNDARIES.baekje_silla_peak, 37.3, 'east') },
      ]},
      { year: 700, polities: [
        { id: "unifiedsilla", name: "통일신라", color: "#C9A83E",
          coords: clipPeninsulaByLat(p, 38.9, 'south', null) },
        { id: "balhae", name: "발해", color: "#6B8E5A",
          coords: [
            [130.64, 42.30], [131.80, 43.50], [133.00, 44.20], [133.20, 43.20],
            [132.50, 41.50], [130.80, 40.50], [129.50, 40.00],
            [128.00, 39.50], [126.00, 39.20], [124.80, 39.60],
            [124.30, 40.20], [125.50, 41.00], [127.00, 42.00], [128.50, 42.80],
            [130.00, 43.00], [130.64, 42.30],
          ]},
      ]},
      { year: 1000, polities: [
        { id: "goryeo", name: "고려", color: "#7A5B3F",
          coords: [...p] },
      ]},
      { year: 1400, polities: [
        { id: "joseon", name: "조선", color: "#5A7A5A",
          coords: [...p] },
      ]},
      { year: 1800, polities: [
        { id: "joseon", name: "조선", color: "#5A7A5A",
          coords: [...p] },
      ]},
    ];
  },
};
