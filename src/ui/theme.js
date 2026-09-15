// =====================================================================
// 공용 UI 테마 / 헬퍼 (기획서 톤: 어두운 갈색 + 주황 포인트 + 크림 텍스트)
// =====================================================================
(function (root) {
  var T = {
    W: 1920, H: 1080,
    FONT: '"Noto Sans KR", "Noto Sans CJK KR", "Malgun Gothic", "Apple SD Gothic Neo", "Pretendard", sans-serif',
    bg: 0x221c14, bgCss: '#221c14',
    panel: 0x2d261b, panelDark: 0x1a1510,
    line: 0x6b5a3a, lineCss: '#6b5a3a',
    accent: 0xd8862c, accentCss: '#d8862c',
    accentDark: 0x9c5f1c,
    text: '#f0e6d2', muted: '#a89880', dim: '#6b5f4c',
    hpGreen: 0x6fbf5a, hpRed: 0xc94b4b, hpBack: 0x3a2f24, shield: 0x6ab0d8,
    danger: 0xb33a3a,
    ROLE_COLOR: { 암살자: '#e06060', 보호자: '#6fbf5a', 돌격자: '#e8a03a', 결전자: '#b78be6', 교란자: '#5fc6d6' },
    ROLE_HEX:   { 암살자: 0xe06060, 보호자: 0x6fbf5a, 돌격자: 0xe8a03a, 결전자: 0xb78be6, 교란자: 0x5fc6d6 },
  };

  // 16진 색을 밝게 (호버용)
  T.lighten = function (hex, amt) {
    var r = Math.min(255, ((hex >> 16) & 0xff) + amt), g = Math.min(255, ((hex >> 8) & 0xff) + amt), b = Math.min(255, (hex & 0xff) + amt);
    return (r << 16) | (g << 8) | b;
  };

  T.style = function (size, color, extra) {
    return Object.assign({ fontFamily: T.FONT, fontSize: size + 'px', color: color || T.text }, extra || {});
  };

  // 사각 패널 (테두리 + 채움)
  T.panel = function (scene, x, y, w, h, opts) {
    opts = opts || {};
    var g = scene.add.graphics();
    g.fillStyle(opts.fill !== undefined ? opts.fill : T.panel, opts.alpha !== undefined ? opts.alpha : 1);
    g.fillRoundedRect(x, y, w, h, opts.radius !== undefined ? opts.radius : 6);
    g.lineStyle(opts.lineWidth || 2, opts.line !== undefined ? opts.line : T.line, 1);
    g.strokeRoundedRect(x, y, w, h, opts.radius !== undefined ? opts.radius : 6);
    return g;
  };

  // 버튼: 컨테이너 { bg, label, setEnabled(), setLabel() }
  T.button = function (scene, x, y, w, h, label, onClick, opts) {
    opts = opts || {};
    var c = scene.add.container(x, y);
    var fill = opts.fill !== undefined ? opts.fill : T.accent;
    var bg = scene.add.graphics();
    var draw = function (color) {
      bg.clear();
      bg.fillStyle(color, 1); bg.fillRoundedRect(0, 0, w, h, opts.radius !== undefined ? opts.radius : 8);
      bg.lineStyle(2, opts.line !== undefined ? opts.line : T.line, 1); bg.strokeRoundedRect(0, 0, w, h, opts.radius !== undefined ? opts.radius : 8);
    };
    draw(fill);
    var txt = scene.add.text(w / 2, h / 2, label, T.style(opts.fontSize || 24, opts.color || T.text, { fontStyle: opts.bold === false ? 'normal' : 'bold' })).setOrigin(0.5);
    c.add([bg, txt]);
    var zone = scene.add.zone(0, 0, w, h).setOrigin(0).setInteractive({ useHandCursor: true });
    c.add(zone);
    c.enabled = true;
    zone.on('pointerover', function () { if (c.enabled) draw(T.lighten(fill, 28)); });
    zone.on('pointerout', function () { if (c.enabled) draw(fill); });
    zone.on('pointerdown', function (p, lx, ly, ev) { if (c.enabled && onClick) { if (ev && ev.stopPropagation) ev.stopPropagation(); onClick(); } });
    c.setEnabled = function (on) {
      c.enabled = on;
      draw(on ? fill : 0x3a3128);
      txt.setColor(on ? (opts.color || T.text) : T.dim);
      if (on) zone.setInteractive({ useHandCursor: true }); else zone.disableInteractive();
      return c;
    };
    c.setLabel = function (s) { txt.setText(s); return c; };
    c.label = txt;
    c.zone = zone;
    if (opts.enabled === false) c.setEnabled(false);
    return c;
  };

  // 원형 버튼 (정비 화면 좌측 메뉴)
  T.roundButton = function (scene, x, y, r, label, onClick, opts) {
    opts = opts || {};
    var c = scene.add.container(x, y);
    var g = scene.add.graphics();
    var fill = opts.fill !== undefined ? opts.fill : T.panel;
    var draw = function (color) { g.clear(); g.fillStyle(color, 1); g.fillCircle(0, 0, r); g.lineStyle(3, T.line, 1); g.strokeCircle(0, 0, r); };
    draw(fill);
    var txt = scene.add.text(0, 0, label, T.style(opts.fontSize || 24, T.text, { fontStyle: 'bold', align: 'center' })).setOrigin(0.5);
    c.add([g, txt]);
    var zone = scene.add.zone(0, 0, r * 2, r * 2).setInteractive({ useHandCursor: true });
    c.add(zone);
    c.enabled = true;
    zone.on('pointerover', function () { if (c.enabled) draw(T.lighten(fill, 24)); });
    zone.on('pointerout', function () { if (c.enabled) draw(fill); });
    zone.on('pointerdown', function () { if (c.enabled && onClick) onClick(); });
    c.setEnabled = function (on) { c.enabled = on; draw(on ? fill : 0x2a241c); txt.setColor(on ? T.text : T.dim); if (on) zone.setInteractive({ useHandCursor: true }); else zone.disableInteractive(); return c; };
    if (opts.enabled === false) c.setEnabled(false);
    return c;
  };

  // 캐릭터 얼굴 텍스처 키 (BootScene에서 생성)
  T.faceKey = function (id) { return id + '_face'; };

  // 정사각 초상화 카드: 컨테이너 { img, frame, setDim() }
  T.portrait = function (scene, x, y, size, id, opts) {
    opts = opts || {};
    var c = scene.add.container(x, y);
    var bg = scene.add.graphics();
    bg.fillStyle(opts.fill !== undefined ? opts.fill : T.panelDark, 1); bg.fillRect(0, 0, size, size);
    c.add(bg);
    var key = opts.full ? id : T.faceKey(id);
    if (scene.textures.exists(key)) {
      var img = scene.add.image(size / 2, size / 2, key);
      var s = Math.min(size / img.width, size / img.height);
      img.setScale(s);
      c.add(img);
      c.img = img;
    }
    var frame = scene.add.graphics();
    frame.lineStyle(opts.lineWidth || 3, opts.line !== undefined ? opts.line : T.line, 1); frame.strokeRect(0, 0, size, size);
    c.add(frame);
    c.frame = frame;
    c.size = size;
    c.setBorder = function (color, width) { frame.clear(); frame.lineStyle(width || 3, color, 1); frame.strokeRect(0, 0, size, size); return c; };
    c.setDim = function (on) { if (c.img) c.img.setTint(on ? 0x555555 : 0xffffff); return c; };
    return c;
  };

  // 팝업 오버레이(배경 클릭 차단)
  T.overlay = function (scene, alpha) {
    var r = scene.add.rectangle(0, 0, T.W, T.H, 0x000000, alpha === undefined ? 0.6 : alpha).setOrigin(0).setInteractive();
    return r;
  };

  // 잠깐 떠오르는 텍스트
  T.floatText = function (scene, x, y, str, color, size) {
    var t = scene.add.text(x, y, str, T.style(size || 34, color || '#ffffff', { fontStyle: 'bold', stroke: '#000000', strokeThickness: 5 })).setOrigin(0.5).setDepth(50);
    scene.tweens.add({ targets: t, y: y - 60, alpha: 0, duration: 800, ease: 'Cubic.easeOut', onComplete: function () { t.destroy(); } });
    return t;
  };

  // 화면 상단 공통 헤더 (씬 이름)
  T.header = function (scene, title, sub) {
    scene.add.text(60, 28, title, T.style(30, T.text, { fontStyle: 'bold' }));
    if (sub) scene.add.text(60, 70, sub, T.style(18, T.muted));
    var g = scene.add.graphics(); g.lineStyle(2, T.line, 1); g.lineBetween(60, 104, T.W - 60, 104);
  };

  root.Theme = T;
})(typeof window !== 'undefined' ? window : globalThis);
