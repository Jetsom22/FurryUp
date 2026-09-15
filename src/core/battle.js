// =====================================================================
// 전투 엔진 (전투 기획서 p.4~p.8)
// ---------------------------------------------------------------------
// 순수 로직. 렌더링과 분리되어 있으며, runTurn() 이 한 턴 동안 벌어진 일을
// 이벤트 배열로 돌려준다. 씬은 이 이벤트를 순서대로 연출한다.
//
// 유닛(unit) 구조:
//   { uid, id, name, role, side:'ally'|'enemy', slot(편성 순서 1~5),
//     hp, maxHp, atk, def, spd, priority, fight(투지), shield, alive, active }
// =====================================================================
(function (root) {
  var B = root.BALANCE;

  function makeUnit(base, side, slot, opts) {
    opts = opts || {};
    return {
      uid: side + '_' + slot,
      id: base.id,
      name: base.name,
      role: base.role,
      side: side,
      slot: slot,
      hp: (opts.hp !== undefined) ? opts.hp : base.hp,
      maxHp: base.hp,
      atk: base.atk,
      def: base.def,
      spd: base.spd,
      priority: base.priority || 0,
      fight: B.FIGHT_START,
      shield: 0,
      alive: ((opts.hp !== undefined) ? opts.hp : base.hp) > 0,
      active: true,
      skillName: base.skill || '스킬',
      boss: !!base.boss,
    };
  }

  function Battle(allies, enemies, rng) {
    this.rng = rng;
    this.turn = 0;
    this.units = allies.concat(enemies);
    this.finished = false;
    this.result = null; // 'win' | 'lose'
    this.events = [];
  }

  Battle.prototype.alliesAlive = function () { return this.units.filter(function (u) { return u.side === 'ally' && u.alive; }); };
  Battle.prototype.enemiesAlive = function () { return this.units.filter(function (u) { return u.side === 'enemy' && u.alive; }); };
  Battle.prototype.byUid = function (uid) { return this.units.filter(function (u) { return u.uid === uid; })[0]; };

  // ---- 스테이지 시작: 보호자 보호막 ----
  Battle.prototype.start = function () {
    var ev = [];
    var self = this;
    this.units.forEach(function (u) {
      if (!u.alive) return;
      if (u.role === '보호자') {
        u.shield = Math.floor(u.maxHp * B.ROLE['보호자'].shieldRate);
        ev.push({ type: 'shield', uid: u.uid, amount: u.shield, log: u.name + '이(가) 보호막 ' + u.shield + '을(를) 얻었습니다.' });
      }
    });
    ev.push({ type: 'log', log: '스테이지 시작!' });
    // 시작 시점에 이미 전멸이면 즉시 종료
    var end = self.checkEnd();
    if (end) ev.push(end);
    return ev;
  };

  // ---- 행동 순서 (p.7): 우선도 > 속도 > 편성 순서 > 플레이어 캐릭터 ----
  Battle.prototype.computeOrder = function () {
    var alive = this.units.filter(function (u) { return u.alive && u.active; });
    alive.sort(function (a, b) {
      if (b.priority !== a.priority) return b.priority - a.priority;      // 우선도 높은 순
      if (b.spd !== a.spd) return b.spd - a.spd;                          // 속도 높은 순
      if (a.slot !== b.slot) return a.slot - b.slot;                      // 편성 순서 높은(=1) 순
      return (a.side === 'ally' ? 0 : 1) - (b.side === 'ally' ? 0 : 1);  // 플레이어 캐릭터 우선
    });
    return alive;
  };

  // ---- 공격 대상 (p.6/p.8): 편성 순서 1부터, 암살자는 가장 낮은(마지막) 순서부터 ----
  Battle.prototype.pickTarget = function (actor) {
    var foes = (actor.side === 'ally') ? this.enemiesAlive() : this.alliesAlive();
    if (!foes.length) return null;
    foes.sort(function (a, b) { return a.slot - b.slot; });
    return (actor.role === '암살자') ? foes[foes.length - 1] : foes[0];
  };

  // ---- 결전자: 턴 8 이상이면 능력치 증가 ----
  Battle.prototype.effectiveStat = function (u, key) {
    var v = u[key];
    if (u.role === '결전자' && this.turn >= B.ROLE['결전자'].turn) v = Math.floor(v * B.ROLE['결전자'].statMult);
    return v;
  };

  Battle.prototype.checkEnd = function () {
    if (this.finished) return null;
    if (this.enemiesAlive().length === 0) { this.finished = true; this.result = 'win'; return { type: 'end', result: 'win', log: '남은 적이 없습니다. 스테이지 클리어!' }; }
    if (this.alliesAlive().length === 0) { this.finished = true; this.result = 'lose'; return { type: 'end', result: 'lose', log: '아군이 모두 쓰러졌습니다. 클리어 실패…' }; }
    return null;
  };

  // ---- 한 턴 진행 (p.6 플로우 차트) ----
  Battle.prototype.runTurn = function () {
    var ev = [];
    if (this.finished) return ev;
    this.turn += 1;
    ev.push({ type: 'turnStart', turn: this.turn, log: '--- 턴 ' + this.turn + ' ---' });

    var order = this.computeOrder();
    ev.push({ type: 'order', uids: order.map(function (u) { return u.uid; }) });

    for (var i = 0; i < order.length; i++) {
      var actor = order[i];
      if (!actor.alive || !actor.active || this.finished) continue;

      var target = this.pickTarget(actor);
      if (!target) break;

      // 투지가 스킬 요구치 이상이면 스킬, 아니면 일반 공격
      var useSkill = actor.fight >= B.SKILL_COST;
      if (useSkill) actor.fight -= B.SKILL_COST;
      var mult = useSkill ? B.SKILL_MULT : 1;

      var atk = this.effectiveStat(actor, 'atk');
      var def = this.effectiveStat(target, 'def');
      var dmg = Math.max(B.MIN_DAMAGE, Math.floor(atk * mult) - def);

      var attackEv = {
        type: 'attack', uid: actor.uid, targetUid: target.uid, skill: useSkill, skillName: actor.skillName,
        dodged: false, damage: 0, absorbed: 0, fightAfter: 0, targetHp: target.hp, targetShield: target.shield,
      };

      // 교란자: 15% 확률로 회피
      if (target.role === '교란자' && this.rng.chance(B.ROLE['교란자'].dodgeRate)) {
        attackEv.dodged = true;
        attackEv.log = target.name + '이(가) ' + actor.name + '의 공격을 회피했습니다!';
      } else {
        var absorbed = 0;
        if (target.shield > 0) {
          absorbed = Math.min(target.shield, dmg);
          target.shield -= absorbed;
          dmg -= absorbed;
        }
        target.hp = Math.max(0, target.hp - dmg);
        attackEv.damage = dmg;
        attackEv.absorbed = absorbed;
        attackEv.targetHp = target.hp;
        attackEv.targetShield = target.shield;
        attackEv.log = actor.name + '이(가) ' + (useSkill ? '[' + actor.skillName + '] ' : '') + target.name + '에게 ' + dmg + '만큼의 피해를 입혔습니다.' + (absorbed ? ' (보호막 ' + absorbed + ' 흡수)' : '');
      }

      // 투지 상승 (플로우: 데미지 계산 -> 투지 상승)
      actor.fight = Math.min(B.FIGHT_MAX, actor.fight + B.FIGHT_GAIN);
      attackEv.fightAfter = actor.fight;
      ev.push(attackEv);

      // 체력 0 -> 비활성화 (아군은 화면에 남고 비활성, 적은 화면에서 제거)
      if (target.hp <= 0 && target.alive) {
        target.alive = false;
        target.active = false;
        ev.push({ type: 'death', uid: target.uid, side: target.side, log: target.name + '이(가) 쓰러졌습니다.' });

        // 돌격자: 적 처치 시 현재 체력의 5% 회복
        if (actor.role === '돌격자' && actor.alive) {
          var heal = Math.max(1, Math.floor(actor.hp * B.ROLE['돌격자'].healRate));
          actor.hp = Math.min(actor.maxHp, actor.hp + heal);
          ev.push({ type: 'heal', uid: actor.uid, amount: heal, hp: actor.hp, log: actor.name + '이(가) 체력을 ' + heal + ' 회복했습니다.' });
        }
      }

      var end = this.checkEnd();
      if (end) { ev.push(end); return ev; }
    }

    ev.push({ type: 'turnEnd', turn: this.turn });
    return ev;
  };

  // 끝날 때까지 전부 돌린다 (테스트/스킵용)
  Battle.prototype.runAll = function (maxTurns) {
    var all = this.start();
    var n = 0;
    while (!this.finished && n++ < (maxTurns || 200)) all = all.concat(this.runTurn());
    if (!this.finished) { this.finished = true; this.result = 'lose'; all.push({ type: 'end', result: 'lose', log: '턴 제한 초과' }); }
    return all;
  };

  root.BattleEngine = { Battle: Battle, makeUnit: makeUnit };
})(typeof window !== 'undefined' ? window : globalThis);
