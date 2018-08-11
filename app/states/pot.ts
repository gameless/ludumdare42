export default function(game: Phaser.Game) {
  return {
    create() {
      game.sound.play('pot_music', 1, true);

      game.add.image(0, 0, 'background');
      game.add.image(0, 0, 'shelf');
      game.add.image(0, 0, 'pot_cross');
      game.add.image(0, 0, 'root');
      game.add.image(0, 0, 'pot');
      game.add.image(0, 0, 'plant');
      game.add.image(0, 0, 'highlight');
    }
  };
};
