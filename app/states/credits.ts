export default function(game: Phaser.Game) {
  return {
    create() {
      const text = game.add.image(0, 0, 'credits');
      text.alpha = 0;
      const fadeInTimer = game.time.create();
      fadeInTimer.add(1000, () => {
        game.add.tween(text).to({ alpha: 1 }, 2000).start();
      });
      fadeInTimer.start();
    }
  };
};
