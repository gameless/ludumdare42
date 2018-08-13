export default function(game: Phaser.Game) {
  return {
    create() {
      const credits = 'Art: Laura Estep\nCode: Sam Estep\nSound: Ezra LaFleur';
      const style = { font: '16px sans', fill: '#ffffff' };
      const text = game.add.text(0, 0, credits, style);
      text.alpha = 0;
      const fadeInTimer = game.time.create();
      fadeInTimer.add(1000, () => {
        game.add.tween(text).to({ alpha: 1 }, 2000).start();
      });
      fadeInTimer.start();
    }
  };
};
