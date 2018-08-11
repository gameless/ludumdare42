/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts"/>

import bootState from './states/boot';
import potState from './states/pot';

const game = new Phaser.Game();

game.state.add('boot', bootState(game));
game.state.add('pot', potState(game));

game.state.start('boot');
