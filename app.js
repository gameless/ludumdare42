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
require.register("delay.ts", function(exports, require, module) {
"use strict";
function delay(game, milliseconds, callback) {
    var timer = game.time.create();
    timer.add(milliseconds, callback);
    timer.start();
}
exports.delay = delay;


});

require.register("fade.ts", function(exports, require, module) {
"use strict";
function fadeIn(game, duration) {
    var darken = game.add.graphics();
    darken.beginFill(0x000000);
    darken.drawRect(0, 0, 160, 90);
    darken.endFill();
    game.add.tween(darken).to({ alpha: 0 }, duration).start();
}
exports.fadeIn = fadeIn;
function fadeOut(game, duration) {
    var darken = game.add.graphics();
    darken.beginFill(0x000000);
    darken.drawRect(0, 0, 160, 90);
    darken.endFill();
    game.add.tween(darken).from({ alpha: 0 }, duration).start();
}
exports.fadeOut = fadeOut;


});

require.register("highlight.ts", function(exports, require, module) {
"use strict";
var Highlight = (function () {
    function Highlight(game, target) {
        this.game = game;
        this.target = target;
        this.bmd = game.make.bitmapData(160, 90);
        game.add.image(0, 0, this.bmd);
    }
    Highlight.prototype.render = function () {
        this.bmd.clear();
        var target = this.target(this.game.input.x, this.game.input.y);
        if (target) {
            this.bmd.blendSourceOver();
            var alpha = this.game.input.activePointer.isDown ? 0.75 : 0.5;
            this.bmd.fill(0xff, 0xff, 0xff, alpha);
            this.bmd.blendDestinationIn();
            this.bmd.circle(this.game.input.x, this.game.input.y, 10);
            this.bmd.draw(target);
        }
    };
    Highlight.prototype.destroy = function () {
        this.bmd.destroy();
    };
    return Highlight;
}());
exports.Highlight = Highlight;


});

require.register("initialize.ts", function(exports, require, module) {
/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts"/>
"use strict";
var load_1 = require("./states/load");
var menu_1 = require("./states/menu");
var pot_1 = require("./states/pot");
var room_1 = require("./states/room");
var island_1 = require("./states/island");
var planet_1 = require("./states/planet");
var credits_1 = require("./states/credits");
var game = new Phaser.Game({ width: 160, height: 90, parent: 'parent', antialias: false });
game.state.add('load', load_1.default);
game.state.add('menu', menu_1.default);
game.state.add('pot', pot_1.default);
game.state.add('room', room_1.default);
game.state.add('island', island_1.default);
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
    function Track(game, good, bad, same) {
        this.good = good;
        this.bad = bad;
        this.same = same;
        this.portion = 0;
        this.tween = game.add.tween(this);
    }
    Track.prototype.play = function (loop) {
        this.good.loop = loop;
        this.good.play();
        if (!this.same) {
            this.bad.loop = loop;
            this.bad.play();
        }
    };
    Track.prototype.updateVolume = function (badness) {
        if (this.same) {
            this.good.volume = this.portion;
        }
        else {
            this.bad.volume = badness * this.portion;
            this.good.volume = this.portion - this.bad.volume;
        }
    };
    return Track;
}());
function getTrack(game, key) {
    var goodKey = 'music_' + key;
    var badKey = goodKey + '_bitcrushed';
    var same = !game.cache.checkSoundKey(badKey);
    var good = game.sound.add(goodKey, 0);
    var bad = game.sound.add(badKey, 0);
    return new Track(game, good, same ? good : bad, same);
}
var Music = (function () {
    function Music(game, keys) {
        var _this = this;
        this.game = game;
        this.tracks = {};
        keys.forEach(function (key) { return _this.tracks[key] = getTrack(game, key); });
        this.badness = 0;
        this.tween = game.add.tween(this);
    }
    Music.prototype.play = function (loop) {
        _.forOwn(this.tracks, function (track) { return track.play(loop); });
    };
    Music.prototype.updateVolumes = function () {
        var _this = this;
        _.forOwn(this.tracks, function (track) { return track.updateVolume(_this.badness); });
    };
    Music.prototype.fadeTrack = function (duration, key) {
        var _this = this;
        _.forOwn(this.tracks, function (track, trackKey) {
            track.tween.stop();
            var tween = _this.game.add.tween(track);
            tween.to({ portion: trackKey === key ? 1 : 0 }, duration);
            tween.onUpdateCallback(function () { return _this.updateVolumes(); });
            tween.onComplete.add(function () { return _this.updateVolumes(); });
            tween.start();
            track.tween = tween;
        });
    };
    Music.prototype.fadeBadness = function (duration, badness) {
        var _this = this;
        this.tween.stop();
        var tween = this.game.add.tween(this);
        tween.to({ badness: badness }, duration);
        tween.onUpdateCallback(function () { return _this.updateVolumes(); });
        tween.onComplete.add(function () { return _this.updateVolumes(); });
        tween.start();
        this.tween = tween;
    };
    Music.prototype.setTrack = function (key) {
        this.fadeTrack(1, key);
    };
    Music.prototype.setBadness = function (badness) {
        this.fadeBadness(1, badness);
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
        var _ = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            _[_i - 1] = arguments[_i];
        }
        this.music = music;
    };
    return MusicalState;
}(Phaser.State));
exports.MusicalState = MusicalState;
function startState(game, state, music) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    game.state.start.apply(game.state, [state, true, false, music].concat(args));
}
exports.startState = startState;


});

require.register("pause.ts", function(exports, require, module) {
"use strict";
exports.escapeCode = 27; // keyCode


});

;require.register("states/credits.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var music_1 = require("../music");
var pause_1 = require("../pause");
var default_1 = (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    default_1.prototype.create = function () {
        var _this = this;
        this.game.input.keyboard.removeCallbacks();
        var text = this.game.add.image(0, 0, 'credits');
        this.game.add.tween(text).from({ alpha: 0 }, 2000).delay(1000).start();
        this.game.input.keyboard.addCallbacks(this, function (event) {
            if (event.keyCode === pause_1.escapeCode) {
                _this.music.play(true);
                music_1.startState(_this.game, 'menu', _this.music, 'pot');
            }
        });
    };
    return default_1;
}(music_1.MusicalState));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;


});

require.register("states/island.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var delay_1 = require("../delay");
var fade_1 = require("../fade");
var highlight_1 = require("../highlight");
var pause_1 = require("../pause");
var music_1 = require("../music");
var seaweedBox = new Phaser.Rectangle(117, 67, 13, 11);
var default_1 = (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startFade = true;
        return _this;
    }
    default_1.prototype.init = function (music, startFade) {
        _super.prototype.init.call(this, music);
        this.startFade = startFade;
    };
    default_1.prototype.startBlood = function (blood) {
        var _this = this;
        var shattered = false;
        blood.animations.add('spread');
        blood.animations.play('spread', 0.5);
        delay_1.delay(this.game, 8000, function () {
            _this.music.fadeBadness(8000, 1);
            if (!shattered) {
                delay_1.delay(_this.game, 8000, function () {
                    if (!shattered) {
                        fade_1.fadeOut(_this.game, 1000);
                        delay_1.delay(_this.game, 1000, function () {
                            _this.highlight.destroy();
                            music_1.startState(_this.game, 'island', _this.music, true);
                        });
                    }
                });
            }
        });
        return function () { return shattered = true; };
    };
    default_1.prototype.create = function () {
        var _this = this;
        this.game.input.keyboard.removeCallbacks();
        this.music.fadeTrack(500, 'mid1');
        this.music.fadeBadness(500, 0);
        this.game.add.image(0, 0, 'island_bg');
        this.game.add.image(0, 0, 'island_trees');
        var plant = this.game.add.sprite(0, 0, 'island_plant');
        var seaweed = this.game.add.sprite(0, 0, 'island_seaweed');
        var blood = this.game.add.sprite(0, 0, 'island_blood');
        plant.animations.add('grow').play(2);
        this.game.input.keyboard.addCallbacks(this, function (event) {
            if (event.keyCode === pause_1.escapeCode) {
                _this.highlight.destroy();
                music_1.startState(_this.game, 'menu', _this.music, 'island');
            }
        });
        this.highlight = new highlight_1.Highlight(this.game, function (x, y) {
            if (seaweedBox.contains(x, y)) {
                return seaweed;
            }
            return null;
        });
        if (this.startFade) {
            fade_1.fadeIn(this.game, 1000);
        }
        var stopBlood = this.startBlood(blood);
        delay_1.delay(this.game, 1000, function () {
            _this.game.input.onUp.add(function () {
                if (seaweedBox.contains(_this.game.input.x, _this.game.input.y)) {
                    seaweed.animations.add('shrink', [1, 2]).play(2);
                    fade_1.fadeOut(_this.game, 1000);
                    delay_1.delay(_this.game, 1000, function () {
                        _this.highlight.destroy();
                        music_1.startState(_this.game, 'planet', _this.music);
                    });
                }
            });
        });
    };
    default_1.prototype.render = function () {
        this.highlight.render();
    };
    return default_1;
}(music_1.MusicalState));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;


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
    ['music_mid1', 'Music/Mid1'],
    ['music_mid1_bitcrushed', 'Music/Mid1Bitcrushed'],
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
var tracks = ['title', 'fun1', 'fun2', 'fun3', 'fun4', 'mid1', 'end'];
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
    loadMenuImage(game, 'resume', 'resumenu_top');
    loadMenuImage(game, 'restart', 'resumenu_bottom');
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
    loadRoomSheet(game, 'blood', 'plantblood spritesheet');
}
var loadIslandImage = sceneImageLoader('island', 'scene3');
var loadIslandSheet = sceneSheetLoader('island', 'scene3');
function loadIslandImages(game) {
    loadIslandImage(game, 'bg', 'bg3');
    loadIslandSheet(game, 'plant', 'plant spritesheet');
    loadIslandSheet(game, 'seaweed', 'seaweed spritesheet');
    loadIslandImage(game, 'trees', 'trees');
    loadIslandSheet(game, 'blood', 'blood spritesheet');
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
            loadIslandImages(game);
            loadPlanetImages(game);
            loadCreditsImages(game);
        },
        update: function () {
            if (soundsReady(game)) {
                var music = new music_1.Music(game, tracks);
                music.play(true);
                music_1.startState(game, 'menu', music);
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
var highlight_1 = require("../highlight");
var music_1 = require("../music");
var startButton = new Phaser.Polygon([
    [16, 25], [13, 57], [145, 64], [145, 30]
].map(function (_a) {
    var x = _a[0], y = _a[1];
    return new Phaser.Point(x, y);
}));
var resumeButton = new Phaser.Polygon([
    [17, 6], [14, 38], [146, 45], [146, 11]
].map(function (_a) {
    var x = _a[0], y = _a[1];
    return new Phaser.Point(x, y);
}));
var restartButton = new Phaser.Polygon([
    [14, 46], [14, 80], [143, 85], [146, 53]
].map(function (_a) {
    var x = _a[0], y = _a[1];
    return new Phaser.Point(x, y);
}));
var default_1 = (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    default_1.prototype.init = function (music, behind) {
        _super.prototype.init.call(this, music);
        this.behind = behind || 'pot';
    };
    default_1.prototype.create = function () {
        var _this = this;
        this.game.input.keyboard.removeCallbacks();
        this.music.fadeTrack(500, 'title');
        this.game.add.image(0, 0, 'menu_background');
        var buttonSprites = [];
        if (this.behind === 'pot') {
            buttonSprites.push(this.game.add.sprite(0, 0, 'menu_start'));
        }
        else {
            buttonSprites.push(this.game.add.sprite(0, 0, 'menu_resume'));
            buttonSprites.push(this.game.add.sprite(0, 0, 'menu_restart'));
        }
        this.highlight = new highlight_1.Highlight(this.game, function (x, y) {
            if (_this.behind === 'pot') {
                if (startButton.contains(x, y)) {
                    return buttonSprites[0];
                }
            }
            else {
                if (resumeButton.contains(x, y)) {
                    return buttonSprites[0];
                }
                else if (restartButton.contains(x, y)) {
                    return buttonSprites[1];
                }
            }
            return null;
        });
        this.game.input.onUp.add(function () {
            var x = _this.game.input.x;
            var y = _this.game.input.y;
            if (_this.behind === 'pot') {
                if (startButton.contains(x, y)) {
                    _this.highlight.destroy();
                    music_1.startState(_this.game, _this.behind, _this.music);
                }
            }
            else {
                if (resumeButton.contains(x, y)) {
                    _this.highlight.destroy();
                    music_1.startState(_this.game, _this.behind, _this.music);
                }
                else if (restartButton.contains(x, y)) {
                    _this.highlight.destroy();
                    music_1.startState(_this.game, 'pot', _this.music);
                }
            }
        });
    };
    default_1.prototype.render = function () {
        this.highlight.render();
    };
    return default_1;
}(music_1.MusicalState));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;


});

require.register("states/planet.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var delay_1 = require("../delay");
var music_1 = require("../music");
var default_1 = (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    default_1.prototype.create = function () {
        var _this = this;
        this.game.input.keyboard.removeCallbacks();
        this.music.setTrack('end');
        this.music.play(false);
        delay_1.delay(this.game, 18000, function () { return music_1.startState(_this.game, 'credits', _this.music); });
        var planet = this.game.add.sprite(0, 0, 'planet_animation');
        planet.animations.add('die');
        planet.animations.play('die', 0.25);
        var darken = this.game.add.graphics();
        darken.beginFill(0x000000);
        darken.drawRect(0, 0, 160, 90);
        darken.endFill();
        this.game.add.tween(darken).to({ alpha: 0 }, 1000).start();
    };
    return default_1;
}(music_1.MusicalState));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;


});

require.register("states/pot.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var delay_1 = require("../delay");
var fade_1 = require("../fade");
var highlight_1 = require("../highlight");
var pause_1 = require("../pause");
var music_1 = require("../music");
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
var backshardDeltas = [
    [-16, -15], [1, -20], [15, -20], [-14, 3], [3, -7], [30, -1]
];
var frontshardDeltas = [
    [-29, -5], [-2, -3], [14, -8], [23, -14], [-20, 3], [15, 2]
];
var default_1 = (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startFade = false;
        return _this;
    }
    default_1.prototype.init = function (music, startFade) {
        _super.prototype.init.call(this, music);
        this.startFade = startFade;
    };
    default_1.prototype.startBlood = function (plant, blood) {
        var _this = this;
        var shattered = false;
        blood.animations.add('spread');
        blood.animations.play('spread', 0.5);
        delay_1.delay(this.game, 16000, function () {
            _this.music.fadeBadness(8000, 1);
            if (!shattered) {
                plant.animations.add('wilt').play(0.25);
                delay_1.delay(_this.game, 8000, function () {
                    if (!shattered) {
                        fade_1.fadeOut(_this.game, 1000);
                        delay_1.delay(_this.game, 1000, function () {
                            _this.highlight.destroy();
                            music_1.startState(_this.game, 'pot', _this.music, true);
                        });
                    }
                });
            }
        });
        return function () { return shattered = true; };
    };
    default_1.prototype.startCross = function (pot) {
        var _this = this;
        var fade;
        var braced = false;
        var hovering = false;
        this.game.input.addMoveCallback(function () {
            var x = _this.game.input.x;
            var y = _this.game.input.y;
            var nowHovering = closeToPot.contains(x, y);
            if (!braced && nowHovering !== hovering) {
                hovering = nowHovering;
                var newAlpha = hovering ? 0 : 1;
                var time = Math.abs(newAlpha - pot.alpha) * 250;
                if (fade) {
                    fade.stop();
                }
                fade = _this.game.add.tween(pot);
                fade.to({ alpha: newAlpha }, time).start();
            }
        }, this);
        return function () {
            braced = true;
            fade.to({ alpha: 1 }, (1 - pot.alpha) * 250).start();
        };
    };
    default_1.prototype.create = function () {
        var _this = this;
        this.game.input.keyboard.removeCallbacks();
        this.music.fadeTrack(500, 'fun1');
        this.music.fadeBadness(500, 0);
        this.game.add.image(0, 0, 'pot_bg');
        this.game.add.image(0, 0, 'pot_shelf');
        this.game.add.image(0, 0, 'pot_shelf_hl');
        var potCross = this.game.add.image(0, 0, 'pot_cross');
        var root = this.game.add.image(0, 0, 'pot_root');
        var rootLeft = this.game.add.sprite(0, 0, 'pot_rootleft');
        var rootRight = this.game.add.sprite(0, 0, 'pot_rootright');
        var plant = this.game.add.sprite(0, 0, 'pot_plant');
        var blood = this.game.add.sprite(0, 0, 'pot_blood');
        var pot = this.game.add.sprite(0, 0, 'pot_pot');
        var pot_hl = this.game.add.image(0, 0, 'pot_pot_hl');
        this.game.input.keyboard.addCallbacks(this, function (event) {
            if (event.keyCode === pause_1.escapeCode) {
                _this.highlight.destroy();
                music_1.startState(_this.game, 'menu', _this.music, 'pot');
            }
        });
        var leftGrowth = 0;
        var rightGrowth = 0;
        var braced = false;
        var shattered = false;
        this.highlight = new highlight_1.Highlight(this.game, function (x, y) {
            if (!braced) {
                if (closeToPot.contains(x, y)) {
                    if (x < 80) {
                        if (leftGrowth < 4) {
                            return rootLeft;
                        }
                    }
                    else {
                        if (rightGrowth < 3) {
                            return rootRight;
                        }
                    }
                }
            }
            else if (!shattered) {
                return pot;
            }
            return null;
        });
        if (this.startFade) {
            fade_1.fadeIn(this.game, 1000);
        }
        var stopBlood = this.startBlood(plant, blood);
        var stopCross = this.startCross(pot);
        this.game.input.onUp.add(function () {
            if (closeToPot.contains(_this.game.input.x, _this.game.input.y)) {
                if (!braced) {
                    var grew = false;
                    if (_this.game.input.x < 80) {
                        if (leftGrowth < 4) {
                            leftGrowth++;
                            rootLeft.frame = leftGrowth;
                            grew = true;
                        }
                    }
                    else {
                        if (rightGrowth < 3) {
                            rightGrowth++;
                            rootRight.frame = rightGrowth;
                            grew = true;
                        }
                    }
                    if (grew) {
                        _this.game.sound.play('effect_root' + (leftGrowth + rightGrowth));
                    }
                    if (leftGrowth === 4 && rightGrowth === 3) {
                        braced = true;
                        stopCross();
                        _this.music.fadeTrack(500, 'fun2');
                        pot_hl.destroy();
                        rootRight.frame = rightGrowth + 1;
                        pot.frame = 1;
                    }
                }
                else if (!shattered) {
                    shattered = true;
                    stopBlood();
                    _this.music.fadeBadness(500, 0);
                    _this.game.sound.play('effect_shatter');
                    potCross.destroy();
                    root.destroy();
                    rootLeft.destroy();
                    rootRight.destroy();
                    plant.destroy();
                    blood.destroy();
                    pot.destroy();
                    var shatterTime_1 = 375;
                    var easing_1 = Phaser.Easing.Sinusoidal.InOut;
                    var backshards_1 = _.range(1, 7).map(function (i) {
                        var shard = _this.game.add.image(0, 0, 'pot_backshard' + i);
                        var _a = backshardDeltas[i - 1], x = _a[0], y = _a[1];
                        var tween = _this.game.add.tween(shard);
                        tween.to({ x: x, y: y }, shatterTime_1, easing_1, true);
                        return shard;
                    });
                    var float_1 = _this.game.add.image(0, 0, 'pot_float');
                    var frontshards_1 = _.range(1, 7).map(function (i) {
                        var shard = _this.game.add.image(0, 0, 'pot_frontshard' + i);
                        var _a = frontshardDeltas[i - 1], x = _a[0], y = _a[1];
                        var tween = _this.game.add.tween(shard);
                        tween.to({ x: x, y: y }, shatterTime_1, easing_1, true);
                        return shard;
                    });
                    delay_1.delay(_this.game, shatterTime_1, function () {
                        backshards_1.forEach(function (shard) { return shard.destroy(); });
                        float_1.destroy();
                        frontshards_1.forEach(function (shard) { return shard.destroy(); });
                        var fall = _this.game.add.image(0, 0, 'pot_fall');
                        var fallTween = _this.game.add.tween(fall);
                        fallTween.to({ y: 50 }, 1000, Phaser.Easing.Quadratic.In, true);
                        _this.game.add.image(0, 0, 'pot_mess');
                        fade_1.fadeOut(_this.game, 1000);
                        _this.game.camera.flash(0xffffff, 500);
                        delay_1.delay(_this.game, 1000, function () {
                            _this.highlight.destroy();
                            music_1.startState(_this.game, 'room', _this.music, true);
                        });
                    });
                }
            }
        });
    };
    default_1.prototype.render = function () {
        this.highlight.render();
    };
    return default_1;
}(music_1.MusicalState));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;


});

require.register("states/room.ts", function(exports, require, module) {
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require("lodash");
var delay_1 = require("../delay");
var fade_1 = require("../fade");
var highlight_1 = require("../highlight");
var pause_1 = require("../pause");
var music_1 = require("../music");
var leftBean = new Phaser.Rectangle(53, 53, 8, 15);
var rightBean = new Phaser.Rectangle(73, 53, 8, 15);
var default_1 = (function (_super) {
    __extends(default_1, _super);
    function default_1() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.startFade = true;
        return _this;
    }
    default_1.prototype.init = function (music, startFade) {
        _super.prototype.init.call(this, music);
        this.startFade = startFade;
    };
    default_1.prototype.startBlood = function (blood) {
        var _this = this;
        var shattered = false;
        blood.animations.add('spread');
        blood.animations.play('spread', 0.5);
        delay_1.delay(this.game, 10000, function () {
            _this.music.fadeBadness(10000, 1);
            if (!shattered) {
                delay_1.delay(_this.game, 10000, function () {
                    if (!shattered) {
                        fade_1.fadeOut(_this.game, 1000);
                        delay_1.delay(_this.game, 1000, function () {
                            _this.highlight.destroy();
                            music_1.startState(_this.game, 'room', _this.music, true);
                        });
                    }
                });
            }
        });
        return function () { return shattered = true; };
    };
    default_1.prototype.setupTool = function (tool, dots, action) {
        var _this = this;
        var initialX = tool.x;
        var initialY = tool.y;
        tool.inputEnabled = true;
        tool.input.enableDrag();
        var sparkles;
        tool.events.onDragStart.add(function () {
            sparkles = dots().map(function (_a) {
                var x = _a[0], y = _a[1];
                var sparkle = _this.game.add.graphics(x + 0.5, y + 0.5);
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
                _this.game.add.tween(sparkle.scale).to({ x: 0, y: 0 }, 500, Phaser.Easing.Default, true, 0, -1, true);
                return sparkle;
            });
        });
        tool.events.onDragStop.add(function () {
            sparkles.forEach(function (sparkle) { return sparkle.destroy(); });
            sparkles = [];
            action(_this.game.input.x, _this.game.input.y);
            tool.x = initialX;
            tool.y = initialY;
        });
    };
    default_1.prototype.eatBean = function (right) {
        var _this = this;
        if (right) {
            this.beanRight.frame = 1;
        }
        else {
            this.beanLeft.frame = 1;
        }
        this.game.sound.play('effect_bean', 3);
        delay_1.delay(this.game, 250, function () {
            _this.beanLeft.frame = 1;
            _this.beanRight.frame = 1;
        });
        this.otherBeans.animations.add('shrink').play(8);
        var baseTween = this.game.add.tween(this.toolbar);
        var origTween = this.game.add.tween(this.toolOrig);
        var beanTween = this.game.add.tween(this.toolBean); // lel
        baseTween.to({ alpha: 1 }, 500);
        origTween.to({ alpha: 1 }, 500);
        beanTween.to({ alpha: 1 }, 500);
        baseTween.chain(origTween, beanTween);
        baseTween.start();
        this.setupTool(this.toolOrig, function () {
            if (_this.vines.frame < 1 && _this.beanRight.frame < 1) {
                return [[88, 45]];
            }
            else {
                return [];
            }
        }, function (x, y) {
            var vine = new Phaser.Rectangle(82, 40, 12, 12);
            if (_this.beanRight.frame < 1 && vine.contains(x, y)) {
                _this.game.sound.play('effect_snap');
                _this.music.fadeTrack(500, 'fun4');
                _this.vines.frame = 1;
                _this.game.add.tween(_this.toolVine).to({ alpha: 1 }, 500).start();
                _this.setupTool(_this.toolVine, function () { return [[88, 45]]; }, function (x, y) {
                    if (vine.contains(x, y)) {
                        fade_1.fadeOut(_this.game, 1000);
                        delay_1.delay(_this.game, 1000, function () {
                            _this.highlight.destroy();
                            music_1.startState(_this.game, 'island', _this.music, true);
                        });
                    }
                });
            }
        });
        this.setupTool(this.toolBean, function () {
            var left = _this.beanLeft.frame > 0 ? [[56, 63]] : [];
            var right = _this.beanRight.frame > 0 ? [[77, 63]] : [];
            return left.concat(right);
        }, function (x, y) {
            if (leftBean.contains(x, y)) {
                _this.game.sound.play('effect_grow' + _.sample(_.range(1, 7)));
                _this.beanLeft.frame = 0;
            }
            else if (rightBean.contains(x, y)) {
                _this.game.sound.play('effect_grow' + _.sample(_.range(1, 7)));
                _this.beanRight.frame = 0;
            }
        });
    };
    default_1.prototype.create = function () {
        var _this = this;
        this.game.input.keyboard.removeCallbacks();
        this.music.fadeTrack(500, 'fun3');
        this.music.fadeBadness(500, 0);
        this.game.add.image(0, 0, 'room_bg');
        this.vines = this.game.add.sprite(0, 0, 'room_vines');
        this.beanLeft = this.game.add.sprite(0, 0, 'room_beanleft');
        this.beanRight = this.game.add.sprite(0, 0, 'room_beanright');
        this.otherBeans = this.game.add.sprite(0, 0, 'room_otherbeans');
        this.game.add.image(0, 0, 'room_int');
        var plant = this.game.add.sprite(0, 0, 'room_plant');
        this.game.add.image(0, 0, 'room_pot');
        var blood = this.game.add.sprite(0, 0, 'room_blood');
        this.toolbar = this.game.add.image(0, 0, 'room_toolbar');
        this.toolOrig = this.game.add.image(1, 2, 'room_toolorig');
        this.toolBean = this.game.add.image(12, 1, 'room_toolbean');
        this.toolVine = this.game.add.image(22, 3, 'room_toolvine');
        this.game.input.keyboard.addCallbacks(this, function (event) {
            if (event.keyCode === pause_1.escapeCode) {
                _this.highlight.destroy();
                music_1.startState(_this.game, 'menu', _this.music, 'room');
            }
        });
        this.toolbar.alpha = 0;
        this.toolOrig.alpha = 0;
        this.toolBean.alpha = 0;
        this.toolVine.alpha = 0;
        var choseBean = false;
        var ateBean = false;
        this.highlight = new highlight_1.Highlight(this.game, function (x, y) {
            if (!ateBean) {
                if (leftBean.contains(x, y)) {
                    return _this.beanLeft;
                }
                else if (rightBean.contains(x, y)) {
                    return _this.beanRight;
                }
            }
            return null;
        });
        if (this.startFade) {
            fade_1.fadeIn(this.game, 1000);
        }
        var stopBlood = this.startBlood(blood);
        plant.animations.add('fall', [0, 1, 2]);
        plant.animations.play('fall', 2);
        delay_1.delay(this.game, 1000, function () {
            _this.game.sound.play('effect_thud', 5);
            _this.game.input.onDown.add(function () {
                if (!choseBean) {
                    if (leftBean.contains(_this.game.input.x, _this.game.input.y)) {
                        choseBean = true;
                        plant.animations.add('eat_left', [2, 8, 9, 10, 11, 2]);
                        plant.animations.play('eat_left', 2);
                        delay_1.delay(_this.game, 1000, function () {
                            ateBean = true;
                            _this.eatBean(false);
                        });
                    }
                    else if (rightBean.contains(_this.game.input.x, _this.game.input.y)) {
                        choseBean = true;
                        plant.animations.add('eat_right', [2, 3, 4, 5, 6, 7, 2]);
                        plant.animations.play('eat_right', 3);
                        delay_1.delay(_this.game, 1000, function () {
                            ateBean = true;
                            _this.eatBean(true);
                        });
                    }
                }
            });
        });
    };
    default_1.prototype.render = function () {
        this.highlight.render();
    };
    return default_1;
}(music_1.MusicalState));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;


});

require.alias("buffer/index.js", "buffer");
require.alias("process/browser.js", "process");process = require('process');require.register("___globals___", function(exports, require, module) {
  
});})();require('___globals___');

require('initialize');