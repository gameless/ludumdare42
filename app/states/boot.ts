export default function(game: Phaser.Game) {
  return {
    preload() {
      game.load.audio('pot_music', 'Audio/Music/LD42Fun1.ogg');
      game.load.audio('room_music', 'Audio/Music/LD42Fun2.ogg');

      game.load.audio('root1', 'Audio/SoundEffects/LD42RootGrow1.ogg');
      game.load.audio('root2', 'Audio/SoundEffects/LD42RootGrow2.ogg');
      game.load.audio('root3', 'Audio/SoundEffects/LD42RootGrow3.ogg');
      game.load.audio('root4', 'Audio/SoundEffects/LD42RootGrow4.ogg');
      game.load.audio('root5', 'Audio/SoundEffects/LD42RootGrow5.ogg');
      game.load.audio('root6', 'Audio/SoundEffects/LD42RootGrow6.ogg');
      game.load.audio('root7', 'Audio/SoundEffects/LD42RootGrow7.ogg');

      game.load.image('pot_bg', 'Image/scene1/background1withplants.png');
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

      game.load.spritesheet('pot_pot', 'Image/scene1/potbreaking spritesheet.png', 160, 90);
      game.load.spritesheet('pot_rootleft', 'Image/scene1/rootleft spritesheet.png', 160, 90);
      game.load.spritesheet('pot_rootright', 'Image/scene1/rootright spritesheet.png', 160, 90);

      game.load.image('room_bg', 'Image/scene2/background2.png');
      game.load.image('room_vines', 'Image/scene2/vines1.png');
      game.load.image('room_beans', 'Image/scene2/beans1.png');
      game.load.image('room_int', 'Image/scene2/wallinterior.png');
      game.load.image('room_pot', 'Image/scene2/brokenpotshards.png');
      game.load.image('room_plant', 'Image/scene2/plantfallen.png');
      game.load.image('room_ext', 'Image/scene2/wallexterior.png');
    },

    create() {
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      game.scale.setUserScale(7, 7);
      game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(game.canvas);

      game.camera.bounds = game.world.bounds;

      const musics: { [music: string]: Phaser.Sound } = {};
      musics['pot'] = game.sound.play('pot_music', 1, true);
      musics['room'] = game.sound.play('room_music', 0, true);

      game.state.start('pot', true, false, musics);
    }
  };
};
