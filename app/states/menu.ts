export default function(game: Phaser.Game) {
  const button = new Phaser.Polygon([
    [16, 25], [13, 57], [145, 64], [145, 30]
  ].map(([x, y]) => new Phaser.Point(x, y)));

  let musics: Phaser.Sound[];
  let hl: Phaser.BitmapData;

  return {
    init(theMusics: Phaser.Sound[]) {
      musics = theMusics;
    },

    create() {
      game.add.image(0, 0, 'menu_background');
      game.add.image(0, 0, 'menu_start');

      hl = game.make.bitmapData(160, 90);
      game.add.image(0, 0, hl);

      game.input.onUp.add(() => {
        if (button.contains(game.input.x, game.input.y)) {
          hl.destroy();
          game.state.start('pot', true, false, musics);
        }
      });
    },

    render() {
      hl.clear();
      if (button.contains(game.input.x, game.input.y)) {
        hl.blendSourceOver();
        const alpha = game.input.activePointer.isDown ? 0.75 : 0.5;
        hl.fill(0xff, 0xff, 0xff, alpha);
        hl.blendDestinationIn();
        hl.circle(game.input.x, game.input.y, 10);
        hl.draw('menu_start');
      }
    }
  };
};
