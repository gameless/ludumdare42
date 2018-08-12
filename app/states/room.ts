export default function(game: Phaser.Game) {
  let musics: { [music: string]: Phaser.Sound };
  let wall: Phaser.Image;
  let fade: Phaser.Tween;
  let hover: Phaser.Signal;
  let hovering = false;

  return {
    init(theMusics: { [music: string]: Phaser.Sound }) {
      musics = theMusics;
    },

    create() {
      musics['2'].fadeTo(500, 0);
      musics['3'].fadeTo(500, 1);

      game.add.image(0, 0, 'room_bg');
      game.add.image(0, 0, 'room_vines');
      game.add.image(0, 0, 'room_beans');
      game.add.image(0, 0, 'room_int');
      game.add.image(0, 0, 'room_pot');
      game.add.image(0, 0, 'room_plant');
      wall = game.add.image(0, 0, 'room_ext');

      const darken = game.add.graphics();
      darken.beginFill(0x000000);
      darken.drawRect(0, 0, 160, 90);
      darken.endFill();
      game.add.tween(darken).to({ alpha: 0 }, 500, Phaser.Easing.Default, true);

      hover = new Phaser.Signal();
      hover.add(function() {
        const newAlpha = hovering ? 0 : 1;
        const time = Math.abs(newAlpha - wall.alpha) * 250;
        if (fade) {
          fade.stop();
        }
        fade = game.add.tween(wall);
        fade.to({ alpha: newAlpha }, time, Phaser.Easing.Default, true);
      });
    },

    update() {
      const closeToWall = new Phaser.Polygon([
        [25, 15], [135, 15], [135, 85], [25, 85]
      ].map(([x, y]) => new Phaser.Point(x, y)));

      const mouseX = game.input.mousePointer.x;
      const mouseY = game.input.mousePointer.y;
      const hoveringNow = closeToWall.contains(mouseX, mouseY);
      if (hoveringNow !== hovering) {
        hovering = hoveringNow;
        hover.dispatch();
      }
    }
  };
};
