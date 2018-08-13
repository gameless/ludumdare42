import { delay } from '../delay';
import { fadeIn, fadeOut } from '../fade';
import { escapeCode } from '../pause';
import { Music, MusicalState, startState } from '../music';

export default class extends MusicalState {
  startFade = true;

  init(music: Music, startFade: boolean) {
    super.init(music);
    this.startFade = startFade;
  }

  create() {
    this.game.input.keyboard.removeCallbacks();

    this.music.fadeTrack(500, 'mid1');
    this.music.fadeBadness(500, 0);

    this.game.add.image(0, 0, 'island_bg');

    this.game.input.keyboard.addCallbacks(this, (event: KeyboardEvent) => {
      if (event.keyCode === escapeCode) {
        startState(this.game, 'menu', this.music, 'island');
      }
    });

    if (this.startFade) {
      fadeIn(this.game, 1000);
    }

    delay(this.game, 1000, () => {
      this.game.input.onUp.add(() => {
        fadeOut(this.game, 1000);
        delay(this.game, 1000, () => {
          startState(this.game, 'planet', this.music);
        });
      });
    });
  }
}
