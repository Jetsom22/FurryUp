// =====================================================================
// 씬 전환 흐름 (스테이지 기획서 2.3 플레이 루프)
//   타이틀 -> 로비 -> 게임 시작 -> 캐릭터 선택(장착) -> 챕터 선택 -> 게임 시작 (장착 캐릭터가 편성 1번)
//   -> [스테이지 진입: 스토리/이벤트/전투] -> 클리어 -> 정비(상점) -> 다음 -> ...
//   -> 보스 클리어 -> 로비 / 사망 -> 로비
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
      scene.scene.start('LobbyScene', { message: '챕터 ' + run.chapter + ' 클리어! 로비로 돌아왔습니다.', cleared: true });
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

  // 사망(클리어 실패) -> 로비
  Flow.runFailed = function (scene) {
    var run = Flow.run(scene);
    scene.scene.start('LobbyScene', { message: run.stageLabel() + ' 에서 전멸… 로비로 돌아왔습니다.', cleared: false });
  };

  root.Flow = Flow;
})(typeof window !== 'undefined' ? window : globalThis);
