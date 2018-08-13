import { Music } from '../music';

export default function(game: Phaser.Game) {
  let music: Music;

  return {
    init(theMusic: Music) {
      music = theMusic;
    },

    create() {
      music.tracks['fun4'].good.fadeTo(500, 0);
      music.tracks['end'].good.play('', 0, 1, false);

      const dieTimer = game.time.create();
      dieTimer.add(18000, () => {
        game.state.start('credits');
      });
      dieTimer.start();

      const planet = game.add.sprite(0, 0, 'planet_animation');
      planet.animations.add('die');
      planet.animations.play('die', 0.25);

      const darken = game.add.graphics();
      darken.beginFill(0x000000);
      darken.drawRect(0, 0, 160, 90);
      darken.endFill();
      game.add.tween(darken).to({ alpha: 0 }, 1000, Phaser.Easing.Default, true);
    }
  };
};
