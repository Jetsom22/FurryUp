// =====================================================================
// 전투 화면 (UI 개편 와이어프레임 "전투 스테이지")
//  좌상 스테이지 진행 바 · 상단 중앙 "현재 턴 | NN" · 우상 설정
//  좌측 진행 로그 · 우측 적 파티 목록(초상 + 세로 HP) · 중앙 겹친 적 카드(앞장 = 지금 행동/피격 중인 적)
//  하단 아군 카드 5장 (초상 · 이름 · HP · 세로 투지 바 · 모서리 역할군 아이콘 · 상태 칩)
//  전투는 진입 후 자동 시작
// =====================================================================
var BL = {
  track:   { x: 25, y: 20, w: 540, h: 128 },
  turn:    { x: 1000, y: 66 },
  settings:{ x: 1815, y: 15, s: 80 },
  log:     { x: 25, y: 230, w: 395, h: 360 },
  elist:   { x: 1778, y: 148, s: 96, barW: 20, gap: 120 },
  stack:   { x: 648, y: 255, w: 600, h: 520, dx: 63, dy: -25, head: 40, hpH: 36, gritH: 28 },
  ally:    { xs: [135, 488, 843, 1198, 1553], y: 775, w: 195, h: 235, nameH: 36, hpH: 40, gritW: 36, cells: 6 },
};

var BattleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function BattleScene() { Phaser.Scene.call(this, { key: 'BattleScene' }); },

  create: function () {
    var T = Theme, self = this;
    var run = Flow.run(this);
    this.run = run;
    this.stage = run.currentStage();
    this.speed = this.registry.get('speed') || 1;
    this.cameras.main.setBackgroundColor(T.bgCss);
    this.cards = {};        // uid -> 아군 카드 / 적 목록 카드
    this.stackCards = {};   // uid -> 중앙 적 카드
    this.logLines = [];
    this.started = false;
    this.frontUid = null;

    if (!run.currentEnemies || run.currentEnemiesStage !== run.stageIndex) {
      run.currentEnemies = run.buildEnemies();
      run.currentEnemiesStage = run.stageIndex;
    }
    this.battle = new BattleEngine.Battle(run.formationUnits(), run.currentEnemies, run.rng);

    this.buildHud();
    this.buildEnemyStack();
    this.buildEnemyList();
    this.buildAllyCards();
    this.pushLog(run.stageLabel() + ' [' + this.stage.type + '] 진입. 전투를 시작합니다.');
    this.time.delayedCall(700 / this.speed, function () { self.startBattle(); });
  },

  // ---------------- HUD ----------------
  buildHud: function () {
    var T = Theme, L = BL, self = this;
    Widgets.stageTrack(this, L.track.x, L.track.y, L.track.w, L.track.h, this.run);
    var typeColor = { 일반: T.muted, 이벤트: '#5fc6d6', 중간보스: '#e8a03a', 보스: '#e06060' }[this.stage.type] || T.muted;
    this.add.text(L.track.x + L.track.w - 16, L.track.y + 12, this.run.stageLabel() + '  [' + this.stage.type + ']', T.style(15, typeColor)).setOrigin(1, 0);

    this.turnText = this.add.text(L.turn.x, L.turn.y, '현재 턴 | 0', T.style(56, T.text, { fontStyle: 'bold' })).setOrigin(0.5);

    // 진행 로그
    T.panel(this, L.log.x, L.log.y, L.log.w, L.log.h, { fill: T.panelDark });
    this.add.text(L.log.x + 16, L.log.y + 12, '진행 로그', T.style(18, T.text, { fontStyle: 'bold' }));
    this.logText = this.add.text(L.log.x + 16, L.log.y + L.log.h - 12, '', T.style(15, T.text, { wordWrap: { width: L.log.w - 32 }, lineSpacing: 4 })).setOrigin(0, 1);
    var maskShape = this.make.graphics({ x: 0, y: 0, add: false });
    maskShape.fillStyle(0xffffff); maskShape.fillRect(L.log.x, L.log.y + 40, L.log.w, L.log.h - 50);
    this.logText.setMask(maskShape.createGeometryMask());

    // 설정
    var sg = this.add.graphics();
    sg.fillStyle(T.panelDark, 1); sg.fillRoundedRect(L.settings.x, L.settings.y, L.settings.s, L.settings.s, 8);
    sg.lineStyle(2, T.line, 1); sg.strokeRoundedRect(L.settings.x, L.settings.y, L.settings.s, L.settings.s, 8);
    this.add.text(L.settings.x + L.settings.s / 2, L.settings.y + L.settings.s / 2, '설정', T.style(24, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.zone(L.settings.x, L.settings.y, L.settings.s, L.settings.s).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerdown', function () { self.openSettings(); });
  },

  // ---------------- 중앙 적 카드 (겹침) ----------------
  buildEnemyStack: function () {
    var self = this, T = Theme, S = BL.stack;
    var enemies = this.battle.units.filter(function (u) { return u.side === 'enemy'; });
    this.stackLayer = this.add.container(0, 0);
    enemies.forEach(function (u) {
      var c = self.add.container(0, 0);
      c.unit = u;
      c.bg = self.add.graphics(); c.add(c.bg);
      // 머리 띠: 이름 · 역할군
      c.name = self.add.text(16, 8, u.name + (u.boss ? '  [BOSS]' : ''), T.style(22, T.text, { fontStyle: 'bold' }));
      c.role = self.add.text(S.w - 16, 12, u.role + ' · ' + u.typeName, T.style(15, T.ROLE_COLOR[u.role] || T.muted)).setOrigin(1, 0);
      c.add([c.name, c.role]);
      // 상세 (앞장에서만 보임)
      c.detail = self.add.container(0, 0);
      c.hpBack = self.add.rectangle(0, S.head, S.w, S.hpH, 0x5a1f1f).setOrigin(0);
      c.hpFill = self.add.rectangle(0, S.head, S.w, S.hpH, 0xe03030).setOrigin(0);
      c.shieldFill = self.add.rectangle(0, S.head + S.hpH - 6, 0, 6, T.shield).setOrigin(0);
      c.hpText = self.add.text(S.w / 2, S.head + S.hpH / 2, '', T.style(20, '#ffffff', { fontStyle: 'bold', stroke: '#000', strokeThickness: 3 })).setOrigin(0.5);
      c.gritG = self.add.graphics();
      c.gritText = self.add.text(S.w - 8, S.head + S.hpH + S.gritH / 2, '', T.style(13, '#3a2a10', { fontStyle: 'bold' })).setOrigin(1, 0.5);
      var pTop = S.head + S.hpH + S.gritH;
      var img = null;
      if (self.textures.exists(u.id)) {
        img = self.add.image(S.w / 2, S.h - 6, u.id).setOrigin(0.5, 1);
        img.setScale(Math.min((S.w - 40) / img.width, (S.h - pTop - 12) / img.height));
        img.setFlipX(true);
      }
      c.img = img;
      c.statText = self.add.text(12, pTop + 8, '', T.style(14, T.muted));
      c.chipText = self.add.text(12, pTop + 30, '', T.style(14, '#ffd166', { fontStyle: 'bold' }));
      c.detail.add([c.hpBack, c.hpFill, c.shieldFill, c.hpText, c.gritG, c.gritText]);
      if (img) c.detail.add(img);
      c.detail.add([c.statText, c.chipText]);
      c.add(c.detail);
      c.centerX = 0; c.centerY = 0;
      self.stackLayer.add(c);
      self.stackCards[u.uid] = c;
    });
    this.layoutStack(enemies[0] ? enemies[0].uid : null, true);
  },

  // 앞장 = frontUid. 나머지는 편성 순서대로 뒤로 겹침
  layoutStack: function (frontUid, instant) {
    var self = this, S = BL.stack, T = Theme;
    var alive = this.battle.units.filter(function (u) { return u.side === 'enemy' && u.alive; });
    if (!alive.length) return;
    if (!frontUid || !this.stackCards[frontUid] || !this.stackCards[frontUid].unit.alive) frontUid = alive[0].uid;
    this.frontUid = frontUid;
    var order = [frontUid].concat(alive.map(function (u) { return u.uid; }).filter(function (id) { return id !== frontUid; }));
    // 뒤에서부터 그리기 위해 역순으로 재배치
    order.slice().reverse().forEach(function (uid) { self.stackLayer.bringToTop(self.stackCards[uid]); });
    order.forEach(function (uid, i) {
      var c = self.stackCards[uid];
      var tx = S.x + S.dx * i, ty = S.y + S.dy * i;
      var front = i === 0;
      c.bg.clear();
      c.bg.fillStyle(front ? T.panel : 0x2a241c, 1); c.bg.fillRoundedRect(0, 0, S.w, S.h, 10);
      c.bg.lineStyle(front ? 4 : 2, front ? (c.unit.boss ? 0xe06060 : T.accent) : T.line, 1); c.bg.strokeRoundedRect(0, 0, S.w, S.h, 10);
      c.detail.setVisible(front);
      c.name.setAlpha(front ? 1 : 0.7); c.role.setAlpha(front ? 1 : 0.7);
      c.setVisible(true);
      c.centerX = tx + S.w / 2; c.centerY = ty + S.h / 2;
      if (instant) { c.setPosition(tx, ty); }
      else { self.tweens.killTweensOf(c); self.tweens.add({ targets: c, x: tx, y: ty, duration: 180 / self.speed, ease: 'Quad.easeOut' }); }
      if (front) self.refreshStack(c);
    });
    // 죽은 적은 숨김
    Object.keys(this.stackCards).forEach(function (uid) { if (!self.stackCards[uid].unit.alive) self.stackCards[uid].setVisible(false); });
    this.highlightList(frontUid);
  },

  refreshStack: function (c) {
    var S = BL.stack, u = c.unit, T = Theme;
    var ratio = Math.max(0, u.hp / u.maxHp);
    c.hpFill.width = S.w * ratio;
    c.shieldFill.width = Math.min(S.w, S.w * (u.shield / u.maxHp));
    c.hpText.setText('HP ' + u.hp + ' / ' + u.maxHp + (u.shield ? '   🛡' + u.shield : ''));
    var need = BattleEngine.skillCost(u), cells = Math.max(need, 1);
    c.gritG.clear();
    var cw = S.w / cells;
    for (var i = 0; i < cells; i++) {
      c.gritG.fillStyle(i < u.grit ? 0xffe23a : 0x4a4020, 1); c.gritG.fillRect(i * cw + 1, S.head + S.hpH + 1, cw - 2, S.gritH - 2);
    }
    c.gritText.setText('투지 ' + u.grit + ' / ' + need);
    var r1 = function (v) { return Math.round(v * 10) / 10; };
    c.statText.setText('공 ' + r1(u.atk) + '  방 ' + r1(u.def) + '  속 ' + r1(u.spd));
    c.chipText.setText(Widgets.statusChips(u).map(function (ch) { return ch.t; }).join('  '));
  },

  // ---------------- 우측 적 파티 목록 ----------------
  buildEnemyList: function () {
    var self = this, T = Theme, E = BL.elist;
    var enemies = this.battle.units.filter(function (u) { return u.side === 'enemy'; });
    this.add.text(E.x + (E.s + E.barW) / 2, E.y - 26, '적 파티', T.style(16, T.muted)).setOrigin(0.5);
    enemies.forEach(function (u, i) {
      var y = E.y + i * E.gap;
      var c = self.add.container(0, 0);
      c.unit = u;
      c.portrait = T.portrait(self, E.x, y, E.s, u.id, { line: u.boss ? 0xe06060 : T.line });
      if (c.portrait.img) c.portrait.img.setFlipX(true);
      c.hpBack = self.add.rectangle(E.x + E.s + 4, y, E.barW, E.s, 0x5a1f1f).setOrigin(0);
      c.hpFill = self.add.rectangle(E.x + E.s + 4, y + E.s, E.barW, E.s, 0xe03030).setOrigin(0, 1);
      c.add([c.portrait, c.hpBack, c.hpFill]);
      c.centerX = E.x + E.s / 2; c.centerY = y + E.s / 2;
      var z = self.add.zone(E.x, y, E.s + E.barW + 4, E.s).setOrigin(0).setInteractive({ useHandCursor: true });
      z.on('pointerdown', function () { if (u.alive && !self.animating) self.layoutStack(u.uid, false); });
      c.add(z);
      self.cards[u.uid] = c;
      self.refreshCard(c);
    });
  },

  highlightList: function (uid) {
    var T = Theme, self = this;
    Object.keys(this.cards).forEach(function (k) {
      var c = self.cards[k];
      if (c.unit.side !== 'enemy') return;
      c.portrait.setBorder(k === uid ? T.accent : (c.unit.boss ? 0xe06060 : T.line), k === uid ? 4 : 2);
    });
  },

  // ---------------- 하단 아군 카드 ----------------
  buildAllyCards: function () {
    var self = this;
    this.battle.units.filter(function (u) { return u.side === 'ally'; }).forEach(function (u) { self.cards[u.uid] = self.makeAllyCard(u); });
  },

  makeAllyCard: function (u) {
    var T = Theme, A = BL.ally, self = this;
    var x = A.xs[u.slot - 1], y = A.y;
    var c = this.add.container(0, 0);
    c.unit = u;
    var imgH = A.h - A.nameH - A.hpH;
    var bg = this.add.graphics();
    bg.fillStyle(T.panelDark, 1); bg.fillRect(x, y, A.w, A.h);
    bg.lineStyle(3, T.line, 1); bg.strokeRect(x, y, A.w, A.h);
    c.add(bg);
    c.portrait = T.portrait(this, x + 3, y + 3, A.w - 6, u.id, { lineWidth: 1, line: T.panelDark, fill: T.panelDark });
    if (c.portrait.img) { var s = Math.min((A.w - 6) / c.portrait.img.width, (imgH - 6) / c.portrait.img.height); c.portrait.img.setScale(s).setPosition((A.w - 6) / 2, (imgH - 6) / 2); c.portrait.frame.clear(); }
    c.add(c.portrait);
    // 이름 띠
    c.add(this.add.rectangle(x, y + imgH, A.w, A.nameH, T.panel).setOrigin(0).setStrokeStyle(1, T.line));
    c.add(this.add.text(x + A.w / 2, y + imgH + A.nameH / 2, u.name, T.style(u.name.length > 7 ? 15 : 19, T.text, { fontStyle: 'bold' })).setOrigin(0.5));
    // HP 띠
    c.hpBack = this.add.rectangle(x, y + imgH + A.nameH, A.w, A.hpH, 0x5a1f1f).setOrigin(0);
    c.hpFill = this.add.rectangle(x, y + imgH + A.nameH, A.w, A.hpH, 0xe03030).setOrigin(0);
    c.shieldFill = this.add.rectangle(x, y + imgH + A.nameH + A.hpH - 6, 0, 6, T.shield).setOrigin(0);
    c.hpText = this.add.text(x + A.w / 2, y + imgH + A.nameH + A.hpH / 2, '', T.style(18, '#ffffff', { fontStyle: 'bold', stroke: '#000', strokeThickness: 3 })).setOrigin(0.5);
    c.add([c.hpBack, c.hpFill, c.shieldFill, c.hpText]);
    // 모서리 아이콘 (역할군 색 + 타입)
    var badge = this.add.graphics();
    badge.fillStyle(T.ROLE_HEX[u.role] || 0x888888, 1); badge.fillRect(x + A.w - 36, y + 4, 32, 32);
    badge.lineStyle(1, 0x000000, 0.5); badge.strokeRect(x + A.w - 36, y + 4, 32, 32);
    c.add(badge);
    c.add(this.add.text(x + A.w - 20, y + 20, u.typeName, T.style(15, '#1a1510', { fontStyle: 'bold' })).setOrigin(0.5));
    // 세로 투지 바
    c.gritG = this.add.graphics();
    c.add(c.gritG);
    c.add(this.add.text(x + A.w + A.gritW / 2, y + A.h + 4, '투지', T.style(17, T.text, { fontStyle: 'bold' })).setOrigin(0.5, 0));
    c.gritText = this.add.text(x + A.w + A.gritW / 2, y + A.h + 26, '', T.style(13, T.accentCss)).setOrigin(0.5, 0);
    c.add(c.gritText);
    // 상태 칩 (카드 위)
    c.chipLayer = this.add.container(0, 0);
    c.add(c.chipLayer);
    // 전투불능 오버레이
    c.deadOverlay = this.add.container(0, 0).setVisible(false);
    c.deadOverlay.add(this.add.rectangle(x, y, A.w, imgH, 0x000000, 0.65).setOrigin(0));
    c.deadOverlay.add(this.add.text(x + A.w / 2, y + imgH / 2, '전투불능', T.style(22, '#e08080', { fontStyle: 'bold' })).setOrigin(0.5));
    c.add(c.deadOverlay);
    c.centerX = x + A.w / 2; c.centerY = y + imgH / 2;
    c.baseX = x; c.baseY = y;
    this.refreshCard(c);
    if (!u.alive) this.applyDeath(c, true);
    return c;
  },

  refreshCard: function (c) {
    var T = Theme, A = BL.ally, u = c.unit;
    var ratio = Math.max(0, u.hp / u.maxHp);
    if (u.side === 'enemy') {
      c.hpFill.height = BL.elist.s * ratio;
      if (c.portrait.img) c.portrait.img.setTint(u.alive ? 0xffffff : 0x444444);
      return;
    }
    c.hpFill.width = A.w * ratio;
    c.shieldFill.width = Math.min(A.w, A.w * (u.shield / u.maxHp));
    c.hpText.setText('HP ' + u.hp + ' / ' + u.maxHp + (u.shield ? ' 🛡' + u.shield : ''));
    var need = BattleEngine.skillCost(u), cells = Math.max(need, 1);
    var x = c.baseX + A.w, y = c.baseY, ch = A.h / cells;
    c.gritG.clear();
    c.gritG.fillStyle(0x4a4020, 1); c.gritG.fillRect(x, y, A.gritW, A.h);
    for (var i = 0; i < cells; i++) {
      var filled = i < u.grit;
      c.gritG.fillStyle(filled ? 0xffe23a : 0x4a4020, 1);
      c.gritG.fillRect(x + 2, y + A.h - (i + 1) * ch + 1, A.gritW - 4, ch - 2);
    }
    c.gritG.lineStyle(2, T.line, 1); c.gritG.strokeRect(x, y, A.gritW, A.h);
    c.gritText.setText(u.grit + '/' + need).setColor(u.grit >= need ? '#ffe23a' : T.accentCss);
    // 상태 칩
    c.chipLayer.removeAll(true);
    var chips = Widgets.statusChips(u), cx = c.baseX;
    var self = this;
    chips.forEach(function (ch) {
      var t = self.add.text(0, 0, ch.t, T.style(13, '#1a1510', { fontStyle: 'bold' }));
      var w = t.width + 12;
      var g = self.add.graphics(); g.fillStyle(ch.c, 1); g.fillRoundedRect(cx, c.baseY - 30, w, 24, 6);
      t.setPosition(cx + 6, c.baseY - 28);
      c.chipLayer.add([g, t]);
      cx += w + 6;
    });
  },

  applyDeath: function (c, instant) {
    var u = c.unit, self = this;
    if (u.side === 'ally') {
      c.portrait.setDim(true);
      c.deadOverlay.setVisible(true);
    } else {
      this.refreshCard(c);
      var sc = this.stackCards[u.uid];
      if (instant) { sc.setVisible(false); this.layoutStack(this.frontUid, true); }
      else this.tweens.add({ targets: sc, alpha: 0, duration: BALANCE.ANIM.death / this.speed, onComplete: function () { sc.setVisible(false); sc.setAlpha(1); self.layoutStack(self.frontUid, false); } });
    }
  },

  pushLog: function (line) {
    this.logLines.push(line);
    if (this.logLines.length > 16) this.logLines.shift();
    this.logText.setText(this.logLines.join('\n'));
  },

  // 유닛의 화면상 표시 위치 (아군 카드 / 앞장 적 카드)
  viewOf: function (uid) {
    var u = this.battle.byUid(uid);
    if (u.side === 'ally') return this.cards[uid];
    return this.stackCards[uid];
  },

  // ---------------- 전투 진행 ----------------
  startBattle: function () {
    if (this.started) return;
    this.started = true;
    var events = this.battle.start();
    var self = this;
    this.playEvents(events, function () { self.nextTurn(); });
  },

  nextTurn: function () {
    if (this.battle.finished) return;
    var events = this.battle.runTurn();
    var self = this;
    this.playEvents(events, function () {
      if (self.battle.finished) return;
      self.time.delayedCall(BALANCE.ANIM.turnGap / self.speed, function () { self.nextTurn(); });
    });
  },

  playEvents: function (events, done) {
    var self = this, i = 0;
    this.animating = true;
    var step = function () {
      if (i >= events.length) { self.animating = false; done(); return; }
      var ev = events[i++];
      self.playEvent(ev, step);
    };
    step();
  },

  refreshAll: function () {
    var self = this;
    Object.keys(this.cards).forEach(function (k) { self.refreshCard(self.cards[k]); });
    if (this.frontUid && this.stackCards[this.frontUid]) this.refreshStack(this.stackCards[this.frontUid]);
  },

  playEvent: function (ev, next) {
    var T = Theme, A = BALANCE.ANIM, self = this, sp = this.speed;
    if (ev.log) this.pushLog(ev.log);
    var u = ev.uid ? this.battle.byUid(ev.uid) : null;
    var view = ev.uid ? this.viewOf(ev.uid) : null;
    switch (ev.type) {
      case 'turnStart':
        this.turnText.setText('현재 턴 | ' + ev.turn);
        this.tweens.add({ targets: this.turnText, scale: { from: 1.25, to: 1 }, duration: 200 / sp });
        this.refreshAll();
        next(); break;

      case 'order':
        this.pushLog('행동 순서: ' + ev.uids.map(function (id) { return self.battle.byUid(id).name; }).join(' → '));
        this.time.delayedCall(A.orderShow / 2 / sp, next); break;

      case 'shield':
        this.refreshAll();
        if (view) T.floatText(this, view.centerX, view.centerY - 40, '🛡 +' + ev.amount, '#9fd4f0', 26);
        this.time.delayedCall(A.hit / sp, next); break;

      case 'cast': {
        var isAlly = u.side === 'ally';
        // 적이 행동하면 그 적을 앞장으로. 아군이 공격하면 첫 대상 적을 앞장으로
        var focus = isAlly ? (ev.hits[0] ? ev.hits[0].targetUid : null) : ev.uid;
        if (focus && this.battle.byUid(focus).side === 'enemy' && focus !== this.frontUid) this.layoutStack(focus, false);
        var actor = this.viewOf(ev.uid);
        var delay = focus && focus !== this.frontUid ? 190 : 0;
        this.time.delayedCall(delay / sp, function () {
          if (ev.isUltimate) T.floatText(self, actor.centerX, actor.centerY - 120, ev.skillName + '!', '#ffd166', 32);
          var dir = isAlly ? -1 : 1;   // 아군은 위로, 적은 아래로 찌른다
          var prop = 'y', from = actor.y;
          self.tweens.add({
            targets: actor, y: from + 40 * dir, duration: (A.attack / 2) / sp, yoyo: true, ease: 'Quad.easeOut',
            onYoyo: function () {
              self.refreshAll();
              var seen = {};
              ev.hits.forEach(function (h) {
                var tu = self.battle.byUid(h.targetUid);
                var target = self.viewOf(h.targetUid);
                if (tu.side === 'enemy' && h.targetUid !== self.frontUid) target = self.cards[h.targetUid];   // 뒤에 있는 적은 우측 목록에 표시
                var oy = (seen[h.targetUid] || 0) * 28; seen[h.targetUid] = (seen[h.targetUid] || 0) + 1;
                if (h.dodged) {
                  T.floatText(self, target.centerX, target.centerY - 30 - oy, 'MISS', '#9fd4f0', 30);
                } else {
                  var txt = '-' + h.damage + (h.absorbed ? ' (🛡' + h.absorbed + ')' : '');
                  T.floatText(self, target.centerX, target.centerY - 30 - oy, txt, ev.isUltimate ? '#ffd166' : '#ff6b6b', ev.isUltimate ? 40 : 32);
                  var img = target.img || (target.portrait && target.portrait.img);
                  if (img) img.setTint(0xff6666);
                  var bx = target.x;
                  self.tweens.add({ targets: target, x: bx + 12, duration: 60 / sp, yoyo: true, repeat: 2, onComplete: function () { target.x = bx; if (img && tu.alive) img.clearTint(); } });
                }
              });
            },
            onComplete: function () { actor.y = from; self.time.delayedCall(A.hit / sp, next); },
          });
        });
        break;
      }

      case 'skip':
        if (view) T.floatText(this, view.centerX, view.centerY - 40, '기절', '#c0c0ff', 28);
        this.time.delayedCall(A.hit / sp, next); break;

      case 'death':
        this.applyDeath(this.cards[ev.uid], false);
        this.time.delayedCall(A.death / sp, next); break;

      case 'heal':
        this.refreshAll();
        if (view) T.floatText(this, view.centerX, view.centerY - 40, (ev.amount >= 0 ? '+' : '') + ev.amount, ev.amount >= 0 ? '#7fe07f' : '#ff9f9f', 28);
        this.time.delayedCall(A.hit / sp, next); break;

      case 'bleed':
        this.refreshAll();
        if (view) T.floatText(this, view.centerX, view.centerY - 40, '-' + ev.amount + (ev.kw === 'poison' ? ' 독' : ' 출혈'), ev.kw === 'poison' ? '#b070e0' : '#e06060', 26);
        this.time.delayedCall(A.hit / sp, next); break;

      case 'status':
      case 'fight':
      case 'turnEnd':
        this.refreshAll();
        this.time.delayedCall(40 / sp, next); break;

      case 'end':
        this.time.delayedCall(500 / sp, function () { self.showResult(ev.result); });
        next(); break;

      default: next();
    }
  },

  // ---------------- 결과 ----------------
  showResult: function (result) {
    var T = Theme, W = T.W, H = T.H, self = this;
    var run = this.run;
    run.applyBattleResult(this.battle);
    var layer = this.add.container(0, 0).setDepth(200);
    layer.add(T.overlay(this, 0.65));
    var win = result === 'win';
    layer.add(T.panel(this, W / 2 - 360, H / 2 - 190, 720, 380, { fill: T.panel, line: win ? T.accent : T.danger, lineWidth: 3 }));
    layer.add(this.add.text(W / 2, H / 2 - 110, win ? 'WIN' : 'LOSE', T.style(96, win ? T.accentCss : '#e06060', { fontStyle: 'bold' })).setOrigin(0.5));
    layer.add(this.add.text(W / 2, H / 2 - 10, win ? '남은 적 캐릭터가 없습니다. 스테이지 클리어!' : '아군 캐릭터가 모두 쓰러졌습니다. 클리어 실패', T.style(24, T.text)).setOrigin(0.5));
    if (win) {
      var reward = run.rewardFor(this.stage);
      layer.add(this.add.text(W / 2, H / 2 + 40, '보상  +' + reward + ' G   (턴 ' + this.battle.turn + ')', T.style(22, '#ffd166')).setOrigin(0.5));
      layer.add(T.button(this, W / 2 - 150, H / 2 + 90, 300, 70, run.isBossStage() ? '챕터 클리어 → 로비' : '상점으로', function () { Flow.stageCleared(self); }, { fontSize: 24 }));
    } else {
      layer.add(this.add.text(W / 2, H / 2 + 40, '전멸 시 로비로 돌아갑니다.', T.style(20, T.muted)).setOrigin(0.5));
      layer.add(T.button(this, W / 2 - 150, H / 2 + 90, 300, 70, '로비로', function () { Flow.runFailed(self); }, { fontSize: 24, fill: T.danger }));
    }
  },

  // ---------------- 설정 팝업 ----------------
  openSettings: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    if (this.settingsLayer) return;
    var layer = this.settingsLayer = this.add.container(0, 0).setDepth(300);
    layer.add(T.overlay(this, 0.6));
    layer.add(T.panel(this, W / 2 - 260, H / 2 - 200, 520, 400, { fill: T.panel, line: T.accent }));
    layer.add(this.add.text(W / 2, H / 2 - 160, '설정', T.style(32, T.text, { fontStyle: 'bold' })).setOrigin(0.5));
    layer.add(this.add.text(W / 2, H / 2 - 105, '전투 진행 속도', T.style(20, T.muted)).setOrigin(0.5));
    var speeds = [1, 2, 4];
    var btns = [];
    speeds.forEach(function (s, i) {
      var b = T.button(self, W / 2 - 210 + i * 145, H / 2 - 75, 130, 56, 'x' + s, function () {
        self.speed = s; self.registry.set('speed', s);
        btns.forEach(function (bb, j) { bb.setEnabled(speeds[j] !== s); });
      }, { fill: T.panelDark, fontSize: 22 });
      if (s === self.speed) b.setEnabled(false);
      btns.push(b); layer.add(b);
    });
    var RR = BALANCE.RULES;
    layer.add(this.add.text(W / 2, H / 2 - 5, '규칙 세트 α-02 · 피해 = max(' + RR.minDamage + ', ⌊공격×' + RR.attackFactor + ' − 방어⌋) · HP×' + RR.hpMultiplier + ' · 투지 +' + RR.gritGain + '/행동 · 회피 ' + RR.dodgeRate + '%', T.style(14, T.muted)).setOrigin(0.5));
    layer.add(this.add.text(W / 2, H / 2 + 20, '시드 ' + this.run.seed + '  ·  스테이지 ' + this.run.currentStage().no + ' / ' + this.run.stages.length, T.style(14, T.dim)).setOrigin(0.5));
    layer.add(T.button(this, W / 2 - 210, H / 2 + 50, 420, 56, '로비로 나가기 (런 포기)', function () { self.scene.start('LobbyScene', { message: '런을 포기하고 로비로 돌아왔습니다.', cleared: false }); }, { fill: T.danger, fontSize: 20 }));
    layer.add(T.button(this, W / 2 - 100, H / 2 + 125, 200, 56, '닫기', function () { layer.destroy(); self.settingsLayer = null; }, { fill: T.panelDark, fontSize: 22 }));
  },
});
