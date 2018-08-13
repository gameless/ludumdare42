export default function(game: Phaser.Game) {
  return {
    create() {
      const text = game.add.image(0, 0, 'credits');
      game.add.tween(text).from({ alpha: 0 }, 2000).delay(1000).start();
    }
  };
};
