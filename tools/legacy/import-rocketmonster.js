#!/usr/bin/env node
// =====================================================================
// 로켓몬스터 데이터 꾸러미(rocketmonster-data/) -> 프로토타입 데이터 변환기
//
//   node tools/import-rocketmonster.js <꾸러미 경로>
//
// 읽는 것: <꾸러미>/data/characters.json, strings.json, rules.js, resources.json, img/character/*.png
// 쓰는 것: data/characters.js, data/rules.js, data/strings.js, assets/characters/*.png
//          data/source/rocketmonster/ (꾸러미의 data/ 와 master/ 를 그대로 보관)
//
// 원본 표를 고쳤으면 이 스크립트를 다시 돌리면 된다. 생성물은 손으로 고치지 않는다.
// =====================================================================
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.resolve(process.argv[2] || path.join(ROOT, 'data/source/rocketmonster'));
if (!fs.existsSync(path.join(SRC, 'data/characters.json'))) {
  console.error('꾸러미 경로가 잘못됨: ' + SRC + ' (data/characters.json 이 없음)');
  process.exit(1);
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const chars = readJson(path.join(SRC, 'data/characters.json'));
const strings = readJson(path.join(SRC, 'data/strings.json'));
const resources = readJson(path.join(SRC, 'data/resources.json'));
const rulesSrc = fs.readFileSync(path.join(SRC, 'data/rules.js'), 'utf8');
const RULE = JSON.parse(rulesSrc.replace(/^[\s\S]*?export const RULE =/, '').replace(/;\s*$/, ''));

const ko = (key, fallback) => (strings[key] && strings[key].ko) || fallback || '';
const en = (key) => (strings[key] && strings[key].en) || '';

// ---- 설정 (프로토타입 쪽 결정 사항) ----
const LOCKED = new Set(['CHR_031', 'CHR_032', 'CHR_033', 'CHR_034', 'CHR_035', 'CHR_036', 'CHR_037', 'CHR_038', 'CHR_039', 'CHR_040', 'CHR_041', 'CHR_042']); // 42 중 12 잠금 (전투 기획서 p.3)
const TYPE_NAME = { LAND: ko('TYPE_LAND', '육'), SEA: ko('TYPE_SEA', '해'), AIR: ko('TYPE_AIR', '공') };
const ROLE_NAME = {};
['ASSASSIN', 'HUNTER', 'CHARGER', 'GUARDIAN', 'TRICKSTER', 'CLOSER', 'HEALER'].forEach(function (r) { ROLE_NAME[r] = ko('ROLE_' + r, r); });
const STAT_NAME = { hp: '체력', atk: '공격력', def: '물리 방어', mag: '마법 방어', spd: '속도' };

// ---- 설명 문구의 토큰 치환: {e1_ratio:pct} {e2_amount:signed} {e1_amount_abs} {stat:@STAT} ... ----
function fmt(v, f) {
  if (v === undefined || v === null) return null;
  if (f === 'pct') return Math.round(v * 100) + '%';
  if (f === 'signed') return (v > 0 ? '+' : '') + v;
  if (f === '@STAT') return STAT_NAME[v] || v;
  if (f === '@ELEM') return ({ WILD: '야성', ARCANE: '비술', DIVINE: '신성' })[v] || v;
  if (f === '@STA') return ko('KW_' + v + '_NAME', v);
  return String(v);
}
function renderDesc(key, effects) {
  const raw = ko(key, '');
  return raw.replace(/\{([^}]+)\}/g, function (m, tok) {
    const parts = tok.split(':');
    const name = parts[0]; const f = parts[1];
    // e{n}_{arg}
    const em = name.match(/^e(\d+)_(.+)$/);
    if (em) {
      const eff = effects[parseInt(em[1], 10) - 1];
      if (!eff) return m;
      let arg = em[2]; let abs = false;
      if (arg.endsWith('_abs')) { arg = arg.slice(0, -4); abs = true; }
      let v;
      if (arg.indexOf('when_') === 0) {
        const wk = arg.slice(5);
        v = eff.when ? eff.when[wk] : undefined;
        if (wk === 'type' && v !== undefined) v = TYPE_NAME[v] || v;
        if (wk === 'element' && v !== undefined) v = fmt(v, '@ELEM');
      }
      else if (arg === 'stat') v = eff.args && eff.args.stat;
      else if (arg === 'chance') { v = (eff.chance !== undefined && eff.chance !== null) ? eff.chance : (eff.args ? eff.args.chance : undefined); if (v !== undefined) v = (v <= 1 ? Math.round(v * 100) : v); }
      else v = eff.args ? eff.args[arg] : undefined;
      if (v === undefined) return m;
      if (abs) v = Math.abs(v);
      if (arg === 'stat') return fmt(v, '@STAT');
      const out = fmt(v, f); return out === null ? m : out;
    }
    return m;
  });
}

function convSkill(s) {
  if (!s) return null;
  const effects = (s.effects || []).map(function (e) {
    return { kw: e.kw, kwName: ko('KW_' + e.kw + '_NAME', e.kw), grade: e.grade, side: e.side || null, trigger: e.trigger || null, when: e.when || null, chance: (e.chance !== undefined) ? e.chance : null, args: e.args || {} };
  });
  return {
    key: s.name_key.replace(/_NAME$/, ''),
    name: ko(s.name_key, s.name_key),
    desc: renderDesc(s.desc_key, effects),
    element: s.element || null,
    kind: s.kind,
    target: s.target,
    tier: s.tier || 0,
    speed: s.speed || 0,
    spCost: s.sp_cost || 0,
    effects: effects,
  };
}

const out = chars.map(function (c) {
  const basics = c.skills.filter(function (s) { return s.kind === 'basic'; }).map(convSkill);
  const ult = convSkill(c.skills.filter(function (s) { return s.kind === 'ultimate'; })[0]);
  const res = resources[c.res] || {};
  return {
    id: c.id,
    name: ko(c.name_key, c.id),
    nameEn: en(c.name_key),
    species: ko(c.species_key, ''),
    desc: ko(c.desc_key, ''),
    story: ko(c.story_key, ''),
    type: c.type,
    typeName: TYPE_NAME[c.type] || c.type,
    roleCode: c.role,
    role: ROLE_NAME[c.role] || c.role,
    rarity: c.rarity,
    pts: { hp: c.stats.hp, atk: c.stats.atk, def: c.stats.def, mag: c.stats.mag, spd: c.stats.spd },
    // 판정용 능력치: 체력만 규칙으로 환산, 나머지는 포인트 그대로 (data/balance.js 의 공식이 읽음)
    hp: RULE['RULES.HP_BASE'] + RULE['RULES.HP_PER_POINT'] * c.stats.hp,
    atk: c.stats.atk, def: c.stats.def, mag: c.stats.mag, spd: c.stats.spd,
    priority: 0,
    locked: LOCKED.has(c.id),
    skills: { basic: basics, ultimate: ult, passive: convSkill(c.passive) },
    skill: ult ? ult.name : '특수기',
    res: { st: res.ST_F ? 'assets/characters/' + path.basename(res.ST_F) : null, pt: res.PT ? 'assets/characters/' + path.basename(res.PT) : null },
  };
});

// ---- 쓰기 ----
const header = '// **생성물이다.** tools/import-rocketmonster.js 가 로켓몬스터 꾸러미에서 만든다. 손으로 고치지 않는다.\n';
fs.writeFileSync(path.join(ROOT, 'data/characters.js'),
  header +
  '// 원본: data/source/rocketmonster/ (character/skill/skill_effect/string/rule 표)\n' +
  '// - pts: 원본 스탯 포인트(3~9). hp 는 RULES.HP_BASE + HP_PER_POINT * pts.hp 로 환산\n' +
  '// - role: 원본 7 역할군 (암살자/추격자/돌격자/보호자/교란자/결전자/치유자). 효과는 data/balance.js ROLE\n' +
  '// - locked: 게임 첫 시작 시 잠금 12종 (전투 기획서 p.3). 바꾸려면 tools/import-rocketmonster.js 의 LOCKED\n' +
  'window.CHARACTERS = ' + JSON.stringify(out, null, 1) + ';\n' +
  'window.CHARACTER_BY_ID = {};\nwindow.CHARACTERS.forEach(function (c) { window.CHARACTER_BY_ID[c.id] = c; });\n' +
  "window.GUIDE_CHARACTER = { id: 'CHR_901', name: '" + ko('CHR_901_NAME', '안내자') + "', res: { st: 'assets/characters/CHR_901_ST_F.png', pt: 'assets/characters/CHR_901_PT.png' } };\n");

fs.writeFileSync(path.join(ROOT, 'data/rules.js'), header + '// 원본: rule.csv. 판정 낱값(속성 계수, 위력 사다리, 타입 상성, 투지 상한 등)\nwindow.RULES = ' + JSON.stringify(RULE, null, 1) + ';\n');

const koStrings = {};
Object.keys(strings).forEach(function (k) { if (/^(TYPE_|ROLE_|KW_)/.test(k)) koStrings[k] = strings[k].ko; });
fs.writeFileSync(path.join(ROOT, 'data/strings.js'), header + '// 화면 문구(타입/역할군/효과 키워드 이름과 도움말)만 발췌\nwindow.STRINGS = ' + JSON.stringify(koStrings, null, 1) + ';\n');

// 이미지 복사
const imgDir = path.join(SRC, 'img/character');
const dst = path.join(ROOT, 'assets/characters');
let copied = 0;
if (fs.existsSync(imgDir)) { // 보관본(data/source)에는 그림이 없으므로 그때는 assets/ 를 그대로 둔다
  fs.mkdirSync(dst, { recursive: true });
  fs.readdirSync(dst).forEach(function (f) { if (f.endsWith('.png')) fs.unlinkSync(path.join(dst, f)); });
  fs.readdirSync(imgDir).forEach(function (f) { if (f.endsWith('.png')) { fs.copyFileSync(path.join(imgDir, f), path.join(dst, f)); copied++; } });
}

// 꾸러미 보관 (data/, master/, README)
const keep = path.join(ROOT, 'data/source/rocketmonster');
if (path.resolve(SRC) !== path.resolve(keep)) {
  fs.rmSync(keep, { recursive: true, force: true });
  fs.mkdirSync(keep, { recursive: true });
  ['data', 'master'].forEach(function (d) { fs.cpSync(path.join(SRC, d), path.join(keep, d), { recursive: true }); });
  ['README.md'].forEach(function (f) { if (fs.existsSync(path.join(SRC, f))) fs.copyFileSync(path.join(SRC, f), path.join(keep, f)); });
}

console.log('캐릭터 ' + out.length + '종, 이미지 ' + copied + '장 변환 완료');
console.log('잠금: ' + out.filter(function (c) { return c.locked; }).map(function (c) { return c.id; }).join(', '));
