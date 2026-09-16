#!/usr/bin/env node
// =====================================================================
// 퍼리업 전투 실험실(α-02) characters.js -> 프로토타입 data/characters.js 변환기
//
//   node tools/import-alpha02.js [characters.js 경로]
//   (기본: data/source/alpha02/characters.js)
//
// 실험실 https://kimkumo.github.io/FurryUp-BattleSimulator/ 의 characters.js 를 그대로 받아
// 프로토타입이 읽는 형식으로 옮긴다. 생성물은 손으로 고치지 않는다.
// =====================================================================
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.resolve(process.argv[2] || path.join(ROOT, 'data/source/alpha02/characters.js'));

const win = {};
new Function('window', fs.readFileSync(SRC, 'utf8'))(win);
const list = win.ROCKETMONSTERS;
if (!Array.isArray(list) || !list.length) { console.error('ROCKETMONSTERS 를 읽지 못함: ' + SRC); process.exit(1); }

// ---- 프로토타입 쪽 결정 사항 ----
const ROLE_MAP = { '추격자': '돌격자', '치유자': '보호자' };   // 역할군 5종 (실험실 ROLE_MAP 과 동일)
const LOCKED = new Set(['CHR_031', 'CHR_032', 'CHR_033', 'CHR_034', 'CHR_035', 'CHR_036', 'CHR_037', 'CHR_038', 'CHR_039', 'CHR_040', 'CHR_041', 'CHR_042']); // 42 중 12 잠금

const out = list.map(function (c) {
  return {
    id: c.id,
    name: c.name,
    species: c.species || '',
    type: c.type,                 // 육 / 해 / 공
    typeName: c.type,
    sourceRole: c.sourceRole,     // 리메이크 문서 표기 (7종)
    role: ROLE_MAP[c.sourceRole] || c.sourceRole,   // 판정 역할군 (5종)
    pts: { hp: c.hp, atk: c.atk, def: c.def, spd: c.spd },
    atk: c.atk, def: c.def, spd: c.spd,
    priority: 0,
    locked: LOCKED.has(c.id),
    passive: c.passive ? { id: c.passive.id, name: c.passive.name, desc: c.passive.description } : null,
    skill: c.skill ? { id: c.skill.id, name: c.skill.name, desc: c.skill.description, cost: c.skill.cost, priority: c.skill.priority || 0 } : null,
    documented: c.documented || {},
    res: { st: 'assets/characters/' + c.id + '_ST_F.png', pt: 'assets/characters/' + c.id + '_PT.png' },
  };
});

const header = '// **생성물이다.** tools/import-alpha02.js 가 data/source/alpha02/characters.js (전투 실험실 α-02) 에서 만든다. 손으로 고치지 않는다.\n';
fs.writeFileSync(path.join(ROOT, 'data/characters.js'),
  header +
  '// - pts: 체력/공격/방어/속도 (실험실 값). 최대 HP = pts.hp × BALANCE.RULES.hpMultiplier (아래에서 계산)\n' +
  '// - role: 판정 역할군 5종 (추격자→돌격자, 치유자→보호자). sourceRole 은 문서 표기\n' +
  '// - passive/skill: 리메이크 문서 반영 17종. null 이면 실험실 임시 규칙(역할군 효과만 + 공통 스킬)\n' +
  '// - locked: 게임 첫 시작 시 잠금 12종. 바꾸려면 tools/import-alpha02.js 의 LOCKED\n' +
  'window.CHARACTERS = ' + JSON.stringify(out, null, 1) + ';\n' +
  'window.CHARACTERS.forEach(function (c) { c.hp = c.pts.hp * window.BALANCE.RULES.hpMultiplier; });\n' +
  'window.CHARACTER_BY_ID = {};\nwindow.CHARACTERS.forEach(function (c) { window.CHARACTER_BY_ID[c.id] = c; });\n' +
  "window.GUIDE_CHARACTER = { id: 'CHR_901', name: '안내자', res: { st: 'assets/characters/CHR_901_ST_F.png', pt: 'assets/characters/CHR_901_PT.png' } };\n");

console.log('캐릭터 ' + out.length + '종 변환 완료. 문서 반영 스킬 ' + out.filter(function (c) { return c.skill; }).length + '종, 잠금 ' + out.filter(function (c) { return c.locked; }).length + '종');
