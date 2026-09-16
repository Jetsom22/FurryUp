// 게임 첫 시작: 42마리 중 12마리 잠금, 30마리 중 1마리 선택 (전투 기획서 p.3)
var PickScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function PickScene() { Phaser.Scene.call(this, { key: 'PickScene' }); },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var run = Flow.run(this);
    this.cameras.main.setBackgroundColor(T.bgCss);
    var unlocked = CHARACTERS.filter(function (c) { return !c.locked; }).length;
    T.header(this, '첫 동료 선택', '전체 ' + CHARACTERS.length + '마리 중 ' + (CHARACTERS.length - unlocked) + '마리는 잠금. 나머지 ' + unlocked + '마리 중 1마리를 선택하세요.  (규칙 세트 α-02)');

    var selected = null;
    var cells = [];
    var cols = 9, size = 128, gap = 14;
    var gx = 60, gy = 124;

    CHARACTERS.forEach(function (c, i) {
      var x = gx + (i % cols) * (size + gap), y = gy + Math.floor(i / cols) * (size + gap + 40);
      var p = T.portrait(self, x, y, size, c.id);
      self.add.text(x + size / 2, y + size + 4, c.name, T.style(c.name.length > 6 ? 13 : 16, c.locked ? T.dim : T.text)).setOrigin(0.5, 0);
      self.add.text(x + size / 2, y + size + 24, c.role + ' · ' + c.typeName, T.style(13, c.locked ? T.dim : T.ROLE_COLOR[c.role])).setOrigin(0.5, 0);
      if (c.locked) {
        p.setDim(true);
        self.add.rectangle(x, y, size, size, 0x000000, 0.45).setOrigin(0);
        self.add.text(x + size / 2, y + size / 2, '🔒\n잠금', T.style(20, T.muted, { align: 'center' })).setOrigin(0.5);
      } else {
        var z = self.add.zone(x, y, size, size).setOrigin(0).setInteractive({ useHandCursor: true });
        z.on('pointerdown', function () { selected = c; self.refresh(); });
      }
      cells.push({ c: c, p: p });
    });

    // 우측 정보 패널
    var ix = 1360, iy = 124, iw = 500, ih = 780;
    T.panel(this, ix, iy, iw, ih, { fill: T.panelDark });
    var infoName = this.add.text(ix + 20, iy + 16, '캐릭터를 선택하세요', T.style(24, T.text, { fontStyle: 'bold', wordWrap: { width: iw - 200 } }));
    var infoSub = this.add.text(ix + 20, iy + 50, '', T.style(15, T.muted, { wordWrap: { width: iw - 200 } }));
    var infoStats = this.add.text(ix + 20, iy + 116, '', T.style(15, T.text, { lineSpacing: 4, wordWrap: { width: iw - 200 } }));
    var infoSkills = this.add.text(ix + 20, iy + 250, '', T.style(14, T.muted, { lineSpacing: 5, wordWrap: { width: iw - 40 } }));
    var bigP = null;

    var confirm = T.button(this, ix, iy + ih + 20, iw, 70, '선택 완료', function () {
      run.own(selected.id);
      run.place(selected.id, 0);
      self.scene.start('FormationScene');
    }, { fontSize: 28, enabled: false });

    var skillLine = function (label, s, provisional) {
      if (!s) return label + '  (문서 미정 · ' + provisional + ')';
      return label + ' ' + s.name + (s.cost !== undefined ? '  [투지 ' + s.cost + (s.priority ? ' · 우선도 +' + s.priority : '') + ']' : '') + '\n   ' + s.desc;
    };

    this.refresh = function () {
      cells.forEach(function (cell) { cell.p.setBorder(selected && cell.c.id === selected.id ? T.accent : T.line, selected && cell.c.id === selected.id ? 5 : 3); });
      if (!selected) return;
      var c = selected, p = c.pts;
      infoName.setText(c.name);
      var roleLabel = c.role + (c.sourceRole !== c.role ? ' (문서: ' + c.sourceRole + ')' : '');
      infoSub.setText(roleLabel + ' · ' + c.typeName + ' 타입 · ' + c.species);
      infoStats.setText('체력 ' + p.hp + ' (HP ' + c.hp + ')   공격 ' + p.atk + '   방어 ' + p.def + '   속도 ' + p.spd + '   합계 ' + (p.hp + p.atk + p.def + p.spd) + '\n역할군 효과: ' + BALANCE.ROLE[c.role].desc);
      var RR = BALANCE.RULES;
      infoSkills.setText([skillLine('패시브', c.passive, '역할군 효과만 적용'), skillLine('스킬', c.skill, '공통 스킬: 투지 ' + RR.skillCost + ', 고정 피해 ' + RR.skillDamage), '기본 공격: max(' + RR.minDamage + ', ⌊공격×' + RR.attackFactor + ' − 방어⌋)' + (c.role === '암살자' ? ' · 가장 뒤 슬롯 우선' : '')].join('\n\n'));
      if (bigP) bigP.destroy();
      bigP = T.portrait(self, ix + iw - 150, iy + 12, 130, c.id, { full: true });
      confirm.setEnabled(true);
    };
  },
});
