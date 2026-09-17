// 타이틀 (UI 개편 와이어프레임 1): 가운데 로고 자리 + "Press to AnyKey...." -> 아무 키/클릭 -> 로비
var TitleScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function TitleScene() { Phaser.Scene.call(this, { key: 'TitleScene' }); },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    this.cameras.main.setBackgroundColor(T.bgCss);

    // 배경 장식: 캐릭터 실루엣
    var deco = ['CHR_007', 'CHR_015', 'CHR_001', 'CHR_025', 'CHR_012'];
    deco.forEach(function (id, i) {
      var img = self.add.image(200 + i * 380, H + 40, id).setOrigin(0.5, 1).setAlpha(0.14);
      img.setScale(700 / img.height);
    });

    // 로고 자리 (임시)
    var lw = 900, lh = 320, lx = W / 2 - lw / 2, ly = H / 2 - 260;
    T.panel(this, lx, ly, lw, lh, { fill: T.panelDark, line: T.accent, lineWidth: 4, radius: 16 });
    this.add.text(W / 2, ly + lh / 2 - 30, '퍼리업 로고', T.style(96, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, ly + lh / 2 + 70, 'FURRY UP  ·  로고 이미지 자리 (임시)', T.style(24, T.muted)).setOrigin(0.5);

    var press = this.add.text(W / 2, H / 2 + 200, 'Press to AnyKey....', T.style(40, T.accentCss, { fontStyle: 'bold' })).setOrigin(0.5);
    this.tweens.add({ targets: press, alpha: 0.25, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

    this.add.text(W / 2, H - 36, '전투 프로토타입 · 규칙 세트 α-02 · 임시 리소스 사용 중', T.style(16, T.dim)).setOrigin(0.5);

    var go = function () { if (self.started) return; self.started = true; self.cameras.main.fadeOut(250, 0, 0, 0); self.cameras.main.once('camerafadeoutcomplete', function () { self.scene.start('LobbyScene'); }); };
    this.input.keyboard.once('keydown', go);
    this.input.once('pointerdown', go);
  },
});
