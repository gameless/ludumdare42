export default function(game: Phaser.Game) {
  return {
    create() {
      game.add.text(0, 0, 'Hello, world!', { fill: 'white' });
    }
  };
};
