export function delay(
  game: Phaser.Game, milliseconds: number, callback: () => void
) {
  const timer = game.time.create();
  timer.add(milliseconds, callback);
  timer.start();
}
