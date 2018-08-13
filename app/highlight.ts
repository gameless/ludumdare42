export class Highlight {
  readonly bmd: Phaser.BitmapData;

  constructor(
    readonly game: Phaser.Game,
    readonly target: (x: number, y: number) => Phaser.Sprite | null
  ) {
    this.bmd = game.make.bitmapData(160, 90);
    game.add.image(0, 0, this.bmd);
  }

  render() {
    this.bmd.clear();
    const target = this.target(this.game.input.x, this.game.input.y);
    if (target) {
      this.bmd.blendSourceOver();
      const alpha = this.game.input.activePointer.isDown ? 0.75 : 0.5;
      this.bmd.fill(0xff, 0xff, 0xff, alpha);
      this.bmd.blendDestinationIn();
      this.bmd.circle(this.game.input.x, this.game.input.y, 10);
      this.bmd.draw(target);
    }
  }

  destroy() {
    this.bmd.destroy();
  }
}
