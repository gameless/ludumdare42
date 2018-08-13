const PIXELS_PER_PIXEL = 7;

function loadAudio(game: Phaser.Game, key: string, filename: string) {
  game.load.audio(key, [
    'Audio/OggFiles/' + filename + '.ogg',
    'Audio/WavFiles/' + filename + '.wav'
  ]);
}

export default function(game: Phaser.Game) {
  return {
    preload() {
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      game.scale.setUserScale(PIXELS_PER_PIXEL, PIXELS_PER_PIXEL);
      game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(game.canvas);

      const loadingTexture = game.make.bitmapData(80, 2);
      loadingTexture.fill(0xff, 0xff, 0xff);
      game.load.setPreloadSprite(game.add.sprite(40, 44, loadingTexture));

      loadAudio(game, 'music0', 'Music/TitleMusic');
      loadAudio(game, 'music1', 'Music/Fun1');
      loadAudio(game, 'music2', 'Music/Fun2');
      loadAudio(game, 'music3', 'Music/Fun3');
      loadAudio(game, 'music4', 'Music/Fun4');
      loadAudio(game, 'music5', 'Music/Fun1Bitcrushed');

      loadAudio(game, 'end', 'Music/End');

      game.load.image('menu_background', 'Image/menu/startmenubackground.png');
      game.load.image('menu_start', 'Image/menu/startmenu.png');
      game.load.image('menu_resume', 'Image/menu/resumenu.png');

      game.load.image('toolbar', 'Image/scene2/toolbar.png');
      game.load.image('toolbar_orig', 'Image/scene2/planticon (1,2).png');
      game.load.image('toolbar_bean', 'Image/scene2/beanicon (12,1).png');
      game.load.image('toolbar_vine', 'Image/scene2/vineicon (22,3).png');

      loadAudio(game, 'root1', 'SoundEffects/RootGrow1');
      loadAudio(game, 'root2', 'SoundEffects/RootGrow2');
      loadAudio(game, 'root3', 'SoundEffects/RootGrow3');
      loadAudio(game, 'root4', 'SoundEffects/RootGrow4');
      loadAudio(game, 'root5', 'SoundEffects/RootGrow5');
      loadAudio(game, 'root6', 'SoundEffects/RootGrow6');
      loadAudio(game, 'root7', 'SoundEffects/RootGrow7');
      loadAudio(game, 'shatter', 'SoundEffects/PotShattering');

      game.load.image('pot_bg', 'Image/scene1/blurredbg.png');
      game.load.image('pot_shelf', 'Image/scene1/shelf.png');
      game.load.image('pot_shelf_hl', 'Image/scene1/shelfhighlighting.png');
      game.load.image('pot_cross', 'Image/scene1/pottransparent.png');
      game.load.image('pot_root', 'Image/scene1/root1.png');
      game.load.image('pot_pot_hl', 'Image/scene1/pothighlighting.png');

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

      game.load.spritesheet('pot_plant', 'Image/scene1/plantwilt spritesheet.png', 160, 90);
      game.load.spritesheet('pot_blood', 'Image/scene1/plantblood spritesheet.png', 160, 90);
      game.load.spritesheet('pot_pot', 'Image/scene1/potbreaking spritesheet.png', 160, 90);
      game.load.spritesheet('pot_rootleft', 'Image/scene1/rootleft spritesheet.png', 160, 90);
      game.load.spritesheet('pot_rootright', 'Image/scene1/rootright spritesheet.png', 160, 90);

      loadAudio(game, 'thud', 'SoundEffects/Thud');
      loadAudio(game, 'bean', 'SoundEffects/BeanPlant');
      loadAudio(game, 'grow1', 'SoundEffects/Grow1');
      loadAudio(game, 'grow2', 'SoundEffects/Grow2');
      loadAudio(game, 'grow3', 'SoundEffects/Grow3');
      loadAudio(game, 'grow4', 'SoundEffects/Grow4');
      loadAudio(game, 'grow5', 'SoundEffects/Grow5');
      loadAudio(game, 'grow6', 'SoundEffects/Grow6');
      loadAudio(game, 'snap', 'SoundEffects/VineSnap');

      game.load.image('room_bg', 'Image/scene2/background2.png');
      game.load.image('room_int', 'Image/scene2/wallinterior.png');
      game.load.image('room_pot', 'Image/scene2/brokenpotshards.png');

      game.load.spritesheet('room_vines', 'Image/scene2/vine spritesheet.png', 160, 90);
      game.load.spritesheet('room_beanleft', 'Image/scene2/beanleft spritesheet.png', 160, 90);
      game.load.spritesheet('room_beanright', 'Image/scene2/beanright spritesheet.png', 160, 90);
      game.load.spritesheet('room_otherbeans', 'Image/scene2/otherbeans spritesheet.png', 160, 90);
      game.load.spritesheet('room_plant', 'Image/scene2/plant spritesheet.png', 160, 90);

      game.load.spritesheet('planet', 'Image/scenefinal/scenefinal spritesheet.png', 160, 90);

      game.load.image('credits', 'Image/credits.png');
    },

    update() {
      const ready = [0, 1, 2, 3, 4, 5].every(n => {
        return game.cache.isSoundDecoded('music' + n);
      });
      if (ready) {
        const musics: Phaser.Sound[] = [];
        musics.push(game.sound.play('music0', 1, true));
        musics.push(game.sound.play('music1', 0, true));
        musics.push(game.sound.play('music2', 0, true));
        musics.push(game.sound.play('music3', 0, true));
        musics.push(game.sound.play('music4', 0, true));
        musics.push(game.sound.play('music5', 0, true));
        game.state.start('menu', true, false, musics);
      }
    }
  };
};
