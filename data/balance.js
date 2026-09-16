// =====================================================================
// 밸런스 상수 - 기획서/원본 표에 없는 항목을 여기서 한 번에 조정
// (원본 표에서 온 판정 낱값은 data/rules.js 의 RULES 를 읽는다)
// =====================================================================
window.BALANCE = {
  // ---- 투지 (전투 기획서 p.6 플로우 + 원본 RULES.SP_*) ----
  FIGHT_START: 0,                                   // 스테이지 시작 시 투지
  FIGHT_MAX: window.RULES['RULES.SP_MAX'],          // 투지 최대치 (원본 6)
  FIGHT_GAIN: window.RULES['RULES.SP_GAIN_BASIC'],  // 일반기 사용 후 "투지 상승" 값 (원본 1)
  // 특수기 요구 투지는 기술 데이터(spCost)를 쓴다. 비어 있으면 아래 기본값
  SKILL_COST_DEFAULT: window.RULES['RULES.SP_COST_DEFAULT'],

  // ---- 자동 전투 행동 선택 ----
  AI: {
    basic2Chance: 0.35,   // 특수기를 못 쓸 때, 투지 비용이 있는 일반기2 를 (쓸 수 있다면) 고를 확률
  },

  // ---- 데미지 계산 (원본 rule.csv 값 + 프로토타입 보정) ----
  // 데미지 = (공격 능력치 + ATK_OFFSET) × COEF[속성][종류] × POWER_SCALE[위력단계]
  //          × 방어 경감 × 타입 상성 × 표식/처형 등 배율
  // 방어 경감 = SCALE / (SCALE + 방어 능력치 × DEF_WEIGHT)   (DEF_WEIGHT 는 프로토타입 임시값)
  DAMAGE: {
    DEF_WEIGHT: 6,
    MIN_DAMAGE: 1,
    useTypeAdvantage: true,   // 육 > 공 > 해 > 육 (RULES.TYPE_BEATS / ADV_MULT / DIS_MULT)
  },

  // ---- 역할군 효과 ----
  // 전투 기획서 p.8 의 5종 + 원본 역할군 설명(추격자/치유자)을 따른 임시 효과 2종
  ROLE: {
    보호자: { shieldRate: 0.10 },                 // 스테이지 시작 시 최대 체력의 10% 보호막
    돌격자: { healRate: 0.05 },                   // 적 처치 시 현재 체력의 5% 회복
    결전자: { turn: 8, statBonus: 2 },            // 턴 8 이상 진행 시 공격/방어/마법 +2 포인트 (임시)
    교란자: { dodgeRate: 0.15 },                  // 15% 확률로 공격 회피
    암살자: {},                                   // 편성 순서가 가장 낮은 적 우선 공격 (로직 내장)
    추격자: { executeBonus: 0.3 },                // 체력 비율이 가장 낮은 적 우선 공격, 잃은 체력에 비례해 최대 +30% (임시)
    치유자: { healRate: 0.05 },                   // 턴 종료 시 체력 비율이 가장 낮은 아군을 최대 체력의 5% 회복 (임시)
  },

  // ---- 스테이지별 적 능력치 배율 (임시) ----
  ENEMY: {
    baseMult: 0.85,          // 적 기본 배율 (체력·공격·마법)
    stageGrowth: 0.035,      // 스테이지 번호당 +3.5%
    midbossMult: { hp: 1.8, atk: 1.15 },   // 중간보스(1번 슬롯)에만 적용
    bossMult:    { hp: 3.0, atk: 1.3 },    // 보스(boss:true)에만 적용
  },

  // ---- 골드 (정비 화면 기획서) ----
  GOLD: {
    start: 100,
    reward: { 일반: 100, 이벤트: 100, 스토리: 50, 중간보스: 200, 보스: 300 },
    revive: 50,
    reviveHpRate: 0.5,
    characterPrice: [100, 150, 200],
    shopSlots: 4,
    reroll: 10,
  },

  // ---- 이벤트 하위 효과 (임시) ----
  EVENT: {
    이로운: { healRate: 0.30 },
    해로운: { damageRate: 0.15 },
    도박:   { betRate: 0.5, winChance: 0.5, winMult: 2 },
  },

  // ---- 연출 속도 (ms) ----
  ANIM: { orderShow: 700, attack: 520, hit: 260, death: 400, turnGap: 350 },
};
