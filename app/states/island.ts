import { delay } from '../delay';
import { fadeIn, fadeOut } from '../fade';
import { Highlight } from '../highlight';
import { escapeCode } from '../pause';
import { Music, MusicalState, startState } from '../music';

const seaweedBox = new Phaser.Rectangle(117, 67, 13, 11);

export default class extends MusicalState {
  startFade = true;

  // @ts-ignore
  highlight: Highlight;

  init(music: Music, startFade: boolean) {
    super.init(music);
    this.startFade = startFade;
  }

  create() {
    this.game.input.keyboard.removeCallbacks();

    this.music.fadeTrack(500, 'mid1');
    this.music.fadeBadness(500, 0);

    this.game.add.image(0, 0, 'island_bg');
    this.game.add.image(0, 0, 'island_trees');
    const plant = this.game.add.sprite(0, 0, 'island_plant');
    const seaweed = this.game.add.sprite(0, 0, 'island_seaweed');

    plant.animations.add('grow').play(2);

    this.game.input.keyboard.addCallbacks(this, (event: KeyboardEvent) => {
      if (event.keyCode === escapeCode) {
        this.highlight.destroy();
        startState(this.game, 'menu', this.music, 'island');
      }
    });

    this.highlight = new Highlight(this.game, (x, y) => {
      if (seaweedBox.contains(x, y)) {
        return seaweed;
      }
      return null;
    });

    if (this.startFade) {
      fadeIn(this.game, 1000);
    }

    delay(this.game, 1000, () => {
      this.game.input.onUp.add(() => {
        if (seaweedBox.contains(this.game.input.x, this.game.input.y)) {
          seaweed.animations.add('shrink', [1, 2]).play(2);
          fadeOut(this.game, 1000);
          delay(this.game, 1000, () => {
            this.highlight.destroy();
            startState(this.game, 'planet', this.music);
          });
        }
      });
    });
  }

  render() {
    this.highlight.render();
  }
}
