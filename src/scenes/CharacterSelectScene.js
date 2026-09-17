// 캐릭터 선택 (UI 개편 와이어프레임 5)
//   잠금 해제 30종을 5열 카드로. 카드 위에 마우스를 올리거나 선택하면 "장착" 버튼, 장착 중인 카드에는 "사용 캐릭터" 배지
//   mode 'start' (로비의 게임 시작 경유) 이면 우측 하단에 "챕터 선택으로" 버튼
var CharacterSelectScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function CharacterSelectScene() { Phaser.Scene.call(this, { key: 'CharacterSelectScene' }); },

  init: function (data) { this.mode = (data && data.mode) || 'lobby'; },

  create: function () {
    var T = Theme, Wd = Widgets, W = T.W, H = T.H, self = this;
    this.cameras.main.setBackgroundColor(T.bgCss);
    Wd.screenHeader(this, '캐릭터 선택' + (this.mode === 'start' ? '  ·  사용할 캐릭터를 장착하고 챕터 선택으로' : ''), function () { self.scene.start('LobbyScene'); });

    var list = CHARACTERS.filter(function (c) { return !c.locked; });
    var equippedId = Wd.getEquipped(this).id;
    var selectedId = equippedId;

    // 우측: 선택 캐릭터 정보
    var info = Wd.infoPanel(this, 1350, 110, 530, 830, { title: '선택 캐릭터 정보' });

    // 좌측: 5열 카드 그리드 (스크롤)
    var cols = 5, cw = 232, chh = 300, gap = 18;
    var gx = 60, gy = 110, gw = cols * cw + (cols - 1) * gap, gh = 930;
    var area = Wd.scrollArea(this, gx, gy, gw, gh);
    var cards = [];
    var rows = Math.ceil(list.length / cols);
    area.setContentHeight(rows * (chh + gap) - gap);

    var refresh = function () {
      cards.forEach(function (card) {
        var isEq = card.ch.id === equippedId, isSel = card.ch.id === selectedId;
        card.setSelected(isSel);
        card.badge.setVisible(isEq);
        card.equipBtn.setVisible(!isEq && (isSel || card.hovered));
      });
      info.setCharacter(CHARACTER_BY_ID[selectedId]);
    };

    list.forEach(function (ch, i) {
      var x = (i % cols) * (cw + gap), y = Math.floor(i / cols) * (chh + gap);
      var card = Wd.charCard(self, x, y, cw, chh, ch, { sub: true, stripH: 66 });
      // 사용 캐릭터 배지
      var badge = self.add.container(0, 0);
      var bg = self.add.graphics(); bg.fillStyle(T.accent, 1); bg.fillRoundedRect(8, 8, 120, 34, 8);
      badge.add(bg); badge.add(self.add.text(68, 25, '사용 캐릭터', T.style(17, '#1a1510', { fontStyle: 'bold' })).setOrigin(0.5));
      card.add(badge); card.badge = badge;
      // 장착 버튼 (카드 하단 이미지 위)
      var eb = T.button(self, cw / 2 - 70, card.imgH - 62, 140, 50, '장착', function () {
        Wd.setEquipped(self, ch.id); equippedId = ch.id; selectedId = ch.id; refresh();
        T.floatText(self, gx + x + cw / 2, area.y + y + card.imgH - 40, '장착!', T.accentCss, 30);
      }, { fontSize: 24 });
      card.add(eb); card.equipBtn = eb;
      card.zone.on('pointerover', function () { card.setHover(true); refresh(); });
      card.zone.on('pointerout', function (pointer) {
        // 장착 버튼 위로 옮겨간 경우는 카드 안에 있으므로 유지
        var wx = gx + x, wy = area.y + y;
        if (pointer.x >= wx && pointer.x <= wx + cw && pointer.y >= wy && pointer.y <= wy + chh) return;
        card.setHover(false); refresh();
      });
      card.zone.on('pointerdown', function (pointer) { if (!area.contains(pointer)) return; selectedId = ch.id; refresh(); });
      area.add(card);
      cards.push(card);
    });
    refresh();

    if (this.mode === 'start') {
      T.button(this, 1350, 960, 530, 90, '챕터 선택으로 ▶', function () { self.scene.start('ChapterSelectScene'); }, { fontSize: 30 });
    } else {
      this.add.text(1615, 1000, '장착한 캐릭터가 로비와 게임 시작 시 첫 동료가 됩니다.', T.style(16, T.dim)).setOrigin(0.5);
    }
  },
});
