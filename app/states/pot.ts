export default function(game: Phaser.Game) {
  return {
    create() {
      const graphics = game.add.graphics();
      graphics.beginFill(0xffa500);
      graphics.drawCircle(100, 75, 100);
      graphics.endFill();

      game.sound.play('pot_music', 1, true);
    }
  };
};
