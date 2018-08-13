import { MusicalState, startState } from '../music';
import { escapeCode } from '../pause';

export default class extends MusicalState {
  create() {
    this.game.input.keyboard.removeCallbacks();

    const text = this.game.add.image(0, 0, 'credits');
    this.game.add.tween(text).from({ alpha: 0 }, 2000).delay(1000).start();

    this.game.input.keyboard.addCallbacks(this, (event: KeyboardEvent) => {
      if (event.keyCode === escapeCode) {
        startState(this.game, 'menu', this.music, 'pot');
      }
    });
  }
}
