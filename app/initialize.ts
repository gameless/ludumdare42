/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts"/>

import loadState from 'states/load';
import menuState from 'states/menu';
import potState from 'states/pot';
import roomState from 'states/room';
import planetState from 'states/planet';
import creditsState from 'states/credits';

const game = new Phaser.Game(
  { width: 160, height: 90, parent: 'parent', antialias: false }
);

game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('pot', potState);
game.state.add('room', roomState);
game.state.add('planet', planetState);
game.state.add('credits', creditsState);

game.state.start('load');
