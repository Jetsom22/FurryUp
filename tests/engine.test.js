// node tests/engine.test.js
// 렌더링 없이 전투 엔진 / 스테이지 생성 / 런 상태를 검증한다.
globalThis.window = globalThis;
var path = require('path');
var root = path.join(__dirname, '..');
['data/balance.js', 'data/characters.js', 'data/stages.js', 'data/enemies.js',
 'src/core/rng.js', 'src/core/stagegen.js', 'src/core/battle.js', 'src/core/run.js'].forEach(function (f) { require(path.join(root, f)); });

var assert = require('assert');
var passed = 0;
function test(name, fn) { fn(); passed++; console.log('ok - ' + name); }

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
    t.forEach(function (x, i) { if (x === '이벤트') assert.ok(i + 1 >= 3 && i + 1 <= 13); });
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
function unit(over, side, slot) {
  var base = Object.assign({ id: 'X', name: 'X', role: '돌격자', hp: 100, atk: 20, def: 5, spd: 10, priority: 0 }, over);
  return BattleEngine.makeUnit(base, side, slot);
}

test('행동 순서: 우선도 > 속도 > 편성 순서 > 플레이어 우선', function () {
  var b = new BattleEngine.Battle(
    [unit({ name: 'a1', spd: 10 }, 'ally', 1), unit({ name: 'a2', spd: 10 }, 'ally', 2), unit({ name: 'a3', spd: 30, priority: 0 }, 'ally', 3)],
    [unit({ name: 'e1', spd: 10 }, 'enemy', 1), unit({ name: 'e2', spd: 5, priority: 1 }, 'enemy', 2)], new Rng(1));
  var names = b.computeOrder().map(function (u) { return u.name; });
  assert.deepStrictEqual(names, ['e2', 'a3', 'a1', 'e1', 'a2']);
});

test('공격 대상: 편성 순서 1부터 / 암살자는 마지막 순서부터', function () {
  var b = new BattleEngine.Battle(
    [unit({ name: 'atk', role: '돌격자' }, 'ally', 1), unit({ name: 'asn', role: '암살자' }, 'ally', 2)],
    [unit({ name: 'e1' }, 'enemy', 1), unit({ name: 'e2' }, 'enemy', 2), unit({ name: 'e3' }, 'enemy', 3)], new Rng(1));
  assert.strictEqual(b.pickTarget(b.units[0]).name, 'e1');
  assert.strictEqual(b.pickTarget(b.units[1]).name, 'e3');
  b.units[2].alive = false;
  assert.strictEqual(b.pickTarget(b.units[0]).name, 'e2');
});

test('데미지 = 공격 - 방어 (최소 1), 투지 상승/스킬 사용', function () {
  var B = BALANCE;
  var b = new BattleEngine.Battle([unit({ name: 'a', atk: 20, def: 0, spd: 99 }, 'ally', 1)], [unit({ name: 'e', hp: 1000, def: 5, atk: 1, spd: 1, role: '돌격자' }, 'enemy', 1)], new Rng(1));
  b.start();
  var a = b.units[0], e = b.units[1];
  var hpBefore = e.hp;
  for (var t = 1; t <= B.SKILL_COST; t++) b.runTurn();  // 투지 0->3 (일반 공격 3회)
  assert.strictEqual(a.fight, B.SKILL_COST);
  assert.strictEqual(hpBefore - e.hp, (20 - 5) * B.SKILL_COST);
  hpBefore = e.hp;
  var ev = b.runTurn(); // 스킬 사용
  var atkEv = ev.filter(function (x) { return x.type === 'attack' && x.uid === 'ally_1'; })[0];
  assert.strictEqual(atkEv.skill, true);
  assert.strictEqual(hpBefore - e.hp, Math.floor(20 * B.SKILL_MULT) - 5);
  assert.strictEqual(a.fight, 1); // 3 - 3 + 1
});

test('데미지 최소값 1', function () {
  var b = new BattleEngine.Battle([unit({ atk: 3, def: 0, spd: 99 }, 'ally', 1)], [unit({ hp: 50, def: 100, atk: 0, spd: 1 }, 'enemy', 1)], new Rng(1));
  b.start(); b.runTurn();
  assert.strictEqual(b.units[1].hp, 49);
});

test('보호자 보호막 10% / 교란자 회피 / 돌격자 처치 회복 / 결전자 8턴 강화', function () {
  var B = BALANCE;
  // 보호막
  var b = new BattleEngine.Battle([unit({ role: '보호자', hp: 200, def: 0, spd: 1, atk: 1 }, 'ally', 1)], [unit({ atk: 30, def: 0, spd: 99 }, 'enemy', 1)], new Rng(1));
  var ev = b.start();
  assert.strictEqual(b.units[0].shield, 20);
  assert.strictEqual(ev[0].type, 'shield');
  b.runTurn();
  assert.strictEqual(b.units[0].hp, 200 - (30 - 20)); // 20 흡수 후 10 피해
  assert.strictEqual(b.units[0].shield, 0);

  // 회피 (통계적으로 15% 근처)
  var dodges = 0, N = 4000;
  for (var i = 0; i < N; i++) {
    var d = new BattleEngine.Battle([unit({ role: '교란자', def: 0, atk: 1, spd: 1, hp: 9999 }, 'ally', 1)], [unit({ atk: 10, def: 0, spd: 99, hp: 9999 }, 'enemy', 1)], new Rng(1000 + i));
    d.start();
    var e = d.runTurn().filter(function (x) { return x.type === 'attack' && x.uid === 'enemy_1'; })[0];
    if (e.dodged) dodges++;
  }
  assert.ok(Math.abs(dodges / N - B.ROLE['교란자'].dodgeRate) < 0.03, '회피율 ' + dodges / N);

  // 돌격자 회복
  var c = new BattleEngine.Battle([unit({ role: '돌격자', hp: 100, atk: 50, spd: 99 }, 'ally', 1)], [unit({ hp: 10, def: 0, atk: 20, spd: 1 }, 'enemy', 1), unit({ hp: 10, def: 0, atk: 0, spd: 0 }, 'enemy', 2)], new Rng(1));
  c.start(); c.units[0].hp = 60;
  var evs = c.runTurn();
  assert.ok(evs.some(function (x) { return x.type === 'heal' && x.amount === 3; }));

  // 결전자
  var f = new BattleEngine.Battle([unit({ role: '결전자', atk: 20, hp: 9999, spd: 99 }, 'ally', 1)], [unit({ hp: 9999, def: 0, atk: 0, spd: 1 }, 'enemy', 1)], new Rng(1));
  f.start();
  f.turn = 7;
  assert.strictEqual(f.effectiveStat(f.units[0], 'atk'), 20);
  f.turn = 8;
  assert.strictEqual(f.effectiveStat(f.units[0], 'atk'), 24);
});

test('전멸 판정: 적 0 -> win, 아군 0 -> lose, 사망 아군은 비활성', function () {
  var b = new BattleEngine.Battle([unit({ hp: 5, atk: 1, def: 0, spd: 1 }, 'ally', 1)], [unit({ atk: 50, spd: 99 }, 'enemy', 1)], new Rng(1));
  var all = b.runAll();
  assert.strictEqual(b.result, 'lose');
  assert.strictEqual(b.units[0].active, false);
  assert.strictEqual(all[all.length - 1].type, 'end');

  var w = new BattleEngine.Battle([unit({ atk: 500, spd: 99 }, 'ally', 1)], [unit({ hp: 10 }, 'enemy', 1), unit({ hp: 10 }, 'enemy', 2)], new Rng(1));
  w.runAll();
  assert.strictEqual(w.result, 'win');
  assert.strictEqual(w.turn, 2); // 턴당 1회 행동: 적 2마리 = 2턴
});

// ---------------- 런 상태 ----------------
test('런: 첫 선택 -> 편성 -> 전투 -> 클리어 보상 -> 상점 구매/부활', function () {
  var run = new Run(1, 42);
  run.own('CHR_007');
  run.place('CHR_007', 0);
  assert.strictEqual(run.stageLabel(), '챕터 1 - 스테이지 1');
  run.advance(); // 1-2 일반
  var enemies = run.buildEnemies();
  assert.ok(enemies.length >= 1 && enemies.length <= 3);
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
  assert.ok(run.owns(stock[0].id));
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
  var base = CHARACTER_BY_ID['CHR_026'].hp;
  assert.strictEqual(en[0].maxHp, Math.floor(base * BALANCE.ENEMY.baseMult * (1 + BALANCE.ENEMY.stageGrowth * 14) * BALANCE.ENEMY.bossMult.hp));
});

test('런: 이벤트 효과 적용 (회복/피해/도박)', function () {
  var run = new Run(1, 5);
  run.own('CHR_001'); run.roster['CHR_001'].hp = 50;
  run.healAll(0.3);
  assert.strictEqual(run.roster['CHR_001'].hp, 50 + 45);
  run.damageAll(0.15);
  assert.strictEqual(run.roster['CHR_001'].hp, 95 - 22);
  run.gold = 100;
  var r = run.gamble();
  assert.strictEqual(r.bet, 50);
  assert.ok(run.gold === 150 || run.gold === 50);
});

console.log('\n' + passed + ' tests passed');
