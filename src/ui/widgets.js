// =====================================================================
// 아웃게임 공용 위젯 (UI 개편 와이어프레임 기준)
//   - 상단 바 / 뒤로가기 + 화면 제목 / 캐릭터 카드 / 스크롤 영역 / 캐릭터 정보 패널
//   - 사용 캐릭터(장착) 저장: registry + localStorage
// =====================================================================
(function (root) {
  var T = root.Theme;
  var Wd = {};

  // ---- 사용 캐릭터 저장 ----
  var STORE_KEY = 'furryup.equipped';
  Wd.getEquipped = function (scene) {
    var id = scene.registry.get('equippedId');
    if (!id) { try { id = root.localStorage.getItem(STORE_KEY); } catch (e) { id = null; } }
    var c = id && root.CHARACTER_BY_ID[id];
    if (!c || c.locked) { c = root.CHARACTERS.filter(function (x) { return !x.locked; })[0]; }
    scene.registry.set('equippedId', c.id);
    return c;
  };
  Wd.setEquipped = function (scene, id) {
    scene.registry.set('equippedId', id);
    try { root.localStorage.setItem(STORE_KEY, id); } catch (e) { /* 저장 불가 환경 */ }
  };

  // ---- 스탯 바 정규화용 최대값 ----
  Wd.statMax = function () {
    if (Wd._max) return Wd._max;
    var m = { hp: 1, atk: 1, def: 1, spd: 1 };
    root.CHARACTERS.forEach(function (c) { ['hp', 'atk', 'def', 'spd'].forEach(function (k) { m[k] = Math.max(m[k], c.pts[k]); }); });
    Wd._max = m;
    return m;
  };

  // 로그라인 (데이터에 없으면 임시 문장)
  Wd.logline = function (c) {
    return c.logline || (c.species + ' 출신의 ' + c.typeName + ' 타입 ' + c.role + '. ' + root.BALANCE.ROLE[c.role].desc);
  };

  // ---- 뒤로가기 + 화면 제목 바 ----
  Wd.screenHeader = function (scene, title, onBack) {
    var W = T.W;
    var back = T.button(scene, 30, 22, 170, 60, '◀ 뒤로가기', onBack, { fill: T.panel, fontSize: 22 });
    T.panel(scene, 230, 22, W - 260, 60, { fill: T.panelDark });
    scene.add.text(230 + (W - 260) / 2, 52, title, T.style(30, T.text, { fontStyle: 'bold' })).setOrigin(0.5);
    return back;
  };

  // ---- 로비 상단 바: 아이콘 / 재화(자리만, 0 고정) / 설정 ----
  Wd.topBar = function (scene, onSettings) {
    var W = T.W;
    var g = scene.add.graphics();
    g.fillStyle(T.panelDark, 1); g.fillRect(0, 0, W, 90);
    g.lineStyle(2, T.line, 1); g.lineBetween(0, 90, W, 90);
    // 좌측 아이콘 자리
    T.panel(scene, 24, 15, 60, 60, { fill: T.panel, radius: 10 });
    scene.add.text(54, 45, '🐾', T.style(30, T.text)).setOrigin(0.5);
    scene.add.text(100, 45, '퍼리업', T.style(26, T.text, { fontStyle: 'bold' })).setOrigin(0, 0.5);
    // 재화: 아이콘 + 숫자 (자리만 표시, 0 고정)
    var cx = W - 520;
    T.panel(scene, cx, 22, 300, 46, { fill: T.panel, radius: 23 });
    var coin = scene.add.graphics();
    coin.fillStyle(T.accent, 1); coin.fillCircle(cx + 24, 45, 16);
    coin.lineStyle(2, 0xf3c46b, 1); coin.strokeCircle(cx + 24, 45, 16);
    scene.add.text(cx + 24, 45, 'G', T.style(16, '#3a2a10', { fontStyle: 'bold' })).setOrigin(0.5);
    scene.add.text(cx + 280, 45, '0', T.style(24, T.text, { fontStyle: 'bold' })).setOrigin(1, 0.5);
    // 설정
    return T.button(scene, W - 190, 20, 160, 50, '⚙ 설정', onSettings, { fill: T.panel, fontSize: 22 });
  };

  // ---- 스크롤 영역 (마스크 + 우측 스크롤바 + 휠) ----
  //   반환: 컨테이너 { setContentHeight(h), setScroll(v), contains(pointer) }
  Wd.scrollArea = function (scene, x, y, w, h, opts) {
    opts = opts || {};
    var c = scene.add.container(x, y);
    var maskShape = scene.make.graphics({ add: false });
    maskShape.fillStyle(0xffffff, 1); maskShape.fillRect(x, y, w, h);
    c.setMask(maskShape.createGeometryMask());

    var barX = x + w + (opts.barGap !== undefined ? opts.barGap : 20), barW = 16;
    var track = scene.add.graphics();
    track.fillStyle(T.panelDark, 1); track.fillRoundedRect(barX, y, barW, h, 8);
    track.lineStyle(2, T.line, 1); track.strokeRoundedRect(barX, y, barW, h, 8);
    var thumb = scene.add.graphics();
    var thumbZone = scene.add.zone(barX, y, barW, h).setOrigin(0).setInteractive({ useHandCursor: true, draggable: true });

    var scroll = 0, contentH = h, maxScroll = 0, thumbH = h;
    var drawThumb = function () {
      thumb.clear();
      thumbH = maxScroll > 0 ? Math.max(48, Math.floor(h * h / contentH)) : h;
      var ty = y + (maxScroll > 0 ? (scroll / maxScroll) * (h - thumbH) : 0);
      thumb.fillStyle(maxScroll > 0 ? T.accent : T.line, 1); thumb.fillRoundedRect(barX + 2, ty, barW - 4, thumbH, 6);
      thumbZone.setPosition(barX, ty).setSize(barW, thumbH);
    };
    c.setScroll = function (v) {
      scroll = Math.max(0, Math.min(maxScroll, v));
      c.y = y - scroll;
      drawThumb();
      // 마스크 밖으로 나간 카드의 클릭 영역은 끈다 (마스크는 히트 테스트에 영향을 주지 않으므로)
      c.list.forEach(function (child) {
        if (!child.zone || !child.zone.input) return;
        var top = c.y + child.y, ch = child.h || 0;
        var vt = Math.max(0, y - top), vb = Math.min(ch, y + h - top);   // 카드 로컬 좌표에서 보이는 구간
        child.zone.input.enabled = vb > vt;
        if (vb > vt) child.zone.input.hitArea.setTo(0, vt, child.w || child.zone.width, vb - vt);
      });
    };
    c.setContentHeight = function (ch) {
      contentH = Math.max(h, ch);
      maxScroll = contentH - h;
      c.setScroll(scroll);
    };
    c.contains = function (p) { return p.x >= x && p.x <= x + w && p.y >= y && p.y <= y + h; };
    c.viewport = { x: x, y: y, w: w, h: h };

    scene.input.on('wheel', function (pointer, objs, dx, dy) {
      if (pointer.x >= x && pointer.x <= barX + barW && pointer.y >= y && pointer.y <= y + h) c.setScroll(scroll + dy);
    });
    var dragStart = null;
    thumbZone.on('dragstart', function (pointer) { dragStart = { py: pointer.y, s: scroll }; });
    thumbZone.on('drag', function (pointer) {
      if (!dragStart || maxScroll <= 0) return;
      var ratio = maxScroll / Math.max(1, h - thumbH);
      c.setScroll(dragStart.s + (pointer.y - dragStart.py) * ratio);
    });
    // 트랙 클릭: 그 위치로 점프
    var trackZone = scene.add.zone(barX, y, barW, h).setOrigin(0).setInteractive();
    trackZone.on('pointerdown', function (pointer) {
      if (maxScroll <= 0) return;
      var r = (pointer.y - y - thumbH / 2) / Math.max(1, h - thumbH);
      c.setScroll(r * maxScroll);
    });
    scene.children.bringToTop(thumbZone);
    c.setContentHeight(h);
    return c;
  };

  // ---- 캐릭터 카드 (초상 + 이름 띠 + 모서리 아이콘 + 잠금 표시) ----
  //   반환: 컨테이너 { c, zone, setSelected(on), setHover(on) }
  Wd.charCard = function (scene, x, y, w, h, ch, opts) {
    opts = opts || {};
    var card = scene.add.container(x, y);
    var stripH = opts.stripH || 60;
    var imgH = h - stripH;
    var g = scene.add.graphics();
    var drawFrame = function (color, width) {
      g.clear();
      g.fillStyle(T.panelDark, 1); g.fillRoundedRect(0, 0, w, h, 10);
      g.fillStyle(ch.locked ? 0x2a2420 : T.panel, 1); g.fillRoundedRect(0, imgH, w, stripH, { tl: 0, tr: 0, bl: 10, br: 10 });
      g.lineStyle(width, color, 1); g.strokeRoundedRect(0, 0, w, h, 10);
    };
    drawFrame(T.line, 3);
    card.add(g);
    var key = T.faceKey(ch.id);
    if (scene.textures.exists(key)) {
      var img = scene.add.image(w / 2, imgH / 2, key);
      var s = Math.min((w - 12) / img.width, (imgH - 12) / img.height);
      img.setScale(s);
      if (ch.locked) img.setTint(0x555555);
      card.add(img);
      card.img = img;
    }
    // 이름 띠
    card.add(scene.add.text(w / 2, imgH + stripH / 2 - (opts.sub ? 10 : 0), ch.name, T.style(ch.name.length > 6 ? 18 : 22, ch.locked ? T.dim : T.text, { fontStyle: 'bold' })).setOrigin(0.5));
    if (opts.sub) card.add(scene.add.text(w / 2, imgH + stripH / 2 + 14, ch.role + ' · ' + ch.typeName, T.style(14, ch.locked ? T.dim : T.ROLE_COLOR[ch.role])).setOrigin(0.5));
    // 모서리 아이콘: 역할군 색 원 + 타입 글자
    var badge = scene.add.graphics();
    badge.fillStyle(ch.locked ? 0x444444 : T.ROLE_HEX[ch.role], 1); badge.fillCircle(w - 26, 26, 20);
    badge.lineStyle(2, 0x000000, 0.5); badge.strokeCircle(w - 26, 26, 20);
    card.add(badge);
    card.add(scene.add.text(w - 26, 26, ch.typeName, T.style(18, '#1a1510', { fontStyle: 'bold' })).setOrigin(0.5));
    // 잠금: 어둡게 + 쇠사슬 + 자물쇠
    if (ch.locked) {
      var lock = scene.add.graphics();
      lock.fillStyle(0x000000, 0.45); lock.fillRoundedRect(0, 0, w, imgH, { tl: 10, tr: 10, bl: 0, br: 0 });
      lock.lineStyle(10, 0x8a8a8a, 1);
      lock.lineBetween(-4, imgH * 0.35, w + 4, imgH * 0.75);
      lock.lineBetween(-4, imgH * 0.75, w + 4, imgH * 0.35);
      lock.lineStyle(3, 0x3a3a3a, 1);
      for (var i = 0; i < 9; i++) {
        var t = i / 8;
        lock.strokeCircle(t * w, imgH * 0.35 + t * imgH * 0.4, 7);
        lock.strokeCircle(t * w, imgH * 0.75 - t * imgH * 0.4, 7);
      }
      lock.fillStyle(0x1a1510, 0.9); lock.fillRoundedRect(w / 2 - 40, imgH / 2 - 40, 80, 80, 12);
      lock.lineStyle(3, 0x8a8a8a, 1); lock.strokeRoundedRect(w / 2 - 40, imgH / 2 - 40, 80, 80, 12);
      card.add(lock);
      card.add(scene.add.text(w / 2, imgH / 2, '🔒', T.style(40, T.text)).setOrigin(0.5));
    }
    var zone = scene.add.zone(0, 0, w, h).setOrigin(0).setInteractive({ useHandCursor: !ch.locked });
    card.add(zone);
    card.zone = zone;
    card.ch = ch;
    card.selected = false; card.hovered = false;
    var redraw = function () {
      if (card.selected) drawFrame(T.accent, 5);
      else if (card.hovered && !ch.locked) drawFrame(T.lighten(T.line, 60), 4);
      else drawFrame(T.line, 3);
    };
    card.setSelected = function (on) { card.selected = on; redraw(); return card; };
    card.setHover = function (on) { card.hovered = on; redraw(); return card; };
    card.w = w; card.h = h; card.imgH = imgH;
    return card;
  };

  // ---- 캐릭터 정보 패널 (로비 / 캐릭터 선택 공용) ----
  //   초상, 이름/역할군, 로그라인, 스킬(아이콘+설명), 패시브(아이콘+설명), 스탯 바 체/공/방/속
  //   반환: 컨테이너 { setCharacter(ch), clear() }  (h 는 820 이상 권장)
  Wd.infoPanel = function (scene, x, y, w, h, opts) {
    opts = opts || {};
    var c = scene.add.container(0, 0);
    c.add(T.panel(scene, x, y, w, h, { fill: T.panelDark, radius: 10 }));
    c.add(scene.add.text(x + 20, y + 14, opts.title || '캐릭터 정보', T.style(20, T.muted, { fontStyle: 'bold' })));
    var line = scene.add.graphics(); line.lineStyle(2, T.line, 1); line.lineBetween(x + 20, y + 46, x + w - 20, y + 46);
    c.add(line);

    // 초상 자리 (compact: 좁은 패널용 - 초상·글자·간격을 줄인다)
    var cp = !!opts.compact;
    var M = cp ? {
      pSize: 110, name: 22, role: 16, meta: 12, logline: 12, icon: 40, bTitle: 14, bDesc: 12, blockGap: 100, blockTop: 70, barTop: 275, barH: 16, barGap: 34, barLabel: 15, barVal: 13, barX: 46, barR: 70,
    } : {
      pSize: 200, name: 32, role: 22, meta: 16, logline: 16, icon: 60, bTitle: 19, bDesc: 15, blockGap: 122, blockTop: 92, barTop: 340, barH: 22, barGap: 44, barLabel: 20, barVal: 18, barX: 70, barR: 150,
    };
    var pSize = M.pSize, px = x + 20, py = y + 64;
    c.add(T.panel(scene, px, py, pSize, pSize, { fill: T.panel, radius: 8 }));
    var portrait = null;
    var tx = px + pSize + (cp ? 14 : 24), tw = w - pSize - (cp ? 54 : 64);
    var name = scene.add.text(tx, py + (cp ? 4 : 10), '', T.style(M.name, T.text, { fontStyle: 'bold', wordWrap: { width: tw } }));
    var role = scene.add.text(tx, py + (cp ? 40 : 62), '', T.style(M.role, T.text, { fontStyle: 'bold' }));
    var meta = scene.add.text(tx, py + (cp ? 66 : 100), '', T.style(M.meta, T.muted, { lineSpacing: 4, wordWrap: { width: tw } }));
    var logline = scene.add.text(x + 20, py + pSize + (cp ? 10 : 16), '', T.style(M.logline, T.muted, { lineSpacing: 4, wordWrap: { width: w - 40 } }));
    c.add([name, role, meta, logline]);

    // 스킬 / 패시브 블록 (컨테이너에 담아 setCharacter 뒤에 위에서부터 흘려 배치)
    var makeBlock = function (label, color) {
      var bc = scene.add.container(0, 0);
      var icon = scene.add.graphics();
      icon.fillStyle(color, 1); icon.fillRoundedRect(x + 20, 0, M.icon, M.icon, M.icon * 0.2);
      icon.lineStyle(2, 0x000000, 0.4); icon.strokeRoundedRect(x + 20, 0, M.icon, M.icon, M.icon * 0.2);
      bc.add(icon);
      bc.add(scene.add.text(x + 20 + M.icon / 2, M.icon / 2, label, T.style(cp ? 13 : 22, '#1a1510', { fontStyle: 'bold' })).setOrigin(0.5));
      var t = scene.add.text(x + 36 + M.icon, -2, '', T.style(M.bTitle, T.text, { fontStyle: 'bold', wordWrap: { width: w - 56 - M.icon } }));
      var d = scene.add.text(x + 36 + M.icon, (cp ? 20 : 28), '', T.style(M.bDesc, T.muted, { lineSpacing: 3, wordWrap: { width: w - 56 - M.icon } }));
      bc.add([t, d]);
      c.add(bc);
      bc.title = t; bc.desc = d;
      bc.height = function () { return Math.max(M.icon, d.y + d.height); };
      return bc;
    };
    var skillT = makeBlock('스킬', T.accent);
    var passT = makeBlock('패시브', 0x6ab0d8);

    // 스탯 바 (컨테이너)
    var barsC = scene.add.container(0, 0);
    var barX = x + M.barX, barW = w - M.barX - M.barR, barH = M.barH;
    var bars = {};
    [['hp', '체'], ['atk', '공'], ['def', '방'], ['spd', '속']].forEach(function (row, i) {
      var by = i * M.barGap;
      barsC.add(scene.add.text(x + 24, by + barH / 2, row[1], T.style(M.barLabel, T.text, { fontStyle: 'bold' })).setOrigin(0, 0.5));
      var back = scene.add.graphics(); back.fillStyle(T.hpBack, 1); back.fillRoundedRect(barX, by, barW, barH, 6);
      var fill = scene.add.graphics();
      var val = scene.add.text(x + w - 24, by + barH / 2, '', T.style(M.barVal, T.text, { fontStyle: 'bold' })).setOrigin(1, 0.5);
      barsC.add([back, fill, val]);
      bars[row[0]] = { fill: fill, val: val, y: by };
    });
    c.add(barsC);
    var gapY = cp ? 14 : 22;
    var reflow = function () {
      var yy = Math.max(py + pSize, meta.y + meta.height) + (cp ? 10 : 16);
      logline.setY(yy); yy += logline.height + gapY;
      skillT.setY(yy); yy += skillT.height() + gapY;
      passT.setY(yy); yy += passT.height() + gapY;
      barsC.setY(Math.min(yy, y + h - 4 * M.barGap - 16));
    };
    var BAR_COLOR = { hp: T.hpGreen, atk: 0xe06060, def: 0x6ab0d8, spd: 0xe8c04a };

    c.setCharacter = function (ch, st) {   // st: run.charStats(id) (레벨 반영 능력치, 없으면 기본값)
      var pts = st ? st.pts : ch.pts, maxHp = st ? st.hp : ch.hp;
      if (portrait) portrait.destroy();
      portrait = T.portrait(scene, px, py, pSize, ch.id, { full: true, fill: T.panel, line: T.accent });
      c.add(portrait);
      name.setText(ch.name);
      role.setText(ch.role + (ch.sourceRole !== ch.role ? '  (문서: ' + ch.sourceRole + ')' : '')).setColor(T.ROLE_COLOR[ch.role]);
      meta.setText(ch.typeName + ' 타입 · ' + ch.species + (st ? ' · LV. ' + st.level + (st.level < root.BALANCE.LEVEL.max ? ' (EXP ' + st.exp + '/' + st.expNext + ')' : ' (MAX)') : '') + '\n최대 HP ' + maxHp + ' · 능력치 합계 ' + (pts.hp + pts.atk + pts.def + pts.spd));
      logline.setText(Wd.logline(ch));
      var RR = root.BALANCE.RULES;
      if (ch.skill) { skillT.title.setText(ch.skill.name + '  [투지 ' + ch.skill.cost + (ch.skill.priority ? ' · 우선도 +' + ch.skill.priority : '') + ']'); skillT.desc.setText(ch.skill.desc); }
      else { skillT.title.setText('공통 스킬 (문서 미정)'); skillT.desc.setText('투지 ' + RR.skillCost + ' 이상이면 적 하나에게 고정 피해 ' + RR.skillDamage + '.'); }
      if (ch.passive) { passT.title.setText(ch.passive.name); passT.desc.setText(ch.passive.desc); }
      else { passT.title.setText('역할군 효과 (문서 미정)'); passT.desc.setText(root.BALANCE.ROLE[ch.role].desc); }
      var m = Wd.statMax();
      Object.keys(bars).forEach(function (k) {
        var b = bars[k], v = pts[k];
        b.fill.clear(); b.fill.fillStyle(BAR_COLOR[k], 1); b.fill.fillRoundedRect(barX, b.y, Math.max(8, Math.min(barW, barW * v / m[k])), barH, 6);
        b.val.setText(k === 'hp' ? v + ' (HP ' + maxHp + ')' : String(v));
      });
      reflow();
      c.setVisible(true);
      return c;
    };
    c.clear = function () {
      if (portrait) { portrait.destroy(); portrait = null; }
      name.setText('캐릭터를 선택하세요'); role.setText(''); meta.setText(''); logline.setText('');
      skillT.title.setText(''); skillT.desc.setText(''); passT.title.setText(''); passT.desc.setText('');
      Object.keys(bars).forEach(function (k) { bars[k].fill.clear(); bars[k].val.setText(''); });
      reflow();
      return c;
    };
    c.clear();
    return c;
  };

  // ---- 스테이지 진행 바 (전투 / 상점 공용) ----
  //   ▲ 스토리  ● 일반  ○ 이벤트  ◆ 중간보스  고양이 = 보스.  현재 위치는 빨간 점 + "현 위치 ▼"
  Wd.stageTrack = function (scene, x, y, w, h, run) {
    var c = scene.add.container(0, 0);
    c.add(T.panel(scene, x, y, w, h, { fill: T.panelDark, radius: 8 }));
    c.add(scene.add.text(x + 16, y + 10, '스테이지', T.style(20, T.text, { fontStyle: 'bold' })));
    var n = run.stages.length;
    var left = x + 50, right = x + w - 70, ly = y + h - 44;
    var step = (right - left) / (n - 1);
    var g = scene.add.graphics();
    g.lineStyle(2, 0x8a7a5a, 1); g.lineBetween(left, ly, right, ly);
    c.add(g);
    run.stages.forEach(function (s, i) {
      var px = left + step * i;
      var cur = i === run.stageIndex, done = i < run.stageIndex;
      var m = scene.add.graphics();
      var col = cur ? 0xe03030 : (done ? 0x6b5f4c : 0xf0e6d2);
      if (s.type === '보스') {
        // 고양이 머리
        m.fillStyle(cur ? 0xe03030 : 0xf0e6d2, 1);
        m.fillCircle(px + 14, ly - 2, 18);
        m.fillTriangle(px - 2, ly - 8, px + 2, ly - 26, px + 12, ly - 14);
        m.fillTriangle(px + 30, ly - 8, px + 26, ly - 26, px + 16, ly - 14);
      } else if (s.type === '스토리') {
        m.fillStyle(col, 1); m.fillTriangle(px, ly + 7, px - 8, ly + 7 - 14, px + 8, ly + 7 - 14);
      } else if (s.type === '이벤트') {
        m.fillStyle(T.panelDark, 1); m.fillCircle(px, ly, 7); m.lineStyle(2, col, 1); m.strokeCircle(px, ly, 7);
        if (cur) { m.fillStyle(col, 1); m.fillCircle(px, ly, 7); }
      } else if (s.type === '중간보스') {
        m.fillStyle(col, 1); m.fillTriangle(px, ly - 10, px + 10, ly, px, ly + 10); m.fillTriangle(px, ly - 10, px - 10, ly, px, ly + 10);
      } else {
        m.fillStyle(col, 1); m.fillCircle(px, ly, 7);
      }
      c.add(m);
      if (i < 4) c.add(scene.add.text(px, ly + 14, run.chapter + '-' + s.no + (i === 3 ? ' …' : ''), T.style(12, T.muted)).setOrigin(0.5, 0));
      if (cur) {
        c.add(scene.add.text(px, ly - 40, '현 위치', T.style(12, T.text, { fontStyle: 'bold' })).setOrigin(0.5, 0));
        c.add(scene.add.text(px, ly - 24, '▼', T.style(14, T.text)).setOrigin(0.5, 0));
      }
    });
    return c;
  };

  // ---- 상태이상 / 버프 칩 한 줄 (전투 카드 위) ----
  Wd.statusChips = function (u) {
    var st = u.statuses || {}, chips = [];
    if (u.duelBuffed || u.fullness > 0 || u.howlBuff > 0) chips.push({ t: '▲' + (u.fullness > 0 ? '배부름' : u.howlBuff > 0 ? '하울링' : '결전'), c: 0x6fbf5a });
    if (st.mark) chips.push({ t: '▼표식', c: 0xe06060 });
    if (st.stunActions > 0) chips.push({ t: '기절', c: 0xc0c0ff });
    if (st.poison) chips.push({ t: '독' + (st.poison.stage ? st.poison.stage + 1 : ''), c: 0xb070e0 });
    if (st.bleed) chips.push({ t: '출혈', c: 0xe06060 });
    if (st.current) chips.push({ t: '▼물살', c: 0x5fc6d6 });
    if (u.charge > 0) chips.push({ t: '차지' + u.charge, c: 0xe8a03a });
    return chips;
  };

  // ---- 아이템 아이콘 (임시: 분류별 색 사각형 + 글자) ----
  Wd.itemIcon = function (scene, cx, cy, size, itemId, dim) {
    var it = root.BALANCE.ITEMS[itemId];
    var c = scene.add.container(0, 0);
    var col = it.exp ? (it.exp >= 30 ? 0xe8c04a : 0x6fbf5a) : 0x5fc6d6;
    var g = scene.add.graphics();
    g.fillStyle(dim ? 0x444444 : col, 1); g.fillRoundedRect(cx - size / 2, cy - size / 2, size, size, size * 0.15);
    g.lineStyle(3, 0x000000, 0.4); g.strokeRoundedRect(cx - size / 2, cy - size / 2, size, size, size * 0.15);
    c.add(g);
    c.add(scene.add.text(cx, cy - size * 0.08, it.exp ? 'EXP' : 'HP', T.style(Math.floor(size * 0.3), '#1a1510', { fontStyle: 'bold' })).setOrigin(0.5));
    c.add(scene.add.text(cx, cy + size * 0.25, it.exp ? '+' + it.exp : '+' + Math.round(it.healRate * 100) + '%', T.style(Math.floor(size * 0.18), '#1a1510', { fontStyle: 'bold' })).setOrigin(0.5));
    return c;
  };

  root.Widgets = Wd;
})(typeof window !== 'undefined' ? window : globalThis);
