import { Music, startState } from '../music';

export default function(game: Phaser.Game) {
  let music: Music;

  let beanLeft: Phaser.Sprite;
  let beanRight: Phaser.Sprite;
  let hl: Phaser.BitmapData;

  const leftBean = new Phaser.Rectangle(53, 53, 8, 15);
  const rightBean = new Phaser.Rectangle(73, 53, 8, 15);

  let choseBean = false;
  let ateBean = false;
  let growths = 0;

  return {
    init(theMusic: Music) {
      music = theMusic;
    },

    create() {
      music.tracks['fun2'].good.fadeTo(500, 0);
      music.tracks['fun3'].good.fadeTo(500, 1);

      game.add.image(0, 0, 'room_bg');
      const vines = game.add.sprite(0, 0, 'room_vines');
      beanLeft = game.add.sprite(0, 0, 'room_beanleft');
      beanRight = game.add.sprite(0, 0, 'room_beanright');
      const otherBeans = game.add.sprite(0, 0, 'room_otherbeans');
      game.add.image(0, 0, 'room_int');
      const plant = game.add.sprite(0, 0, 'room_plant');
      game.add.image(0, 0, 'room_pot');

      hl = game.make.bitmapData(160, 90);
      game.add.image(0, 0, hl);

      const toolbar = game.add.image(0, 0, 'room_toolbar');
      const toolOrig = game.add.image(1, 2, 'room_toolorig');
      const toolBean = game.add.image(12, 1, 'room_toolbean');
      const toolVine = game.add.image(22, 3, 'room_toolvine');
      toolbar.alpha = 0;
      toolOrig.alpha = 0;
      toolBean.alpha = 0;
      toolVine.alpha = 0;

      function setupTool(tool: Phaser.Image, dots: number[][], action: (x: number, y: number) => void) {
        const initialX = tool.x;
        const initialY = tool.y;

        tool.inputEnabled = true;
        tool.input.enableDrag();

        let sparkles: Phaser.Graphics[];

        tool.events.onDragStart.add(() => {
          sparkles = dots.map(([x, y]) => {
            const sparkle = game.add.graphics(x + 0.5, y + 0.5);
            sparkle.alpha = 0.75;
            sparkle.beginFill(0xffffff);
            sparkle.drawPolygon([
              [0, -2.5],
              [-0.5, -0.5],
              [-2.5, 0],
              [-0.5, 0.5],
              [0, 2.5],
              [0.5, 0.5],
              [2.5, 0],
              [0.5, -0.5]
            ]);
            sparkle.endFill();
            game.add.tween(sparkle.scale).to(
              { x: 0, y: 0 }, 500, Phaser.Easing.Default, true, 0, -1, true
            );
            return sparkle;
          });
        });

        tool.events.onDragStop.add(() => {
          sparkles.forEach(sparkle => sparkle.destroy());
          sparkles = [];
          action(game.input.x, game.input.y);
          tool.x = initialX;
          tool.y = initialY;
        });
      }

      const darken = game.add.graphics();
      darken.beginFill(0x000000);
      darken.drawRect(0, 0, 160, 90);
      darken.endFill();
      game.add.tween(darken).to({ alpha: 0 }, 1000, Phaser.Easing.Default, true);

      plant.animations.add('fall', [0, 1, 2]);
      plant.animations.play('fall', 2);

      function eatBean(right: boolean) {
        ateBean = true;

        if (right) {
          beanRight.frame = 1;
        } else {
          beanLeft.frame = 1;
        }

        game.sound.play('effect_bean', 3);

        const beanTimer = game.time.create();
        beanTimer.add(250, () => {
          beanLeft.frame = 1;
          beanRight.frame = 1;
        });
        beanTimer.start();
        otherBeans.animations.add('shrink').play(8);

        const baseTween = game.add.tween(toolbar);
        const origTween = game.add.tween(toolOrig);
        const beanTween = game.add.tween(toolBean); // lel
        baseTween.to({ alpha: 1 }, 500);
        origTween.to({ alpha: 1 }, 500);
        beanTween.to({ alpha: 1 }, 500);
        baseTween.chain(origTween, beanTween);
        baseTween.start();

        setupTool(toolOrig, [[88, 45]], (x, y) => {
          const vine = new Phaser.Rectangle(82, 40, 12, 12);
          if (beanRight.frame < 1 && vine.contains(x, y)) {
            game.sound.play('effect_snap');

            music.tracks['fun3'].good.fadeTo(500, 0);
            music.tracks['fun4'].good.fadeTo(500, 1);

            vines.frame = 1;

            game.add.tween(toolVine).to({ alpha: 1 }, 500).start();
            setupTool(toolVine, [[88, 45]], (x, y) => {
              if (vine.contains(x, y)) {
                const darken = game.add.graphics();
                darken.beginFill(0x000000);
                darken.drawRect(0, 0, 160, 90);
                darken.endFill();
                game.add.tween(darken).from({ alpha: 0 }, 1000, Phaser.Easing.Default, true);

                const innerTimer = game.time.create();
                innerTimer.add(1000, () => {
                  hl.destroy();
                  startState(game, 'planet', music);
                });
                innerTimer.start();
              }
            });
          }
        });
        setupTool(toolBean, [[56, 63], [77, 63]], (x, y) => {
          if (leftBean.contains(x, y)) {
            growths++;
            game.sound.play('effect_grow' + growths);
            beanLeft.frame = 0;
          } else if (rightBean.contains(x, y)) {
            growths++;
            game.sound.play('effect_grow' + growths);
            beanRight.frame = 0;
          }
        });
      }

      const timer = game.time.create();
      timer.add(1000, () => {
        game.sound.play('effect_thud', 5);

        game.input.onDown.add(() => {
          if (!choseBean) {
            if (leftBean.contains(game.input.x, game.input.y)) {
              choseBean = true;
              plant.animations.add('eat_left', [2, 8, 9, 10, 11, 2]);
              plant.animations.play('eat_left', 2);
              const innerTimer = game.time.create();
              innerTimer.add(1000, () => eatBean(false));
              innerTimer.start();
            } else if (rightBean.contains(game.input.x, game.input.y)) {
              choseBean = true;
              plant.animations.add('eat_right', [2, 3, 4, 5, 6, 7, 2]);
              plant.animations.play('eat_right', 3);
              const innerTimer = game.time.create();
              innerTimer.add(1000, () => eatBean(true));
              innerTimer.start();
            }
          }
        });
      });
      timer.start();
    },

    render() {
      hl.clear();
      hl.blendSourceOver();
      const alpha = game.input.activePointer.isDown ? 0.75 : 0.5;
      hl.fill(0xff, 0xff, 0xff, alpha);
      hl.blendDestinationIn();
      hl.circle(game.input.x, game.input.y, 10);
      if (!ateBean) {
        if (leftBean.contains(game.input.x, game.input.y)) {
          hl.draw(beanLeft);
        } else if (rightBean.contains(game.input.x, game.input.y)) {
          hl.draw(beanRight);
        } else {
          hl.clear();
        }
      } else {
        hl.clear()
      }
    }
  };
};
