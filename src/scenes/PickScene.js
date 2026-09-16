// 게임 첫 시작: 42마리 중 12마리 잠금, 30마리 중 1마리 선택 (전투 기획서 p.3)
var PickScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function PickScene() { Phaser.Scene.call(this, { key: 'PickScene' }); },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var run = Flow.run(this);
    this.cameras.main.setBackgroundColor(T.bgCss);
    var unlocked = CHARACTERS.filter(function (c) { return !c.locked; }).length;
    T.header(this, '첫 동료 선택', '전체 ' + CHARACTERS.length + '마리 중 ' + (CHARACTERS.length - unlocked) + '마리는 잠금. 나머지 ' + unlocked + '마리 중 1마리를 선택하세요.  (타입 상성: 육 ▶ 공 ▶ 해 ▶ 육)');

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

    var roleDesc = { 암살자: '편성 순서가 가장 낮은 적 우선 공격', 보호자: '스테이지 시작 시 최대 체력의 10% 보호막', 돌격자: '적 처치 시 현재 체력의 5% 회복', 결전자: '턴 8 이상 진행 시 공격/방어/마법 +2', 교란자: '15% 확률로 공격 회피', 추격자: '체력 비율이 가장 낮은 적 우선 공격, 잃은 체력에 비례해 피해 증가', 치유자: '턴 종료 시 가장 다친 아군을 5% 회복' };
    var elName = { WILD: '야성', ARCANE: '비술', DIVINE: '신성' };
    var tgtName = { enemy_one: '적 하나', enemy_all: '적 전체', enemy_weakest: '가장 약한 적', self: '자신', ally_one: '아군 하나', ally_weakest: '가장 약한 아군', ally_all: '아군 전체', ally_others: '다른 아군', field_others: '아군 전체' };
    var skillLine = function (label, s) {
      if (!s) return '';
      var head = label + ' ' + s.name + '  [' + (s.element ? elName[s.element] + ' · ' : '') + (tgtName[s.target] || s.target) + (s.tier ? ' · 위력 ' + s.tier : '') + (s.spCost ? ' · 투지 ' + s.spCost : '') + ']';
      var unsupported = (s.effects || []).filter(function (e) { return BattleEngine.SUPPORTED_EFFECTS.indexOf(e.kw) < 0; }).map(function (e) { return e.kwName; });
      return head + '\n   ' + s.desc + (unsupported.length ? '\n   (프로토타입 미구현: ' + unsupported.join(', ') + ')' : '');
    };

    this.refresh = function () {
      cells.forEach(function (cell) { cell.p.setBorder(selected && cell.c.id === selected.id ? T.accent : T.line, selected && cell.c.id === selected.id ? 5 : 3); });
      if (!selected) return;
      var c = selected, p = c.pts;
      infoName.setText(c.name + (c.nameEn ? '  ' + c.nameEn : ''));
      infoSub.setText(c.role + ' · ' + c.typeName + ' 타입 · ' + c.species + '\n' + c.desc);
      infoStats.setText('체력 ' + c.hp + ' (' + p.hp + ')  공격 ' + p.atk + '  물방 ' + p.def + '  마방 ' + p.mag + '  속도 ' + p.spd + '\n역할군: ' + roleDesc[c.role]);
      infoSkills.setText([skillLine('일반기1', c.skills.basic[0]), skillLine('일반기2', c.skills.basic[1]), skillLine('특수기', c.skills.ultimate), skillLine('패시브(표시만)', c.skills.passive)].join('\n\n'));
      if (bigP) bigP.destroy();
      bigP = T.portrait(self, ix + iw - 150, iy + 12, 130, c.id, { full: true });
      confirm.setEnabled(true);
    };
  },
});
