/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts"/>

import loadState from './states/load';
import MenuState from './states/menu';
import PotState from './states/pot';
import RoomState from './states/room';
import IslandState from './states/island';
import PlanetState from './states/planet';
import CreditsState from './states/credits';

const game = new Phaser.Game(
  { width: 160, height: 90, parent: 'parent', antialias: false }
);

game.state.add('load', loadState);
game.state.add('menu', MenuState);
game.state.add('pot', PotState);
game.state.add('room', RoomState);
game.state.add('island', IslandState);
game.state.add('planet', PlanetState);
game.state.add('credits', CreditsState);

game.state.start('load');
