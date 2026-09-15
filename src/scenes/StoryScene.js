// 스토리 스테이지: 대사 전달 -> 클리어 -> 정비 화면
var StoryScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function StoryScene() { Phaser.Scene.call(this, { key: 'StoryScene' }); },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var run = Flow.run(this);
    var stage = run.currentStage();
    this.cameras.main.setBackgroundColor('#15110c');
    var lines = (STAGE_RULES.story[stage.no] || ['(임시 스토리) ' + run.stageLabel()]).slice();

    // 배경: 편성 1번 캐릭터 실루엣
    var lead = run.formation.filter(Boolean)[0];
    if (lead) { var img = this.add.image(W / 2, H - 260, lead).setOrigin(0.5, 1).setAlpha(0.35); img.setScale(700 / img.height); }

    T.panel(this, 80, 38, 240, 70, { fill: T.panelDark });
    this.add.text(200, 73, run.stageLabel() + '  [스토리]', T.style(20, T.text, { fontStyle: 'bold' })).setOrigin(0.5);

    // 대사 상자
    T.panel(this, 160, H - 300, W - 320, 230, { fill: T.panelDark, alpha: 0.95, line: T.accent });
    var txt = this.add.text(200, H - 260, '', T.style(28, T.text, { wordWrap: { width: W - 400 }, lineSpacing: 10 }));
    var hint = this.add.text(W - 200, H - 100, '클릭하여 계속 ▶', T.style(18, T.muted)).setOrigin(0.5);
    var idx = 0;
    var show = function () { txt.setText(lines[idx]); hint.setText(idx === lines.length - 1 ? '클릭하여 스테이지 클리어 ▶' : '클릭하여 계속 ▶  (' + (idx + 1) + '/' + lines.length + ')'); };
    show();
    this.input.on('pointerdown', function () {
      idx++;
      if (idx < lines.length) show();
      else { self.input.removeAllListeners(); Flow.stageCleared(self); }
    });
  },
});
