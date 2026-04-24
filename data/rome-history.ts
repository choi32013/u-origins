import type { HistoryDataset, TerritorySnapshot } from '../types/history';

// Approximate polygons — [lng, lat] pairs, clockwise.
// These are simplified outlines; accuracy ± ~50km is acceptable for historical visualization.

// -700: Latium / early Kingdom (central Italy only)
const LATIUM: [number, number][] = [
  [12.5, 42.5], [13.5, 42.2], [14.5, 41.0], [15.0, 39.8], [14.0, 38.0],
  [11.5, 38.0], [9.5, 40.0], [8.5, 42.0], [9.5, 44.0], [11.0, 44.2],
  [12.5, 44.5], [13.5, 43.5], [12.5, 42.5],
];

// -200: Italian peninsula (Rome controls all Italy after Punic Wars begin)
const ITALY: [number, number][] = [
  [7.0, 44.0], [8.0, 46.0], [10.0, 47.5], [12.5, 47.0], [13.5, 46.5],
  [15.5, 45.8], [18.0, 40.5], [16.0, 38.0], [15.5, 37.0], [13.5, 37.5],
  [12.5, 37.5], [11.0, 37.8], [8.0, 38.0], [7.5, 40.0], [7.0, 42.0],
  [7.0, 44.0],
];

// -100: Italian peninsula + Sicily, Sardinia, Corsica, parts of Spain + N Africa coast
const LATE_REPUBLIC: [number, number][] = [
  [-6.0, 36.0], [-5.0, 37.5], [-7.0, 40.0], [-8.0, 43.0], [-5.0, 44.0],
  [-2.0, 44.5], [3.0, 43.0], [5.0, 43.5], [7.0, 43.5],
  [8.0, 46.0], [10.5, 47.5], [13.0, 47.2], [15.5, 45.8],
  [18.0, 40.5], [16.0, 37.5], [15.0, 37.0], [12.0, 37.5],
  [12.0, 33.0], [10.0, 33.0], [8.0, 33.5], [5.0, 33.0], [0.0, 33.0],
  [-3.0, 34.0], [-5.5, 35.8], [-5.0, 37.0], [-6.0, 36.0],
];

// 117 CE: Peak empire — Trajan's expansion (largest extent)
const PEAK_EMPIRE: [number, number][] = [
  [-8.0, 42.0], [-4.0, 44.5], [-2.0, 48.5], [1.5, 51.0], [4.5, 53.0],
  [6.5, 52.5], [8.5, 51.5], [10.0, 53.5], [12.5, 55.5], [14.0, 54.0],
  [18.0, 52.0], [22.0, 48.5], [24.5, 46.5], [28.0, 46.0], [30.5, 44.0],
  [32.0, 42.0], [36.5, 36.5], [40.0, 37.5], [44.0, 36.0], [44.5, 32.0],
  [42.0, 28.0], [37.0, 24.0], [32.0, 23.0], [28.0, 24.0], [23.0, 28.5],
  [17.0, 28.5], [12.0, 28.0], [6.0, 28.0], [0.0, 29.5], [-4.0, 31.0],
  [-6.0, 33.0], [-6.0, 36.0], [-5.0, 37.0], [-8.0, 40.0], [-8.0, 42.0],
];

// 400 CE: Western Empire shrinking; Eastern intact
const LATE_EMPIRE_WEST: [number, number][] = [
  [-8.0, 42.0], [-4.0, 44.5], [-2.0, 48.5], [1.5, 51.0], [4.5, 53.0],
  [6.5, 52.5], [8.5, 50.5], [10.0, 48.0], [13.0, 48.0], [15.0, 48.5],
  [18.0, 46.0], [20.0, 44.0], [22.0, 43.0], [24.5, 43.5],
  [28.5, 42.0], [30.5, 38.5], [28.0, 36.0], [24.0, 36.5],
  [18.0, 38.0], [15.0, 37.5], [12.0, 37.5], [9.0, 33.0],
  [5.0, 33.0], [0.0, 33.0], [-3.0, 34.0], [-5.5, 35.8], [-5.0, 37.0],
  [-6.0, 36.0], [-8.0, 40.0], [-8.0, 42.0],
];

const ROME_TERRITORIES: TerritorySnapshot[] = [
  {
    year: -700,
    polities: [{ id: 'latium', name: '왕정 로마', color: '#8B6F47', coords: LATIUM }],
  },
  {
    year: -500,
    polities: [{ id: 'early_republic', name: '공화정 로마 (초기)', color: '#7A8C6B', coords: LATIUM }],
  },
  {
    year: -200,
    polities: [{ id: 'republic', name: '로마 공화국', color: '#6B8C7A', coords: ITALY }],
  },
  {
    year: -100,
    polities: [{ id: 'late_republic', name: '로마 공화국 (후기)', color: '#5A7A8C', coords: LATE_REPUBLIC }],
  },
  {
    year: 0,
    polities: [{ id: 'early_empire', name: '로마 제국 (아우구스투스)', color: '#C25B3F', coords: LATE_REPUBLIC }],
  },
  {
    year: 117,
    polities: [{ id: 'peak_empire', name: '로마 제국 (전성기)', color: '#C25B3F', coords: PEAK_EMPIRE }],
  },
  {
    year: 300,
    polities: [{ id: 'late_empire', name: '로마 제국 (후기)', color: '#A0483A', coords: LATE_EMPIRE_WEST }],
  },
  {
    year: 400,
    polities: [{ id: 'declining_empire', name: '로마 제국 (쇠퇴기)', color: '#8B3A30', coords: LATE_EMPIRE_WEST }],
  },
];

const romeHistory: HistoryDataset = {
  id: 'rome',
  label: '로마사',
  focus: { lng: 12.5, lat: 41.9 },
  range: [-753, 476],
  eras: [
    { id: 'kingdom',  label: '왕정',   start: -753, end: -509, color: '#E8E2D5' },
    { id: 'republic', label: '공화정', start: -509, end:  -27, color: '#D6CFB8' },
    { id: 'empire',   label: '제정',   start:  -27, end:  476, color: '#C4B995' },
  ],
  events: [
    {
      id: 'ro_founding', year: -753,
      label: '로마 건국', lat: 41.9, lng: 12.5, era: 'kingdom',
      summary: '로물루스가 티베르강 유역에 로마를 건국. 왕정 시대 시작.',
      tags: ['건국'], causes: [], effects: ['ro_republic'],
    },
    {
      id: 'ro_republic', year: -509,
      label: '공화정 수립', lat: 41.9, lng: 12.5, era: 'republic',
      summary: '왕정 폐지 후 집정관 2인 체제의 공화정 시작. 원로원과 민회 중심 통치.',
      tags: ['정치'], causes: ['ro_founding'], effects: ['ro_punic_wars'],
    },
    {
      id: 'ro_punic_wars', year: -264,
      label: '포에니 전쟁', lat: 36.8, lng: 10.2, era: 'republic',
      summary: '카르타고와 3차례에 걸친 전쟁. 로마가 지중해 패권 장악.',
      tags: ['전쟁'], causes: ['ro_republic'], effects: ['ro_julius_caesar'],
    },
    {
      id: 'ro_julius_caesar', year: -49,
      label: '율리우스 카이사르 집권', lat: 41.9, lng: 12.5, era: 'republic',
      summary: '루비콘 강 도하로 내전 시작. 종신 독재관 취임 후 기원전 44년 암살.',
      tags: ['정치', '전쟁'], causes: ['ro_punic_wars'], effects: ['ro_augustus'],
    },
    {
      id: 'ro_augustus', year: -27,
      label: '아우구스투스 황제 즉위', lat: 41.9, lng: 12.5, era: 'empire',
      summary: '옥타비아누스가 아우구스투스 칭호 수여. 제정 시대 개막.',
      tags: ['건국', '황제'], causes: ['ro_julius_caesar'], effects: ['ro_christianity'],
    },
    {
      id: 'ro_christianity', year: 313,
      label: '밀라노 칙령', lat: 45.5, lng: 9.2, era: 'empire',
      summary: '콘스탄티누스 황제의 기독교 공인. 이후 로마 국교화의 기반.',
      tags: ['종교'], causes: ['ro_augustus'], effects: ['ro_empire_split'],
    },
    {
      id: 'ro_empire_split', year: 395,
      label: '로마 제국 분열', lat: 41.9, lng: 12.5, era: 'empire',
      summary: '테오도시우스 황제 사후 동·서 로마로 영구 분열.',
      tags: ['정치'], causes: ['ro_christianity'], effects: ['ro_western_fall'],
    },
    {
      id: 'ro_western_fall', year: 476,
      label: '서로마 제국 멸망', lat: 41.9, lng: 12.5, era: 'empire',
      summary: '오도아케르에 의해 마지막 황제 로물루스 아우구스툴루스 폐위.',
      tags: ['멸망'], causes: ['ro_empire_split'], effects: [],
    },
  ],
  territoriesByYear: ROME_TERRITORIES,
};

export default romeHistory;
