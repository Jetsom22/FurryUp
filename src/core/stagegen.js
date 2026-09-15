// =====================================================================
// 스테이지 배치 생성기 (스테이지 기획서 V0.2 / 1챕터 배치 조건)
// =====================================================================
(function (root) {
  var STAGE_RULES = root.STAGE_RULES;

  // 챕터 규칙으로 스테이지 타입 배열을 만든다. 반환: [{no, type}]
  function generateChapter(chapterNo, rng) {
    var rule = STAGE_RULES.chapters.filter(function (c) { return c.chapter === chapterNo; })[0];
    if (!rule || rule.locked) throw new Error('잠긴 챕터: ' + chapterNo);

    var total = rule.total;
    var types = new Array(total + 1); // 1-based
    var no;
    for (no in rule.fixed) types[no] = rule.fixed[no];

    // 중간보스: 후보 구간 내 랜덤, 고정 스테이지(보스/스토리)는 제외
    var midCandidates = [];
    for (no = rule.midbossRange[0]; no <= rule.midbossRange[1]; no++) if (!types[no]) midCandidates.push(no);
    var midboss = rng.pick(midCandidates);
    types[midboss] = '중간보스';

    // 이벤트: 후보 구간 내 랜덤 N개, 3연속 금지
    var attempts = 0;
    while (attempts++ < 200) {
      var draft = types.slice();
      var cands = [];
      for (no = rule.eventRange[0]; no <= rule.eventRange[1]; no++) if (!draft[no]) cands.push(no);
      var picked = rng.shuffle(cands).slice(0, rule.eventCount);
      picked.forEach(function (n) { draft[n] = '이벤트'; });
      if (!hasConsecutive(draft, '이벤트', rule.maxConsecutiveEvents + 1)) { types = draft; break; }
    }

    var stages = [];
    for (no = 1; no <= total; no++) stages.push({ no: no, type: types[no] || '일반' });
    return { chapter: chapterNo, name: rule.name, stages: stages, midboss: midboss };
  }

  function hasConsecutive(arr, type, len) {
    var run = 0;
    for (var i = 1; i < arr.length; i++) {
      run = (arr[i] === type) ? run + 1 : 0;
      if (run >= len) return true;
    }
    return false;
  }

  // 이벤트 스테이지 진입 시 하위 효과 결정
  // state: { eventsSeen, harmfulCount, midbossCleared }
  function rollEventEffect(rng, state) {
    var w = Object.assign({}, STAGE_RULES.eventWeights);
    var c = STAGE_RULES.eventConstraints;
    if (c.firstEventMustBePositive && state.eventsSeen === 0) { delete w['해로운']; delete w['일반']; }
    if (state.harmfulCount >= c.maxHarmful) delete w['해로운'];
    if (c.noHarmfulAfterMidboss && state.midbossCleared) delete w['해로운'];
    return rng.weighted(w);
  }

  root.StageGen = { generateChapter: generateChapter, rollEventEffect: rollEventEffect };
})(typeof window !== 'undefined' ? window : globalThis);
