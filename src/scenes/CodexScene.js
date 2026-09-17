// 도감 (UI 개편 와이어프레임 3)
//   필터 버튼(육/해/공 · 보호자/돌격자/교란자/암살자/결전자) · 6열 카드 · 잠금 카드는 쇠사슬+자물쇠 · 우측 스크롤바
var CodexScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function CodexScene() { Phaser.Scene.call(this, { key: 'CodexScene' }); },

  create: function () {
    var T = Theme, Wd = Widgets, W = T.W, H = T.H, self = this;
    this.cameras.main.setBackgroundColor(T.bgCss);
    Wd.screenHeader(this, '도감', function () { self.scene.start('LobbyScene'); });

    var typeFilter = null, roleFilter = null;
    var typeBtns = [], roleBtns = [];
    var fy = 100, fh = 50;
    ['육', '해', '공'].forEach(function (t, i) {
      var b = T.button(self, 60 + i * 120, fy, 110, fh, t, function () { typeFilter = typeFilter === t ? null : t; rebuild(); }, { fill: T.panel, fontSize: 22 });
      b.key = t; typeBtns.push(b);
    });
    ['보호자', '돌격자', '교란자', '암살자', '결전자'].forEach(function (r, i) {
      var b = T.button(self, 460 + i * 150, fy, 140, fh, r, function () { roleFilter = roleFilter === r ? null : r; rebuild(); }, { fill: T.panel, fontSize: 22, color: T.ROLE_COLOR[r] });
      b.key = r; roleBtns.push(b);
    });
    var countText = this.add.text(W - 60, fy + fh / 2, '', T.style(18, T.muted)).setOrigin(1, 0.5);

    // 6열 카드 그리드
    var cols = 6, cw = 280, chh = 330, gap = 24;
    var gx = 60, gy = 170, gw = cols * cw + (cols - 1) * gap, gh = 880;
    var area = Wd.scrollArea(this, gx, gy, gw, gh);
    var cards = [];

    // 카드 클릭 -> 정보 팝업
    var openInfo = function (ch) {
      var layer = self.add.container(0, 0).setDepth(100);
      layer.add(T.overlay(self, 0.6));
      var pw = 620, ph = 880, px = W / 2 - pw / 2, py = H / 2 - ph / 2;
      var info = Wd.infoPanel(self, px, py, pw, ph, { title: ch.locked ? '도감 · 잠금 캐릭터' : '도감' });
      info.setCharacter(ch);
      layer.add(info);
      layer.add(T.button(self, px + pw - 140, py + 8, 120, 40, '닫기', function () { layer.destroy(); }, { fill: T.panelDark, fontSize: 18 }));
    };

    var rebuild = function () {
      cards.forEach(function (c) { c.destroy(); }); cards = [];
      typeBtns.forEach(function (b) { b.setEnabled(true); b.label.setColor(b.key === typeFilter ? T.accentCss : T.text); });
      roleBtns.forEach(function (b) { b.label.setColor(b.key === roleFilter ? '#ffffff' : T.ROLE_COLOR[b.key]); });
      var list = CHARACTERS.filter(function (c) { return (!typeFilter || c.type === typeFilter) && (!roleFilter || c.role === roleFilter); });
      list.forEach(function (ch, i) {
        var x = (i % cols) * (cw + gap), y = Math.floor(i / cols) * (chh + gap);
        var card = Wd.charCard(self, x, y, cw, chh, ch, { sub: true, stripH: 70 });
        card.zone.on('pointerover', function () { card.setHover(true); });
        card.zone.on('pointerout', function () { card.setHover(false); });
        card.zone.on('pointerdown', function (pointer) { if (area.contains(pointer)) openInfo(ch); });
        area.add(card);
        cards.push(card);
      });
      area.setContentHeight(Math.ceil(list.length / cols) * (chh + gap) - gap);
      area.setScroll(0);
      var unlocked = list.filter(function (c) { return !c.locked; }).length;
      countText.setText(list.length + '종 (해금 ' + unlocked + ' · 잠금 ' + (list.length - unlocked) + ')');
    };
    rebuild();
  },
});
