// 리소스 로드: 서 있는 앞모습(ST_F) + 초상(PT) 43종 (로스터 42 + 안내자 CHR_901)
var BootScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function BootScene() { Phaser.Scene.call(this, { key: 'BootScene' }); },

  preload: function () {
    var T = Theme;
    var W = T.W, H = T.H;
    this.cameras.main.setBackgroundColor(T.bgCss);
    this.add.text(W / 2, H / 2 - 60, '퍼리업 전투 프로토타입', T.style(40, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.rectangle(W / 2, H / 2 + 20, 600, 24, T.panelDark).setStrokeStyle(2, T.line);
    var bar = this.add.rectangle(W / 2 - 298, H / 2 + 20, 0, 20, T.accent).setOrigin(0, 0.5);
    var label = this.add.text(W / 2, H / 2 + 60, '리소스 불러오는 중…', T.style(20, T.muted)).setOrigin(0.5);
    this.load.on('progress', function (v) { bar.width = 596 * v; });
    this.load.on('loaderror', function (f) { label.setText('로드 실패: ' + f.key); });

    var self = this;
    var all = CHARACTERS.concat([GUIDE_CHARACTER]);
    all.forEach(function (c) {
      if (c.res.st) self.load.image(c.id, c.res.st);
      if (c.res.pt) self.load.image(Theme.faceKey(c.id), c.res.pt);
    });
  },

  create: function () {
    var self = this;
    // 초상이 없는 캐릭터는 서 있는 그림의 위쪽을 잘라 대신 쓴다
    CHARACTERS.concat([GUIDE_CHARACTER]).forEach(function (c) {
      var key = Theme.faceKey(c.id);
      if (self.textures.exists(key) || !self.textures.exists(c.id)) return;
      var src = self.textures.get(c.id).getSourceImage();
      var side = Math.floor(src.width * 0.62), sx = Math.floor((src.width - side) / 2), sy = Math.floor(src.height * 0.04);
      var tex = self.textures.createCanvas(key, 256, 256);
      tex.getContext().drawImage(src, sx, sy, side, side, 0, 0, 256, 256);
      tex.refresh();
    });
    this.scene.start('TitleScene');
  },
});
