// **생성물이다.** tools/import-alpha02.js 가 data/source/alpha02/characters.js (전투 실험실 α-02) 에서 만든다. 손으로 고치지 않는다.
// - pts: 체력/공격/방어/속도 (실험실 값). 최대 HP = pts.hp × BALANCE.RULES.hpMultiplier (아래에서 계산)
// - role: 판정 역할군 5종 (추격자→돌격자, 치유자→보호자). sourceRole 은 문서 표기
// - passive/skill: 리메이크 문서 반영 17종. null 이면 실험실 임시 규칙(역할군 효과만 + 공통 스킬)
// - locked: 게임 첫 시작 시 잠금 12종. 바꾸려면 tools/import-alpha02.js 의 LOCKED
window.CHARACTERS = [
 {
  "id": "CHR_001",
  "name": "괴룸파",
  "species": "우파루파",
  "type": "해",
  "typeName": "해",
  "sourceRole": "교란자",
  "role": "교란자",
  "pts": {
   "hp": 8,
   "atk": 3,
   "def": 6,
   "spd": 3
  },
  "atk": 3,
  "def": 6,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "charge_on_hit",
   "name": "늪의 살갗",
   "desc": "자신이 공격받을 때마다 차지가 1 증가합니다."
  },
  "skill": {
   "id": "self_destruct",
   "name": "자폭",
   "desc": "적 전체에게 공격력 × 차지만큼 피해를 주고, 자신은 최대 체력의 100% 피해를 받습니다.",
   "cost": 10,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_001_ST_F.png",
   "pt": "assets/characters/CHR_001_PT.png"
  }
 },
 {
  "id": "CHR_002",
  "name": "네벨라",
  "species": "누에나방",
  "type": "공",
  "typeName": "공",
  "sourceRole": "돌격자",
  "role": "돌격자",
  "pts": {
   "hp": 5,
   "atk": 6,
   "def": 2,
   "spd": 7
  },
  "atk": 6,
  "def": 2,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "kill_growth",
   "name": "배부름",
   "desc": "적을 처치하면 공격력 스탯이 3, 체력 스탯이 1 증가합니다. 체력 스탯 1은 최대·현재 HP 10으로 환산됩니다."
  },
  "skill": {
   "id": "weak_predation",
   "name": "약자포식",
   "desc": "우선도 +1. 체력이 가장 낮은 적에게 공격력 × 3 피해를 주고, 실제 HP 피해의 30%를 회복합니다.",
   "cost": 3,
   "priority": 1
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_002_ST_F.png",
   "pt": "assets/characters/CHR_002_PT.png"
  }
 },
 {
  "id": "CHR_003",
  "name": "누디안",
  "species": "갯민숭달팽이",
  "type": "해",
  "typeName": "해",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 7,
   "atk": 4,
   "def": 7,
   "spd": 2
  },
  "atk": 4,
  "def": 7,
  "spd": 2,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "status_immunity",
   "name": "점액 피부",
   "desc": "해로운 상태에 걸리지 않습니다."
  },
  "skill": {
   "id": "sea_poison",
   "name": "바다의 독",
   "desc": "적 전체에게 공격력 ÷ 2 피해를 주고, 대상마다 30% 확률로 독을 부여합니다. 독은 턴 종료마다 현재 HP의 2% → 4% → 8%… 피해를 줍니다.",
   "cost": 3,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_003_ST_F.png",
   "pt": "assets/characters/CHR_003_PT.png"
  }
 },
 {
  "id": "CHR_004",
  "name": "라피엘",
  "species": "토끼",
  "type": "공",
  "typeName": "공",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 6,
   "atk": 2,
   "def": 4,
   "spd": 8
  },
  "atk": 2,
  "def": 4,
  "spd": 8,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "healing_to_shield",
   "name": "빛의 수호",
   "desc": "자신에게 적용되는 회복을 같은 양의 보호막으로 전환합니다."
  },
  "skill": {
   "id": "blessing",
   "name": "축복",
   "desc": "현재 HP 비율이 가장 낮은 아군 1명을 최대 체력의 10%만큼 회복합니다.",
   "cost": 3,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_004_ST_F.png",
   "pt": "assets/characters/CHR_004_PT.png"
  }
 },
 {
  "id": "CHR_005",
  "name": "로데레",
  "species": "쥐",
  "type": "육",
  "typeName": "육",
  "sourceRole": "암살자",
  "role": "암살자",
  "pts": {
   "hp": 3,
   "atk": 8,
   "def": 3,
   "spd": 6
  },
  "atk": 8,
  "def": 3,
  "spd": 6,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "mark_prey",
   "name": "교활한 쥐",
   "desc": "공격한 대상 1명에게 표식을 남깁니다. 표식 대상 공격 시 피해가 20% 증가합니다."
  },
  "skill": {
   "id": "cut_throat",
   "name": "목긋기",
   "desc": "표식이 있는 적에게 공격력 × 3 피해를 주고 공격 종료 후 표식을 지웁니다.",
   "cost": 2,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_005_ST_F.png",
   "pt": "assets/characters/CHR_005_PT.png"
  }
 },
 {
  "id": "CHR_006",
  "name": "로페스",
  "species": "늑대",
  "type": "육",
  "typeName": "육",
  "sourceRole": "돌격자",
  "role": "돌격자",
  "pts": {
   "hp": 5,
   "atk": 5,
   "def": 5,
   "spd": 5
  },
  "atk": 5,
  "def": 5,
  "spd": 5,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "howling",
   "name": "하울링",
   "desc": "아군이 적을 처치하면 다음 턴 동안 생존 아군 전체의 공격력이 2 증가합니다. 같은 턴에는 중첩되지 않습니다."
  },
  "skill": {
   "id": "hunt_start",
   "name": "사냥 시작",
   "desc": "생존한 적 전체의 방어력을 1 감소시킵니다.",
   "cost": 3,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_006_ST_F.png",
   "pt": "assets/characters/CHR_006_PT.png"
  }
 },
 {
  "id": "CHR_007",
  "name": "롭",
  "species": "바닷가재",
  "type": "해",
  "typeName": "해",
  "sourceRole": "결전자",
  "role": "결전자",
  "pts": {
   "hp": 7,
   "atk": 3,
   "def": 8,
   "spd": 2
  },
  "atk": 3,
  "def": 8,
  "spd": 2,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "shell_break",
   "name": "갑각 깨기",
   "desc": "3턴마다 자신의 방어력이 1 감소하고 공격력이 2 증가합니다."
  },
  "skill": {
   "id": "smash",
   "name": "박살",
   "desc": "적 1명에게 공격력 × 3 피해를 줍니다.",
   "cost": 3,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_007_ST_F.png",
   "pt": "assets/characters/CHR_007_PT.png"
  }
 },
 {
  "id": "CHR_008",
  "name": "루미",
  "species": "글라우쿠스 아틀란티쿠스",
  "type": "해",
  "typeName": "해",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 4,
   "atk": 4,
   "def": 5,
   "spd": 7
  },
  "atk": 4,
  "def": 5,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "calm_sea",
   "name": "잔잔한 바다",
   "desc": "보호막을 보유한 생존 아군의 공격력과 속도가 2 증가합니다."
  },
  "skill": {
   "id": "sea_wave",
   "name": "바다의 물결",
   "desc": "생존한 해 타입 아군 전체에게 각자 최대 체력의 10% 보호막을 부여합니다.",
   "cost": 4,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_008_ST_F.png",
   "pt": "assets/characters/CHR_008_PT.png"
  }
 },
 {
  "id": "CHR_009",
  "name": "마노",
  "species": "날도마뱀",
  "type": "공",
  "typeName": "공",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 6,
   "atk": 4,
   "def": 8,
   "spd": 2
  },
  "atk": 4,
  "def": 8,
  "spd": 2,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "inhale",
   "name": "들숨",
   "desc": "자신이 적에게 직접 HP 피해를 주면 행동 종료 시 투지가 1 추가 증가합니다."
  },
  "skill": {
   "id": "exhale",
   "name": "날숨",
   "desc": "자신을 제외한 생존 아군 전체의 투지를 1 증가시킵니다.",
   "cost": 4,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_009_ST_F.png",
   "pt": "assets/characters/CHR_009_PT.png"
  }
 },
 {
  "id": "CHR_010",
  "name": "메카리스",
  "species": "귀상어 · 인간 · 매",
  "type": "공",
  "typeName": "공",
  "sourceRole": "결전자",
  "role": "결전자",
  "pts": {
   "hp": 3,
   "atk": 2,
   "def": 9,
   "spd": 6
  },
  "atk": 2,
  "def": 9,
  "spd": 6,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "amplified_armor",
   "name": "증폭 장갑",
   "desc": "공격에 적중당할 때마다 공격력이 2 증가합니다."
  },
  "skill": {
   "id": "full_barrage",
   "name": "전탄 발사",
   "desc": "적 전체에게 공격력 × 1.5 피해를 줍니다.",
   "cost": 2,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_010_ST_F.png",
   "pt": "assets/characters/CHR_010_PT.png"
  }
 },
 {
  "id": "CHR_011",
  "name": "버그킹",
  "species": "장수풍뎅이 · 잠자리 · 개미",
  "type": "공",
  "typeName": "공",
  "sourceRole": "돌격자",
  "role": "돌격자",
  "pts": {
   "hp": 6,
   "atk": 5,
   "def": 3,
   "spd": 6
  },
  "atk": 5,
  "def": 3,
  "spd": 6,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "kings_leap",
   "name": "왕의 도약",
   "desc": "턴 시작 시 속도가 1 증가합니다."
  },
  "skill": {
   "id": "kings_leap_attack",
   "name": "왕의 도약",
   "desc": "우선도 +1. 적 1명에게 공격력 + 속도만큼 피해를 줍니다.",
   "cost": 2,
   "priority": 1
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_011_ST_F.png",
   "pt": "assets/characters/CHR_011_PT.png"
  }
 },
 {
  "id": "CHR_012",
  "name": "벨제버브",
  "species": "파리",
  "type": "공",
  "typeName": "공",
  "sourceRole": "결전자",
  "role": "결전자",
  "pts": {
   "hp": 8,
   "atk": 2,
   "def": 5,
   "spd": 5
  },
  "atk": 2,
  "def": 5,
  "spd": 5,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "despise_weak",
   "name": "약자멸시",
   "desc": "현재 HP가 가장 낮은 적을 우선 공격합니다."
  },
  "skill": {
   "id": "molt",
   "name": "탈피",
   "desc": "자신의 방어력과 속도가 1 감소하고 공격력이 3 증가합니다.",
   "cost": 4,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_012_ST_F.png",
   "pt": "assets/characters/CHR_012_PT.png"
  }
 },
 {
  "id": "CHR_013",
  "name": "비대온",
  "species": "빈대",
  "type": "육",
  "typeName": "육",
  "sourceRole": "돌격자",
  "role": "돌격자",
  "pts": {
   "hp": 7,
   "atk": 5,
   "def": 2,
   "spd": 6
  },
  "atk": 5,
  "def": 2,
  "spd": 6,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "voracious_drain",
   "name": "마구 흡혈",
   "desc": "직접 준 HP 피해의 20%만큼 회복합니다. 실제로 회복되면 배부름이 1 증가합니다."
  },
  "skill": {
   "id": "feast_time",
   "name": "만찬시간",
   "desc": "편성 순서가 높은 적부터 배부름 수만큼 선택해 각각 공격력 × 1.5 피해를 줍니다.",
   "cost": 5,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_013_ST_F.png",
   "pt": "assets/characters/CHR_013_PT.png"
  }
 },
 {
  "id": "CHR_014",
  "name": "삼치",
  "species": "세발치",
  "type": "해",
  "typeName": "해",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 8,
   "atk": 2,
   "def": 2,
   "spd": 8
  },
  "atk": 2,
  "def": 2,
  "spd": 8,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "seeping_current",
   "name": "스며드는 물살",
   "desc": "스테이지 시작 시 편성 순서가 가장 낮은 적에게 물살을 부여합니다. 물살은 3턴마다 투지를 1 감소시킵니다."
  },
  "skill": {
   "id": "bind",
   "name": "속박",
   "desc": "물살을 보유한 적의 다음 행동을 1회 건너뛰게 합니다.",
   "cost": 5,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_014_ST_F.png",
   "pt": "assets/characters/CHR_014_PT.png"
  }
 },
 {
  "id": "CHR_015",
  "name": "샤키아",
  "species": "상어",
  "type": "해",
  "typeName": "해",
  "sourceRole": "암살자",
  "role": "암살자",
  "pts": {
   "hp": 5,
   "atk": 7,
   "def": 2,
   "spd": 6
  },
  "atk": 7,
  "def": 2,
  "spd": 6,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "blood_excitement",
   "name": "피의 흥분",
   "desc": "자신과 같은 타입의 적에게 주는 피해가 1.2배가 됩니다."
  },
  "skill": {
   "id": "sharp_teeth",
   "name": "날카로운 이빨",
   "desc": "적 1명에게 공격력 × 2 피해를 주고 출혈을 부여합니다. 출혈은 턴 종료마다 최대 HP의 5% 피해를 줍니다.",
   "cost": 2,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_015_ST_F.png",
   "pt": "assets/characters/CHR_015_PT.png"
  }
 },
 {
  "id": "CHR_016",
  "name": "센주아나",
  "species": "하이에나",
  "type": "육",
  "typeName": "육",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 6,
   "atk": 4,
   "def": 3,
   "spd": 7
  },
  "atk": 4,
  "def": 3,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "conviction",
   "name": "신념",
   "desc": "직접 준 HP 피해의 20%만큼 현재 HP 비율이 가장 낮은 생존 아군 1명을 회복합니다."
  },
  "skill": {
   "id": "perseverance",
   "name": "인내",
   "desc": "적 전체에게 공격력만큼 피해를 주고 생존 아군 전체에게 보호막 10을 부여합니다.",
   "cost": 3,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_016_ST_F.png",
   "pt": "assets/characters/CHR_016_PT.png"
  }
 },
 {
  "id": "CHR_017",
  "name": "셰일",
  "species": "사슴",
  "type": "육",
  "typeName": "육",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 8,
   "atk": 3,
   "def": 5,
   "spd": 2
  },
  "atk": 3,
  "def": 5,
  "spd": 2,
  "priority": 0,
  "locked": false,
  "passive": {
   "id": "life_affinity",
   "name": "생명친화",
   "desc": "턴 종료 시 보호막을 보유한 생존 아군이 현재 HP의 10%를 회복합니다."
  },
  "skill": {
   "id": "leaf_guard",
   "name": "잎새의 보호",
   "desc": "생존 아군 전체에게 각자 최대 체력의 20% 보호막을 부여합니다.",
   "cost": 5,
   "priority": 0
  },
  "documented": {
   "role": true,
   "stats": true,
   "passive": true,
   "skill": true
  },
  "res": {
   "st": "assets/characters/CHR_017_ST_F.png",
   "pt": "assets/characters/CHR_017_PT.png"
  }
 },
 {
  "id": "CHR_018",
  "name": "수리",
  "species": "흰머리수리",
  "type": "공",
  "typeName": "공",
  "sourceRole": "암살자",
  "role": "암살자",
  "pts": {
   "hp": 3,
   "atk": 8,
   "def": 1,
   "spd": 8
  },
  "atk": 8,
  "def": 1,
  "spd": 8,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true,
   "stats": true
  },
  "res": {
   "st": "assets/characters/CHR_018_ST_F.png",
   "pt": "assets/characters/CHR_018_PT.png"
  }
 },
 {
  "id": "CHR_019",
  "name": "스웜 레이쓰",
  "species": "날벌레 군체",
  "type": "공",
  "typeName": "공",
  "sourceRole": "돌격자",
  "role": "돌격자",
  "pts": {
   "hp": 7,
   "atk": 8,
   "def": 5,
   "spd": 7
  },
  "atk": 8,
  "def": 5,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_019_ST_F.png",
   "pt": "assets/characters/CHR_019_PT.png"
  }
 },
 {
  "id": "CHR_020",
  "name": "스위피",
  "species": "칼새",
  "type": "공",
  "typeName": "공",
  "sourceRole": "암살자",
  "role": "암살자",
  "pts": {
   "hp": 4,
   "atk": 9,
   "def": 5,
   "spd": 9
  },
  "atk": 9,
  "def": 5,
  "spd": 9,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_020_ST_F.png",
   "pt": "assets/characters/CHR_020_PT.png"
  }
 },
 {
  "id": "CHR_021",
  "name": "스콜라",
  "species": "전갈",
  "type": "육",
  "typeName": "육",
  "sourceRole": "암살자",
  "role": "암살자",
  "pts": {
   "hp": 5,
   "atk": 9,
   "def": 5,
   "spd": 7
  },
  "atk": 9,
  "def": 5,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_021_ST_F.png",
   "pt": "assets/characters/CHR_021_PT.png"
  }
 },
 {
  "id": "CHR_022",
  "name": "시엘라",
  "species": "은상어 · 클리오네",
  "type": "해",
  "typeName": "해",
  "sourceRole": "교란자",
  "role": "교란자",
  "pts": {
   "hp": 7,
   "atk": 5,
   "def": 5,
   "spd": 5
  },
  "atk": 5,
  "def": 5,
  "spd": 5,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_022_ST_F.png",
   "pt": "assets/characters/CHR_022_PT.png"
  }
 },
 {
  "id": "CHR_023",
  "name": "아우렐라 & 펠리아",
  "species": "해파리",
  "type": "해",
  "typeName": "해",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 9,
   "atk": 3,
   "def": 9,
   "spd": 4
  },
  "atk": 3,
  "def": 9,
  "spd": 4,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_023_ST_F.png",
   "pt": "assets/characters/CHR_023_PT.png"
  }
 },
 {
  "id": "CHR_024",
  "name": "아젤리아",
  "species": "백조",
  "type": "공",
  "typeName": "공",
  "sourceRole": "교란자",
  "role": "교란자",
  "pts": {
   "hp": 6,
   "atk": 3,
   "def": 8,
   "spd": 4
  },
  "atk": 3,
  "def": 8,
  "spd": 4,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_024_ST_F.png",
   "pt": "assets/characters/CHR_024_PT.png"
  }
 },
 {
  "id": "CHR_025",
  "name": "알코",
  "species": "범고래",
  "type": "해",
  "typeName": "해",
  "sourceRole": "돌격자",
  "role": "돌격자",
  "pts": {
   "hp": 8,
   "atk": 8,
   "def": 5,
   "spd": 5
  },
  "atk": 8,
  "def": 5,
  "spd": 5,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_025_ST_F.png",
   "pt": "assets/characters/CHR_025_PT.png"
  }
 },
 {
  "id": "CHR_026",
  "name": "암카라시",
  "species": "향유고래 · 범고래 · 백상아리",
  "type": "해",
  "typeName": "해",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 9,
   "atk": 4,
   "def": 8,
   "spd": 3
  },
  "atk": 4,
  "def": 8,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_026_ST_F.png",
   "pt": "assets/characters/CHR_026_PT.png"
  }
 },
 {
  "id": "CHR_027",
  "name": "연나연",
  "species": "깡충거미",
  "type": "육",
  "typeName": "육",
  "sourceRole": "추격자",
  "role": "돌격자",
  "pts": {
   "hp": 7,
   "atk": 7,
   "def": 4,
   "spd": 9
  },
  "atk": 7,
  "def": 4,
  "spd": 9,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_027_ST_F.png",
   "pt": "assets/characters/CHR_027_PT.png"
  }
 },
 {
  "id": "CHR_028",
  "name": "연화",
  "species": "비단잉어",
  "type": "해",
  "typeName": "해",
  "sourceRole": "치유자",
  "role": "보호자",
  "pts": {
   "hp": 6,
   "atk": 6,
   "def": 6,
   "spd": 3
  },
  "atk": 6,
  "def": 6,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_028_ST_F.png",
   "pt": "assets/characters/CHR_028_PT.png"
  }
 },
 {
  "id": "CHR_029",
  "name": "오카미",
  "species": "늑대",
  "type": "육",
  "typeName": "육",
  "sourceRole": "돌격자",
  "role": "돌격자",
  "pts": {
   "hp": 5,
   "atk": 6,
   "def": 5,
   "spd": 8
  },
  "atk": 6,
  "def": 5,
  "spd": 8,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_029_ST_F.png",
   "pt": "assets/characters/CHR_029_PT.png"
  }
 },
 {
  "id": "CHR_030",
  "name": "울브",
  "species": "갈기늑대",
  "type": "육",
  "typeName": "육",
  "sourceRole": "암살자",
  "role": "암살자",
  "pts": {
   "hp": 6,
   "atk": 8,
   "def": 4,
   "spd": 9
  },
  "atk": 8,
  "def": 4,
  "spd": 9,
  "priority": 0,
  "locked": false,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_030_ST_F.png",
   "pt": "assets/characters/CHR_030_PT.png"
  }
 },
 {
  "id": "CHR_031",
  "name": "울피",
  "species": "늑대",
  "type": "육",
  "typeName": "육",
  "sourceRole": "추격자",
  "role": "돌격자",
  "pts": {
   "hp": 7,
   "atk": 8,
   "def": 3,
   "spd": 9
  },
  "atk": 8,
  "def": 3,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_031_ST_F.png",
   "pt": "assets/characters/CHR_031_PT.png"
  }
 },
 {
  "id": "CHR_032",
  "name": "카라",
  "species": "까마귀",
  "type": "공",
  "typeName": "공",
  "sourceRole": "추격자",
  "role": "돌격자",
  "pts": {
   "hp": 6,
   "atk": 9,
   "def": 3,
   "spd": 9
  },
  "atk": 9,
  "def": 3,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_032_ST_F.png",
   "pt": "assets/characters/CHR_032_PT.png"
  }
 },
 {
  "id": "CHR_033",
  "name": "카르노가디안",
  "species": "알비노 도마뱀",
  "type": "육",
  "typeName": "육",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 9,
   "atk": 5,
   "def": 9,
   "spd": 4
  },
  "atk": 5,
  "def": 9,
  "spd": 4,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_033_ST_F.png",
   "pt": "assets/characters/CHR_033_PT.png"
  }
 },
 {
  "id": "CHR_034",
  "name": "카이론",
  "species": "사자",
  "type": "육",
  "typeName": "육",
  "sourceRole": "결전자",
  "role": "결전자",
  "pts": {
   "hp": 9,
   "atk": 8,
   "def": 7,
   "spd": 3
  },
  "atk": 8,
  "def": 7,
  "spd": 3,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_034_ST_F.png",
   "pt": "assets/characters/CHR_034_PT.png"
  }
 },
 {
  "id": "CHR_035",
  "name": "코스모 도리스",
  "species": "갯민숭달팽이",
  "type": "해",
  "typeName": "해",
  "sourceRole": "교란자",
  "role": "교란자",
  "pts": {
   "hp": 5,
   "atk": 6,
   "def": 4,
   "spd": 9
  },
  "atk": 6,
  "def": 4,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_035_ST_F.png",
   "pt": "assets/characters/CHR_035_PT.png"
  }
 },
 {
  "id": "CHR_036",
  "name": "키르유",
  "species": "파리지옥",
  "type": "육",
  "typeName": "육",
  "sourceRole": "교란자",
  "role": "교란자",
  "pts": {
   "hp": 8,
   "atk": 5,
   "def": 6,
   "spd": 4
  },
  "atk": 5,
  "def": 6,
  "spd": 4,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_036_ST_F.png",
   "pt": "assets/characters/CHR_036_PT.png"
  }
 },
 {
  "id": "CHR_037",
  "name": "파르바",
  "species": "꼬마비로드갯민숭달팽이",
  "type": "해",
  "typeName": "해",
  "sourceRole": "암살자",
  "role": "암살자",
  "pts": {
   "hp": 6,
   "atk": 3,
   "def": 4,
   "spd": 9
  },
  "atk": 3,
  "def": 4,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_037_ST_F.png",
   "pt": "assets/characters/CHR_037_PT.png"
  }
 },
 {
  "id": "CHR_038",
  "name": "피코",
  "species": "공작 · 물총새",
  "type": "공",
  "typeName": "공",
  "sourceRole": "암살자",
  "role": "암살자",
  "pts": {
   "hp": 3,
   "atk": 9,
   "def": 5,
   "spd": 9
  },
  "atk": 9,
  "def": 5,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_038_ST_F.png",
   "pt": "assets/characters/CHR_038_PT.png"
  }
 },
 {
  "id": "CHR_039",
  "name": "하따",
  "species": "하늘다람쥐",
  "type": "공",
  "typeName": "공",
  "sourceRole": "교란자",
  "role": "교란자",
  "pts": {
   "hp": 6,
   "atk": 9,
   "def": 3,
   "spd": 9
  },
  "atk": 9,
  "def": 3,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_039_ST_F.png",
   "pt": "assets/characters/CHR_039_PT.png"
  }
 },
 {
  "id": "CHR_040",
  "name": "호루스",
  "species": "매",
  "type": "육",
  "typeName": "육",
  "sourceRole": "결전자",
  "role": "결전자",
  "pts": {
   "hp": 9,
   "atk": 4,
   "def": 7,
   "spd": 3
  },
  "atk": 4,
  "def": 7,
  "spd": 3,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {},
  "res": {
   "st": "assets/characters/CHR_040_ST_F.png",
   "pt": "assets/characters/CHR_040_PT.png"
  }
 },
 {
  "id": "CHR_041",
  "name": "호퍼",
  "species": "펭귄",
  "type": "해",
  "typeName": "해",
  "sourceRole": "암살자",
  "role": "암살자",
  "pts": {
   "hp": 5,
   "atk": 9,
   "def": 5,
   "spd": 7
  },
  "atk": 9,
  "def": 5,
  "spd": 7,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_041_ST_F.png",
   "pt": "assets/characters/CHR_041_PT.png"
  }
 },
 {
  "id": "CHR_042",
  "name": "루나",
  "species": "나비",
  "type": "공",
  "typeName": "공",
  "sourceRole": "보호자",
  "role": "보호자",
  "pts": {
   "hp": 5,
   "atk": 3,
   "def": 4,
   "spd": 9
  },
  "atk": 3,
  "def": 4,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "passive": null,
  "skill": null,
  "documented": {
   "role": true
  },
  "res": {
   "st": "assets/characters/CHR_042_ST_F.png",
   "pt": "assets/characters/CHR_042_PT.png"
  }
 }
];
window.CHARACTERS.forEach(function (c) { c.hp = c.pts.hp * window.BALANCE.RULES.hpMultiplier; });
window.CHARACTER_BY_ID = {};
window.CHARACTERS.forEach(function (c) { window.CHARACTER_BY_ID[c.id] = c; });
window.GUIDE_CHARACTER = { id: 'CHR_901', name: '안내자', res: { st: 'assets/characters/CHR_901_ST_F.png', pt: 'assets/characters/CHR_901_PT.png' } };
