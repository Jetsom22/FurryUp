// 게임 첫 시작: 잠금 해제된 캐릭터 중 1마리 선택 (전투 기획서 p.3)
var PickScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function PickScene() { Phaser.Scene.call(this, { key: 'PickScene' }); },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var run = Flow.run(this);
    this.cameras.main.setBackgroundColor(T.bgCss);
    var unlocked = CHARACTERS.filter(function (c) { return !c.locked; }).length;
    T.header(this, '첫 동료 선택', '전체 ' + CHARACTERS.length + '마리 중 ' + (CHARACTERS.length - unlocked) + '마리는 잠금. 나머지 ' + unlocked + '마리 중 1마리를 선택하세요.');

    var selected = null;
    var cells = [];
    var cols = 9, size = 150, gap = 16;
    var gx = 60, gy = 130;

    CHARACTERS.forEach(function (c, i) {
      var x = gx + (i % cols) * (size + gap), y = gy + Math.floor(i / cols) * (size + gap + 30);
      var p = T.portrait(self, x, y, size, c.id);
      var name = self.add.text(x + size / 2, y + size + 6, c.name, T.style(18, c.locked ? T.dim : T.text)).setOrigin(0.5, 0);
      var role = self.add.text(x + size / 2, y + size + 28, c.role, T.style(15, c.locked ? T.dim : T.ROLE_COLOR[c.role])).setOrigin(0.5, 0);
      if (c.locked) {
        p.setDim(true);
        self.add.rectangle(x, y, size, size, 0x000000, 0.45).setOrigin(0);
        self.add.text(x + size / 2, y + size / 2, '🔒\n잠금', T.style(22, T.muted, { align: 'center' })).setOrigin(0.5);
      } else {
        var z = self.add.zone(x, y, size, size).setOrigin(0).setInteractive({ useHandCursor: true });
        z.on('pointerdown', function () { selected = c; self.refresh(); });
      }
      cells.push({ c: c, p: p });
    });

    // 우측 정보 패널
    var ix = 1580, iy = 130, iw = 280, ih = 700;
    T.panel(this, ix, iy, iw, ih, { fill: T.panelDark });
    var infoName = this.add.text(ix + 20, iy + 20, '캐릭터를 선택하세요', T.style(24, T.text, { fontStyle: 'bold', wordWrap: { width: iw - 40 } }));
    var infoBody = this.add.text(ix + 20, iy + 70, '', T.style(19, T.muted, { lineSpacing: 8, wordWrap: { width: iw - 40 } }));
    var bigP = null;

    var confirm = T.button(this, ix, iy + ih + 30, iw, 80, '선택 완료', function () {
      run.own(selected.id);
      run.place(selected.id, 0);
      self.scene.start('FormationScene');
    }, { fontSize: 28, enabled: false });

    this.refresh = function () {
      cells.forEach(function (cell) { cell.p.setBorder(selected && cell.c.id === selected.id ? T.accent : T.line, selected && cell.c.id === selected.id ? 5 : 3); });
      if (!selected) return;
      infoName.setText(selected.name + '  (' + selected.role + ')');
      var roleDesc = { 암살자: '편성 순서가 가장 낮은 적 우선 공격', 보호자: '스테이지 시작 시 최대 체력의 10% 보호막', 돌격자: '적 처치 시 현재 체력의 5% 회복', 결전자: '턴이 8 이상 진행될 경우 능력치 증가', 교란자: '15% 확률로 공격 회피' };
      infoBody.setText('체력  ' + selected.hp + '\n공격  ' + selected.atk + '\n방어  ' + selected.def + '\n속도  ' + selected.spd + '\n\n스킬  ' + selected.skill + '\n(투지 ' + BALANCE.SKILL_COST + ' 소모, 공격력 ×' + BALANCE.SKILL_MULT + ')\n\n역할군 효과\n' + roleDesc[selected.role]);
      if (bigP) bigP.destroy();
      bigP = T.portrait(self, ix + 50, iy + 500, 180, selected.id, { full: true });
      confirm.setEnabled(true);
    };
  },
});
