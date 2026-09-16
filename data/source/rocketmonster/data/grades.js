// **생성물이다.** tools/import-rules.mjs 가 마스터 시트에서 만든다.
// 손으로 고치지 않는다. 고칠 곳은 sheets/master/grade.csv 이고, 시트에서
// 고쳤으면 npm run sheet:pull 로 받은 뒤 npm run check 를 돌린다.

export const LADDER = {
  "pierce": {
    "unit": 2,
    "args": [
      {
        "ratio": 0.25
      },
      {
        "ratio": 0.4
      },
      {
        "ratio": 0.55
      }
    ]
  },
  "execute": {
    "unit": 2,
    "args": [
      {
        "bonus": 0.4
      },
      {
        "bonus": 0.6
      },
      {
        "bonus": 0.8
      }
    ]
  },
  "amplify": {
    "unit": 1,
    "args": [
      {
        "mult": 1.5
      },
      {
        "mult": 1.75
      },
      {
        "mult": 2
      }
    ],
    "argsDown": [
      {
        "mult": 0.8
      },
      {
        "mult": 0.7
      },
      {
        "mult": 0.6
      }
    ]
  },
  "zeal": {
    "unit": 2,
    "args": [
      {
        "bonus": 0.5
      },
      {
        "bonus": 0.75
      },
      {
        "bonus": 1
      }
    ]
  },
  "swell": {
    "unit": 2,
    "args": [
      {
        "bonus": 0.4
      },
      {
        "bonus": 0.6
      },
      {
        "bonus": 0.8
      }
    ]
  },
  "offering": {
    "unit": 2,
    "args": [
      {
        "per": 0.05
      },
      {
        "per": 0.08
      },
      {
        "per": 0.11
      }
    ]
  },
  "siege": {
    "unit": 3,
    "args": [
      {
        "ratio": 0.08
      },
      {
        "ratio": 0.12
      },
      {
        "ratio": 0.16
      }
    ]
  },
  "rally": {
    "unit": 2,
    "args": [
      {
        "per": 0.1
      },
      {
        "per": 0.15
      },
      {
        "per": 0.2
      }
    ]
  },
  "avenge": {
    "unit": 2,
    "args": [
      {
        "per": 0.3
      },
      {
        "per": 0.4
      },
      {
        "per": 0.5
      }
    ]
  },
  "spite": {
    "unit": 2,
    "args": [
      {
        "per": 0.15
      },
      {
        "per": 0.2
      },
      {
        "per": 0.25
      }
    ]
  },
  "bypass": {
    "unit": 3,
    "args": [
      {}
    ]
  },
  "desperate": {
    "unit": 2,
    "args": [
      {
        "bonus": 0.4
      },
      {
        "bonus": 0.6
      },
      {
        "bonus": 0.8
      }
    ]
  },
  "gap": {
    "unit": 2,
    "args": [
      {
        "per": 0.1
      },
      {
        "per": 0.15
      },
      {
        "per": 0.2
      }
    ]
  },
  "temper": {
    "unit": 2,
    "args": [
      {
        "ratio": 0.75
      },
      {
        "ratio": 0.5
      },
      {
        "ratio": 0.25
      }
    ]
  },
  "recoil": {
    "unit": -1,
    "args": [
      {
        "ratio": 0.12
      },
      {
        "ratio": 0.16
      },
      {
        "ratio": 0.2
      }
    ]
  },
  "drain": {
    "unit": 1,
    "args": [
      {
        "ratio": 0.2
      },
      {
        "ratio": 0.3
      },
      {
        "ratio": 0.4
      }
    ]
  },
  "heal": {
    "unit": 2,
    "args": [
      {
        "ratio": 0.05
      },
      {
        "ratio": 0.1
      },
      {
        "ratio": 0.2
      },
      {
        "ratio": 0.3
      },
      {
        "ratio": 0.4
      }
    ]
  },
  "charge": {
    "unit": 2,
    "args": [
      {
        "amount": 1
      },
      {
        "amount": 2
      },
      {
        "amount": 3
      },
      {
        "amount": 4
      }
    ]
  },
  "siphon": {
    "unit": 2,
    "args": [
      {
        "amount": 1
      },
      {
        "amount": 2
      }
    ]
  },
  "bleed": {
    "unit": 1,
    "args": [
      {
        "amount": 6,
        "turns": 2
      },
      {
        "amount": 9,
        "turns": 2
      },
      {
        "amount": 9,
        "turns": 3
      }
    ]
  },
  "mark": {
    "unit": 1,
    "args": [
      {
        "ratio": 0.15,
        "turns": 2
      },
      {
        "ratio": 0.25,
        "turns": 2
      },
      {
        "ratio": 0.35,
        "turns": 3
      }
    ]
  },
  "shield": {
    "unit": 2,
    "args": [
      {
        "ratio": 0.05,
        "turns": 2
      },
      {
        "ratio": 0.1,
        "turns": 2
      },
      {
        "ratio": 0.15,
        "turns": 2
      },
      {
        "ratio": 0.25,
        "turns": 2
      },
      {
        "ratio": 0.3,
        "turns": 2
      },
      {
        "ratio": 0.35,
        "turns": 3
      },
      {
        "ratio": 0.6,
        "turns": 3
      }
    ]
  },
  "taunt": {
    "unit": 3,
    "args": [
      {
        "turns": 1
      },
      {
        "turns": 2
      }
    ]
  },
  "unbind": {
    "unit": 2,
    "args": [
      {
        "turns": 1
      },
      {
        "turns": 2
      },
      {
        "turns": 3
      },
      {
        "turns": 1,
        "lasting": true
      }
    ]
  },
  "shelter": {
    "unit": 3,
    "args": [
      {
        "turns": 1
      },
      {
        "turns": 2
      }
    ]
  },
  "boost": {
    "unit": 2,
    "args": [
      {
        "amount": 1,
        "turns": 2
      },
      {
        "amount": 2,
        "turns": 2
      },
      {
        "amount": 2,
        "turns": 3
      },
      {
        "amount": 3,
        "turns": 3
      },
      {
        "amount": 4,
        "turns": 3
      },
      {
        "amount": 5,
        "turns": 3
      },
      {
        "amount": 1,
        "lasting": true
      },
      {
        "amount": 2,
        "lasting": true
      },
      {
        "amount": 3,
        "lasting": true
      },
      {
        "amount": 5,
        "lasting": true
      }
    ]
  },
  "whet": {
    "unit": 3,
    "args": [
      {
        "amount": 1,
        "upto": 2
      },
      {
        "amount": 1,
        "upto": 4
      },
      {
        "amount": 1,
        "upto": 6
      },
      {
        "amount": 1,
        "upto": 8
      },
      {
        "amount": 1,
        "upto": 10
      }
    ]
  },
  "silence": {
    "unit": 1,
    "args": [
      {
        "turns": 1
      },
      {
        "turns": 2
      }
    ]
  },
  "stun": {
    "unit": 11,
    "args": [
      {
        "turns": 1
      }
    ]
  },
  "cleanse": {
    "unit": 2,
    "args": [
      {}
    ]
  },
  "devour": {
    "unit": 3,
    "args": [
      {
        "ratio": 0.1
      },
      {
        "ratio": 0.15
      },
      {
        "ratio": 0.2
      }
    ]
  },
  "blight": {
    "unit": 3,
    "args": [
      {
        "ratio": 0.5,
        "turns": 2
      },
      {
        "ratio": 0.35,
        "turns": 2
      },
      {
        "ratio": 0.2,
        "turns": 3
      }
    ]
  },
  "mend": {
    "unit": 2,
    "args": [
      {
        "mult": 1.5
      },
      {
        "mult": 1.75
      },
      {
        "mult": 2
      }
    ]
  },
  "clot": {
    "unit": 2,
    "args": [
      {
        "mult": 0.75
      },
      {
        "mult": 0.5
      },
      {
        "mult": 0.25
      }
    ]
  },
  "renew": {
    "unit": 2,
    "args": [
      {}
    ]
  },
  "linger": {
    "unit": 2,
    "args": [
      {}
    ]
  },
  "toll": {
    "unit": -1,
    "args": [
      {
        "ratio": 0.05
      },
      {
        "ratio": 0.1
      },
      {
        "ratio": 0.15
      },
      {
        "ratio": 0.2
      }
    ]
  },
  "haste": {
    "unit": 4,
    "args": [
      {
        "turns": 1
      },
      {
        "turns": 2
      }
    ]
  },
  "endure": {
    "unit": 4,
    "args": [
      {
        "turns": 2
      },
      {
        "turns": 3
      }
    ]
  },
  "immune": {
    "unit": 4,
    "args": [
      {
        "turns": 1
      },
      {
        "turns": 2
      }
    ]
  },
  "blind": {
    "unit": 5,
    "args": [
      {
        "turns": 1
      },
      {
        "turns": 2
      }
    ]
  },
  "gift": {
    "unit": 3,
    "args": [
      {
        "amount": 1
      },
      {
        "amount": 2
      }
    ]
  },
  "swap": {
    "unit": 2,
    "args": [
      {
        "turns": 2
      },
      {
        "turns": 3
      }
    ]
  },
  "retire": {
    "unit": -6,
    "args": [
      {}
    ]
  },
  "multihit": {
    "unit": 3,
    "args": [
      {
        "hits": 2
      },
      {
        "hits": 3
      },
      {
        "min": 1,
        "max": 4
      }
    ]
  }
};
