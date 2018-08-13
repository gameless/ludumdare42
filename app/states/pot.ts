import * as _ from 'lodash';

import { delay } from '../delay';
import { fadeIn, fadeOut } from '../fade';
import { Highlight } from '../highlight';
import { Music, MusicalState, startState } from '../music';

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

const backshardDeltas = [
  [-16, -15], [1, -20], [15, -20], [-14, 3], [3, -7], [30, -1]
];

const frontshardDeltas = [
  [-29, -5], [-2, -3], [14, -8], [23, -14], [-20, 3], [15, 2]
];

export default class extends MusicalState {
  startFade = false;

  // @ts-ignore
  highlight: Highlight;

  init(music: Music, startFade: boolean) {
    super.init(music);
    this.startFade = startFade;
  }

  startBlood(plant: Phaser.Sprite, blood: Phaser.Sprite) {
    let shattered = false;
    blood.animations.add('spread');
    blood.animations.play('spread', 0.5);
    delay(this.game, 16000, () => {
      this.music.fadeBadness(8000, 1);
      if (!shattered) {
        plant.animations.add('wilt').play(0.25);
        delay(this.game, 8000, () => {
          if (!shattered) {
            fadeOut(this.game, 1000);
            delay(this.game, 1000, () => {
              startState(this.game, 'pot', this.music, true);
            });
          }
        });
      }
    });
    return () => shattered = true;
  }

  startCross(pot: Phaser.Sprite) {
    let fade: Phaser.Tween;
    let braced = false;
    let hovering = false;
    this.game.input.addMoveCallback(() => {
      const x = this.game.input.x;
      const y = this.game.input.y;
      const nowHovering = closeToPot.contains(x, y);
      if (!braced && nowHovering !== hovering) {
        hovering = nowHovering;
        const newAlpha = hovering ? 0 : 1;
        const time = Math.abs(newAlpha - pot.alpha) * 250;
        if (fade) {
          fade.stop();
        }
        fade = this.game.add.tween(pot);
        fade.to({ alpha: newAlpha }, time).start();
      }
    }, this);
    return () => {
      braced = true;
      fade.to({ alpha: 1 }, (1 - pot.alpha) * 250).start();
    };
  }

  create() {
    this.music.fadeTrack(500, 'fun1');
    this.music.fadeBadness(500, 0);

    this.game.add.image(0, 0, 'pot_bg');
    this.game.add.image(0, 0, 'pot_shelf');
    this.game.add.image(0, 0, 'pot_shelf_hl');
    const potCross = this.game.add.image(0, 0, 'pot_cross');
    const root = this.game.add.image(0, 0, 'pot_root');
    const rootLeft = this.game.add.sprite(0, 0, 'pot_rootleft');
    const rootRight = this.game.add.sprite(0, 0, 'pot_rootright');
    const plant = this.game.add.sprite(0, 0, 'pot_plant');
    const blood = this.game.add.sprite(0, 0, 'pot_blood');
    const pot = this.game.add.sprite(0, 0, 'pot_pot');
    const pot_hl = this.game.add.image(0, 0, 'pot_pot_hl');

    let leftGrowth = 0;
    let rightGrowth = 0;
    let braced = false;
    let shattered = false;

    this.highlight = new Highlight(this.game, (x, y) => {
      if (!braced) {
        if (closeToPot.contains(x, y)) {
          if (x < 80) {
            if (leftGrowth < 4) {
              return rootLeft;
            }
          } else {
            if (rightGrowth < 3) {
              return rootRight
            }
          }
        }
      } else if (!shattered) {
        return pot;
      }
      return null;
    });

    if (this.startFade) {
      fadeIn(this.game, 1000);
    }

    const stopBlood = this.startBlood(plant, blood);
    const stopCross = this.startCross(pot);

    this.game.input.onUp.add(() => {
      if (closeToPot.contains(this.game.input.x, this.game.input.y)) {
        if (!braced) {
          let grew = false;
          if (this.game.input.x < 80) {
            if (leftGrowth < 4) {
              leftGrowth++;
              rootLeft.frame = leftGrowth;
              grew = true;
            }
          } else {
            if (rightGrowth < 3) {
              rightGrowth++;
              rootRight.frame = rightGrowth;
              grew = true;
            }
          }
          if (grew) {
            this.game.sound.play('effect_root' + (leftGrowth + rightGrowth));
          }

          if (leftGrowth === 4 && rightGrowth === 3) {
            braced = true;
            stopCross();
            this.music.fadeTrack(500, 'fun2');
            pot_hl.destroy();
            rootRight.frame = rightGrowth + 1;
            pot.frame = 1;
          }
        } else if (!shattered) {
          shattered = true;
          stopBlood();

          this.music.fadeBadness(500, 0);

          this.game.sound.play('effect_shatter');

          potCross.destroy();
          root.destroy();
          rootLeft.destroy();
          rootRight.destroy();
          plant.destroy();
          blood.destroy();
          pot.destroy();

          const shatterTime = 375;
          const easing = Phaser.Easing.Sinusoidal.InOut;

          const backshards = _.range(1, 7).map(i => {
            const shard = this.game.add.image(0, 0, 'pot_backshard' + i);
            const [x, y] = backshardDeltas[i - 1];
            const tween = this.game.add.tween(shard);
            tween.to({ x: x, y: y }, shatterTime, easing, true);
            return shard;
          });
          const float = this.game.add.image(0, 0, 'pot_float');
          const frontshards = _.range(1, 7).map(i => {
            const shard = this.game.add.image(0, 0, 'pot_frontshard' + i);
            const [x, y] = frontshardDeltas[i - 1];
            const tween = this.game.add.tween(shard);
            tween.to({ x: x, y: y }, shatterTime, easing, true);
            return shard;
          });

          delay(this.game, shatterTime, () => {
            backshards.forEach(shard => shard.destroy());
            float.destroy();
            frontshards.forEach(shard => shard.destroy());

            const fall = this.game.add.image(0, 0, 'pot_fall');
            const fallTween = this.game.add.tween(fall)
            fallTween.to({ y: 50 }, 1000, Phaser.Easing.Quadratic.In, true);
            this.game.add.image(0, 0, 'pot_mess');

            fadeOut(this.game, 1000);
            this.game.camera.flash(0xffffff, 500);

            delay(this.game, 1000, () => {
              this.highlight.destroy();
              startState(this.game, 'room', this.music);
            });
          });
        }
      }
    });
  }

  render() {
    this.highlight.render();
  }
}
