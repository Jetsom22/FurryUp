// 이벤트 스테이지: 진입 시 하위 효과(도박/이로운/해로운/일반) 랜덤 발생
var EventScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function EventScene() { Phaser.Scene.call(this, { key: 'EventScene' }); },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var run = Flow.run(this);
    this.cameras.main.setBackgroundColor(T.bgCss);

    // 진입 시 1회만 굴림
    if (run.currentEventStage !== run.stageIndex) { run.currentEvent = run.rollEvent(); run.currentEventStage = run.stageIndex; }
    var effect = run.currentEvent;
    var E = BALANCE.EVENT;

    T.panel(this, 80, 38, 240, 70, { fill: T.panelDark });
    this.add.text(200, 73, run.stageLabel() + '  [이벤트]', T.style(20, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    this.add.text(W / 2, 200, '이벤트 발생!', T.style(56, T.accentCss, { fontStyle: 'bold' })).setOrigin(0.5);

    var color = { 도박: '#ffd166', 이로운: '#7fe07f', 해로운: '#e06060', 일반: T.muted }[effect];
    T.panel(this, W / 2 - 420, 290, 840, 420, { fill: T.panelDark, line: T.accent, lineWidth: 3 });
    this.add.text(W / 2, 350, effect + ' 효과', T.style(44, color, { fontStyle: 'bold' })).setOrigin(0.5);
    var body = this.add.text(W / 2, 470, '', T.style(24, T.text, { align: 'center', wordWrap: { width: 760 }, lineSpacing: 10 })).setOrigin(0.5);
    var goldText = this.add.text(W / 2, 640, '보유 골드 : ' + run.gold + ' G', T.style(22, '#ffd166')).setOrigin(0.5);

    var done = function (label) {
      var b = T.button(self, W / 2 - 150, 760, 300, 80, label || '확인 (정비 화면으로)', function () { Flow.stageCleared(self); }, { fontSize: 24 });
      return b;
    };

    if (effect === '이로운') {
      run.healAll(E['이로운'].healRate);
      body.setText('따스한 바람이 들판을 스칩니다.\n아군 전원이 최대 체력의 ' + Math.round(E['이로운'].healRate * 100) + '%를 회복했습니다.');
      done();
    } else if (effect === '해로운') {
      run.damageAll(E['해로운'].damageRate);
      body.setText('독안개가 들판을 덮었습니다.\n아군 전원이 최대 체력의 ' + Math.round(E['해로운'].damageRate * 100) + '% 피해를 입었습니다. (체력 1 미만으로는 내려가지 않음)');
      done();
    } else if (effect === '도박') {
      var bet = Math.floor(run.gold * E['도박'].betRate);
      body.setText('수상한 상인이 내기를 제안합니다.\n골드의 ' + Math.round(E['도박'].betRate * 100) + '% (' + bet + ' G)를 걸면 ' + Math.round(E['도박'].winChance * 100) + '% 확률로 ' + E['도박'].winMult + '배가 됩니다.\n실패하면 건 골드를 잃습니다.');
      var yes = T.button(this, W / 2 - 320, 760, 300, 80, '걸기 (' + bet + ' G)', function () {
        var r = run.gamble();
        yes.destroy(); no.destroy();
        body.setText(r.win ? '성공! ' + (r.bet * (E['도박'].winMult - 1)) + ' G를 얻었습니다.' : '실패… ' + r.bet + ' G를 잃었습니다.');
        goldText.setText('보유 골드 : ' + run.gold + ' G');
        done();
      }, { fontSize: 24, enabled: bet > 0 });
      var no = T.button(this, W / 2 + 20, 760, 300, 80, '그만두기', function () { yes.destroy(); no.destroy(); body.setText('상인이 어깨를 으쓱하며 사라졌습니다.'); done(); }, { fontSize: 24, fill: T.panelDark });
    } else {
      body.setText('별다른 일은 없었습니다.\n일반 전투가 시작됩니다.');
      T.button(this, W / 2 - 150, 760, 300, 80, '전투 시작', function () { self.scene.start('BattleScene'); }, { fontSize: 24 });
    }
  },
});
