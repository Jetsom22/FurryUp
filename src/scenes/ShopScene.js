// =====================================================================
// 상점 (UI 개편 와이어프레임 "상점" / "상점 제품 표시 예시" / "덱구성 …" / "인벤토리")
//  제목 바 + 종료(런 포기) · 스테이지 진행 바 · 덱구성 / 인벤토리 · 상점 주인 · 말풍선(인사/가격 안내/구매 확인 + 골드)
//  다음 스테이지 · 상품 5칸 (캐릭터 3 + 아이템 2). 상품 위에 마우스를 올리면 정보 패널, 클릭하면 구매 확인
//  덱 구성 팝업: 현재 덱 5칸 (LV 배지 · 선택/교체/부활/배치) + 선택 캐릭터 정보
//    - 위치 교체: 카드의 [교체] → "위치를 변경할 캐릭터를 선택하세요." → 다른 카드의 [교체]
//    - 아이템 사용: 인벤토리 [사용] → "+EXP or 아이템 | 사용할 캐릭터를 선택하세요." → [선택]
//    - 캐릭터 구매 시 덱이 꽉 차 있으면 새 캐릭터 카드 + [교체] / [교체하지 않는다]
// =====================================================================
var SL = {
  title: { h: 110 },
  exit:  { x: 1810, y: 10, s: 90 },
  track: { x: 78, y: 138, w: 535, h: 155 },
  deckBtn: { x: 78, y: 320, w: 296, h: 118 },
  invBtn:  { x: 78, y: 457, w: 296, h: 118 },
  owner: { x: 665, y: 265, w: 595, h: 600 },
  bubble: { x: 1338, y: 168, w: 395, h: 352 },
  gold:   { x: 1508, y: 452, w: 220, h: 58 },
  nextBtn: { x: 1592, y: 555, w: 290, h: 113 },
  goods: { xs: [52, 432, 812, 1192, 1572], y: 698, w: 295, imgH: 245, nameH: 55, plateH: 100 },
  charInfo: { x: 323, y: 210, w: 285, h: 640 },
  itemInfo: { x: 1338, y: 340, w: 395, h: 520 },
  popup: { x: 180, y: 70, w: 1598, h: 555, titleH: 135 },
  deckSlots: { xs: [365, 585, 805, 1025, 1245], y: 225, w: 200, h: 245 },
  popInfo: { x: 1490, y: 208, w: 288, h: 640 },
};

var ShopScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function ShopScene() { Phaser.Scene.call(this, { key: 'ShopScene' }); },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var run = this.run = Flow.run(this);
    this.cameras.main.setBackgroundColor(T.bgCss);
    this.popup = null;
    this.goodsViews = [];
    this.hoverPanel = null;

    // 제목 바 + 종료
    var g = this.add.graphics();
    g.fillStyle(T.panelDark, 1); g.fillRect(0, 0, W, SL.title.h);
    g.lineStyle(3, T.line, 1); g.lineBetween(0, SL.title.h, W, SL.title.h);
    this.add.text(W / 2, SL.title.h / 2, '상점', T.style(44, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, SL.title.h - 18, run.stageLabel() + ' 클리어 · 보상을 받았습니다', T.style(14, T.muted)).setOrigin(0.5);
    T.button(this, SL.exit.x, SL.exit.y, SL.exit.s, SL.exit.s, '종료', function () { self.confirmExit(); }, { fill: T.panel, fontSize: 24 });

    Widgets.stageTrack(this, SL.track.x, SL.track.y, SL.track.w, SL.track.h, run);
    T.button(this, SL.deckBtn.x, SL.deckBtn.y, SL.deckBtn.w, SL.deckBtn.h, '덱구성', function () { self.openDeck({ mode: 'view' }); }, { fill: T.panel, fontSize: 32 });
    T.button(this, SL.invBtn.x, SL.invBtn.y, SL.invBtn.w, SL.invBtn.h, '인벤토리', function () { self.openInventory(); }, { fill: T.panel, fontSize: 32 });

    // 상점 주인
    var O = SL.owner;
    T.panel(this, O.x, O.y, O.w, O.h, { fill: T.panelDark, radius: 10 });
    var mk = this.textures.exists(GUIDE_CHARACTER.id) ? GUIDE_CHARACTER.id : 'CHR_001';
    var m = this.add.image(O.x + O.w / 2, O.y + O.h - 10, mk).setOrigin(0.5, 1);
    m.setScale(Math.min((O.w - 40) / m.width, (O.h - 60) / m.height));
    this.add.text(O.x + 16, O.y + 12, '상점 주인 · ' + GUIDE_CHARACTER.name, T.style(18, T.muted, { fontStyle: 'bold' }));

    // 말풍선
    var Bb = SL.bubble;
    var bg = this.add.graphics();
    bg.fillStyle(T.panel, 1); bg.fillRoundedRect(Bb.x, Bb.y, Bb.w, Bb.h, 10);
    bg.fillTriangle(Bb.x + 2, Bb.y + 60, Bb.x + 2, Bb.y + 100, Bb.x - 60, Bb.y + 72);
    bg.lineStyle(3, T.line, 1); bg.strokeRoundedRect(Bb.x, Bb.y, Bb.w, Bb.h, 10);
    this.bubbleTitle = this.add.text(Bb.x + 20, Bb.y + 18, '', T.style(20, T.text, { fontStyle: 'bold' }));
    this.bubbleText = this.add.text(Bb.x + 20, Bb.y + 56, '', T.style(17, T.text, { wordWrap: { width: Bb.w - 40 }, lineSpacing: 6 }));
    this.bubbleBtns = [];
    // 골드
    T.panel(this, SL.gold.x, SL.gold.y, SL.gold.w, SL.gold.h, { fill: T.panelDark });
    var coin = this.add.graphics(); coin.fillStyle(T.accent, 1); coin.fillCircle(SL.gold.x + 28, SL.gold.y + 29, 16);
    this.add.text(SL.gold.x + 28, SL.gold.y + 29, 'G', T.style(15, '#3a2a10', { fontStyle: 'bold' })).setOrigin(0.5);
    this.goldText = this.add.text(SL.gold.x + SL.gold.w - 16, SL.gold.y + 29, '', T.style(24, '#ffd166', { fontStyle: 'bold' })).setOrigin(1, 0.5);

    // 다음 스테이지
    this.nextBtn = T.button(this, SL.nextBtn.x, SL.nextBtn.y, SL.nextBtn.w, SL.nextBtn.h, '다음 스테이지', function () { Flow.nextStage(self); }, { fontSize: 30 });
    this.nextHint = this.add.text(SL.nextBtn.x + SL.nextBtn.w / 2, SL.nextBtn.y + SL.nextBtn.h + 8, '', T.style(15, '#e08080', { align: 'center' })).setOrigin(0.5, 0);

    this.say('어서 오세요!', '들판 상점입니다. 상품 위에 마우스를 올리면 설명이 보이고, 클릭하면 구매를 물어봅니다.\n다음 스테이지로 넘어가기 전에 덱을 정비하세요.');
    this.render();
  },

  // ---------------- 말풍선 ----------------
  say: function (title, text, buttons) {
    var T = Theme, Bb = SL.bubble, self = this;
    this.bubbleTitle.setText(title);
    this.bubbleText.setText(text);
    this.bubbleBtns.forEach(function (b) { b.destroy(); }); this.bubbleBtns = [];
    (buttons || []).forEach(function (b, i) {
      var btn = T.button(self, Bb.x + 20 + i * 150, Bb.y + Bb.h - 130, 140, 48, b.label, b.onClick, { fontSize: 19, fill: b.fill !== undefined ? b.fill : T.accent, enabled: b.enabled !== false });
      self.bubbleBtns.push(btn);
    });
  },

  render: function () {
    var run = this.run;
    this.goldText.setText(run.gold + ' G');
    var ok = run.hasActiveFormation();
    this.nextBtn.setEnabled(ok);
    this.nextHint.setText(ok ? '' : '살아있는 캐릭터가 덱에 1마리 이상 있어야 합니다');
    this.renderGoods();
  },

  // ---------------- 상품 5칸 ----------------
  renderGoods: function () {
    var T = Theme, self = this, run = this.run, G = SL.goods;
    this.goodsViews.forEach(function (o) { o.destroy(); }); this.goodsViews = [];
    var stock = run.buildShop();
    stock.forEach(function (item, i) {
      var x = G.xs[i], y = G.y;
      var c = self.add.container(0, 0);
      // 가격판 (뒤)
      var plate = self.add.graphics();
      plate.fillStyle(item.sold ? 0x2a241c : T.panel, 1); plate.fillRect(x - 20, y + G.imgH + 2, G.w + 40, G.plateH);
      plate.lineStyle(3, T.line, 1); plate.strokeRect(x - 20, y + G.imgH + 2, G.w + 40, G.plateH);
      c.add(plate);
      c.add(self.add.text(x + G.w / 2, y + G.imgH + G.nameH + 26, item.sold ? '판매 완료' : item.price + ' G', T.style(22, item.sold ? T.dim : '#ffd166', { fontStyle: 'bold' })).setOrigin(0.5));
      // 상품 그림
      var box = self.add.graphics();
      box.fillStyle(T.panelDark, 1); box.fillRect(x, y, G.w, G.imgH);
      box.lineStyle(3, T.line, 1); box.strokeRect(x, y, G.w, G.imgH);
      c.add(box);
      if (item.kind === 'character') {
        var p = T.portrait(self, x + 4, y + 4, G.imgH - 8, item.id, { lineWidth: 0, line: T.panelDark });
        p.x = x + (G.w - (G.imgH - 8)) / 2;
        if (item.sold) p.setDim(true);
        c.add(p);
        var ch = CHARACTER_BY_ID[item.id];
        var badge = self.add.graphics(); badge.fillStyle(T.ROLE_HEX[ch.role], 1); badge.fillCircle(x + G.w - 26, y + 26, 18);
        c.add(badge); c.add(self.add.text(x + G.w - 26, y + 26, ch.typeName, T.style(15, '#1a1510', { fontStyle: 'bold' })).setOrigin(0.5));
        c.add(self.add.text(x + 10, y + G.imgH - 26, ch.role, T.style(14, T.ROLE_COLOR[ch.role])));
      } else {
        c.add(Widgets.itemIcon(self, x + G.w / 2, y + G.imgH / 2, 150, item.itemId, item.sold));
      }
      // 상품명 띠
      c.add(self.add.rectangle(x, y + G.imgH, G.w, G.nameH, item.sold ? 0x2a241c : T.panel).setOrigin(0).setStrokeStyle(3, T.line));
      c.add(self.add.text(x + G.w / 2, y + G.imgH + G.nameH / 2, item.name, T.style(item.name.length > 8 ? 17 : 21, item.sold ? T.dim : T.text, { fontStyle: 'bold' })).setOrigin(0.5));
      // 상호작용
      var z = self.add.zone(x, y, G.w, G.imgH + G.nameH).setOrigin(0).setInteractive({ useHandCursor: !item.sold });
      z.on('pointerover', function () { if (!item.sold) { box.clear(); box.fillStyle(T.panelDark, 1); box.fillRect(x, y, G.w, G.imgH); box.lineStyle(4, T.accent, 1); box.strokeRect(x, y, G.w, G.imgH); self.showGoodsInfo(item); } });
      z.on('pointerout', function () { box.clear(); box.fillStyle(T.panelDark, 1); box.fillRect(x, y, G.w, G.imgH); box.lineStyle(3, T.line, 1); box.strokeRect(x, y, G.w, G.imgH); self.hideGoodsInfo(); });
      z.on('pointerdown', function () { if (!item.sold) self.askBuy(item); });
      c.add(z);
      self.goodsViews.push(c);
    });
  },

  showGoodsInfo: function (item) {
    var T = Theme, self = this;
    this.hideGoodsInfo();
    if (item.kind === 'character') {
      var I = SL.charInfo;
      var p = Widgets.infoPanel(this, I.x, I.y, I.w, I.h, { title: '선택 캐릭터 정보', compact: true });
      p.setCharacter(CHARACTER_BY_ID[item.id]);
      p.setDepth(50);
      this.hoverPanel = p;
    } else {
      var J = SL.itemInfo;
      var c = this.add.container(0, 0).setDepth(50);
      var it = BALANCE.ITEMS[item.itemId];
      c.add(T.panel(this, J.x, J.y, J.w, J.h, { fill: T.panelDark, radius: 10 }));
      c.add(this.add.text(J.x + 20, J.y + 16, '선택 상품 정보', T.style(20, T.muted, { fontStyle: 'bold' })));
      c.add(Widgets.itemIcon(this, J.x + 95, J.y + 140, 150, it.id, false));
      c.add(this.add.text(J.x + 190, J.y + 90, it.name, T.style(24, T.text, { fontStyle: 'bold', wordWrap: { width: J.w - 210 } })));
      c.add(this.add.text(J.x + 190, J.y + 140, '분류 · ' + it.category, T.style(18, T.muted)));
      c.add(this.add.text(J.x + 20, J.y + 250, '아이템 효과', T.style(20, T.text, { fontStyle: 'bold' })));
      c.add(this.add.text(J.x + 36, J.y + 290, it.desc, T.style(17, T.muted, { wordWrap: { width: J.w - 60 }, lineSpacing: 6 })));
      c.add(this.add.text(J.x + 20, J.y + J.h - 40, '구매하면 인벤토리에 들어갑니다. 덱 구성에서 캐릭터를 골라 사용하세요.', T.style(13, T.dim, { wordWrap: { width: J.w - 40 } })));
      this.hoverPanel = c;
    }
  },
  hideGoodsInfo: function () { if (this.hoverPanel) { this.hoverPanel.destroy(); this.hoverPanel = null; } },

  // ---------------- 구매 ----------------
  askBuy: function (item) {
    var self = this, run = this.run;
    var can = run.canBuy(item);
    this.say('구매 확인', item.name + ' 을(를) ' + item.price + ' G 에 드립니다.\n' + (can ? '구매하시겠어요?' : '골드가 모자라네요. (보유 ' + run.gold + ' G)'), [
      { label: '구매', enabled: can, onClick: function () { self.doBuy(item); } },
      { label: '취소', fill: Theme.panelDark, onClick: function () { self.say('천천히 보세요', '다른 상품도 둘러보세요.'); } },
    ]);
  },
  doBuy: function (item) {
    var self = this, run = this.run;
    if (!run.buy(item)) return;
    if (item.kind === 'character') {
      var empty = run.emptySlot();
      if (empty >= 0) {
        run.place(item.id, empty);
        this.say('거래 완료', item.name + ' 이(가) 동료가 되었습니다. 덱 ' + (empty + 1) + '번에 들어갔어요.');
        this.render();
      } else {
        this.say('거래 완료', item.name + ' 이(가) 동료가 되었습니다. 덱이 꽉 차서 교체할 자리를 고르세요.');
        this.render();
        this.openDeck({ mode: 'replace', newId: item.id });
      }
    } else {
      this.say('거래 완료', item.name + ' 을(를) 인벤토리에 넣었습니다. (' + run.itemCount(item.itemId) + '개 보유)\n덱 구성에서 캐릭터를 골라 사용할 수 있어요.');
      this.render();
    }
  },

  confirmExit: function () {
    var self = this;
    this.say('런을 종료할까요?', '지금 종료하면 이 런의 진행이 사라지고 로비로 돌아갑니다.', [
      { label: '종료', fill: Theme.danger, onClick: function () { self.scene.start('LobbyScene', { message: '런을 포기하고 로비로 돌아왔습니다.', cleared: false }); } },
      { label: '취소', fill: Theme.panelDark, onClick: function () { self.say('천천히 보세요', '다른 상품도 둘러보세요.'); } },
    ]);
  },

  // ---------------- 팝업 공통 틀 ----------------
  openPopupFrame: function (title) {
    var T = Theme, P = SL.popup, self = this;
    if (this.popup) this.popup.destroy();
    var layer = this.popup = this.add.container(0, 0).setDepth(100);
    layer.add(T.overlay(this, 0.75));
    layer.add(T.panel(this, P.x, P.y, P.w, P.h, { fill: T.panel, line: T.line, radius: 6 }));
    var hg = this.add.graphics(); hg.fillStyle(T.panelDark, 1); hg.fillRect(P.x + 2, P.y + 2, P.w - 4, P.titleH); hg.lineStyle(3, T.line, 1); hg.lineBetween(P.x, P.y + P.titleH, P.x + P.w, P.y + P.titleH);
    layer.add(hg);
    layer.add(this.add.text(P.x + 46, P.y + P.titleH / 2, title, T.style(40, T.text, { fontStyle: 'bold' })).setOrigin(0, 0.5));
    layer.add(T.button(this, P.x + P.w - 133, P.y + 18, 100, 100, '종료', function () { self.closePopup(); }, { fill: T.panel, fontSize: 24 }));
    layer.dyn = [];
    return layer;
  },
  closePopup: function () { if (this.popup) { this.popup.destroy(); this.popup = null; } this.render(); },

  // ---------------- 덱 구성 팝업 ----------------
  //  opts.mode: 'view' | 'use' (opts.itemId) | 'replace' (opts.newId)
  openDeck: function (opts) {
    var T = Theme, P = SL.popup, D = SL.deckSlots, self = this, run = this.run;
    var layer = this.openPopupFrame('덱 구성');
    layer.add(this.add.text(P.x + 40, D.y + 90, '현재 덱', T.style(34, T.text, { fontStyle: 'bold' })));
    var info = Widgets.infoPanel(this, SL.popInfo.x, SL.popInfo.y, SL.popInfo.w, SL.popInfo.h, { title: '선택 캐릭터 정보', compact: true });
    layer.add(info);
    var state = { mode: opts.mode || 'view', itemId: opts.itemId, newId: opts.newId, selected: null, swapFrom: null };
    var msg = this.add.text(P.x + 650, P.y + P.h + 60, '', T.style(40, '#ffffff', { fontStyle: 'bold', stroke: '#000000', strokeThickness: 6 })).setOrigin(0.5);
    layer.add(msg);
    var extra = this.add.container(0, 0); layer.add(extra);

    var draw = function () {
      layer.dyn.forEach(function (o) { o.destroy(); }); layer.dyn = [];
      extra.removeAll(true);
      // 상단 안내
      if (state.mode === 'use') {
        var it = BALANCE.ITEMS[state.itemId];
        var ib = self.add.container(0, 0);
        ib.add(T.panel(self, P.x + 585, P.y + P.h - 30, 200, 200, { fill: T.text, line: T.line }));
        ib.add(Widgets.itemIcon(self, P.x + 685, P.y + P.h + 40, 90, it.id, false));
        ib.add(self.add.text(P.x + 685, P.y + P.h + 130, it.exp ? 'EXP +' + it.exp : 'HP +' + Math.round(it.healRate * 100) + '%', T.style(24, '#1a1510', { fontStyle: 'bold' })).setOrigin(0.5));
        extra.add(ib);
        msg.setText((it.exp ? '+' + it.exp + ' EXP' : it.name) + ' | 사용할 캐릭터를 선택하세요.').setY(P.y + P.h + 290);
      } else if (state.mode === 'replace') {
        var nc = CHARACTER_BY_ID[state.newId];
        var big = Widgets.charCard(self, P.x + 563, P.y + P.h - 80, 297, 300, nc, { stripH: 56 });
        big.zone.on('pointerdown', function () { state.selected = state.newId; info.setCharacter(nc); });
        extra.add(big);
        extra.add(T.button(self, P.x + 928, P.y + P.h + 50, 200, 44, '교체하지 않는다', function () { self.closePopup(); self.say('알겠어요', nc.name + ' 은(는) 대기 명단에 있습니다. 덱 구성의 빈 칸에서 배치할 수 있어요.'); }, { fill: T.panelDark, fontSize: 18 }));
        msg.setText('덱에서 교체할 캐릭터를 선택하세요.').setY(P.y + P.h + 270);
        if (!state.selected) { state.selected = state.newId; info.setCharacter(nc); }
      } else if (state.swapFrom !== null) {
        msg.setText('위치를 변경할 캐릭터를 선택하세요.').setY(P.y + P.h + 60);
      } else {
        msg.setText('');
      }

      run.formation.forEach(function (id, idx) {
        var x = D.xs[idx], y = D.y;
        var c = self.add.container(0, 0);
        var isSel = id && state.selected === id;
        var g = self.add.graphics();
        g.fillStyle(T.panelDark, 1); g.fillRect(x, y, D.w, D.h - 40);
        g.lineStyle(isSel ? 4 : 2, isSel ? T.accent : T.line, 1); g.strokeRect(x, y, D.w, D.h - 40);
        c.add(g);
        c.add(self.add.text(x + D.w / 2, y + D.h + 14, String(idx + 1), T.style(34, T.text, { fontStyle: 'bold' })).setOrigin(0.5, 0));
        var btnLabel = null, btnFn = null, btnEnabled = true, btnFill = T.panel;
        if (id) {
          var ch = CHARACTER_BY_ID[id], r = run.roster[id], st = run.charStats(id);
          var p = T.portrait(self, x + 4, y + 4, D.w - 8, id, { lineWidth: 0, line: T.panelDark });
          if (p.img) { var s = Math.min((D.w - 8) / p.img.width, (D.h - 40 - 44 - 8) / p.img.height); p.img.setScale(s).setPosition((D.w - 8) / 2, (D.h - 40 - 44 - 8) / 2); p.frame.clear(); }
          if (r.hp <= 0) p.setDim(true);
          c.add(p);
          // LV 배지
          c.add(self.add.rectangle(x + 4, y + 4, 70, 26, T.panel).setOrigin(0).setStrokeStyle(1, T.line));
          c.add(self.add.text(x + 10, y + 17, 'LV. ' + st.level, T.style(14, T.text, { fontStyle: 'bold' })).setOrigin(0, 0.5));
          // 모서리 아이콘
          var bd = self.add.graphics(); bd.fillStyle(T.ROLE_HEX[ch.role], 1); bd.fillRect(x + D.w - 36, y + 4, 32, 32); c.add(bd);
          c.add(self.add.text(x + D.w - 20, y + 20, ch.typeName, T.style(15, '#1a1510', { fontStyle: 'bold' })).setOrigin(0.5));
          // 이름 띠 + HP
          c.add(self.add.rectangle(x, y + D.h - 84, D.w, 44, T.panel).setOrigin(0).setStrokeStyle(1, T.line));
          c.add(self.add.text(x + D.w / 2, y + D.h - 70, ch.name, T.style(ch.name.length > 7 ? 15 : 19, r.hp <= 0 ? '#e08080' : T.text, { fontStyle: 'bold' })).setOrigin(0.5));
          c.add(self.add.text(x + D.w / 2, y + D.h - 50, r.hp <= 0 ? '전투불능' : 'HP ' + r.hp + ' / ' + st.hp, T.style(13, r.hp <= 0 ? '#e08080' : T.muted)).setOrigin(0.5));
          if (r.hp <= 0) { var xg = self.add.graphics(); xg.lineStyle(5, 0xe06060, 0.8); xg.lineBetween(x + 10, y + 10, x + D.w - 10, y + D.h - 94); xg.lineBetween(x + D.w - 10, y + 10, x + 10, y + D.h - 94); c.add(xg); }

          if (state.mode === 'use') {
            btnLabel = '선택';
            btnFn = function () {
              var res = run.useItem(state.itemId, id);
              if (!res.ok) { msg.setText(res.text); return; }
              self.closePopup(); self.say('아이템 사용', res.text);
            };
          } else if (state.mode === 'replace') {
            btnLabel = '교체';
            btnFn = function () {
              var old = CHARACTER_BY_ID[id].name;
              run.place(state.newId, idx);
              self.closePopup(); self.say('교체 완료', old + ' 대신 ' + CHARACTER_BY_ID[state.newId].name + ' 이(가) 덱 ' + (idx + 1) + '번에 들어갔습니다. ' + old + ' 은(는) 대기 명단으로 갔어요.');
            };
          } else if (state.swapFrom !== null) {
            if (state.swapFrom === idx) { btnLabel = '취소'; btnFn = function () { state.swapFrom = null; draw(); }; btnFill = T.panelDark; }
            else { btnLabel = '교체'; btnFn = function () { run.swapSlots(state.swapFrom, idx); state.swapFrom = null; draw(); }; }
          } else if (r.hp <= 0) {
            btnLabel = '부활 ' + BALANCE.GOLD.revive + 'G'; btnEnabled = run.canRevive(id); btnFill = T.accent;
            btnFn = function () { if (run.revive(id)) { self.goldText.setText(run.gold + ' G'); draw(); } };
          } else if (isSel) {
            btnLabel = '교체'; btnFn = function () { state.swapFrom = idx; draw(); };
          }
          var z = self.add.zone(x, y, D.w, D.h - 40).setOrigin(0).setInteractive({ useHandCursor: true });
          z.on('pointerdown', function () { if (state.mode === 'view' && state.swapFrom === null) { state.selected = id; draw(); } info.setCharacter(ch, run.charStats(id)); });
          z.on('pointerover', function () { if (state.mode === 'view' && !isSel) { g.clear(); g.fillStyle(T.panelDark, 1); g.fillRect(x, y, D.w, D.h - 40); g.lineStyle(3, T.lighten(T.line, 60), 1); g.strokeRect(x, y, D.w, D.h - 40); } });
          z.on('pointerout', function () { if (state.mode === 'view' && !isSel) { g.clear(); g.fillStyle(T.panelDark, 1); g.fillRect(x, y, D.w, D.h - 40); g.lineStyle(2, T.line, 1); g.strokeRect(x, y, D.w, D.h - 40); } });
          c.add(z);
        } else {
          c.add(self.add.text(x + D.w / 2, y + (D.h - 40) / 2, '빈 칸', T.style(20, T.dim)).setOrigin(0.5));
          if (state.mode === 'replace') { btnLabel = '배치'; btnFn = function () { run.place(state.newId, idx); self.closePopup(); self.say('배치 완료', CHARACTER_BY_ID[state.newId].name + ' 이(가) 덱 ' + (idx + 1) + '번에 들어갔습니다.'); }; }
          else if (state.mode === 'view' && state.swapFrom === null && run.benchIds().length) { btnLabel = '배치'; btnFn = function () { self.openBench(idx); }; }
          else if (state.swapFrom !== null) { btnLabel = '이동'; btnFn = function () { run.swapSlots(state.swapFrom, idx); state.swapFrom = null; draw(); }; }
        }
        if (btnLabel) c.add(T.button(self, x, y + D.h - 40, D.w, 40, btnLabel, btnFn, { fontSize: 20, fill: btnFill, enabled: btnEnabled, radius: 0 }));
        layer.add(c); layer.dyn.push(c);
      });
      // 대기 명단 안내
      var bench = run.benchIds();
      var bt = self.add.text(P.x + 40, P.y + P.h - 40, bench.length ? '대기 명단: ' + bench.map(function (id) { return CHARACTER_BY_ID[id].name; }).join(', ') + '  (빈 칸의 [배치]로 투입)' : '', T.style(15, T.muted));
      layer.add(bt); layer.dyn.push(bt);
    };
    if (state.mode === 'view') { var first = run.formation.filter(Boolean)[0]; if (first) { state.selected = first; info.setCharacter(CHARACTER_BY_ID[first], run.charStats(first)); } }
    draw();
  },

  // 대기 명단에서 빈 칸에 배치
  openBench: function (slotIdx) {
    var T = Theme, self = this, run = this.run;
    var bench = run.benchIds();
    var layer = this.add.container(0, 0).setDepth(150);
    layer.add(T.overlay(this, 0.5));
    var pw = Math.max(400, Math.min(1200, bench.length * 180 + 60)), px = T.W / 2 - pw / 2, py = 300;
    layer.add(T.panel(this, px, py, pw, 330, { fill: T.panel, line: T.accent }));
    layer.add(this.add.text(px + 24, py + 16, '덱 ' + (slotIdx + 1) + '번에 배치할 캐릭터', T.style(24, T.text, { fontStyle: 'bold' })));
    bench.forEach(function (id, i) {
      var card = Widgets.charCard(self, px + 30 + i * 180, py + 60, 160, 210, CHARACTER_BY_ID[id], { stripH: 50 });
      card.zone.on('pointerdown', function () { run.place(id, slotIdx); layer.destroy(); self.openDeck({ mode: 'view' }); });
      layer.add(card);
    });
    layer.add(T.button(this, px + pw - 130, py + 280 - 6, 110, 40, '닫기', function () { layer.destroy(); }, { fill: T.panelDark, fontSize: 18 }));
  },

  // ---------------- 인벤토리 팝업 ----------------
  openInventory: function () {
    var T = Theme, P = SL.popup, self = this, run = this.run;
    var layer = this.openPopupFrame('인벤토리');
    var list = run.inventoryList();
    var cols = 4, cw = 185, chh = 200, gap = 75;
    var infoLayer = this.add.container(0, 0); layer.add(infoLayer);
    var showInfo = function (it) {
      infoLayer.removeAll(true);
      var J = { x: 1190, y: 345, w: 395, h: 520 };
      infoLayer.add(T.panel(self, J.x, J.y, J.w, J.h, { fill: T.panel, radius: 6 }));
      infoLayer.add(self.add.text(J.x + 20, J.y + 20, '선택 아이템 정보', T.style(22, T.text, { fontStyle: 'bold' })));
      infoLayer.add(Widgets.itemIcon(self, J.x + 95, J.y + 150, 150, it.id, false));
      infoLayer.add(self.add.text(J.x + 190, J.y + 95, it.name, T.style(24, T.text, { fontStyle: 'bold', wordWrap: { width: J.w - 210 } })));
      infoLayer.add(self.add.text(J.x + 190, J.y + 145, '분류 · ' + it.category, T.style(18, T.muted)));
      infoLayer.add(self.add.text(J.x + 20, J.y + 260, '아이템 효과', T.style(20, T.text, { fontStyle: 'bold' })));
      infoLayer.add(self.add.text(J.x + 36, J.y + 300, it.desc, T.style(17, T.muted, { wordWrap: { width: J.w - 60 }, lineSpacing: 6 })));
    };
    if (!list.length) layer.add(this.add.text(P.x + P.w / 2, P.y + 330, '인벤토리가 비어 있습니다. 상점에서 아이템을 구매하세요.', T.style(24, T.muted)).setOrigin(0.5));
    list.forEach(function (entry, i) {
      var it = entry.item;
      var x = P.x + 40 + (i % cols) * (cw + gap), y = P.y + P.titleH + 27 + Math.floor(i / cols) * (chh + 30);
      var c = self.add.container(0, 0);
      var box = self.add.graphics();
      var drawBox = function (hi) { box.clear(); box.fillStyle(T.panelDark, 1); box.fillRect(x, y, cw, chh - 45); box.lineStyle(hi ? 4 : 2, hi ? T.accent : T.line, 1); box.strokeRect(x, y, cw, chh - 45); };
      drawBox(false);
      c.add(box);
      c.add(Widgets.itemIcon(self, x + cw / 2, y + (chh - 45) / 2, 110, it.id, false));
      c.add(self.add.text(x + cw - 8, y + 8, '×' + entry.count, T.style(18, '#ffd166', { fontStyle: 'bold' })).setOrigin(1, 0));
      c.add(self.add.rectangle(x - 15, y + chh - 45, cw + 30, 45, T.panel).setOrigin(0).setStrokeStyle(2, T.line));
      c.add(self.add.text(x + cw / 2, y + chh - 22, it.name, T.style(it.name.length > 8 ? 15 : 18, T.text, { fontStyle: 'bold' })).setOrigin(0.5));
      var useBtn = T.button(self, x - 15, y + chh, cw + 30, 36, '사용', function () { self.openDeck({ mode: 'use', itemId: it.id }); }, { fontSize: 18, radius: 0 });
      useBtn.setVisible(false);
      c.add(useBtn);
      var z = self.add.zone(x, y, cw, chh - 45).setOrigin(0).setInteractive({ useHandCursor: true });
      z.on('pointerover', function () { drawBox(true); useBtn.setVisible(true); showInfo(it); });
      z.on('pointerout', function (pointer) { if (pointer.x >= x - 15 && pointer.x <= x + cw + 15 && pointer.y >= y && pointer.y <= y + chh + 36) return; drawBox(false); useBtn.setVisible(false); });
      z.on('pointerdown', function () { showInfo(it); });
      c.add(z);
      layer.add(c);
    });
  },
});
