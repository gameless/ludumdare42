/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts"/>

import bootState from './states/boot';
import menuState from './states/menu';
import potState from './states/pot';
import roomState from './states/room';
import planetState from './states/planet';
import creditsState from './states/credits';

const game = new Phaser.Game(
  { width: 160, height: 90, parent: 'parent', antialias: false }
);

game.state.add('boot', bootState(game));
game.state.add('menu', menuState(game));
game.state.add('pot', potState(game));
game.state.add('room', roomState(game));
game.state.add('planet', planetState(game));
game.state.add('credits', creditsState(game));

game.state.start('boot');
