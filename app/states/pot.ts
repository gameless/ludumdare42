import { delay } from '../delay';
import { Highlight } from '../highlight';
import { MusicalState, startState } from '../music';

export default class extends MusicalState {
  // @ts-ignore
  hover: Phaser.Signal;
  // @ts-ignore
  highlight: Highlight;

  hovering = false;
  shattered = false;

  create() {
    const self = this;

    self.music.fadeTrack(500, 'fun1');

    self.game.add.image(0, 0, 'pot_bg');
    self.game.add.image(0, 0, 'pot_shelf');
    self.game.add.image(0, 0, 'pot_shelf_hl');
    let showCross = true;
    const potCross = self.game.add.image(0, 0, 'pot_cross');

    const root = self.game.add.image(0, 0, 'pot_root');
    let leftGrowth = 0;
    const rootLeft = self.game.add.sprite(0, 0, 'pot_rootleft');
    let rightGrowth = 0;
    const rootRight = self.game.add.sprite(0, 0, 'pot_rootright');

    const plant = self.game.add.sprite(0, 0, 'pot_plant');
    const blood = self.game.add.sprite(0, 0, 'pot_blood');

    blood.animations.add('spread');
    blood.animations.play('spread', 0.5);
    delay(self.game, 16000, () => {
      self.music.fadeBadness(8000, 1);

      if (!self.shattered) {
        plant.animations.add('wilt');
        plant.animations.play('wilt', 0.25);
      }
    });

    const pot = self.game.add.sprite(0, 0, 'pot_pot');
    const pot_hl = self.game.add.image(0, 0, 'pot_pot_hl');

    self.highlight = new Highlight(self.game, (x, _) => {
      if (showCross) {
        if (self.hovering) {
          if (x < 80 && leftGrowth < 4) {
            return rootLeft;
          } else if (x >= 80 && rightGrowth < 3) {
            return rootRight;
          }
        }
      } else if (!self.shattered) {
        return pot;
      }
      return null;
    });

    let fade: Phaser.Tween;
    self.hover = new Phaser.Signal();
    self.hover.add(function() {
      const newAlpha = (self.hovering && showCross) ? 0 : 1;
      const time = Math.abs(newAlpha - pot.alpha) * 250;
      if (fade) {
        fade.stop();
      }
      fade = self.game.add.tween(pot);
      fade.to({ alpha: newAlpha }, time).start();
    });

    self.game.input.onDown.add(function() {
      if (self.hovering) {
        if (showCross) {
          if (self.game.input.x < 80 && leftGrowth < 4) {
            leftGrowth++;
            self.game.sound.play('effect_root' + (leftGrowth + rightGrowth));
            rootLeft.frame = leftGrowth;
          }

          if (self.game.input.x >= 80 && rightGrowth < 3) {
            rightGrowth++;
            self.game.sound.play('effect_root' + (leftGrowth + rightGrowth));
            rootRight.frame = rightGrowth;
          }

          if (leftGrowth === 4 && rightGrowth === 3) {
            self.music.fadeTrack(500, 'fun2');

            pot_hl.destroy();
            rootRight.frame = rightGrowth + 1;
            pot.frame = 1;
            showCross = false;
            self.hover.dispatch();
          }
        } else if (!self.shattered) {
          self.shattered = true;

          self.game.sound.play('effect_shatter');

          potCross.destroy();
          root.destroy();
          rootLeft.destroy();
          rootRight.destroy();
          plant.destroy();
          blood.destroy();
          pot.destroy();

          const shatterTime = 375;
          const easing = Phaser.Easing.Sinusoidal.InOut;

          const backshards: Phaser.Image[] = [];
          backshards.push(self.game.add.image(0, 0, 'pot_backshard1'));
          backshards.push(self.game.add.image(0, 0, 'pot_backshard2'));
          backshards.push(self.game.add.image(0, 0, 'pot_backshard3'));
          backshards.push(self.game.add.image(0, 0, 'pot_backshard4'));
          backshards.push(self.game.add.image(0, 0, 'pot_backshard5'));
          backshards.push(self.game.add.image(0, 0, 'pot_backshard6'));

          const float = self.game.add.image(0, 0, 'pot_float');

          const frontshards: Phaser.Image[] = [];
          frontshards.push(self.game.add.image(0, 0, 'pot_frontshard1'));
          frontshards.push(self.game.add.image(0, 0, 'pot_frontshard2'));
          frontshards.push(self.game.add.image(0, 0, 'pot_frontshard3'));
          frontshards.push(self.game.add.image(0, 0, 'pot_frontshard4'));
          frontshards.push(self.game.add.image(0, 0, 'pot_frontshard5'));
          frontshards.push(self.game.add.image(0, 0, 'pot_frontshard6'));

          self.game.add.tween(backshards[0]).to({ x: -16, y: -15 }, shatterTime, easing, true);
          self.game.add.tween(backshards[1]).to({ x: 1, y: -20 }, shatterTime, easing, true);
          self.game.add.tween(backshards[2]).to({ x: 15, y: -20 }, shatterTime, easing, true);
          self.game.add.tween(backshards[3]).to({ x: -14, y: 3 }, shatterTime, easing, true);
          self.game.add.tween(backshards[4]).to({ x: 3, y: -7 }, shatterTime, easing, true);
          self.game.add.tween(backshards[5]).to({ x: 30, y: -1 }, shatterTime, easing, true);
          self.game.add.tween(frontshards[0]).to({ x: -29, y: -5 }, shatterTime, easing, true);
          self.game.add.tween(frontshards[1]).to({ x: -2, y: -3 }, shatterTime, easing, true);
          self.game.add.tween(frontshards[2]).to({ x: 14, y: -8 }, shatterTime, easing, true);
          self.game.add.tween(frontshards[3]).to({ x: 23, y: -14 }, shatterTime, easing, true);
          self.game.add.tween(frontshards[4]).to({ x: -20, y: 3 }, shatterTime, easing, true);
          self.game.add.tween(frontshards[5]).to({ x: 15, y: 2 }, shatterTime, easing, true);

          delay(self.game, shatterTime, () => {
            backshards.forEach(shard => shard.destroy());
            float.destroy();
            frontshards.forEach(shard => shard.destroy());

            const fall = self.game.add.image(0, 0, 'pot_fall');
            self.game.add.tween(fall).to({ y: 50 }, 1000, Phaser.Easing.Quadratic.In, true);
            self.game.add.image(0, 0, 'pot_mess');

            const darken = self.game.add.graphics();
            darken.beginFill(0x000000);
            darken.drawRect(0, 0, 160, 90);
            darken.endFill();
            self.game.add.tween(darken).from({ alpha: 0 }, 1000).start();

            self.game.camera.flash(0xffffff, 500);

            delay(self.game, 1000, () => {
              self.highlight.destroy();
              startState(self.game, 'room', self.music);
            });
          });
        }
      }
    });
  }

  update() {
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

    const hoveringNow = closeToPot.contains(this.game.input.x, this.game.input.y);
    if (hoveringNow !== this.hovering) {
      this.hovering = hoveringNow;
      this.hover.dispatch();
    }
  }

  render() {
    this.highlight.render();
  }
}
