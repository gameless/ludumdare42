export default function(game: Phaser.Game) {
  let musics: Phaser.Sound[];

  return {
    init(theMusics: Phaser.Sound[]) {
      musics = theMusics;
    },

    create() {
      musics[0].fadeTo(500, 0);
      musics[1].fadeTo(500, 0);
      musics[2].fadeTo(500, 0);
      musics[3].fadeTo(500, 0);
      musics[4].fadeTo(500, 1);

      game.add.image(0, 0, 'room_bg'); // temporary

      const darken = game.add.graphics();
      darken.beginFill(0x000000);
      darken.drawRect(0, 0, 160, 90);
      darken.endFill();
      game.add.tween(darken).to({ alpha: 0 }, 1000, Phaser.Easing.Default, true);
    }
  };
};
