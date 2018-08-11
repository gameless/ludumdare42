export default function(game: Phaser.Game) {
  return {
    preload() {
      game.load.audio('pot_music', [
        'Audio/Music/LD42TitleMusic.mp3',
        'Audio/Music/LD42TitleMusic.ogg'
      ]);
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
