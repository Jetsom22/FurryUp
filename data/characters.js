// **생성물이다.** tools/import-rocketmonster.js 가 로켓몬스터 꾸러미에서 만든다. 손으로 고치지 않는다.
// 원본: data/source/rocketmonster/ (character/skill/skill_effect/string/rule 표)
// - pts: 원본 스탯 포인트(3~9). hp 는 RULES.HP_BASE + HP_PER_POINT * pts.hp 로 환산
// - role: 원본 7 역할군 (암살자/추격자/돌격자/보호자/교란자/결전자/치유자). 효과는 data/balance.js ROLE
// - locked: 게임 첫 시작 시 잠금 12종 (전투 기획서 p.3). 바꾸려면 tools/import-rocketmonster.js 의 LOCKED
window.CHARACTERS = [
 {
  "id": "CHR_001",
  "name": "괴룸파",
  "nameEn": "",
  "species": "우파루파",
  "desc": "시비르기 마을 뒤쪽 늪지엔 어디선가 본 거 같은 우파루파 수인이 살고있다",
  "story": "시비르기 마을 근처 이리마을에 사는 고양이 수인인 괴렘을 보고 인간화 했다는 소문이 있는 정체 불명의 수인이다",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "TRICKSTER",
  "role": "교란자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 3,
   "def": 7,
   "mag": 8,
   "spd": 3
  },
  "hp": 172,
  "atk": 3,
  "def": 7,
  "mag": 8,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1001",
     "name": "자연치유",
     "desc": "적 하나에게 약한 피해를 입히고, 자신의 체력을 최대치의 10%만큼 회복합니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 2,
     "speed": -3,
     "spCost": 0,
     "effects": [
      {
       "kw": "heal",
       "kwName": "회복",
       "grade": 2,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.1
       }
      }
     ]
    },
    {
     "key": "SKL_2001",
     "name": "늪의 온기",
     "desc": "자신의 체력을 최대치의 10%만큼 깎고, 자신을 뺀 아군에게 2턴간 최대 체력의 25%만큼 흡수하는 보호막을 부여합니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "ally_others",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "toll",
       "kwName": "대가",
       "grade": 2,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.1
       }
      },
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 4,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5001",
    "name": "자폭",
    "desc": "자신의 남은 체력에 비례해 최대 80%까지 피해량이 증가한 뒤, 적 전체에게 치명적인 피해를 입힙니다. 그 뒤 스스로 전투불능이 됩니다.",
    "element": "DIVINE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 9,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "retire",
      "kwName": "퇴장",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {}
     },
     {
      "kw": "swell",
      "kwName": "팽창",
      "grade": 3,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "bonus": 0.8
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7001",
    "name": "늪의 살갗",
    "desc": "공 타입에게 피해를 입으면 2턴간 최대 체력의 15%만큼 흡수하는 보호막을 얻습니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": -3,
    "spCost": 0,
    "effects": [
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 3,
      "side": null,
      "trigger": "on_hurt",
      "when": {
       "if": "attacker_type",
       "type": "AIR"
      },
      "chance": null,
      "args": {
       "ratio": 0.15,
       "turns": 2
      }
     }
    ]
   }
  },
  "skill": "자폭",
  "res": {
   "st": "assets/characters/CHR_001_ST_F.png",
   "pt": "assets/characters/CHR_001_PT.png"
  }
 },
 {
  "id": "CHR_002",
  "name": "네벨라",
  "nameEn": "Nebella",
  "species": "누에나방",
  "desc": "북부의 모험가 이야기 中 '만약 북부의 설산에서 밤에 당신을 바라보는 흰 눈동자와 마주쳤다면 그저 즉사를 기도하는 것 말곤 무의미 할 것이다.'",
  "story": "북부 설산에서 발견된 수인. 굉장히 호전적인 모습을 보이며 조난당한 수인, 인간을 습격하는 사건이 잦았다. 모험가들에게 토벌되어 붙잡힌 뒤 북부의 불법 지하 결투장에서부터 몬스터로 활동하게 된다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "CHARGER",
  "role": "돌격자",
  "rarity": "common",
  "pts": {
   "hp": 7,
   "atk": 8,
   "def": 4,
   "mag": 4,
   "spd": 7
  },
  "hp": 156,
  "atk": 8,
  "def": 4,
  "mag": 4,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1002",
     "name": "에어 클로",
     "desc": "적 하나에게 피해를 입힌 뒤 투지를 1 획득합니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "charge",
       "kwName": "투지획득",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1
       }
      }
     ]
    },
    {
     "key": "SKL_2002",
     "name": "흰 눈동자",
     "desc": "적 하나에게 강한 피해를 입히고, 2턴간 공격력을 1 감소시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -1,
        "turns": 2,
        "stat": "atk"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5002",
    "name": "포식",
    "desc": "체력이 가장 낮은 적에게 잃은 체력에 비례해 최대 60%까지 늘어난 피해를 입히고, 가한 피해의 30%만큼 자신의 체력을 회복합니다.",
    "element": "DIVINE",
    "kind": "ultimate",
    "target": "enemy_weakest",
    "tier": 6,
    "speed": 1,
    "spCost": 3,
    "effects": [
     {
      "kw": "drain",
      "kwName": "흡혈",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.3
      }
     },
     {
      "kw": "execute",
      "kwName": "처형",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "bonus": 0.6
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7002",
    "name": "질풍날개",
    "desc": "전투 개시 시 2턴간 속도와 무관하게 먼저 행동합니다. 가하는 피해량이 보유한 투지에 비례해 최대 75% 증가하며, 투지를 쓰는 기술은 쓰기 전의 투지로 셉니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "haste",
      "kwName": "우선",
      "grade": 2,
      "side": null,
      "trigger": "battle_start",
      "when": null,
      "chance": null,
      "args": {
       "turns": 2
      }
     },
     {
      "kw": "zeal",
      "kwName": "투기",
      "grade": 2,
      "side": null,
      "trigger": "always",
      "when": null,
      "chance": null,
      "args": {
       "bonus": 0.75
      }
     }
    ]
   }
  },
  "skill": "포식",
  "res": {
   "st": "assets/characters/CHR_002_ST_F.png",
   "pt": "assets/characters/CHR_002_PT.png"
  }
 },
 {
  "id": "CHR_003",
  "name": "누디안",
  "nameEn": "Nudibranch",
  "species": "갯민숭달팽이",
  "desc": "화려한 색채와 부드러운 외형 속에 강력한 육체를 숨긴 갯민숭달팽이 수인 격투가.",
  "story": "누디안은 갯민숭달팽이 특유의 화려한 색과 말미잘 같은 아가미를 지닌 해양계 수인이다. 칠성장어 같은 위협적인 원형 입을 숨기고 있으며 키가 3미터 가까이 되며 근육질이여서 격투 싸움을 잘하여 오우거 같은 실루엣을 가지고 있다.",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "GUARDIAN",
  "role": "보호자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 3,
   "def": 9,
   "mag": 6,
   "spd": 3
  },
  "hp": 172,
  "atk": 3,
  "def": 9,
  "mag": 6,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1003",
     "name": "거대한 주먹",
     "desc": "적 하나에게 피해를 입히고 자신의 투지를 1 획득합니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "charge",
       "kwName": "투지획득",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1
       }
      }
     ]
    },
    {
     "key": "SKL_2003",
     "name": "점액 방벽",
     "desc": "아군 전체에게 2턴간 최대 체력의 25%만큼 흡수하는 보호막을 부여합니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "ally_all",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 4,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5003",
    "name": "바다의 독",
    "desc": "적 전체에게 약한 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 9의 고정 피해를 2턴간 입힙니다. 자신은 최대 체력의 25%만큼 흡수하는 보호막을 얻습니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 3,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "bleed",
      "kwName": "출혈",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 9,
       "turns": 2
      }
     },
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 4,
      "side": "self",
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.25,
       "turns": 2
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7003",
    "name": "점액 보호막",
    "desc": "매 라운드 개시 시 면역을 얻어 1턴간 해로운 상태에 걸리지 않습니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "immune",
      "kwName": "면역",
      "grade": 1,
      "side": null,
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     }
    ]
   }
  },
  "skill": "바다의 독",
  "res": {
   "st": "assets/characters/CHR_003_ST_F.png",
   "pt": "assets/characters/CHR_003_PT.png"
  }
 },
 {
  "id": "CHR_004",
  "name": "라피엘",
  "nameEn": "Lapiel",
  "species": "토끼",
  "desc": "신성에 가장 가깝다고 여겨지는 수수께끼의 몬스터",
  "story": "다른 생물을 극도로 경계하여 알려진 정보가 거의 없다. 생명이 위태로운 생물 앞에 나타나 따스한 빛으로 상처를 치료한다고 한다. 치료가 끝나면 어디론가 사라지기 때문에 온전한 모습을 목격한 이는 매우 드물다. 이러한 모습으로 인해 예로부터 가장 신성에 가까운 생물이라고 여겨졌다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "HEALER",
  "role": "치유자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 5,
   "def": 4,
   "mag": 7,
   "spd": 5
  },
  "hp": 172,
  "atk": 5,
  "def": 4,
  "mag": 7,
  "spd": 5,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1004",
     "name": "치유의 빛",
     "desc": "적 하나에게 약한 피해를 입히고, 체력이 가장 낮은 아군의 체력을 최대치의 20%만큼 회복시킵니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 4,
     "speed": -3,
     "spCost": 0,
     "effects": [
      {
       "kw": "heal",
       "kwName": "회복",
       "grade": 3,
       "side": "ally_weakest",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.2
       }
      }
     ]
    },
    {
     "key": "SKL_2004",
     "name": "축복",
     "desc": "아군 하나의 체력을 최대치의 30%만큼 회복시키고, 그 대상의 해로운 상태를 모두 해제합니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "ally_one",
     "tier": 0,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "heal",
       "kwName": "회복",
       "grade": 4,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.3
       }
      },
      {
       "kw": "cleanse",
       "kwName": "정화",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {}
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5004",
    "name": "생츄어리",
    "desc": "아군 전체의 체력을 최대치의 30%만큼 회복시키고, 2턴간 최대 체력의 15%만큼 흡수하는 보호막을 부여합니다.",
    "element": "DIVINE",
    "kind": "ultimate",
    "target": "ally_all",
    "tier": 0,
    "speed": -3,
    "spCost": 3,
    "effects": [
     {
      "kw": "heal",
      "kwName": "회복",
      "grade": 4,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.3
      }
     },
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 3,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.15,
       "turns": 2
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7004",
    "name": "수호",
    "desc": "자신의 체력이 50% 미만이면 매 라운드 개시 시 면역을 얻습니다. 면역이 걸린 1턴 동안에는 기절을 제외한 해로운 상태에 걸리지 않습니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": -3,
    "spCost": 0,
    "effects": [
     {
      "kw": "immune",
      "kwName": "면역",
      "grade": 1,
      "side": null,
      "trigger": "round_start",
      "when": {
       "if": "hp_below",
       "ratio": 0.5
      },
      "chance": null,
      "args": {
       "turns": 1,
       "except": "stun"
      }
     }
    ]
   }
  },
  "skill": "생츄어리",
  "res": {
   "st": "assets/characters/CHR_004_ST_F.png",
   "pt": "assets/characters/CHR_004_PT.png"
  }
 },
 {
  "id": "CHR_005",
  "name": "로데레",
  "nameEn": "Rodere",
  "species": "쥐",
  "desc": "비밀스럽고 교활하며 예측하기 힘든 쥐 수인",
  "story": "생존을 위해서라면 수단과 방법을 가리지 않는다, 쥐 처럼 재빠르고 교활하다, 조금의 금전적인 문제로 로캣에 참여하게 된다",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "HUNTER",
  "role": "추격자",
  "rarity": "common",
  "pts": {
   "hp": 4,
   "atk": 9,
   "def": 5,
   "mag": 3,
   "spd": 9
  },
  "hp": 132,
  "atk": 9,
  "def": 5,
  "mag": 3,
  "spd": 9,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1005",
     "name": "목 긋기",
     "desc": "적 하나에게 치명적인 피해를 입히고, 2턴간 자신의 공격력을 1 증가시킵니다. 그 대상은 1턴간 특수기 사용이 봉인됩니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 9,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1,
        "turns": 2,
        "stat": "atk"
       }
      },
      {
       "kw": "silence",
       "kwName": "침묵",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 1
       }
      }
     ]
    },
    {
     "key": "SKL_2005",
     "name": "뒤쫓기",
     "desc": "적 하나에게 강한 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 6,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5005",
    "name": "복수",
    "desc": "적 하나에게 치명적인 피해를 입힙니다. 자신의 체력이 50% 미만이면 이 피해가 1.75배로 늘어납니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 9,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": {
       "if": "hp_below",
       "ratio": 0.5
      },
      "chance": null,
      "args": {
       "mult": 1.75
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7005",
    "name": "교활한 쥐",
    "desc": "적을 쓰러뜨릴 때마다 투지를 1 획득하고, 1턴간 속도와 무관하게 먼저 행동합니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "charge",
      "kwName": "투지획득",
      "grade": 1,
      "side": null,
      "trigger": "on_kill",
      "when": null,
      "chance": null,
      "args": {
       "amount": 1
      }
     },
     {
      "kw": "haste",
      "kwName": "우선",
      "grade": 1,
      "side": null,
      "trigger": "on_kill",
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     }
    ]
   }
  },
  "skill": "복수",
  "res": {
   "st": "assets/characters/CHR_005_ST_F.png",
   "pt": "assets/characters/CHR_005_PT.png"
  }
 },
 {
  "id": "CHR_006",
  "name": "로페스",
  "nameEn": "Lopus",
  "species": "늑대",
  "desc": "우두머리를 노리는 베테랑 늑대 수인",
  "story": "로캣에서 자신의 능력을 보여 늑대 수인들의 우두머리로 인정받으려 한다 늑대의 하울링은 아군의 사기를 올리고 적의 사기를 떨어뜨린다",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "CLOSER",
  "role": "결전자",
  "rarity": "common",
  "pts": {
   "hp": 7,
   "atk": 5,
   "def": 6,
   "mag": 6,
   "spd": 6
  },
  "hp": 156,
  "atk": 5,
  "def": 6,
  "mag": 6,
  "spd": 6,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1006",
     "name": "물어 뜯기",
     "desc": "적 하나에게 강한 피해를 입히고, 2턴간 그 대상이 받는 피해량을 15% 증가시킵니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 8,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "mark",
       "kwName": "표식",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.15,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2006",
     "name": "고독한 사냥",
     "desc": "적 하나에게 강한 피해를 입힙니다. 쓰러진 아군 하나마다 이 피해가 50%씩 늘어납니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 8,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "avenge",
       "kwName": "설욕",
       "grade": 3,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "per": 0.5
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5006",
    "name": "최후의 포효",
    "desc": "적 전체에게 피해를 입히고, 대상 최대 체력의 12%만큼을 방어와 무관한 고정 피해로 더합니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 5,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "siege",
      "kwName": "공성",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.12
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7006",
    "name": "우두머리",
    "desc": "아군이 쓰러질 때마다 전투가 끝날 때까지 체력 상한과 공격력과 방어력이 각각 5 증가합니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 10,
      "side": null,
      "trigger": "on_fall",
      "when": {
       "if": "ally_fell"
      },
      "chance": null,
      "args": {
       "amount": 5,
       "lasting": true,
       "stat": "hp"
      }
     },
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 10,
      "side": null,
      "trigger": "on_fall",
      "when": {
       "if": "ally_fell"
      },
      "chance": null,
      "args": {
       "amount": 5,
       "lasting": true,
       "stat": "atk"
      }
     },
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 10,
      "side": null,
      "trigger": "on_fall",
      "when": {
       "if": "ally_fell"
      },
      "chance": null,
      "args": {
       "amount": 5,
       "lasting": true,
       "stat": "def"
      }
     }
    ]
   }
  },
  "skill": "최후의 포효",
  "res": {
   "st": "assets/characters/CHR_006_ST_F.png",
   "pt": "assets/characters/CHR_006_PT.png"
  }
 },
 {
  "id": "CHR_007",
  "name": "롭",
  "nameEn": "Lob",
  "species": "바닷가재",
  "desc": "거대한 집게로 자르고 박살낸다.",
  "story": "롭의 날카로운 집게는 적을 잘라내며, 단단한 갑각은 공격을 방어한다. 또한 롭은 유사시에 집게를 둔기로 활용하기도 한다.",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "GUARDIAN",
  "role": "보호자",
  "rarity": "common",
  "pts": {
   "hp": 8,
   "atk": 7,
   "def": 6,
   "mag": 6,
   "spd": 3
  },
  "hp": 164,
  "atk": 7,
  "def": 6,
  "mag": 6,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1007",
     "name": "자르기",
     "desc": "적 하나에게 피해를 입히고, 2턴간 그 대상의 방어력을 2 감소시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -2,
        "turns": 2,
        "stat": "def"
       }
      }
     ]
    },
    {
     "key": "SKL_2007",
     "name": "집게 방패",
     "desc": "2턴간 최대 체력의 25%만큼 흡수하는 보호막을 얻고, 2턴간 자신을 도발 상태로 만듭니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "self",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 4,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      },
      {
       "kw": "taunt",
       "kwName": "도발",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5007",
    "name": "박살",
    "desc": "적 하나에게 강한 피해를 입히고, 3턴간 그 대상의 방어력을 3 감소시킵니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 7,
    "speed": 0,
    "spCost": 2,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 4,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": -3,
       "turns": 3,
       "stat": "def"
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7007",
    "name": "단단한 갑각",
    "desc": "피해를 입을 때마다 2턴간 최대 체력의 10%만큼 흡수하는 보호막을 얻습니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 2,
      "side": null,
      "trigger": "on_hurt",
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.1,
       "turns": 2
      }
     }
    ]
   }
  },
  "skill": "박살",
  "res": {
   "st": "assets/characters/CHR_007_ST_F.png",
   "pt": "assets/characters/CHR_007_PT.png"
  }
 },
 {
  "id": "CHR_008",
  "name": "루미",
  "nameEn": "Lumi",
  "species": "글라우쿠스 아틀란티쿠스",
  "desc": "바다를 관장하는 신의 아이",
  "story": "바다에 쓰레기를 버리는 나쁜 인간들을 물리치기 위해 깊은 잠에서 깨어났다",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "CLOSER",
  "role": "결전자",
  "rarity": "common",
  "pts": {
   "hp": 6,
   "atk": 4,
   "def": 8,
   "mag": 8,
   "spd": 4
  },
  "hp": 148,
  "atk": 4,
  "def": 8,
  "mag": 8,
  "spd": 4,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1008",
     "name": "물뿜기",
     "desc": "적 하나에게 방어력과 무관한 피해를 입히고, 2턴간 그 대상의 방어력을 1 감소시킵니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 5,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -1,
        "turns": 2,
        "stat": "def"
       }
      }
     ]
    },
    {
     "key": "SKL_2008",
     "name": "썩는 물",
     "desc": "적 전체에게 약한 피해를 입히고, 2턴간 받는 회복량을 35%로 줄입니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_all",
     "tier": 3,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "blight",
       "kwName": "부패",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.35,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5008",
    "name": "신의 물결",
    "desc": "적 전체에게 방어력과 무관한 피해를 입히고, 3턴간 받는 회복량을 20%로 줄입니다.",
    "element": "DIVINE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 5,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "blight",
      "kwName": "부패",
      "grade": 3,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.2,
       "turns": 3
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7008",
    "name": "잔잔한 바다",
    "desc": "자신의 체력이 최대치인 동안에는 가하는 피해량이 1.5배가 됩니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "hp_full"
      },
      "chance": null,
      "args": {
       "mult": 1.5
      }
     }
    ]
   }
  },
  "skill": "신의 물결",
  "res": {
   "st": "assets/characters/CHR_008_ST_F.png",
   "pt": "assets/characters/CHR_008_PT.png"
  }
 },
 {
  "id": "CHR_009",
  "name": "마노",
  "nameEn": "Mano",
  "species": "날도마뱀",
  "desc": "구름 위의 권태롭고 지고한 존재",
  "story": "긴 동면에서 깨어난 마노. 바뀐 시대에서 가장 놀라운건 로캣대회였다. 그 대회가 이렇게 변하다니. 상상도 못했던 일이지. 마노는 친히 새로운 시대의 존재들과 어울려보기로 했다. 자신을 이긴 이에게는 친히 얼굴을 보이고 공을 치하할 것이다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "HEALER",
  "role": "치유자",
  "rarity": "common",
  "pts": {
   "hp": 7,
   "atk": 4,
   "def": 7,
   "mag": 9,
   "spd": 3
  },
  "hp": 156,
  "atk": 4,
  "def": 7,
  "mag": 9,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1009",
     "name": "들숨",
     "desc": "적 하나에게 약한 피해를 입히고 대상의 투지를 1 감소시킵니다. 그 뒤 자신은 투지를 1 획득합니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 1,
     "speed": -3,
     "spCost": 0,
     "effects": [
      {
       "kw": "siphon",
       "kwName": "투지흡수",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1
       }
      },
      {
       "kw": "charge",
       "kwName": "투지획득",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1
       }
      }
     ]
    },
    {
     "key": "SKL_2009",
     "name": "구름 나눔",
     "desc": "아군 하나의 투지를 1 증가시키고, 그 대상의 체력을 최대치의 30%만큼 회복시킵니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "ally_one",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "gift",
       "kwName": "투지전달",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1
       }
      },
      {
       "kw": "heal",
       "kwName": "회복",
       "grade": 4,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.3
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5009",
    "name": "날숨",
    "desc": "아군이 1기 이상 전투불능일 때만 사용할 수 있습니다. 아군 전체의 공격력을 3턴간 2 증가시키고, 투지를 2 획득합니다.",
    "element": "DIVINE",
    "kind": "ultimate",
    "target": "ally_all",
    "tier": 0,
    "speed": 3,
    "spCost": 3,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 3,
      "side": null,
      "trigger": null,
      "when": {
       "if": "ally_fallen"
      },
      "chance": null,
      "args": {
       "amount": 2,
       "turns": 3,
       "stat": "atk"
      }
     },
     {
      "kw": "gift",
      "kwName": "투지전달",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": {
       "if": "ally_fallen"
      },
      "chance": null,
      "args": {
       "amount": 2
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7009",
    "name": "유희",
    "desc": "매 라운드 개시 시 투지를 1 획득합니다. 자신의 투지가 4 이상이면 자신의 체력을 최대치의 20%만큼 함께 회복합니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": -3,
    "spCost": 0,
    "effects": [
     {
      "kw": "charge",
      "kwName": "투지획득",
      "grade": 1,
      "side": null,
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "amount": 1
      }
     },
     {
      "kw": "heal",
      "kwName": "회복",
      "grade": 3,
      "side": null,
      "trigger": "round_start",
      "when": {
       "if": "sp_above",
       "amount": 4
      },
      "chance": null,
      "args": {
       "ratio": 0.2
      }
     }
    ]
   }
  },
  "skill": "날숨",
  "res": {
   "st": "assets/characters/CHR_009_ST_F.png",
   "pt": "assets/characters/CHR_009_PT.png"
  }
 },
 {
  "id": "CHR_010",
  "name": "메카리스",
  "nameEn": "Mecaris",
  "species": "귀상어 · 인간 · 매",
  "desc": "어느 실험실에서 태어난 기계괴수, 이 괴물이 폭주하여 연구실에서 나온다 과연 이 미친 괴수를 막을자 누구인가",
  "story": "실험실에서 태어난 괴수병기 였으나 어느날 폭주하여 연구실을 괴멸 시키고 탈출하였다. 탈출 후 폭주 상태는 안정화 되었으나 그 폭주사태 이후로 이 기계 괴수는 점점 미쳐버려 피와 분노에 빠져들었다",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "CLOSER",
  "role": "결전자",
  "rarity": "common",
  "pts": {
   "hp": 8,
   "atk": 3,
   "def": 7,
   "mag": 6,
   "spd": 6
  },
  "hp": 164,
  "atk": 3,
  "def": 7,
  "mag": 6,
  "spd": 6,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1010",
     "name": "장갑 강화",
     "desc": "적 하나를 2회 연속으로 타격하며, 타격마다 약한 피해를 입힙니다. 그 뒤 2턴간 자신의 방어력을 2 증가시킵니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 4,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "multihit",
       "kwName": "연타",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "hits": 2
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 2,
        "stat": "def"
       }
      }
     ]
    },
    {
     "key": "SKL_2010",
     "name": "마력탄",
     "desc": "적 하나에게 강한 피해를 입히고, 2턴간 그 대상이 받는 피해량을 15% 증가시킵니다. 이 공격은 보호막을 지나쳐 체력을 직접 깎습니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 8,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "mark",
       "kwName": "표식",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.15,
        "turns": 2
       }
      },
      {
       "kw": "bypass",
       "kwName": "투과",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {}
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5010",
    "name": "전탄 발사",
    "desc": "적 하나를 3회 연속으로 타격하며, 타격마다 피해를 입힙니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 5,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "multihit",
      "kwName": "연타",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "hits": 3
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7010",
    "name": "증폭 장갑",
    "desc": "자신에게 걸린 이로운 상태 하나마다 자신이 입히는 피해량이 10%씩 증가합니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "rally",
      "kwName": "고양",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": null,
      "chance": null,
      "args": {
       "per": 0.1
      }
     }
    ]
   }
  },
  "skill": "전탄 발사",
  "res": {
   "st": "assets/characters/CHR_010_ST_F.png",
   "pt": "assets/characters/CHR_010_PT.png"
  }
 },
 {
  "id": "CHR_011",
  "name": "버그킹",
  "nameEn": "Bugking",
  "species": "장수풍뎅이 · 잠자리 · 개미",
  "desc": "벌레 군집의 왕",
  "story": "아포칼립스 세계의 진화한 벌레들중에 가장 강한 우두머리가 되기 위한 한 장수풍뎅이의 여정",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "CHARGER",
  "role": "돌격자",
  "rarity": "common",
  "pts": {
   "hp": 8,
   "atk": 8,
   "def": 5,
   "mag": 3,
   "spd": 6
  },
  "hp": 164,
  "atk": 8,
  "def": 5,
  "mag": 3,
  "spd": 6,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1011",
     "name": "뿔 치기",
     "desc": "적 하나에게 강한 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 0,
     "effects": []
    },
    {
     "key": "SKL_2011",
     "name": "돌진",
     "desc": "2턴간 자신의 방어력을 2 감소시키는 대신, 적 하나에게 강한 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -2,
        "turns": 2,
        "stat": "def"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5011",
    "name": "왕의 도약",
    "desc": "적 하나에게 피해를 입히고 1턴간 행동 불능 상태로 만듭니다.",
    "element": "DIVINE",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 5,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "stun",
      "kwName": "기절",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7011",
    "name": "갑각",
    "desc": "매 라운드 개시 시 버팀을 얻습니다. 버팀으로 견뎌 내면 2턴간 최대 체력의 5%만큼 흡수하는 보호막을 얻습니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "endure",
      "kwName": "버팀",
      "grade": 1,
      "side": null,
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "turns": 2
      }
     },
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 1,
      "side": null,
      "trigger": "on_endure",
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.05,
       "turns": 2
      }
     }
    ]
   }
  },
  "skill": "왕의 도약",
  "res": {
   "st": "assets/characters/CHR_011_ST_F.png",
   "pt": "assets/characters/CHR_011_PT.png"
  }
 },
 {
  "id": "CHR_012",
  "name": "벨제버브",
  "nameEn": "Beelzebub",
  "species": "파리",
  "desc": "화합을 거부하는 악당 로캣몬",
  "story": "수없이 많은 탈피를 거듭하며 강력한 힘을 손에 넣은 갑옷 파리 로캣몬. 화합을 거부하며 새로운 세력 제옥제국을 세우고, 황제를 참칭하고 있다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "GUARDIAN",
  "role": "보호자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 4,
   "def": 8,
   "mag": 6,
   "spd": 3
  },
  "hp": 172,
  "atk": 4,
  "def": 8,
  "mag": 6,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1012",
     "name": "약자멸시",
     "desc": "대상이 잃은 체력에 비례해 최대 40%까지 피해량이 증가한 뒤, 체력이 가장 낮은 적에게 피해를 입힙니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_weakest",
     "tier": 5,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "execute",
       "kwName": "처형",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "bonus": 0.4
       }
      }
     ]
    },
    {
     "key": "SKL_2012",
     "name": "군림",
     "desc": "2턴간 자신을 도발 상태로 만들고, 그동안 자신의 방어력을 3 증가시킵니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "self",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "taunt",
       "kwName": "도발",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 2
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 4,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 3,
        "turns": 3,
        "stat": "def"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5012",
    "name": "탈피",
    "desc": "적 하나에게 피해를 입히고, 3턴간 자신의 마력을 5 증가시키며 최대 체력의 60%만큼 흡수하는 보호막을 얻습니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 6,
    "speed": 0,
    "spCost": 5,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 6,
      "side": "self",
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 5,
       "turns": 3,
       "stat": "mag"
      }
     },
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 7,
      "side": "self",
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.6,
       "turns": 3
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7012",
    "name": "위화감",
    "desc": "매 라운드 개시 시 상대 진영 선두에 침묵을 부여하여 1턴간 특수기 사용을 봉인합니다.",
    "element": null,
    "kind": "passive",
    "target": "enemy_one",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "silence",
      "kwName": "침묵",
      "grade": 1,
      "side": null,
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     }
    ]
   }
  },
  "skill": "탈피",
  "res": {
   "st": "assets/characters/CHR_012_ST_F.png",
   "pt": "assets/characters/CHR_012_PT.png"
  }
 },
 {
  "id": "CHR_013",
  "name": "비대온",
  "nameEn": "Bidaeon",
  "species": "빈대",
  "desc": "세상 모든 피를 빨겠따!",
  "story": "어릴 적 흡혈 충동을 참지 못하여 피를 보면 무작정 달려들어 사고를 많이 쳤다, 어느 날, 지나가던 행인과 다툼이 있고 난 후 충동을 어떻게 해소할까 고민을 가지게 되었는데 로켓 배틀 방송을 보고 이거라면 다양한 피를 합법적으로 맛볼 수 있다는 사실을 알게 되었고, 로벳 배틀에 참가하게 되는 계기가 되었다. 세상 모든 피를 맛보기 위해서.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "CLOSER",
  "role": "결전자",
  "rarity": "common",
  "pts": {
   "hp": 7,
   "atk": 5,
   "def": 6,
   "mag": 5,
   "spd": 7
  },
  "hp": 156,
  "atk": 5,
  "def": 6,
  "mag": 5,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1013",
     "name": "마구 흡혈",
     "desc": "적 하나에게 피해를 입히고 대상 최대 체력의 8%만큼을 방어와 무관한 고정 피해로 더합니다. 가한 피해의 20%만큼 자신의 체력을 회복하는 대신, 2턴간 자신의 속도가 1 감소합니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "drain",
       "kwName": "흡혈",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.2
       }
      },
      {
       "kw": "siege",
       "kwName": "공성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.08
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -1,
        "turns": 2,
        "stat": "spd"
       }
      }
     ]
    },
    {
     "key": "SKL_2013",
     "name": "목덜미",
     "desc": "적 하나에게 피해를 입히고 대상 최대 체력의 8%만큼을 방어와 무관한 고정 피해로 더합니다. 가한 피해의 40%만큼 자신의 체력을 회복하고, 1턴간 간파를 얻습니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 5,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "drain",
       "kwName": "흡혈",
       "grade": 3,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.4
       }
      },
      {
       "kw": "siege",
       "kwName": "공성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.08
       }
      },
      {
       "kw": "unbind",
       "kwName": "간파",
       "grade": 1,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 1
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5013",
    "name": "만찬 시간!",
    "desc": "적 하나에게 강한 피해를 입히고, 대상 최대 체력의 12%만큼을 방어와 무관한 고정 피해로 더합니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 7,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "siege",
      "kwName": "공성",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.12
      }
     },
     {
      "kw": "bypass",
      "kwName": "투과",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {}
     }
    ]
   },
   "passive": {
    "key": "SKL_7013",
    "name": "배불러..",
    "desc": "피해를 입힌 대상의 공격력을 2턴간 2 감소시킵니다.",
    "element": null,
    "kind": "passive",
    "target": "enemy_one",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 2,
      "side": null,
      "trigger": "on_strike",
      "when": null,
      "chance": null,
      "args": {
       "amount": -2,
       "turns": 2,
       "stat": "atk"
      }
     }
    ]
   }
  },
  "skill": "만찬 시간!",
  "res": {
   "st": "assets/characters/CHR_013_ST_F.png",
   "pt": "assets/characters/CHR_013_PT.png"
  }
 },
 {
  "id": "CHR_014",
  "name": "삼치",
  "nameEn": "",
  "species": "세발치",
  "desc": "심해 바닥에서 종일 서 있는 물고기",
  "story": "바다 밑바닥에서 때를 기다리는 캐릭터. 마을에서도 가만히 기다리고만 있다.",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "TRICKSTER",
  "role": "교란자",
  "rarity": "common",
  "pts": {
   "hp": 8,
   "atk": 3,
   "def": 3,
   "mag": 9,
   "spd": 7
  },
  "hp": 164,
  "atk": 3,
  "def": 3,
  "mag": 9,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1014",
     "name": "속박",
     "desc": "적 하나에게 강한 피해를 입히고 1턴간 특수기 사용을 봉인합니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "silence",
       "kwName": "침묵",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 1
       }
      }
     ]
    },
    {
     "key": "SKL_2014",
     "name": "심해의 벽",
     "desc": "적 전체에게 약한 피해를 입히고, 2턴간 속도를 1 감소시킵니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_all",
     "tier": 3,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -1,
        "turns": 2,
        "stat": "spd"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5014",
    "name": "또속박",
    "desc": "적 전체에게 피해를 입히고 1턴간 특수기 사용을 봉인하며, 2턴간 속도를 1 감소시킵니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 6,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "silence",
      "kwName": "침묵",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     },
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": -1,
       "turns": 2,
       "stat": "spd"
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7014",
    "name": "스며드는 물살",
    "desc": "자신의 공격은 대상의 보호막을 지나쳐 체력을 직접 깎습니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "bypass",
      "kwName": "투과",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": null,
      "chance": null,
      "args": {}
     }
    ]
   }
  },
  "skill": "또속박",
  "res": {
   "st": "assets/characters/CHR_014_ST_F.png",
   "pt": "assets/characters/CHR_014_PT.png"
  }
 },
 {
  "id": "CHR_015",
  "name": "샤키아",
  "nameEn": "Shakira",
  "species": "상어",
  "desc": "사나운 상어의 본능을 타고났지만, 칭찬에는 꼬리가 먼저 흔들리는 귀여운 바다의 포식자.",
  "story": "겉보기에는 차갑고 무서워 보이지만 실제로는 칭찬에 약하고 쉽게 당황하는 순수한 성격의 소유자다. 특히 경기에서 흥분하면 본능적으로 꼬리를 크게 흔들거나 상대를 집요하게 쫓아가는 습관이 있다.",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "CHARGER",
  "role": "돌격자",
  "rarity": "common",
  "pts": {
   "hp": 7,
   "atk": 9,
   "def": 4,
   "mag": 3,
   "spd": 7
  },
  "hp": 156,
  "atk": 9,
  "def": 4,
  "mag": 3,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1015",
     "name": "깨물기",
     "desc": "적 하나에게 강한 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 6,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2015",
     "name": "집요한 추적",
     "desc": "적 하나에게 강한 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 9의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 9,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5015",
    "name": "신속한 사냥",
    "desc": "대상이 출혈 중이면 피해량이 1.75배로 늘어난 뒤, 적 하나에게 강한 피해를 입힙니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 8,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": {
       "if": "target_bleeding"
      },
      "chance": null,
      "args": {
       "mult": 1.75
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7015",
    "name": "피의 흥분",
    "desc": "출혈 중인 대상에게는 가하는 피해량이 1.5배가 됩니다. 또한 출혈을 부여할 때마다 그 대상에게 이미 걸린 출혈의 지속도 함께 늘어납니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "target_bleeding"
      },
      "chance": null,
      "args": {
       "mult": 1.5
      }
     },
     {
      "kw": "renew",
      "kwName": "갱신",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": null,
      "chance": null,
      "args": {}
     }
    ]
   }
  },
  "skill": "신속한 사냥",
  "res": {
   "st": "assets/characters/CHR_015_ST_F.png",
   "pt": "assets/characters/CHR_015_PT.png"
  }
 },
 {
  "id": "CHR_016",
  "name": "센주아나",
  "nameEn": "San Juana",
  "species": "하이에나",
  "desc": "신성력을 가진 주먹으로 때리는 하이에나",
  "story": "깨달음을 얻고 아프리카에서 수련을 통해 변화했다",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "HEALER",
  "role": "치유자",
  "rarity": "common",
  "pts": {
   "hp": 8,
   "atk": 4,
   "def": 5,
   "mag": 7,
   "spd": 6
  },
  "hp": 164,
  "atk": 4,
  "def": 5,
  "mag": 7,
  "spd": 6,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1016",
     "name": "자애의 주먹",
     "desc": "적 하나에게 약한 피해를 입히고, 2턴간 최대 체력의 5%만큼 흡수하는 보호막을 얻습니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 4,
     "speed": -3,
     "spCost": 0,
     "effects": [
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 1,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.05,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2016",
     "name": "성스러운 포효",
     "desc": "적 전체에게 약한 피해를 입히고, 아군 전체가 2턴간 최대 체력의 15%만큼 흡수하는 보호막을 얻습니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "enemy_all",
     "tier": 2,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 3,
       "side": "ally",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.15,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5016",
    "name": "인내",
    "desc": "아군 전체에게 2턴간 최대 체력의 25%만큼 흡수하는 보호막을 부여하고, 2턴간 공격력을 1 증가시킵니다.",
    "element": "DIVINE",
    "kind": "ultimate",
    "target": "ally_all",
    "tier": 0,
    "speed": -3,
    "spCost": 3,
    "effects": [
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 4,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.25,
       "turns": 2
      }
     },
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 1,
       "turns": 2,
       "stat": "atk"
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7016",
    "name": "신념",
    "desc": "자신이 보호막을 두르고 있으면 자신이 입히는 피해량이 1.5배가 됩니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": -3,
    "spCost": 0,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "self_shielded"
      },
      "chance": null,
      "args": {
       "mult": 1.5
      }
     }
    ]
   }
  },
  "skill": "인내",
  "res": {
   "st": "assets/characters/CHR_016_ST_F.png",
   "pt": "assets/characters/CHR_016_PT.png"
  }
 },
 {
  "id": "CHR_017",
  "name": "셰일",
  "nameEn": "Shail",
  "species": "사슴",
  "desc": "자연과 소통하는 숲의 대리인",
  "story": "숲 속에 은거하며 자연을 섬기며 살아가는 존재. 방문자의 요청으로 세상 나들이를 나오게 되었고, 접수처의 착각으로 경기에 참가되었다.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "HEALER",
  "role": "치유자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 3,
   "def": 7,
   "mag": 8,
   "spd": 3
  },
  "hp": 172,
  "atk": 3,
  "def": 7,
  "mag": 8,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1017",
     "name": "평화의 노래",
     "desc": "적 하나에게 약한 피해를 입히고, 2턴간 그 대상의 공격력을 2 감소시킵니다. 자신의 투지를 1 획득합니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 4,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -2,
        "turns": 2,
        "stat": "atk"
       }
      },
      {
       "kw": "charge",
       "kwName": "투지획득",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1
       }
      }
     ]
    },
    {
     "key": "SKL_2017",
     "name": "숲의 결계",
     "desc": "아군 전체에게 2턴간 최대 체력의 25%만큼 흡수하는 보호막을 부여합니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "ally_all",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 4,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5017",
    "name": "잎새의 보호",
    "desc": "아군 전체의 체력을 최대치의 20%만큼 회복시키고, 3턴간 최대 체력의 35%만큼 흡수하는 보호막을 부여합니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "ally_all",
    "tier": 0,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "heal",
      "kwName": "회복",
      "grade": 3,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.2
      }
     },
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 6,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.35,
       "turns": 3
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7017",
    "name": "생명 친화",
    "desc": "타입 상성 배율을 50%만 적용받습니다. 유리한 상성과 불리한 상성 양쪽에 적용됩니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "temper",
      "kwName": "상성완화",
      "grade": 2,
      "side": null,
      "trigger": "always",
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.5
      }
     }
    ]
   }
  },
  "skill": "잎새의 보호",
  "res": {
   "st": "assets/characters/CHR_017_ST_F.png",
   "pt": "assets/characters/CHR_017_PT.png"
  }
 },
 {
  "id": "CHR_018",
  "name": "수리",
  "nameEn": "Quila",
  "species": "흰머리수리",
  "desc": "하늘의 암살자",
  "story": "수리는 민첩한 움직임으로 적을 낚아채고, 날카롭고 강력한 발톱으로 적을 공격한다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "ASSASSIN",
  "role": "암살자",
  "rarity": "common",
  "pts": {
   "hp": 5,
   "atk": 9,
   "def": 4,
   "mag": 3,
   "spd": 9
  },
  "hp": 140,
  "atk": 9,
  "def": 4,
  "mag": 3,
  "spd": 9,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1018",
     "name": "할퀴기",
     "desc": "적 하나에게 치명적인 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 9,
     "speed": 0,
     "spCost": 0,
     "effects": []
    },
    {
     "key": "SKL_2018",
     "name": "급습",
     "desc": "적 하나에게 강한 피해를 입힙니다. 속도 보정이 높아 같은 라운드의 다른 기술보다 앞서 나갑니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 8,
     "speed": 3,
     "spCost": 2,
     "effects": []
    }
   ],
   "ultimate": {
    "key": "SKL_5018",
    "name": "낚아채기",
    "desc": "대상의 체력이 50% 미만이면 피해량이 1.75배로 늘어난 뒤, 적 하나에게 강한 피해를 입힙니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 8,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": {
       "if": "target_hp_below",
       "ratio": 0.5
      },
      "chance": null,
      "args": {
       "mult": 1.75
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7018",
    "name": "맹금류의 민첩성",
    "desc": "전투가 끝날 때까지 간파를 얻습니다. 자신보다 느린 대상에게는 가하는 피해량이 1.5배가 되고, 그 대상에게서 받는 피해량은 0.8배가 됩니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "unbind",
      "kwName": "간파",
      "grade": 4,
      "side": "self",
      "trigger": "battle_start",
      "when": null,
      "chance": null,
      "args": {
       "turns": 1,
       "lasting": true
      }
     },
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "faster_than_target"
      },
      "chance": null,
      "args": {
       "mult": 1.5
      }
     },
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "faster_than_target"
      },
      "chance": null,
      "args": {
       "mult": 0.8
      }
     }
    ]
   }
  },
  "skill": "낚아채기",
  "res": {
   "st": "assets/characters/CHR_018_ST_F.png",
   "pt": "assets/characters/CHR_018_PT.png"
  }
 },
 {
  "id": "CHR_019",
  "name": "스웜 레이쓰",
  "nameEn": "Swarm Wraith",
  "species": "날벌레 군체",
  "desc": "수천의 날벌레가 하나의 신체가 되어 경기장을 뒤덮는 군집형 수인",
  "story": "스웜 레이쓰는 수많은 작은 날벌레가 하나의 의식을 공유하며 신체를 이룬 수인이다. 위협을 느끼면 몸을 이루던 군체를 흩뜨려 공격을 피하고, 다시 거대한 형상으로 뭉치는 독특한 능력을 지녔다. 군체의 변화무쌍한 움직임을 무기로 사용하는 공중 타입 선수로 활약하고 있다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "CHARGER",
  "role": "돌격자",
  "rarity": "common",
  "pts": {
   "hp": 7,
   "atk": 8,
   "def": 5,
   "mag": 3,
   "spd": 7
  },
  "hp": 156,
  "atk": 8,
  "def": 5,
  "mag": 3,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1019",
     "name": "망령 강타",
     "desc": "적 하나에게 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 6,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2019",
     "name": "군체 분산",
     "desc": "2턴간 최대 체력의 25%만큼 흡수하는 보호막을 얻고, 2턴간 공격력을 2 증가시킵니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "self",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 4,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 2,
        "stat": "atk"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5019",
    "name": "망령의 전진",
    "desc": "적 전체에게 약한 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 9의 고정 피해를 3턴간 입힙니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 3,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "bleed",
      "kwName": "출혈",
      "grade": 3,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 9,
       "turns": 3
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7019",
    "name": "흩어지는 신체",
    "desc": "자신의 속도가 대상보다 높을 때는 그 대상에게서 받는 피해량이 0.7배가 됩니다. 출혈 중인 대상을 때리면 가한 피해의 30%만큼 자신의 체력을 회복합니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 2,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "faster_than_target"
      },
      "chance": null,
      "args": {
       "mult": 0.7
      }
     },
     {
      "kw": "drain",
      "kwName": "흡혈",
      "grade": 2,
      "side": null,
      "trigger": "on_strike",
      "when": {
       "if": "target_bleeding"
      },
      "chance": null,
      "args": {
       "ratio": 0.3
      }
     }
    ]
   }
  },
  "skill": "망령의 전진",
  "res": {
   "st": "assets/characters/CHR_019_ST_F.png",
   "pt": "assets/characters/CHR_019_PT.png"
  }
 },
 {
  "id": "CHR_020",
  "name": "스위피",
  "nameEn": "Swipy",
  "species": "칼새",
  "desc": "바람보다 빠르게! 인연을 이어주는 쾌활한 공중 배달부.",
  "story": "스위피는 빠른 비행을 꿈꾸며, 하늘길로 소식과 물자를 전하는 젊은 배달부다. 누군가의 감정이 담겨있는 편지, 물자와 독보적인 비행능력으로 낯선 지역을 누비며, 사람들에게 소식을 전해준다. 위기 앞에서도 환한 미소를 잃지 않지만, 누군가의 메시지가 끝내 도착하지 못하는 일만큼은 절대 용납하지 않는다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "ASSASSIN",
  "role": "암살자",
  "rarity": "common",
  "pts": {
   "hp": 4,
   "atk": 9,
   "def": 5,
   "mag": 3,
   "spd": 9
  },
  "hp": 132,
  "atk": 9,
  "def": 5,
  "mag": 3,
  "spd": 9,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1020",
     "name": "급강하",
     "desc": "대상 방어력의 40%를 무시하고 적 하나에게 강한 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "pierce",
       "kwName": "관통",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.4
       }
      }
     ]
    },
    {
     "key": "SKL_2020",
     "name": "특급 배송",
     "desc": "적 하나에게 강한 피해를 입히고, 1턴간 속도와 무관하게 먼저 행동합니다. 같은 기간 동안 간파를 얻습니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 8,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "haste",
       "kwName": "우선",
       "grade": 1,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 1
       }
      },
      {
       "kw": "unbind",
       "kwName": "간파",
       "grade": 1,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 1
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5020",
    "name": "풍신소녀",
    "desc": "적 하나에게 방어력과 무관한 강한 피해를 입힙니다.",
    "element": "DIVINE",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 8,
    "speed": 0,
    "spCost": 3,
    "effects": []
   },
   "passive": {
    "key": "SKL_7020",
    "name": "편지왔습니다!",
    "desc": "매 라운드 개시 시 상대 진영 선두의 속도를 2턴간 2 감소시킵니다.",
    "element": null,
    "kind": "passive",
    "target": "enemy_one",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 2,
      "side": null,
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "amount": -2,
       "turns": 2,
       "stat": "spd"
      }
     }
    ]
   }
  },
  "skill": "풍신소녀",
  "res": {
   "st": "assets/characters/CHR_020_ST_F.png",
   "pt": "assets/characters/CHR_020_PT.png"
  }
 },
 {
  "id": "CHR_021",
  "name": "스콜라",
  "nameEn": "Schola",
  "species": "전갈",
  "desc": "치명적인 독을 품고 있는 전갈 여왕",
  "story": "최상위 포식자로 군림하고 있는 전갈 여왕, 수많은 탈피를 거쳐서 전갈에 특성을 유지한 채 인간형으로 진화했다 꼬리를 이용한 공격을 마무리에 이용하며, 극독에 중독되면 치명적이다 차가운 태도와 도도한 모습으로 다니며, 사냥감이 독에 중독되는 모습을 즐긴다.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "HUNTER",
  "role": "추격자",
  "rarity": "common",
  "pts": {
   "hp": 5,
   "atk": 9,
   "def": 5,
   "mag": 4,
   "spd": 7
  },
  "hp": 140,
  "atk": 9,
  "def": 5,
  "mag": 4,
  "spd": 7,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1021",
     "name": "유희",
     "desc": "적 하나에게 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 9의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 5,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 9,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2021",
     "name": "독 뿌리기",
     "desc": "적 전체에게 약한 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_all",
     "tier": 3,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 6,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5021",
    "name": "꿰뚫기",
    "desc": "대상 방어력의 40%를 무시하고 적 하나에게 강한 피해를 입힙니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 7,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "pierce",
      "kwName": "관통",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.4
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7021",
    "name": "가학성",
    "desc": "출혈이 걸린 적에게 가하는 피해량이 1.5배가 됩니다.",
    "element": null,
    "kind": "passive",
    "target": "enemy_one",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "target_has",
       "status": "bleed"
      },
      "chance": null,
      "args": {
       "mult": 1.5
      }
     }
    ]
   }
  },
  "skill": "꿰뚫기",
  "res": {
   "st": "assets/characters/CHR_021_ST_F.png",
   "pt": "assets/characters/CHR_021_PT.png"
  }
 },
 {
  "id": "CHR_022",
  "name": "시엘라",
  "nameEn": "Siella",
  "species": "은상어 · 클리오네",
  "desc": "..................뻐....끔....",
  "story": "어느날 갑자기 깊은 심해에서 나타난 신비로운 여자 아이 말수가 적은 편이다. 은상어 모티브",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "TRICKSTER",
  "role": "교란자",
  "rarity": "common",
  "pts": {
   "hp": 7,
   "atk": 5,
   "def": 5,
   "mag": 8,
   "spd": 5
  },
  "hp": 156,
  "atk": 5,
  "def": 5,
  "mag": 8,
  "spd": 5,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1022",
     "name": "심해의 부름",
     "desc": "대상 방어력의 40%를 무시하고 적 하나에게 강한 피해를 입힌 뒤, 가한 피해의 30%만큼 자신의 체력을 회복합니다. 그와 함께 자신에게 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 8,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "pierce",
       "kwName": "관통",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.4
       }
      },
      {
       "kw": "drain",
       "kwName": "흡혈",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.3
       }
      },
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 1,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 6,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2022",
     "name": "산제물",
     "desc": "자신에게 출혈을 부여하고, 3턴간 최대 체력의 35%만큼 흡수하는 보호막을 얻습니다. 출혈은 매 라운드 종료 시 9의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "self",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 2,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 9,
        "turns": 2
       }
      },
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 6,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.35,
        "turns": 3
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5022",
    "name": "강림",
    "desc": "자신에게 걸린 출혈 1점마다 피해량이 5%씩 늘어난 뒤, 자신을 제외한 전장 전체에게 강한 피해를 입힙니다. 아군도 대상에 포함됩니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "field_others",
    "tier": 7,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "offering",
      "kwName": "제물",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "per": 0.05
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7022",
    "name": "이형의 존재",
    "desc": "자신이 받는 출혈 피해가 0.5배로 줄어들고, 자신에게 걸리는 출혈은 지속이 끝나지 않습니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "clot",
      "kwName": "응혈",
      "grade": 2,
      "side": null,
      "trigger": "always",
      "when": null,
      "chance": null,
      "args": {
       "mult": 0.5
      }
     },
     {
      "kw": "linger",
      "kwName": "잔류",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": null,
      "chance": null,
      "args": {}
     }
    ]
   }
  },
  "skill": "강림",
  "res": {
   "st": "assets/characters/CHR_022_ST_F.png",
   "pt": "assets/characters/CHR_022_PT.png"
  }
 },
 {
  "id": "CHR_023",
  "name": "아우렐라 & 펠리아",
  "nameEn": "Aurela & Pellia",
  "species": "해파리",
  "desc": "하나 처럼 움직이는 해파리 자매",
  "story": "마비 능력을 이용해 깊은 바다로 내려가려하는 사람들을 해안가로 되돌려 놓거나 얕은 해안가에서 사람들의 다리에 마비를 거는 장난을 자주치는 사고뭉치 해파리 자매. 사람들을 마음대로 괴롭혀도 된다는 말에 혹해 재미를 찾아 로캣으로 오게 된다. 파란색이 동생 아우렐라, 분홍색이 언니 펠리아 이다.",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "GUARDIAN",
  "role": "보호자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 3,
   "def": 9,
   "mag": 5,
   "spd": 4
  },
  "hp": 172,
  "atk": 3,
  "def": 9,
  "mag": 5,
  "spd": 4,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1023",
     "name": "찰싹 때리기",
     "desc": "적 하나에게 약한 피해를 입히고, 2턴간 그 대상의 속도를 1 감소시킵니다. 자신은 최대 체력의 25%만큼 흡수하는 보호막을 얻습니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 3,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -1,
        "turns": 2,
        "stat": "spd"
       }
      },
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 4,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2023",
     "name": "해류 감기",
     "desc": "적 하나에게 약한 피해를 입히고, 2턴간 자신을 도발 상태로 만듭니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 3,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "taunt",
       "kwName": "도발",
       "grade": 2,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5023",
    "name": "마비 방출",
    "desc": "적 전체에게 약한 피해를 입히고 50% 확률로 1턴간 행동 불능 상태로 만듭니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 2,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "stun",
      "kwName": "기절",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": 50,
      "args": {
       "turns": 1
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7023",
    "name": "물컹거리는 몸",
    "desc": "자신에게 날아온 공격이 야성 속성이면 받는 피해량이 0.8배가 됩니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "skill_element",
       "element": "WILD"
      },
      "chance": null,
      "args": {
       "mult": 0.8
      }
     }
    ]
   }
  },
  "skill": "마비 방출",
  "res": {
   "st": "assets/characters/CHR_023_ST_F.png",
   "pt": "assets/characters/CHR_023_PT.png"
  }
 },
 {
  "id": "CHR_024",
  "name": "아젤리아",
  "nameEn": "Azalea",
  "species": "백조",
  "desc": "타락한 힘에 몸을 맡긴 백조",
  "story": "검게 물든 깃과 손목의 사슬은 빌려 쓴 힘이 남긴 자국이다. 그 힘은 오래가지 않아서, 일곱 라운드가 지나면 스스로 스러진다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "TRICKSTER",
  "role": "교란자",
  "rarity": "common",
  "pts": {
   "hp": 6,
   "atk": 3,
   "def": 8,
   "mag": 9,
   "spd": 4
  },
  "hp": 148,
  "atk": 3,
  "def": 8,
  "mag": 9,
  "spd": 4,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1024",
     "name": "타락의 빛",
     "desc": "대상 방어력의 55%를 무시하고 적 하나에게 치명적인 피해를 입힌 뒤, 1턴간 특수기 사용을 봉인합니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 9,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "pierce",
       "kwName": "관통",
       "grade": 3,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.55
       }
      },
      {
       "kw": "silence",
       "kwName": "침묵",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 1
       }
      }
     ]
    },
    {
     "key": "SKL_2024",
     "name": "검은 깃",
     "desc": "적 하나에게 피해를 입히고, 대상 최대 체력의 12%만큼을 방어와 무관한 고정 피해로 더합니다. 그 뒤 1턴간 행동 불능 상태로 만들고 투지를 4 획득합니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 5,
     "speed": 0,
     "spCost": 3,
     "effects": [
      {
       "kw": "siege",
       "kwName": "공성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.12
       }
      },
      {
       "kw": "stun",
       "kwName": "기절",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 1
       }
      },
      {
       "kw": "charge",
       "kwName": "투지획득",
       "grade": 4,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 4
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5024",
    "name": "심판의 창",
    "desc": "적 전체에게 강한 피해를 입히고 1턴간 행동 불능 상태로 만듭니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 8,
    "speed": 0,
    "spCost": 6,
    "effects": [
     {
      "kw": "stun",
      "kwName": "기절",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7024",
    "name": "한정된 시간",
    "desc": "8라운드부터는 매 라운드 개시 시 스스로 물러나 전투불능이 됩니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "retire",
      "kwName": "퇴장",
      "grade": 1,
      "side": null,
      "trigger": "round_start",
      "when": {
       "if": "round_after",
       "round": 8
      },
      "chance": null,
      "args": {}
     }
    ]
   }
  },
  "skill": "심판의 창",
  "res": {
   "st": "assets/characters/CHR_024_ST_F.png",
   "pt": "assets/characters/CHR_024_PT.png"
  }
 },
 {
  "id": "CHR_025",
  "name": "알코",
  "nameEn": "Alco",
  "species": "범고래",
  "desc": "바다의 무법자",
  "story": "내가 바로 대해적 알코! 나는 자비가 없지! 조심하라고!",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "CHARGER",
  "role": "돌격자",
  "rarity": "common",
  "pts": {
   "hp": 8,
   "atk": 8,
   "def": 5,
   "mag": 4,
   "spd": 5
  },
  "hp": 164,
  "atk": 8,
  "def": 5,
  "mag": 4,
  "spd": 5,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1025",
     "name": "범고래 슬래쉬",
     "desc": "적 하나에게 치명적인 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 9,
     "speed": 0,
     "spCost": 0,
     "effects": []
    },
    {
     "key": "SKL_2025",
     "name": "범고래 크래쉬",
     "desc": "적 전체에게 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_all",
     "tier": 5,
     "speed": 0,
     "spCost": 1,
     "effects": []
    }
   ],
   "ultimate": {
    "key": "SKL_5025",
    "name": "범고래 스트라이크",
    "desc": "대상이 잃은 체력에 비례해 최대 80%까지 피해량이 증가한 뒤, 적 하나에게 피해를 입힙니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 6,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "execute",
      "kwName": "처형",
      "grade": 3,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "bonus": 0.8
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7025",
    "name": "리커버리",
    "desc": "전장에서 로캣몬이 전투불능이 될 때마다 자신의 체력을 최대치의 20%만큼 회복합니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "heal",
      "kwName": "회복",
      "grade": 3,
      "side": null,
      "trigger": "on_fall",
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.2
      }
     }
    ]
   }
  },
  "skill": "범고래 스트라이크",
  "res": {
   "st": "assets/characters/CHR_025_ST_F.png",
   "pt": "assets/characters/CHR_025_PT.png"
  }
 },
 {
  "id": "CHR_026",
  "name": "암카라시",
  "nameEn": "amkalasi",
  "species": "향유고래 · 범고래 · 백상아리",
  "desc": "고대 괴물 로캣몬",
  "story": "잠드러있던 전설이 인간들에 의해서 깨어난다 고대 바다의 지배자인 암카라시는 강력한 갑피와 심해에서도 먹이를 찾아 헤메며 상어류 로캣몬 기가로돈을 포식했다고도 전해진다. 강력한 생멸력을 갖춘존재이며 어둠에서 갑자기 나타나 사냥한다고 전해진다 존재를 알아차렸다면 이미 늦은것",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "GUARDIAN",
  "role": "보호자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 4,
   "def": 8,
   "mag": 6,
   "spd": 3
  },
  "hp": 172,
  "atk": 4,
  "def": 8,
  "mag": 6,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1026",
     "name": "포식",
     "desc": "적 하나에게 피해를 입히고, 가한 피해의 20%만큼 자신의 체력을 회복합니다. 이어서 2턴간 그 대상이 받는 회복량을 50%로 줄입니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 5,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "drain",
       "kwName": "흡혈",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.2
       }
      },
      {
       "kw": "blight",
       "kwName": "부패",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.5,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2026",
     "name": "심해의 압력",
     "desc": "적 전체에게 약한 피해를 입히고, 2턴간 자신을 도발 상태로 만듭니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_all",
     "tier": 3,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "taunt",
       "kwName": "도발",
       "grade": 2,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5026",
    "name": "고대의 포효",
    "desc": "적 전체에게 약한 피해를 입히고, 2턴간 공격력을 1 감소시킵니다. 가한 피해의 20%만큼 자신의 체력을 회복합니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 4,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": -1,
       "turns": 2,
       "stat": "atk"
      }
     },
     {
      "kw": "drain",
      "kwName": "흡혈",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.2
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7026",
    "name": "원시의 포식",
    "desc": "피해를 입을 때마다 전투가 끝날 때까지 자신의 공격력이 1, 방어력이 1 증가합니다. 각각 10까지 쌓입니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "whet",
      "kwName": "벼림",
      "grade": 5,
      "side": "self",
      "trigger": "on_hurt",
      "when": null,
      "chance": null,
      "args": {
       "amount": 1,
       "upto": 10,
       "stat": "atk"
      }
     },
     {
      "kw": "whet",
      "kwName": "벼림",
      "grade": 5,
      "side": "self",
      "trigger": "on_hurt",
      "when": null,
      "chance": null,
      "args": {
       "amount": 1,
       "upto": 10,
       "stat": "def"
      }
     }
    ]
   }
  },
  "skill": "고대의 포효",
  "res": {
   "st": "assets/characters/CHR_026_ST_F.png",
   "pt": "assets/characters/CHR_026_PT.png"
  }
 },
 {
  "id": "CHR_027",
  "name": "연나연",
  "nameEn": "",
  "species": "깡충거미",
  "desc": "목장을 운영하는 거미 소녀",
  "story": "목장 운영비가 너무 많이 들어 로캣에서 우승해서 운영비를 충당할거야!",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "HUNTER",
  "role": "추격자",
  "rarity": "common",
  "pts": {
   "hp": 7,
   "atk": 7,
   "def": 4,
   "mag": 3,
   "spd": 9
  },
  "hp": 156,
  "atk": 7,
  "def": 4,
  "mag": 3,
  "spd": 9,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1027",
     "name": "독니 찌르기",
     "desc": "적 하나에게 피해를 입히고, 2턴간 그 대상의 속도를 1 감소시킨 뒤 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -1,
        "turns": 2,
        "stat": "spd"
       }
      },
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 6,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2027",
     "name": "거미줄",
     "desc": "적 전체에게 약한 피해를 입히고, 2턴간 속도를 1 감소시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_all",
     "tier": 2,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -1,
        "turns": 2,
        "stat": "spd"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5027",
    "name": "거미줄 속박",
    "desc": "적 하나에게 강한 피해를 입히고, 2턴간 그 대상의 속도를 2 감소시킨 뒤 출혈을 부여합니다. 출혈은 매 라운드 종료 시 9의 고정 피해를 2턴간 입힙니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 7,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": -2,
       "turns": 2,
       "stat": "spd"
      }
     },
     {
      "kw": "bleed",
      "kwName": "출혈",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 9,
       "turns": 2
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7027",
    "name": "카우걸 소녀!!",
    "desc": "대상이 해로운 상태를 하나라도 두르고 있으면 그 대상에게 가하는 피해량이 1.5배가 됩니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "target_hexed"
      },
      "chance": null,
      "args": {
       "mult": 1.5
      }
     }
    ]
   }
  },
  "skill": "거미줄 속박",
  "res": {
   "st": "assets/characters/CHR_027_ST_F.png",
   "pt": "assets/characters/CHR_027_PT.png"
  }
 },
 {
  "id": "CHR_028",
  "name": "연화",
  "nameEn": "Serenfin",
  "species": "비단잉어",
  "desc": "온화하고 차분한 비단잉어 로캣몬",
  "story": "아침 햇살이 비치는 시간, 유유히 수면 위로 올라와 햇빛을 받는 것을 좋아한다. 아름답고 신비로운 자태에 넋을 잃고 가까이서 보려 몸을 기울이다 물에 빠진 이들이 셀 수 없이 많다고 전해진다.",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "HEALER",
  "role": "치유자",
  "rarity": "common",
  "pts": {
   "hp": 6,
   "atk": 6,
   "def": 6,
   "mag": 9,
   "spd": 3
  },
  "hp": 148,
  "atk": 6,
  "def": 6,
  "mag": 9,
  "spd": 3,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1028",
     "name": "뺨때리기",
     "desc": "적 하나에게 강한 피해를 입히고, 체력이 가장 낮은 아군에게 2턴간 최대 체력의 15%만큼 흡수하는 보호막을 부여합니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 3,
       "side": "ally_weakest",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.15,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2028",
     "name": "보듬는 물결",
     "desc": "체력이 가장 낮은 아군의 체력을 최대치의 40%만큼 회복시킵니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "ally_weakest",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "heal",
       "kwName": "회복",
       "grade": 5,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.4
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5028",
    "name": "다정한 인사",
    "desc": "3턴간 아군 전체의 공격력을 3 증가시킵니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "ally_all",
    "tier": 0,
    "speed": 0,
    "spCost": 2,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 4,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 3,
       "turns": 3,
       "stat": "atk"
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7028",
    "name": "유영",
    "desc": "매 라운드 개시 시 보호막을 두른 아군의 공격력을 2턴간 2 증가시킵니다.",
    "element": null,
    "kind": "passive",
    "target": "ally_weakest",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 2,
      "side": "ally",
      "trigger": "round_start",
      "when": {
       "if": "target_has",
       "status": "shield"
      },
      "chance": null,
      "args": {
       "amount": 2,
       "turns": 2,
       "stat": "atk"
      }
     }
    ]
   }
  },
  "skill": "다정한 인사",
  "res": {
   "st": "assets/characters/CHR_028_ST_F.png",
   "pt": "assets/characters/CHR_028_PT.png"
  }
 },
 {
  "id": "CHR_029",
  "name": "오카미",
  "nameEn": "",
  "species": "늑대",
  "desc": "동쪽 대륙의 늑대수인",
  "story": "동쪽 대륙에는 달을 신성시 하는 일족이 있다. 운명의 상대를 찾기 위해 로캣의 소문을 듣고 찾아왔다.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "CHARGER",
  "role": "돌격자",
  "rarity": "common",
  "pts": {
   "hp": 5,
   "atk": 6,
   "def": 5,
   "mag": 6,
   "spd": 8
  },
  "hp": 140,
  "atk": 6,
  "def": 5,
  "mag": 6,
  "spd": 8,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1029",
     "name": "칼등치기",
     "desc": "적 하나를 2회 연속으로 타격하며, 타격마다 약한 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "multihit",
       "kwName": "연타",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "hits": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2029",
     "name": "달빛 벼리기",
     "desc": "2턴간 자신의 공격력을 2 증가시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "self",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 2,
        "stat": "atk"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5029",
    "name": "한 순간의 달빛",
    "desc": "적 하나에게 강한 피해를 입히고, 2턴간 그 대상의 방어력을 2 감소시킵니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 7,
    "speed": 0,
    "spCost": 2,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": -2,
       "turns": 2,
       "stat": "def"
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7029",
    "name": "달의 여전사",
    "desc": "5라운드부터는 가하는 피해량이 1.5배가 됩니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "round_after",
       "round": 5
      },
      "chance": null,
      "args": {
       "mult": 1.5
      }
     }
    ]
   }
  },
  "skill": "한 순간의 달빛",
  "res": {
   "st": "assets/characters/CHR_029_ST_F.png",
   "pt": "assets/characters/CHR_029_PT.png"
  }
 },
 {
  "id": "CHR_030",
  "name": "울브",
  "nameEn": "wolve",
  "species": "갈기늑대",
  "desc": "누구에게도 마음을 열지 않는 슬픈 늑대",
  "story": "울브는 무리 생활을 하지 않는 개과 로캣몬이다. 설령 가족이라 하더라도 믿을 수 없다. 세상은 나 혼자 살아가는 것이니까. 배신의 아픔을 뼈저리게 알고 있던 울브는 늘 그렇게 다짐해왔다. 어느 날 마주친 인간이 말했다. \"달라지고 싶다면 로캣에서 만나자.\" 달라지고 싶지 않다. 난 세상을 아니까. 그럼에도 울브는 로캣으로 향했다. 그저 재밌는 스포츠에 참가하러 갈 뿐이라고 스스로를 속이면서.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "ASSASSIN",
  "role": "암살자",
  "rarity": "common",
  "pts": {
   "hp": 6,
   "atk": 8,
   "def": 4,
   "mag": 3,
   "spd": 9
  },
  "hp": 148,
  "atk": 8,
  "def": 4,
  "mag": 3,
  "spd": 9,
  "priority": 0,
  "locked": false,
  "skills": {
   "basic": [
    {
     "key": "SKL_1030",
     "name": "발차기",
     "desc": "적 하나에게 치명적인 피해를 입힌 뒤 투지를 1 획득합니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 9,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "charge",
       "kwName": "투지획득",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1
       }
      }
     ]
    },
    {
     "key": "SKL_2030",
     "name": "사냥 개시",
     "desc": "적 하나에게 피해를 입히고, 2턴간 자신의 공격력을 2 증가시키며 3턴간 간파를 얻습니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 5,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 2,
        "stat": "atk"
       }
      },
      {
       "kw": "unbind",
       "kwName": "간파",
       "grade": 3,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 3
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5030",
    "name": "먹잇감 발견",
    "desc": "대상 방어력의 25%를 무시하고, 대상이 잃은 체력에 비례해 최대 60%까지 강한 피해량이 증가한 뒤 적 하나에게 피해를 입힙니다. 그 뒤 투지를 1 획득합니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 7,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "charge",
      "kwName": "투지획득",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 1
      }
     },
     {
      "kw": "pierce",
      "kwName": "관통",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.25
      }
     },
     {
      "kw": "execute",
      "kwName": "처형",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "bonus": 0.6
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7030",
    "name": "위기 감지",
    "desc": "자신의 공격력이 각성으로 올라 있으면, 적을 때릴 때마다 가한 피해의 30%만큼 체력을 회복하고 그 대상에게 출혈을 부여합니다. 출혈은 매 라운드 종료 시 9의 고정 피해를 2턴간 입힙니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "drain",
      "kwName": "흡혈",
      "grade": 2,
      "side": null,
      "trigger": "on_strike",
      "when": {
       "if": "self_boosted"
      },
      "chance": null,
      "args": {
       "ratio": 0.3
      }
     },
     {
      "kw": "bleed",
      "kwName": "출혈",
      "grade": 2,
      "side": null,
      "trigger": "on_strike",
      "when": {
       "if": "self_boosted"
      },
      "chance": null,
      "args": {
       "amount": 9,
       "turns": 2
      }
     }
    ]
   }
  },
  "skill": "먹잇감 발견",
  "res": {
   "st": "assets/characters/CHR_030_ST_F.png",
   "pt": "assets/characters/CHR_030_PT.png"
  }
 },
 {
  "id": "CHR_031",
  "name": "울피",
  "nameEn": "Wolfie",
  "species": "늑대",
  "desc": "과거 지하 결투장의 괴물이라 불렸던 야생의 늑대 수인, 이제는 자신이 지키고 싶은 동료와 함께 싸우기 위해 경기장에 선다.",
  "story": "어린 시절부터 지하 결투장에 갇혀 싸움만 하며 살아온 수인. 늑대의 뛰어난 후각과 청각, 폭발적인 신체능력을 지닌 인간형이다. 지하 결투장이 폐지되면서 자유로워진 그, 이제 본인의 의지로 배틀에 참가한다.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "HUNTER",
  "role": "추격자",
  "rarity": "common",
  "pts": {
   "hp": 7,
   "atk": 8,
   "def": 3,
   "mag": 3,
   "spd": 9
  },
  "hp": 156,
  "atk": 8,
  "def": 3,
  "mag": 3,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1031",
     "name": "전광석화",
     "desc": "적 하나에게 강한 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 8,
     "speed": 0,
     "spCost": 0,
     "effects": []
    },
    {
     "key": "SKL_2031",
     "name": "몰아치기",
     "desc": "적 하나에게 약한 피해를 입히고, 1턴간 특수기 사용을 봉인한 뒤 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 4,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "silence",
       "kwName": "침묵",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 1
       }
      },
      {
       "kw": "bleed",
       "kwName": "출혈",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 6,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5031",
    "name": "마구 찌르기",
    "desc": "적 하나를 3회 연속으로 타격하며, 타격마다 피해를 입힙니다. 그 뒤 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 6,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "multihit",
      "kwName": "연타",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "hits": 3
      }
     },
     {
      "kw": "bleed",
      "kwName": "출혈",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 6,
       "turns": 2
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7031",
    "name": "불굴의 투지",
    "desc": "자신이 전투불능이 되면 적 전체에게 약한 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
    "element": "WILD",
    "kind": "passive",
    "target": "enemy_all",
    "tier": 3,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "bleed",
      "kwName": "출혈",
      "grade": 1,
      "side": null,
      "trigger": "on_death",
      "when": null,
      "chance": null,
      "args": {
       "amount": 6,
       "turns": 2
      }
     }
    ]
   }
  },
  "skill": "마구 찌르기",
  "res": {
   "st": "assets/characters/CHR_031_ST_F.png",
   "pt": "assets/characters/CHR_031_PT.png"
  }
 },
 {
  "id": "CHR_032",
  "name": "카라",
  "nameEn": "Kara",
  "species": "까마귀",
  "desc": "절대로 용서하지 않겠어... 복수하겠어...!",
  "story": "인간과 동물 사이에서 태어난 새로운 종족, 로캣몬. 그들은 인간의 특징을 강하게 물려받은 '인간형 로캣몬'과 동물의 특징을 강하게 물려받은 '동물형 로캣몬'으로 나뉘었습니다. 두 종족은 서로의 존재를 인정하지 않았고, 결국 돌이킬 수 없는 전쟁으로 번지고 말았으며 카라는 자기가 살던 고향의 유일한 생존자가 되었습니다. 동물형 로캣몬에게 복수의 칼날을 갈기 위해 카라는 닌자 암살부대에 들어갑니다. 그녀의 유일한 목표는 하나입니다. 자신의 모든 것을 빼앗아간 동물형 로캣몬에게 복수하는 것.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "HUNTER",
  "role": "추격자",
  "rarity": "common",
  "pts": {
   "hp": 6,
   "atk": 9,
   "def": 3,
   "mag": 3,
   "spd": 9
  },
  "hp": 148,
  "atk": 9,
  "def": 3,
  "mag": 3,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1032",
     "name": "3연속 찌르기",
     "desc": "적 하나를 3회 연속으로 타격하며, 타격마다 약한 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 3,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "multihit",
       "kwName": "연타",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "hits": 3
       }
      }
     ]
    },
    {
     "key": "SKL_2032",
     "name": "벼린 칼날",
     "desc": "2턴간 자신의 공격력을 2 증가시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "self",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 2,
        "stat": "atk"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5032",
    "name": "연막 투척",
    "desc": "적 전체에게 약한 피해를 입히고 1턴간 공격이 빗나가게 만듭니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 4,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "blind",
      "kwName": "실명",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7032",
    "name": "복수의 칼날",
    "desc": "매 라운드 개시 시 상대 진영 선두에 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
    "element": null,
    "kind": "passive",
    "target": "enemy_one",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "bleed",
      "kwName": "출혈",
      "grade": 1,
      "side": null,
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "amount": 6,
       "turns": 2
      }
     }
    ]
   }
  },
  "skill": "연막 투척",
  "res": {
   "st": "assets/characters/CHR_032_ST_F.png",
   "pt": "assets/characters/CHR_032_PT.png"
  }
 },
 {
  "id": "CHR_033",
  "name": "카르노가디안",
  "nameEn": "Carnoguardian",
  "species": "알비노 도마뱀",
  "desc": "공룡 카르노타우루스",
  "story": "남아메리카 대륙에서 서식하다 강자를 찾아 찾아왔다.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "GUARDIAN",
  "role": "보호자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 5,
   "def": 9,
   "mag": 3,
   "spd": 4
  },
  "hp": 172,
  "atk": 5,
  "def": 9,
  "mag": 3,
  "spd": 4,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1033",
     "name": "방어",
     "desc": "적 하나에게 피해를 입히고 2턴간 그 대상이 받는 회복량을 50%로 줄입니다. 이어서 2턴간 그 대상이 받는 피해량을 15% 증가시키고, 3턴간 자신의 방어력을 2 증가시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "blight",
       "kwName": "부패",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.5,
        "turns": 2
       }
      },
      {
       "kw": "mark",
       "kwName": "표식",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.15,
        "turns": 2
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 3,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 3,
        "stat": "def"
       }
      }
     ]
    },
    {
     "key": "SKL_2033",
     "name": "방벽",
     "desc": "아군 하나를 2턴간 수호합니다. 수호받는 아군을 겨눈 단일 공격은 자신이 대신 받고, 자신은 최대 체력의 25%만큼 흡수하는 보호막을 얻습니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "ally_one",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "shelter",
       "kwName": "수호",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "turns": 2
       }
      },
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 4,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5033",
    "name": "총공세",
    "desc": "적 하나에게 약한 피해를 입히고, 대상 최대 체력의 16%만큼을 방어와 무관한 고정 피해로 더합니다. 이어서 2턴간 그 대상이 받는 피해량을 25% 증가시키고, 전투가 끝날 때까지 자신의 방어력을 2, 체력을 2 증가시킵니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 4,
    "speed": 0,
    "spCost": 2,
    "effects": [
     {
      "kw": "siege",
      "kwName": "공성",
      "grade": 3,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.16
      }
     },
     {
      "kw": "mark",
      "kwName": "표식",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.25,
       "turns": 2
      }
     },
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 8,
      "side": "self",
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 2,
       "lasting": true,
       "stat": "def"
      }
     },
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 8,
      "side": "self",
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 2,
       "lasting": true,
       "stat": "hp"
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7033",
    "name": "불굴",
    "desc": "피해를 입으면 전투 중 한 번 버팀을 얻습니다. 버팀으로 견뎌 내면 자신의 체력을 최대치의 40%만큼 회복합니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "endure",
      "kwName": "버팀",
      "grade": 1,
      "side": null,
      "trigger": "on_hurt",
      "when": null,
      "chance": null,
      "args": {
       "turns": 2
      }
     },
     {
      "kw": "heal",
      "kwName": "회복",
      "grade": 5,
      "side": null,
      "trigger": "on_endure",
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.4
      }
     }
    ]
   }
  },
  "skill": "총공세",
  "res": {
   "st": "assets/characters/CHR_033_ST_F.png",
   "pt": "assets/characters/CHR_033_PT.png"
  }
 },
 {
  "id": "CHR_034",
  "name": "카이론",
  "nameEn": "Cairon",
  "species": "사자",
  "desc": "사자와 염소, 뱀의 본능을 한 몸에 지닌 이형의 수인",
  "story": "여러 동물의 특징을 지녀 '괴물'이라 불리던 그. \n그의 괴물 같은 모습과 특별한 능력으로 로캣배틀을 지배하려 한다.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "CLOSER",
  "role": "결전자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 8,
   "def": 7,
   "mag": 3,
   "spd": 3
  },
  "hp": 172,
  "atk": 8,
  "def": 7,
  "mag": 3,
  "spd": 3,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1034",
     "name": "발굽 찍기",
     "desc": "적 하나에게 피해를 입히고, 2턴간 그 대상이 받는 피해량을 25% 증가시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "mark",
       "kwName": "표식",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2034",
     "name": "사냥의 시간",
     "desc": "대상이 잃은 체력에 비례해 최대 40%까지 강한 피해량이 증가한 뒤, 체력이 가장 낮은 적에게 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_weakest",
     "tier": 7,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "execute",
       "kwName": "처형",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "bonus": 0.4
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5034",
    "name": "맹수 참격",
    "desc": "적 하나에게 강한 피해를 입히고 출혈을 부여합니다. 출혈은 매 라운드 종료 시 6의 고정 피해를 2턴간 입힙니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 7,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "bleed",
      "kwName": "출혈",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "amount": 6,
       "turns": 2
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7034",
    "name": "거대한 위협",
    "desc": "대상의 체력이 자신보다 낮을 때는 그 대상에게 가하는 피해량이 1.5배가 됩니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "amplify",
      "kwName": "특효",
      "grade": 1,
      "side": null,
      "trigger": "always",
      "when": {
       "if": "target_weaker"
      },
      "chance": null,
      "args": {
       "mult": 1.5
      }
     }
    ]
   }
  },
  "skill": "맹수 참격",
  "res": {
   "st": "assets/characters/CHR_034_ST_F.png",
   "pt": "assets/characters/CHR_034_PT.png"
  }
 },
 {
  "id": "CHR_035",
  "name": "코스모 도리스",
  "nameEn": "Cosmo Doris",
  "species": "갯민숭달팽이",
  "desc": "선수 대기줄이었다고? 관중석 예매 아니었어...?",
  "story": "만타가오리 수인과 크로모도리스 수인의 혼혈. 호기심 많은 덜렁이. 로캣 대회를 동경하던 코스모는 가진 돈을 탈탈 털어 예매에 성공했다! 그러나 관중석이 아닌 선수 등록을 했다는 사실을 경기 당일에 알게 되는데...",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "TRICKSTER",
  "role": "교란자",
  "rarity": "common",
  "pts": {
   "hp": 5,
   "atk": 6,
   "def": 4,
   "mag": 6,
   "spd": 9
  },
  "hp": 140,
  "atk": 6,
  "def": 4,
  "mag": 6,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1035",
     "name": "쟤가 나 괴롭혀!",
     "desc": "적 하나가 2턴간 받는 피해량을 25% 증가시키고, 공격력을 2, 속도를 2 감소시킵니다. 같은 기간 동안 그 대상이 받는 회복량을 35%로 줄입니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 0,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "mark",
       "kwName": "표식",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -2,
        "turns": 2,
        "stat": "atk"
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -2,
        "turns": 2,
        "stat": "spd"
       }
      },
      {
       "kw": "blight",
       "kwName": "부패",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.35,
        "turns": 2
       }
      }
     ]
    },
    {
     "key": "SKL_2035",
     "name": "집에 갈래!",
     "desc": "적 전체가 2턴간 받는 피해량을 25% 증가시키고, 공격력을 2, 속도를 2 감소시킵니다. 같은 기간 동안 받는 회복량은 35%로 줄어듭니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_all",
     "tier": 0,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "mark",
       "kwName": "표식",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.25,
        "turns": 2
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -2,
        "turns": 2,
        "stat": "atk"
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -2,
        "turns": 2,
        "stat": "spd"
       }
      },
      {
       "kw": "blight",
       "kwName": "부패",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.35,
        "turns": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5035",
    "name": "엄마한테 이를 거야!",
    "desc": "적 전체에게 피해를 입히고 1턴간 행동 불능 상태로 만듭니다. 아군 전체는 2턴간 최대 체력의 25%만큼 흡수하는 보호막을 얻습니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 6,
    "speed": 0,
    "spCost": 6,
    "effects": [
     {
      "kw": "stun",
      "kwName": "기절",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     },
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 4,
      "side": "ally",
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.25,
       "turns": 2
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7035",
    "name": "NG!",
    "desc": "전투 개시 시 3턴간 최대 체력의 35%만큼 흡수하는 보호막을 얻습니다. 자신이 전투불능이 되면 적 전체를 1턴간 행동 불능 상태로 만듭니다.",
    "element": null,
    "kind": "passive",
    "target": "enemy_all",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 6,
      "side": "self",
      "trigger": "battle_start",
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.35,
       "turns": 3
      }
     },
     {
      "kw": "stun",
      "kwName": "기절",
      "grade": 1,
      "side": null,
      "trigger": "on_death",
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     }
    ]
   }
  },
  "skill": "엄마한테 이를 거야!",
  "res": {
   "st": "assets/characters/CHR_035_ST_F.png",
   "pt": "assets/characters/CHR_035_PT.png"
  }
 },
 {
  "id": "CHR_036",
  "name": "키르유",
  "nameEn": "kirryou",
  "species": "파리지옥",
  "desc": "사랑하기에 먹었을 뿐이야!",
  "story": "키르유를 너무나 사랑한 남자가 있었다. 그는 자신의 모든 것을 키르유에게 양보했고, 언제나 자신의 모든 사랑과 애정을 쏟아부었다. 곧 얼마 지나지 않아 남자는 실종되었다. 뒤늦게 남자를 찾고자 집 안에 들어선 사람들은, 키르유를 마주치고 나서야 사건의 전말을 이해하고 말았다. 그들이 본 키르유는 어느 누구보다 황홀해보이는 표정을 짓고 있었다.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "TRICKSTER",
  "role": "교란자",
  "rarity": "common",
  "pts": {
   "hp": 8,
   "atk": 5,
   "def": 6,
   "mag": 7,
   "spd": 4
  },
  "hp": 164,
  "atk": 5,
  "def": 6,
  "mag": 7,
  "spd": 4,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1036",
     "name": "나도 널 사랑해",
     "desc": "적 하나에게 약한 피해를 입히고 자신의 체력을 최대치의 20%만큼 회복합니다. 2턴간 그 대상의 공격력을 2 감소시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 4,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "heal",
       "kwName": "회복",
       "grade": 3,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.2
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -2,
        "turns": 2,
        "stat": "atk"
       }
      }
     ]
    },
    {
     "key": "SKL_2036",
     "name": "너도 날 사랑해?",
     "desc": "적 하나에게 약한 피해를 입히고, 그 대상의 이로운 상태를 모두 흡수합니다. 흡수한 하나마다 자신의 체력을 최대치의 15%만큼 회복합니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 4,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "devour",
       "kwName": "포식",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.15
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5036",
    "name": "그럼 잘 먹겠습니다!",
    "desc": "적 하나에게 강한 피해를 입히고 가한 피해의 40%만큼 자신의 체력을 회복합니다. 이어서 그 대상의 이로운 상태를 모두 흡수하고, 흡수한 하나마다 최대치의 15%만큼 더 회복합니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 7,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "drain",
      "kwName": "흡혈",
      "grade": 3,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.4
      }
     },
     {
      "kw": "devour",
      "kwName": "포식",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.15
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7036",
    "name": "거짓말쟁이!",
    "desc": "자신에게 걸린 해로운 상태 하나마다 자신이 입히는 피해량이 20%씩 증가합니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "spite",
      "kwName": "원한",
      "grade": 2,
      "side": null,
      "trigger": "always",
      "when": null,
      "chance": null,
      "args": {
       "per": 0.2
      }
     }
    ]
   }
  },
  "skill": "그럼 잘 먹겠습니다!",
  "res": {
   "st": "assets/characters/CHR_036_ST_F.png",
   "pt": "assets/characters/CHR_036_PT.png"
  }
 },
 {
  "id": "CHR_037",
  "name": "파르바",
  "nameEn": "Parva",
  "species": "꼬마비로드갯민숭달팽이",
  "desc": "천진한 미소 뒤에 맹독과 계산을 숨긴 채, 물을 응축해 전장을 지배하는 해 타입 수인.",
  "story": "암살이 주특기였던 갯민숭달팽이 종족은 평화와 화합의 시대가 도래하면서 한동안 조용히 살았다. 갯민숭달팽이 종족의 파르바는 자신의 주특기인 독 활용과 암살능력을 활용하여 로캣 배틀에 참가하고자 한다 이 종족은 외견과는 다르게 매우 사나운 성격이라는 것을 알아야 한다",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "ASSASSIN",
  "role": "암살자",
  "rarity": "common",
  "pts": {
   "hp": 6,
   "atk": 3,
   "def": 4,
   "mag": 8,
   "spd": 9
  },
  "hp": 148,
  "atk": 3,
  "def": 4,
  "mag": 8,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1037",
     "name": "잭 더 리퍼",
     "desc": "적 하나에게 강한 피해를 입히고, 2턴간 그 대상의 마력을 1 감소시킵니다. 같은 기간 동안 자신의 마력은 1 증가합니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 8,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": -1,
        "turns": 2,
        "stat": "mag"
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1,
        "turns": 2,
        "stat": "mag"
       }
      }
     ]
    },
    {
     "key": "SKL_2037",
     "name": "응축",
     "desc": "적 하나에게 피해를 입히고, 3턴간 자신의 마력을 2 증가시킵니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "self",
     "tier": 6,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 3,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 3,
        "stat": "mag"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5037",
    "name": "샤를로트 코르데",
    "desc": "자신의 마력이 대상보다 앞선 1점마다 피해량이 15%씩 늘어난 뒤, 적 하나에게 강한 피해를 입힙니다. 그 뒤 1턴간 간파를 얻습니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 8,
    "speed": 0,
    "spCost": 4,
    "effects": [
     {
      "kw": "gap",
      "kwName": "격차",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "per": 0.15
      }
     },
     {
      "kw": "unbind",
      "kwName": "간파",
      "grade": 1,
      "side": "self",
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7037",
    "name": "마타 하리",
    "desc": "매 라운드 개시 시 전투가 끝날 때까지 자신의 마력이 1 증가하며, 4까지 쌓입니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "whet",
      "kwName": "벼림",
      "grade": 2,
      "side": "self",
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "amount": 1,
       "upto": 4,
       "stat": "mag"
      }
     }
    ]
   }
  },
  "skill": "샤를로트 코르데",
  "res": {
   "st": "assets/characters/CHR_037_ST_F.png",
   "pt": "assets/characters/CHR_037_PT.png"
  }
 },
 {
  "id": "CHR_038",
  "name": "피코",
  "nameEn": "Picko",
  "species": "공작 · 물총새",
  "desc": "아...안녕하세요....자..잘 부탁드려요...푸드덕(부끄러운 톤으로 날개를 퍼덕이며)",
  "story": "새를 사랑한 누군가의 집념이 담겨 있습니다. 공작+물총새를 모티브로 제작. 물고기를 좋아합니다. 부끄럼이 많지만 물고기가 있으면 환장해 버립니다. 자신의 아름다운 날개를 자랑스러워 하지만 부끄럼이 많아서 뽐내지는 않습니다. 은근히 칭찬 받으면 기뻐한다는 설정",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "ASSASSIN",
  "role": "암살자",
  "rarity": "common",
  "pts": {
   "hp": 3,
   "atk": 9,
   "def": 5,
   "mag": 4,
   "spd": 9
  },
  "hp": 124,
  "atk": 9,
  "def": 5,
  "mag": 4,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1038",
     "name": "다이빙 어택",
     "desc": "적 하나에게 치명적인 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 9,
     "speed": 0,
     "spCost": 0,
     "effects": []
    },
    {
     "key": "SKL_2038",
     "name": "급락",
     "desc": "적 하나에게 피해를 입히고, 3턴간 자신의 공격력을 2 증가시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 3,
       "side": "self",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 3,
        "stat": "atk"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5038",
    "name": "일격필살",
    "desc": "대상 방어력의 40%를 무시하고 적 하나에게 치명적인 피해를 입힌 뒤, 1턴간 간파를 얻습니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 10,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "pierce",
      "kwName": "관통",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.4
      }
     },
     {
      "kw": "unbind",
      "kwName": "간파",
      "grade": 1,
      "side": "self",
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7038",
    "name": "보석 깃털",
    "desc": "전투 개시 시 2턴간 최대 체력의 30%만큼 흡수하는 보호막을 얻고, 적을 쓰러뜨릴 때마다 같은 보호막을 다시 얻습니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 5,
      "side": "self",
      "trigger": "battle_start",
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.3,
       "turns": 2
      }
     },
     {
      "kw": "shield",
      "kwName": "보호",
      "grade": 5,
      "side": "self",
      "trigger": "on_kill",
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.3,
       "turns": 2
      }
     }
    ]
   }
  },
  "skill": "일격필살",
  "res": {
   "st": "assets/characters/CHR_038_ST_F.png",
   "pt": "assets/characters/CHR_038_PT.png"
  }
 },
 {
  "id": "CHR_039",
  "name": "하따",
  "nameEn": "",
  "species": "하늘다람쥐",
  "desc": "낙하산을 메고 뛰어내리는 하늘다람쥐가 있다는 소문이 있다..",
  "story": "원래 피막을 통해 하늘을 날던 하늘다람쥐 종족은, 본성의 여신 '디벨로'로 부터 인간화와 문명을 수여받게 되면서 복장 통일을 위해 피막이 없어지게 되었다. 그러나 여전히 하따는 새로 받은 문명을 이용해 다시 하늘을 날려는 꿈을 꾸고 있다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "ASSASSIN",
  "role": "암살자",
  "rarity": "common",
  "pts": {
   "hp": 6,
   "atk": 9,
   "def": 3,
   "mag": 3,
   "spd": 9
  },
  "hp": 148,
  "atk": 9,
  "def": 3,
  "mag": 3,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1039",
     "name": "가방으로 때리기",
     "desc": "적 하나에게 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 0,
     "effects": []
    },
    {
     "key": "SKL_2039",
     "name": "낙하 준비",
     "desc": "2턴간 자신의 공격력을 2 증가시킵니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "self",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 2,
        "stat": "atk"
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5039",
    "name": "람쥐썬더",
    "desc": "적 하나를 3회 연속으로 타격하며, 타격마다 약한 피해를 입힙니다.",
    "element": "DIVINE",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 4,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "multihit",
      "kwName": "연타",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "hits": 3
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7039",
    "name": "꺾이지 않는 마음",
    "desc": "자신의 체력이 50% 미만이면 매 라운드 개시 시 2턴간 공격력이 1 증가합니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "boost",
      "kwName": "각성",
      "grade": 1,
      "side": null,
      "trigger": "round_start",
      "when": {
       "if": "hp_below",
       "ratio": 0.5
      },
      "chance": null,
      "args": {
       "amount": 1,
       "turns": 2,
       "stat": "atk"
      }
     }
    ]
   }
  },
  "skill": "람쥐썬더",
  "res": {
   "st": "assets/characters/CHR_039_ST_F.png",
   "pt": "assets/characters/CHR_039_PT.png"
  }
 },
 {
  "id": "CHR_040",
  "name": "호루스",
  "nameEn": "Horus",
  "species": "매",
  "desc": "고고하고 든든한 방어자",
  "story": "시비르기에서 꽤나 긴 혈통을 가지고 있는 로캣몬. 로켓 배틀이 화합의 상징이 되기 전부터 지하 결투장 폐쇄를 위해 힘써왔으나 화합의 장이 된 지금은 로켓배틀에 우호적이게 바뀌었다고 한다.",
  "type": "LAND",
  "typeName": "육",
  "roleCode": "CLOSER",
  "role": "결전자",
  "rarity": "common",
  "pts": {
   "hp": 9,
   "atk": 4,
   "def": 7,
   "mag": 7,
   "spd": 3
  },
  "hp": 172,
  "atk": 4,
  "def": 7,
  "mag": 7,
  "spd": 3,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1040",
     "name": "태세정비",
     "desc": "아군 전체에게 2턴간 최대 체력의 15%만큼 흡수하는 보호막을 부여하고, 2턴간 방어력을 1 증가시킵니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "ally_all",
     "tier": 0,
     "speed": 0,
     "spCost": 0,
     "effects": [
      {
       "kw": "shield",
       "kwName": "보호",
       "grade": 3,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.15,
        "turns": 2
       }
      },
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1,
        "turns": 2,
        "stat": "def"
       }
      }
     ]
    },
    {
     "key": "SKL_2040",
     "name": "결속",
     "desc": "2턴간 아군 전체의 공격력을 2 증가시키고, 투지를 2 획득합니다.",
     "element": "DIVINE",
     "kind": "basic",
     "target": "ally_all",
     "tier": 0,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "boost",
       "kwName": "각성",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2,
        "turns": 2,
        "stat": "atk"
       }
      },
      {
       "kw": "charge",
       "kwName": "투지획득",
       "grade": 2,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5040",
    "name": "최후의 호령",
    "desc": "적 전체에게 피해를 입힙니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 6,
    "speed": 0,
    "spCost": 4,
    "effects": []
   },
   "passive": {
    "key": "SKL_7040",
    "name": "고고함",
    "desc": "매 라운드 개시 시 전투가 끝날 때까지 자신의 마력이 1 증가하며, 10까지 쌓입니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "whet",
      "kwName": "벼림",
      "grade": 5,
      "side": "self",
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "amount": 1,
       "upto": 10,
       "stat": "mag"
      }
     }
    ]
   }
  },
  "skill": "최후의 호령",
  "res": {
   "st": "assets/characters/CHR_040_ST_F.png",
   "pt": "assets/characters/CHR_040_PT.png"
  }
 },
 {
  "id": "CHR_041",
  "name": "호퍼",
  "nameEn": "Hopper",
  "species": "펭귄",
  "desc": "가정을 지키기 위해 무술을 극한으로 단련한 로캣몬",
  "story": "호프의 진화형 로캣몬. 대개 천적의 위협으로부터 자신과 가족을 지키기 위한 일념으로 수련을 거듭하여 진화한다. 날개 당수 한 번으로 돌보다 단단한 빙하도 반으로 쪼갤 수 있다. 평소에는 유순하지만 호프에게 위협을 가하는 이가 있으면 그 무엇보다도 흉폭해질 수 있다.",
  "type": "SEA",
  "typeName": "해",
  "roleCode": "HUNTER",
  "role": "추격자",
  "rarity": "common",
  "pts": {
   "hp": 5,
   "atk": 9,
   "def": 5,
   "mag": 4,
   "spd": 7
  },
  "hp": 140,
  "atk": 9,
  "def": 5,
  "mag": 4,
  "spd": 7,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1041",
     "name": "강철날개",
     "desc": "적 하나에게 강한 피해를 입힙니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 7,
     "speed": 0,
     "spCost": 0,
     "effects": []
    },
    {
     "key": "SKL_2041",
     "name": "연격",
     "desc": "적 하나를 2회 연속으로 타격하며, 타격마다 피해를 입힙니다. 그 뒤 가한 피해의 20%만큼 자신도 피해를 입습니다.",
     "element": "WILD",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 6,
     "speed": 0,
     "spCost": 1,
     "effects": [
      {
       "kw": "multihit",
       "kwName": "연타",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "hits": 2
       }
      },
      {
       "kw": "recoil",
       "kwName": "반동",
       "grade": 3,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5041",
    "name": "푸른 칼날",
    "desc": "자신이 잃은 체력에 비례해 최대 60%까지 피해량이 증가한 뒤, 적 하나를 2회 연속으로 타격합니다. 이와 함께 1턴간 속도와 무관하게 먼저 행동합니다.",
    "element": "WILD",
    "kind": "ultimate",
    "target": "enemy_one",
    "tier": 5,
    "speed": 0,
    "spCost": 3,
    "effects": [
     {
      "kw": "haste",
      "kwName": "우선",
      "grade": 1,
      "side": "self",
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "turns": 1
      }
     },
     {
      "kw": "multihit",
      "kwName": "연타",
      "grade": 1,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "hits": 2
      }
     },
     {
      "kw": "desperate",
      "kwName": "사투",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "bonus": 0.6
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7041",
    "name": "불굴",
    "desc": "매 라운드 개시 시 버팀을 얻습니다.",
    "element": null,
    "kind": "passive",
    "target": "self",
    "tier": 0,
    "speed": 0,
    "spCost": 0,
    "effects": [
     {
      "kw": "endure",
      "kwName": "버팀",
      "grade": 1,
      "side": null,
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "turns": 2
      }
     }
    ]
   }
  },
  "skill": "푸른 칼날",
  "res": {
   "st": "assets/characters/CHR_041_ST_F.png",
   "pt": "assets/characters/CHR_041_PT.png"
  }
 },
 {
  "id": "CHR_042",
  "name": "루나",
  "nameEn": "Luna",
  "species": "나비",
  "desc": "마음은 착하지만 날개가 검은색 이라는 이유로 무리에서 쫒겨났다. \n직접적인 공격보다 버프,디버프, 힐들로 아군을 돕는 것을 좋아한다.",
  "story": "마음은 착하지만 날개가 검은색 이라는 이유로 무리에서 쫒겨났다. \n직접적인 공격보다 버프,디버프, 힐들로 아군을 돕는 것을 좋아한다.",
  "type": "AIR",
  "typeName": "공",
  "roleCode": "HEALER",
  "role": "치유자",
  "rarity": "common",
  "pts": {
   "hp": 5,
   "atk": 3,
   "def": 4,
   "mag": 9,
   "spd": 9
  },
  "hp": 140,
  "atk": 3,
  "def": 4,
  "mag": 9,
  "spd": 9,
  "priority": 0,
  "locked": true,
  "skills": {
   "basic": [
    {
     "key": "SKL_1042",
     "name": "고요한 날개",
     "desc": "적 하나에게 약한 피해를 입히고, 체력이 가장 낮은 아군의 체력을 최대치의 10%만큼 회복시킵니다. 자신의 투지를 1 획득합니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "enemy_one",
     "tier": 4,
     "speed": -3,
     "spCost": 0,
     "effects": [
      {
       "kw": "heal",
       "kwName": "회복",
       "grade": 2,
       "side": "ally_weakest",
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.1
       }
      },
      {
       "kw": "charge",
       "kwName": "투지획득",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "amount": 1
       }
      }
     ]
    },
    {
     "key": "SKL_2042",
     "name": "정화의 날개",
     "desc": "아군 하나의 해로운 상태를 모두 해제한 뒤, 그 대상의 체력을 최대치의 20%만큼 회복시킵니다.",
     "element": "ARCANE",
     "kind": "basic",
     "target": "ally_one",
     "tier": 0,
     "speed": 0,
     "spCost": 2,
     "effects": [
      {
       "kw": "cleanse",
       "kwName": "정화",
       "grade": 1,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {}
      },
      {
       "kw": "heal",
       "kwName": "회복",
       "grade": 3,
       "side": null,
       "trigger": null,
       "when": null,
       "chance": null,
       "args": {
        "ratio": 0.2
       }
      }
     ]
    }
   ],
   "ultimate": {
    "key": "SKL_5042",
    "name": "침묵의 날개",
    "desc": "적 전체에게 약한 피해를 입히고 2턴간 특수기 사용을 봉인합니다.",
    "element": "ARCANE",
    "kind": "ultimate",
    "target": "enemy_all",
    "tier": 1,
    "speed": 3,
    "spCost": 4,
    "effects": [
     {
      "kw": "silence",
      "kwName": "침묵",
      "grade": 2,
      "side": null,
      "trigger": null,
      "when": null,
      "chance": null,
      "args": {
       "turns": 2
      }
     }
    ]
   },
   "passive": {
    "key": "SKL_7042",
    "name": "치유의 힘",
    "desc": "매 라운드 개시 시 체력이 가장 낮은 아군의 체력을 최대치의 10%만큼 회복시킵니다.",
    "element": null,
    "kind": "passive",
    "target": "ally_weakest",
    "tier": 0,
    "speed": -3,
    "spCost": 0,
    "effects": [
     {
      "kw": "heal",
      "kwName": "회복",
      "grade": 2,
      "side": null,
      "trigger": "round_start",
      "when": null,
      "chance": null,
      "args": {
       "ratio": 0.1
      }
     }
    ]
   }
  },
  "skill": "침묵의 날개",
  "res": {
   "st": "assets/characters/CHR_042_ST_F.png",
   "pt": "assets/characters/CHR_042_PT.png"
  }
 }
];
window.CHARACTER_BY_ID = {};
window.CHARACTERS.forEach(function (c) { window.CHARACTER_BY_ID[c.id] = c; });
window.GUIDE_CHARACTER = { id: 'CHR_901', name: '안내자', res: { st: 'assets/characters/CHR_901_ST_F.png', pt: 'assets/characters/CHR_901_PT.png' } };
