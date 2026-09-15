// =====================================================================
// 정비 스테이지 (정비 화면 기획서 p.5~p.6 기본 화면)
//  1 도감  2 버프(미구현)  3 칸(캐릭터 1~5)  4 캐릭터 배치  5 칸 강화하기(미구현)
//  6 유물(미구현)  7 아이템(미구현)  8 부활  9 맵  10 골드  11 상점  12 상인
//  13 물품(캐릭터 4개)  14 리롤  15 상점 닫기  16 다음 스테이지
// =====================================================================
var ShopScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function ShopScene() { Phaser.Scene.call(this, { key: 'ShopScene' }); },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var run = this.run = Flow.run(this);
    this.cameras.main.setBackgroundColor(T.bgCss);
    this.selectedId = null;
    this.selectedSlot = null;
    this.popup = null;
    this.dyn = [];

    T.header(this, '정비 스테이지', run.stageLabel() + ' 클리어  ·  상점 이용 / 캐릭터 편성 / 부활 후 "다음 스테이지"로 진행 (정비 없이 넘어가도 패널티 없음)');

    // 좌측 원형 메뉴: 도감 / 유물 / 아이템 / 맵
    T.roundButton(this, 150, 200, 58, '도감', function () { self.openCodex(false); });
    T.roundButton(this, 150, 350, 58, '유물', null, { enabled: false });
    T.roundButton(this, 150, 500, 58, '아이템', null, { enabled: false, fontSize: 20 });
    this.add.text(150, 585, '(유물/아이템/버프/칸 강화는\n프로토타입 범위 외)', T.style(13, T.dim, { align: 'center' })).setOrigin(0.5, 0);
    T.roundButton(this, 150, 930, 70, '맵', function () { self.openMap(); });

    // 버프 (미구현)
    T.panel(this, 300, 140, 120, 100, { fill: T.panelDark });
    this.add.text(360, 190, '버프', T.style(20, T.dim)).setOrigin(0.5);

    // 캐릭터 배치 / 칸 강화하기
    T.button(this, 820, 140, 280, 56, '캐릭터 배치', function () { self.openCodex(true); }, { fontSize: 22 });
    T.button(this, 820, 212, 280, 56, '칸 강화하기', null, { fontSize: 22, enabled: false });
    this.placeHint = this.add.text(820, 290, '', T.style(18, '#ffd166', { wordWrap: { width: 600 } }));

    // 골드
    T.panel(this, 290, 690, 170, 56, { fill: 0x3a3128 });
    this.goldText = this.add.text(375, 718, '', T.style(24, '#ffd166', { fontStyle: 'bold' })).setOrigin(0.5);

    // 다음 스테이지
    this.nextBtn = T.roundButton(this, W - 130, H - 150, 80, '다음\n스테이지', function () { Flow.nextStage(self); }, { fontSize: 22 });
    this.nextHint = this.add.text(W - 130, H - 50, '', T.style(16, '#e08080', { align: 'center' })).setOrigin(0.5);

    this.buildShopBar();
    this.render();
  },

  // ---------------- 캐릭터 칸 5개 (3) + 부활 (8) ----------------
  render: function () {
    var T = Theme, self = this, run = this.run;
    this.dyn.forEach(function (o) { o.destroy(); }); this.dyn = [];
    this.goldText.setText('G : ' + run.gold);

    var size = 100, gap = 30, x = 480, top = 150;
    for (var i = 0; i < 5; i++) {
      (function (idx) {
        var y = top + idx * (size + gap);
        var id = run.formation[idx];
        var g = self.add.graphics();
        g.fillStyle(T.panelDark, 1); g.fillRect(x, y, size, size);
        g.lineStyle(self.selectedSlot === idx ? 4 : 2, self.selectedSlot === idx ? T.accent : T.line, 1); g.strokeRect(x, y, size, size);
        self.dyn.push(g);
        self.dyn.push(self.add.text(x + size / 2, y - 2, '캐릭터 ' + (idx + 1), T.style(14, T.muted)).setOrigin(0.5, 1));
        if (id) {
          var r = run.roster[id], c = CHARACTER_BY_ID[id];
          var p = T.portrait(self, x + 3, y + 3, size - 6, id);
          self.dyn.push(p);
          if (r.hp <= 0) {
            p.setDim(true);
            var xg = self.add.graphics(); xg.lineStyle(4, 0xe06060, 1); xg.lineBetween(x, y, x + size, y + size); xg.lineBetween(x + size, y, x, y + size);
            self.dyn.push(xg);
            var rb = T.button(self, x + size + 12, y + size / 2 - 22, 150, 44, '부활 : ' + BALANCE.GOLD.revive + 'G', function () { if (run.revive(id)) self.render(); }, { fontSize: 18, enabled: run.canRevive(id) });
            self.dyn.push(rb);
          } else {
            self.dyn.push(self.add.text(x + size + 12, y + 14, c.name, T.style(18, T.text, { fontStyle: 'bold' })));
            self.dyn.push(self.add.text(x + size + 12, y + 40, c.role + '  HP ' + r.hp + '/' + c.hp, T.style(14, T.ROLE_COLOR[c.role])));
            var hb = self.add.rectangle(x + size + 12, y + 66, 150, 10, T.hpBack).setOrigin(0); self.dyn.push(hb);
            self.dyn.push(self.add.rectangle(x + size + 12, y + 66, 150 * r.hp / c.hp, 10, T.hpGreen).setOrigin(0));
          }
        } else {
          self.dyn.push(self.add.text(x + size / 2, y + size / 2, '빈 칸', T.style(16, T.dim)).setOrigin(0.5));
        }
        var z = self.add.zone(x, y, size, size).setOrigin(0).setInteractive({ useHandCursor: true });
        z.on('pointerdown', function () {
          if (self.selectedId) { run.place(self.selectedId, idx); self.selectedId = null; self.selectedSlot = null; self.render(); }
          else if (self.selectedSlot === idx) { if (id) run.unplace(idx); self.selectedSlot = null; self.render(); }
          else { self.selectedSlot = idx; self.render(); }
        });
        self.dyn.push(z);
      })(i);
    }

    this.placeHint.setText(this.selectedId ? '▶ ' + CHARACTER_BY_ID[this.selectedId].name + ' 선택됨. 배치할 칸(캐릭터 1~5)을 클릭하세요.' : (this.selectedSlot !== null ? '칸 ' + (this.selectedSlot + 1) + ' 선택됨. [캐릭터 배치]로 캐릭터를 고르거나, 다시 클릭하면 비웁니다.' : ''));
    var ok = run.hasActiveFormation();
    this.nextBtn.setEnabled(ok);
    this.nextHint.setText(ok ? '' : '살아있는 캐릭터를\n1마리 이상 배치하세요');
    this.renderShopItems();
  },

  // ---------------- 상점 바 (11~15) ----------------
  buildShopBar: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var bx = 300, by = H - 300, bw = 1420, bh = 240;
    this.shopBar = { x: bx, y: by, w: bw, h: bh };
    T.panel(this, bx, by, bw, bh, { fill: 0x3a352c, radius: 4 });
    // 상인 (12)
    var m = this.add.image(bx + 130, by + bh - 6, 'CHR_001').setOrigin(0.5, 1);
    m.setScale(225 / m.height);
    this.add.text(bx + 130, by + 12, '상인', T.style(16, T.muted)).setOrigin(0.5, 0);
    // 상점 닫기 (15)
    this.add.rectangle(bx + bw - 26, by + 26, 32, 32, 0xd0302f).setInteractive({ useHandCursor: true }).on('pointerdown', function () { self.shopLayer.setVisible(!self.shopLayer.visible); });
    this.add.text(bx + bw - 26, by + 26, '✕', T.style(18, '#fff', { fontStyle: 'bold' })).setOrigin(0.5);
    this.shopLayer = this.add.container(0, 0);
    this.shopItems = [];
  },

  renderShopItems: function () {
    var T = Theme, self = this, run = this.run;
    this.shopItems.forEach(function (o) { o.destroy(); }); this.shopItems = [];
    var stock = run.buildShop();
    var bx = this.shopBar.x, by = this.shopBar.y;
    stock.forEach(function (item, i) {
      var x = bx + 290 + i * 230, y = by + 30;
      var c = CHARACTER_BY_ID[item.id];
      var g = self.add.graphics();
      g.fillStyle(item.sold ? 0x2a241c : T.panelDark, 1); g.fillRect(x, y, 200, 180);
      g.lineStyle(2, T.line, 1); g.strokeRect(x, y, 200, 180);
      self.shopLayer.add(g); self.shopItems.push(g);
      var p = T.portrait(self, x + 10, y + 10, 100, item.id); if (item.sold) p.setDim(true);
      self.shopLayer.add(p); self.shopItems.push(p);
      var t1 = self.add.text(x + 120, y + 14, '물품 ' + (i + 1), T.style(14, T.muted)); self.shopLayer.add(t1); self.shopItems.push(t1);
      var t2 = self.add.text(x + 120, y + 36, c.name, T.style(18, T.text, { fontStyle: 'bold' })); self.shopLayer.add(t2); self.shopItems.push(t2);
      var t3 = self.add.text(x + 120, y + 62, c.role, T.style(14, T.ROLE_COLOR[c.role])); self.shopLayer.add(t3); self.shopItems.push(t3);
      var t4 = self.add.text(x + 120, y + 84, 'HP ' + c.hp + '\n공 ' + c.atk + ' 방 ' + c.def + ' 속 ' + c.spd, T.style(12, T.muted)); self.shopLayer.add(t4); self.shopItems.push(t4);
      var b = T.button(self, x + 10, y + 124, 180, 44, item.sold ? '구매 완료' : '가격 : ' + item.price + ' G', function () { if (run.buy(item)) { self.selectedId = item.id; self.render(); } }, { fontSize: 17, enabled: !item.sold && run.gold >= item.price, fill: item.sold ? 0x2a241c : T.accent });
      self.shopLayer.add(b); self.shopItems.push(b);
    });
    if (!stock.length) { var t = self.add.text(bx + 300, by + 100, '판매할 캐릭터가 없습니다. (해금된 캐릭터를 모두 보유 중)', T.style(20, T.muted)); self.shopLayer.add(t); self.shopItems.push(t); }
    // 리롤 (14)
    var rr = T.button(self, bx + 1210, by + 180, 150, 44, '리롤 : ' + 10 + 'G', function () { if (run.gold >= 10) { run.gold -= 10; run.shopStock = null; self.render(); } }, { fontSize: 17, fill: T.panelDark, enabled: run.gold >= 10 });
    self.shopLayer.add(rr); self.shopItems.push(rr);
  },

  // ---------------- 도감 팝업 (1 / 배치용 2) ----------------
  openCodex: function (placing) {
    var T = Theme, W = T.W, H = T.H, self = this, run = this.run;
    if (this.popup) this.popup.destroy();
    var layer = this.popup = this.add.container(0, 0).setDepth(100);
    layer.add(T.overlay(this, 0.7));
    var px = 1000, py = 130, pw = 860, ph = 720;
    layer.add(T.panel(this, px, py, pw, ph, { fill: T.panel, line: T.accent }));
    layer.add(this.add.text(px + 24, py + 18, placing ? '캐릭터 배치 - 보유 중인 캐릭터를 클릭하세요' : '도감 - 전체 / 해금 / 보유 캐릭터', T.style(24, T.text, { fontStyle: 'bold' })));
    var size = 120, gap = 14, cols = 6;
    CHARACTERS.forEach(function (c, i) {
      var x = px + 24 + (i % cols) * (size + gap), y = py + 70 + Math.floor(i / cols) * (size + gap + 22);
      var owned = run.owns(c.id);
      var p = T.portrait(self, x, y, size, c.id);
      if (!owned) p.setDim(true);
      layer.add(p);
      var status = c.locked ? '잠금' : (owned ? (run.roster[c.id].hp <= 0 ? '사망' : '보유') : '미보유');
      var color = c.locked ? T.dim : (owned ? (run.roster[c.id].hp <= 0 ? '#e06060' : '#6fbf5a') : T.muted);
      layer.add(self.add.text(x + size / 2, y + size + 4, c.name + ' · ' + status, T.style(14, color)).setOrigin(0.5, 0));
      if (c.locked) layer.add(self.add.text(x + size / 2, y + size / 2, '🔒', T.style(30, T.muted)).setOrigin(0.5));
      if (placing && owned) {
        var z = self.add.zone(x, y, size, size).setOrigin(0).setInteractive({ useHandCursor: true });
        z.on('pointerdown', function () {
          layer.destroy(); self.popup = null;
          if (self.selectedSlot !== null) { run.place(c.id, self.selectedSlot); self.selectedSlot = null; self.selectedId = null; }
          else { self.selectedId = c.id; }
          self.render();
        });
        layer.add(z);
      }
    });
    layer.add(T.button(this, px + pw - 130, py + ph - 70, 110, 50, '닫기', function () { layer.destroy(); self.popup = null; }, { fill: T.panelDark, fontSize: 20 }));
  },

  // ---------------- 맵 팝업 (9): 현재 챕터 진행도 ----------------
  openMap: function () {
    var T = Theme, W = T.W, H = T.H, self = this, run = this.run;
    if (this.popup) this.popup.destroy();
    var layer = this.popup = this.add.container(0, 0).setDepth(100);
    layer.add(T.overlay(this, 0.7));
    var px = W / 2 - 700, py = 200, pw = 1400, ph = 420;
    layer.add(T.panel(this, px, py, pw, ph, { fill: T.panel, line: T.accent }));
    layer.add(this.add.text(px + 24, py + 18, '맵 - 챕터 ' + run.chapter + ' ' + run.chapterName + ' 진행도  (시드 ' + run.seed + ')', T.style(24, T.text, { fontStyle: 'bold' })));
    var colors = { 일반: T.muted, 이벤트: '#5fc6d6', 스토리: '#b78be6', 중간보스: '#e8a03a', 보스: '#e06060' };
    run.stages.forEach(function (s, i) {
      var x = px + 40 + i * 88, y = py + 120;
      var cleared = i <= run.stageIndex;
      var current = i === run.stageIndex;
      var g = self.add.graphics();
      g.fillStyle(cleared ? 0x3a3128 : T.panelDark, 1); g.fillRoundedRect(x, y, 76, 120, 6);
      g.lineStyle(current ? 4 : 2, current ? T.accent : T.line, 1); g.strokeRoundedRect(x, y, 76, 120, 6);
      layer.add(g);
      layer.add(self.add.text(x + 38, y + 20, run.chapter + '-' + s.no, T.style(18, T.text, { fontStyle: 'bold' })).setOrigin(0.5));
      layer.add(self.add.text(x + 38, y + 60, s.type, T.style(15, colors[s.type], { align: 'center', wordWrap: { width: 70 } })).setOrigin(0.5));
      layer.add(self.add.text(x + 38, y + 98, cleared ? '클리어' : '', T.style(13, '#6fbf5a')).setOrigin(0.5));
    });
    layer.add(this.add.text(px + 40, py + 270, '※ 프로토타입 편의상 전체 배치를 공개합니다. 이벤트 하위 효과는 진입 시 결정됩니다.', T.style(16, T.dim)));
    layer.add(T.button(this, px + pw - 130, py + ph - 70, 110, 50, '닫기', function () { layer.destroy(); self.popup = null; }, { fill: T.panelDark, fontSize: 20 }));
  },
});
