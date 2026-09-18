// node tests/engine.test.js
// 렌더링 없이 전투 엔진(α-02) / 스테이지 생성 / 런 상태를 검증한다.
globalThis.window = globalThis;
var path = require('path');
var root = path.join(__dirname, '..');
['data/balance.js', 'data/characters.js', 'data/stages.js', 'data/enemies.js',
 'src/core/rng.js', 'src/core/stagegen.js', 'src/core/battle.js', 'src/core/run.js'].forEach(function (f) { require(path.join(root, f)); });

var assert = require('assert');
var passed = 0;
function test(name, fn) { fn(); passed++; console.log('ok - ' + name); }
var R = BALANCE.RULES;

// ---------------- 데이터 ----------------
test('α-02 데이터: 42종, 잠금 12종, 역할군 5종, 문서 반영 스킬 17종, HP = 체력×10', function () {
  assert.strictEqual(CHARACTERS.length, 42);
  assert.strictEqual(CHARACTERS.filter(function (c) { return c.locked; }).length, 12);
  var roles = {};
  CHARACTERS.forEach(function (c) {
    roles[c.role] = 1;
    assert.ok(c.name && c.type && c.typeName, c.id);
    assert.strictEqual(c.hp, c.pts.hp * R.hpMultiplier);
    assert.ok(c.res.st && c.res.pt);
  });
  assert.deepStrictEqual(Object.keys(roles).sort(), ['결전자', '교란자', '돌격자', '보호자', '암살자']);
  assert.strictEqual(CHARACTERS.filter(function (c) { return c.skill; }).length, 17);
  assert.strictEqual(CHARACTER_BY_ID['CHR_027'].role, '돌격자');   // 추격자 -> 돌격자
  assert.strictEqual(CHARACTER_BY_ID['CHR_028'].role, '보호자');   // 치유자 -> 보호자
  assert.strictEqual(CHARACTER_BY_ID['CHR_002'].skill.cost, 3);
  assert.strictEqual(CHARACTER_BY_ID['CHR_002'].skill.priority, 1);
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
function unit(over, side, slot) {
  var base = Object.assign({ id: 'X', name: 'X', role: '결전자', type: '육', hp: 100, atk: 5, def: 3, spd: 5, priority: 0, passive: null, skill: null }, over);
  return BattleEngine.makeUnit(base, side, slot);
}
function battle(allies, enemies, seed) { var b = new BattleEngine.Battle(allies, enemies, new Rng(seed || 1)); b.start(); return b; }
function casts(ev, uid) { return ev.filter(function (x) { return x.type === 'cast' && x.uid === uid; }); }

test('기본 피해 = max(1, floor(공격×2 − 방어)), 투지는 행동마다 +1', function () {
  var b = battle([unit({ atk: 5, spd: 9 }, 'ally', 1)], [unit({ def: 3, hp: 999, atk: 1, spd: 1, role: '보호자' }, 'enemy', 1)]);
  var ev = b.runTurn();
  var c = casts(ev, 'ally_1')[0];
  assert.strictEqual(c.hits[0].damage + c.hits[0].absorbed, 5 * 2 - 3);
  assert.strictEqual(b.units[0].grit, 1);
  var w = battle([unit({ atk: 1, spd: 9 }, 'ally', 1)], [unit({ def: 9, hp: 999, atk: 1, spd: 1 }, 'enemy', 1)]);
  assert.strictEqual(casts(w.runTurn(), 'ally_1')[0].hits[0].damage, R.minDamage);
});

test('행동 순서: 스킬 우선도(사용 가능할 때만) → 속도 → 슬롯 → 아군', function () {
  var b = battle(
    [unit({ name: 'a1', spd: 5 }, 'ally', 1), unit({ name: 'a2', spd: 5 }, 'ally', 2), unit({ name: 'a3', spd: 9 }, 'ally', 3)],
    [unit({ name: 'e1', spd: 5 }, 'enemy', 1), unit({ name: 'e2', spd: 3, skill: { id: 'x', name: 'x', cost: 1, priority: 1 } }, 'enemy', 2)]);
  assert.deepStrictEqual(b.computeOrder().map(function (u) { return u.name; }), ['a3', 'a1', 'e1', 'a2', 'e2']);
  b.units[4].grit = 1;   // e2 스킬 사용 가능 -> 우선도 +1 로 맨 앞
  assert.deepStrictEqual(b.computeOrder().map(function (u) { return u.name; }), ['e2', 'a3', 'a1', 'e1', 'a2']);
});

test('대상: 편성 순서 1부터 / 암살자는 가장 뒤 슬롯 / 약자멸시는 현재 HP 최저', function () {
  var b = battle(
    [unit({ name: 'n' }, 'ally', 1), unit({ name: 'asn', role: '암살자' }, 'ally', 2), unit({ name: 'bz', passive: { id: 'despise_weak' } }, 'ally', 3)],
    [unit({ name: 'e1' }, 'enemy', 1), unit({ name: 'e2' }, 'enemy', 2), unit({ name: 'e3' }, 'enemy', 3)]);
  b.units[4].hp = 10;
  assert.strictEqual(b.pickTarget(b.units[0]).name, 'e1');
  assert.strictEqual(b.pickTarget(b.units[1]).name, 'e3');
  assert.strictEqual(b.pickTarget(b.units[2]).name, 'e2');
});

test('역할군 5종: 보호자 보호막 10% / 돌격자 처치 시 최대 HP 5% 회복 / 결전자 8턴 +1 (1회) / 교란자 회피 ~15%', function () {
  var b = battle([unit({ role: '보호자', hp: 100 }, 'ally', 1)], [unit({ atk: 1, spd: 1 }, 'enemy', 1)]);
  assert.strictEqual(b.units[0].shield, 10);

  var c = battle([unit({ role: '돌격자', hp: 100, atk: 9, spd: 9 }, 'ally', 1)], [unit({ hp: 5, def: 0, spd: 1 }, 'enemy', 1), unit({ hp: 999, atk: 0, spd: 0 }, 'enemy', 2)]);
  c.units[0].hp = 50;
  var ev = c.runTurn();
  assert.ok(ev.some(function (x) { return x.type === 'heal' && x.uid === 'ally_1' && x.amount === 5; }));

  var d = battle([unit({ role: '결전자', atk: 5, def: 3, spd: 5, hp: 999 }, 'ally', 1)], [unit({ hp: 999, atk: 1, spd: 1 }, 'enemy', 1)]);
  for (var t = 1; t <= 8; t++) d.runTurn();
  assert.strictEqual(d.units[0].atk, 6); assert.strictEqual(d.units[0].def, 4); assert.strictEqual(d.units[0].spd, 6);
  d.runTurn(); assert.strictEqual(d.units[0].atk, 6);

  var dodges = 0, N = 3000;
  for (var i = 0; i < N; i++) {
    var e = battle([unit({ role: '교란자', hp: 999, atk: 1, spd: 1 }, 'ally', 1)], [unit({ hp: 999, spd: 9 }, 'enemy', 1)], 1000 + i);
    if (casts(e.runTurn(), 'enemy_1')[0].hits[0].dodged) dodges++;
  }
  assert.ok(Math.abs(dodges / N - R.dodgeRate / 100) < 0.03, '회피율 ' + dodges / N);
});

test('문서 미정 캐릭터: 투지 3 이상이면 공통 스킬(고정 피해 2)', function () {
  var b = battle([unit({ atk: 5, spd: 9 }, 'ally', 1)], [unit({ hp: 999, def: 0, atk: 1, spd: 1 }, 'enemy', 1)]);
  b.runTurn(); b.runTurn(); b.runTurn();
  assert.strictEqual(b.units[0].grit, 3);
  var c = casts(b.runTurn(), 'ally_1')[0];
  assert.strictEqual(c.isUltimate, true);
  assert.strictEqual(c.hits[0].damage, R.skillDamage);
  assert.strictEqual(b.units[0].grit, 1);
});

test('실데이터 패시브·스킬: 늪의 살갗/자폭, 배부름, 빛의 수호, 교활한 쥐/목긋기, 날카로운 이빨(출혈), 바다의 독(독 진행), 속박(기절)', function () {
  var C = CHARACTER_BY_ID;
  // 괴룸파: 맞을 때마다 차지 +1, 자폭 = 공격×차지 전체 + 자신 최대 HP 피해
  var g = BattleEngine.makeUnit(C['CHR_001'], 'ally', 1); g.grit = 10; g.charge = 4;
  var b = battle([g], [unit({ hp: 999, def: 0, atk: 1, spd: 1, role: '보호자' }, 'enemy', 1), unit({ hp: 999, def: 0, atk: 0, spd: 0 }, 'enemy', 2)]);
  var ev = b.runTurn();
  var cast = casts(ev, 'ally_1')[0];
  assert.strictEqual(cast.skillName, '자폭');
  assert.strictEqual(cast.hits.length, 2);
  assert.strictEqual(cast.hits[1].damage, 3 * 4);
  assert.strictEqual(b.units[0].alive, false);

  // 네벨라 배부름: 처치 시 공격 +3, HP +10
  var n = BattleEngine.makeUnit(C['CHR_002'], 'ally', 1);
  var b2 = battle([n], [unit({ hp: 1, def: 0, spd: 1 }, 'enemy', 1), unit({ hp: 999, atk: 0, spd: 0 }, 'enemy', 2)]);
  b2.runTurn();
  assert.strictEqual(n.atk, C['CHR_002'].atk + 3); assert.strictEqual(n.maxHp, C['CHR_002'].hp + 10);

  // 라피엘 빛의 수호: 회복이 보호막으로
  var l = BattleEngine.makeUnit(C['CHR_004'], 'ally', 1); l.hp = 10; l.grit = 3;
  var b3 = battle([l], [unit({ hp: 999, atk: 0, spd: 1 }, 'enemy', 1)]);
  b3.units[1].statuses.stunActions = 1;   // 적의 최소 피해 1이 보호막을 깎지 않도록
  var sh = l.shield;
  var ev3 = b3.runTurn();
  assert.ok(ev3.some(function (x) { return x.type === 'shield' && x.uid === 'ally_1'; }));
  assert.strictEqual(l.hp, 10); assert.strictEqual(l.shield, sh + Math.floor(l.maxHp * 0.1));

  // 로데레: 기본 공격에 표식, 표식 대상 피해 1.2배, 목긋기(투지 2)는 표식 대상 ×3 후 제거
  var r = BattleEngine.makeUnit(C['CHR_005'], 'ally', 1);
  var e = unit({ hp: 999, def: 0, atk: 0, spd: 1 }, 'enemy', 1);
  var b4 = battle([r], [e]);
  b4.runTurn();
  assert.ok(e.statuses.mark && e.statuses.mark.sourceUid === 'ally_1');
  var c2 = casts(b4.runTurn(), 'ally_1')[0];   // 투지 1: 기본 공격, 표식 1.2배
  assert.strictEqual(c2.hits[0].damage, Math.floor((C['CHR_005'].atk * 2) * 1.2));
  var c3 = casts(b4.runTurn(), 'ally_1')[0];   // 투지 2: 목긋기
  assert.strictEqual(c3.skillName, '목긋기');
  assert.strictEqual(c3.hits[0].damage, Math.floor(C['CHR_005'].atk * 3 * 1.2));
  assert.ok(!e.statuses.mark);

  // 샤키아 날카로운 이빨: 출혈 -> 턴 종료 최대 HP 5% (보호막 무시)
  var s = BattleEngine.makeUnit(C['CHR_015'], 'ally', 1); s.grit = 2;
  var e2 = unit({ hp: 200, def: 0, atk: 0, spd: 1, role: '보호자' }, 'enemy', 1);
  var b5 = battle([s], [e2]);
  var ev5 = b5.runTurn();
  assert.ok(e2.statuses.bleed);
  var tick = ev5.filter(function (x) { return x.type === 'bleed' && x.kw === 'bleed'; })[0];
  assert.strictEqual(tick.amount, 10);

  // 누디안 바다의 독: 독 단계 2% -> 4% -> 8%
  var p = unit({ hp: 1000, def: 0, atk: 0, spd: 1 }, 'enemy', 1); p.statuses.poison = { sourceUid: 'ally_1', stage: 0 };
  var b6 = battle([unit({ atk: 0, spd: 9 }, 'ally', 1)], [p]);
  var t1 = b6.runTurn().filter(function (x) { return x.type === 'bleed'; })[0];
  assert.strictEqual(t1.amount, Math.floor((1000 - 1) * 0.02));   // 기본 공격 최소 1 피해 후 2%
  var t2 = b6.runTurn().filter(function (x) { return x.type === 'bleed'; })[0];
  assert.ok(Math.abs(t2.amount - Math.floor(p.hp / 0.96 * 0.04)) <= 1);
  // 누디안 점액 피부: 상태이상 면역
  var nd = BattleEngine.makeUnit(C['CHR_003'], 'enemy', 1);
  assert.strictEqual(b6.applyHarmfulStatus(nd, 'bleed', {}), false);

  // 삼치 속박: 물살 대상 다음 행동 기절
  var sm = BattleEngine.makeUnit(C['CHR_014'], 'ally', 1); sm.grit = 5;
  var v = unit({ hp: 999, atk: 1, spd: 9 }, 'enemy', 1);
  var b7 = battle([sm], [v]);
  assert.ok(v.statuses.current, '스테이지 시작 시 물살');
  var ev7 = b7.runTurn();
  assert.ok(casts(ev7, 'ally_1')[0].skillName === '속박');
  var ev8 = b7.runTurn();
  assert.ok(ev8.some(function (x) { return x.type === 'skip' && x.uid === 'enemy_1'; }), '기절로 건너뜀');
});

test('전멸 판정 / 42종 실데이터 1:1 전투가 예외 없이 끝난다', function () {
  var b = battle([unit({ hp: 5, atk: 1, spd: 1 }, 'ally', 1)], [unit({ atk: 9, spd: 9 }, 'enemy', 1)]);
  var all = b.runAll();
  assert.strictEqual(b.result, 'lose'); assert.strictEqual(all[all.length - 1].type, 'end'); assert.strictEqual(b.units[0].active, false);
  var rng = new Rng(99), turns = [];
  for (var i = 0; i < CHARACTERS.length; i++) {
    var x = new BattleEngine.Battle([BattleEngine.makeUnit(CHARACTERS[i], 'ally', 1)], [BattleEngine.makeUnit(CHARACTERS[(i * 7 + 3) % 42], 'enemy', 1)], rng);
    x.runAll();
    assert.ok(x.result === 'win' || x.result === 'lose'); turns.push(x.turn);
  }
  console.log('   (1:1 평균 ' + (turns.reduce(function (a, c) { return a + c; }, 0) / turns.length).toFixed(1) + '턴, 최대 ' + Math.max.apply(null, turns) + '턴)');
});

// ---------------- 런 상태 ----------------
test('런: 첫 선택 -> 편성 -> 전투 -> 클리어 보상 -> 상점 구매/부활', function () {
  var run = new Run(1, 42);
  run.own('CHR_007'); run.place('CHR_007', 0);
  assert.strictEqual(run.stageLabel(), '챕터 1 - 스테이지 1');
  run.advance();
  var enemies = run.buildEnemies();
  assert.strictEqual(enemies.length, 1);
  assert.ok(enemies[0].type);
  var b = new BattleEngine.Battle(run.formationUnits(), enemies, run.rng);
  b.runAll();
  run.applyBattleResult(b);
  var gold = run.gold;
  if (b.result === 'win') { run.clearStage(); assert.strictEqual(run.gold, gold + 100); }
  var stock = run.buildShop();
  assert.strictEqual(stock.length, BALANCE.SHOP.slots);
  var chars = stock.filter(function (it) { return it.kind === 'character'; }), items = stock.filter(function (it) { return it.kind === 'item'; });
  assert.strictEqual(chars.length, BALANCE.SHOP.characterSlots); assert.strictEqual(items.length, BALANCE.SHOP.itemSlots);
  chars.forEach(function (it) { assert.ok(!CHARACTER_BY_ID[it.id].locked); assert.notStrictEqual(it.id, 'CHR_007'); });
  items.forEach(function (it) { assert.ok(BALANCE.ITEMS[it.itemId]); });
  run.gold = 1000;
  assert.ok(run.buy(chars[0])); assert.ok(!run.buy(chars[0])); assert.ok(run.owns(chars[0].id));
  assert.ok(run.buy(items[0])); assert.strictEqual(run.itemCount(items[0].itemId), 1);
  run.roster['CHR_007'].hp = 0;
  assert.ok(run.canRevive('CHR_007'));
  run.revive('CHR_007');
  assert.strictEqual(run.roster['CHR_007'].hp, Math.floor(CHARACTER_BY_ID['CHR_007'].hp * 0.5));
  // 편성 교체
  run.place(chars[0].id, 1); run.swapSlots(0, 1);
  assert.strictEqual(run.formation[0], chars[0].id); assert.strictEqual(run.formation[1], 'CHR_007');
});

test('레벨/EXP/아이템: 레벨업마다 체·공·방·속 +1, 최대 HP +10, 회복약은 전투불능에 불가', function () {
  var run = new Run(1, 11);
  run.own('CHR_001'); run.place('CHR_001', 0);
  var base = CHARACTER_BY_ID['CHR_001'];
  assert.deepStrictEqual(run.charStats('CHR_001').pts, base.pts);
  var res = run.addExp('CHR_001', BALANCE.LEVEL.expPerLevel);          // LV1 -> LV2
  assert.strictEqual(res.gained, 1); assert.strictEqual(run.roster['CHR_001'].level, 2);
  var st = run.charStats('CHR_001');
  assert.strictEqual(st.pts.atk, base.pts.atk + 1); assert.strictEqual(st.hp, base.hp + 10);
  assert.strictEqual(run.roster['CHR_001'].hp, base.hp + 10);           // 현재 HP 도 같이 상승
  var u = run.formationUnits()[0];
  assert.strictEqual(u.maxHp, base.hp + 10); assert.strictEqual(u.atk, base.atk + 1);
  // 아이템
  run.addItem('exp_l', 1); run.addItem('potion', 1);
  assert.ok(run.useItem('exp_l', 'CHR_001').ok); assert.strictEqual(run.itemCount('exp_l'), 0);
  assert.ok(run.roster['CHR_001'].level >= 3);
  run.roster['CHR_001'].hp = 0;
  assert.ok(!run.useItem('potion', 'CHR_001').ok); assert.strictEqual(run.itemCount('potion'), 1);
  run.roster['CHR_001'].hp = 10;
  assert.ok(run.useItem('potion', 'CHR_001').ok);
  assert.strictEqual(run.roster['CHR_001'].hp, 10 + Math.floor(run.maxHp('CHR_001') * 0.5));
  // 최대 레벨에서 멈춤
  run.addExp('CHR_001', 100000);
  assert.strictEqual(run.roster['CHR_001'].level, BALANCE.LEVEL.max);
  // 인벤토리 목록
  run.addItem('exp_s', 2);
  assert.deepStrictEqual(run.inventoryList().map(function (e) { return e.item.id + 'x' + e.count; }), ['exp_sx2']);
});

test('런: 보스 스테이지 고정 편성 / 배율 적용 / 이벤트 효과', function () {
  var run = new Run(1, 3);
  run.stageIndex = 14;
  var en = run.buildEnemies();
  assert.strictEqual(en.length, 3); assert.strictEqual(en[0].boss, true);
  assert.strictEqual(en[0].maxHp, Math.floor(CHARACTER_BY_ID['CHR_012'].hp * BALANCE.ENEMY.baseMult * (1 + BALANCE.ENEMY.stageGrowth * 14) * BALANCE.ENEMY.bossMult.hp));
  var r2 = new Run(1, 5);
  r2.own('CHR_001'); var max = CHARACTER_BY_ID['CHR_001'].hp; r2.roster['CHR_001'].hp = 30;
  r2.healAll(0.3); assert.strictEqual(r2.roster['CHR_001'].hp, 30 + Math.floor(max * 0.3));
  r2.gold = 100; var g = r2.gamble(); assert.strictEqual(g.bet, 50); assert.ok(r2.gold === 150 || r2.gold === 50);
});

console.log('\n' + passed + ' tests passed');
