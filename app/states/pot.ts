export default function(game: Phaser.Game) {
  const closeToPot = new Phaser.Polygon([
    [37, 44],
    [50, 81],
    [67, 86],
    [89, 86],
    [105, 80],
    [114, 44],
    [100, 33],
    [50, 33]
  ].map(([x, y]) => new Phaser.Point(x, y)));
  let pot: Phaser.Image;

  return {
    create() {
      game.sound.play('pot_music', 1, true);

      game.add.image(0, 0, 'background');
      game.add.image(0, 0, 'shelf');
      game.add.image(0, 0, 'pot_cross');
      game.add.image(0, 0, 'root');
      pot = game.add.image(0, 0, 'pot');
      game.add.image(0, 0, 'plant');
      game.add.image(0, 0, 'highlight');
    },

    render() {
      const mouseX = game.input.mousePointer.x;
      const mouseY = game.input.mousePointer.y;
      pot.alpha = closeToPot.contains(mouseX, mouseY) ? 0 : 1;
    }
  };
};
