// 챕터 선택 (UI 개편 와이어프레임 2)
//   뒤로가기 + 제목 바 · 챕터 배너(챕터 N + 설명) · 이전/다음 · 큰 이미지 영역 · 게임 시작 -> 런 생성 -> 1-1 바로 진입
var ChapterSelectScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function ChapterSelectScene() { Phaser.Scene.call(this, { key: 'ChapterSelectScene' }); },

  create: function () {
    var T = Theme, Wd = Widgets, W = T.W, H = T.H, self = this;
    this.cameras.main.setBackgroundColor(T.bgCss);
    Wd.screenHeader(this, '챕터 선택', function () { self.scene.start('CharacterSelectScene', { mode: 'start' }); });

    var chapters = STAGE_RULES.chapters;
    this.index = 0;
    var equipped = Wd.getEquipped(this);

    // 배너
    var bx = 260, by = 120, bw = W - 520, bh = 120;
    T.panel(this, bx, by, bw, bh, { fill: T.panelDark, line: T.accent, radius: 12 });
    var title = this.add.text(bx + 30, by + bh / 2, '', T.style(44, T.text, { fontStyle: 'bold' })).setOrigin(0, 0.5);
    var desc = this.add.text(bx + 330, by + bh / 2, '', T.style(20, T.muted, { lineSpacing: 6, wordWrap: { width: bw - 360 } })).setOrigin(0, 0.5);

    // 이전 / 다음
    var prevBtn = T.button(this, 40, H / 2 - 80, 180, 160, '◀\n이전', function () { self.index -= 1; render(); }, { fill: T.panel, fontSize: 30 });
    var nextBtn = T.button(this, W - 220, H / 2 - 80, 180, 160, '▶\n다음', function () { self.index += 1; render(); }, { fill: T.panel, fontSize: 30 });

    // 큰 이미지 영역
    var ix = 260, iy = 270, iw = W - 520, ih = 640;
    T.panel(this, ix, iy, iw, ih, { fill: T.panelDark, radius: 12 });
    var deco = this.add.image(ix + iw - 260, iy + ih - 20, 'CHR_012').setOrigin(0.5, 1).setAlpha(0.35);
    deco.setScale(Math.min(600 / deco.height, 1));
    var imgLabel = this.add.text(ix + 30, iy + 24, '', T.style(22, T.muted, { fontStyle: 'bold' }));
    var rules = this.add.text(ix + 30, iy + 70, '', T.style(18, T.text, { lineSpacing: 8, wordWrap: { width: iw - 360 } }));
    var lockText = this.add.text(ix + iw / 2, iy + ih / 2, '', T.style(48, T.dim, { fontStyle: 'bold' })).setOrigin(0.5);

    // 게임 시작
    var startBtn = T.button(this, W - 360, H - 140, 320, 100, '게임 시작', function () {
      startBtn.setEnabled(false);
      var run = new Run(chapters[self.index].chapter);
      run.own(equipped.id);
      run.place(equipped.id, 0);
      self.registry.set('run', run);
      Flow.enterStage(self);
    }, { fontSize: 36 });
    var party = this.add.text(W - 380, H - 90, '', T.style(18, T.muted)).setOrigin(1, 0.5);

    var render = function () {
      var ch = chapters[self.index];
      title.setText('챕터 ' + ch.chapter);
      desc.setText(ch.name + '\n' + (ch.desc || ''));
      prevBtn.setEnabled(self.index > 0);
      nextBtn.setEnabled(self.index < chapters.length - 1);
      imgLabel.setText('챕터 이미지 자리 (임시)  ·  ' + ch.name);
      if (ch.locked) {
        rules.setText('');
        lockText.setText('🔒 잠긴 챕터\n이전 챕터를 클리어하면 열립니다');
        startBtn.setEnabled(false);
        deco.setVisible(false);
      } else {
        var fixed = Object.keys(ch.fixed).map(function (k) { return ch.chapter + '-' + k + ' ' + ch.fixed[k]; }).join(' · ');
        rules.setText([
          '스테이지 ' + ch.total + '개',
          '고정 배치: ' + fixed,
          '중간 보스: ' + ch.chapter + '-' + ch.midbossRange[0] + ' ~ ' + ch.chapter + '-' + ch.midbossRange[1] + ' 중 하나 (매 판 랜덤)',
          '이벤트: ' + ch.eventCount + '개 (' + ch.chapter + '-' + ch.eventRange[0] + ' ~ ' + ch.chapter + '-' + ch.eventRange[1] + ', 3연속 금지)',
          '',
          '게임 시작을 누르면 장착한 캐릭터 1마리가 편성 1번으로 들어가 ' + ch.chapter + '-1 부터 시작합니다.',
        ].join('\n'));
        lockText.setText('');
        startBtn.setEnabled(true);
        deco.setVisible(true);
      }
      party.setText('첫 동료: ' + equipped.name + ' (' + equipped.role + ')');
    };
    render();
  },
});
