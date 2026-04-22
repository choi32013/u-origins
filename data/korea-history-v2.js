// 한국사 샘플 데이터
// 확장 구조: eras / events / territories / layers
// 영토는 data/korea-coastline.js 의 실제 해안선을 이용해 동적으로 구성 (아래 buildTerritory 참고)

window.HISTORY_DATA = window.HISTORY_DATA || {};

// 해안선에서 특정 위도 구간만 추출 (lat1 ~ lat2, 동해안 한정)
// 영토 폴리곤 조립 헬퍼
function _buildKoreanPolygon(northBoundaryKey, southLatLimit) {
  const coast = window.KOREA_COASTLINE || [];
  const northBoundary = window.KOREA_NORTH_BOUNDARIES
    ? window.KOREA_NORTH_BOUNDARIES[northBoundaryKey]
    : null;

  // southLatLimit 이 주어지면 해안선 중 그 위도 이북만 사용
  const useCoast = southLatLimit != null
    ? coast.filter(([lng, lat]) => lat >= southLatLimit)
    : coast.slice();

  if (!northBoundary) return useCoast;

  // 해안선의 동해안 북쪽 끝은 배열 시작점(~130.64, 42.30),
  // 서해안 북쪽 끝은 배열 마지막쯤(~124.55, 40.05).
  // northBoundary 가 그 사이를 연결함 → 동해안 시작점 이후 북쪽 구간은 건너뛰고
  // 동해안(남행) + 남해안 + 서해안(북행) + northBoundary 로 폐합
  const coastIndexOfNorthBoundaryStart = 0; // 동해안 북쪽 끝
  const mainCoast = useCoast; // 전체 남행 → 서행 해안선
  return [...mainCoast, ...northBoundary];
}

window.HISTORY_DATA.korea = {
  id: "korea",
  label: "한국사",
  range: [-2333, 1910],
  focus: { lat: 37.5, lng: 127.5, zoom: 5 },

  eras: [
    { id: "gojoseon",  label: "고조선",   start: -2333, end: -108,  color: "#E8E2D5" },
    { id: "samhan",    label: "원삼국",   start: -108,  end:  57,   color: "#E0DAC8" },
    { id: "threekingdoms", label: "삼국시대", start: 57,    end:  676,  color: "#D6CFB8" },
    { id: "unifiedsilla",  label: "통일신라/발해", start: 676, end: 935, color: "#CEC5A6" },
    { id: "goryeo",    label: "고려",     start: 918,   end: 1392, color: "#C4B995" },
    { id: "joseon",    label: "조선",     start: 1392,  end: 1897, color: "#B9AC83" },
    { id: "daehan",    label: "대한제국", start: 1897,  end: 1910, color: "#AD9E72" },
  ],

  events: [
    { id: "e_gojoseon_founding", year: -2333, label: "고조선 건국", lat: 39.0, lng: 125.7, era: "gojoseon",
      summary: "단군왕검이 아사달에 도읍을 정하고 고조선을 건국했다고 전해진다. 한국사 최초의 국가.",
      tags: ["건국","신화"], causes: [], effects: ["e_wiman"], sourceUrl: "https://www.youtube.com/" },
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

  // === 영토: 실제 해안선 기반 ===
  // 각 스냅샷의 coords 는 KOREA_COASTLINE + 시대별 북쪽 경계선을 조합하여 구성
  // getTerritoriesForYear(year) 로 접근 (lazy build)
  get territoriesByYear() {
    const coast = window.KOREA_COASTLINE || [];
    const nb = window.KOREA_NORTH_BOUNDARIES || {};

    // 공통 남부 해안선 (북쪽 끝 제외한 본체)
    const southCoast = coast; // 이미 남행→서행 순으로 정의됨

    // 국가별 폴리곤 = 해안선(특정 남쪽 위도 이북만) + 북쪽 경계선
    const clipByLat = (minLat) =>
      coast.filter(([lng, lat]) => lat >= minLat);

    return [
      // 고조선 전성기
      { year: -500, polities: [
        { id: "gojoseon", name: "고조선", color: "#8B6F47",
          coords: [...clipByLat(38.0), ...(nb.gojoseon_peak || [])] },
      ]},
      // 삼국 초기 (100년)
      { year: 100, polities: [
        { id: "goguryeo", name: "고구려", color: "#C25B3F",
          coords: [...clipByLat(39.0), ...(nb.goguryeo_early || [])] },
        { id: "baekje", name: "백제", color: "#4A7A8C",
          coords: [
            [126.65,37.95],[126.50,37.30],[126.35,37.55],[126.45,37.75],
            [126.50,36.80],[126.25,36.55],[126.40,36.35],[126.55,36.10],
            [126.60,35.75],[126.55,35.40],[126.45,35.10],[126.20,34.90],
            [126.35,34.75],[126.25,34.60],[126.30,34.40],[126.45,34.35],
            [126.60,34.45],[126.85,34.55],[127.10,34.60],
            // 내부 경계(소백산맥)
            [127.50,34.80],[127.70,35.20],[127.90,35.80],[127.80,36.40],
            [127.30,37.00],[126.80,37.50],[126.65,37.95],
          ] },
        { id: "silla", name: "신라", color: "#C9A83E",
          coords: [
            [129.30,35.10],[129.50,35.20],[129.35,35.40],[129.40,35.70],
            [129.45,36.05],[129.45,36.45],[129.30,36.75],[129.10,37.15],
            [128.75,37.40],[128.50,37.65],[128.45,37.95],
            // 내부 경계(소백산맥) - 백제와 공유
            [126.80,37.50],[127.30,37.00],[127.80,36.40],[127.90,35.80],
            [127.70,35.20],[127.50,34.80],[127.35,34.65],[127.55,34.75],
            [127.80,34.75],[128.05,34.80],[128.40,34.90],[128.65,34.85],
            [128.90,34.95],[129.10,35.05],[129.30,35.10],
          ] },
      ]},
      // 삼국 전성기 (450년) - 고구려가 한강 이북까지
      { year: 450, polities: [
        { id: "goguryeo", name: "고구려", color: "#C25B3F",
          coords: [...clipByLat(37.1), ...(nb.goguryeo_peak || [])] },
        { id: "baekje", name: "백제", color: "#4A7A8C",
          coords: [
            [126.50,37.30],[126.35,37.55],[126.45,37.25],[126.50,36.80],
            [126.25,36.55],[126.40,36.35],[126.55,36.10],[126.60,35.75],
            [126.55,35.40],[126.45,35.10],[126.20,34.90],[126.35,34.75],
            [126.45,34.35],[126.85,34.55],[127.10,34.60],
            [127.40,34.80],[127.60,35.30],[127.80,35.90],[127.70,36.50],
            [127.30,37.20],[126.50,37.30],
          ] },
        { id: "silla", name: "신라", color: "#C9A83E",
          coords: [
            [128.45,37.00],[128.75,37.10],[129.10,37.15],[129.30,36.75],
            [129.45,36.45],[129.45,36.05],[129.40,35.70],[129.35,35.40],
            [129.50,35.20],[129.30,35.10],[129.10,35.05],[128.90,34.95],
            [128.65,34.85],[128.40,34.90],[128.05,34.80],[127.80,34.75],
            [127.60,35.30],[127.80,35.90],[127.70,36.50],[127.30,37.20],
            [128.00,37.10],[128.45,37.00],
          ] },
      ]},
      // 통일신라 + 발해 (700년)
      { year: 700, polities: [
        { id: "unifiedsilla", name: "통일신라", color: "#C9A83E",
          coords: [...clipByLat(34.3), ...(nb.unified_silla || [])] },
        { id: "balhae", name: "발해", color: "#6B8E5A",
          coords: nb.balhae || [] },
      ]},
      // 고려 (1000년)
      { year: 1000, polities: [
        { id: "goryeo", name: "고려", color: "#7A5B3F",
          coords: [...clipByLat(34.3), ...(nb.goryeo || [])] },
      ]},
      // 조선 (1400, 1800년) - 현대 국경과 거의 동일
      { year: 1400, polities: [
        { id: "joseon", name: "조선", color: "#5A7A5A",
          coords: coast.slice() },
      ]},
      { year: 1800, polities: [
        { id: "joseon", name: "조선", color: "#5A7A5A",
          coords: coast.slice() },
      ]},
    ];
  },
};
