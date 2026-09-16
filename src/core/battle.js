// =====================================================================
// 전투 엔진 (전투 기획서 p.4~p.8 흐름 + 로켓몬스터 원본 판정 규칙)
// ---------------------------------------------------------------------
// 순수 로직. runTurn() 이 한 턴 동안 벌어진 일을 이벤트 배열로 돌려주고 씬이 연출한다.
//
// 유닛(unit):
//   { uid, id, name, role, roleCode, type, side:'ally'|'enemy', slot(편성 순서 1~5),
//     hp, maxHp, atk, def, mag, spd (원본 포인트), priority, fight(투지), shield, shieldTurns,
//     alive, active, skills:{basic:[..], ultimate}, statuses:[{kw, turns, ...}], boss }
//
// 이벤트 종류:
//   turnStart / order / cast(공격·기술 사용, hits[]) / skip(기절) / death / heal / shield /
//   status / fight / bleed / turnEnd / end
// =====================================================================
(function (root) {
  var B = root.BALANCE;
  var R = root.RULES;

  var TYPE_BEATS = { LAND: R['TYPE_BEATS.LAND'], SEA: R['TYPE_BEATS.SEA'], AIR: R['TYPE_BEATS.AIR'] };
  var STAT_KO = { atk: '공격력', def: '물리 방어', mag: '마법 방어', spd: '속도', hp: '체력' };

  // 프로토타입에서 판정에 반영하는 효과 키워드 (나머지는 설명만 표시)
  var SUPPORTED = ['heal', 'shield', 'drain', 'multihit', 'charge', 'gift', 'siphon', 'recoil', 'toll', 'execute', 'desperate', 'swell', 'zeal',
    'pierce', 'siege', 'bypass', 'avenge', 'boost', 'bleed', 'mark', 'stun', 'silence', 'taunt', 'haste', 'retire'];

  function makeUnit(base, side, slot, opts) {
    opts = opts || {};
    var hp = (opts.hp !== undefined) ? opts.hp : base.hp;
    return {
      uid: side + '_' + slot,
      id: base.id, name: base.name, role: base.role, roleCode: base.roleCode, type: base.type || 'LAND', typeName: base.typeName || '',
      side: side, slot: slot,
      hp: hp, maxHp: base.hp,
      atk: base.atk, def: base.def, mag: base.mag || 0, spd: base.spd,
      priority: base.priority || 0,
      fight: B.FIGHT_START, shield: 0, shieldTurns: Infinity,
      alive: hp > 0, active: true,
      skills: base.skills || { basic: [], ultimate: null, passive: null },
      skillName: base.skill || (base.skills && base.skills.ultimate ? base.skills.ultimate.name : '스킬'),
      statuses: [],
      boss: !!base.boss,
    };
  }

  function Battle(allies, enemies, rng) {
    this.rng = rng;
    this.turn = 0;
    this.units = allies.concat(enemies);
    this.finished = false;
    this.result = null; // 'win' | 'lose'
  }

  // ---------------- 조회 ----------------
  Battle.prototype.alliesAlive = function () { return this.units.filter(function (u) { return u.side === 'ally' && u.alive; }); };
  Battle.prototype.enemiesAlive = function () { return this.units.filter(function (u) { return u.side === 'enemy' && u.alive; }); };
  Battle.prototype.sideAlive = function (side) { return this.units.filter(function (u) { return u.side === side && u.alive; }); };
  Battle.prototype.byUid = function (uid) { return this.units.filter(function (u) { return u.uid === uid; })[0]; };
  function hpRatio(u) { return u.maxHp > 0 ? u.hp / u.maxHp : 0; }
  function hasStatus(u, kw) { return u.statuses.some(function (s) { return s.kw === kw; }); }
  function statusSum(u, kw, key, filter) { return u.statuses.filter(function (s) { return s.kw === kw && (!filter || filter(s)); }).reduce(function (a, s) { return a + (s[key] || 0); }, 0); }

  // 능력치 (각성/쇠약 + 결전자 보정)
  Battle.prototype.effectiveStat = function (u, key) {
    var v = u[key] + statusSum(u, 'boost', 'amount', function (s) { return s.stat === key; });
    if (u.role === '결전자' && this.turn >= B.ROLE['결전자'].turn && (key === 'atk' || key === 'def' || key === 'mag')) v += B.ROLE['결전자'].statBonus;
    return Math.max(0, v);
  };

  // ---------------- 스테이지 시작 ----------------
  Battle.prototype.start = function () {
    var ev = [];
    this.units.forEach(function (u) {
      if (!u.alive) return;
      if (u.role === '보호자') {   // 스테이지 시작 시 최대 체력의 10% 보호막
        u.shield = Math.floor(u.maxHp * B.ROLE['보호자'].shieldRate); u.shieldTurns = Infinity;
        ev.push({ type: 'shield', uid: u.uid, amount: u.shield, log: u.name + '이(가) 보호막 ' + u.shield + '을(를) 얻었습니다.' });
      }
    });
    ev.push({ type: 'log', log: '스테이지 시작!' });
    var end = this.checkEnd(); if (end) ev.push(end);
    return ev;
  };

  // ---------------- 행동 선택 ----------------
  Battle.prototype.skillCost = function (skill) { return skill.spCost || (skill.kind === 'ultimate' ? B.SKILL_COST_DEFAULT : 0); };
  Battle.prototype.chooseSkill = function (u) {
    var ult = u.skills.ultimate, basics = u.skills.basic || [];
    if (ult && !hasStatus(u, 'silence') && u.fight >= this.skillCost(ult)) return ult;
    var b2 = basics[1];
    if (b2 && this.skillCost(b2) > 0 && u.fight >= this.skillCost(b2) && this.rng.chance(B.AI.basic2Chance)) return b2;
    return basics[0] || b2 || ult;
  };

  // ---------------- 행동 순서 (p.7): 우선 행동 > 우선도 > 속도(+기술 속도 보정) > 편성 순서 > 플레이어 ----------------
  Battle.prototype.computeOrder = function () {
    var self = this;
    var alive = this.units.filter(function (u) { return u.alive && u.active; });
    alive.forEach(function (u) { u._plan = self.chooseSkill(u); u._ordSpd = self.effectiveStat(u, 'spd') + (u._plan ? (u._plan.speed || 0) : 0); u._haste = hasStatus(u, 'haste') ? 1 : 0; });
    alive.sort(function (a, b) {
      if (b._haste !== a._haste) return b._haste - a._haste;
      if (b.priority !== a.priority) return b.priority - a.priority;
      if (b._ordSpd !== a._ordSpd) return b._ordSpd - a._ordSpd;
      if (a.slot !== b.slot) return a.slot - b.slot;
      return (a.side === 'ally' ? 0 : 1) - (b.side === 'ally' ? 0 : 1);
    });
    return alive;
  };

  // ---------------- 대상 ----------------
  // 단일 적 대상: 편성 순서 1부터. 암살자는 가장 낮은 순서, 추격자는 체력 비율이 가장 낮은 적. 도발이 있으면 도발한 적.
  Battle.prototype.pickTarget = function (actor) {
    var foes = this.sideAlive(actor.side === 'ally' ? 'enemy' : 'ally');
    if (!foes.length) return null;
    var taunter = foes.filter(function (f) { return hasStatus(f, 'taunt'); })[0];
    if (taunter) return taunter;
    foes.sort(function (a, b) { return a.slot - b.slot; });
    if (actor.role === '암살자') return foes[foes.length - 1];
    if (actor.role === '추격자') return foes.slice().sort(function (a, b) { return hpRatio(a) - hpRatio(b); })[0];
    return foes[0];
  };
  Battle.prototype.resolveTargets = function (actor, skill) {
    var foes = this.sideAlive(actor.side === 'ally' ? 'enemy' : 'ally');
    var allies = this.sideAlive(actor.side);
    var weakest = function (arr) { return arr.slice().sort(function (a, b) { return hpRatio(a) - hpRatio(b); })[0]; };
    switch (skill.target) {
      case 'enemy_all': return foes;
      case 'enemy_weakest': return foes.length ? [weakest(foes)] : [];
      case 'self': return [actor];
      case 'ally_one': case 'ally_weakest': return allies.length ? [weakest(allies)] : [];
      case 'ally_all': case 'field_others': return allies;
      case 'ally_others': return allies.filter(function (a) { return a !== actor; });
      default: { var t = this.pickTarget(actor); return t ? [t] : []; } // enemy_one
    }
  };

  // ---------------- 데미지 ----------------
  Battle.prototype.typeMult = function (actor, target) {
    if (!B.DAMAGE.useTypeAdvantage) return { mult: 1, adv: null };
    if (TYPE_BEATS[actor.type] === target.type) return { mult: R['RULES.ADV_MULT'], adv: 'adv' };
    if (TYPE_BEATS[target.type] === actor.type) return { mult: R['RULES.DIS_MULT'], adv: 'dis' };
    return { mult: 1, adv: null };
  };
  Battle.prototype.computeDamage = function (actor, target, skill, ctx) {
    if (!skill || skill.tier <= 0) return 0;
    var el = skill.element || 'WILD';
    var atkKey = R['ELEMENT_ATTACK.' + el] || 'atk';
    var defKey = R['ELEMENT_DEFENSE.' + el] || '';
    var A = this.effectiveStat(actor, atkKey);
    var D = defKey ? this.effectiveStat(target, defKey) : 0;
    var effs = skill.effects || [];
    var eff = function (kw) { return effs.filter(function (e) { return e.kw === kw && (!e.trigger || e.trigger === 'always'); })[0]; };
    var pierce = eff('pierce'); if (pierce) D = D * (1 - (pierce.args.ratio || 0));
    var scale = (el === 'ARCANE') ? R['RULES.MAG_DEFENSE_SCALE'] : R['RULES.DEFENSE_SCALE'];
    var mit = D > 0 ? scale / (scale + D * B.DAMAGE.DEF_WEIGHT) : 1;
    var coef = R['COEF.' + el + '.' + (skill.kind === 'ultimate' ? 'ultimate' : 'basic')] || 1;
    var power = R['POWER_SCALE.' + Math.min(10, Math.max(0, skill.tier))] || 0;
    var dmg = (A + R['RULES.ATK_OFFSET']) * coef * power * mit;

    var tm = this.typeMult(actor, target); dmg *= tm.mult; ctx.adv = tm.adv;

    var bonus = 1;
    var e;
    if ((e = eff('execute'))) bonus += (e.args.bonus || 0) * (1 - hpRatio(target));
    if (actor.role === '추격자') bonus += B.ROLE['추격자'].executeBonus * (1 - hpRatio(target));
    if ((e = eff('desperate'))) bonus += (e.args.bonus || 0) * (1 - hpRatio(actor));
    if ((e = eff('swell'))) bonus += (e.args.bonus || 0) * hpRatio(actor);
    if ((e = eff('zeal'))) bonus += (e.args.bonus || 0) * Math.min(1, (ctx.fightBefore || 0) / B.FIGHT_MAX);
    if ((e = eff('avenge'))) bonus += (e.args.per || 0) * this.units.filter(function (u) { return u.side === actor.side && !u.alive; }).length;
    dmg *= bonus;
    dmg *= 1 + statusSum(target, 'mark', 'ratio');   // 표식: 받는 피해 증가
    if ((e = eff('siege'))) dmg += (e.args.ratio || 0) * target.maxHp;   // 공성: 고정 피해
    return Math.max(B.DAMAGE.MIN_DAMAGE, Math.floor(dmg));
  };

  Battle.prototype.checkEnd = function () {
    if (this.finished) return null;
    if (this.enemiesAlive().length === 0) { this.finished = true; this.result = 'win'; return { type: 'end', result: 'win', log: '남은 적이 없습니다. 스테이지 클리어!' }; }
    if (this.alliesAlive().length === 0) { this.finished = true; this.result = 'lose'; return { type: 'end', result: 'lose', log: '아군이 모두 쓰러졌습니다. 클리어 실패…' }; }
    return null;
  };

  // 피해 적용 (보호막 흡수 포함). 반환: {damage, absorbed}
  Battle.prototype.applyDamage = function (target, dmg, bypassShield) {
    var absorbed = 0;
    if (target.shield > 0 && !bypassShield) { absorbed = Math.min(target.shield, dmg); target.shield -= absorbed; dmg -= absorbed; }
    target.hp = Math.max(0, target.hp - dmg);
    return { damage: dmg, absorbed: absorbed };
  };
  Battle.prototype.kill = function (u, ev, killer) {
    if (!u.alive) return;
    u.alive = false; u.active = false; u.statuses = [];
    ev.push({ type: 'death', uid: u.uid, side: u.side, log: u.name + '이(가) 쓰러졌습니다.' });
    if (killer && killer.alive && killer !== u && killer.role === '돌격자') {   // 돌격자: 적 처치 시 현재 체력의 5% 회복
      var heal = Math.max(1, Math.floor(killer.hp * B.ROLE['돌격자'].healRate));
      killer.hp = Math.min(killer.maxHp, killer.hp + heal);
      ev.push({ type: 'heal', uid: killer.uid, amount: heal, hp: killer.hp, log: killer.name + '이(가) 체력을 ' + heal + ' 회복했습니다.' });
    }
  };
  Battle.prototype.addStatus = function (u, st, ev, log) {
    u.statuses.push(st);
    ev.push({ type: 'status', uid: u.uid, kw: st.kw, turns: st.turns, log: log });
  };

  // ---------------- 한 턴 진행 (p.6 플로우 차트) ----------------
  Battle.prototype.runTurn = function () {
    var ev = [];
    if (this.finished) return ev;
    var self = this;
    this.turn += 1;
    ev.push({ type: 'turnStart', turn: this.turn, log: '--- 턴 ' + this.turn + ' ---' });

    var order = this.computeOrder();
    ev.push({ type: 'order', uids: order.map(function (u) { return u.uid; }) });

    for (var i = 0; i < order.length; i++) {
      var actor = order[i];
      if (!actor.alive || !actor.active || this.finished) continue;

      if (hasStatus(actor, 'stun')) { ev.push({ type: 'skip', uid: actor.uid, log: actor.name + '은(는) 기절해 행동하지 못합니다.' }); continue; }

      var skill = this.chooseSkill(actor);
      if (!skill) continue;
      var cost = this.skillCost(skill);
      var fightBefore = actor.fight;
      if (cost > 0) actor.fight -= cost;   // 투지 감소

      var targets = this.resolveTargets(actor, skill);
      if (!targets.length) break;

      var cast = { type: 'cast', uid: actor.uid, skillName: skill.name, kind: skill.kind, element: skill.element, isUltimate: skill.kind === 'ultimate', hits: [], fightAfter: 0, log: '' };
      var effs = (skill.effects || []).filter(function (e) { return !e.trigger || e.trigger === 'always'; });
      var find = function (kw) { return effs.filter(function (e) { return e.kw === kw; })[0]; };
      var passChance = function (e) { return e.chance === null || e.chance === undefined || self.rng.chance(e.chance <= 1 ? e.chance : e.chance / 100); };

      // 대가: 시전 시 자해
      var toll = find('toll');
      if (toll) { var tollDmg = Math.floor(actor.maxHp * (toll.args.ratio || 0)); actor.hp = Math.max(1, actor.hp - tollDmg); ev.push({ type: 'heal', uid: actor.uid, amount: -tollDmg, hp: actor.hp, log: actor.name + '이(가) 대가로 체력 ' + tollDmg + '을(를) 잃었습니다.' }); }

      // ---- 피해 ----
      var isDamage = skill.tier > 0 && /^enemy/.test(skill.target);
      var totalDamage = 0;
      var hitTargets = [];
      if (isDamage) {
        var mh = find('multihit');
        var hits = mh ? (mh.args.hits || this.rng.int(mh.args.min || 1, mh.args.max || 1)) : 1;
        var bypass = !!find('bypass');
        for (var h = 0; h < hits; h++) {
          for (var t = 0; t < targets.length; t++) {
            var target = targets[t];
            if (!target.alive) continue;
            var ctx = { fightBefore: fightBefore };
            var hit = { targetUid: target.uid, damage: 0, absorbed: 0, dodged: false, adv: null, targetHp: target.hp, targetShield: target.shield, killed: false };
            if (target.role === '교란자' && this.rng.chance(B.ROLE['교란자'].dodgeRate)) {   // 교란자: 15% 회피
              hit.dodged = true;
            } else {
              var dmg = this.computeDamage(actor, target, skill, ctx);
              hit.adv = ctx.adv;
              var r = this.applyDamage(target, dmg, bypass);
              hit.damage = r.damage; hit.absorbed = r.absorbed; totalDamage += r.damage;
              hit.targetHp = target.hp; hit.targetShield = target.shield;
              if (hitTargets.indexOf(target) < 0) hitTargets.push(target);
              if (target.hp <= 0) hit.killed = true;
            }
            cast.hits.push(hit);
          }
        }
      }

      // ---- 로그 (피해) ----
      var tag = skill.kind === 'ultimate' ? '[특수기 ' + skill.name + '] ' : '[' + skill.name + '] ';
      if (isDamage) {
        var parts = cast.hits.map(function (hh) { var tu = self.byUid(hh.targetUid); return hh.dodged ? tu.name + ' 회피' : tu.name + ' ' + hh.damage + (hh.absorbed ? '(보호막 ' + hh.absorbed + ')' : '') + (hh.adv === 'adv' ? '▲' : hh.adv === 'dis' ? '▽' : ''); });
        cast.log = actor.name + '이(가) ' + tag + parts.join(', ') + ' 피해.';
      } else {
        cast.log = actor.name + '이(가) ' + tag + '사용.';
      }

      // ---- 효과 적용 (피해 이후) ----
      var recipients = isDamage ? hitTargets : targets;
      for (var k = 0; k < effs.length; k++) {
        var e = effs[k];
        if (SUPPORTED.indexOf(e.kw) < 0) continue;
        if (!passChance(e)) continue;
        var a = e.args || {};
        var toActor = e.side === 'self';
        var who = toActor ? [actor] : recipients;
        switch (e.kw) {
          case 'heal': {
            var hs = toActor || /^enemy/.test(skill.target) ? [actor] : recipients;
            hs.forEach(function (u) { if (!u.alive) return; var amt = Math.floor(u.maxHp * (a.ratio || 0)); u.hp = Math.min(u.maxHp, u.hp + amt); ev.push({ type: 'heal', uid: u.uid, amount: amt, hp: u.hp, log: u.name + '이(가) 체력을 ' + amt + ' 회복했습니다.' }); });
            break;
          }
          case 'shield': {
            var ss = toActor || /^enemy/.test(skill.target) ? [actor] : recipients;
            ss.forEach(function (u) { if (!u.alive) return; var amt = Math.floor(u.maxHp * (a.ratio || 0)); u.shield += amt; u.shieldTurns = Math.min(u.shieldTurns, a.turns || 2); ev.push({ type: 'shield', uid: u.uid, amount: amt, log: u.name + '이(가) 보호막 ' + amt + '을(를) 얻었습니다.' }); });
            break;
          }
          case 'drain': {
            var dr = Math.floor(totalDamage * (a.ratio || 0));
            if (dr > 0 && actor.alive) { actor.hp = Math.min(actor.maxHp, actor.hp + dr); ev.push({ type: 'heal', uid: actor.uid, amount: dr, hp: actor.hp, log: actor.name + '이(가) 흡혈로 ' + dr + ' 회복했습니다.' }); }
            break;
          }
          case 'recoil': {
            var rc = Math.floor(totalDamage * (a.ratio || 0));
            if (rc > 0) { actor.hp = Math.max(0, actor.hp - rc); ev.push({ type: 'heal', uid: actor.uid, amount: -rc, hp: actor.hp, log: actor.name + '이(가) 반동으로 ' + rc + ' 피해를 입었습니다.' }); }
            break;
          }
          case 'charge': actor.fight = Math.min(B.FIGHT_MAX, actor.fight + (a.amount || 0)); ev.push({ type: 'fight', uid: actor.uid, fight: actor.fight, log: actor.name + '의 투지 +' + a.amount }); break;
          case 'gift': who.forEach(function (u) { u.fight = Math.min(B.FIGHT_MAX, u.fight + (a.amount || 0)); ev.push({ type: 'fight', uid: u.uid, fight: u.fight, log: u.name + '의 투지 +' + a.amount }); }); break;
          case 'siphon': who.forEach(function (u) { u.fight = Math.max(0, u.fight - (a.amount || 0)); ev.push({ type: 'fight', uid: u.uid, fight: u.fight, log: u.name + '의 투지 -' + a.amount }); }); break;
          case 'boost': who.forEach(function (u) { if (!u.alive) return; self.addStatus(u, { kw: 'boost', stat: a.stat || 'atk', amount: a.amount || 0, turns: a.lasting ? 99 : (a.turns || 2) }, ev, u.name + '의 ' + (STAT_KO[a.stat] || a.stat) + ' ' + (a.amount > 0 ? '+' : '') + a.amount + ' (' + (a.lasting ? '전투 내내' : (a.turns || 2) + '턴') + ')'); }); break;
          case 'bleed': who.forEach(function (u) { if (!u.alive) return; self.addStatus(u, { kw: 'bleed', amount: a.amount || 0, turns: a.turns || 2 }, ev, u.name + '에게 출혈 ' + a.amount + ' (' + (a.turns || 2) + '턴)'); }); break;
          case 'mark': who.forEach(function (u) { if (!u.alive) return; self.addStatus(u, { kw: 'mark', ratio: a.ratio || 0, turns: a.turns || 2 }, ev, u.name + '에게 표식 (받는 피해 +' + Math.round((a.ratio || 0) * 100) + '%, ' + (a.turns || 2) + '턴)'); }); break;
          case 'stun': who.forEach(function (u) { if (!u.alive) return; self.addStatus(u, { kw: 'stun', turns: a.turns || 1 }, ev, u.name + ' 기절 ' + (a.turns || 1) + '턴'); }); break;
          case 'silence': who.forEach(function (u) { if (!u.alive) return; self.addStatus(u, { kw: 'silence', turns: a.turns || 1 }, ev, u.name + ' 침묵 ' + (a.turns || 1) + '턴'); }); break;
          case 'taunt': self.addStatus(actor, { kw: 'taunt', turns: a.turns || 1 }, ev, actor.name + '이(가) 도발 (' + (a.turns || 1) + '턴)'); break;
          case 'haste': self.addStatus(actor, { kw: 'haste', turns: a.turns || 1 }, ev, actor.name + ' 우선 행동 (' + (a.turns || 1) + '턴)'); break;
          default: break; // pierce/execute/desperate/swell/zeal/avenge/siege/bypass/multihit 은 피해 계산에서 처리
        }
      }

      // 투지 상승 (플로우: 데미지 계산 -> 투지 상승)
      actor.fight = Math.min(B.FIGHT_MAX, actor.fight + B.FIGHT_GAIN);
      cast.fightAfter = actor.fight;
      ev.push(cast);

      // 사망 처리
      hitTargets.forEach(function (tu) { if (tu.hp <= 0) self.kill(tu, ev, actor); });
      if (actor.alive && actor.hp <= 0) self.kill(actor, ev, null);
      if (find('retire') && actor.alive) { ev.push({ type: 'log', log: actor.name + '이(가) 시전 후 퇴장합니다.' }); self.kill(actor, ev, null); }

      var end = this.checkEnd();
      if (end) { ev.push(end); return ev; }
    }

    this.endOfTurn(ev);
    var end2 = this.checkEnd();
    if (end2) { ev.push(end2); return ev; }
    ev.push({ type: 'turnEnd', turn: this.turn });
    return ev;
  };

  // 턴 종료: 출혈 피해 -> 치유자 회복 -> 상태/보호막 지속 감소
  Battle.prototype.endOfTurn = function (ev) {
    var self = this;
    this.units.forEach(function (u) {
      if (!u.alive) return;
      var bleed = statusSum(u, 'bleed', 'amount');
      if (bleed > 0) { u.hp = Math.max(0, u.hp - bleed); ev.push({ type: 'bleed', uid: u.uid, amount: bleed, hp: u.hp, log: u.name + '이(가) 출혈로 ' + bleed + ' 피해를 입었습니다.' }); if (u.hp <= 0) self.kill(u, ev, null); }
    });
    ['ally', 'enemy'].forEach(function (side) {
      var healers = self.sideAlive(side).filter(function (u) { return u.role === '치유자'; });
      healers.forEach(function (hlr) {
        var cands = self.sideAlive(side).filter(function (u) { return u.hp < u.maxHp; }).sort(function (a, b) { return hpRatio(a) - hpRatio(b); });
        if (!cands.length) return;
        var tgt = cands[0]; var amt = Math.max(1, Math.floor(tgt.maxHp * B.ROLE['치유자'].healRate));
        tgt.hp = Math.min(tgt.maxHp, tgt.hp + amt);
        ev.push({ type: 'heal', uid: tgt.uid, amount: amt, hp: tgt.hp, log: hlr.name + '이(가) ' + tgt.name + '을(를) ' + amt + ' 회복시켰습니다.' });
      });
    });
    this.units.forEach(function (u) {
      if (!u.alive) return;
      u.statuses.forEach(function (s) { s.turns -= 1; });
      u.statuses = u.statuses.filter(function (s) { return s.turns > 0; });
      if (u.shield > 0 && u.shieldTurns !== Infinity) { u.shieldTurns -= 1; if (u.shieldTurns <= 0) { u.shield = 0; u.shieldTurns = Infinity; } }
    });
  };

  Battle.prototype.runAll = function (maxTurns) {
    var all = this.start();
    var n = 0;
    while (!this.finished && n++ < (maxTurns || 200)) all = all.concat(this.runTurn());
    if (!this.finished) { this.finished = true; this.result = 'lose'; all.push({ type: 'end', result: 'lose', log: '턴 제한 초과' }); }
    return all;
  };

  root.BattleEngine = { Battle: Battle, makeUnit: makeUnit, SUPPORTED_EFFECTS: SUPPORTED, hpRatio: hpRatio, hasStatus: hasStatus };
})(typeof window !== 'undefined' ? window : globalThis);
