export default function(game: Phaser.Game) {
  let musics: { [music: string]: Phaser.Sound };
  let pot: Phaser.Sprite;
  let fade: Phaser.Tween;
  let hover: Phaser.Signal;
  let hovering = false;
  let showCross = true;

  let leftGrowth = 0;
  let rightGrowth = 0;

  return {
    init(theMusics: { [music: string]: Phaser.Sound }) {
      musics = theMusics;
    },

    create() {
      game.add.image(0, 0, 'pot_bg');
      game.add.image(0, 0, 'pot_shelf');
      game.add.image(0, 0, 'pot_shelf_hl');
      game.add.image(0, 0, 'pot_cross');

      game.add.image(0, 0, 'pot_root');
      const rootLeft = game.add.sprite(0, 0, 'pot_rootleft');
      const rootRight = game.add.sprite(0, 0, 'pot_rootright');

      pot = game.add.sprite(0, 0, 'pot_pot');
      game.add.image(0, 0, 'pot_pot_hl');
      game.add.image(0, 0, 'pot_plant');

      hover = new Phaser.Signal();
      hover.add(function() {
        const newAlpha = (hovering && showCross) ? 0 : 1;
        const time = Math.abs(newAlpha - pot.alpha) * 250;
        if (fade) {
          fade.stop();
        }
        fade = game.add.tween(pot);
        fade.to({ alpha: newAlpha }, time, Phaser.Easing.Default, true);
      });

      game.input.onDown.add(function() {
        if (hovering) {
          if (game.input.x < 80 && leftGrowth < 4) {
            leftGrowth++;
            rootLeft.frame = leftGrowth;
          }

          if (game.input.x >= 80 && rightGrowth < 3) {
            rightGrowth++;
            rootRight.frame = rightGrowth;
          }

          if (leftGrowth === 4 && rightGrowth === 3) {
            rootRight.frame = rightGrowth + 1;
            pot.frame = 1;
            showCross = false;
            hover.dispatch();
          }
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

      const hoveringNow = closeToPot.contains(game.input.x, game.input.y);
      if (hoveringNow !== hovering) {
        hovering = hoveringNow;
        hover.dispatch();
      }
    }
  };
};
