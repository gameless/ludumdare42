import { Highlight } from '../highlight';
import { Music, startState } from '../music';

export default function(game: Phaser.Game) {
  let music: Music;
  let rootLeft: Phaser.Sprite;
  let rootRight: Phaser.Sprite;
  let pot: Phaser.Sprite;
  let fade: Phaser.Tween;
  let hover: Phaser.Signal;
  let highlight: Highlight;

  let hovering = false;
  let showCross = true;
  let shattered = false;

  let leftGrowth = 0;
  let rightGrowth = 0;

  return {
    init(theMusic: Music) {
      music = theMusic;
    },

    create() {
      music.fadeTrack(500, 'fun1');

      game.add.image(0, 0, 'pot_bg');
      game.add.image(0, 0, 'pot_shelf');
      game.add.image(0, 0, 'pot_shelf_hl');
      const potCross = game.add.image(0, 0, 'pot_cross');

      const root = game.add.image(0, 0, 'pot_root');
      rootLeft = game.add.sprite(0, 0, 'pot_rootleft');
      rootRight = game.add.sprite(0, 0, 'pot_rootright');

      const plant = game.add.sprite(0, 0, 'pot_plant');
      const blood = game.add.sprite(0, 0, 'pot_blood');

      blood.animations.add('spread');
      blood.animations.play('spread', 0.5);
      const wiltTimer = game.time.create();
      wiltTimer.add(16000, () => {
        music.fadeBadness(8000, 1);

        if (!shattered) {
          plant.animations.add('wilt');
          plant.animations.play('wilt', 0.25);
        }
      });
      wiltTimer.start();

      pot = game.add.sprite(0, 0, 'pot_pot');
      const pot_hl = game.add.image(0, 0, 'pot_pot_hl');

      highlight = new Highlight(game, (x, _) => {
        if (showCross) {
          if (hovering) {
            if (x < 80 && leftGrowth < 4) {
              return rootLeft;
            } else if (x >= 80 && rightGrowth < 3) {
              return rootRight;
            }
          }
        } else if (!shattered) {
          return pot;
        }
        return null;
      });

      hover = new Phaser.Signal();
      hover.add(function() {
        const newAlpha = (hovering && showCross) ? 0 : 1;
        const time = Math.abs(newAlpha - pot.alpha) * 250;
        if (fade) {
          fade.stop();
        }
        fade = game.add.tween(pot);
        fade.to({ alpha: newAlpha }, time, Phaser.Easing.Default, true);
      });

      game.input.onDown.add(function() {
        if (hovering) {
          if (showCross) {
            if (game.input.x < 80 && leftGrowth < 4) {
              leftGrowth++;
              game.sound.play('effect_root' + (leftGrowth + rightGrowth));
              rootLeft.frame = leftGrowth;
            }

            if (game.input.x >= 80 && rightGrowth < 3) {
              rightGrowth++;
              game.sound.play('effect_root' + (leftGrowth + rightGrowth));
              rootRight.frame = rightGrowth;
            }

            if (leftGrowth === 4 && rightGrowth === 3) {
              music.fadeTrack(500, 'fun2');

              pot_hl.destroy();
              rootRight.frame = rightGrowth + 1;
              pot.frame = 1;
              showCross = false;
              hover.dispatch();
            }
          } else if (!shattered) {
            shattered = true;

            game.sound.play('effect_shatter');

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
            backshards.push(game.add.image(0, 0, 'pot_backshard1'));
            backshards.push(game.add.image(0, 0, 'pot_backshard2'));
            backshards.push(game.add.image(0, 0, 'pot_backshard3'));
            backshards.push(game.add.image(0, 0, 'pot_backshard4'));
            backshards.push(game.add.image(0, 0, 'pot_backshard5'));
            backshards.push(game.add.image(0, 0, 'pot_backshard6'));

            const float = game.add.image(0, 0, 'pot_float');

            const frontshards: Phaser.Image[] = [];
            frontshards.push(game.add.image(0, 0, 'pot_frontshard1'));
            frontshards.push(game.add.image(0, 0, 'pot_frontshard2'));
            frontshards.push(game.add.image(0, 0, 'pot_frontshard3'));
            frontshards.push(game.add.image(0, 0, 'pot_frontshard4'));
            frontshards.push(game.add.image(0, 0, 'pot_frontshard5'));
            frontshards.push(game.add.image(0, 0, 'pot_frontshard6'));

            game.add.tween(backshards[0]).to({ x: -16, y: -15 }, shatterTime, easing, true);
            game.add.tween(backshards[1]).to({ x: 1, y: -20 }, shatterTime, easing, true);
            game.add.tween(backshards[2]).to({ x: 15, y: -20 }, shatterTime, easing, true);
            game.add.tween(backshards[3]).to({ x: -14, y: 3 }, shatterTime, easing, true);
            game.add.tween(backshards[4]).to({ x: 3, y: -7 }, shatterTime, easing, true);
            game.add.tween(backshards[5]).to({ x: 30, y: -1 }, shatterTime, easing, true);
            game.add.tween(frontshards[0]).to({ x: -29, y: -5 }, shatterTime, easing, true);
            game.add.tween(frontshards[1]).to({ x: -2, y: -3 }, shatterTime, easing, true);
            game.add.tween(frontshards[2]).to({ x: 14, y: -8 }, shatterTime, easing, true);
            game.add.tween(frontshards[3]).to({ x: 23, y: -14 }, shatterTime, easing, true);
            game.add.tween(frontshards[4]).to({ x: -20, y: 3 }, shatterTime, easing, true);
            game.add.tween(frontshards[5]).to({ x: 15, y: 2 }, shatterTime, easing, true);

            const timer = game.time.create();
            timer.add(shatterTime, () => {
              backshards.forEach(shard => shard.destroy());
              float.destroy();
              frontshards.forEach(shard => shard.destroy());

              const fall = game.add.image(0, 0, 'pot_fall');
              game.add.tween(fall).to({ y: 50 }, 1000, Phaser.Easing.Quadratic.In, true);
              game.add.image(0, 0, 'pot_mess');

              const darken = game.add.graphics();
              darken.beginFill(0x000000);
              darken.drawRect(0, 0, 160, 90);
              darken.endFill();
              game.add.tween(darken).from({ alpha: 0 }, 1000, Phaser.Easing.Default, true);

              game.camera.flash(0xffffff, 500);

              const innerTimer = game.time.create();
              innerTimer.add(1000, () => {
                highlight.destroy();
                startState(game, 'room', music);
              });
              innerTimer.start();
            });
            timer.start();
          }
        }
      });
    },

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

      const hoveringNow = closeToPot.contains(game.input.x, game.input.y);
      if (hoveringNow !== hovering) {
        hovering = hoveringNow;
        hover.dispatch();
      }
    },

    render() {
      highlight.render();
    }
  };
};
