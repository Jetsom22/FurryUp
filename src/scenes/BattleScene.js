// =====================================================================
// 전투 화면 (전투 기획서 p.9 UI 와이어 프레임)
//  1 챕터/스테이지 표기  2 턴 수  3 행동 순서(A 안내, B 캐릭터 이미지)  4 진행 로그
//  5 캐릭터 명  6 투지 수  7 캐릭터 이미지  8 설정 아이콘  9 남은 적의 수
//  10 스테이지 진행 시작 버튼 (진입 후 1회만 클릭 가능)
// 좌표는 와이어프레임을 1920x1080 으로 환산한 값
// =====================================================================
var LAYOUT = {
  stageLabel: { x: 80, y: 38, w: 188, h: 70 },
  turnLabel:  { x: 80, y: 136, w: 188, h: 70 },
  order:      { x: 61, y: 235, w: 180, h: 344, labelX: 79, labelY: 246, listX: 195, listY: 246, cell: 36, gap: 5 },
  log:        { x: 61, y: 607, w: 456, h: 394 },
  rowTop: [30, 236, 441, 648, 853],
  portrait: 151,
  ally:  { nameX: 571, nameW: 135, nameH: 52, fightY: 62, imgX: 743 },
  enemy: { imgX: 1193, nameX: 1362, nameW: 148, nameH: 52, fightY: 62 },
  hpBarY: 164, hpBarH: 26,
  settings: { x: 1770, y: 40, s: 64 },
  remain:   { x: 1674, y: 185, w: 197, h: 58 },
  startBtn: { x: 1580, y: 953, w: 279, h: 87 },
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
    this.cards = {};      // uid -> 카드 컨테이너
    this.orderCells = []; // 행동 순서 칸
    this.logLines = [];
    this.started = false;

    // 적 편성은 스테이지 진입 시 1회 생성
    if (!run.currentEnemies || run.currentEnemiesStage !== run.stageIndex) {
      run.currentEnemies = run.buildEnemies();
      run.currentEnemiesStage = run.stageIndex;
    }
    this.battle = new BattleEngine.Battle(run.formationUnits(), run.currentEnemies, run.rng);

    this.buildHud();
    this.buildCards();
    this.updateRemain();
    this.pushLog('스테이지에 진입했습니다. [스테이지 진행 시작] 버튼을 누르면 전투가 시작됩니다.');
  },

  // ---------------- HUD ----------------
  buildHud: function () {
    var T = Theme, L = LAYOUT, self = this;
    var run = this.run;

    // 1. 챕터 및 스테이지 표기
    T.panel(this, L.stageLabel.x, L.stageLabel.y, L.stageLabel.w, L.stageLabel.h, { fill: T.panelDark });
    this.add.text(L.stageLabel.x + L.stageLabel.w / 2, L.stageLabel.y + 22, run.stageLabel(), T.style(20, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    var typeColor = { 일반: T.muted, 이벤트: '#5fc6d6', 중간보스: '#e8a03a', 보스: '#e06060' }[this.stage.type] || T.muted;
    this.add.text(L.stageLabel.x + L.stageLabel.w / 2, L.stageLabel.y + 50, '[' + this.stage.type + ']', T.style(16, typeColor)).setOrigin(0.5);

    // 2. 턴 수
    T.panel(this, L.turnLabel.x, L.turnLabel.y, L.turnLabel.w, L.turnLabel.h, { fill: T.panelDark });
    this.turnText = this.add.text(L.turnLabel.x + L.turnLabel.w / 2, L.turnLabel.y + L.turnLabel.h / 2, '턴 0', T.style(26, T.text, { fontStyle: 'bold' })).setOrigin(0.5);

    // 3. 행동 순서
    T.panel(this, L.order.x, L.order.y, L.order.w, L.order.h, { fill: T.panelDark });
    this.add.text(L.order.labelX, L.order.labelY, '행동 순서', T.style(18, T.muted));
    this.orderHint = this.add.text(L.order.labelX, L.order.labelY + 30, '대기 중', T.style(15, T.dim, { wordWrap: { width: 105 }, lineSpacing: 4 }));
    for (var i = 0; i < 8; i++) {
      var cy = L.order.listY + i * (L.order.cell + L.order.gap);
      var g = this.add.graphics();
      g.lineStyle(1, T.line, 1); g.strokeRect(L.order.listX, cy, L.order.cell, L.order.cell);
      this.orderCells.push({ y: cy, view: null });
    }

    // 4. 진행 로그
    T.panel(this, L.log.x, L.log.y, L.log.w, L.log.h, { fill: T.panelDark });
    this.add.text(L.log.x + 14, L.log.y + 10, '진행 로그', T.style(16, T.muted));
    this.logText = this.add.text(L.log.x + 14, L.log.y + L.log.h - 12, '', T.style(17, T.text, { wordWrap: { width: L.log.w - 28 }, lineSpacing: 5 })).setOrigin(0, 1);
    var maskShape = this.make.graphics({ x: 0, y: 0, add: false });
    maskShape.fillStyle(0xffffff); maskShape.fillRect(L.log.x, L.log.y + 36, L.log.w, L.log.h - 46);
    this.logText.setMask(maskShape.createGeometryMask());

    // VS 표시
    this.add.text(1044, 540, 'VS', T.style(48, T.dim, { fontStyle: 'bold' })).setOrigin(0.5);

    // 8. 설정 팝업 아이콘
    var sg = this.add.graphics();
    sg.fillStyle(T.panelDark, 1); sg.fillRoundedRect(L.settings.x, L.settings.y, L.settings.s, L.settings.s, 8);
    sg.lineStyle(2, T.line, 1); sg.strokeRoundedRect(L.settings.x, L.settings.y, L.settings.s, L.settings.s, 8);
    this.add.text(L.settings.x + L.settings.s / 2, L.settings.y + L.settings.s / 2, '⚙', T.style(38, T.text)).setOrigin(0.5);
    this.add.zone(L.settings.x, L.settings.y, L.settings.s, L.settings.s).setOrigin(0).setInteractive({ useHandCursor: true }).on('pointerdown', function () { self.openSettings(); });

    // 9. 남은 적의 수
    T.panel(this, L.remain.x, L.remain.y, L.remain.w, L.remain.h, { fill: T.panelDark });
    this.remainText = this.add.text(L.remain.x + L.remain.w / 2, L.remain.y + L.remain.h / 2, '남은 적 : 0', T.style(22, T.text, { fontStyle: 'bold' })).setOrigin(0.5);

    // 10. 스테이지 진행 시작 버튼
    this.startBtn = T.button(this, L.startBtn.x, L.startBtn.y, L.startBtn.w, L.startBtn.h, '스테이지 진행 시작', function () { self.startBattle(); }, { fontSize: 26 });
  },

  // ---------------- 캐릭터 카드 ----------------
  buildCards: function () {
    var self = this;
    this.battle.units.forEach(function (u) { self.cards[u.uid] = self.makeCard(u); });
  },

  makeCard: function (u) {
    var T = Theme, L = LAYOUT, P = L.portrait;
    var top = L.rowTop[u.slot - 1];
    var isAlly = u.side === 'ally';
    var side = isAlly ? L.ally : L.enemy;
    var c = this.add.container(0, 0);
    c.unit = u;

    // 5. 캐릭터 명
    var nameBg = T.panel(this, side.nameX, top, side.nameW, side.nameH, { fill: T.panelDark });
    var name = this.add.text(side.nameX + side.nameW / 2, top + 16, u.name, T.style(u.name.length > 6 ? 15 : 19, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    var role = this.add.text(side.nameX + side.nameW / 2, top + 38, u.role + (u.boss ? ' · BOSS' : ''), T.style(13, T.ROLE_COLOR[u.role] || T.muted)).setOrigin(0.5);
    c.add([nameBg, name, role]);

    // 6. 투지 수
    var fx = isAlly ? side.nameX + side.nameW - 76 : side.nameX;
    var fightBg = T.panel(this, fx, top + side.fightY, 76, 32, { fill: T.panelDark });
    c.fightText = this.add.text(fx + 38, top + side.fightY + 16, '투지 ' + u.fight, T.style(15, T.accentCss)).setOrigin(0.5);
    c.add([fightBg, c.fightText]);
    // 능력치 (참고용, 작게)
    c.statText = this.add.text(isAlly ? side.nameX + side.nameW : side.nameX, top + side.fightY + 42, '공 ' + u.atk + ' 방 ' + u.def + ' 속 ' + u.spd, T.style(13, T.dim)).setOrigin(isAlly ? 1 : 0, 0);
    c.add(c.statText);

    // 7. 캐릭터 이미지
    c.portrait = T.portrait(this, side.imgX, top, P, u.id, { line: u.boss ? 0xe06060 : T.line });
    c.add(c.portrait);
    // 적은 좌우 반전(마주보게)
    if (!isAlly && c.portrait.img) c.portrait.img.setFlipX(true);

    // 체력 바 (이미지 아래 얇은 사각)
    c.hpBg = this.add.rectangle(side.imgX, top + L.hpBarY, P, L.hpBarH, T.hpBack).setOrigin(0).setStrokeStyle(1, T.line);
    c.hpFill = this.add.rectangle(side.imgX + 1, top + L.hpBarY + 1, P - 2, L.hpBarH - 2, T.hpGreen).setOrigin(0);
    c.shieldFill = this.add.rectangle(side.imgX + 1, top + L.hpBarY + 1, 0, 6, T.shield).setOrigin(0);
    c.hpText = this.add.text(side.imgX + P / 2, top + L.hpBarY + L.hpBarH / 2, '', T.style(14, '#ffffff', { fontStyle: 'bold', stroke: '#000', strokeThickness: 3 })).setOrigin(0.5);
    c.add([c.hpBg, c.hpFill, c.shieldFill, c.hpText]);

    // 비활성 오버레이
    c.deadOverlay = this.add.container(0, 0).setVisible(false);
    c.deadOverlay.add(this.add.rectangle(side.imgX, top, P, P, 0x000000, 0.6).setOrigin(0));
    c.deadOverlay.add(this.add.text(side.imgX + P / 2, top + P / 2, '행동 불가', T.style(20, '#e08080', { fontStyle: 'bold' })).setOrigin(0.5));
    c.add(c.deadOverlay);

    c.centerX = side.imgX + P / 2;
    c.centerY = top + P / 2;
    this.refreshCard(c);
    if (!u.alive) this.applyDeath(c, true);
    return c;
  },

  refreshCard: function (c) {
    var T = Theme, L = LAYOUT, P = L.portrait, u = c.unit;
    var ratio = Math.max(0, u.hp / u.maxHp);
    c.hpFill.width = Math.max(0, (P - 2) * ratio);
    c.hpFill.fillColor = ratio > 0.5 ? T.hpGreen : (ratio > 0.25 ? 0xd8a02c : T.hpRed);
    c.shieldFill.width = Math.min(P - 2, (P - 2) * (u.shield / u.maxHp));
    c.hpText.setText(u.hp + ' / ' + u.maxHp + (u.shield ? '  🛡' + u.shield : ''));
    c.fightText.setText('투지 ' + u.fight + '/' + BALANCE.FIGHT_MAX);
    c.fightText.setColor(u.fight >= BALANCE.SKILL_COST ? '#ffd166' : T.accentCss);
  },

  applyDeath: function (c, instant) {
    var u = c.unit;
    if (u.side === 'ally') {
      // 아군: 체력 0 -> 행동 비활성화 (화면에 남음)
      c.portrait.setDim(true);
      c.deadOverlay.setVisible(true);
    } else {
      // 적: 사망 시 화면에서 제거
      if (instant) c.setVisible(false);
      else this.tweens.add({ targets: c, alpha: 0, duration: BALANCE.ANIM.death / this.speed, onComplete: function () { c.setVisible(false); } });
    }
  },

  updateRemain: function () { this.remainText.setText('남은 적 : ' + this.battle.enemiesAlive().length); },

  pushLog: function (line) {
    this.logLines.push(line);
    if (this.logLines.length > 14) this.logLines.shift();
    this.logText.setText(this.logLines.join('\n'));
  },

  // ---------------- 행동 순서 표시 ----------------
  showOrder: function (uids) {
    var T = Theme, L = LAYOUT, self = this;
    this.orderCells.forEach(function (cell) { if (cell.view) { cell.view.destroy(); cell.view = null; } });
    this.orderUids = uids;
    uids.slice(0, 8).forEach(function (uid, i) {
      var u = self.battle.byUid(uid);
      var cell = self.orderCells[i];
      var p = T.portrait(self, L.order.listX, cell.y, L.order.cell, u.id, { lineWidth: 1, line: u.side === 'ally' ? 0x6fbf5a : 0xe06060 });
      cell.view = p;
    });
    if (uids.length > 8) this.orderHint.setText('외 ' + (uids.length - 8) + '명');
  },

  highlightOrder: function (uid) {
    var T = Theme, self = this;
    var idx = this.orderUids ? this.orderUids.indexOf(uid) : -1;
    this.orderCells.forEach(function (cell, i) {
      if (!cell.view) return;
      cell.view.setBorder(i === idx ? T.accent : (self.battle.byUid(self.orderUids[i]).side === 'ally' ? 0x6fbf5a : 0xe06060), i === idx ? 3 : 1);
      cell.view.setDim(i < idx);
    });
    var u = this.battle.byUid(uid);
    this.orderHint.setText((idx + 1) + '번째\n' + u.name + ' 행동');
  },

  // ---------------- 전투 진행 ----------------
  startBattle: function () {
    if (this.started) return;
    this.started = true;
    this.startBtn.setEnabled(false).setLabel('진행 중…'); // 1회만 클릭 가능, 이후 비활성화
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
    var step = function () {
      if (i >= events.length) { done(); return; }
      var ev = events[i++];
      self.playEvent(ev, step);
    };
    step();
  },

  playEvent: function (ev, next) {
    var T = Theme, A = BALANCE.ANIM, self = this, sp = this.speed;
    if (ev.log) this.pushLog(ev.log);
    switch (ev.type) {
      case 'turnStart':
        this.turnText.setText('턴 ' + ev.turn);
        this.tweens.add({ targets: this.turnText, scale: { from: 1.3, to: 1 }, duration: 200 / sp });
        next(); break;

      case 'order':
        this.showOrder(ev.uids);
        this.time.delayedCall(A.orderShow / sp, next); break;

      case 'shield': {
        var c = this.cards[ev.uid];
        this.refreshCard(c);
        T.floatText(this, c.centerX, c.centerY - 40, '🛡 +' + ev.amount, '#9fd4f0', 26);
        this.time.delayedCall(A.hit / sp, next); break;
      }

      case 'attack': {
        var actor = this.cards[ev.uid], target = this.cards[ev.targetUid];
        this.highlightOrder(ev.uid);
        var dir = actor.unit.side === 'ally' ? 1 : -1;
        actor.setDepth(10);
        if (ev.skill) T.floatText(this, actor.centerX, actor.centerY - 90, ev.skillName + '!', '#ffd166', 28);
        this.tweens.add({
          targets: actor, x: 60 * dir, duration: (A.attack / 2) / sp, yoyo: true, ease: 'Quad.easeOut',
          onYoyo: function () {
            self.refreshCard(actor);
            self.refreshCard(target);
            if (ev.dodged) {
              T.floatText(self, target.centerX, target.centerY - 30, 'MISS', '#9fd4f0', 30);
              self.tweens.add({ targets: target, x: -20 * dir, duration: 90 / sp, yoyo: true });
            } else {
              T.floatText(self, target.centerX, target.centerY - 30, '-' + ev.damage + (ev.absorbed ? ' (🛡' + ev.absorbed + ')' : ''), ev.skill ? '#ffd166' : '#ff6b6b', ev.skill ? 40 : 34);
              if (target.portrait.img) target.portrait.img.setTint(0xff6666);
              self.tweens.killTweensOf(target); target.x = 0; // 이전 흔들림이 남아 있으면 초기화
              self.tweens.add({ targets: target, x: 12 * dir, duration: 60 / sp, yoyo: true, repeat: 2, onComplete: function () { target.x = 0; if (target.portrait.img && target.unit.alive) target.portrait.img.clearTint(); } });
            }
          },
          onComplete: function () { actor.x = 0; actor.setDepth(0); self.time.delayedCall(A.hit / sp, next); },
        });
        break;
      }

      case 'death': {
        var dc = this.cards[ev.uid];
        this.refreshCard(dc);
        this.applyDeath(dc, false);
        this.updateRemain();
        this.time.delayedCall(A.death / sp, next); break;
      }

      case 'heal': {
        var hc = this.cards[ev.uid];
        this.refreshCard(hc);
        T.floatText(this, hc.centerX, hc.centerY - 40, '+' + ev.amount, '#7fe07f', 28);
        this.time.delayedCall(A.hit / sp, next); break;
      }

      case 'turnEnd':
        this.orderHint.setText('턴 종료');
        next(); break;

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
      layer.add(T.button(this, W / 2 - 150, H / 2 + 90, 300, 70, run.isBossStage() ? '챕터 클리어 → 아웃게임' : '정비 화면으로', function () { Flow.stageCleared(self); }, { fontSize: 24 }));
    } else {
      layer.add(this.add.text(W / 2, H / 2 + 40, '사망 시 아웃게임으로 자동 이동합니다.', T.style(20, T.muted)).setOrigin(0.5));
      layer.add(T.button(this, W / 2 - 150, H / 2 + 90, 300, 70, '아웃게임으로', function () { Flow.runFailed(self); }, { fontSize: 24, fill: T.danger }));
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
    layer.add(this.add.text(W / 2, H / 2 + 10, '시드 ' + this.run.seed + '  ·  스테이지 ' + this.run.currentStage().no + ' / ' + this.run.stages.length, T.style(16, T.dim)).setOrigin(0.5));
    layer.add(T.button(this, W / 2 - 210, H / 2 + 50, 420, 56, '아웃게임으로 나가기 (런 포기)', function () { self.scene.start('TitleScene', { message: '런을 포기하고 아웃게임으로 돌아왔습니다.', cleared: false }); }, { fill: T.danger, fontSize: 20 }));
    layer.add(T.button(this, W / 2 - 100, H / 2 + 125, 200, 56, '닫기', function () { layer.destroy(); self.settingsLayer = null; }, { fill: T.panelDark, fontSize: 22 }));
  },
});
