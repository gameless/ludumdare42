export default function(game: Phaser.Game) {
  let musics: Phaser.Sound[];

  return {
    init(theMusics: Phaser.Sound[]) {
      musics = theMusics;
    },

    create() {
      game.add.image(0, 0, 'menu_background');
      game.add.image(0, 0, 'menu_start');

      game.input.onDown.add(() => game.state.start('pot', true, false, musics));
    }
  };
};
