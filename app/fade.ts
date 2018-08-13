export function fadeIn(game: Phaser.Game, duration: number) {
  const darken = game.add.graphics();
  darken.beginFill(0x000000);
  darken.drawRect(0, 0, 160, 90);
  darken.endFill();
  game.add.tween(darken).to({ alpha: 0 }, duration).start();
}

export function fadeOut(game: Phaser.Game, duration: number) {
  const darken = game.add.graphics();
  darken.beginFill(0x000000);
  darken.drawRect(0, 0, 160, 90);
  darken.endFill();
  game.add.tween(darken).from({ alpha: 0 }, duration).start();
}
