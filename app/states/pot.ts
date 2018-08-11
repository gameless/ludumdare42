export default function(game: Phaser.Game) {
  let musics: { [music: string]: Phaser.Sound };
  let pot: Phaser.Image;
  let fade: Phaser.Tween;
  let hover: Phaser.Signal;
  let hovering = false;

  return {
    init(theMusics: { [music: string]: Phaser.Sound }) {
      musics = theMusics;
    },

    create() {
      game.add.image(0, 0, 'pot_bg');
      game.add.image(0, 0, 'pot_shelf');
      game.add.image(0, 0, 'pot_cross');
      game.add.image(0, 0, 'pot_root');
      pot = game.add.image(0, 0, 'pot_pot');
      game.add.image(0, 0, 'pot_plant');
      game.add.image(0, 0, 'pot_highlight');

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

      game.input.onDown.add(function() {
        if (hovering) {
          game.state.start('room', true, false, musics);
        }
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

      const mouseX = game.input.x;
      const mouseY = game.input.y;
      const hoveringNow = closeToPot.contains(mouseX, mouseY);
      if (hoveringNow !== hovering) {
        hovering = hoveringNow;
        hover.dispatch();
      }
    }
  };
};
