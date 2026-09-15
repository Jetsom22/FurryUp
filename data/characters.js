// =====================================================================
// 캐릭터 데이터 (임시값)
// ---------------------------------------------------------------------
// - id       : 리소스 파일명 (assets/characters/{id}_ST_F.png)
// - name     : 임시 표시명. 확정 명칭이 나오면 교체
// - role     : 암살자 / 보호자 / 돌격자 / 결전자 / 교란자  (전투 기획서 p.8)
// - hp/atk/def/spd : 임시 능력치. 밸런스 확정 시 이 파일만 수정
// - priority : 우선도 (전투 기획서 p.7, 행동 순서 1순위). 기본 0
// - locked   : 게임 첫 시작 시 잠금 여부 (전투 기획서 p.3 "42마리 중 12마리 잠금")
//              리소스 25종 기준으로 7종을 잠금 처리
// - skill    : 스킬 설명(표시용). 실제 계산은 balance.js SKILL_MULT 사용
// =====================================================================
window.CHARACTERS = [
  { id: 'CHR_001', name: '아홀로',   role: '보호자', hp: 150, atk: 16, def: 10, spd: 6,  priority: 0, locked: false, skill: '정화의 물결' },
  { id: 'CHR_003', name: '브로',     role: '돌격자', hp: 140, atk: 26, def: 8,  spd: 7,  priority: 0, locked: false, skill: '해일 주먹' },
  { id: 'CHR_005', name: '니들',     role: '암살자', hp: 95,  atk: 30, def: 4,  spd: 15, priority: 0, locked: false, skill: '급소 찌르기' },
  { id: 'CHR_006', name: '그레이팽', role: '결전자', hp: 120, atk: 22, def: 8,  spd: 9,  priority: 0, locked: false, skill: '늑대의 검' },
  { id: 'CHR_007', name: '클로',     role: '돌격자', hp: 130, atk: 24, def: 9,  spd: 8,  priority: 0, locked: false, skill: '집게 강타' },
  { id: 'CHR_012', name: '모스',     role: '교란자', hp: 105, atk: 21, def: 6,  spd: 12, priority: 0, locked: false, skill: '인분 흩뿌리기' },
  { id: 'CHR_013', name: '스노우',   role: '암살자', hp: 100, atk: 28, def: 5,  spd: 13, priority: 0, locked: false, skill: '설야의 송곳니' },
  { id: 'CHR_014', name: '세레나',   role: '보호자', hp: 135, atk: 17, def: 11, spd: 7,  priority: 0, locked: false, skill: '물의 장막' },
  { id: 'CHR_015', name: '샤크',     role: '돌격자', hp: 145, atk: 25, def: 7,  spd: 10, priority: 0, locked: false, skill: '상어 돌진' },
  { id: 'CHR_018', name: '이글',     role: '결전자', hp: 115, atk: 23, def: 7,  spd: 11, priority: 0, locked: true,  skill: '창공 강하' },
  { id: 'CHR_020', name: '포스티',   role: '교란자', hp: 100, atk: 20, def: 6,  spd: 14, priority: 0, locked: false, skill: '깃털 폭풍' },
  { id: 'CHR_021', name: '스콜피',   role: '암살자', hp: 105, atk: 29, def: 6,  spd: 12, priority: 0, locked: true,  skill: '맹독 침' },
  { id: 'CHR_022', name: '미스트',   role: '보호자', hp: 125, atk: 18, def: 9,  spd: 8,  priority: 0, locked: false, skill: '안개 치유' },
  { id: 'CHR_024', name: '레이븐',   role: '결전자', hp: 118, atk: 24, def: 7,  spd: 10, priority: 0, locked: true,  skill: '흑익 참격' },
  { id: 'CHR_025', name: '캡틴',     role: '결전자', hp: 125, atk: 22, def: 9,  spd: 9,  priority: 0, locked: false, skill: '함포 사격' },
  { id: 'CHR_026', name: '드레이크', role: '돌격자', hp: 170, atk: 28, def: 12, spd: 5,  priority: 0, locked: true,  skill: '용의 숨결' },
  { id: 'CHR_027', name: '웹스터',   role: '교란자', hp: 110, atk: 21, def: 7,  spd: 11, priority: 0, locked: false, skill: '거미줄 덫' },
  { id: 'CHR_028', name: '유키',     role: '보호자', hp: 130, atk: 18, def: 10, spd: 8,  priority: 0, locked: false, skill: '설화의 기도' },
  { id: 'CHR_030', name: '울프',     role: '돌격자', hp: 140, atk: 25, def: 8,  spd: 9,  priority: 0, locked: false, skill: '발톱 난무' },
  { id: 'CHR_031', name: '펜리르',   role: '결전자', hp: 135, atk: 26, def: 9,  spd: 8,  priority: 0, locked: true,  skill: '달빛 포효' },
  { id: 'CHR_032', name: '크로우',   role: '암살자', hp: 98,  atk: 31, def: 4,  spd: 14, priority: 0, locked: false, skill: '그림자 베기' },
  { id: 'CHR_034', name: '레오',     role: '돌격자', hp: 160, atk: 27, def: 10, spd: 6,  priority: 0, locked: true,  skill: '사자후' },
  { id: 'CHR_039', name: '너츠',     role: '교란자', hp: 108, atk: 20, def: 6,  spd: 13, priority: 0, locked: false, skill: '도토리 폭탄' },
  { id: 'CHR_042', name: '나비',     role: '교란자', hp: 102, atk: 19, def: 5,  spd: 15, priority: 0, locked: false, skill: '환영 날갯짓' },
  { id: 'CHR_901', name: '램',       role: '보호자', hp: 140, atk: 17, def: 12, spd: 6,  priority: 0, locked: true,  skill: '양털 방벽' },
];

window.CHARACTER_BY_ID = {};
window.CHARACTERS.forEach(function (c) { window.CHARACTER_BY_ID[c.id] = c; });
