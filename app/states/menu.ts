import { MusicalState, startState } from '../music';

const button = new Phaser.Polygon([
  [16, 25], [13, 57], [145, 64], [145, 30]
].map(([x, y]) => new Phaser.Point(x, y)));

export default class extends MusicalState {
  // @ts-ignore
  hl: Phaser.BitmapData;

  create() {
    this.music.tracks['title'].good.volume = 1;

    this.game.add.image(0, 0, 'menu_background');
    this.game.add.image(0, 0, 'menu_start');

    this.hl = this.game.make.bitmapData(160, 90);
    this.game.add.image(0, 0, this.hl);

    this.game.input.onUp.add(() => {
      if (button.contains(this.game.input.x, this.game.input.y)) {
        this.hl.destroy();
        startState(this.game, 'pot', this.music);
      }
    });
  }

  render() {
    this.hl.clear();
    if (button.contains(this.game.input.x, this.game.input.y)) {
      this.hl.blendSourceOver();
      const alpha = this.game.input.activePointer.isDown ? 0.75 : 0.5;
      this.hl.fill(0xff, 0xff, 0xff, alpha);
      this.hl.blendDestinationIn();
      this.hl.circle(this.game.input.x, this.game.input.y, 10);
      this.hl.draw('menu_start');
    }
  }
}
