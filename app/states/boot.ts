export default function(game: Phaser.Game) {
  return {
    preload() {
      game.load.audio('pot_music', [
        'Audio/Music/LD42Fun1.mp3',
        'Audio/Music/LD42Fun1.ogg'
      ]);

      game.load.image('background', 'Image/scene1/background1withplants.png');
      game.load.image('shelf', 'Image/scene1/shelf.png');
      game.load.image('pot_cross', 'Image/scene1/pottransparent.png');
      game.load.image('root', 'Image/scene1/root1.png');
      game.load.image('pot', 'Image/scene1/pot.png');
      game.load.image('plant', 'Image/scene1/plant1.png');
      game.load.image('highlight', 'Image/scene1/highlighting.png');
    },

    create() {
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      game.scale.setUserScale(7, 7);
      game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(game.canvas);

      game.camera.bounds = game.world.bounds;

      game.state.start('pot');
    }
  };
};
