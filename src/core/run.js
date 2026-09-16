// =====================================================================
// 런(한 번의 챕터 도전) 상태
// - 보유 캐릭터 / 편성 / 골드 / 스테이지 목록 / 진행 인덱스
// - 아웃게임 -> 챕터 도전 시 새 런 생성, 사망 or 보스 클리어 시 아웃게임 복귀
// =====================================================================
(function (root) {
  var B = root.BALANCE;

  function Run(chapterNo, seed) {
    this.rng = new root.Rng(seed);
    this.seed = this.rng.seed;
    var gen = root.StageGen.generateChapter(chapterNo, this.rng);
    this.chapter = gen.chapter;
    this.chapterName = gen.name;
    this.stages = gen.stages;           // [{no, type}]
    this.midbossNo = gen.midboss;
    this.stageIndex = 0;                // 0-based, 현재 스테이지 = stages[stageIndex]
    this.gold = B.GOLD.start;
    this.roster = {};                   // id -> { id, hp }  (체력은 스테이지 간 유지)
    this.formation = [null, null, null, null, null]; // 편성 순서 1~5 (index 0 = 1번)
    this.eventState = { eventsSeen: 0, harmfulCount: 0, midbossCleared: false };
    this.shopStock = null;
    this.cleared = false;
    this.log = [];
  }

  Run.prototype.currentStage = function () { return this.stages[this.stageIndex]; };
  Run.prototype.stageLabel = function () { return '챕터 ' + this.chapter + ' - 스테이지 ' + this.currentStage().no; };
  Run.prototype.isBossStage = function () { return this.currentStage().type === '보스'; };

  // ---- 보유 / 편성 ----
  Run.prototype.own = function (id) {
    if (!this.roster[id]) this.roster[id] = { id: id, hp: root.CHARACTER_BY_ID[id].hp };
  };
  Run.prototype.owns = function (id) { return !!this.roster[id]; };
  Run.prototype.ownedIds = function () { return Object.keys(this.roster); };
  Run.prototype.place = function (id, slotIdx) {
    // 이미 다른 칸에 있으면 그 칸을 비운다
    for (var i = 0; i < 5; i++) if (this.formation[i] === id) this.formation[i] = null;
    this.formation[slotIdx] = id;
  };
  Run.prototype.unplace = function (slotIdx) { this.formation[slotIdx] = null; };
  Run.prototype.formationUnits = function () {
    var self = this;
    var units = [];
    this.formation.forEach(function (id, i) {
      if (!id) return;
      var base = root.CHARACTER_BY_ID[id];
      units.push(root.BattleEngine.makeUnit(base, 'ally', i + 1, { hp: self.roster[id].hp }));
    });
    return units;
  };
  Run.prototype.hasActiveFormation = function () {
    var self = this;
    return this.formation.some(function (id) { return id && self.roster[id].hp > 0; });
  };

  // ---- 적 편성 생성 (data/enemies.js) ----
  Run.prototype.buildEnemies = function () {
    var stage = this.currentStage();
    var growth = (B.ENEMY.baseMult || 1) * (1 + B.ENEMY.stageGrowth * (stage.no - 1));
    var typeMult = (stage.type === '중간보스') ? B.ENEMY.midbossMult : (stage.type === '보스') ? B.ENEMY.bossMult : null;

    var list = root.ENEMY_FORMATIONS[stage.no];
    if (!list) {
      var range = root.ENEMY_COUNT_BY_TYPE[stage.type];
      if (!range) {
        var row = root.ENEMY_COUNT_BY_STAGE.filter(function (r) { return stage.no <= r.upTo; })[0];
        range = row ? row.count : [1, 3];
      }
      var count = this.rng.int(range[0], range[1]);
      var picks = this.rng.shuffle(root.ENEMY_POOL).slice(0, count).map(function (id) { return { id: id }; });
      if (stage.type === '중간보스') picks[0] = { id: this.rng.pick(root.MIDBOSS_POOL), boss: true };
      list = picks;
    }

    return list.map(function (e, i) {
      var base = root.CHARACTER_BY_ID[e.id];
      var isHead = e.boss || (i === 0 && typeMult);
      var m = (isHead && typeMult) ? typeMult : { hp: 1, atk: 1 };
      var r1 = function (v) { return Math.round(v * 10) / 10; };
      var stats = {
        id: e.id,
        name: e.name || base.name,
        role: e.role || base.role, sourceRole: base.sourceRole,
        type: e.type || base.type, typeName: base.typeName,
        hp: Math.floor((e.hp || base.hp) * growth * m.hp),
        atk: r1((e.atk || base.atk) * growth * m.atk),
        def: e.def || base.def,   // 방어는 배율 없음 (뺄셈식이라 배율을 주면 후반 적이 면역이 됨)
        spd: e.spd || base.spd,
        priority: e.priority || 0,
        passive: base.passive, skill: base.skill,
        boss: !!e.boss,
      };
      return root.BattleEngine.makeUnit(stats, 'enemy', i + 1);
    });
  };

  // ---- 전투 결과 반영 ----
  Run.prototype.applyBattleResult = function (battle) {
    var self = this;
    battle.units.forEach(function (u) {
      if (u.side === 'ally' && self.roster[u.id]) self.roster[u.id].hp = u.hp;
    });
  };

  Run.prototype.rewardFor = function (stage) { return B.GOLD.reward[stage.type] || 0; };

  Run.prototype.clearStage = function () {
    var stage = this.currentStage();
    this.gold += this.rewardFor(stage);
    if (stage.type === '중간보스') this.eventState.midbossCleared = true;
    if (stage.type === '보스') this.cleared = true;
  };

  Run.prototype.advance = function () {
    this.stageIndex += 1;
    this.shopStock = null;
  };

  // ---- 이벤트 ----
  Run.prototype.rollEvent = function () {
    var effect = root.StageGen.rollEventEffect(this.rng, this.eventState);
    this.eventState.eventsSeen += 1;
    if (effect === '해로운') this.eventState.harmfulCount += 1;
    return effect;
  };
  Run.prototype.healAll = function (rate) {
    var self = this;
    this.ownedIds().forEach(function (id) {
      var r = self.roster[id];
      if (r.hp <= 0) return; // 사망자는 부활로만
      var max = root.CHARACTER_BY_ID[id].hp;
      r.hp = Math.min(max, r.hp + Math.floor(max * rate));
    });
  };
  Run.prototype.damageAll = function (rate) {
    var self = this;
    this.ownedIds().forEach(function (id) {
      var r = self.roster[id];
      if (r.hp <= 0) return;
      var max = root.CHARACTER_BY_ID[id].hp;
      r.hp = Math.max(1, r.hp - Math.floor(max * rate));
    });
  };
  Run.prototype.gamble = function () {
    var g = B.EVENT['도박'];
    var bet = Math.floor(this.gold * g.betRate);
    var win = this.rng.chance(g.winChance);
    this.gold += win ? bet * (g.winMult - 1) : -bet;
    return { bet: bet, win: win };
  };

  // ---- 상점 ----
  Run.prototype.buildShop = function () {
    if (this.shopStock) return this.shopStock;
    var self = this;
    var cands = root.CHARACTERS.filter(function (c) { return !c.locked && !self.owns(c.id); }).map(function (c) { return c.id; });
    var picks = this.rng.shuffle(cands).slice(0, B.GOLD.shopSlots);
    this.shopStock = picks.map(function (id) {
      return { kind: 'character', id: id, price: self.rng.pick(B.GOLD.characterPrice), sold: false };
    });
    return this.shopStock;
  };
  Run.prototype.buy = function (item) {
    if (item.sold || this.gold < item.price) return false;
    this.gold -= item.price;
    item.sold = true;
    this.own(item.id);
    return true;
  };
  Run.prototype.canRevive = function (id) { return this.owns(id) && this.roster[id].hp <= 0 && this.gold >= B.GOLD.revive; };
  Run.prototype.revive = function (id) {
    if (!this.canRevive(id)) return false;
    this.gold -= B.GOLD.revive;
    this.roster[id].hp = Math.floor(root.CHARACTER_BY_ID[id].hp * B.GOLD.reviveHpRate);
    return true;
  };

  root.Run = Run;
})(typeof window !== 'undefined' ? window : globalThis);
