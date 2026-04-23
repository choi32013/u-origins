// Korea territory builder — Real coastline (korea-peninsula.json) + historical boundaries
//
// Ring structure of korea-peninsula.json (clockwise):
//   idx 0        : 38°N east coast (start/end)
//   idx 0→128    : east coast going south (38°N → 34°N)
//   idx 128→322  : south coast + west SK coast going north (34°N → 37.8°N)
//   idx 322→440  : north border going NE through NK (37.8°N → Tumen 43°N apex)
//   idx 440→592  : NE coast going south back to 38°N
//
// Key pre-computed indices (see lib/buildKoreaTerritories.js analysis):
//   85  : south coast split point [127.48, 34.84]
//   322 : goguryeo_100CE south boundary W  [126.53, 37.77]
//   346 : goguryeo_100CE south boundary E  [128.28, 38.48]
//   351 : unified_silla north boundary E   [128.28, 38.75]
//   425 : Tumen river apex                 [129.93, 43.00]
//   576 : unified_silla north boundary W   [125.16, 38.63]

import peninsulaRing from '../data/korea-peninsula.json';

// ─── Historical north boundary lines (W→E) ──────────────────────────────────
// First point = west end, last point = east end. Coords: [lng, lat].

const NB = {
  // 고조선 전성기: 요동반도 포함
  gojoseon: [
    [124.55, 40.05], [123.0, 39.8], [121.5, 39.0], [121.0, 40.5],
    [122.0, 41.0], [123.5, 41.5], [124.0, 41.8], [125.0, 42.0],
    [127.5, 42.8], [129.5, 42.5], [130.64, 42.30],
  ],
  // 고구려 초기 (100CE): 압록강 중류
  goguryeo_early: [
    [124.55, 40.05], [124.8, 40.5], [125.5, 41.2],
    [126.8, 41.5], [128.5, 41.3], [129.75, 40.85],
  ],
  // 고구려 전성기 (450CE): 요하~만주
  goguryeo_peak: [
    [124.55, 40.05], [122.5, 42.0], [120.5, 40.0],
    [121.8, 39.3], [123.3, 39.1],
    [124.5, 42.8], [126.5, 43.2], [128.5, 43.3],
    [130.0, 43.0], [132.5, 42.5], [132.0, 41.0], [130.64, 42.30],
  ],
  // 통일신라: 대동강-원산만 (iW=576, iE=351)
  unified_silla: [
    [125.16, 38.63], [125.5, 38.9], [126.0, 38.8],
    [127.5, 38.7], [128.28, 38.75],
  ],
  // 고려: 압록강~두만강 (현대 국경과 거의 동일 → full ring)
  goryeo: null,
};

// Goguryeo south boundary (on-peninsula divide with Baekje+Silla)
// Used as the "closing" segment for Goguryeo territory polygon
const GOGURYEO_SOUTH = {
  // 100CE: 한강 이북~대동강 선
  v100: [
    [125.16, 38.63], [125.5, 38.4],
    [126.53, 37.77], [127.0, 37.5],
    [128.0, 38.0],   [128.28, 38.48],
  ],
  // 450CE: 한강 이남까지 남진
  v450: [
    [125.16, 38.63], [125.5, 38.0],
    [126.5, 37.2],   [127.5, 37.0],
    [128.0, 37.5],   [128.28, 38.48],
  ],
};

// Internal Baekje/Silla divide — N endpoint [128.85, 38.25] → S endpoint [127.5, 34.8]
const INTERNAL = {
  // 100CE: 소백산맥
  v100: [
    [128.85, 38.25], [128.5, 37.0], [128.0, 36.5],
    [127.8, 35.9],   [127.6, 35.3], [127.5, 34.8],
  ],
  // 450CE: 동쪽으로 이동
  v450: [
    [128.28, 38.48], [128.5, 37.5], [128.0, 36.8],
    [127.8, 35.9],   [127.5, 35.1], [127.4, 34.8],
  ],
};

// ─── Territory builders ──────────────────────────────────────────────────────

// Full peninsula ring (조선, 고려)
function fullPeninsula() {
  return peninsulaRing.slice();
}

// Southern peninsula up to a north boundary line
// ring[0..iE] + NB reversed (E→W) + ring[iW..]
// where NB[0]=westPt(≈ring[iW]), NB[last]=eastPt(≈ring[iE])
function southernPeninsula(iE, iW, nb) {
  return [
    ...peninsulaRing.slice(0, iE + 1),
    ...nb.slice().reverse(),
    ...peninsulaRing.slice(iW),
  ];
}

// Northern cap of peninsula from ring[iE] to ring[iW] + closing south boundary
// closingSB: [ring[iW]-area, ..., ring[iE]-area] going W→E
// (do NOT reverse: ring ends at iW, closingSB[0] matches iW and closes back to iE)
function northernCap(iE, iW, closingSB) {
  return [
    ...peninsulaRing.slice(iE, iW + 1),
    ...closingSB,
  ];
}

// Silla: east coast + south coast east half + internal boundary N (closed)
// ring[0..85] + INTERNAL reversed (S→N) [closes near ring[0]]
function sillaTerritory(internalBoundary) {
  const revInternal = internalBoundary.slice().reverse(); // S→N direction
  return [
    ...peninsulaRing.slice(0, 86),
    ...revInternal,
  ];
}

// Baekje: south coast west half + west coast + goguryeo south W-end + internal boundary (S direction)
// ring[85..322] + goguryeo_south_boundary_W_to_internal + internal (N→S)
function baekjeTerritory(iGoguryeoW, internalBoundary, goguryeoSouthBoundaryWE) {
  // ring[85..iGoguryeoW]: south coast split → west coast north → boundary W point
  // goguryeoSouthBoundary W→E (short segment from iGoguryeoW east to internal N end)
  // internalBoundary N→S
  return [
    ...peninsulaRing.slice(85, iGoguryeoW + 1),
    ...goguryeoSouthBoundaryWE,
    ...internalBoundary,
  ];
}

// ─── Balhae polygon (separate from peninsula, Manchuria east) ───────────────
const BALHAE_POLYGON = [
  [129.5, 40.3], [128.5, 39.0], [127.0, 38.8],
  [125.5, 38.7], [124.8, 38.9], [124.55, 40.05],
  [122.5, 42.0], [124.5, 42.8], [126.5, 43.2],
  [129.0, 43.5], [131.0, 43.2], [132.8, 43.8],
  [133.2, 43.0], [132.5, 41.8], [130.8, 40.8], [129.75, 40.85],
];

// ─── Gojoseon (simplified, extends beyond peninsula) ────────────────────────
const GOJOSEON_POLYGON = [
  [124.55, 40.05], [123.0, 39.8], [121.5, 39.0], [121.0, 40.5],
  [122.0, 41.0], [124.0, 41.8], [125.0, 42.0], [127.5, 42.8],
  [129.5, 42.5], [130.64, 42.30],
  // east coast south
  ...peninsulaRing.slice(0, 87),
  // west coast: close with simplified line
  [126.0, 36.5], [125.0, 37.5], [124.55, 40.05],
];

// ─── Pre-compute all territory snapshots ────────────────────────────────────
export const KOREA_TERRITORIES = [
  // -500: 고조선
  {
    year: -500,
    polities: [
      { id: 'gojoseon', name: '고조선', color: '#8B6F47', coords: GOJOSEON_POLYGON },
    ],
  },

  // 100CE: 삼국 초기
  {
    year: 100,
    polities: [
      {
        id: 'goguryeo', name: '고구려', color: '#C25B3F',
        // ring[346..576] = northern cap; GOGURYEO_SOUTH.v100 closes it (ring[576]→ring[346])
        coords: northernCap(346, 576, GOGURYEO_SOUTH.v100),
      },
      {
        id: 'baekje', name: '백제', color: '#4A7A8C',
        // ring[85..322]: south coast → west coast
        // north boundary W→E: ring[322] → [128.85, 38.25]
        // INTERNAL.v100 N→S: [128.85, 38.25] → [127.5, 34.8] ≈ ring[85]
        coords: baekjeTerritory(
          322,
          INTERNAL.v100,
          [[126.53, 37.77], [127.5, 38.0], [128.5, 38.2], [128.85, 38.25]]
        ),
      },
      {
        id: 'silla', name: '신라', color: '#C9A83E',
        coords: sillaTerritory(INTERNAL.v100),
      },
    ],
  },

  // 450CE: 삼국 전성기 (고구려 남진)
  {
    year: 450,
    polities: [
      {
        id: 'goguryeo', name: '고구려', color: '#C25B3F',
        coords: northernCap(346, 576, GOGURYEO_SOUTH.v450),
      },
      {
        id: 'baekje', name: '백제', color: '#4A7A8C',
        coords: baekjeTerritory(
          322,
          INTERNAL.v450,
          [[126.53, 37.77], [127.0, 37.5], [128.0, 37.8], [128.28, 38.48]]
        ),
      },
      {
        id: 'silla', name: '신라', color: '#C9A83E',
        coords: sillaTerritory(INTERNAL.v450),
      },
    ],
  },

  // 700CE: 통일신라 + 발해
  {
    year: 700,
    polities: [
      {
        id: 'unifiedsilla', name: '통일신라', color: '#C9A83E',
        // ring[0..351] + NB.unified_silla reversed (E→W) + ring[576..]
        coords: southernPeninsula(351, 576, NB.unified_silla),
      },
      {
        id: 'balhae', name: '발해', color: '#6B8E5A',
        coords: BALHAE_POLYGON,
      },
    ],
  },

  // 1000CE: 고려 (전반도)
  {
    year: 1000,
    polities: [
      { id: 'goryeo', name: '고려', color: '#7A5B3F', coords: fullPeninsula() },
    ],
  },

  // 1400CE: 조선
  {
    year: 1400,
    polities: [
      { id: 'joseon', name: '조선', color: '#5A7A5A', coords: fullPeninsula() },
    ],
  },

  // 1800CE: 조선 (후기)
  {
    year: 1800,
    polities: [
      { id: 'joseon', name: '조선', color: '#5A7A5A', coords: fullPeninsula() },
    ],
  },
];
