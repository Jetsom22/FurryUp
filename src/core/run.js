// =====================================================================
// 런(한 번의 챕터 도전) 상태
// - 보유 캐릭터(레벨/EXP/체력) / 편성 5칸 / 골드 / 인벤토리 / 스테이지 목록 / 진행 인덱스
// - 로비 -> 챕터 선택 -> 게임 시작 시 새 런 생성, 사망 or 보스 클리어 시 로비 복귀
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
    this.roster = {};                   // id -> { id, hp, level, exp }  (체력은 스테이지 간 유지)
    this.formation = [null, null, null, null, null]; // 편성 순서 1~5 (index 0 = 1번)
    this.inventory = {};                // itemId -> 개수
    this.eventState = { eventsSeen: 0, harmfulCount: 0, midbossCleared: false };
    this.shopStock = null;
    this.cleared = false;
    this.log = [];
  }

  Run.prototype.currentStage = function () { return this.stages[this.stageIndex]; };
  Run.prototype.stageLabel = function () { return '챕터 ' + this.chapter + ' - 스테이지 ' + this.currentStage().no; };
  Run.prototype.isBossStage = function () { return this.currentStage().type === '보스'; };

  // ---- 레벨 반영 능력치 ----
  // 레벨 L 의 보너스 = statPerLevel × (L−1). 최대 HP = (체력 + 보너스) × hpMultiplier
  Run.prototype.charStats = function (id) {
    var base = root.CHARACTER_BY_ID[id];
    var r = this.roster[id];
    var lv = r ? r.level : 1;
    var k = lv - 1, S = B.LEVEL.statPerLevel;
    var pts = { hp: base.pts.hp + S.hp * k, atk: base.pts.atk + S.atk * k, def: base.pts.def + S.def * k, spd: base.pts.spd + S.spd * k };
    return { id: id, level: lv, exp: r ? r.exp : 0, expNext: B.LEVEL.expPerLevel * lv, pts: pts,
             hp: pts.hp * B.RULES.hpMultiplier, atk: pts.atk, def: pts.def, spd: pts.spd };
  };
  Run.prototype.maxHp = function (id) { return this.charStats(id).hp; };

  // ---- 보유 / 편성 ----
  Run.prototype.own = function (id) {
    if (!this.roster[id]) this.roster[id] = { id: id, hp: root.CHARACTER_BY_ID[id].hp, level: 1, exp: 0 };
  };
  Run.prototype.owns = function (id) { return !!this.roster[id]; };
  Run.prototype.ownedIds = function () { return Object.keys(this.roster); };
  Run.prototype.benchIds = function () { var f = this.formation; return this.ownedIds().filter(function (id) { return f.indexOf(id) < 0; }); };
  Run.prototype.place = function (id, slotIdx) {
    // 이미 다른 칸에 있으면 그 칸을 비운다
    for (var i = 0; i < 5; i++) if (this.formation[i] === id) this.formation[i] = null;
    this.formation[slotIdx] = id;
  };
  Run.prototype.unplace = function (slotIdx) { this.formation[slotIdx] = null; };
  Run.prototype.swapSlots = function (a, b) { var t = this.formation[a]; this.formation[a] = this.formation[b]; this.formation[b] = t; };
  Run.prototype.emptySlot = function () { return this.formation.indexOf(null); };
  Run.prototype.formationUnits = function () {
    var self = this;
    var units = [];
    this.formation.forEach(function (id, i) {
      if (!id) return;
      var base = root.CHARACTER_BY_ID[id];
      var st = self.charStats(id);
      var scaled = Object.assign({}, base, { hp: st.hp, atk: st.atk, def: st.def, spd: st.spd, level: st.level });
      units.push(root.BattleEngine.makeUnit(scaled, 'ally', i + 1, { hp: Math.min(self.roster[id].hp, st.hp) }));
    });
    return units;
  };
  Run.prototype.hasActiveFormation = function () {
    var self = this;
    return this.formation.some(function (id) { return id && self.roster[id].hp > 0; });
  };

  // ---- 레벨 / EXP ----
  Run.prototype.addExp = function (id, amount) {
    var r = this.roster[id];
    if (!r) return { gained: 0 };
    var gained = 0;
    r.exp += amount;
    while (r.level < B.LEVEL.max && r.exp >= B.LEVEL.expPerLevel * r.level) {
      r.exp -= B.LEVEL.expPerLevel * r.level;
      r.level += 1; gained += 1;
      if (r.hp > 0) r.hp += B.LEVEL.statPerLevel.hp * B.RULES.hpMultiplier;   // 최대 HP 가 오른 만큼 현재 HP 도
    }
    if (r.level >= B.LEVEL.max) r.exp = 0;
    return { gained: gained, level: r.level };
  };
  Run.prototype.healChar = function (id, rate) {
    var r = this.roster[id];
    if (!r || r.hp <= 0) return 0;
    var max = this.maxHp(id), before = r.hp;
    r.hp = Math.min(max, r.hp + Math.floor(max * rate));
    return r.hp - before;
  };

  // ---- 인벤토리 ----
  Run.prototype.addItem = function (itemId, n) { this.inventory[itemId] = (this.inventory[itemId] || 0) + (n || 1); };
  Run.prototype.itemCount = function (itemId) { return this.inventory[itemId] || 0; };
  Run.prototype.inventoryList = function () {
    var self = this;
    return Object.keys(this.inventory).filter(function (k) { return self.inventory[k] > 0; }).map(function (k) { return { item: B.ITEMS[k], count: self.inventory[k] }; });
  };
  // 아이템을 캐릭터에게 사용. 반환: { ok, text }
  Run.prototype.useItem = function (itemId, charId) {
    var it = B.ITEMS[itemId];
    if (!it || this.itemCount(itemId) <= 0 || !this.owns(charId)) return { ok: false, text: '사용할 수 없습니다.' };
    var name = root.CHARACTER_BY_ID[charId].name;
    if (it.exp) {
      var res = this.addExp(charId, it.exp);
      this.inventory[itemId] -= 1;
      return { ok: true, text: name + ' EXP +' + it.exp + (res.gained ? '  →  LV. ' + res.level + ' 달성! 체·공·방·속 +' + res.gained : '') };
    }
    if (it.healRate) {
      if (this.roster[charId].hp <= 0) return { ok: false, text: '전투불능 캐릭터에게는 사용할 수 없습니다. (부활 필요)' };
      var healed = this.healChar(charId, it.healRate);
      this.inventory[itemId] -= 1;
      return { ok: true, text: name + ' HP +' + healed };
    }
    return { ok: false, text: '효과가 없는 아이템입니다.' };
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
    this.ownedIds().forEach(function (id) { self.healChar(id, rate); });   // 사망자는 부활로만
  };
  Run.prototype.damageAll = function (rate) {
    var self = this;
    this.ownedIds().forEach(function (id) {
      var r = self.roster[id];
      if (r.hp <= 0) return;
      var max = self.maxHp(id);
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

  // ---- 상점 : 상품 5칸 = 캐릭터 3 + 아이템 2 (캐릭터가 모자라면 아이템으로 채움) ----
  Run.prototype.buildShop = function () {
    if (this.shopStock) return this.shopStock;
    var self = this, S = B.SHOP;
    var cands = root.CHARACTERS.filter(function (c) { return !c.locked && !self.owns(c.id); }).map(function (c) { return c.id; });
    var chars = this.rng.shuffle(cands).slice(0, S.characterSlots);
    var stock = chars.map(function (id) {
      return { kind: 'character', id: id, name: root.CHARACTER_BY_ID[id].name, price: self.rng.pick(B.GOLD.characterPrice), sold: false };
    });
    var weights = {};
    Object.keys(B.ITEMS).forEach(function (k) { weights[k] = B.ITEMS[k].weight || 1; });
    while (stock.length < S.slots) {
      var it = B.ITEMS[this.rng.weighted(weights)];
      stock.push({ kind: 'item', itemId: it.id, name: it.name, price: it.price, sold: false });
    }
    this.shopStock = stock;
    return stock;
  };
  Run.prototype.canBuy = function (item) { return !item.sold && this.gold >= item.price; };
  // 구매. 캐릭터는 보유만 하고 편성은 화면(빈 칸 자동 / 교체 선택)에서 결정
  Run.prototype.buy = function (item) {
    if (!this.canBuy(item)) return false;
    this.gold -= item.price;
    item.sold = true;
    if (item.kind === 'character') this.own(item.id);
    else this.addItem(item.itemId, 1);
    return true;
  };
  Run.prototype.canRevive = function (id) { return this.owns(id) && this.roster[id].hp <= 0 && this.gold >= B.GOLD.revive; };
  Run.prototype.revive = function (id) {
    if (!this.canRevive(id)) return false;
    this.gold -= B.GOLD.revive;
    this.roster[id].hp = Math.floor(this.maxHp(id) * B.GOLD.reviveHpRate);
    return true;
  };

  root.Run = Run;
})(typeof window !== 'undefined' ? window : globalThis);
