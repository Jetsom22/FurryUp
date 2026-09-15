// 리소스 로드 + 얼굴 크롭 텍스처 생성
var BootScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function BootScene() { Phaser.Scene.call(this, { key: 'BootScene' }); },

  preload: function () {
    var T = Theme;
    var W = T.W, H = T.H;
    this.cameras.main.setBackgroundColor(T.bgCss);
    this.add.text(W / 2, H / 2 - 60, '퍼리업 전투 프로토타입', T.style(40, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    var barBg = this.add.rectangle(W / 2, H / 2 + 20, 600, 24, T.panelDark).setStrokeStyle(2, T.line);
    var bar = this.add.rectangle(W / 2 - 298, H / 2 + 20, 0, 20, T.accent).setOrigin(0, 0.5);
    var label = this.add.text(W / 2, H / 2 + 60, '리소스 불러오는 중…', T.style(20, T.muted)).setOrigin(0.5);
    this.load.on('progress', function (v) { bar.width = 596 * v; });
    this.load.on('loaderror', function (f) { label.setText('로드 실패: ' + f.key); });

    var self = this;
    CHARACTERS.forEach(function (c) { self.load.image(c.id, 'assets/characters/' + c.id + '_ST_F.png'); });
  },

  create: function () {
    // 얼굴 크롭 텍스처: 원본의 위쪽 중앙을 정사각으로 잘라 256px 캔버스 텍스처로 생성
    var self = this;
    CHARACTERS.forEach(function (c) {
      var src = self.textures.get(c.id).getSourceImage();
      var w = src.width, h = src.height;
      var side = Math.floor(w * 0.62);
      var sx = Math.floor((w - side) / 2);
      var sy = Math.floor(h * 0.04);
      var key = Theme.faceKey(c.id);
      var canvasTex = self.textures.createCanvas(key, 256, 256);
      var ctx = canvasTex.getContext();
      ctx.drawImage(src, sx, sy, side, side, 0, 0, 256, 256);
      canvasTex.refresh();
    });
    this.scene.start('TitleScene');
  },
});
