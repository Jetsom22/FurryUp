// node tests/engine.test.js
// 렌더링 없이 전투 엔진 / 스테이지 생성 / 런 상태를 검증한다.
globalThis.window = globalThis;
var path = require('path');
var root = path.join(__dirname, '..');
['data/rules.js', 'data/strings.js', 'data/balance.js', 'data/characters.js', 'data/stages.js', 'data/enemies.js',
 'src/core/rng.js', 'src/core/stagegen.js', 'src/core/battle.js', 'src/core/run.js'].forEach(function (f) { require(path.join(root, f)); });

var assert = require('assert');
var passed = 0;
function test(name, fn) { fn(); passed++; console.log('ok - ' + name); }

// ---------------- 데이터 ----------------
test('원본 데이터 변환: 42종, 잠금 12종, 기술 3+패시브, 초상 경로', function () {
  assert.strictEqual(CHARACTERS.length, 42);
  assert.strictEqual(CHARACTERS.filter(function (c) { return c.locked; }).length, 12);
  CHARACTERS.forEach(function (c) {
    assert.ok(c.name && c.role && c.type && c.typeName, c.id);
    assert.strictEqual(c.hp, RULES['RULES.HP_BASE'] + RULES['RULES.HP_PER_POINT'] * c.pts.hp);
    assert.strictEqual(c.skills.basic.length, 2);
    assert.ok(c.skills.ultimate && c.skills.passive);
    assert.ok(c.res.st && c.res.pt);
    assert.ok(!/\{/.test(c.skills.ultimate.desc), '미치환 토큰: ' + c.id);
  });
  assert.strictEqual(CHARACTER_BY_ID['CHR_002'].name, '네벨라');
  assert.strictEqual(CHARACTER_BY_ID['CHR_002'].skills.ultimate.spCost, 3);
});

// ---------------- 스테이지 생성 ----------------
test('챕터 1 배치 규칙 (고정/비율/중간보스 구간/이벤트 3연속 금지)', function () {
  for (var seed = 1; seed <= 300; seed++) {
    var g = StageGen.generateChapter(1, new Rng(seed));
    var t = g.stages.map(function (s) { return s.type; });
    assert.strictEqual(t.length, 15);
    assert.strictEqual(t[0], '스토리'); assert.strictEqual(t[1], '일반');
    assert.strictEqual(t[13], '스토리'); assert.strictEqual(t[14], '보스');
    var count = {};
    t.forEach(function (x) { count[x] = (count[x] || 0) + 1; });
    assert.deepStrictEqual(count, { 일반: 7, 이벤트: 4, 스토리: 2, 중간보스: 1, 보스: 1 });
    assert.ok(g.midboss >= 8 && g.midboss <= 13);
    for (var i = 0; i < 13; i++) assert.ok(!(t[i] === '이벤트' && t[i + 1] === '이벤트' && t[i + 2] === '이벤트'), '이벤트 3연속');
  }
});

test('이벤트 하위 효과 제약 (첫 이벤트 긍정 / 해로운 최대 2 / 중간보스 후 해로운 없음)', function () {
  var rng = new Rng(7);
  for (var k = 0; k < 500; k++) {
    var e = StageGen.rollEventEffect(rng, { eventsSeen: 0, harmfulCount: 0, midbossCleared: false });
    assert.ok(e === '이로운' || e === '도박', '첫 이벤트: ' + e);
    assert.notStrictEqual(StageGen.rollEventEffect(rng, { eventsSeen: 1, harmfulCount: 2, midbossCleared: false }), '해로운');
    assert.notStrictEqual(StageGen.rollEventEffect(rng, { eventsSeen: 1, harmfulCount: 0, midbossCleared: true }), '해로운');
  }
});

// ---------------- 전투 엔진 ----------------
function skill(over) { return Object.assign({ key: 'T', name: '타격', kind: 'basic', element: 'WILD', target: 'enemy_one', tier: 5, speed: 0, spCost: 0, effects: [] }, over); }
function unit(over, side, slot) {
  var base = Object.assign({ id: 'X', name: 'X', role: '돌격자', type: 'LAND', hp: 150, atk: 6, def: 5, mag: 5, spd: 5, priority: 0,
    skills: { basic: [skill({}), null], ultimate: skill({ key: 'U', name: '특수기', kind: 'ultimate', tier: 7, spCost: 3 }), passive: null } }, over);
  return BattleEngine.makeUnit(base, side, slot);
}
function expectedDamage(A, D, el, kind, tier, typeMult) {
  var scale = el === 'ARCANE' ? RULES['RULES.MAG_DEFENSE_SCALE'] : RULES['RULES.DEFENSE_SCALE'];
  var mit = D > 0 ? scale / (scale + D * BALANCE.DAMAGE.DEF_WEIGHT) : 1;
  return Math.max(1, Math.floor((A + RULES['RULES.ATK_OFFSET']) * RULES['COEF.' + el + '.' + kind] * RULES['POWER_SCALE.' + tier] * mit * (typeMult || 1)));
}

test('행동 순서: 우선 행동 > 우선도 > 속도(+기술 보정) > 편성 순서 > 플레이어 우선', function () {
  var b = new BattleEngine.Battle(
    [unit({ name: 'a1', spd: 5 }, 'ally', 1), unit({ name: 'a2', spd: 5 }, 'ally', 2), unit({ name: 'a3', spd: 9 }, 'ally', 3)],
    [unit({ name: 'e1', spd: 5 }, 'enemy', 1), unit({ name: 'e2', spd: 3, priority: 1 }, 'enemy', 2), unit({ name: 'e3', spd: 1 }, 'enemy', 3)], new Rng(1));
  b.units[5].statuses.push({ kw: 'haste', turns: 1 });
  var names = b.computeOrder().map(function (u) { return u.name; });
  assert.deepStrictEqual(names, ['e3', 'e2', 'a3', 'a1', 'e1', 'a2']);
});

test('공격 대상: 편성 순서 1부터 / 암살자는 마지막 / 추격자는 체력 비율 최저 / 도발 우선', function () {
  var b = new BattleEngine.Battle(
    [unit({ name: 'atk' }, 'ally', 1), unit({ name: 'asn', role: '암살자' }, 'ally', 2), unit({ name: 'hun', role: '추격자' }, 'ally', 3)],
    [unit({ name: 'e1' }, 'enemy', 1), unit({ name: 'e2', hp: 150 }, 'enemy', 2), unit({ name: 'e3' }, 'enemy', 3)], new Rng(1));
  b.units[4].hp = 30;
  assert.strictEqual(b.pickTarget(b.units[0]).name, 'e1');
  assert.strictEqual(b.pickTarget(b.units[1]).name, 'e3');
  assert.strictEqual(b.pickTarget(b.units[2]).name, 'e2');
  b.units[5].statuses.push({ kw: 'taunt', turns: 1 });
  assert.strictEqual(b.pickTarget(b.units[0]).name, 'e3');
  assert.strictEqual(b.pickTarget(b.units[1]).name, 'e3');
});

test('데미지 공식: (공격+8) × 속성계수 × 위력단계 × 방어 경감, 타입 상성 1.8/0.6, 최소 1', function () {
  var b = new BattleEngine.Battle([unit({ atk: 9, type: 'LAND', spd: 9 }, 'ally', 1)], [unit({ def: 5, type: 'AIR', hp: 9999, atk: 1, spd: 1 }, 'enemy', 1)], new Rng(1));
  b.start();
  var a = b.units[0], e = b.units[1];
  var ctx = {};
  assert.strictEqual(b.computeDamage(a, e, a.skills.basic[0], ctx), expectedDamage(9, 5, 'WILD', 'basic', 5, 1.8));
  assert.strictEqual(ctx.adv, 'adv');
  e.type = 'SEA'; ctx = {};
  assert.strictEqual(b.computeDamage(a, e, a.skills.basic[0], ctx), expectedDamage(9, 5, 'WILD', 'basic', 5, 0.6));
  assert.strictEqual(ctx.adv, 'dis');
  e.type = 'LAND';
  // 비술은 마법 능력치끼리, 신성은 방어 무시
  assert.strictEqual(b.computeDamage(a, e, skill({ element: 'ARCANE', tier: 5 }), {}), expectedDamage(a.mag, e.mag, 'ARCANE', 'basic', 5));
  assert.strictEqual(b.computeDamage(a, e, skill({ element: 'DIVINE', tier: 5 }), {}), expectedDamage(a.atk, 0, 'DIVINE', 'basic', 5));
  // 위력 0 은 피해 없음, 최소 1
  assert.strictEqual(b.computeDamage(a, e, skill({ tier: 0 }), {}), 0);
  var weak = unit({ atk: 3 }, 'ally', 2); var tank = unit({ def: 9, hp: 9999 }, 'enemy', 2);
  assert.ok(b.computeDamage(weak, tank, skill({ tier: 1 }), {}) >= 1);
});

test('투지: 일반기 +1, 특수기는 비용(spCost) 이상일 때 사용 후 차감', function () {
  var b = new BattleEngine.Battle([unit({ atk: 3, spd: 9 }, 'ally', 1)], [unit({ hp: 9999, def: 9, atk: 1, spd: 1 }, 'enemy', 1)], new Rng(1));
  b.start();
  var a = b.units[0];
  for (var t = 1; t <= 3; t++) b.runTurn();
  assert.strictEqual(a.fight, 3);
  var ev = b.runTurn();
  var cast = ev.filter(function (x) { return x.type === 'cast' && x.uid === 'ally_1'; })[0];
  assert.strictEqual(cast.isUltimate, true);
  assert.strictEqual(a.fight, 1); // 3 - 3 + 1
});

test('효과: 보호막 흡수 / 회복 / 흡혈 / 연타 / 출혈 / 표식 / 각성 / 기절 / 침묵', function () {
  var B = BALANCE;
  // 보호자 보호막 + 흡수
  var b = new BattleEngine.Battle([unit({ role: '보호자', hp: 200, def: 0, spd: 1, atk: 1 }, 'ally', 1)], [unit({ atk: 9, spd: 9 }, 'enemy', 1)], new Rng(1));
  var ev = b.start();
  assert.strictEqual(b.units[0].shield, 20);
  assert.strictEqual(ev[0].type, 'shield');
  b.runTurn();
  var dmg = expectedDamage(9, 0, 'WILD', 'basic', 5);
  assert.strictEqual(b.units[0].hp, 200 - (dmg - 20));
  assert.strictEqual(b.units[0].shield, 0);

  // 회복(side self) + 흡혈 + 연타
  var c = new BattleEngine.Battle([unit({ hp: 300, spd: 9, skills: { basic: [skill({ tier: 5, effects: [{ kw: 'heal', side: 'self', args: { ratio: 0.1 } }, { kw: 'drain', args: { ratio: 0.5 } }, { kw: 'multihit', args: { hits: 2 } }] }), null], ultimate: null, passive: null } }, 'ally', 1)],
    [unit({ hp: 9999, def: 0, atk: 1, spd: 1 }, 'enemy', 1)], new Rng(1));
  c.start(); c.units[0].hp = 100;
  var evs = c.runTurn();
  var cst = evs.filter(function (x) { return x.type === 'cast' && x.uid === 'ally_1'; })[0];
  assert.strictEqual(cst.hits.length, 2);
  var dealt = cst.hits[0].damage + cst.hits[1].damage;
  var heals = evs.filter(function (x) { return x.type === 'heal' && x.uid === 'ally_1'; });
  assert.strictEqual(heals.length, 2);
  assert.strictEqual(heals[0].amount, 30);
  assert.strictEqual(heals[1].amount, Math.floor(dealt * 0.5));

  // 출혈 / 표식 / 각성(쇠약) / 기절 / 침묵
  var d = new BattleEngine.Battle([unit({ spd: 9, atk: 5, skills: { basic: [skill({ tier: 3, effects: [{ kw: 'bleed', args: { amount: 9, turns: 2 } }, { kw: 'mark', args: { ratio: 0.25, turns: 2 } }, { kw: 'boost', args: { stat: 'atk', amount: -2, turns: 2 } }, { kw: 'stun', args: { turns: 1 } }, { kw: 'silence', args: { turns: 2 } }] }), null], ultimate: null, passive: null } }, 'ally', 1)],
    [unit({ hp: 9999, def: 0, atk: 9, spd: 1 }, 'enemy', 1)], new Rng(1));
  d.start();
  var e1 = d.units[1];
  var ev1 = d.runTurn();
  assert.ok(ev1.some(function (x) { return x.type === 'skip' && x.uid === 'enemy_1'; }), '기절로 행동 건너뜀');
  assert.ok(ev1.some(function (x) { return x.type === 'bleed' && x.amount === 9; }), '출혈 피해');
  assert.strictEqual(d.effectiveStat(e1, 'atk'), 7);
  assert.strictEqual(BattleEngine.hasStatus(e1, 'stun'), false); // 1턴 후 해제
  var hpBefore = e1.hp;
  var ev2 = d.runTurn();
  var c2 = ev2.filter(function (x) { return x.type === 'cast' && x.uid === 'ally_1'; })[0];
  assert.strictEqual(c2.hits[0].damage, Math.floor(expectedDamage(5, 0, 'WILD', 'basic', 3) * 1.25)); // 1턴째 표식(25%)만 적용, 2턴째 표식은 피해 뒤에 걸림
  e1.fight = 6; assert.notStrictEqual(d.chooseSkill(e1).kind, 'ultimate'); // 침묵 중엔 특수기 불가
});

test('역할군: 교란자 회피 ~15% / 돌격자 처치 회복 / 결전자 8턴 강화 / 치유자 턴 종료 회복', function () {
  var B = BALANCE;
  var dodges = 0, N = 3000;
  for (var i = 0; i < N; i++) {
    var d = new BattleEngine.Battle([unit({ role: '교란자', hp: 9999, atk: 1, spd: 1 }, 'ally', 1)], [unit({ hp: 9999, spd: 9 }, 'enemy', 1)], new Rng(1000 + i));
    d.start();
    var e = d.runTurn().filter(function (x) { return x.type === 'cast' && x.uid === 'enemy_1'; })[0];
    if (e.hits[0].dodged) dodges++;
  }
  assert.ok(Math.abs(dodges / N - B.ROLE['교란자'].dodgeRate) < 0.03, '회피율 ' + dodges / N);

  var c = new BattleEngine.Battle([unit({ role: '돌격자', hp: 100, atk: 9, spd: 9 }, 'ally', 1)], [unit({ hp: 5, def: 0, atk: 1, spd: 1 }, 'enemy', 1), unit({ hp: 9999, atk: 0, spd: 0 }, 'enemy', 2)], new Rng(1));
  c.start(); c.units[0].hp = 60;
  assert.ok(c.runTurn().some(function (x) { return x.type === 'heal' && x.amount === 3; }));

  var f = new BattleEngine.Battle([unit({ role: '결전자', atk: 5, hp: 9999, spd: 9 }, 'ally', 1)], [unit({ hp: 9999, atk: 0, spd: 1 }, 'enemy', 1)], new Rng(1));
  f.start(); f.turn = 7; assert.strictEqual(f.effectiveStat(f.units[0], 'atk'), 5);
  f.turn = 8; assert.strictEqual(f.effectiveStat(f.units[0], 'atk'), 7);

  var h = new BattleEngine.Battle([unit({ role: '치유자', hp: 200, atk: 1, spd: 1 }, 'ally', 1), unit({ hp: 100, atk: 1, spd: 1 }, 'ally', 2)], [unit({ hp: 9999, atk: 1, spd: 9 }, 'enemy', 1)], new Rng(1));
  h.start(); h.units[1].hp = 50;
  var hev = h.runTurn();
  assert.ok(hev.some(function (x) { return x.type === 'heal' && x.uid === 'ally_2' && x.amount === 5; }));
});

test('전멸 판정: 적 0 -> win, 아군 0 -> lose, 사망 아군은 비활성', function () {
  var b = new BattleEngine.Battle([unit({ hp: 5, atk: 1, def: 0, spd: 1 }, 'ally', 1)], [unit({ atk: 9, spd: 9 }, 'enemy', 1)], new Rng(1));
  var all = b.runAll();
  assert.strictEqual(b.result, 'lose');
  assert.strictEqual(b.units[0].active, false);
  assert.strictEqual(all[all.length - 1].type, 'end');
  var w = new BattleEngine.Battle([unit({ atk: 9, spd: 9 }, 'ally', 1)], [unit({ hp: 10, def: 0 }, 'enemy', 1), unit({ hp: 10, def: 0 }, 'enemy', 2)], new Rng(1));
  w.runAll();
  assert.strictEqual(w.result, 'win');
  assert.strictEqual(w.turn, 2);
});

test('실데이터 전투: 42종 각자 1:1 로 돌려도 예외 없이 끝난다', function () {
  var rng = new Rng(99);
  var turns = [];
  for (var i = 0; i < CHARACTERS.length; i++) {
    var a = CHARACTERS[i], e = CHARACTERS[(i * 7 + 3) % CHARACTERS.length];
    var b = new BattleEngine.Battle([BattleEngine.makeUnit(a, 'ally', 1)], [BattleEngine.makeUnit(e, 'enemy', 1)], rng);
    b.runAll(60);
    assert.ok(b.result === 'win' || b.result === 'lose');
    turns.push(b.turn);
  }
  var avg = turns.reduce(function (x, y) { return x + y; }, 0) / turns.length;
  assert.ok(avg > 2 && avg < 40, '평균 턴 ' + avg);
  console.log('   (1:1 평균 ' + avg.toFixed(1) + '턴)');
});

// ---------------- 런 상태 ----------------
test('런: 첫 선택 -> 편성 -> 전투 -> 클리어 보상 -> 상점 구매/부활', function () {
  var run = new Run(1, 42);
  run.own('CHR_007');
  run.place('CHR_007', 0);
  assert.strictEqual(run.stageLabel(), '챕터 1 - 스테이지 1');
  run.advance();
  var enemies = run.buildEnemies();
  assert.strictEqual(enemies.length, 1);
  assert.ok(enemies[0].skills.ultimate && enemies[0].type);
  var b = new BattleEngine.Battle(run.formationUnits(), enemies, run.rng);
  b.runAll();
  run.applyBattleResult(b);
  var gold = run.gold;
  if (b.result === 'win') { run.clearStage(); assert.strictEqual(run.gold, gold + 100); }
  var stock = run.buildShop();
  assert.strictEqual(stock.length, 4);
  stock.forEach(function (it) { assert.ok(!CHARACTER_BY_ID[it.id].locked); assert.notStrictEqual(it.id, 'CHR_007'); });
  run.gold = 1000;
  assert.ok(run.buy(stock[0]));
  assert.ok(!run.buy(stock[0]));
  run.roster['CHR_007'].hp = 0;
  assert.ok(run.canRevive('CHR_007'));
  run.revive('CHR_007');
  assert.strictEqual(run.roster['CHR_007'].hp, Math.floor(CHARACTER_BY_ID['CHR_007'].hp * 0.5));
});

test('런: 보스 스테이지 고정 편성 / 배율 적용', function () {
  var run = new Run(1, 3);
  run.stageIndex = 14;
  assert.strictEqual(run.currentStage().type, '보스');
  var en = run.buildEnemies();
  assert.strictEqual(en.length, 3);
  assert.strictEqual(en[0].boss, true);
  var base = CHARACTER_BY_ID['CHR_012'].hp;
  assert.strictEqual(en[0].maxHp, Math.floor(base * BALANCE.ENEMY.baseMult * (1 + BALANCE.ENEMY.stageGrowth * 14) * BALANCE.ENEMY.bossMult.hp));
});

test('런: 이벤트 효과 적용 (회복/피해/도박)', function () {
  var run = new Run(1, 5);
  run.own('CHR_001'); var max = CHARACTER_BY_ID['CHR_001'].hp; run.roster['CHR_001'].hp = 50;
  run.healAll(0.3);
  assert.strictEqual(run.roster['CHR_001'].hp, 50 + Math.floor(max * 0.3));
  var before = run.roster['CHR_001'].hp;
  run.damageAll(0.15);
  assert.strictEqual(run.roster['CHR_001'].hp, before - Math.floor(max * 0.15));
  run.gold = 100;
  var r = run.gamble();
  assert.strictEqual(r.bet, 50);
  assert.ok(run.gold === 150 || run.gold === 50);
});

console.log('\n' + passed + ' tests passed');
