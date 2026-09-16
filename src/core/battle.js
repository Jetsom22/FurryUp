// =====================================================================
// 전투 엔진 - 규칙 세트 α-02 (전투 실험실 app.js 판정을 그대로 옮김)
// ---------------------------------------------------------------------
// 순수 로직. runTurn() 이 한 턴 동안 벌어진 일을 이벤트 배열로 돌려주고 씬이 연출한다.
//
// 유닛(unit):
//   { uid, id, name, role(5종), sourceRole, type(육/해/공), side:'ally'|'enemy', slot(1~5),
//     hp, maxHp, atk, def, spd (실험실 값, 패시브로 영구 변동), priority, grit(투지), shield,
//     statuses:{ mark:{sourceUid}, stunActions, poison:{sourceUid,stage}, bleed:{sourceUid}, current:{sourceUid} },
//     charge, fullness, howlBuff, duelBuffed, alive, active, passive, skill, boss }
//
// 이벤트: turnStart / order / cast(hits[], notes[]) / skip / death / heal / shield / status /
//         fight / bleed(독·출혈 틱) / turnEnd / end
// =====================================================================
(function (root) {
  var B = root.BALANCE;
  var R = B.RULES;

  var ROLE_MAP = { '추격자': '돌격자', '치유자': '보호자' };
  var FALLBACK_PASSIVE = { id: 'document_pending', name: '개별 패시브 미정', desc: '리메이크 문서에 개별 패시브가 아직 기재되지 않아 역할군 효과만 적용됩니다.' };
  function fallbackSkill() { return { id: 'prototype_damage', name: '실험용 공통 스킬', cost: R.skillCost, priority: 0, desc: '단일 대상에게 고정 피해 ' + R.skillDamage + '를 줍니다. (문서 미정 임시 규칙)', provisional: true }; }

  function makeUnit(base, side, slot, opts) {
    opts = opts || {};
    var maxHp = base.hp;
    var hp = (opts.hp !== undefined) ? opts.hp : maxHp;
    return {
      uid: side + '_' + slot,
      id: base.id, name: base.name, type: base.type || '육', typeName: base.typeName || base.type || '',
      role: ROLE_MAP[base.role] || base.role, sourceRole: base.sourceRole || base.role,
      side: side, slot: slot,
      hp: hp, maxHp: maxHp,
      atk: base.atk, def: base.def, spd: base.spd,
      priority: base.priority || 0,
      grit: 0, shield: 0,
      statuses: {},
      charge: 0, fullness: 0, howlBuff: 0, duelBuffed: false,
      alive: hp > 0, active: true,
      passive: base.passive || null,
      skill: base.skill || null,
      boss: !!base.boss,
      kills: 0,
    };
  }

  function Battle(allies, enemies, rng) {
    this.rng = rng;
    this.turn = 0;
    this.units = allies.concat(enemies);
    this.finished = false;
    this.result = null; // 'win' | 'lose'
    this.howlPending = { ally: false, enemy: false };
  }

  // ---------------- 조회 ----------------
  var other = function (side) { return side === 'ally' ? 'enemy' : 'ally'; };
  Battle.prototype.sideAlive = function (side) { return this.units.filter(function (u) { return u.side === side && u.alive; }); };
  Battle.prototype.alliesAlive = function () { return this.sideAlive('ally'); };
  Battle.prototype.enemiesAlive = function () { return this.sideAlive('enemy'); };
  Battle.prototype.byUid = function (uid) { return this.units.filter(function (u) { return u.uid === uid; })[0]; };
  function passiveOf(u) { return u.passive || FALLBACK_PASSIVE; }
  function skillOf(u) { return u.skill || fallbackSkill(); }
  function skillCost(u) { var s = skillOf(u); return (s.cost !== undefined && s.cost !== null) ? Number(s.cost) : R.skillCost; }
  Battle.prototype.teamHasPassive = function (side, id) { return this.sideAlive(side).some(function (u) { return passiveOf(u).id === id; }); };
  Battle.prototype.shieldStatBonus = function (u) { return (u.alive && u.shield > 0 && this.teamHasPassive(u.side, 'calm_sea')) ? 2 : 0; };
  Battle.prototype.effectiveAttack = function (u) { return u.atk + (u.howlBuff || 0) + this.shieldStatBonus(u); };
  Battle.prototype.effectiveSpeed = function (u) { return u.spd + this.shieldStatBonus(u); };
  Battle.prototype.effectiveStat = function (u, key) { return key === 'atk' ? this.effectiveAttack(u) : key === 'spd' ? this.effectiveSpeed(u) : u[key]; };
  Battle.prototype.skillReady = function (u) { return u.grit >= skillCost(u) && this.canUseSkill(u); };
  Battle.prototype.effectivePriority = function (u) { return u.priority + (this.skillReady(u) ? Number(skillOf(u).priority || 0) : 0); };

  Battle.prototype.canUseSkill = function (u) {
    var id = skillOf(u).id;
    var enemies = this.sideAlive(other(u.side));
    if (!enemies.length) return false;
    if (id === 'cut_throat') return enemies.some(function (e) { return e.statuses.mark && e.statuses.mark.sourceUid === u.uid; });
    if (id === 'bind') return enemies.some(function (e) { return !!e.statuses.current; });
    if (id === 'feast_time') return u.fullness > 0;
    return true;
  };

  // ---------------- 대상 (암살자: 마지막 슬롯 / 약자멸시·약자포식: 현재 HP 최저) ----------------
  Battle.prototype.selectTarget = function (actor, skillId) {
    var cands = this.sideAlive(other(actor.side));
    if (!cands.length) return null;
    var sorted = cands.slice().sort(function (a, b) { return a.slot - b.slot; });
    if (skillId === 'cut_throat') return sorted.filter(function (e) { return e.statuses.mark && e.statuses.mark.sourceUid === actor.uid; })[0] || null;
    if (skillId === 'bind') return sorted.filter(function (e) { return !!e.statuses.current; })[0] || null;
    if (skillId === 'weak_predation' || passiveOf(actor).id === 'despise_weak') return cands.slice().sort(function (a, b) { return a.hp - b.hp || a.slot - b.slot; })[0];
    return actor.role === '암살자' ? sorted[sorted.length - 1] : sorted[0];
  };
  Battle.prototype.pickTarget = function (actor) { return this.selectTarget(actor, null); };
  Battle.prototype.lowestHpAlly = function (side) {
    return this.sideAlive(side).sort(function (a, b) { return (a.hp / a.maxHp) - (b.hp / b.maxHp) || a.slot - b.slot; })[0] || null;
  };

  // ---------------- 보호막 / 회복 / 상태이상 ----------------
  Battle.prototype.addShield = function (target, amount, ev, who) {
    if (!target || !target.alive) return 0;
    var gained = Math.max(0, Math.floor(Number(amount) || 0));
    target.shield += gained;
    if (gained && ev) ev.push({ type: 'shield', uid: target.uid, amount: gained, log: (who ? who + ' · ' : '') + target.name + ' 보호막 +' + gained });
    return gained;
  };
  Battle.prototype.healUnit = function (source, target, amount, ev, label) {
    if (!target || !target.alive) return { healed: 0, shield: 0 };
    var req = Math.max(0, Math.floor(Number(amount) || 0));
    if (!req) return { healed: 0, shield: 0 };
    if (passiveOf(target).id === 'healing_to_shield') {   // 빛의 수호: 회복 -> 보호막
      var sh = this.addShield(target, req, ev, label);
      return { healed: 0, shield: sh };
    }
    var before = target.hp;
    target.hp = Math.min(target.maxHp, target.hp + req);
    var healed = target.hp - before;
    if (healed && ev) ev.push({ type: 'heal', uid: target.uid, amount: healed, hp: target.hp, log: (label ? label + ' · ' : '') + target.name + ' HP +' + healed });
    return { healed: healed, shield: 0 };
  };
  Battle.prototype.applyHarmfulStatus = function (target, type, payload, ev) {
    if (!target || !target.alive || passiveOf(target).id === 'status_immunity') return false;
    payload = payload || {};
    if (type === 'mark') {
      this.units.forEach(function (u) { if (u.statuses.mark && u.statuses.mark.sourceUid === payload.sourceUid) delete u.statuses.mark; });
      target.statuses.mark = { sourceUid: payload.sourceUid };
    } else if (type === 'stun') {
      target.statuses.stunActions = Math.max(Number(target.statuses.stunActions || 0), Number(payload.actions || 1));
    } else if (type === 'poison') {
      if (!target.statuses.poison) target.statuses.poison = { sourceUid: payload.sourceUid, stage: 0 };
    } else if (type === 'bleed') {
      if (!target.statuses.bleed) target.statuses.bleed = { sourceUid: payload.sourceUid };
    } else if (type === 'current') {
      if (!target.statuses.current) target.statuses.current = { sourceUid: payload.sourceUid };
    } else return false;
    if (ev) ev.push({ type: 'status', uid: target.uid, kw: type });
    return true;
  };

  // ---------------- 피해 ----------------
  Battle.prototype.applyDamage = function (target, raw, bypassShield) {
    var n = Number.isFinite(raw) ? Math.max(0, Math.floor(raw)) : target.hp + target.shield;
    var wasAlive = target.alive;
    var absorb = bypassShield ? 0 : Math.min(target.shield, n);
    target.shield -= absorb;
    var hpLoss = Math.max(0, n - absorb);
    var before = target.hp;
    target.hp = Math.max(0, target.hp - hpLoss);
    var hpDamage = before - target.hp;
    if (target.hp <= 0) target.alive = false;
    return { rawDamage: n, shieldAbsorb: absorb, hpDamage: hpDamage, hpBefore: before, hpAfter: target.hp, knockout: wasAlive && !target.alive };
  };
  Battle.prototype.damageWithPassives = function (actor, target, raw) {
    var adj = Math.max(0, Number(raw) || 0);
    if (passiveOf(actor).id === 'blood_excitement' && actor.type === target.type) adj *= 1.2;   // 피의 흥분
    if (target.statuses.mark && target.statuses.mark.sourceUid === actor.uid) adj *= 1.2;        // 표식
    return Math.floor(adj);
  };
  Battle.prototype.onKnockout = function (source, target, ev) {
    ev.push({ type: 'death', uid: target.uid, side: target.side, log: target.name + '이(가) 전투불능이 되었습니다.' });
    target.active = false;
    if (!source) return;
    source.kills += 1;
    if (source.role === '돌격자' && source.alive) {   // 역할군: 처치 회복 (최대 HP 5%)
      this.healUnit(source, source, Math.floor(source.maxHp * B.ROLE['돌격자'].healRate), ev, source.name + '의 역할군 회복');
    }
    if (this.teamHasPassive(source.side, 'howling')) this.howlPending[source.side] = true;   // 하울링
    if (passiveOf(source).id === 'kill_growth' && source.alive) {   // 배부름(네벨라)
      source.atk += 3; source.maxHp += R.hpMultiplier; source.hp += R.hpMultiplier;
      ev.push({ type: 'heal', uid: source.uid, amount: R.hpMultiplier, hp: source.hp, log: source.name + '의 배부름 · 공격력 +3 · 체력 +' + R.hpMultiplier });
    }
  };
  // 한 번의 타격: 회피 -> 패시브 배율 -> 보호막/HP -> 피격 패시브 -> 처치
  Battle.prototype.resolveHit = function (actor, target, raw, ev) {
    var hit = { targetUid: target.uid, dodged: false, damage: 0, absorbed: 0, targetHp: target.hp, targetShield: target.shield, killed: false };
    if (target.role === '교란자' && this.rng.chance(R.dodgeRate / 100)) { hit.dodged = true; return hit; }
    var adjusted = this.damageWithPassives(actor, target, raw);
    var r = this.applyDamage(target, adjusted, false);
    hit.damage = r.hpDamage; hit.absorbed = r.shieldAbsorb; hit.targetHp = target.hp; hit.targetShield = target.shield; hit.killed = r.knockout;
    if (passiveOf(target).id === 'charge_on_hit') target.charge += 1;       // 늪의 살갗
    if (passiveOf(target).id === 'amplified_armor') target.atk += 2;        // 증폭 장갑
    if (r.knockout) this.onKnockout(actor, target, ev);
    return hit;
  };
  Battle.prototype.basicDamage = function (actor, target) {
    return Math.max(R.minDamage, Math.floor(this.effectiveAttack(actor) * R.attackFactor - target.def));
  };

  // ---------------- 스테이지 시작 ----------------
  Battle.prototype.start = function () {
    var ev = [], self = this;
    ev.push({ type: 'log', log: '스테이지 시작!' });
    this.units.forEach(function (u) {
      if (u.alive && u.role === '보호자') self.addShield(u, Math.floor(u.maxHp * B.ROLE['보호자'].shieldRate), ev, '역할군 효과');
    });
    this.units.forEach(function (u) {   // 스며드는 물살(삼치): 편성 순서가 가장 낮은 적에게 물살
      if (!u.alive || passiveOf(u).id !== 'seeping_current') return;
      var t = self.sideAlive(other(u.side)).sort(function (a, b) { return b.slot - a.slot; })[0];
      if (!t) return;
      var ok = self.applyHarmfulStatus(t, 'current', { sourceUid: u.uid }, ev);
      ev.push({ type: 'log', log: ok ? u.name + '의 물살이 ' + t.name + '에게 적용되었습니다.' : t.name + '이(가) ' + u.name + '의 물살을 무효화했습니다.' });
    });
    var end = this.checkEnd(); if (end) ev.push(end);
    return ev;
  };

  Battle.prototype.checkEnd = function () {
    if (this.finished) return null;
    var a = this.alliesAlive().length, e = this.enemiesAlive().length;
    // 전투 기획서 p.6 플로우: "남은 적의 수 0" 을 먼저 판정 -> 동시 전투불능이면 클리어 (정비 화면에서 부활 필요)
    if (!e) { this.finished = true; this.result = 'win'; return { type: 'end', result: 'win', log: !a ? '양 팀 동시 전투불능 · 남은 적 0 판정 우선으로 스테이지 클리어' : '남은 적이 없습니다. 스테이지 클리어!' }; }
    if (!a) { this.finished = true; this.result = 'lose'; return { type: 'end', result: 'lose', log: '아군이 모두 쓰러졌습니다. 클리어 실패…' }; }
    return null;
  };

  // ---------------- 행동 순서: 우선도(스킬 우선도 포함) ↓ → 속도 ↓ → 슬롯 ↑ → 아군 우선 ----------------
  Battle.prototype.computeOrder = function () {
    var self = this;
    return this.units.filter(function (u) { return u.alive && u.active; }).sort(function (a, b) {
      return (self.effectivePriority(b) - self.effectivePriority(a)) || (self.effectiveSpeed(b) - self.effectiveSpeed(a)) || (a.slot - b.slot) || ((a.side === 'ally' ? 0 : 1) - (b.side === 'ally' ? 0 : 1));
    });
  };

  // ---------------- 턴 시작 처리 ----------------
  Battle.prototype.startTurnEffects = function (ev) {
    var self = this;
    this.units.forEach(function (u) { u.howlBuff = 0; });
    ['ally', 'enemy'].forEach(function (side) {
      if (!self.howlPending[side]) return;
      self.sideAlive(side).forEach(function (u) { u.howlBuff = 2; });
      self.howlPending[side] = false;
      ev.push({ type: 'log', log: (side === 'ally' ? '아군' : '적군') + '의 하울링 · 이번 턴 공격력 +2' });
    });
    if (this.turn === B.ROLE['결전자'].turn) {
      this.units.filter(function (u) { return u.alive && u.role === '결전자' && !u.duelBuffed; }).forEach(function (u) {
        u.atk += B.ROLE['결전자'].bonus; u.def += B.ROLE['결전자'].bonus; u.spd += B.ROLE['결전자'].bonus; u.duelBuffed = true;
        ev.push({ type: 'status', uid: u.uid, kw: 'duel', log: u.name + '의 후반 강화 · 공격·방어·속도 +' + B.ROLE['결전자'].bonus });
      });
    }
    this.units.filter(function (u) { return u.alive; }).forEach(function (u) {
      var pid = passiveOf(u).id;
      if (pid === 'shell_break' && self.turn % 3 === 0) { u.def -= 1; u.atk += 2; ev.push({ type: 'status', uid: u.uid, kw: 'shell', log: u.name + '의 갑각 깨기 · 방어 -1, 공격 +2' }); }
      if (pid === 'kings_leap') { u.spd += 1; ev.push({ type: 'status', uid: u.uid, kw: 'leap', log: u.name + '의 왕의 도약 · 속도 +1' }); }
      if (u.statuses.current && self.turn % 3 === 0) { var b4 = u.grit; u.grit = Math.max(0, u.grit - 1); ev.push({ type: 'fight', uid: u.uid, grit: u.grit, log: u.name + '의 물살 · 투지 ' + b4 + '→' + u.grit }); }
    });
  };

  // ---------------- 스킬 ----------------
  Battle.prototype.executeSkill = function (actor, skill, ev) {
    var self = this;
    var enemies = this.sideAlive(other(actor.side)).sort(function (a, b) { return a.slot - b.slot; });
    var allies = this.sideAlive(actor.side).sort(function (a, b) { return a.slot - b.slot; });
    var hits = [], notes = [];
    var attack = this.effectiveAttack(actor), speed = this.effectiveSpeed(actor);
    var hitOne = function (target, dmg) { if (!target) return null; var h = self.resolveHit(actor, target, dmg, ev); hits.push(h); return h; };
    var hitAll = function (dmg) { enemies.slice().forEach(function (t) { hitOne(t, dmg); }); };
    var name = function (u) { return u.name; };

    switch (skill.id) {
      case 'self_destruct': {   // 괴룸파: 적 전체 공격×차지, 자신 최대 HP 피해
        hitAll(attack * actor.charge);
        var sr = this.applyDamage(actor, actor.maxHp, false);
        ev.push({ type: 'heal', uid: actor.uid, amount: -sr.hpDamage, hp: actor.hp, log: actor.name + ' 자폭 피해 ' + sr.rawDamage });
        if (sr.knockout) this.onKnockout(null, actor, ev);
        break;
      }
      case 'weak_predation': {  // 네벨라: HP 최저 적 ×3, 피해의 30% 회복
        var h = hitOne(this.selectTarget(actor, skill.id), attack * 3);
        if (h && !h.dodged) this.healUnit(actor, actor, Math.floor(h.damage * 0.3), ev, '흡수');
        break;
      }
      case 'sea_poison':        // 누디안: 전체 ÷2, 30% 독
        enemies.slice().forEach(function (t) {
          var h = hitOne(t, Math.floor(attack / 2));
          if (!h || h.dodged || !t.alive) return;
          if (self.rng.chance(0.3)) { var ok = self.applyHarmfulStatus(t, 'poison', { sourceUid: actor.uid }, ev); notes.push(ok ? t.name + ' 독' : t.name + ' 독 면역'); }
        });
        break;
      case 'blessing': {        // 라피엘: HP 비율 최저 아군 10% 회복
        var t = this.lowestHpAlly(actor.side);
        if (t) this.healUnit(actor, t, Math.floor(t.maxHp * 0.1), ev, '축복');
        break;
      }
      case 'cut_throat': {      // 로데레: 표식 대상 ×3, 표식 제거
        var ct = this.selectTarget(actor, skill.id);
        hitOne(ct, attack * 3);
        if (ct && ct.statuses.mark && ct.statuses.mark.sourceUid === actor.uid) delete ct.statuses.mark;
        notes.push('표식 제거');
        break;
      }
      case 'hunt_start':        // 로페스: 적 전체 방어 -1
        enemies.forEach(function (t) { if (passiveOf(t).id === 'status_immunity') notes.push(t.name + ' 방어 감소 면역'); else { t.def -= 1; notes.push(t.name + ' 방어 -1'); } });
        break;
      case 'smash':             // 롭: 단일 ×3
        hitOne(this.selectTarget(actor, skill.id), attack * 3); break;
      case 'sea_wave':          // 루미: 해 타입 아군 보호막 10%
        allies.filter(function (u) { return u.type === '해'; }).forEach(function (t) { self.addShield(t, Math.floor(t.maxHp * 0.1), ev, '바다의 물결'); });
        break;
      case 'exhale':            // 마노: 다른 아군 투지 +1
        allies.filter(function (u) { return u.uid !== actor.uid; }).forEach(function (t) { t.grit += 1; ev.push({ type: 'fight', uid: t.uid, grit: t.grit, log: t.name + ' 투지 +1' }); });
        break;
      case 'full_barrage':      // 메카리스: 전체 ×1.5
        hitAll(attack * 1.5); break;
      case 'kings_leap_attack': // 버그킹: 단일 공격+속도
        hitOne(this.selectTarget(actor, skill.id), attack + speed); break;
      case 'molt':              // 벨제버브: 방-1 속-1 공+3
        actor.def -= 1; actor.spd -= 1; actor.atk += 3; notes.push('방어 -1 · 속도 -1 · 공격 +3'); break;
      case 'feast_time':        // 비대온: 배부름 수만큼 ×1.5
        enemies.slice(0, Math.min(actor.fullness, enemies.length)).forEach(function (t) { hitOne(t, attack * 1.5); });
        notes.push('배부름 ' + actor.fullness); break;
      case 'bind': {            // 삼치: 물살 대상 기절 1회
        var bt = this.selectTarget(actor, skill.id);
        var okb = this.applyHarmfulStatus(bt, 'stun', { sourceUid: actor.uid, actions: 1 }, ev);
        if (bt) notes.push(okb ? bt.name + ' 다음 행동 기절' : bt.name + ' 기절 면역');
        break;
      }
      case 'sharp_teeth': {     // 샤키아: 단일 ×2 + 출혈
        var st = this.selectTarget(actor, skill.id);
        var sh = hitOne(st, attack * 2);
        if (sh && !sh.dodged && st.alive) { var okS = this.applyHarmfulStatus(st, 'bleed', { sourceUid: actor.uid }, ev); notes.push(okS ? st.name + ' 출혈' : st.name + ' 출혈 면역'); }
        break;
      }
      case 'perseverance':      // 센주아나: 전체 ×1 + 아군 보호막 10
        hitAll(attack);
        allies.filter(function (u) { return u.alive; }).forEach(function (t) { self.addShield(t, 10, ev, '인내'); });
        break;
      case 'leaf_guard':        // 셰일: 아군 전체 보호막 20%
        allies.forEach(function (t) { self.addShield(t, Math.floor(t.maxHp * 0.2), ev, '잎새의 보호'); });
        break;
      default:                  // 문서 미정: 고정 피해
        hitOne(this.selectTarget(actor, skill.id), R.skillDamage); break;
    }
    return { hits: hits, notes: notes };
  };

  Battle.prototype.executeBasic = function (actor, ev) {
    var target = this.selectTarget(actor, null);
    if (!target) return { hits: [], notes: ['공격할 대상 없음'] };
    var hit = this.resolveHit(actor, target, this.basicDamage(actor, target), ev);
    var notes = [];
    if (!hit.dodged && target.alive && passiveOf(actor).id === 'mark_prey') {   // 교활한 쥐: 표식
      var ok = this.applyHarmfulStatus(target, 'mark', { sourceUid: actor.uid }, ev);
      notes.push(ok ? target.name + ' 표식' : target.name + ' 표식 면역');
    }
    return { hits: [hit], notes: notes };
  };

  Battle.prototype.afterDirectDamage = function (actor, total, ev) {
    if (total <= 0) return;
    var pid = passiveOf(actor).id;
    if (pid === 'inhale') { actor.grit += 1; ev.push({ type: 'fight', uid: actor.uid, grit: actor.grit, log: actor.name + '의 들숨 · 투지 +1' }); }
    if (pid === 'voracious_drain') { var r = this.healUnit(actor, actor, Math.floor(total * 0.2), ev, '마구 흡혈'); if (r.healed > 0) actor.fullness += 1; }
    if (pid === 'conviction') { var t = this.lowestHpAlly(actor.side); if (t) this.healUnit(actor, t, Math.floor(total * 0.2), ev, actor.name + '의 신념'); }
  };

  // ---------------- 한 턴 진행 ----------------
  Battle.prototype.runTurn = function () {
    var ev = [];
    if (this.finished) return ev;
    var self = this;
    this.turn += 1;
    ev.push({ type: 'turnStart', turn: this.turn, log: '--- 턴 ' + this.turn + ' ---' });
    this.startTurnEffects(ev);

    var order = this.computeOrder();
    ev.push({ type: 'order', uids: order.map(function (u) { return u.uid; }) });

    for (var i = 0; i < order.length; i++) {
      var actor = order[i];
      if (!actor.alive || this.finished) continue;

      if (actor.statuses.stunActions > 0) {
        actor.statuses.stunActions -= 1;
        ev.push({ type: 'skip', uid: actor.uid, log: actor.name + '은(는) 기절로 행동하지 못했습니다.' });
        continue;
      }

      var gritBefore = actor.grit;
      var mark = ev.length;   // cast 이벤트는 이 자리에 끼워 넣는다 (피해/사망 이벤트보다 앞)
      var skill = skillOf(actor);
      var usesSkill = this.skillReady(actor);
      if (usesSkill) actor.grit -= skillCost(actor);

      var outcome = usesSkill ? this.executeSkill(actor, skill, ev) : this.executeBasic(actor, ev);
      var total = outcome.hits.reduce(function (s, h) { return s + h.damage; }, 0);
      this.afterDirectDamage(actor, total, ev);
      actor.grit += R.gritGain;

      var hitTxt = outcome.hits.length ? outcome.hits.map(function (h) { var t = self.byUid(h.targetUid); return h.dodged ? t.name + ' 회피' : t.name + ' ' + h.damage + (h.absorbed ? '(보호막 ' + h.absorbed + ')' : '') + (h.killed ? ' 전투불능' : ''); }).join(', ') : '피해 없음';
      var cast = {
        type: 'cast', uid: actor.uid, skillName: usesSkill ? skill.name : '기본 공격', isUltimate: usesSkill, hits: outcome.hits, notes: outcome.notes, gritAfter: actor.grit,
        log: actor.name + ' · ' + (usesSkill ? '[' + skill.name + '] ' : '') + hitTxt + (outcome.notes.length ? ' · ' + outcome.notes.join(' · ') : '') + ' · 투지 ' + gritBefore + '→' + actor.grit,
      };
      ev.splice(mark, 0, cast);

      var end = this.checkEnd();
      if (end) { ev.push(end); return ev; }
    }

    this.finishTurnEffects(ev);
    var end2 = this.checkEnd();
    if (end2) { ev.push(end2); return ev; }
    if (this.turn >= R.maxTurns) { this.finished = true; this.result = 'lose'; ev.push({ type: 'end', result: 'lose', log: R.maxTurns + '턴 제한 · 무승부 (클리어 실패 처리)' }); return ev; }
    ev.push({ type: 'turnEnd', turn: this.turn });
    return ev;
  };

  // 턴 종료: 독(현재 HP 2→4→8%…) / 출혈(최대 HP 5%) / 생명친화
  Battle.prototype.finishTurnEffects = function (ev) {
    var self = this;
    this.units.filter(function (u) { return u.alive; }).forEach(function (u) {
      if (u.statuses.poison) {
        var st = u.statuses.poison, pct = 2 * Math.pow(2, st.stage);
        var src = st.sourceUid ? self.byUid(st.sourceUid) : null;
        var r = self.applyDamage(u, Math.floor(u.hp * pct / 100), true);
        st.stage += 1;
        ev.push({ type: 'bleed', uid: u.uid, amount: r.hpDamage, hp: u.hp, kw: 'poison', log: u.name + ' 독 ' + pct + '% · HP ' + r.hpBefore + '→' + r.hpAfter });
        if (r.knockout) self.onKnockout(src, u, ev);
      }
      if (u.alive && u.statuses.bleed) {
        var src2 = u.statuses.bleed.sourceUid ? self.byUid(u.statuses.bleed.sourceUid) : null;
        var r2 = self.applyDamage(u, Math.floor(u.maxHp * 0.05), true);
        ev.push({ type: 'bleed', uid: u.uid, amount: r2.hpDamage, hp: u.hp, kw: 'bleed', log: u.name + ' 출혈 5% · HP ' + r2.hpBefore + '→' + r2.hpAfter });
        if (r2.knockout) self.onKnockout(src2, u, ev);
      }
    });
    if (!this.alliesAlive().length || !this.enemiesAlive().length) return;   // 전멸이면 판정은 runTurn 에서
    this.units.filter(function (u) { return u.alive && passiveOf(u).id === 'life_affinity'; }).forEach(function (src) {
      self.sideAlive(src.side).filter(function (t) { return t.shield > 0; }).forEach(function (t) { self.healUnit(src, t, Math.floor(t.hp * 0.1), ev, src.name + '의 생명친화'); });
    });
  };

  Battle.prototype.runAll = function (maxTurns) {
    var all = this.start();
    var n = 0;
    while (!this.finished && n++ < (maxTurns || R.maxTurns)) all = all.concat(this.runTurn());
    if (!this.finished) { this.finished = true; this.result = 'lose'; all.push({ type: 'end', result: 'lose', log: '턴 제한 초과' }); }
    return all;
  };

  root.BattleEngine = { Battle: Battle, makeUnit: makeUnit, passiveOf: passiveOf, skillOf: skillOf, skillCost: skillCost, ROLE_MAP: ROLE_MAP };
})(typeof window !== 'undefined' ? window : globalThis);
