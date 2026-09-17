// 로비 (UI 개편 와이어프레임 4)
//   상단 바(아이콘 / 재화 0 고정 / 설정) · 좌측 큰 배너 · 사용 캐릭터 정보 · 우측 버튼(임시 배너 / 도감 / 캐릭터 선택 / 게임 시작)
//   게임 시작 -> 캐릭터 선택 -> 챕터 선택 -> 1-1 진입
var LobbyScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function LobbyScene() { Phaser.Scene.call(this, { key: 'LobbyScene' }); },

  init: function (data) { this.message = data && data.message; this.clearedFlag = data && data.cleared; },

  create: function () {
    var T = Theme, Wd = Widgets, W = T.W, H = T.H, self = this;
    this.cameras.main.setBackgroundColor(T.bgCss);
    this.cameras.main.fadeIn(200, 0, 0, 0);
    Wd.topBar(this, function () { self.openSettings(); });

    var equipped = Wd.getEquipped(this);

    // 좌측 큰 배너 (임시): 사용 캐릭터 전신 + 문구
    var bx = 40, by = 120, bw = 900, bh = 920;
    T.panel(this, bx, by, bw, bh, { fill: T.panelDark, radius: 12 });
    var deco = this.add.image(bx + bw / 2, by + bh - 40, equipped.id).setOrigin(0.5, 1);
    deco.setScale(Math.min((bw - 80) / deco.width, (bh - 140) / deco.height));
    this.add.text(bx + 30, by + 24, '메인 배너 (임시)', T.style(24, T.muted, { fontStyle: 'bold' }));
    this.add.text(bx + 30, by + 60, '챕터 1 · 평화로운 들판 이 열려 있습니다', T.style(18, T.dim));

    // 런 종료 메시지
    if (this.message) {
      T.panel(this, bx + 30, by + bh - 110, bw - 60, 70, { fill: T.panel, line: this.clearedFlag ? T.accent : T.danger });
      this.add.text(bx + bw / 2, by + bh - 75, this.message, T.style(22, this.clearedFlag ? T.accentCss : '#e08080', { fontStyle: 'bold' })).setOrigin(0.5);
    }

    // 가운데: 사용 캐릭터 정보
    var info = Wd.infoPanel(this, 980, 120, 560, 920, { title: '사용 캐릭터' });
    info.setCharacter(equipped);

    // 우측 버튼
    var rx = 1580, rw = 300;
    T.panel(this, rx, 120, rw, 200, { fill: T.panelDark, radius: 12 });
    this.add.text(rx + rw / 2, 220, '임시 배너', T.style(26, T.muted, { fontStyle: 'bold' })).setOrigin(0.5);
    T.button(this, rx, 350, rw, 110, '도감', function () { self.scene.start('CodexScene'); }, { fill: T.panel, fontSize: 30 });
    T.button(this, rx, 490, rw, 110, '캐릭터 선택', function () { self.scene.start('CharacterSelectScene', { mode: 'lobby' }); }, { fill: T.panel, fontSize: 30 });
    T.button(this, rx, 820, rw, 220, '게임 시작', function () { self.scene.start('CharacterSelectScene', { mode: 'start' }); }, { fontSize: 40 });
  },

  openSettings: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var layer = this.add.container(0, 0).setDepth(100);
    layer.add(T.overlay(this, 0.6));
    var pw = 620, ph = 360, px = W / 2 - pw / 2, py = H / 2 - ph / 2;
    layer.add(T.panel(this, px, py, pw, ph, { fill: T.panel, line: T.accent }));
    layer.add(this.add.text(px + pw / 2, py + 40, '설정', T.style(32, T.text, { fontStyle: 'bold' })).setOrigin(0.5));
    layer.add(this.add.text(px + 40, py + 100, '전투 연출 속도', T.style(22, T.muted)));
    var speed = this.registry.get('speed') || 1;
    var btns = [1, 2, 4].map(function (s, i) {
      var b = T.button(self, px + 40 + i * 180, py + 140, 160, 60, 'x' + s, function () { self.registry.set('speed', s); btns.forEach(function (bb, j) { bb.setEnabled([1, 2, 4][j] !== s); }); }, { fill: T.panelDark, fontSize: 24 });
      b.setEnabled(s !== speed);
      layer.add(b);
      return b;
    });
    layer.add(this.add.text(px + 40, py + 230, '재화·계정 설정은 프로토타입 범위 밖입니다.', T.style(16, T.dim)));
    layer.add(T.button(this, px + pw / 2 - 80, py + ph - 80, 160, 56, '닫기', function () { layer.destroy(); }, { fontSize: 22 }));
  },
});
