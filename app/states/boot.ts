export default function(game: Phaser.Game) {
  return {
    preload() {
      game.load.audio('music1', 'Audio/Music/Fun1.ogg');
      game.load.audio('music2', 'Audio/Music/Fun2.ogg');
      game.load.audio('music3', 'Audio/Music/Fun3.ogg');

      game.load.audio('root1', 'Audio/SoundEffects/RootGrow1.ogg');
      game.load.audio('root2', 'Audio/SoundEffects/RootGrow2.ogg');
      game.load.audio('root3', 'Audio/SoundEffects/RootGrow3.ogg');
      game.load.audio('root4', 'Audio/SoundEffects/RootGrow4.ogg');
      game.load.audio('root5', 'Audio/SoundEffects/RootGrow5.ogg');
      game.load.audio('root6', 'Audio/SoundEffects/RootGrow6.ogg');
      game.load.audio('root7', 'Audio/SoundEffects/RootGrow7.ogg');
      game.load.audio('shatter', 'Audio/SoundEffects/PotShattering.ogg');

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

      game.load.audio('thud', 'Audio/SoundEffects/Thud.ogg');

      game.load.image('room_bg', 'Image/scene2/background2.png');
      game.load.image('room_int', 'Image/scene2/wallinterior.png');
      game.load.image('room_pot', 'Image/scene2/brokenpotshards.png');
      game.load.image('room_ext', 'Image/scene2/wallexterior.png');

      game.load.spritesheet('room_vines', 'Image/scene2/vine spritesheet.png', 160, 90);
      game.load.spritesheet('room_beans', 'Image/scene2/bean spritesheet.png', 160, 90);
      game.load.spritesheet('room_plant', 'Image/scene2/plantfall spritesheet.png', 160, 90);
    },

    create() {
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      game.scale.setUserScale(7, 7);
      game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(game.canvas);

      game.camera.bounds = game.world.bounds;

      const musics: { [music: string]: Phaser.Sound } = {};
      musics['1'] = game.sound.play('music1', 1, true);
      musics['2'] = game.sound.play('music2', 0, true);
      musics['3'] = game.sound.play('music3', 0, true);

      game.state.start('pot', true, false, musics);
    }
  };
};
