import type { HistoryDataset } from '../types/history';

const koreaHistory: HistoryDataset = {
  id: 'korea-ts',
  label: '한국사',
  focus: { lng: 127.5, lat: 37.5 },
  range: [-2333, 1945],
  eras: [
    { id: 'gojoseon',      label: '고조선',        start: -2333, end: -108,  color: '#E8E2D5' },
    { id: 'samhan',        label: '원삼국',         start: -108,  end:   57,  color: '#E0DAC8' },
    { id: 'threekingdoms', label: '삼국시대',       start: 57,    end:  676,  color: '#D6CFB8' },
    { id: 'unifiedsilla',  label: '통일신라/발해',  start: 676,   end:  935,  color: '#CEC5A6' },
    { id: 'goryeo',        label: '고려',           start: 918,   end: 1392,  color: '#C4B995' },
    { id: 'joseon',        label: '조선',           start: 1392,  end: 1897,  color: '#B9AC83' },
    { id: 'daehan',        label: '대한제국',       start: 1897,  end: 1945,  color: '#AD9E72' },
  ],
  events: [
    {
      id: 'kr_gojoseon_founding', year: -2333,
      label: '고조선 건국', lat: 39.0, lng: 125.7, era: 'gojoseon',
      summary: '단군왕검이 아사달에 도읍을 정하고 고조선을 건국. 한국사 최초의 고대 국가.',
      tags: ['건국'], causes: [], effects: ['kr_wiman_joseon'],
    },
    {
      id: 'kr_wiman_joseon', year: -194,
      label: '위만조선 성립', lat: 39.0, lng: 125.7, era: 'gojoseon',
      summary: '연나라에서 망명한 위만이 준왕을 몰아내고 왕이 됨. 철기 문화 본격 보급.',
      tags: ['정변', '철기'], causes: ['kr_gojoseon_founding'], effects: ['kr_han_commanderies'],
    },
    {
      id: 'kr_han_commanderies', year: -108,
      label: '한사군 설치', lat: 39.0, lng: 125.7, era: 'gojoseon',
      summary: '한 무제의 침공으로 고조선 멸망. 낙랑·현도·임둔·진번 4군 설치.',
      tags: ['전쟁', '멸망'], causes: ['kr_wiman_joseon'], effects: ['kr_goguryeo_founding'],
    },
    {
      id: 'kr_silla_founding', year: -57,
      label: '신라 건국', lat: 35.85, lng: 129.22, era: 'samhan',
      summary: '박혁거세가 서라벌(경주)에 사로국 건국. 후에 신라로 발전.',
      tags: ['건국'], causes: [], effects: ['kr_silla_unification'],
    },
    {
      id: 'kr_goguryeo_founding', year: -37,
      label: '고구려 건국', lat: 41.1, lng: 126.4, era: 'samhan',
      summary: '주몽(동명성왕)이 졸본에 고구려를 건국. 이후 동북아 최강국으로 성장.',
      tags: ['건국'], causes: ['kr_han_commanderies'], effects: ['kr_gwanggaeto'],
    },
    {
      id: 'kr_baekje_founding', year: -18,
      label: '백제 건국', lat: 37.5, lng: 127.0, era: 'samhan',
      summary: '온조가 위례성(한강 유역)에 백제를 건국.',
      tags: ['건국'], causes: [], effects: [],
    },
    {
      id: 'kr_goguryeo_buddhism', year: 372,
      label: '고구려 불교 공인', lat: 39.02, lng: 125.75, era: 'threekingdoms',
      summary: '소수림왕이 전진으로부터 불교를 수용. 한반도 불교 전래의 시작.',
      tags: ['종교', '문화'], causes: [], effects: [],
    },
    {
      id: 'kr_gwanggaeto', year: 391,
      label: '광개토대왕 즉위', lat: 41.1, lng: 126.4, era: 'threekingdoms',
      summary: '만주와 한반도 중부까지 영토를 크게 확장. 고구려 최전성기.',
      tags: ['정복', '전성기'], causes: ['kr_goguryeo_founding'], effects: ['kr_jangsu_capital'],
    },
    {
      id: 'kr_jangsu_capital', year: 427,
      label: '장수왕 평양 천도', lat: 39.02, lng: 125.75, era: 'threekingdoms',
      summary: '장수왕이 수도를 국내성에서 평양으로 옮기며 남진정책 추진.',
      tags: ['천도', '정책'], causes: ['kr_gwanggaeto'], effects: [],
    },
    {
      id: 'kr_silla_buddhism', year: 527,
      label: '신라 불교 공인', lat: 35.85, lng: 129.22, era: 'threekingdoms',
      summary: '이차돈의 순교를 계기로 법흥왕이 불교 공인. 왕권 강화의 이념적 기반.',
      tags: ['종교'], causes: [], effects: [],
    },
    {
      id: 'kr_silla_unification', year: 676,
      label: '신라의 삼국통일', lat: 35.85, lng: 129.22, era: 'unifiedsilla',
      summary: '나당전쟁에서 당을 축출하고 대동강~원산만 이남을 통일.',
      tags: ['전쟁', '통일'], causes: ['kr_silla_founding'], effects: [],
    },
    {
      id: 'kr_balhae_founding', year: 698,
      label: '발해 건국', lat: 43.85, lng: 129.5, era: 'unifiedsilla',
      summary: '대조영이 동모산에서 발해를 건국. 남북국 시대 시작.',
      tags: ['건국'], causes: [], effects: [],
    },
    {
      id: 'kr_goryeo_founding', year: 918,
      label: '고려 건국', lat: 37.97, lng: 126.55, era: 'goryeo',
      summary: '왕건이 송악에 고려 건국. 936년 후삼국 통일.',
      tags: ['건국'], causes: [], effects: [],
    },
    {
      id: 'kr_joseon_founding', year: 1392,
      label: '조선 건국', lat: 37.57, lng: 126.98, era: 'joseon',
      summary: '이성계가 고려를 무너뜨리고 조선 건국. 한양 천도.',
      tags: ['건국'], causes: [], effects: [],
    },
    {
      id: 'kr_hangul', year: 1446,
      label: '훈민정음 반포', lat: 37.57, lng: 126.98, era: 'joseon',
      summary: '세종대왕이 훈민정음 창제·반포. 독자적 문자 체계 확립.',
      tags: ['문화'], causes: [], effects: [],
    },
    {
      id: 'kr_imjin_war', year: 1592,
      label: '임진왜란', lat: 35.1, lng: 129.0, era: 'joseon',
      summary: '도요토미 히데요시의 조선 침공. 이순신의 해전 활약, 7년 전쟁.',
      tags: ['전쟁'], causes: [], effects: [],
    },
    {
      id: 'kr_daehan_empire', year: 1897,
      label: '대한제국 선포', lat: 37.57, lng: 126.98, era: 'daehan',
      summary: '고종이 황제 즉위, 대한제국 선포. 자주 독립국 지위 천명.',
      tags: ['건국'], causes: [], effects: [],
    },
  ],
};

export default koreaHistory;
