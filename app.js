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
var process;
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
var load_1 = require("./states/load");
var menu_1 = require("./states/menu");
var pot_1 = require("./states/pot");
var room_1 = require("./states/room");
var planet_1 = require("./states/planet");
var credits_1 = require("./states/credits");
var game = new Phaser.Game({ width: 160, height: 90, parent: 'parent', antialias: false });
game.state.add('load', load_1.default);
game.state.add('menu', menu_1.default);
game.state.add('pot', pot_1.default);
game.state.add('room', room_1.default);
game.state.add('planet', planet_1.default);
game.state.add('credits', credits_1.default);
game.state.start('load');


});

require.register("music.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var Track = (function () {
    function Track(good, bad, same) {
        this.good = good;
        this.bad = bad;
        this.same = same;
    }
    Track.prototype.play = function () {
        this.good.play();
        if (!this.same) {
            this.bad.play();
        }
    };
    return Track;
}());
function addLoop(game, key) {
    return game.sound.add(key, 0, true);
}
function getTrack(game, key) {
    var goodKey = 'music_' + key;
    var badKey = goodKey + '_bitcrushed';
    var same = !game.cache.checkSoundKey(badKey);
    var good = addLoop(game, goodKey);
    var bad = addLoop(game, badKey);
    return new Track(good, same ? good : bad, same);
}
var Music = (function () {
    function Music(game, keys) {
        var _this = this;
        this.tracks = {};
        keys.forEach(function (key) { return _this.tracks[key] = getTrack(game, key); });
    }
    Music.prototype.play = function () {
        _.forOwn(this.tracks, function (track) { return track.play(); });
    };
    return Music;
}());
exports.Music = Music;
;
var MusicalState = (function (_super) {
    __extends(MusicalState, _super);
    function MusicalState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MusicalState.prototype.init = function (music) {
        this.music = music;
    };
    return MusicalState;
}(Phaser.State));
exports.MusicalState = MusicalState;
function startState(game, state, music) {
    game.state.start(state, true, false, music);
}
exports.startState = startState;


});

require.register("states/credits.ts", function(exports, require, module) {
"use strict";
function default_1(game) {
    return {
        create: function () {
            var text = game.add.image(0, 0, 'credits');
            text.alpha = 0;
            var fadeInTimer = game.time.create();
            fadeInTimer.add(1000, function () {
                game.add.tween(text).to({ alpha: 1 }, 2000).start();
            });
            fadeInTimer.start();
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;


});

require.register("states/load.ts", function(exports, require, module) {
"use strict";
var _ = require("lodash");
var music_1 = require("../music");
function usePixelGraphics(game, pixelsPerPixel) {
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(pixelsPerPixel, pixelsPerPixel);
    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(game.canvas);
}
function addLoadIndicator(game) {
    var loadingEnclosure = game.add.graphics();
    loadingEnclosure.lineStyle(1, 0xffffff, 1);
    loadingEnclosure.drawRect(38, 42, 83, 5);
    var loadingTexture = game.make.bitmapData(80, 2);
    loadingTexture.fill(0xff, 0xff, 0xff);
    game.load.setPreloadSprite(game.add.sprite(40, 44, loadingTexture));
}
function loadAudio(game, key, filename) {
    game.load.audio(key, [
        'Audio/OggFiles/' + filename + '.ogg',
        'Audio/WavFiles/' + filename + '.wav'
    ]);
}
var sounds = [
    ['music_title', 'Music/TitleMusic'],
    ['music_fun1', 'Music/Fun1'],
    ['music_fun1_bitcrushed', 'Music/Fun1Bitcrushed'],
    ['music_fun2', 'Music/Fun2'],
    ['music_fun2_bitcrushed', 'Music/Fun2Bitcrushed'],
    ['music_fun3', 'Music/Fun3'],
    ['music_fun3_bitcrushed', 'Music/Fun3Bitcrushed'],
    ['music_fun4', 'Music/Fun4'],
    ['music_fun4_bitcrushed', 'Music/Fun4Bitcrushed'],
    ['music_end', 'Music/End'],
    ['effect_root1', 'SoundEffects/RootGrow1'],
    ['effect_root2', 'SoundEffects/RootGrow2'],
    ['effect_root3', 'SoundEffects/RootGrow3'],
    ['effect_root4', 'SoundEffects/RootGrow4'],
    ['effect_root5', 'SoundEffects/RootGrow5'],
    ['effect_root6', 'SoundEffects/RootGrow6'],
    ['effect_root7', 'SoundEffects/RootGrow7'],
    ['effect_shatter', 'SoundEffects/PotShattering'],
    ['effect_thud', 'SoundEffects/Thud'],
    ['effect_bean', 'SoundEffects/BeanPlant'],
    ['effect_grow1', 'SoundEffects/Grow1'],
    ['effect_grow2', 'SoundEffects/Grow2'],
    ['effect_grow3', 'SoundEffects/Grow3'],
    ['effect_grow4', 'SoundEffects/Grow4'],
    ['effect_grow5', 'SoundEffects/Grow5'],
    ['effect_grow6', 'SoundEffects/Grow6'],
    ['effect_snap', 'SoundEffects/VineSnap'],
];
function loadSounds(game) {
    sounds.forEach(function (_a) {
        var key = _a[0], filename = _a[1];
        return loadAudio(game, key, filename);
    });
}
function soundsReady(game) {
    return sounds.every(function (_a) {
        var key = _a[0], _ = _a[1];
        return game.cache.isSoundDecoded(key);
    });
}
var tracks = ['title', 'fun1', 'fun2', 'fun3', 'fun4', 'end'];
function startMusic(game) {
    var music = new music_1.Music(game, tracks);
    music.play();
    return music;
}
function sceneImageLoader(prefix, path) {
    return function (game, key, filename) {
        game.load.image(prefix + '_' + key, 'Image/' + path + '/' + filename + '.png');
    };
}
function sceneSheetLoader(prefix, path) {
    return function (game, key, filename) {
        game.load.spritesheet(prefix + '_' + key, 'Image/' + path + '/' + filename + '.png', 160, 90);
    };
}
var loadMenuImage = sceneImageLoader('menu', 'menu');
function loadMenuImages(game) {
    loadMenuImage(game, 'background', 'startmenubackground');
    loadMenuImage(game, 'start', 'startmenu');
    loadMenuImage(game, 'resume', 'resumenu');
}
var loadPotImage = sceneImageLoader('pot', 'scene1');
var loadPotSheet = sceneSheetLoader('pot', 'scene1');
function loadPotImages(game) {
    loadPotImage(game, 'bg', 'blurredbg');
    loadPotImage(game, 'shelf', 'shelf');
    loadPotImage(game, 'shelf_hl', 'shelfhighlighting');
    loadPotImage(game, 'cross', 'pottransparent');
    loadPotImage(game, 'root', 'root1');
    loadPotSheet(game, 'rootleft', 'rootleft spritesheet');
    loadPotSheet(game, 'rootright', 'rootright spritesheet');
    loadPotSheet(game, 'plant', 'plantwilt spritesheet');
    loadPotSheet(game, 'blood', 'plantblood spritesheet');
    loadPotSheet(game, 'pot', 'potbreaking spritesheet');
    loadPotImage(game, 'pot_hl', 'pothighlighting');
    _.range(1, 7).forEach(function (shard) { return loadPotImage(game, 'backshard' + shard, 'potbreaking shards/backshard' + shard + 'start'); });
    loadPotImage(game, 'float', 'potbreaking shards/plantanddirt');
    _.range(1, 7).forEach(function (shard) { return loadPotImage(game, 'frontshard' + shard, 'potbreaking shards/frontshard' + shard + 'start'); });
    loadPotImage(game, 'mess', 'potmess(frame1)');
    loadPotImage(game, 'fall', 'plantfall(frame1)');
}
var loadRoomImage = sceneImageLoader('room', 'scene2');
var loadRoomSheet = sceneSheetLoader('room', 'scene2');
function loadRoomImages(game) {
    loadRoomImage(game, 'toolbar', 'toolbar');
    loadRoomImage(game, 'toolorig', 'planticon (1,2)');
    loadRoomImage(game, 'toolbean', 'beanicon (12,1)');
    loadRoomImage(game, 'toolvine', 'vineicon (22,3)');
    loadRoomImage(game, 'bg', 'background2');
    loadRoomSheet(game, 'vines', 'vine spritesheet');
    loadRoomSheet(game, 'beanleft', 'beanleft spritesheet');
    loadRoomSheet(game, 'beanright', 'beanright spritesheet');
    loadRoomSheet(game, 'otherbeans', 'otherbeans spritesheet');
    loadRoomImage(game, 'int', 'wallinterior');
    loadRoomSheet(game, 'plant', 'plant spritesheet');
    loadRoomImage(game, 'pot', 'brokenpotshards');
}
var loadPlanetSheet = sceneSheetLoader('planet', 'scenefinal');
function loadPlanetImages(game) {
    loadPlanetSheet(game, 'animation', 'scenefinal spritesheet');
}
function loadCreditsImages(game) {
    game.load.image('credits', 'Image/credits.png');
}
function default_1(game) {
    return {
        preload: function () {
            usePixelGraphics(game, 7);
            addLoadIndicator(game);
            loadSounds(game);
            loadMenuImages(game);
            loadPotImages(game);
            loadRoomImages(game);
            loadPlanetImages(game);
            loadCreditsImages(game);
        },
        update: function () {
            if (soundsReady(game)) {
                music_1.startState(game, 'menu', startMusic(game));
            }
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;


});

require.register("states/menu.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var music_1 = require("../music");
var button = new Phaser.Polygon([
    [16, 25], [13, 57], [145, 64], [145, 30]
].map(function (_a) {
    var x = _a[0], y = _a[1];
    return new Phaser.Point(x, y);
}));
var default_1 = (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    default_1.prototype.create = function () {
        var _this = this;
        this.music.tracks['title'].good.volume = 1;
        this.game.add.image(0, 0, 'menu_background');
        this.game.add.image(0, 0, 'menu_start');
        this.hl = this.game.make.bitmapData(160, 90);
        this.game.add.image(0, 0, this.hl);
        this.game.input.onUp.add(function () {
            if (button.contains(_this.game.input.x, _this.game.input.y)) {
                _this.hl.destroy();
                music_1.startState(_this.game, 'pot', _this.music);
            }
        });
    };
    default_1.prototype.render = function () {
        this.hl.clear();
        if (button.contains(this.game.input.x, this.game.input.y)) {
            this.hl.blendSourceOver();
            var alpha = this.game.input.activePointer.isDown ? 0.75 : 0.5;
            this.hl.fill(0xff, 0xff, 0xff, alpha);
            this.hl.blendDestinationIn();
            this.hl.circle(this.game.input.x, this.game.input.y, 10);
            this.hl.draw('menu_start');
        }
    };
    return default_1;
}(music_1.MusicalState));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;


});

require.register("states/planet.ts", function(exports, require, module) {
"use strict";
function default_1(game) {
    var music;
    return {
        init: function (theMusic) {
            music = theMusic;
        },
        create: function () {
            music.tracks['fun4'].good.fadeTo(500, 0);
            music.tracks['end'].good.play('', 0, 1, false);
            var dieTimer = game.time.create();
            dieTimer.add(18000, function () {
                game.state.start('credits');
            });
            dieTimer.start();
            var planet = game.add.sprite(0, 0, 'planet_animation');
            planet.animations.add('die');
            planet.animations.play('die', 0.25);
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
var music_1 = require("../music");
function default_1(game) {
    var music;
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
        init: function (theMusic) {
            music = theMusic;
        },
        create: function () {
            music.tracks['title'].good.fadeTo(500, 0);
            music.tracks['fun1'].good.fadeTo(500, 1);
            game.add.image(0, 0, 'pot_bg');
            game.add.image(0, 0, 'pot_shelf');
            game.add.image(0, 0, 'pot_shelf_hl');
            var potCross = game.add.image(0, 0, 'pot_cross');
            var root = game.add.image(0, 0, 'pot_root');
            rootLeft = game.add.sprite(0, 0, 'pot_rootleft');
            rootRight = game.add.sprite(0, 0, 'pot_rootright');
            hl = game.make.bitmapData(160, 90);
            hl_image = game.add.image(0, 0, hl);
            var plant = game.add.sprite(0, 0, 'pot_plant');
            var blood = game.add.sprite(0, 0, 'pot_blood');
            blood.animations.add('spread');
            blood.animations.play('spread', 0.5);
            var wiltTimer = game.time.create();
            wiltTimer.add(16000, function () {
                music.tracks['fun1'].good.fadeTo(8000, 0);
                music.tracks['fun1'].bad.fadeTo(8000, 1);
                if (!shattered) {
                    plant.animations.add('wilt');
                    plant.animations.play('wilt', 0.25);
                }
            });
            wiltTimer.start();
            pot = game.add.sprite(0, 0, 'pot_pot');
            var pot_hl = game.add.image(0, 0, 'pot_pot_hl');
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
                            game.sound.play('effect_root' + (leftGrowth + rightGrowth));
                            rootLeft.frame = leftGrowth;
                        }
                        if (game.input.x >= 80 && rightGrowth < 3) {
                            rightGrowth++;
                            game.sound.play('effect_root' + (leftGrowth + rightGrowth));
                            rootRight.frame = rightGrowth;
                        }
                        if (leftGrowth === 4 && rightGrowth === 3) {
                            music.tracks['fun1'].good.fadeTo(500, 0);
                            music.tracks['fun2'].good.fadeTo(500, 1);
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
                        game.sound.play('effect_shatter');
                        potCross.destroy();
                        root.destroy();
                        rootLeft.destroy();
                        rootRight.destroy();
                        plant.destroy();
                        blood.destroy();
                        pot.destroy();
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
                                music_1.startState(game, 'room', music);
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
var music_1 = require("../music");
function default_1(game) {
    var music;
    var beanLeft;
    var beanRight;
    var hl;
    var leftBean = new Phaser.Rectangle(53, 53, 8, 15);
    var rightBean = new Phaser.Rectangle(73, 53, 8, 15);
    var choseBean = false;
    var ateBean = false;
    var growths = 0;
    return {
        init: function (theMusic) {
            music = theMusic;
        },
        create: function () {
            music.tracks['fun2'].good.fadeTo(500, 0);
            music.tracks['fun3'].good.fadeTo(500, 1);
            game.add.image(0, 0, 'room_bg');
            var vines = game.add.sprite(0, 0, 'room_vines');
            beanLeft = game.add.sprite(0, 0, 'room_beanleft');
            beanRight = game.add.sprite(0, 0, 'room_beanright');
            var otherBeans = game.add.sprite(0, 0, 'room_otherbeans');
            game.add.image(0, 0, 'room_int');
            var plant = game.add.sprite(0, 0, 'room_plant');
            game.add.image(0, 0, 'room_pot');
            hl = game.make.bitmapData(160, 90);
            game.add.image(0, 0, hl);
            var toolbar = game.add.image(0, 0, 'room_toolbar');
            var toolOrig = game.add.image(1, 2, 'room_toolorig');
            var toolBean = game.add.image(12, 1, 'room_toolbean');
            var toolVine = game.add.image(22, 3, 'room_toolvine');
            toolbar.alpha = 0;
            toolOrig.alpha = 0;
            toolBean.alpha = 0;
            toolVine.alpha = 0;
            function setupTool(tool, dots, action) {
                var initialX = tool.x;
                var initialY = tool.y;
                tool.inputEnabled = true;
                tool.input.enableDrag();
                var sparkles;
                tool.events.onDragStart.add(function () {
                    sparkles = dots.map(function (_a) {
                        var x = _a[0], y = _a[1];
                        var sparkle = game.add.graphics(x + 0.5, y + 0.5);
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
                        game.add.tween(sparkle.scale).to({ x: 0, y: 0 }, 500, Phaser.Easing.Default, true, 0, -1, true);
                        return sparkle;
                    });
                });
                tool.events.onDragStop.add(function () {
                    sparkles.forEach(function (sparkle) { return sparkle.destroy(); });
                    sparkles = [];
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
            plant.animations.add('fall', [0, 1, 2]);
            plant.animations.play('fall', 2);
            function eatBean(right) {
                ateBean = true;
                if (right) {
                    beanRight.frame = 1;
                }
                else {
                    beanLeft.frame = 1;
                }
                game.sound.play('effect_bean', 3);
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
                setupTool(toolOrig, [[88, 45]], function (x, y) {
                    var vine = new Phaser.Rectangle(82, 40, 12, 12);
                    if (beanRight.frame < 1 && vine.contains(x, y)) {
                        game.sound.play('effect_snap');
                        music.tracks['fun3'].good.fadeTo(500, 0);
                        music.tracks['fun4'].good.fadeTo(500, 1);
                        vines.frame = 1;
                        game.add.tween(toolVine).to({ alpha: 1 }, 500).start();
                        setupTool(toolVine, [[88, 45]], function (x, y) {
                            if (vine.contains(x, y)) {
                                var darken_1 = game.add.graphics();
                                darken_1.beginFill(0x000000);
                                darken_1.drawRect(0, 0, 160, 90);
                                darken_1.endFill();
                                game.add.tween(darken_1).from({ alpha: 0 }, 1000, Phaser.Easing.Default, true);
                                var innerTimer = game.time.create();
                                innerTimer.add(1000, function () {
                                    hl.destroy();
                                    music_1.startState(game, 'planet', music);
                                });
                                innerTimer.start();
                            }
                        });
                    }
                });
                setupTool(toolBean, [[56, 63], [77, 63]], function (x, y) {
                    if (leftBean.contains(x, y)) {
                        growths++;
                        game.sound.play('effect_grow' + growths);
                        beanLeft.frame = 0;
                    }
                    else if (rightBean.contains(x, y)) {
                        growths++;
                        game.sound.play('effect_grow' + growths);
                        beanRight.frame = 0;
                    }
                });
            }
            var timer = game.time.create();
            timer.add(1000, function () {
                game.sound.play('effect_thud', 5);
                game.input.onDown.add(function () {
                    if (!choseBean) {
                        if (leftBean.contains(game.input.x, game.input.y)) {
                            choseBean = true;
                            plant.animations.add('eat_left', [2, 8, 9, 10, 11, 2]);
                            plant.animations.play('eat_left', 2);
                            var innerTimer = game.time.create();
                            innerTimer.add(1000, function () { return eatBean(false); });
                            innerTimer.start();
                        }
                        else if (rightBean.contains(game.input.x, game.input.y)) {
                            choseBean = true;
                            plant.animations.add('eat_right', [2, 3, 4, 5, 6, 7, 2]);
                            plant.animations.play('eat_right', 3);
                            var innerTimer = game.time.create();
                            innerTimer.add(1000, function () { return eatBean(true); });
                            innerTimer.start();
                        }
                    }
                });
            });
            timer.start();
        },
        render: function () {
            hl.clear();
            hl.blendSourceOver();
            var alpha = game.input.activePointer.isDown ? 0.75 : 0.5;
            hl.fill(0xff, 0xff, 0xff, alpha);
            hl.blendDestinationIn();
            hl.circle(game.input.x, game.input.y, 10);
            if (!ateBean) {
                if (leftBean.contains(game.input.x, game.input.y)) {
                    hl.draw(beanLeft);
                }
                else if (rightBean.contains(game.input.x, game.input.y)) {
                    hl.draw(beanRight);
                }
                else {
                    hl.clear();
                }
            }
            else {
                hl.clear();
            }
        }
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
;


});

require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('initialize');