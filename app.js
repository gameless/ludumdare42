(function() {
  'use strict';

  var globals = typeof global === 'undefined' ? self : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var aliases = {};
  var has = {}.hasOwnProperty;

  var expRe = /^\.\.?(\/|$)/;
  var expand = function(root, name) {
    var results = [], part;
    var parts = (expRe.test(name) ? root + '/' + name : name).split('/');
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function expanded(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var hot = hmr && hmr.createHot(name);
    var module = {id: name, exports: {}, hot: hot};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var expandAlias = function(name) {
    return aliases[name] ? expandAlias(aliases[name]) : name;
  };

  var _resolve = function(name, dep) {
    return expandAlias(expand(dirname(name), dep));
  };

  var require = function(name, loaderPath) {
    if (loaderPath == null) loaderPath = '/';
    var path = expandAlias(name);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    throw new Error("Cannot find module '" + name + "' from '" + loaderPath + "'");
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  var extRe = /\.[^.\/]+$/;
  var indexRe = /\/index(\.[^\/]+)?$/;
  var addExtensions = function(bundle) {
    if (extRe.test(bundle)) {
      var alias = bundle.replace(extRe, '');
      if (!has.call(aliases, alias) || aliases[alias].replace(extRe, '') === alias + '/index') {
        aliases[alias] = bundle;
      }
    }

    if (indexRe.test(bundle)) {
      var iAlias = bundle.replace(indexRe, '');
      if (!has.call(aliases, iAlias)) {
        aliases[iAlias] = bundle;
      }
    }
  };

  require.register = require.define = function(bundle, fn) {
    if (bundle && typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          require.register(key, bundle[key]);
        }
      }
    } else {
      modules[bundle] = fn;
      delete cache[bundle];
      addExtensions(bundle);
    }
  };

  require.list = function() {
    var list = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        list.push(item);
      }
    }
    return list;
  };

  var hmr = globals._hmr && new globals._hmr(_resolve, require, modules, cache);
  require._cache = cache;
  require.hmr = hmr && hmr.wrap;
  require.brunch = true;
  globals.require = require;
})();

(function() {
var global = typeof window === 'undefined' ? this : window;
var __makeRelativeRequire = function(require, mappings, pref) {
  var none = {};
  var tryReq = function(name, pref) {
    var val;
    try {
      val = require(pref + '/node_modules/' + name);
      return val;
    } catch (e) {
      if (e.toString().indexOf('Cannot find module') === -1) {
        throw e;
      }

      if (pref.indexOf('node_modules') !== -1) {
        var s = pref.split('/');
        var i = s.lastIndexOf('node_modules');
        var newPref = s.slice(0, i).join('/');
        return tryReq(name, newPref);
      }
    }
    return none;
  };
  return function(name) {
    if (name in mappings) name = mappings[name];
    if (!name) return;
    if (name[0] !== '.' && pref) {
      var val = tryReq(name, pref);
      if (val !== none) return val;
    }
    return require(name);
  }
};
require.register("initialize.ts", function(exports, require, module) {
/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts"/>
"use strict";
var boot_1 = require("./states/boot");
var menu_1 = require("./states/menu");
var pot_1 = require("./states/pot");
var room_1 = require("./states/room");
var planet_1 = require("./states/planet");
var game = new Phaser.Game({ width: 160, height: 90, parent: 'parent', antialias: false });
game.state.add('boot', boot_1.default(game));
game.state.add('menu', menu_1.default(game));
game.state.add('pot', pot_1.default(game));
game.state.add('room', room_1.default(game));
game.state.add('planet', planet_1.default(game));
game.state.start('boot');


});

require.register("states/boot.ts", function(exports, require, module) {
"use strict";
function default_1(game) {
    function loadAudio(key, filename) {
        game.load.audio(key, [
            'Audio/OggFiles/' + filename + '.ogg',
            'Audio/WavFiles/' + filename + '.wav'
        ]);
    }
    return {
        preload: function () {
            loadAudio('music0', 'Music/TitleMusic');
            loadAudio('music1', 'Music/Fun1');
            loadAudio('music2', 'Music/Fun2');
            loadAudio('music3', 'Music/Fun3');
            loadAudio('music4', 'Music/Fun4');
            loadAudio('music5', 'Music/LongEndHalfWhirr');
            game.load.image('menu_background', 'Image/menu/startmenubackground.png');
            game.load.image('menu_start', 'Image/menu/startmenu.png');
            game.load.image('menu_resume', 'Image/menu/resumenu.png');
            game.load.image('toolbar', 'Image/scene2/toolbar.png');
            game.load.image('toolbar_orig', 'Image/scene2/planticon (1,2).png');
            game.load.image('toolbar_bean', 'Image/scene2/beanicon (12,1).png');
            game.load.image('toolbar_vine', 'Image/scene2/vineicon (22,3).png');
            loadAudio('root1', 'SoundEffects/RootGrow1');
            loadAudio('root2', 'SoundEffects/RootGrow2');
            loadAudio('root3', 'SoundEffects/RootGrow3');
            loadAudio('root4', 'SoundEffects/RootGrow4');
            loadAudio('root5', 'SoundEffects/RootGrow5');
            loadAudio('root6', 'SoundEffects/RootGrow6');
            loadAudio('root7', 'SoundEffects/RootGrow7');
            loadAudio('shatter', 'SoundEffects/PotShattering');
            game.load.image('pot_bg', 'Image/scene1/blurredbg.png');
            game.load.image('pot_shelf', 'Image/scene1/shelf.png');
            game.load.image('pot_shelf_hl', 'Image/scene1/shelfhighlighting.png');
            game.load.image('pot_cross', 'Image/scene1/pottransparent.png');
            game.load.image('pot_root', 'Image/scene1/root1.png');
            game.load.image('pot_pot_hl', 'Image/scene1/pothighlighting.png');
            game.load.image('pot_plant', 'Image/scene1/plant1.png');
            game.load.image('pot_backshard1', 'Image/scene1/potbreaking shards/backshard1start.png');
            game.load.image('pot_backshard2', 'Image/scene1/potbreaking shards/backshard2start.png');
            game.load.image('pot_backshard3', 'Image/scene1/potbreaking shards/backshard3start.png');
            game.load.image('pot_backshard4', 'Image/scene1/potbreaking shards/backshard4start.png');
            game.load.image('pot_backshard5', 'Image/scene1/potbreaking shards/backshard5start.png');
            game.load.image('pot_backshard6', 'Image/scene1/potbreaking shards/backshard6start.png');
            game.load.image('pot_float', 'Image/scene1/potbreaking shards/plantanddirt.png');
            game.load.image('pot_frontshard1', 'Image/scene1/potbreaking shards/frontshard1start.png');
            game.load.image('pot_frontshard2', 'Image/scene1/potbreaking shards/frontshard2start.png');
            game.load.image('pot_frontshard3', 'Image/scene1/potbreaking shards/frontshard3start.png');
            game.load.image('pot_frontshard4', 'Image/scene1/potbreaking shards/frontshard4start.png');
            game.load.image('pot_frontshard5', 'Image/scene1/potbreaking shards/frontshard5start.png');
            game.load.image('pot_frontshard6', 'Image/scene1/potbreaking shards/frontshard6start.png');
            game.load.image('pot_mess', 'Image/scene1/potmess(frame1).png');
            game.load.image('pot_fall', 'Image/scene1/plantfall(frame1).png');
            game.load.spritesheet('pot_pot', 'Image/scene1/potbreaking spritesheet.png', 160, 90);
            game.load.spritesheet('pot_rootleft', 'Image/scene1/rootleft spritesheet.png', 160, 90);
            game.load.spritesheet('pot_rootright', 'Image/scene1/rootright spritesheet.png', 160, 90);
            loadAudio('thud', 'SoundEffects/Thud');
            loadAudio('bean', 'SoundEffects/BeanPlant');
            loadAudio('grow1', 'SoundEffects/Grow1');
            loadAudio('grow2', 'SoundEffects/Grow2');
            loadAudio('grow3', 'SoundEffects/Grow3');
            loadAudio('grow4', 'SoundEffects/Grow4');
            loadAudio('grow5', 'SoundEffects/Grow5');
            loadAudio('grow6', 'SoundEffects/Grow6');
            loadAudio('snap', 'SoundEffects/VineSnap');
            game.load.image('room_bg', 'Image/scene2/background2.png');
            game.load.image('room_int', 'Image/scene2/wallinterior.png');
            game.load.image('room_pot', 'Image/scene2/brokenpotshards.png');
            game.load.image('room_ext', 'Image/scene2/wallexterior.png');
            game.load.spritesheet('room_vines', 'Image/scene2/vine spritesheet.png', 160, 90);
            game.load.spritesheet('room_beanleft', 'Image/scene2/beanleft spritesheet.png', 160, 90);
            game.load.spritesheet('room_beanright', 'Image/scene2/beanright spritesheet.png', 160, 90);
            game.load.spritesheet('room_otherbeans', 'Image/scene2/otherbeans spritesheet.png', 160, 90);
            game.load.spritesheet('room_plant', 'Image/scene2/plantfall spritesheet.png', 160, 90);
        },
        create: function () {
            game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            game.scale.setUserScale(7, 7);
            game.renderer.renderSession.roundPixels = true;
            Phaser.Canvas.setImageRenderingCrisp(game.canvas);
            game.camera.bounds = game.world.bounds;
            var musics = [];
            musics.push(game.sound.play('music0', 1, true));
            musics.push(game.sound.play('music1', 0, true));
            musics.push(game.sound.play('music2', 0, true));
            musics.push(game.sound.play('music3', 0, true));
            musics.push(game.sound.play('music4', 0, true));
            musics.push(game.sound.play('music5', 0, true));
            game.state.start('menu', true, false, musics);
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;


});

require.register("states/menu.ts", function(exports, require, module) {
"use strict";
function default_1(game) {
    var button = new Phaser.Polygon([
        [16, 25], [13, 57], [145, 64], [145, 30]
    ].map(function (_a) {
        var x = _a[0], y = _a[1];
        return new Phaser.Point(x, y);
    }));
    var musics;
    var hl;
    return {
        init: function (theMusics) {
            musics = theMusics;
        },
        create: function () {
            game.add.image(0, 0, 'menu_background');
            game.add.image(0, 0, 'menu_start');
            hl = game.make.bitmapData(160, 90);
            game.add.image(0, 0, hl);
            game.input.onUp.add(function () {
                if (button.contains(game.input.x, game.input.y)) {
                    hl.destroy();
                    game.state.start('pot', true, false, musics);
                }
            });
        },
        render: function () {
            hl.clear();
            if (button.contains(game.input.x, game.input.y)) {
                hl.blendSourceOver();
                var alpha = game.input.activePointer.isDown ? 0.75 : 0.5;
                hl.fill(0xff, 0xff, 0xff, alpha);
                hl.blendDestinationIn();
                hl.circle(game.input.x, game.input.y, 10);
                hl.draw('menu_start');
            }
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;


});

require.register("states/planet.ts", function(exports, require, module) {
"use strict";
function default_1(game) {
    var musics;
    return {
        init: function (theMusics) {
            musics = theMusics;
        },
        create: function () {
            musics[0].fadeTo(500, 0);
            musics[1].fadeTo(500, 0);
            musics[2].fadeTo(500, 0);
            musics[3].fadeTo(500, 0);
            musics[4].fadeTo(500, 0);
            musics[5].fadeTo(500, 1);
            game.add.image(0, 0, 'room_bg'); // temporary
            var darken = game.add.graphics();
            darken.beginFill(0x000000);
            darken.drawRect(0, 0, 160, 90);
            darken.endFill();
            game.add.tween(darken).to({ alpha: 0 }, 1000, Phaser.Easing.Default, true);
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;


});

require.register("states/pot.ts", function(exports, require, module) {
"use strict";
function default_1(game) {
    var musics;
    var rootLeft;
    var rootRight;
    var pot;
    var fade;
    var hover;
    var hl;
    var hl_image;
    var hovering = false;
    var showCross = true;
    var shattered = false;
    var leftGrowth = 0;
    var rightGrowth = 0;
    return {
        init: function (theMusics) {
            musics = theMusics;
        },
        create: function () {
            musics[0].fadeTo(500, 0);
            musics[1].fadeTo(500, 1);
            game.add.image(0, 0, 'pot_bg');
            game.add.image(0, 0, 'pot_shelf');
            game.add.image(0, 0, 'pot_shelf_hl');
            var potCross = game.add.image(0, 0, 'pot_cross');
            var root = game.add.image(0, 0, 'pot_root');
            rootLeft = game.add.sprite(0, 0, 'pot_rootleft');
            rootRight = game.add.sprite(0, 0, 'pot_rootright');
            hl = game.make.bitmapData(160, 90);
            hl_image = game.add.image(0, 0, hl);
            pot = game.add.sprite(0, 0, 'pot_pot');
            var pot_hl = game.add.image(0, 0, 'pot_pot_hl');
            var plant = game.add.image(0, 0, 'pot_plant');
            hover = new Phaser.Signal();
            hover.add(function () {
                var newAlpha = (hovering && showCross) ? 0 : 1;
                var time = Math.abs(newAlpha - pot.alpha) * 250;
                if (fade) {
                    fade.stop();
                }
                fade = game.add.tween(pot);
                fade.to({ alpha: newAlpha }, time, Phaser.Easing.Default, true);
            });
            game.input.onDown.add(function () {
                if (hovering) {
                    if (showCross) {
                        if (game.input.x < 80 && leftGrowth < 4) {
                            leftGrowth++;
                            game.sound.play('root' + (leftGrowth + rightGrowth));
                            rootLeft.frame = leftGrowth;
                        }
                        if (game.input.x >= 80 && rightGrowth < 3) {
                            rightGrowth++;
                            game.sound.play('root' + (leftGrowth + rightGrowth));
                            rootRight.frame = rightGrowth;
                        }
                        if (leftGrowth === 4 && rightGrowth === 3) {
                            musics[1].fadeTo(500, 0);
                            musics[2].fadeTo(500, 1);
                            pot_hl.destroy();
                            hl_image.destroy();
                            game.add.image(0, 0, hl);
                            rootRight.frame = rightGrowth + 1;
                            pot.frame = 1;
                            showCross = false;
                            hover.dispatch();
                        }
                    }
                    else if (!shattered) {
                        shattered = true;
                        game.sound.play('shatter');
                        potCross.destroy();
                        root.destroy();
                        rootLeft.destroy();
                        rootRight.destroy();
                        pot.destroy();
                        plant.destroy();
                        hl_image.destroy();
                        var shatterTime = 375;
                        var easing = Phaser.Easing.Sinusoidal.InOut;
                        var backshards_1 = [];
                        backshards_1.push(game.add.image(0, 0, 'pot_backshard1'));
                        backshards_1.push(game.add.image(0, 0, 'pot_backshard2'));
                        backshards_1.push(game.add.image(0, 0, 'pot_backshard3'));
                        backshards_1.push(game.add.image(0, 0, 'pot_backshard4'));
                        backshards_1.push(game.add.image(0, 0, 'pot_backshard5'));
                        backshards_1.push(game.add.image(0, 0, 'pot_backshard6'));
                        var float_1 = game.add.image(0, 0, 'pot_float');
                        var frontshards_1 = [];
                        frontshards_1.push(game.add.image(0, 0, 'pot_frontshard1'));
                        frontshards_1.push(game.add.image(0, 0, 'pot_frontshard2'));
                        frontshards_1.push(game.add.image(0, 0, 'pot_frontshard3'));
                        frontshards_1.push(game.add.image(0, 0, 'pot_frontshard4'));
                        frontshards_1.push(game.add.image(0, 0, 'pot_frontshard5'));
                        frontshards_1.push(game.add.image(0, 0, 'pot_frontshard6'));
                        game.add.tween(backshards_1[0]).to({ x: -16, y: -15 }, shatterTime, easing, true);
                        game.add.tween(backshards_1[1]).to({ x: 1, y: -20 }, shatterTime, easing, true);
                        game.add.tween(backshards_1[2]).to({ x: 15, y: -20 }, shatterTime, easing, true);
                        game.add.tween(backshards_1[3]).to({ x: -14, y: 3 }, shatterTime, easing, true);
                        game.add.tween(backshards_1[4]).to({ x: 3, y: -7 }, shatterTime, easing, true);
                        game.add.tween(backshards_1[5]).to({ x: 30, y: -1 }, shatterTime, easing, true);
                        game.add.tween(frontshards_1[0]).to({ x: -29, y: -5 }, shatterTime, easing, true);
                        game.add.tween(frontshards_1[1]).to({ x: -2, y: -3 }, shatterTime, easing, true);
                        game.add.tween(frontshards_1[2]).to({ x: 14, y: -8 }, shatterTime, easing, true);
                        game.add.tween(frontshards_1[3]).to({ x: 23, y: -14 }, shatterTime, easing, true);
                        game.add.tween(frontshards_1[4]).to({ x: -20, y: 3 }, shatterTime, easing, true);
                        game.add.tween(frontshards_1[5]).to({ x: 15, y: 2 }, shatterTime, easing, true);
                        var timer = game.time.create();
                        timer.add(shatterTime, function () {
                            backshards_1.forEach(function (shard) { return shard.destroy(); });
                            float_1.destroy();
                            frontshards_1.forEach(function (shard) { return shard.destroy(); });
                            var fall = game.add.image(0, 0, 'pot_fall');
                            game.add.tween(fall).to({ y: 50 }, 1000, Phaser.Easing.Quadratic.In, true);
                            game.add.image(0, 0, 'pot_mess');
                            var darken = game.add.graphics();
                            darken.beginFill(0x000000);
                            darken.drawRect(0, 0, 160, 90);
                            darken.endFill();
                            game.add.tween(darken).from({ alpha: 0 }, 1000, Phaser.Easing.Default, true);
                            game.camera.flash(0xffffff, 500);
                            var innerTimer = game.time.create();
                            innerTimer.add(1000, function () {
                                hl.destroy();
                                game.state.start('room', true, false, musics);
                            });
                            innerTimer.start();
                        });
                        timer.start();
                    }
                }
            });
        },
        update: function () {
            var closeToPot = new Phaser.Polygon([
                [37, 44],
                [50, 81],
                [67, 86],
                [89, 86],
                [105, 80],
                [114, 44],
                [100, 33],
                [50, 33]
            ].map(function (_a) {
                var x = _a[0], y = _a[1];
                return new Phaser.Point(x, y);
            }));
            var hoveringNow = closeToPot.contains(game.input.x, game.input.y);
            if (hoveringNow !== hovering) {
                hovering = hoveringNow;
                hover.dispatch();
            }
        },
        render: function () {
            hl.clear();
            hl.blendSourceOver();
            var alpha = game.input.activePointer.isDown ? 0.75 : 0.5;
            hl.fill(0xff, 0xff, 0xff, alpha);
            hl.blendDestinationIn();
            hl.circle(game.input.x, game.input.y, 10);
            if (showCross) {
                if (game.input.x < 80 && leftGrowth < 4) {
                    hl.draw(rootLeft);
                }
                else if (game.input.x >= 80 && rightGrowth < 3) {
                    hl.draw(rootRight);
                }
                else {
                    hl.clear();
                }
            }
            else {
                hl.draw(pot);
            }
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;


});

require.register("states/room.ts", function(exports, require, module) {
"use strict";
function default_1(game) {
    var musics;
    var wall;
    var fade;
    var hover;
    var hovering = true;
    var ateBean = false;
    var growths = 0;
    return {
        init: function (theMusics) {
            musics = theMusics;
        },
        create: function () {
            musics[0].fadeTo(500, 0);
            musics[1].fadeTo(500, 0);
            musics[2].fadeTo(500, 0);
            musics[3].fadeTo(500, 1);
            game.add.image(0, 0, 'room_bg');
            var vines = game.add.sprite(0, 0, 'room_vines');
            var beanLeft = game.add.sprite(0, 0, 'room_beanleft');
            var beanRight = game.add.sprite(0, 0, 'room_beanright');
            var otherBeans = game.add.sprite(0, 0, 'room_otherbeans');
            game.add.image(0, 0, 'room_int');
            game.add.image(0, 0, 'room_pot');
            var plant = game.add.sprite(0, 0, 'room_plant');
            wall = game.add.image(0, 0, 'room_ext');
            wall.alpha = 0;
            var toolbar = game.add.image(0, 0, 'toolbar');
            var toolOrig = game.add.image(1, 2, 'toolbar_orig');
            var toolBean = game.add.image(12, 1, 'toolbar_bean');
            var toolVine = game.add.image(22, 3, 'toolbar_vine');
            toolbar.alpha = 0;
            toolOrig.alpha = 0;
            toolBean.alpha = 0;
            toolVine.alpha = 0;
            function setupTool(tool, action) {
                var initialX = tool.x;
                var initialY = tool.y;
                tool.inputEnabled = true;
                tool.input.enableDrag();
                tool.events.onDragStop.add(function () {
                    action(game.input.x, game.input.y);
                    tool.x = initialX;
                    tool.y = initialY;
                });
            }
            var darken = game.add.graphics();
            darken.beginFill(0x000000);
            darken.drawRect(0, 0, 160, 90);
            darken.endFill();
            game.add.tween(darken).to({ alpha: 0 }, 1000, Phaser.Easing.Default, true);
            plant.animations.add('fall');
            plant.animations.play('fall', 2);
            hover = new Phaser.Signal();
            var timer = game.time.create();
            timer.add(1000, function () {
                game.sound.play('thud', 5);
                hover.add(function () {
                    var newAlpha = hovering ? 0 : 1;
                    var time = Math.abs(newAlpha - wall.alpha) * 250;
                    if (fade) {
                        fade.stop();
                    }
                    fade = game.add.tween(wall);
                    fade.to({ alpha: newAlpha }, time, Phaser.Easing.Default, true);
                });
                game.input.onDown.add(function () {
                    if (!ateBean) {
                        var leftBean_1 = new Phaser.Rectangle(53, 53, 8, 15);
                        var rightBean_1 = new Phaser.Rectangle(73, 53, 8, 15);
                        if (leftBean_1.contains(game.input.x, game.input.y)) {
                            ateBean = true;
                            beanLeft.frame = 1;
                        }
                        else if (rightBean_1.contains(game.input.x, game.input.y)) {
                            ateBean = true;
                            beanRight.frame = 1;
                        }
                        if (ateBean) {
                            game.sound.play('bean', 3);
                            var beanTimer = game.time.create();
                            beanTimer.add(250, function () {
                                beanLeft.frame = 1;
                                beanRight.frame = 1;
                            });
                            beanTimer.start();
                            otherBeans.animations.add('shrink').play(8);
                            var baseTween = game.add.tween(toolbar);
                            var origTween = game.add.tween(toolOrig);
                            var beanTween = game.add.tween(toolBean); // lel
                            baseTween.to({ alpha: 1 }, 500);
                            origTween.to({ alpha: 1 }, 500);
                            beanTween.to({ alpha: 1 }, 500);
                            baseTween.chain(origTween, beanTween);
                            baseTween.start();
                            setupTool(toolOrig, function (x, y) {
                                var vine = new Phaser.Rectangle(82, 40, 12, 12);
                                if (beanRight.frame < 1 && vine.contains(x, y)) {
                                    game.sound.play('snap');
                                    musics[3].fadeTo(500, 0);
                                    musics[4].fadeTo(500, 1);
                                    vines.frame = 1;
                                    game.add.tween(toolVine).to({ alpha: 1 }, 500).start();
                                    setupTool(toolVine, function (x, y) {
                                        if (vine.contains(x, y)) {
                                            var darken_1 = game.add.graphics();
                                            darken_1.beginFill(0x000000);
                                            darken_1.drawRect(0, 0, 160, 90);
                                            darken_1.endFill();
                                            game.add.tween(darken_1).from({ alpha: 0 }, 1000, Phaser.Easing.Default, true);
                                            var innerTimer = game.time.create();
                                            innerTimer.add(1000, function () { return game.state.start('planet', true, false, musics); });
                                            innerTimer.start();
                                        }
                                    });
                                }
                            });
                            setupTool(toolBean, function (x, y) {
                                if (leftBean_1.contains(x, y)) {
                                    growths++;
                                    game.sound.play('grow' + growths);
                                    beanLeft.frame = 0;
                                }
                                else if (rightBean_1.contains(x, y)) {
                                    growths++;
                                    game.sound.play('grow' + growths);
                                    beanRight.frame = 0;
                                }
                            });
                        }
                    }
                });
            });
            timer.start();
        },
        update: function () {
            var closeToWall = new Phaser.Polygon([
                [25, 15], [135, 15], [135, 85], [25, 85]
            ].map(function (_a) {
                var x = _a[0], y = _a[1];
                return new Phaser.Point(x, y);
            }));
            var mouseX = game.input.mousePointer.x;
            var mouseY = game.input.mousePointer.y;
            var hoveringNow = closeToWall.contains(mouseX, mouseY);
            if (hoveringNow !== hovering) {
                hovering = hoveringNow;
                hover.dispatch();
            }
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;


});

require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('initialize');