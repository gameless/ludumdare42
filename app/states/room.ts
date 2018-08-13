import { delay } from '../delay';
import { fadeIn, fadeOut } from '../fade';
import { Highlight } from '../highlight';
import { escapeCode } from '../pause';
import { Music, MusicalState, startState } from '../music';

const leftBean = new Phaser.Rectangle(53, 53, 8, 15);
const rightBean = new Phaser.Rectangle(73, 53, 8, 15);

export default class extends MusicalState {
  startFade = true;

  // @ts-ignore
  highlight: Highlight;
  // @ts-ignore
  vines: Phaser.Sprite;
  // @ts-ignore
  beanLeft: Phaser.Sprite;
  // @ts-ignore
  beanRight: Phaser.Sprite;
  // @ts-ignore
  otherBeans: Phaser.Sprite;
  // @ts-ignore
  toolbar: Phaser.Image;
  // @ts-ignore
  toolOrig: Phaser.Image;
  // @ts-ignore
  toolBean: Phaser.Image;
  // @ts-ignore
  toolVine: Phaser.Image;

  init(music: Music, startFade: boolean) {
    super.init(music);
    this.startFade = startFade;
  }

  setupTool(
    tool: Phaser.Image,
    dots: [number, number][],
    action: (x: number, y: number) => void
  ) {
    const initialX = tool.x;
    const initialY = tool.y;

    tool.inputEnabled = true;
    tool.input.enableDrag();

    let sparkles: Phaser.Graphics[];

    tool.events.onDragStart.add(() => {
      sparkles = dots.map(([x, y]) => {
        const sparkle = this.game.add.graphics(x + 0.5, y + 0.5);
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
        this.game.add.tween(sparkle.scale).to(
          { x: 0, y: 0 }, 500, Phaser.Easing.Default, true, 0, -1, true
        );
        return sparkle;
      });
    });

    tool.events.onDragStop.add(() => {
      sparkles.forEach(sparkle => sparkle.destroy());
      sparkles = [];
      action(this.game.input.x, this.game.input.y);
      tool.x = initialX;
      tool.y = initialY;
    });
  }

  eatBean(right: boolean) {
    if (right) {
      this.beanRight.frame = 1;
    } else {
      this.beanLeft.frame = 1;
    }

    this.game.sound.play('effect_bean', 3);

    delay(this.game, 250, () => {
      this.beanLeft.frame = 1;
      this.beanRight.frame = 1;
    });
    this.otherBeans.animations.add('shrink').play(8);

    const baseTween = this.game.add.tween(this.toolbar);
    const origTween = this.game.add.tween(this.toolOrig);
    const beanTween = this.game.add.tween(this.toolBean); // lel
    baseTween.to({ alpha: 1 }, 500);
    origTween.to({ alpha: 1 }, 500);
    beanTween.to({ alpha: 1 }, 500);
    baseTween.chain(origTween, beanTween);
    baseTween.start();

    this.setupTool(this.toolOrig, [[88, 45]], (x, y) => {
      const vine = new Phaser.Rectangle(82, 40, 12, 12);
      if (this.beanRight.frame < 1 && vine.contains(x, y)) {
        this.game.sound.play('effect_snap');

        this.music.fadeTrack(500, 'fun4');

        this.vines.frame = 1;

        this.game.add.tween(this.toolVine).to({ alpha: 1 }, 500).start();
        this.setupTool(this.toolVine, [[88, 45]], (x, y) => {
          if (vine.contains(x, y)) {
            fadeOut(this.game, 1000);

            delay(this.game, 1000, () => {
              this.highlight.destroy();
              startState(this.game, 'planet', this.music);
            });
          }
        });
      }
    });

    let growths = 0;

    this.setupTool(this.toolBean, [[56, 63], [77, 63]], (x, y) => {
      if (leftBean.contains(x, y)) {
        growths++;
        this.game.sound.play('effect_grow' + growths);
        this.beanLeft.frame = 0;
      } else if (rightBean.contains(x, y)) {
        growths++;
        this.game.sound.play('effect_grow' + growths);
        this.beanRight.frame = 0;
      }
    });
  }

  create() {
    this.game.input.keyboard.removeCallbacks();

    this.music.fadeTrack(500, 'fun3');
    this.music.fadeBadness(500, 0);

    this.game.add.image(0, 0, 'room_bg');
    this.vines = this.game.add.sprite(0, 0, 'room_vines');
    this.beanLeft = this.game.add.sprite(0, 0, 'room_beanleft');
    this.beanRight = this.game.add.sprite(0, 0, 'room_beanright');
    this.otherBeans = this.game.add.sprite(0, 0, 'room_otherbeans');
    this.game.add.image(0, 0, 'room_int');
    const plant = this.game.add.sprite(0, 0, 'room_plant');
    this.game.add.image(0, 0, 'room_pot');
    this.toolbar = this.game.add.image(0, 0, 'room_toolbar');
    this.toolOrig = this.game.add.image(1, 2, 'room_toolorig');
    this.toolBean = this.game.add.image(12, 1, 'room_toolbean');
    this.toolVine = this.game.add.image(22, 3, 'room_toolvine');

    this.game.input.keyboard.addCallbacks(this, (event: KeyboardEvent) => {
      if (event.keyCode === escapeCode) {
        this.highlight.destroy();
        startState(this.game, 'menu', this.music, 'room');
      }
    });

    this.toolbar.alpha = 0;
    this.toolOrig.alpha = 0;
    this.toolBean.alpha = 0;
    this.toolVine.alpha = 0;

    let choseBean = false;
    let ateBean = false;

    this.highlight = new Highlight(this.game, (x, y) => {
      if (!ateBean) {
        if (leftBean.contains(x, y)) {
          return this.beanLeft;
        } else if (rightBean.contains(x, y)) {
          return this.beanRight;
        }
      }
      return null;
    });

    if (this.startFade) {
      fadeIn(this.game, 1000);
    }

    plant.animations.add('fall', [0, 1, 2]);
    plant.animations.play('fall', 2);

    delay(this.game, 1000, () => {
      this.game.sound.play('effect_thud', 5);

      this.game.input.onDown.add(() => {
        if (!choseBean) {
          if (leftBean.contains(this.game.input.x, this.game.input.y)) {
            choseBean = true;
            plant.animations.add('eat_left', [2, 8, 9, 10, 11, 2]);
            plant.animations.play('eat_left', 2);
            delay(this.game, 1000, () => {
              ateBean = true;
              this.eatBean(false);
            });
          } else if (rightBean.contains(this.game.input.x, this.game.input.y)) {
            choseBean = true;
            plant.animations.add('eat_right', [2, 3, 4, 5, 6, 7, 2]);
            plant.animations.play('eat_right', 3);
            delay(this.game, 1000, () => {
              ateBean = true;
              this.eatBean(true);
            });
          }
        }
      });
    });
  }

  render() {
    this.highlight.render();
  }
}
