import type { HistoryDataset } from '../types/history';

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
};

export default romeHistory;
