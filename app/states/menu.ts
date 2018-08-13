import { Highlight } from '../highlight';
import { MusicalState, startState } from '../music';

const button = new Phaser.Polygon([
  [16, 25], [13, 57], [145, 64], [145, 30]
].map(([x, y]) => new Phaser.Point(x, y)));

export default class extends MusicalState {
  // @ts-ignore
  highlight: Highlight;

  create() {
    this.music.fadeTrack(500, 'title');

    this.game.add.image(0, 0, 'menu_background');
    const buttonSprite = this.game.add.sprite(0, 0, 'menu_start');

    this.highlight = new Highlight(this.game, (x, y) => {
      return button.contains(x, y) ? buttonSprite : null;
    });

    this.game.input.onUp.add(() => {
      if (button.contains(this.game.input.x, this.game.input.y)) {
        this.highlight.destroy();
        startState(this.game, 'room', this.music);
      }
    });
  }

  render() {
    this.highlight.render();
  }
}
