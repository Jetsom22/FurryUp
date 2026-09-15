// Phaser 게임 진입점. 1920x1080 (16:9) 고정 해상도를 창 크기에 맞춰 스케일한다.
window.addEventListener('load', function () {
  var config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: Theme.W,
    height: Theme.H,
    backgroundColor: Theme.bgCss,
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    render: { antialias: true, pixelArt: false },
    scene: [BootScene, TitleScene, PickScene, FormationScene, BattleScene, StoryScene, EventScene, ShopScene],
  };
  window.game = new Phaser.Game(config);
});
