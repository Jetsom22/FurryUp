// =====================================================================
// 씬 전환 흐름 (스테이지 기획서 2.3 플레이 루프)
//   아웃게임 -> 플레이 -> 챕터 선택 -> 도전 -> 첫 캐릭터 선택 -> 팀 편성
//   -> [스테이지 진입: 스토리/이벤트/전투] -> 클리어 -> 정비(상점) -> 다음 -> ...
//   -> 보스 클리어 -> 아웃게임 / 사망 -> 아웃게임
// =====================================================================
(function (root) {
  var Flow = {};

  Flow.run = function (scene) { return scene.registry.get('run'); };

  // 현재 스테이지 타입에 맞는 씬으로 진입
  Flow.enterStage = function (scene) {
    var run = Flow.run(scene);
    var stage = run.currentStage();
    if (stage.type === '스토리') scene.scene.start('StoryScene');
    else if (stage.type === '이벤트') scene.scene.start('EventScene');
    else scene.scene.start('BattleScene');
  };

  // 스테이지 클리어 처리 후 다음 화면
  Flow.stageCleared = function (scene) {
    var run = Flow.run(scene);
    var wasBoss = run.isBossStage();
    run.clearStage();
    if (wasBoss) {
      scene.scene.start('TitleScene', { message: '챕터 ' + run.chapter + ' 클리어! 아웃게임으로 돌아왔습니다.', cleared: true });
    } else {
      scene.scene.start('ShopScene');
    }
  };

  // 정비 화면에서 "다음 스테이지"
  Flow.nextStage = function (scene) {
    var run = Flow.run(scene);
    run.advance();
    Flow.enterStage(scene);
  };

  // 사망(클리어 실패) -> 아웃게임
  Flow.runFailed = function (scene) {
    var run = Flow.run(scene);
    scene.scene.start('TitleScene', { message: run.stageLabel() + ' 에서 전멸… 아웃게임으로 돌아왔습니다.', cleared: false });
  };

  root.Flow = Flow;
})(typeof window !== 'undefined' ? window : globalThis);
