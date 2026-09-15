// 팀 편성 (전투 기획서 p.3): 5자리 중 한 곳에 편성 -> 스테이지 진입
var FormationScene = new Phaser.Class({
  Extends: Phaser.Scene,
  initialize: function FormationScene() { Phaser.Scene.call(this, { key: 'FormationScene' }); },

  create: function () {
    var T = Theme, W = T.W, H = T.H, self = this;
    var run = Flow.run(this);
    this.cameras.main.setBackgroundColor(T.bgCss);
    T.header(this, '팀 편성', '보유 캐릭터를 클릭한 뒤 편성 칸(1~5)을 클릭하면 배치됩니다. 편성 순서 1번이 가장 먼저 공격받습니다.');

    this.selectedId = null;
    this.slotViews = [];
    this.rosterViews = [];

    // 좌측: 보유 캐릭터
    this.add.text(160, 140, '보유 캐릭터', T.style(26, T.text, { fontStyle: 'bold' }));
    T.panel(this, 140, 180, 520, 760, { fill: T.panelDark });

    // 중앙: 편성 칸 5개 (세로)
    this.add.text(W / 2, 140, '편성 순서 높음 ▲', T.style(20, T.muted)).setOrigin(0.5);
    this.add.text(W / 2, 960, '편성 순서 낮음 ▼', T.style(20, T.muted)).setOrigin(0.5);

    // 우측: 진입 버튼
    this.enterBtn = T.button(this, 1400, 460, 340, 110, '스테이지 진입', function () { Flow.enterStage(self); }, { fontSize: 32 });
    this.hint = this.add.text(1570, 600, '', T.style(18, '#e08080', { align: 'center', wordWrap: { width: 340 } })).setOrigin(0.5, 0);

    this.render();
  },

  render: function () {
    var T = Theme, W = T.W, self = this;
    var run = Flow.run(this);
    this.slotViews.forEach(function (v) { v.destroy(); }); this.slotViews = [];
    this.rosterViews.forEach(function (v) { v.destroy(); }); this.rosterViews = [];

    // 편성 칸
    var size = 130, gap = 26, top = 180;
    for (var i = 0; i < 5; i++) {
      (function (idx) {
        var x = W / 2 - size / 2, y = top + idx * (size + gap);
        var c = self.add.container(0, 0);
        var id = run.formation[idx];
        var g = self.add.graphics();
        g.fillStyle(T.panelDark, 1); g.fillRoundedRect(x, y, size, size, 8);
        g.lineStyle(3, T.accent, 1); g.strokeRoundedRect(x, y, size, size, 8);
        c.add(g);
        c.add(self.add.text(x - 40, y + size / 2, String(idx + 1), T.style(36, T.accentCss, { fontStyle: 'bold' })).setOrigin(0.5));
        if (id) {
          c.add(T.portrait(self, x + 4, y + 4, size - 8, id));
          c.add(self.add.text(x + size + 16, y + size / 2 - 14, CHARACTER_BY_ID[id].name, T.style(22, T.text, { fontStyle: 'bold' })).setOrigin(0, 0.5));
          c.add(self.add.text(x + size + 16, y + size / 2 + 14, CHARACTER_BY_ID[id].role, T.style(17, T.ROLE_COLOR[CHARACTER_BY_ID[id].role])).setOrigin(0, 0.5));
        } else {
          c.add(self.add.text(x + size / 2, y + size / 2, '빈 칸', T.style(20, T.dim)).setOrigin(0.5));
        }
        var z = self.add.zone(x, y, size, size).setOrigin(0).setInteractive({ useHandCursor: true });
        z.on('pointerdown', function () {
          if (self.selectedId) { run.place(self.selectedId, idx); self.selectedId = null; self.render(); }
          else if (id) { run.unplace(idx); self.render(); }
        });
        c.add(z);
        self.slotViews.push(c);
      })(i);
    }

    // 보유 캐릭터 목록
    run.ownedIds().forEach(function (id, i) {
      var c = CHARACTER_BY_ID[id];
      var x = 170 + (i % 3) * 165, y = 210 + Math.floor(i / 3) * 190;
      var cont = self.add.container(0, 0);
      var p = T.portrait(self, x, y, 140, id);
      var placed = run.formation.indexOf(id) >= 0;
      if (self.selectedId === id) p.setBorder(T.accent, 5);
      cont.add(p);
      cont.add(self.add.text(x + 70, y + 146, c.name + (placed ? ' (배치됨)' : ''), T.style(16, placed ? T.muted : T.text)).setOrigin(0.5, 0));
      var z = self.add.zone(x, y, 140, 140).setOrigin(0).setInteractive({ useHandCursor: true });
      z.on('pointerdown', function () { self.selectedId = (self.selectedId === id) ? null : id; self.render(); });
      cont.add(z);
      self.rosterViews.push(cont);
    });

    var ok = run.hasActiveFormation();
    this.enterBtn.setEnabled(ok);
    this.hint.setText(ok ? (this.selectedId ? '▶ 배치할 칸을 클릭하세요' : '') : '편성 칸에 캐릭터를 1마리 이상 배치해야 합니다.');
  },
});
