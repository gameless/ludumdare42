import { Highlight } from '../highlight';
import { Music, MusicalState, startState } from '../music';

const startButton = new Phaser.Polygon([
  [16, 25], [13, 57], [145, 64], [145, 30]
].map(([x, y]) => new Phaser.Point(x, y)));

const resumeButton = new Phaser.Polygon([
  [17, 6], [14, 38], [146, 45], [146, 11]
].map(([x, y]) => new Phaser.Point(x, y)));

const restartButton = new Phaser.Polygon([
  [14, 46], [14, 80], [143, 85], [146, 53]
].map(([x, y]) => new Phaser.Point(x, y)));

export default class extends MusicalState {
  // @ts-ignore
  behind: string;

  // @ts-ignore
  highlight: Highlight;

  init(music: Music, behind: string) {
    super.init(music);
    this.behind = behind || 'pot';
  }

  create() {
    this.game.input.keyboard.removeCallbacks();

    this.music.fadeTrack(500, 'title');

    this.game.add.image(0, 0, 'menu_background');
    const start = (this.behind === 'pot');
    const key = start ? 'menu_start' : 'menu_resume';
    const buttonSprite = this.game.add.sprite(0, 0, key);

    this.highlight = new Highlight(this.game, (x, y) => {
      if (start) {
        if (startButton.contains(x, y)) {
          return buttonSprite;
        }
      } else {
        if (resumeButton.contains(x, y) || restartButton.contains(x, y)) {
          return buttonSprite;
        }
      }
      return null;
    });

    this.game.input.onUp.add(() => {
      const x = this.game.input.x;
      const y = this.game.input.y;
      if (start) {
        if (startButton.contains(x, y)) {
          this.highlight.destroy();
          startState(this.game, this.behind, this.music);
        }
      } else {
        if (resumeButton.contains(x, y)) {
          this.highlight.destroy();
          startState(this.game, this.behind, this.music);
        } else if (restartButton.contains(x, y)) {
          this.highlight.destroy();
          startState(this.game, 'pot', this.music);
        }
      }
    });
  }

  render() {
    this.highlight.render();
  }
}
