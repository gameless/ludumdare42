import { delay } from '../delay';
import { MusicalState } from '../music';

export default class extends MusicalState {
  create() {
    this.music.setTrack('end');
    this.music.play(false);

    delay(this.game, 18000, () => this.game.state.start('credits'));

    const planet = this.game.add.sprite(0, 0, 'planet_animation');
    planet.animations.add('die');
    planet.animations.play('die', 0.25);

    const darken = this.game.add.graphics();
    darken.beginFill(0x000000);
    darken.drawRect(0, 0, 160, 90);
    darken.endFill();
    this.game.add.tween(darken).to({ alpha: 0 }, 1000).start();
  }
}
