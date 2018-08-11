export default function(game: Phaser.Game) {
  let pot: Phaser.Image;
  let fade: Phaser.Tween;
  let hover: Phaser.Signal;
  let hovering = false;

  return {
    create() {
      game.sound.play('pot_music', 1, true);

      game.add.image(0, 0, 'background');
      game.add.image(0, 0, 'shelf');
      game.add.image(0, 0, 'pot_cross');
      game.add.image(0, 0, 'root');
      pot = game.add.image(0, 0, 'pot');
      game.add.image(0, 0, 'plant');
      game.add.image(0, 0, 'highlight');

      hover = new Phaser.Signal();
      hover.add(function() {
        const newAlpha = hovering ? 0 : 1;
        const time = Math.abs(newAlpha - pot.alpha) * 250;
        if (fade) {
          fade.stop();
        }
        fade = game.add.tween(pot);
        fade.to({ alpha: newAlpha }, time, Phaser.Easing.Default, true);
      });
    },

    render() {
      const closeToPot = new Phaser.Polygon([
        [37, 44],
        [50, 81],
        [67, 86],
        [89, 86],
        [105, 80],
        [114, 44],
        [100, 33],
        [50, 33]
      ].map(([x, y]) => new Phaser.Point(x, y)));

      const mouseX = game.input.mousePointer.x;
      const mouseY = game.input.mousePointer.y;
      const hoveringNow = closeToPot.contains(mouseX, mouseY);
      if (hoveringNow !== hovering) {
        hovering = hoveringNow;
        hover.dispatch();
      }
    }
  };
};
