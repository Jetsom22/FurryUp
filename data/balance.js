// =====================================================================
// 밸런스 상수 - 전투 규칙은 전투 실험실 α-02 (kimkumo.github.io/FurryUp-BattleSimulator) 값을 따른다.
// 공식이 바뀌면 RULES 블록만 고치면 된다.
// =====================================================================
window.BALANCE = {
  // ---- 전투 규칙 세트 α-02 (실험실 settings 와 동일한 이름) ----
  RULES: {
    hpMultiplier: 10,   // 최대 HP = 체력 스탯 × 10
    attackFactor: 2,    // 기본 피해 = max(minDamage, floor(공격력 × attackFactor − 방어력))
    minDamage: 1,
    skillDamage: 2,     // 문서 미정 캐릭터의 공통 스킬: 고정 피해 (단일 대상)
    skillCost: 3,       // 문서 미정 캐릭터의 공통 스킬 투지 요구량
    gritGain: 1,        // 모든 행동 종료 후 투지 +1
    dodgeRate: 15,      // 교란자 회피 확률 (%)
    maxTurns: 100,      // 이 턴을 넘기면 무승부 (프로토타입에서는 클리어 실패로 처리)
  },

  // ---- 역할군 효과 5종 (전투 기획서 p.8 = 실험실 ROLE_EFFECTS) ----
  ROLE: {
    암살자: { desc: '기본 공격과 단일 공격 스킬은 가장 뒤 슬롯의 생존 적을 우선합니다.' },
    보호자: { shieldRate: 0.10, desc: '전투 시작 시 자신에게 최대 HP의 10%만큼 보호막을 얻습니다.' },
    돌격자: { healRate: 0.05, desc: '적을 처치하면 자신의 최대 HP의 5%만큼 회복합니다.' },
    결전자: { turn: 8, bonus: 1, desc: '8턴 시작 시 공격력·방어력·속도가 각각 1 증가합니다. 전투당 1회입니다.' },
    교란자: { desc: '기본 공격과 스킬을 피격 행동당 15% 확률로 회피합니다.' },
  },

  // ---- 스테이지별 적 능력치 배율 (프로토타입 임시) ----
  // 체력·공격에만 배율. 방어는 실험실 값 그대로 (뺄셈식이라 방어를 키우면 후반 적이 면역이 됨)
  // α-02 뺄셈식 특성상 난이도가 계단식으로 튀므로(공격×2 가 방어를 넘느냐), 공식이 바뀌면 다시 잰다
  ENEMY: {
    baseMult: 0.7,           // 적 기본 배율 (체력·공격)
    stageGrowth: 0.065,      // 스테이지 번호당 +6.5%
    midbossMult: { hp: 1.5, atk: 1.0 },    // 중간보스(1번 슬롯)에만 적용
    bossMult:    { hp: 2.0, atk: 1.0 },    // 보스(boss:true)에만 적용
  },

  // ---- 골드 (정비 화면 기획서) ----
  GOLD: {
    start: 100,
    reward: { 일반: 100, 이벤트: 100, 스토리: 50, 중간보스: 200, 보스: 300 },
    revive: 50,
    reviveHpRate: 0.5,
    characterPrice: [100, 150, 200],
  },

  // ---- 상점 진열 (UI 개편: 상품 5칸 = 캐릭터 3 + 아이템 2, 리롤 없음) ----
  SHOP: { slots: 5, characterSlots: 3, itemSlots: 2 },

  // ---- 레벨 (임시 설계) : 레벨업마다 체·공·방·속 각 +1 (체력 +1 = 최대 HP +10) ----
  LEVEL: { max: 10, expPerLevel: 10, statPerLevel: { hp: 1, atk: 1, def: 1, spd: 1 } },   // 다음 레벨 필요 EXP = expPerLevel × 현재 레벨

  // ---- 아이템 (임시 설계) : 상점에서 구매 → 인벤토리 → 덱 구성에서 캐릭터를 골라 사용 ----
  ITEMS: {
    exp_s:  { id: 'exp_s',  name: '경험의 열매',     category: '경험치', exp: 10,       price: 60,  weight: 4, desc: '캐릭터 1명에게 EXP +10' },
    exp_l:  { id: 'exp_l',  name: '황금 경험의 열매', category: '경험치', exp: 30,       price: 150, weight: 2, desc: '캐릭터 1명에게 EXP +30' },
    potion: { id: 'potion', name: '들판의 약초',     category: '회복',   healRate: 0.5, price: 50,  weight: 3, desc: '캐릭터 1명의 HP를 최대 HP의 50% 회복 (전투불능은 부활로만)' },
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
