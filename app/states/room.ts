export default function(game: Phaser.Game) {
  let musics: { [music: string]: Phaser.Sound };
  let wall: Phaser.Image;
  let fade: Phaser.Tween;
  let hover: Phaser.Signal;
  let hovering = true;

  let ateBean = false;

  return {
    init(theMusics: { [music: string]: Phaser.Sound }) {
      musics = theMusics;
    },

    create() {
      musics['2'].fadeTo(500, 0);
      musics['3'].fadeTo(500, 1);

      game.add.image(0, 0, 'room_bg');
      game.add.sprite(0, 0, 'room_vines');
      const beans = game.add.sprite(0, 0, 'room_beans');
      game.add.image(0, 0, 'room_int');
      game.add.image(0, 0, 'room_pot');
      const plant = game.add.sprite(0, 0, 'room_plant');
      wall = game.add.image(0, 0, 'room_ext');
      wall.alpha = 0;

      const toolbar = game.add.image(0, 0, 'toolbar');
      const toolOrig = game.add.image(0, 0, 'toolbar_orig');
      const toolBean = game.add.image(0, 0, 'toolbar_bean');
      const toolVine = game.add.image(0, 0, 'toolbar_vine');
      toolbar.alpha = 0;
      toolOrig.alpha = 0;
      toolBean.alpha = 0;
      toolVine.alpha = 0;

      function setupTool(tool: Phaser.Image) {
        tool.inputEnabled = true;
        tool.input.enableDrag();
        tool.events.onDragStop.add(() => {
          tool.x = 0;
          tool.y = 0;
        });
      }

      const darken = game.add.graphics();
      darken.beginFill(0x000000);
      darken.drawRect(0, 0, 160, 90);
      darken.endFill();
      game.add.tween(darken).to({ alpha: 0 }, 1000, Phaser.Easing.Default, true);

      plant.animations.add('fall');
      plant.animations.play('fall', 2);

      hover = new Phaser.Signal();
      const timer = game.time.create();
      timer.add(1000, () => {
        game.sound.play('thud', 5);
        hover.add(function() {
          const newAlpha = hovering ? 0 : 1;
          const time = Math.abs(newAlpha - wall.alpha) * 250;
          if (fade) {
            fade.stop();
          }
          fade = game.add.tween(wall);
          fade.to({ alpha: newAlpha }, time, Phaser.Easing.Default, true);
        });

        game.input.onDown.add(() => {
          if (!ateBean) {
            const leftBean = new Phaser.Rectangle(53, 53, 8, 15);
            const rightBean = new Phaser.Rectangle(73, 53, 8, 15);
            if (leftBean.contains(game.input.x, game.input.y)) {
              ateBean = true;
              beans.frame = 1;
            } else if (rightBean.contains(game.input.x, game.input.y)) {
              ateBean = true;
              beans.frame = 2;
            }
            if (ateBean) {
              const beanTimer = game.time.create();
              beanTimer.add(250, () => beans.frame = 3)
              beanTimer.start();

              const baseTween = game.add.tween(toolbar);
              const origTween = game.add.tween(toolOrig);
              const beanTween = game.add.tween(toolBean); // lel
              baseTween.to({ alpha: 1 }, 500);
              origTween.to({ alpha: 1 }, 500);
              beanTween.to({ alpha: 1 }, 500);
              baseTween.chain(origTween, beanTween);
              baseTween.start();

              setupTool(toolOrig);
              setupTool(toolBean);
            }
          }
        });
      });
      timer.start();
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
