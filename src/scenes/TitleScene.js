// 아웃게임 (메인 화면): 플레이 -> 챕터 선택 -> 도전
var TitleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function TitleScene() { Phaser.Scene.call(this, { key: 'TitleScene' }); },

  init: function (data) { this.message = data && data.message; this.clearedFlag = data && data.cleared; },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    this.cameras.main.setBackgroundColor(T.bgCss);

    // 배경 장식: 캐릭터 몇 명을 흐릿하게
    var deco = ['CHR_007', 'CHR_015', 'CHR_001', 'CHR_025'];
    deco.forEach(function (id, i) {
      var img = self.add.image(260 + i * 470, H - 120, id).setOrigin(0.5, 1).setAlpha(0.18);
      var s = 620 / img.height; img.setScale(s);
    });

    var g = this.add.graphics(); g.lineStyle(2, T.line, 1); g.lineBetween(120, 120, W - 120, 120);
    this.add.text(W / 2, 250, '퍼리업', T.style(120, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, 340, 'FURRY UP  ·  전투 프로토타입 v0.1', T.style(28, T.muted)).setOrigin(0.5);
    this.add.text(W / 2, 390, '아웃게임 (메인 화면)', T.style(20, T.dim)).setOrigin(0.5);

    if (this.message) {
      T.panel(this, W / 2 - 500, 440, 1000, 70, { fill: T.panelDark, line: this.clearedFlag ? T.accent : T.danger });
      this.add.text(W / 2, 475, this.message, T.style(24, this.clearedFlag ? T.accentCss : '#e08080', { fontStyle: 'bold' })).setOrigin(0.5);
    }

    var playBtn = T.button(this, W / 2 - 160, 560, 320, 90, '플레이', function () { playBtn.setEnabled(false); self.openChapterSelect(); }, { fontSize: 34 });

    this.add.text(W / 2, H - 40, '기획서: 퍼리업 전투 기획서 Ver01 / 스테이지 기획서 V0.2 / 정비 화면 기획서 Ver01  ·  임시 리소스 사용 중', T.style(16, T.dim)).setOrigin(0.5);
  },

  openChapterSelect: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var layer = this.add.container(0, 0).setDepth(100);
    layer.add(T.overlay(this, 0.7));
    var px = W / 2 - 560, py = 150, pw = 1120, ph = 780;
    layer.add(T.panel(this, px, py, pw, ph, { fill: T.panel, line: T.accent }));
    layer.add(this.add.text(px + 40, py + 30, '챕터 선택', T.style(36, T.text, { fontStyle: 'bold' })));
    layer.add(this.add.text(px + 40, py + 84, '이전 챕터를 클리어하면 다음 챕터에 도전할 수 있습니다. (프로토타입: 챕터 1만 열림)', T.style(18, T.muted)));

    var selected = 1;
    var cards = [];
    STAGE_RULES.chapters.forEach(function (ch, i) {
      var cx = px + 40 + (i % 3) * 350, cy = py + 130 + Math.floor(i / 3) * 250;
      var locked = !!ch.locked;
      var card = self.add.container(cx, cy);
      var g = self.add.graphics();
      var drawCard = function (sel) {
        g.clear();
        g.fillStyle(locked ? 0x1a1510 : T.panelDark, 1); g.fillRoundedRect(0, 0, 320, 220, 8);
        g.lineStyle(sel ? 4 : 2, sel ? T.accent : T.line, 1); g.strokeRoundedRect(0, 0, 320, 220, 8);
      };
      drawCard(!locked && ch.chapter === selected);
      card.add(g);
      card.add(self.add.text(20, 20, '챕터 ' + ch.chapter, T.style(28, locked ? T.dim : T.text, { fontStyle: 'bold' })));
      card.add(self.add.text(20, 64, ch.name, T.style(22, locked ? T.dim : T.accentCss)));
      card.add(self.add.text(20, 110, '스테이지 ' + ch.total + '개  ·  보스 ' + ch.chapter + '-' + ch.total, T.style(18, locked ? T.dim : T.muted)));
      card.add(self.add.text(20, 170, locked ? '🔒 잠김' : '도전 가능', T.style(20, locked ? T.dim : '#6fbf5a')));
      if (!locked) {
        var z = self.add.zone(0, 0, 320, 220).setOrigin(0).setInteractive({ useHandCursor: true });
        z.on('pointerdown', function () { selected = ch.chapter; cards.forEach(function (c) { c.redraw(); }); });
        card.add(z);
      }
      card.redraw = function () { drawCard(!locked && ch.chapter === selected); };
      cards.push(card);
      layer.add(card);
    });

    var closeBtn = T.button(this, px + pw - 260, py + ph - 90, 100, 60, '닫기', function () { layer.destroy(); self.scene.restart({ message: self.message, cleared: self.clearedFlag }); }, { fill: T.panelDark, fontSize: 22 });
    var goBtn = T.button(this, px + pw - 150, py + ph - 90, 110, 60, '도전', function () {
      var run = new Run(selected);
      self.registry.set('run', run);
      self.scene.start('PickScene');
    }, { fontSize: 26 });
    layer.add([closeBtn, goBtn]);
  },
});
