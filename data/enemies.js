// =====================================================================
// 적군 편성 데이터 (★ 임시 - 확정 적 리스트를 받으면 이 파일만 교체)
// ---------------------------------------------------------------------
// 1) 스테이지 번호별 고정 편성 (우선 적용)
//    window.ENEMY_FORMATIONS[스테이지번호] = [
//      { id: 'CHR_012', name: '검은 나방', boss: true, hp: 300, atk: 9 },
//      ...
//    ]
//    - id 는 data/characters.js 의 캐릭터 id. name/스탯을 생략하면 원본 값 × 스테이지 배율
//    - 배열 순서가 곧 적의 편성 순서(1번부터). boss:true 면 보스 배율 적용
//
// 2) 고정 편성이 없는 스테이지는 ENEMY_POOL + 마릿수 규칙으로 랜덤 생성한다.
// =====================================================================
window.ENEMY_FORMATIONS = {
  // 챕터 1 보스 (임시): 벨제버브 + 벌레 무리
  15: [
    { id: 'CHR_012', name: '들판의 폭군 벨제버브', boss: true },
    { id: 'CHR_011', name: '버그킹' },
    { id: 'CHR_019', name: '스웜 레이쓰' },
  ],
};

// 랜덤 편성 후보: 로스터 42종 전부 (안내자 CHR_901 제외)
window.ENEMY_POOL = window.CHARACTERS.map(function (c) { return c.id; });

// 일반/이벤트 스테이지의 랜덤 편성 마릿수: 스테이지 번호 구간별 [min, max]
window.ENEMY_COUNT_BY_STAGE = [
  { upTo: 4,  count: [1, 1] },
  { upTo: 7,  count: [1, 2] },
  { upTo: 10, count: [2, 2] },
  { upTo: 99, count: [2, 3] },
];

// 중간보스 / 보스 스테이지 마릿수 [min, max]
window.ENEMY_COUNT_BY_TYPE = { 중간보스: [3, 3], 보스: [3, 3] };

// 중간보스 랜덤 편성 시 1번 슬롯 후보 (탱커형)
window.MIDBOSS_POOL = ['CHR_033', 'CHR_034', 'CHR_023', 'CHR_026'];
