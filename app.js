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
var pot_1 = require("./states/pot");
var room_1 = require("./states/room");
var game = new Phaser.Game({ width: 160, height: 90, parent: 'parent', antialias: false });
game.state.add('boot', boot_1.default(game));
game.state.add('pot', pot_1.default(game));
game.state.add('room', room_1.default(game));
game.state.start('boot');


});

require.register("states/boot.ts", function(exports, require, module) {
"use strict";
function default_1(game) {
    return {
        preload: function () {
            game.load.audio('pot_music', 'Audio/Music/LD42Fun1.ogg');
            game.load.audio('room_music', 'Audio/Music/LD42Fun2.ogg');
            game.load.image('pot_bg', 'Image/scene1/background1withplants.png');
            game.load.image('pot_shelf', 'Image/scene1/shelf.png');
            game.load.image('pot_cross', 'Image/scene1/pottransparent.png');
            game.load.image('pot_root', 'Image/scene1/root1.png');
            game.load.image('pot_pot', 'Image/scene1/pot.png'); // lel
            game.load.image('pot_plant', 'Image/scene1/plant1.png');
            game.load.image('pot_highlight', 'Image/scene1/highlighting.png');
            game.load.image('room_bg', 'Image/scene2/background2.png');
            game.load.image('room_vines', 'Image/scene2/vines1.png');
            game.load.image('room_beans', 'Image/scene2/beans1.png');
            game.load.image('room_int', 'Image/scene2/wallinterior.png');
            game.load.image('room_pot', 'Image/scene2/brokenpotshards.png');
            game.load.image('room_plant', 'Image/scene2/plantfallen.png');
            game.load.image('room_ext', 'Image/scene2/wallexterior.png');
        },
        create: function () {
            game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
            game.scale.setUserScale(7, 7);
            game.renderer.renderSession.roundPixels = true;
            Phaser.Canvas.setImageRenderingCrisp(game.canvas);
            game.camera.bounds = game.world.bounds;
            var musics = {};
            musics['pot'] = game.sound.play('pot_music', 1, true);
            musics['room'] = game.sound.play('room_music', 0, true);
            game.state.start('pot', true, false, musics);
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
    var pot;
    var fade;
    var hover;
    var hovering = false;
    return {
        init: function (theMusics) {
            musics = theMusics;
        },
        create: function () {
            game.add.image(0, 0, 'pot_bg');
            game.add.image(0, 0, 'pot_shelf');
            game.add.image(0, 0, 'pot_cross');
            game.add.image(0, 0, 'pot_root');
            pot = game.add.image(0, 0, 'pot_pot');
            game.add.image(0, 0, 'pot_plant');
            game.add.image(0, 0, 'pot_highlight');
            hover = new Phaser.Signal();
            hover.add(function () {
                var newAlpha = hovering ? 0 : 1;
                var time = Math.abs(newAlpha - pot.alpha) * 250;
                if (fade) {
                    fade.stop();
                }
                fade = game.add.tween(pot);
                fade.to({ alpha: newAlpha }, time, Phaser.Easing.Default, true);
            });
            game.input.onDown.add(function () {
                if (hovering) {
                    game.state.start('room', true, false, musics);
                }
            });
        },
        render: function () {
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
            var mouseX = game.input.x;
            var mouseY = game.input.y;
            var hoveringNow = closeToPot.contains(mouseX, mouseY);
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

require.register("states/room.ts", function(exports, require, module) {
"use strict";
function default_1(game) {
    var musics;
    var wall;
    var fade;
    var hover;
    var hovering = false;
    return {
        init: function (theMusics) {
            musics = theMusics;
        },
        create: function () {
            musics['pot'].fadeTo(500, 0);
            musics['room'].fadeTo(500, 1);
            game.add.image(0, 0, 'room_bg');
            game.add.image(0, 0, 'room_vines');
            game.add.image(0, 0, 'room_beans');
            game.add.image(0, 0, 'room_int');
            game.add.image(0, 0, 'room_pot');
            game.add.image(0, 0, 'room_plant');
            wall = game.add.image(0, 0, 'room_ext');
            hover = new Phaser.Signal();
            hover.add(function () {
                var newAlpha = hovering ? 0 : 1;
                var time = Math.abs(newAlpha - wall.alpha) * 250;
                if (fade) {
                    fade.stop();
                }
                fade = game.add.tween(wall);
                fade.to({ alpha: newAlpha }, time, Phaser.Easing.Default, true);
            });
        },
        render: function () {
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