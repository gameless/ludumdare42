import * as _ from 'lodash';

import { Music, startState } from '../music';

function usePixelGraphics(game: Phaser.Game, pixelsPerPixel: number) {
  game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
  game.scale.setUserScale(pixelsPerPixel, pixelsPerPixel);
  game.renderer.renderSession.roundPixels = true;
  Phaser.Canvas.setImageRenderingCrisp(game.canvas);
}

function addLoadIndicator(game: Phaser.Game) {
  const loadingEnclosure = game.add.graphics();
  loadingEnclosure.lineStyle(1, 0xffffff, 1);
  loadingEnclosure.drawRect(38, 42, 83, 5);

  const loadingTexture = game.make.bitmapData(80, 2);
  loadingTexture.fill(0xff, 0xff, 0xff);
  game.load.setPreloadSprite(game.add.sprite(40, 44, loadingTexture));
}

function loadAudio(game: Phaser.Game, key: string, filename: string) {
  game.load.audio(key, [
    'Audio/OggFiles/' + filename + '.ogg',
    'Audio/WavFiles/' + filename + '.wav'
  ]);
}

const sounds = [
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

function loadSounds(game: Phaser.Game) {
  sounds.forEach(([key, filename]) => loadAudio(game, key, filename));
}

function soundsReady(game: Phaser.Game) {
  return sounds.every(([key, _]) => game.cache.isSoundDecoded(key));
}

const tracks = ['title', 'fun1', 'fun2', 'fun3', 'fun4', 'mid1', 'end'];

function sceneImageLoader(prefix: string, path: string) {
  return (game: Phaser.Game, key: string, filename: string) => {
    game.load.image(
      prefix + '_' + key, 'Image/' + path + '/' + filename + '.png'
    );
  };
}

function sceneSheetLoader(prefix: string, path: string) {
  return (game: Phaser.Game, key: string, filename: string) => {
    game.load.spritesheet(
      prefix + '_' + key, 'Image/' + path + '/' + filename + '.png', 160, 90
    );
  };
}

const loadMenuImage = sceneImageLoader('menu', 'menu');

function loadMenuImages(game: Phaser.Game) {
  loadMenuImage(game, 'background', 'startmenubackground');
  loadMenuImage(game, 'start', 'startmenu');
  loadMenuImage(game, 'resume', 'resumenu');
}

const loadPotImage = sceneImageLoader('pot', 'scene1');
const loadPotSheet = sceneSheetLoader('pot', 'scene1');

function loadPotImages(game: Phaser.Game) {
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

  _.range(1, 7).forEach(shard => loadPotImage(
    game, 'backshard' + shard,
    'potbreaking shards/backshard' + shard + 'start'
  ));
  loadPotImage(game, 'float', 'potbreaking shards/plantanddirt');
  _.range(1, 7).forEach(shard => loadPotImage(
    game, 'frontshard' + shard,
    'potbreaking shards/frontshard' + shard + 'start'
  ));

  loadPotImage(game, 'mess', 'potmess(frame1)');
  loadPotImage(game, 'fall', 'plantfall(frame1)');
}

const loadRoomImage = sceneImageLoader('room', 'scene2');
const loadRoomSheet = sceneSheetLoader('room', 'scene2');

function loadRoomImages(game: Phaser.Game) {
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

const loadIslandImage = sceneImageLoader('island', 'scene3');
const loadIslandSheet = sceneImageLoader('island', 'scene3');

function loadIslandImages(game: Phaser.Game) {
  loadIslandImage(game, 'bg', 'bg3');
  loadIslandSheet(game, 'plant', 'plant spritesheet');
  loadIslandSheet(game, 'seaweed', 'seaweed spritesheet');
  loadIslandImage(game, 'trees', 'trees');
}

const loadPlanetSheet = sceneSheetLoader('planet', 'scenefinal');

function loadPlanetImages(game: Phaser.Game) {
  loadPlanetSheet(game, 'animation', 'scenefinal spritesheet');
}

function loadCreditsImages(game: Phaser.Game) {
  game.load.image('credits', 'Image/credits.png');
}

export default function(game: Phaser.Game) {
  return {
    preload() {
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

    update() {
      if (soundsReady(game)) {
        startState(game, 'menu', new Music(game, tracks));
      }
    }
  };
};
